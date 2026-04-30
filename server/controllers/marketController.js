import axios from "axios";

const priceCache = new Map();

const CACHE_TTL = {
  crypto: 1000,   // 1 second
  other: 15000,   // 15 seconds
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

    if (cached && now - cached.updatedAt < meta.ttl) {
      return res.json({
        symbol: meta.providerSymbol,
        price: cached.price,
        updatedAt: cached.updatedAt,
        source: cached.source,
      });
    }

    const price = await fetchRemotePrice(meta);

    const payload = {
      price,
      updatedAt: now,
      source: meta.provider,
    };

    priceCache.set(meta.cacheKey, payload);

    return res.json({
      symbol: meta.providerSymbol,
      ...payload,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);

    return res.status(500).json({
      message: "Live price error",
    });
  }
};