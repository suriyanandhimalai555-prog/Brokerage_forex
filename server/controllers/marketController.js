import axios from "axios";
import { processPendingOrdersBySymbol } from "./orderController.js";

const priceCache = new Map();

const CACHE_TTL = {
  crypto: 1000,
  other: 1000,
};

const normalizeSymbol = (symbol) => {
  const s = String(symbol || "")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "");

  if (!s) return null;

  // Binance style: BINANCE:BTCUSDT, BTCUSDT, BTC/USDT
  if (
    s.startsWith("BINANCE:") ||
    /^[A-Z0-9]+\/USDT$/.test(s) ||
    /^[A-Z0-9]+USDT$/.test(s)
  ) {
    const providerSymbol = s
      .replace(/^BINANCE:/, "")
      .replace("/", "");

    return {
      provider: "binance",
      cacheKey: `BINANCE:${providerSymbol}`,
      providerSymbol,
      ttl: CACHE_TTL.crypto,
    };
  }

  // TwelveData / forex style: OANDA:EURUSD, TVC:EURUSD, EURUSD, EUR/USD
  if (
    s.startsWith("OANDA:") ||
    s.startsWith("TVC:") ||
    /^[A-Z]{6}$/.test(s) ||
    /^[A-Z]{3}\/[A-Z]{3}$/.test(s)
  ) {
    let pair = s
      .replace(/^OANDA:/, "")
      .replace(/^TVC:/, "")
      .replace("/", "");

    if (!/^[A-Z]{6}$/.test(pair)) {
      return null;
    }

    return {
      provider: "twelvedata",
      cacheKey: `TVC:${pair}`,
      providerSymbol: `${pair.slice(0, 3)}/${pair.slice(3)}`,
      ttl: CACHE_TTL.other,
    };
  }

  return null;
};

const cleanDisplaySymbol = (symbol) => {
  const raw = String(symbol || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^OANDA:/, "")
    .replace(/^TVC:/, "")
    .replace(/^BINANCE:/, "");

  if (raw.includes("/")) return raw;
  if (/^[A-Z]{6}$/.test(raw)) return `${raw.slice(0, 3)}/${raw.slice(3)}`;
  if (/^[A-Z0-9]+USDT$/.test(raw)) return `${raw.slice(0, -4)}/USDT`;
  if (/^[A-Z0-9]+USD$/.test(raw) && raw.length > 3) return `${raw.slice(0, -3)}/USD`;
  return raw;
};

const fetchRemotePrice = async (meta) => {
  // =========================
  // BINANCE
  // =========================
  if (meta.provider === "binance") {
    try {
      const response = await axios.get(
        "https://data-api.binance.vision/api/v3/ticker/price",
        {
          params: {
            symbol: meta.providerSymbol,
          },
          timeout: 5000,
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      console.log("BINANCE RESPONSE:", response.data);

      const price = parseFloat(response.data?.price);

      if (Number.isNaN(price)) {
        throw new Error("Invalid Binance price");
      }

      return price;
    } catch (err) {
      console.error(
        "BINANCE ERROR:",
        err?.response?.data || err.message
      );

      throw new Error(
        err?.response?.data?.msg ||
          "Failed to fetch Binance live price"
      );
    }
  }

  // =========================
  // TWELVEDATA
  // =========================
  if (!process.env.TWELVE_API_KEY) {
    throw new Error("TWELVE_API_KEY is missing");
  }

  try {
    const response = await axios.get(
      "https://api.twelvedata.com/price",
      {
        params: {
          symbol: meta.providerSymbol,
          apikey: process.env.TWELVE_API_KEY,
        },
        timeout: 5000,
      }
    );

    console.log("TWELVEDATA RESPONSE:", response.data);

    const price = parseFloat(response.data?.price);

    if (Number.isNaN(price)) {
      throw new Error(
        response.data?.message ||
          response.data?.status ||
          "Invalid TwelveData price"
      );
    }

    return price;
  } catch (err) {
    console.error(
      "TWELVEDATA ERROR:",
      err?.response?.data || err.message
    );

    throw new Error(
      err?.response?.data?.message ||
        "Failed to fetch TwelveData price"
    );
  }
};

export const getLivePrice = async (req, res) => {
  try {
    const encoded = req.params.symbol;

const symbol = Buffer.from(encoded, "base64").toString("utf-8");

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const meta = normalizeSymbol(symbol);

    if (!meta) {
      return res.status(400).json({
        message: `Unsupported symbol: ${symbol}`,
      });
    }

    const now = Date.now();
    const cached = priceCache.get(meta.cacheKey);

    let price;

    if (cached && now - cached.updatedAt < meta.ttl) {
      price = cached.price;
    } else {
      price = await fetchRemotePrice(meta);
      priceCache.set(meta.cacheKey, {
        price,
        updatedAt: now,
        source: meta.provider,
      });
    }

    await processPendingOrdersBySymbol(cleanDisplaySymbol(symbol), price);

    return res.json({
      symbol: cleanDisplaySymbol(symbol),
      price,
      updatedAt: now,
      source: meta.provider,
    });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({
      message: err.message || "Live price error",
    });
  }
};