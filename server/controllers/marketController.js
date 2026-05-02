import axios from "axios";
import { processPendingOrdersBySymbol } from "./orderController.js";

const priceCache = new Map();

const CACHE_TTL = {
  crypto: 1000,
  other: 1000,
};

const normalizeSymbol = (symbol) => {
  const s = String(symbol || "").toUpperCase();

  if (s.includes("BINANCE")) {
    return {
      provider: "binance",
      cacheKey: s,
      providerSymbol: s.replace("BINANCE:", ""),
      ttl: CACHE_TTL.crypto,
    };
  }

  if (s.includes("OANDA") || s.includes("TVC")) {
    let pair = s.replace("OANDA:", "").replace("TVC:", "");
    if (!pair.includes("/")) {
      pair = pair.slice(0, 3) + "/" + pair.slice(3);
    }

    return {
      provider: "twelvedata",
      cacheKey: s,
      providerSymbol: pair,
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
  if (meta.provider === "binance") {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${meta.providerSymbol}`
    );

    const price = Number(response.data.price);
    if (!price) throw new Error("Invalid Binance price");
    return price;
  }

  const response = await axios.get(
    `https://api.twelvedata.com/price?symbol=${encodeURIComponent(
      meta.providerSymbol
    )}&apikey=${process.env.TWELVE_API_KEY}`
  );

  const price = Number(response.data?.price);

  if (!price) {
    throw new Error(
      response.data?.message || response.data?.code || "Invalid TwelveData price"
    );
  }

  return price;
};

export const getLivePrice = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const meta = normalizeSymbol(symbol);

    if (!meta) {
      return res.status(400).json({ message: "Unsupported symbol" });
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

    await processPendingOrdersBySymbol(symbol, price);

    return res.json({
      symbol: cleanDisplaySymbol(meta.providerSymbol),
      price,
      updatedAt: now,
      source: meta.provider,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({
      message: "Live price error",
    });
  }
};