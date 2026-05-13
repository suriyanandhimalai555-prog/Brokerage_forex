import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  TrendingUp,
  Wallet,
  Activity,
  ChevronRight,
  Moon,
  Sun,
  Clock3,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Layers3,
  SlidersHorizontal,
  Signal,
  BadgeDollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "../assets/logo.png";

const SCRIPT_ID = "tradingview-script";
const CONTAINER_ID = "tradingview_chart";

const MARKET_SECTIONS = [
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
      { label: "XAU/USD", tvSymbol: "XAUUSD", contractSize: 100 },
      { label: "XAG/USD", tvSymbol: "XAGUSD", contractSize: 5000 },
      { label: "XPT/USD", tvSymbol: "XPTUSD", contractSize: 100 },
      { label: "WTI Crude Oil", tvSymbol: "USOIL", contractSize: 1000 },
      { label: "Brent Crude Oil", tvSymbol: "UKOIL", contractSize: 1000 },
      { label: "Natural Gas", tvSymbol: "NATGAS", contractSize: 1000 },
    ],
  },
  {
    title: "Index CFDs",
    marketType: "index",
    spread: "Variable",
    contractSize: 1,
    items: [
      { label: "US30", tvSymbol: "DJI", contractSize: 1 },
      { label: "NAS100", tvSymbol: "NDX", contractSize: 1 },
      { label: "SPX500", tvSymbol: "SPX", contractSize: 1 },
      { label: "DAX40", tvSymbol: "DAX", contractSize: 1 },
      { label: "FTSE100", tvSymbol: "UKX", contractSize: 1 },
    ],
  },
  {
    title: "Crypto",
    marketType: "crypto",
    spread: "Exchange-based",
    contractSize: 1,
    items: [
      { label: "BTC/USDT", tvSymbol: "BINANCE:BTCUSDT", contractSize: 1 },
      { label: "ETH/USDT", tvSymbol: "BINANCE:ETHUSDT", contractSize: 1 },
      { label: "BNB/USDT", tvSymbol: "BINANCE:BNBUSDT", contractSize: 1 },
    ],
  },
];

const DEFAULT_ITEM = MARKET_SECTIONS[0].items[0];

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("avg_terminal_theme");
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
};

