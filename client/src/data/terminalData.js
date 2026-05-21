export const TOP_TABS = [
  {
    label: "XAU/USD",
    symbol: "XAUUSD",
    tvSymbol: "XAUUSD",
    icon: "🪙",
  },

  {
    label: "EUR/USD",
    symbol: "EURUSD",
    tvSymbol: "EURUSD",
    icon: "EU",
  },

  {
    label: "BTC",
    symbol: "BINANCE:BTCUSDT",
    tvSymbol: "BINANCE:BTCUSDT",
    icon: "🟠",
  },
];

export const DEFAULT_MARKET = {
  label: "Gold vs US Dollar",
  symbol: "XAU/USD",
  tvSymbol: "XAUUSD",
  marketType: "metal",
  contractSize: 100,
  spread: "High volatility",
};

export const MARKET_SECTIONS = [
  {
    title: "Major Forex",

    marketType: "forex",

    spread: "0.5–1.5 pips",

    contractSize: 100000,

    items: [
      { label: "EUR/USD", tvSymbol: "EURUSD" },
      { label: "GBP/USD", tvSymbol: "GBPUSD" },
      { label: "USD/JPY", tvSymbol: "USDJPY" },
      { label: "USD/CHF", tvSymbol: "USDCHF" },
      { label: "AUD/USD", tvSymbol: "AUDUSD" },
      { label: "USD/CAD", tvSymbol: "USDCAD" },
      { label: "NZD/USD", tvSymbol: "NZDUSD" },
    ],
  },

  {
    title: "Minor Pairs",

    marketType: "forex",

    spread: "1.5–3 pips",

    contractSize: 100000,

    items: [
      { label: "EUR/GBP", tvSymbol: "EURGBP" },
      { label: "EUR/AUD", tvSymbol: "EURAUD" },
      { label: "EUR/JPY", tvSymbol: "EURJPY" },
      { label: "EUR/CHF", tvSymbol: "EURCHF" },
      { label: "EUR/CAD", tvSymbol: "EURCAD" },
      { label: "EUR/NZD", tvSymbol: "EURNZD" },
      { label: "GBP/JPY", tvSymbol: "GBPJPY" },
      { label: "GBP/AUD", tvSymbol: "GBPAUD" },
      { label: "GBP/CHF", tvSymbol: "GBPCHF" },
      { label: "GBP/CAD", tvSymbol: "GBPCAD" },
      { label: "GBP/NZD", tvSymbol: "GBPNZD" },
      { label: "AUD/JPY", tvSymbol: "AUDJPY" },
      { label: "AUD/NZD", tvSymbol: "AUDNZD" },
      { label: "AUD/CAD", tvSymbol: "AUDCAD" },
      { label: "CAD/JPY", tvSymbol: "CADJPY" },
      { label: "CHF/JPY", tvSymbol: "CHFJPY" },
      { label: "NZD/JPY", tvSymbol: "NZDJPY" },
    ],
  },

  {
    title: "Exotic Pairs",

    marketType: "forex",

    spread: "5–20+ pips",

    contractSize: 100000,

    items: [
      { label: "USD/INR", tvSymbol: "USDINR" },
      { label: "USD/TRY", tvSymbol: "USDTRY" },
      { label: "USD/ZAR", tvSymbol: "USDZAR" },
      { label: "USD/MXN", tvSymbol: "USDMXN" },
      { label: "USD/THB", tvSymbol: "USDTHB" },
      { label: "USD/SGD", tvSymbol: "USDSGD" },
      { label: "USD/HKD", tvSymbol: "USDHKD" },
      { label: "USD/AED", tvSymbol: "USDAED" },
    ],
  },

  {
    title: "Metals & Commodities",

    marketType: "metal",

    spread: "High volatility",

    contractSize: 100,

    items: [
      { label: "XAU/USD", tvSymbol: "XAUUSD" },
      { label: "XAG/USD", tvSymbol: "XAGUSD" },
      { label: "XPT/USD", tvSymbol: "XPTUSD" },
      { label: "WTI Crude Oil", tvSymbol: "TVC:USOIL" },
      { label: "Brent Crude Oil", tvSymbol: "TVC:UKOIL" },
      { label: "Natural Gas", tvSymbol: "TVC:NATGAS" },
    ],
  },

  {
    title: "Index CFDs",

    marketType: "index",

    spread: "Variable",

    contractSize: 1,

    items: [
      { label: "US30", tvSymbol: "FOREXCOM:DJI" },
      { label: "NAS100", tvSymbol: "NASDAQ:NDX" },
      { label: "SPX500", tvSymbol: "SP:SPX" },
      { label: "DAX40", tvSymbol: "XETR:DAX" },
      { label: "FTSE100", tvSymbol: "FX:UKX" },
    ],
  },

  {
    title: "Crypto",

    marketType: "crypto",

    spread: "Exchange-based",

    contractSize: 1,

    items: [
      {
        label: "BTC/USDT",
        tvSymbol: "BINANCE:BTCUSDT",
      },

      {
        label: "ETH/USDT",
        tvSymbol: "BINANCE:ETHUSDT",
      },

      {
        label: "BNB/USDT",
        tvSymbol: "BINANCE:BNBUSDT",
      },

      {
        label: "SOL/USDT",
        tvSymbol: "BINANCE:SOLUSDT",
      },

      {
        label: "XRP/USDT",
        tvSymbol: "BINANCE:XRPUSDT",
      },
    ],
  },
];

/* =========================================
   AUTO WATCHLIST FROM ALL MARKET SECTIONS
========================================= */

export const WATCHLIST = MARKET_SECTIONS.flatMap(
  (section) =>
    section.items.map((item) => ({
      symbol: item.label,

      tvSymbol: item.tvSymbol,

      bid: (
        Math.random() * 1000 +
        1
      ).toFixed(3),

      signal:
        Math.random() > 0.5
          ? "up"
          : "down",

      marketType: section.marketType,

      spread: section.spread,

      contractSize:
        item.contractSize ||
        section.contractSize,
    }))
);

/* =========================================
   ALL MARKETS
========================================= */

export const MARKET_PRESETS =
  MARKET_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      label: item.label,

      symbol: item.label,

      tvSymbol: item.tvSymbol,

      marketType: section.marketType,

      contractSize:
        item.contractSize ||
        section.contractSize,

      spread: section.spread,
    }))
  );