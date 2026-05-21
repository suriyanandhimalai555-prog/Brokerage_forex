export const SCRIPT_ID = "tv-widget-script";
export const TV_CONTAINER_ID = "tv_chart_container";

export const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("terminal_theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
};

export const buildApiUrl = (path) => `${import.meta.env.VITE_API_URL || ""}${path}`;

export const cleanSymbol = (symbol) => {
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

export const orderTypeLabel = (type) => String(type || "").replace(/_/g, " ").toUpperCase();

export const isPendingType = (type) => {
  const t = String(type || "").toLowerCase();
  return ["buy_limit", "sell_limit", "buy_stop", "sell_stop"].includes(t);
};

export const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return "-";
  return n.toFixed(4);
};

export const formatPnL = (value) => {
  const n = Number(value || 0);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;
};

export const calcOrderPnl = (order, livePrice, isOpen) => {
  const entry = Number(order.open_price || 0);
  const units = Number(order.units || 0);
  const side = String(order.type || "").toLowerCase();

  if (!isOpen || !livePrice) return Number(order.profit || 0);
  return side.startsWith("buy") ? (livePrice - entry) * units : (entry - livePrice) * units;
};

export const getSignalColor = (signal) => (String(signal).toLowerCase() === "up" ? "bg-emerald-500" : "bg-rose-500");
export const getSignalIcon = (signal) => (String(signal).toLowerCase() === "up" ? "↑" : "↓");