const cleanSymbol = (symbol) => {
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

const orderTypeLabel = (type) => String(type || "").replace(/_/g, " ").toUpperCase();

const formatPrice = (value) => {
  if (value === null || value === undefined || Number(value) === 0) return "-";
  return Number(value).toFixed(4);
};

const formatPnL = (value) => {
  const n = Number(value || 0);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;
};

const TradingTerminal = () => {
  const widgetRef = useRef(null);
  const chartWrapperRef = useRef(null);

  const [selectedMarket, setSelectedMarket] = useState(DEFAULT_ITEM);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const [livePrice, setLivePrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const [triggerPrice, setTriggerPrice] = useState("");
  const [lotSize, setLotSize] = useState("0.01");

  const currentSymbol = selectedMarket.tvSymbol;
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("avg_terminal_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (livePrice > 0) {
      setTriggerPrice(String(livePrice));
    }
  }, [currentSymbol]);

  const destroyWidget = () => {
    try {
      if (widgetRef.current) {
        widgetRef.current.remove();
      }
    } catch (err) {
      console.log("Safe ignore remove error:", err?.message || err);
    } finally {
      widgetRef.current = null;
    }

    const container = document.getElementById(CONTAINER_ID);
    if (container) container.innerHTML = "";
  };

  const createWidget = () => {
    const container = document.getElementById(CONTAINER_ID);
    if (!window.TradingView || !container) return;

    destroyWidget();
    setLoading(true);

    widgetRef.current = new window.TradingView.widget({
      symbol: currentSymbol,
      interval: "15",
      container_id: CONTAINER_ID,
      timezone: "Asia/Kolkata",
      theme: theme,
      style: "1",
      autosize: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      locale: "en",
      details: true,
      withdateranges: true,
      hide_top_toolbar: false,
      hotlist: true,
      calendar: true,
      studies: [],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
    });

    setTimeout(() => setLoading(false), 700);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return;

      if (data?.user?.trading_account) {
        setActiveAccount(data.user.trading_account);
        setBalance(Number(data.user.trading_account.balance || 0));
      } else {
        setActiveAccount(null);
        setBalance(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return;

      setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
    } catch (err) {
      console.error(err);
    }
  };

  const switchAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/active/${accountId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to switch account");
        return;
      }

      toast.success("Account switched");
      await fetchProfile();
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to switch account");
    }
  };

  const fetchLivePrice = async () => {
  try {
    const encodedSymbol = btoa(currentSymbol);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/market/price/${encodedSymbol}`
    );

    const data = await res.json();

    console.log("LIVE PRICE RESPONSE:", data);

    if (
      res.ok &&
      data?.price !== undefined &&
      data?.price !== null &&
      !Number.isNaN(Number(data.price))
    ) {
      setLivePrice(Number(data.price));
    } else {
      setLivePrice(0);
    }
  } catch (err) {
    console.error("LIVE PRICE ERROR:", err);
    setLivePrice(0);
  }
};

  const fetchOrders = async () => {
    try {
      setRefreshingOrders(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to load orders");
        return;
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setRefreshingOrders(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initChart = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) createWidget();
      });
    };

    if (window.TradingView?.widget) {
      initChart();
    } else {
      let script = document.getElementById(SCRIPT_ID);

      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = initChart;
        script.onerror = () => {
          setLoading(false);
          toast.error("Failed to load chart");
        };
        document.body.appendChild(script);
      } else {
        script.addEventListener("load", initChart, { once: true });
      }
    }

    return () => {
      cancelled = true;
      destroyWidget();
    };
  }, [currentSymbol, theme]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchAccounts();
    fetchLivePrice();
    fetchOrders();

    const priceTimer = setInterval(fetchLivePrice, 1000);
    const orderTimer = setInterval(fetchOrders, 5000);
    const profileTimer = setInterval(fetchProfile, 7000);

    return () => {
      clearInterval(priceTimer);
      clearInterval(orderTimer);
      clearInterval(profileTimer);
    };
  }, [currentSymbol, selectedMarket.marketType]);

  const toggleFullscreen = async () => {
    try {
      if (!chartWrapperRef.current) return;

      if (!document.fullscreenElement) {
        await chartWrapperRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
      toast.error("Fullscreen not supported");
    }
  };

  const visibleOrders = useMemo(() => {
    const activeKey = cleanSymbol(currentSymbol);
    return orders.filter((o) => cleanSymbol(o.symbol) === activeKey);
  }, [orders, currentSymbol]);

  const openOrders = useMemo(
    () => visibleOrders.filter((o) => (o.status || "open").toLowerCase() === "open"),
    [visibleOrders]
  );

  const pendingOrders = useMemo(
    () => visibleOrders.filter((o) => (o.status || "").toLowerCase() === "pending"),
    [visibleOrders]
  );

  const closedOrders = useMemo(
    () => visibleOrders.filter((o) => (o.status || "").toLowerCase() === "closed"),
    [visibleOrders]
  );

  const floatingPnL = useMemo(() => {
    if (!livePrice) return 0;

    return openOrders.reduce((sum, order) => {
      const entry = Number(order.open_price || 0);
      const units = Number(order.units || 0);
      const side = String(order.type || "").toLowerCase();

      if (side.startsWith("buy")) {
        return sum + (livePrice - entry) * units;
      }

      return sum + (entry - livePrice) * units;
    }, 0);
  }, [openOrders, livePrice]);

  const marginUsed = useMemo(
    () => openOrders.reduce((sum, order) => sum + Number(order.margin || 0), 0),
    [openOrders]
  );

  const equity = Number(balance || 0) + floatingPnL;
  const availableBalance = Number(balance || 0);

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MARKET_SECTIONS;

    return MARKET_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const text = `${section.title} ${item.label} ${item.tvSymbol}`.toLowerCase();
        return text.includes(q);
      }),
    })).filter((section) => section.items.length > 0);
  }, [search]);

  const canTrade = livePrice > 0;

  const placeOrder = async (type) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token missing. Please login again.");
        return;
      }

      if (!canTrade) {
        toast.error("Trading is enabled only when live price is available.");
        return;
      }

      const normalizedType = String(type || "").toLowerCase();
      const isPending = ["buy_limit", "sell_limit", "buy_stop", "sell_stop"].includes(normalizedType);

      if (isPending) {
        const tp = Number(triggerPrice);
        if (Number.isNaN(tp) || tp <= 0) {
          toast.error("Enter a valid trigger price");
          return;
        }
      }

      const lot = Number(lotSize);
      if (Number.isNaN(lot) || lot <= 0) {
        toast.error("Enter a valid lot size");
        return;
      }

      setOrderLoading(true);
      const loadingToast = toast.loading(`${orderTypeLabel(normalizedType)} placing...`);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: currentSymbol,
          type: normalizedType,
          lot_size: lot,
          price: livePrice,
          trigger_price: isPending ? Number(triggerPrice) : null,
          leverage: 100,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.dismiss(loadingToast);
        toast.error("Invalid token. Please login again.");
        return;
      }

      if (!res.ok) {
        toast.dismiss(loadingToast);
        toast.error(data?.message || "Order failed");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success(`${orderTypeLabel(normalizedType)} placed ✅`);

      if (data?.balance !== undefined) {
        setBalance(Number(data.balance || 0));
      } else {
        await fetchProfile();
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Order failed ❌");
    } finally {
      setOrderLoading(false);
    }
  };

  const closeOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token missing. Please login again.");
        return;
      }

      if (!canTrade) {
        toast.error("Trading is enabled only when live price is available.");
        return;
      }

      const loadingToast = toast.loading("Closing order...");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/close`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          close_price: livePrice,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.dismiss(loadingToast);
        toast.error("Invalid token. Please login again.");
        return;
      }

      if (!res.ok) {
        toast.dismiss(loadingToast);
        toast.error(data?.message || "Close order failed");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Order closed ✅");

      if (data?.balance !== undefined) {
        setBalance(Number(data.balance || 0));
      } else {
        await fetchProfile();
      }

      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Close order failed ❌");
    }
  };

  const rootClass = isDark
    ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(19,78,74,0.18),_transparent_30%),linear-gradient(180deg,#020617_0%,#07111f_100%)] text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const panelClass = isDark
    ? "bg-[#07121f] border-slate-800 shadow-[0_16px_50px_rgba(0,0,0,0.35)]"
    : "bg-white border-slate-200 shadow-sm";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const softInput = isDark
    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400";

  const sectionButtonActive = isDark
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
    : "border-emerald-500 bg-emerald-50 text-emerald-700";

  const sectionButtonInactive = isDark
    ? "border-slate-800 hover:bg-slate-950 text-slate-100"
    : "border-slate-200 hover:bg-slate-50 text-slate-900";

  const actionButtonBase =
    "rounded-2xl py-3 font-semibold tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed";

  const OrdersMobileCard = ({ order, type }) => {
    const isOpen = type === "open";
    const isPending = type === "pending";
    const isClosed = type === "closed";

    const entry = Number(order.open_price || 0);
    const units = Number(order.units || 0);
    const side = String(order.type || "").toLowerCase();
    const pnl =
      isOpen && livePrice
        ? side.startsWith("buy")
          ? (livePrice - entry) * units
          : (entry - livePrice) * units
        : Number(order.profit || 0);

    return (
      <div
        className={`rounded-2xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-white"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{order.display_symbol || cleanSymbol(order.symbol)}</div>
            <div className={`mt-1 text-sm ${mutedText}`}>{orderTypeLabel(order.type)}</div>
          </div>

          {isOpen && (
            <div className={`text-sm font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              PnL: {formatPnL(pnl)}
            </div>
          )}

          {isPending && (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Clock3 size={13} />
              Pending
            </div>
          )}

          {isClosed && (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-400">
              <XCircle size={13} />
              Closed
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className={mutedText}>Lots</div>
            <div className="font-medium">{Number(order.lot_size || 0).toFixed(2)}</div>
          </div>
          <div>
            <div className={mutedText}>Units</div>
            <div className="font-medium">{Number(order.units || 0).toFixed(2)}</div>
          </div>

          <div>
            <div className={mutedText}>{isPending ? "Trigger" : "Open"}</div>
            <div className="font-medium">{isPending ? formatPrice(order.trigger_price) : formatPrice(order.open_price)}</div>
          </div>

          <div>
            <div className={mutedText}>{isClosed ? "Close" : "Live"}</div>
            <div className="font-medium">{isClosed ? formatPrice(order.close_price) : livePrice ? livePrice.toFixed(4) : "-"}</div>
          </div>

          <div>
            <div className={mutedText}>Margin</div>
            <div className="font-medium">{Number(order.margin || 0).toFixed(2)}</div>
          </div>
          <div>
            <div className={mutedText}>Leverage</div>
            <div className="font-medium">1:{Number(order.leverage || 100)}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isPending ? "Waiting for trigger" : isClosed ? "Trade completed" : "Live trade"}
          </div>

          {isOpen && (
            <button
              onClick={() => closeOrder(order.id)}
              disabled={!canTrade}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  };

  const OrdersDesktopTable = ({ title, items, type }) => {
    const isOpen = type === "open";
    const isPending = type === "pending";
    const isClosed = type === "closed";

    return (
      <div className={`rounded-3xl border ${panelClass} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <h3 className="font-semibold">{title}</h3>
          <span className={`text-sm ${mutedText}`}>{items.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className={isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-600"}>
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Symbol</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Lots</th>
                <th className="px-4 py-3 font-semibold">Units</th>
                <th className="px-4 py-3 font-semibold">{isPending ? "Trigger" : "Open"}</th>
                <th className="px-4 py-3 font-semibold">{isClosed ? "Close" : "Live"}</th>
                <th className="px-4 py-3 font-semibold">Margin</th>
                <th className="px-4 py-3 font-semibold">Leverage</th>
                <th className="px-4 py-3 font-semibold">PnL</th>
                <th className="px-4 py-3 font-semibold text-center">{isOpen ? "Action" : isPending ? "Status" : "Result"}</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-slate-500">
                    No {title.toLowerCase()}.
                  </td>
                </tr>
              ) : (
                items.map((order) => {
                  const entry = Number(order.open_price || 0);
                  const units = Number(order.units || 0);
                  const side = String(order.type || "").toLowerCase();

                  const pnl = isOpen
                    ? livePrice
                      ? side.startsWith("buy")
                        ? (livePrice - entry) * units
                        : (entry - livePrice) * units
                      : 0
                    : Number(order.profit || 0);

                  return (
                    <tr
                      key={order.id}
                      className={`border-t ${isDark ? "border-slate-800 hover:bg-slate-950/50" : "border-slate-100 hover:bg-slate-50"} transition`}
                    >
                      <td className="px-4 py-4 font-semibold">{order.display_symbol || cleanSymbol(order.symbol)}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isOpen
                            ? "bg-emerald-500/10 text-emerald-400"
                            : isPending
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-slate-500/10 text-slate-400"
                            }`}
                        >
                          {orderTypeLabel(order.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">{Number(order.lot_size || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">{Number(order.units || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">{isPending ? formatPrice(order.trigger_price) : formatPrice(order.open_price)}</td>
                      <td className="px-4 py-4">{isClosed ? formatPrice(order.close_price) : livePrice ? livePrice.toFixed(4) : "-"}</td>
                      <td className="px-4 py-4">{Number(order.margin || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">1:{Number(order.leverage || 100)}</td>
                      <td className={`px-4 py-4 font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {formatPnL(pnl)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isOpen ? (
                          <button
                            onClick={() => closeOrder(order.id)}
                            disabled={!canTrade}
                            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                          >
                            Close
                          </button>
                        ) : isPending ? (
                          <span className="text-xs font-semibold text-amber-400">Waiting</span>
                        ) : (
                          <span className={pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {pnl >= 0 ? "Profit" : "Loss"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const quickActions = [
    { label: "Buy", key: "buy", icon: ArrowUpRight, className: "bg-emerald-500 hover:bg-emerald-400 text-slate-950" },
    { label: "Sell", key: "sell", icon: ArrowDownRight, className: "bg-rose-500 hover:bg-rose-400 text-white" },
    { label: "Buy Limit", key: "buy_limit", icon: ArrowUpRight, className: "bg-emerald-700 hover:bg-emerald-600 text-white" },
    { label: "Sell Limit", key: "sell_limit", icon: ArrowDownRight, className: "bg-rose-700 hover:bg-rose-600 text-white" },
    { label: "Buy Stop", key: "buy_stop", icon: ArrowUpRight, className: "bg-sky-700 hover:bg-sky-600 text-white" },
    { label: "Sell Stop", key: "sell_stop", icon: ArrowDownRight, className: "bg-orange-700 hover:bg-orange-600 text-white" },
  ];

  const marketStats = [
    { label: "Balance", value: availableBalance.toFixed(2), icon: Wallet, positive: true },
    { label: "Equity", value: equity.toFixed(2), icon: TrendingUp, positive: true },
    { label: "Floating PnL", value: `${floatingPnL >= 0 ? "+" : ""}${floatingPnL.toFixed(2)}`, icon: Activity, positive: floatingPnL >= 0 },
    { label: "Margin Used", value: marginUsed.toFixed(2), icon: BadgeDollarSign, positive: true },
  ];

  return (
    <div className={rootClass}>
      <div className="mx-auto max-w-[1800px] p-3 sm:p-4 lg:p-5">
        <div className={`rounded-[28px] border ${panelClass} overflow-hidden`}>
          <div className={`border-b ${isDark ? "border-slate-800/80 bg-[#06111d]" : "border-slate-200 bg-white"}`}>
            <div className="flex flex-col gap-4 px-4 py-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <img width={34} src={Logo} alt="Trading Logo" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-wide">Trading Terminal</h2>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                      Live execution
                    </span>
                    {/* <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/20">
                      Exness-style layout
                    </span> */}
                  </div>
                  <p className={`mt-1 text-sm ${mutedText}`}>
                    Clean watchlist, chart, order ticket, and account monitoring in one terminal.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"}`}>
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search symbols"
                    className={`w-[220px] bg-transparent outline-none text-sm ${isDark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark
                    ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "Light" : "Dark"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fetchProfile();
                    fetchLivePrice();
                    fetchOrders();
                    toast.success("Refreshed");
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark
                    ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                    : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_360px] gap-0">
            <aside className={`border-b xl:border-b-0 xl:border-r ${isDark ? "border-slate-800" : "border-slate-200"} p-4`}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Market Watch</h3>
                  <p className={`text-xs ${mutedText}`}>Tap a symbol to load chart</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {filteredSections.reduce((sum, sec) => sum + sec.items.length, 0)}
                </span>
              </div>

              <div className="max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1">
                {filteredSections.map((section) => (
                  <div key={section.title} className={`rounded-3xl border p-3 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{section.title}</h4>
                        <p className={`text-xs ${mutedText}`}>{section.marketType.toUpperCase()} • Spread {section.spread}</p>
                      </div>
                      <span className={`text-xs ${mutedText}`}>{section.items.length}</span>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item) => {
                        const active = item.tvSymbol === currentSymbol;
                        return (
                          <button
                            key={item.tvSymbol}
                            onClick={() => setSelectedMarket(item)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition ${active ? sectionButtonActive : sectionButtonInactive}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className={`text-xs ${active ? (isDark ? "text-emerald-200" : "text-emerald-700") : mutedText}`}>{item.tvSymbol}</div>
                              </div>
                              <ChevronRight size={16} className={active ? "text-emerald-400" : "text-slate-500"} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <main className="border-b xl:border-b-0 xl:border-r border-slate-800/80 p-4">
              <div className="space-y-4">
                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold">{selectedMarket.label}</h3>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                          {String(selectedMarket?.marketType || "market").toUpperCase()}
                        </span>
                        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/20">
                          Contract {selectedMarket.contractSize || 100000}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${mutedText}`}>
                        Live price: <span className="font-semibold text-emerald-400">{livePrice ? livePrice.toFixed(4) : "-"}</span>
                        <span className="mx-2">•</span>
                        Selected symbol: {currentSymbol}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-slate-800 bg-slate-950 hover:bg-slate-900" : "border-slate-300 bg-white hover:bg-slate-50"}`}
                      >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {marketStats.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                        <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                          <Icon size={16} />
                          {item.label}
                        </div>
                        <div className={`mt-2 text-2xl font-semibold ${item.label === "Floating PnL" ? (item.positive ? "text-emerald-400" : "text-rose-400") : ""}`}>
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  ref={chartWrapperRef}
                  className={`relative overflow-hidden rounded-3xl border ${isDark ? "bg-black border-slate-800" : "bg-white border-slate-200"} ${isFullscreen ? "h-[100vh]" : "h-[640px]"}`}
                >
                  {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-sm font-semibold text-white">
                      Loading chart...
                    </div>
                  )}
                  <div id={CONTAINER_ID} className="h-full w-full" />
                </div>

                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <Layers3 size={16} className="text-emerald-400" />
                    <h3 className="font-semibold">Order Ticket</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-[160px_1fr]">
                    <div>
                      <label className={`mb-2 block text-xs font-medium uppercase tracking-wide ${mutedText}`}>Lot Size</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={lotSize}
                        onChange={(e) => setLotSize(e.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${softInput}`}
                      />
                    </div>

                    <div>
                      <label className={`mb-2 block text-xs font-medium uppercase tracking-wide ${mutedText}`}>Trigger Price</label>
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={triggerPrice}
                        onChange={(e) => setTriggerPrice(e.target.value)}
                        placeholder={livePrice ? String(livePrice) : "Enter trigger"}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${softInput}`}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                    {quickActions.map(({ label, key, icon: Icon, className }) => (
                      <button
                        key={key}
                        onClick={() => placeOrder(key)}
                        disabled={orderLoading || !canTrade}
                        className={`${actionButtonBase} inline-flex items-center justify-center gap-2 ${className}`}
                      >
                        <Icon size={16} />
                        {orderLoading ? "Working..." : label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </main>

            <aside className="p-4">
              <div className="space-y-4">
                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <Signal size={16} className="text-emerald-400" />
                    <h3 className="font-semibold">Account</h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className={`text-sm ${mutedText}`}>Active Trading Account</div>
                      {activeAccount ? (
                        <div className="mt-2 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-lg font-semibold">#{activeAccount.account_no}</div>
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${activeAccount.account_type === "demo" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                              {String(activeAccount.account_type).toUpperCase()}
                            </span>
                            <span className="rounded-full bg-sky-500/10 px-2 py-1 text-xs font-semibold text-sky-400">
                              {activeAccount.platform}
                            </span>
                          </div>
                          <div className={`text-sm ${mutedText}`}>
                            Balance: {Number(activeAccount.balance || 0).toFixed(2)} {activeAccount.currency}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-sm text-rose-400">No active account selected</div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      {accounts.map((acc) => {
                        const active = activeAccount?.id === acc.id;
                        return (
                          <button
                            key={acc.id}
                            onClick={() => switchAccount(acc.id)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                              : isDark
                                ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{acc.account_type === "demo" ? "Demo" : "Real"}</span>
                              <span>{Number(acc.balance || 0).toFixed(2)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-sky-400" />
                    <h3 className="font-semibold">Live Controls</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        fetchProfile();
                        fetchLivePrice();
                        fetchOrders();
                        toast.success("Updated");
                      }}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isDark ? "border-slate-800 bg-slate-950 hover:bg-slate-900" : "border-slate-300 bg-white hover:bg-slate-50"}`}
                    >
                      <RefreshCw size={16} />
                      Refresh Data
                    </button>
                    <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                      <div className={mutedText}>Selected Symbol</div>
                      <div className="mt-1 font-semibold">{currentSymbol}</div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Open Orders</h3>
                    <span className={`text-sm ${mutedText}`}>{refreshingOrders ? "Refreshing..." : openOrders.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {openOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No open orders.</p>
                    ) : (
                      openOrders.map((order) => <OrdersMobileCard key={order.id} order={order} type="open" />)
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className={`border-t ${isDark ? "border-slate-800" : "border-slate-200"} p-4`}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Pending Orders</h3>
                    <span className={`text-sm ${mutedText}`}>{pendingOrders.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {pendingOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No pending orders.</p>
                    ) : (
                      pendingOrders.map((order) => <OrdersMobileCard key={order.id} order={order} type="pending" />)
                    )}
                  </div>
                </div>

                <div className={`rounded-3xl border p-4 lg:col-span-2 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Closed Orders</h3>
                    <span className={`text-sm ${mutedText}`}>{closedOrders.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {closedOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No closed orders.</p>
                    ) : (
                      closedOrders.map((order) => <OrdersMobileCard key={order.id} order={order} type="closed" />)
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden xl:block space-y-4">
                <OrdersDesktopTable title="Open Orders" items={openOrders} type="open" />
                <OrdersDesktopTable title="Pending Orders" items={pendingOrders} type="pending" />
                <OrdersDesktopTable title="Closed Orders" items={closedOrders} type="closed" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;
