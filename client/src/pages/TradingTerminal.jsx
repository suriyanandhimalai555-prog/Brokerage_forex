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
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Logo from "../assets/logo.png";

const SCRIPT_ID = "tradingview-script";
const CONTAINER_ID = "tradingview_chart";

const MARKET_SECTIONS = [
  {
    title: "Major Currency Pairs",
    marketType: "forex",
    spread: "0.5–1.5 pips",
    contractSize: 100000,
    items: [
      { label: "EUR/USD", tvSymbol: "OANDA:EURUSD" },
      { label: "GBP/USD", tvSymbol: "OANDA:GBPUSD" },
      { label: "USD/JPY", tvSymbol: "OANDA:USDJPY" },
      { label: "USD/CHF", tvSymbol: "OANDA:USDCHF" },
      { label: "AUD/USD", tvSymbol: "OANDA:AUDUSD" },
      { label: "USD/CAD", tvSymbol: "OANDA:USDCAD" },
      { label: "NZD/USD", tvSymbol: "OANDA:NZDUSD" },
    ],
  },
  {
    title: "Minor Pairs",
    marketType: "forex",
    spread: "1.5–3 pips",
    contractSize: 100000,
    items: [
      { label: "EUR/GBP", tvSymbol: "OANDA:EURGBP" },
      { label: "EUR/AUD", tvSymbol: "OANDA:EURAUD" },
      { label: "EUR/JPY", tvSymbol: "OANDA:EURJPY" },
      { label: "EUR/CHF", tvSymbol: "OANDA:EURCHF" },
      { label: "EUR/CAD", tvSymbol: "OANDA:EURCAD" },
      { label: "EUR/NZD", tvSymbol: "OANDA:EURNZD" },
      { label: "GBP/JPY", tvSymbol: "OANDA:GBPJPY" },
      { label: "GBP/AUD", tvSymbol: "OANDA:GBPAUD" },
      { label: "GBP/CHF", tvSymbol: "OANDA:GBPCHF" },
      { label: "GBP/CAD", tvSymbol: "OANDA:GBPCAD" },
      { label: "GBP/NZD", tvSymbol: "OANDA:GBPNZD" },
      { label: "AUD/JPY", tvSymbol: "OANDA:AUDJPY" },
      { label: "AUD/NZD", tvSymbol: "OANDA:AUDNZD" },
      { label: "AUD/CAD", tvSymbol: "OANDA:AUDCAD" },
      { label: "CAD/JPY", tvSymbol: "OANDA:CADJPY" },
      { label: "CHF/JPY", tvSymbol: "OANDA:CHFJPY" },
      { label: "NZD/JPY", tvSymbol: "OANDA:NZDJPY" },
    ],
  },
  {
    title: "Exotic Pairs",
    marketType: "forex",
    spread: "5–20+ pips",
    contractSize: 100000,
    items: [
      { label: "USD/INR", tvSymbol: "OANDA:USDINR" },
      { label: "USD/TRY", tvSymbol: "OANDA:USDTRY" },
      { label: "USD/ZAR", tvSymbol: "OANDA:USDZAR" },
      { label: "USD/MXN", tvSymbol: "OANDA:USDMXN" },
      { label: "USD/THB", tvSymbol: "OANDA:USDTHB" },
      { label: "USD/SGD", tvSymbol: "OANDA:USDSGD" },
      { label: "USD/HKD", tvSymbol: "OANDA:USDHKD" },
      { label: "USD/AED", tvSymbol: "OANDA:USDAED" },
    ],
  },
  {
    title: "Metals & Commodities",
    marketType: "metal",
    spread: "High volatility",
    contractSize: 100,
    items: [
      { label: "XAU/USD", tvSymbol: "OANDA:XAUUSD", contractSize: 100 },
      { label: "XAG/USD", tvSymbol: "OANDA:XAGUSD", contractSize: 5000 },
      { label: "XPT/USD", tvSymbol: "OANDA:XPTUSD", contractSize: 100 },
      { label: "WTI Crude Oil", tvSymbol: "TVC:USOIL", contractSize: 1000 },
      { label: "Brent Crude Oil", tvSymbol: "TVC:UKOIL", contractSize: 1000 },
      { label: "Natural Gas", tvSymbol: "TVC:NATGAS", contractSize: 1000 },
    ],
  },
  {
    title: "Index CFDs",
    marketType: "index",
    spread: "Variable",
    contractSize: 1,
    items: [
      { label: "US30", tvSymbol: "TVC:DJI", contractSize: 1 },
      { label: "NAS100", tvSymbol: "TVC:NDX", contractSize: 1 },
      { label: "SPX500", tvSymbol: "TVC:SPX", contractSize: 1 },
      { label: "DAX40", tvSymbol: "TVC:DAX", contractSize: 1 },
      { label: "FTSE100", tvSymbol: "TVC:UKX", contractSize: 1 },
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

const DEFAULT_ITEM = MARKET_SECTIONS[5].items[0];

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

      /*
      |--------------------------------------------------------------------------
      | ACTIVE ACCOUNT
      |--------------------------------------------------------------------------
      */

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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts/active/${accountId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/market/price/${encodeURIComponent(currentSymbol)}`
      );
      const data = await res.json();

      if (res.ok && data?.price !== undefined && data?.price !== null) {
        setLivePrice(Number(data.price));
      }
    } catch (err) {
      console.error(err);
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
      const isPending = ["buy_limit", "sell_limit", "buy_stop", "sell_stop"].includes(
        normalizedType
      );

      if (isPending) {
        const tp = Number(triggerPrice);
        if (Number.isNaN(tp) || tp <= 0) {
          toast.error("Enter a valid trigger price");
          return;
        }
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
          lot_size: 0.01,
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
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const panelClass = isDark
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-slate-200";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";
  const softInput = isDark
    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400";

  const sectionButtonActive = isDark
    ? "border-slate-200 bg-slate-200 text-slate-900"
    : "border-slate-900 bg-slate-900 text-white";

  const sectionButtonInactive = isDark
    ? "border-slate-700 hover:bg-slate-800 text-slate-100"
    : "border-slate-200 hover:bg-slate-50 text-slate-900";

  const actionButtonBase =
    "rounded-xl py-3 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

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
        className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-950/40" : "border-slate-200 bg-white"
          }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">
              {order.display_symbol || cleanSymbol(order.symbol)}
            </div>
            <div className={`mt-1 text-sm ${mutedText}`}>
              {orderTypeLabel(order.type)}
            </div>
          </div>

          {isOpen && (
            <div
              className={`text-sm font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-500"
                }`}
            >
              PnL: {formatPnL(pnl)}
            </div>
          )}

          {isPending && (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
              <Clock3 size={13} />
              Pending
            </div>
          )}

          {isClosed && (
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-500">
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
            <div className="font-medium">
              {isPending
                ? formatPrice(order.trigger_price)
                : formatPrice(order.open_price)}
            </div>
          </div>

          <div>
            <div className={mutedText}>{isClosed ? "Close" : "Live"}</div>
            <div className="font-medium">
              {isClosed
                ? formatPrice(order.close_price)
                : livePrice
                  ? livePrice.toFixed(4)
                  : "-"}
            </div>
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
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
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
      <div className={`rounded-2xl border ${panelClass} overflow-hidden`}>
        <div className="flex items-center justify-between border-b px-4 py-3">
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
                <th className="px-4 py-3 font-semibold text-center">
                  {isOpen ? "Action" : isPending ? "Status" : "Result"}
                </th>
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
                      className={`border-t ${isDark ? "border-slate-800 hover:bg-slate-950/50" : "border-slate-100 hover:bg-slate-50"
                        } transition`}
                    >
                      <td className="px-4 py-4 font-semibold">
                        {order.display_symbol || cleanSymbol(order.symbol)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isOpen
                            ? "bg-emerald-500/10 text-emerald-600"
                            : isPending
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-slate-500/10 text-slate-500"
                            }`}
                        >
                          {orderTypeLabel(order.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">{Number(order.lot_size || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">{Number(order.units || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">
                        {isPending
                          ? formatPrice(order.trigger_price)
                          : formatPrice(order.open_price)}
                      </td>
                      <td className="px-4 py-4">
                        {isClosed
                          ? formatPrice(order.close_price)
                          : livePrice
                            ? livePrice.toFixed(4)
                            : "-"}
                      </td>
                      <td className="px-4 py-4">{Number(order.margin || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">1:{Number(order.leverage || 100)}</td>
                      <td
                        className={`px-4 py-4 font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-500"
                          }`}
                      >
                        {formatPnL(pnl)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isOpen ? (
                          <button
                            onClick={() => closeOrder(order.id)}
                            disabled={!canTrade}
                            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                          >
                            Close
                          </button>
                        ) : isPending ? (
                          <span className="text-xs font-semibold text-amber-600">Waiting</span>
                        ) : (
                          <span className={pnl >= 0 ? "text-green-600" : "text-red-500"}>
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

  return (
    <div className={`${rootClass} p-4`}>
      <div className={`space-y-4 rounded-2xl shadow-sm border ${panelClass} p-4`}>
        <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <img width={40} src={Logo} alt="AVG Forex Logo" />
                  <h2 className="text-xl font-semibold">AVG Trading Terminal</h2>
                </div>
                <p className={`text-sm ${mutedText}`}>Live execution panel</p>
              </div>

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${isDark
                  ? "border-slate-700 bg-slate-800 hover:bg-slate-700"
                  : "border-slate-300 bg-white hover:bg-slate-100"
                  }`}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {/* {isDark ? "Light Mode" : "Dark Mode"} */}
              </button>
            </div>

            <div className={`rounded-2xl border p-4 space-y-3 ${panelClass}`}>
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pair, index, metal..."
                  className={`w-full outline-none text-sm border rounded-xl px-3 py-2 ${softInput}`}
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
              {filteredSections.map((section) => (
                <div key={section.title} className={`rounded-2xl border p-3 ${panelClass}`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className={`text-xs ${mutedText}`}>
                        {section.marketType.toUpperCase()} • Spread {section.spread}
                      </p>
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
                          className={`w-full flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${active ? sectionButtonActive : sectionButtonInactive
                            }`}
                        >
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div
                              className={`text-xs ${active
                                ? isDark
                                  ? "text-slate-700"
                                  : "text-slate-200"
                                : mutedText
                                }`}
                            >
                              {item.tvSymbol}
                            </div>
                          </div>
                          <ChevronRight size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${panelClass}`}
            >
              <div>
                <div className="text-sm text-slate-500">
                  Active Trading Account
                </div>

                {activeAccount ? (
                  <div className="mt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold">
                        #{activeAccount.account_no}
                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${activeAccount.account_type === "demo"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {String(activeAccount.account_type).toUpperCase()}
                      </span>

                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {activeAccount.platform}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      Balance: {Number(activeAccount.balance || 0).toFixed(2)}{" "}
                      {activeAccount.currency}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-red-500">
                    No active account selected
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {accounts.map((acc) => {
                  const active = activeAccount?.id === acc.id;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => switchAccount(acc.id)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-300 hover:bg-slate-100"
                        }`}
                    >
                      {acc.account_type === "demo" ? "Demo" : "Real"} •{" "}
                      {Number(acc.balance || 0).toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className={`rounded-2xl border p-4 ${panelClass}`}>
                <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                  <Wallet size={16} />
                  Balance
                </div>
                <div className="mt-2 text-2xl font-semibold">{availableBalance.toFixed(2)}</div>
              </div>

              <div className={`rounded-2xl border p-4 ${panelClass}`}>
                <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                  <TrendingUp size={16} />
                  Equity
                </div>
                <div className="mt-2 text-2xl font-semibold">{equity.toFixed(2)}</div>
              </div>

              <div className={`rounded-2xl border p-4 ${panelClass}`}>
                <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                  <Activity size={16} />
                  Floating PnL
                </div>
                <div
                  className={`mt-2 text-2xl font-semibold ${floatingPnL >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {floatingPnL >= 0 ? "+" : ""}
                  {floatingPnL.toFixed(2)}
                </div>
              </div>

              <div className={`rounded-2xl border p-4 ${panelClass}`}>
                <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                  <Wallet size={16} />
                  Margin Used
                </div>
                <div className="mt-2 text-2xl font-semibold">{marginUsed.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{selectedMarket.label}</h3>
                <p className={`text-sm ${mutedText}`}>
                  Live price:{" "}
                  <span className="font-semibold">
                    {livePrice ? livePrice.toFixed(4) : "-"}
                  </span>
                  {" • "}Contract size: {selectedMarket.contractSize || 100000}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    fetchProfile();
                    fetchLivePrice();
                    fetchOrders();
                    toast.success("Refreshed");
                  }}
                  className={`inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg ${isDark
                    ? "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    : "border-slate-300 bg-white hover:bg-slate-100"
                    }`}
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={`inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg ${isDark
                    ? "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    : "border-slate-300 bg-white hover:bg-slate-100"
                    }`}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
              </div>
            </div>

            <div
              ref={chartWrapperRef}
              className={`w-full relative rounded-xl overflow-hidden border ${isDark ? "bg-black border-slate-700" : "bg-white border-slate-200"
                } ${isFullscreen ? "h-[100vh]" : "h-[500px]"}`}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                  Loading Chart...
                </div>
              )}
              <div id={CONTAINER_ID} className="w-full h-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <div className="flex items-center gap-2">
                <label className={`text-sm whitespace-nowrap ${mutedText}`}>Lot Size</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={0.01}
                  readOnly
                  className={`border px-3 py-2 rounded-lg w-28 ${isDark
                    ? "bg-slate-950 border-slate-700 text-slate-100"
                    : "bg-white border-slate-300 text-slate-900"
                    }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className={`text-sm whitespace-nowrap ${mutedText}`}>
                  Trigger Price
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={triggerPrice}
                  onChange={(e) => setTriggerPrice(e.target.value)}
                  placeholder={livePrice ? String(livePrice) : "Enter trigger"}
                  className={`border px-3 py-2 rounded-lg w-full ${isDark
                    ? "bg-slate-950 border-slate-700 text-slate-100"
                    : "bg-white border-slate-300 text-slate-900"
                    }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-6 gap-3">
              <button
                onClick={() => placeOrder("buy")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-green-600 hover:bg-green-700 text-white`}
              >
                {orderLoading ? "Loading..." : "BUY MARKET"}
              </button>

              <button
                onClick={() => placeOrder("sell")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-red-600 hover:bg-red-700 text-white`}
              >
                {orderLoading ? "Loading..." : "SELL MARKET"}
              </button>

              <button
                onClick={() => placeOrder("buy_limit")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-emerald-700 hover:bg-emerald-800 text-white`}
              >
                {orderLoading ? "Loading..." : "BUY LIMIT"}
              </button>

              <button
                onClick={() => placeOrder("sell_limit")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-rose-700 hover:bg-rose-800 text-white`}
              >
                {orderLoading ? "Loading..." : "SELL LIMIT"}
              </button>

              <button
                onClick={() => placeOrder("buy_stop")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-sky-700 hover:bg-sky-800 text-white`}
              >
                {orderLoading ? "Loading..." : "BUY STOP"}
              </button>

              <button
                onClick={() => placeOrder("sell_stop")}
                disabled={orderLoading || !canTrade}
                className={`${actionButtonBase} bg-orange-700 hover:bg-orange-800 text-white`}
              >
                {orderLoading ? "Loading..." : "SELL STOP"}
              </button>
            </div>

            <div className="space-y-4">
              <div className="md:hidden space-y-4">
                <div className={`rounded-2xl border p-4 ${panelClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Open Orders</h3>
                    <span className={`text-sm ${mutedText}`}>
                      {refreshingOrders ? "Refreshing..." : openOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {openOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No open orders.</p>
                    ) : (
                      openOrders.map((order) => (
                        <OrdersMobileCard key={order.id} order={order} type="open" />
                      ))
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${panelClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Pending Orders</h3>
                    <span className={`text-sm ${mutedText}`}>{pendingOrders.length}</span>
                  </div>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {pendingOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No pending orders.</p>
                    ) : (
                      pendingOrders.map((order) => (
                        <OrdersMobileCard key={order.id} order={order} type="pending" />
                      ))
                    )}
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${panelClass}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Closed Orders</h3>
                    <span className={`text-sm ${mutedText}`}>{closedOrders.length}</span>
                  </div>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {closedOrders.length === 0 ? (
                      <p className={`text-sm ${mutedText}`}>No closed orders.</p>
                    ) : (
                      closedOrders.map((order) => (
                        <OrdersMobileCard key={order.id} order={order} type="closed" />
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block space-y-4">
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