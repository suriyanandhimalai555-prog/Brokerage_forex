import axios from "axios";
import { processPendingOrdersBySymbol } from "./orderController.js";

const priceCache = new Map();

const CACHE_TTL = {
  crypto: 1000,
  forex: 1000,
};

const normalizeSymbol = (symbol) => {
  const s = String(symbol || "")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "");

  if (!s) return null;

  // =========================
  // BINANCE CRYPTO
  // =========================
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

  // =========================
  // FOREX + METALS
  // =========================
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
      provider:
        pair.startsWith("XAU") ||
        pair.startsWith("XAG") ||
        pair.startsWith("XPT")
          ? "metal"
          : "forexrate",

      cacheKey: `FOREX:${pair}`,

      providerSymbol: pair,

      ttl: CACHE_TTL.forex,
    };
  }

  return null;
};

const cleanDisplaySymbol = (symbol) => {
  return String(symbol || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^OANDA:/, "")
    .replace(/^TVC:/, "")
    .replace(/^BINANCE:/, "")
    .replace("/", "");
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

      console.log(
        "BINANCE RESPONSE:",
        response.data
      );

      const price = parseFloat(
        response.data?.price
      );

      if (Number.isNaN(price)) {
        throw new Error(
          "Invalid Binance price"
        );
      }

      return price;

    } catch (err) {

      console.error(
        "BINANCE ERROR:",
        err?.response?.data ||
          err.message
      );

      throw new Error(
        err?.response?.data?.msg ||
          "Failed to fetch Binance price"
      );
    }
  }

 // =========================
// METALS (YAHOO FINANCE)
// =========================
if (meta.provider === "metal") {

  try {

    const metalMap = {
      XAUUSD: "GC=F",
      XAGUSD: "SI=F",
      XPTUSD: "PL=F",
    };

    const yahooSymbol =
      metalMap[meta.providerSymbol];

    if (!yahooSymbol) {
      throw new Error(
        "Unsupported metal symbol"
      );
    }

    const response = await axios.get(
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
        yahooSymbol,
      {
        timeout: 5000,
      }
    );

    console.log(
      "YAHOO METAL RESPONSE:",
      response.data
    );

    const result =
      response.data?.chart?.result?.[0];

    const price =
      result?.meta?.regularMarketPrice;

    if (
      Number.isNaN(Number(price)) ||
      !price
    ) {
      throw new Error(
        "Invalid metal price"
      );
    }

    return Number(price);

  } catch (err) {

    console.error(
      "YAHOO METAL ERROR:",
      err?.response?.data ||
        err.message
    );

    throw new Error(
      "Failed to fetch metal price"
    );
  }
}

  // =========================
  // FOREXRATE API
  // =========================
  if (!process.env.FOREXRATE_API_KEY) {
    throw new Error(
      "FOREXRATE_API_KEY is missing"
    );
  }

  try {

    const response = await axios.get(
      "https://api.forexrateapi.com/v1/latest",
      {
        params: {
          api_key:
            process.env.FOREXRATE_API_KEY,

          base:
            meta.providerSymbol.slice(0, 3),

          currencies:
            meta.providerSymbol.slice(3),
        },

        timeout: 5000,
      }
    );

    console.log(
      "FOREXRATE RESPONSE:",
      response.data
    );

    const quoteCurrency =
      meta.providerSymbol.slice(3);

    const price = parseFloat(
      response.data?.rates?.[quoteCurrency]
    );

    if (Number.isNaN(price)) {
      throw new Error(
        "Invalid ForexRate price"
      );
    }

    return price;

  } catch (err) {

    console.error(
      "FOREXRATE ERROR:",
      err?.response?.data ||
        err.message
    );

    throw new Error(
      err?.response?.data?.message ||
        "Failed to fetch ForexRate price"
    );
  }
};

export const getLivePrice = async (
  req,
  res
) => {
  try {

    const encoded = req.params.symbol;

    const symbol = Buffer.from(
      encoded,
      "base64"
    ).toString("utf-8");

    if (!symbol) {
      return res.status(400).json({
        message: "Symbol is required",
      });
    }

    const meta = normalizeSymbol(symbol);

    if (!meta) {
      return res.status(400).json({
        message: `Unsupported symbol: ${symbol}`,
      });
    }

    const now = Date.now();

    const cached = priceCache.get(
      meta.cacheKey
    );

    let price;

    if (
      cached &&
      now - cached.updatedAt < meta.ttl
    ) {
      price = cached.price;
    } else {

      price = await fetchRemotePrice(
        meta
      );

      priceCache.set(meta.cacheKey, {
        price,
        updatedAt: now,
        source: meta.provider,
      });
    }

    await processPendingOrdersBySymbol(
      cleanDisplaySymbol(symbol),
      price
    );

    return res.json({
      symbol:
        cleanDisplaySymbol(symbol),

      rawSymbol: symbol,

      normalizedSymbol:
        cleanDisplaySymbol(symbol),

      price,

      updatedAt: now,

      source: meta.provider,
    });

  } catch (err) {

    console.error(
      err?.response?.data ||
        err.message
    );

    return res.status(500).json({
      message:
        err.message ||
        "Live price error",
    });
  }
};