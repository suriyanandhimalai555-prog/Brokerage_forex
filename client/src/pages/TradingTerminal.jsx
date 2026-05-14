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
  Layers3,
  Signal,
  BadgeDollarSign,
  Menu,
  X,
  LayoutGrid,
  ListFilter,
  BriefcaseBusiness,
  ClipboardList,
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [livePrice, setLivePrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const [triggerPrice, setTriggerPrice] = useState("");
  const [lotSize, setLotSize] = useState("0.01");
  const [activePanel, setActivePanel] = useState("market"); // market | account | ticket | orders
  const [ordersTab, setOrdersTab] = useState("open"); // open | pending | closed

  const currentSymbol = selectedMarket.tvSymbol;
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("avg_terminal_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (livePrice > 0) {
      setTriggerPrice(String(livePrice));
    }
  }, [currentSymbol, livePrice]);

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

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/price/${encodedSymbol}`);

      const data = await res.json();

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

  const OrdersCard = ({ order, type }) => {
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
            <div className="font-medium">
              {isPending ? formatPrice(order.trigger_price) : formatPrice(order.open_price)}
            </div>
          </div>

          <div>
            <div className={mutedText}>{isClosed ? "Close" : "Live"}</div>
            <div className="font-medium">
              {isClosed ? formatPrice(order.close_price) : livePrice ? livePrice.toFixed(4) : "-"}
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
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  };

  const rightTabs = [
    { key: "market", label: "Watchlist", icon: ListFilter },
    { key: "account", label: "Account", icon: BriefcaseBusiness },
    { key: "ticket", label: "Orders", icon: Layers3 },
    { key: "orders", label: "Holdings", icon: ClipboardList },
  ];

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

  const activeOrders = ordersTab === "open" ? openOrders : ordersTab === "pending" ? pendingOrders : closedOrders;

  const renderRightPanel = () => {
    if (activePanel === "market") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Market Watch</h3>
              <p className={`text-xs ${mutedText}`}>Pick a symbol and chart updates instantly</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-100 text-slate-600"
                }`}
            >
              {filteredSections.reduce((sum, sec) => sum + sec.items.length, 0)}
            </span>
          </div>

          <div className="space-y-3">
            {filteredSections.map((section) => (
              <div
                key={section.title}
                className={`rounded-3xl border p-3 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"
                  }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{section.title}</h4>
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
                        onClick={() => {
                          setSelectedMarket(item);
                          setActivePanel("market");
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full rounded-2xl border px-3 py-3 text-left transition ${active ? sectionButtonActive : sectionButtonInactive}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div
                              className={`text-xs ${active ? (isDark ? "text-emerald-200" : "text-emerald-700") : mutedText
                                }`}
                            >
                              {item.tvSymbol}
                            </div>
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
        </div>
      );
    }

    if (activePanel === "account") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Account</h3>
            <p className={`text-xs ${mutedText}`}>Active account and account switching</p>
          </div>

          <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
            <div className="space-y-3">
              <div>
                <div className={`text-sm ${mutedText}`}>Active Trading Account</div>
                {activeAccount ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold">#{activeAccount.account_no}</div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${activeAccount.account_type === "demo"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-emerald-500/10 text-emerald-400"
                          }`}
                      >
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
        </div>
      );
    }

    if (activePanel === "ticket") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Order Ticket</h3>
            <p className={`text-xs ${mutedText}`}>Place buy, sell, and pending orders</p>
          </div>

          <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
            <div className="grid grid-cols-1 gap-3">
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

            <div className="mt-4 grid grid-cols-2 gap-3">
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
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">Orders</h3>
          <p className={`text-xs ${mutedText}`}>Switch between open, pending, and closed</p>
        </div>

        <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["open", `Open ${openOrders.length}`],
              ["pending", `Pending ${pendingOrders.length}`],
              ["closed", `Closed ${closedOrders.length}`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setOrdersTab(key)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${ordersTab === key
                    ? "bg-emerald-500 text-slate-950"
                    : isDark
                      ? "bg-slate-950 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
            {activeOrders.length === 0 ? (
              <p className={`text-sm ${mutedText}`}>No {ordersTab} orders.</p>
            ) : (
              activeOrders.map((order) => <OrdersCard key={order.id} order={order} type={ordersTab} />)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={rootClass}>
      <div className="mx-auto max-w-[1920px]">
        <div className={`${panelClass} overflow-hidden`}>
          {/* Top navbar */}
          <div
            className={`sticky top-0 z-30 border-b ${isDark
                ? "border-slate-800/80 bg-[#06111d]/95 backdrop-blur"
                : "border-slate-200 bg-white/95 backdrop-blur"
              }`}
          >
            {/* MOBILE HEADER */}
            <div className="flex items-start justify-between gap-3 px-4 py-3 xl:hidden">

              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <img width={30} src={Logo} alt="Trading Logo" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold tracking-wide">
                    Trading Terminal
                  </h2>

                  <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                    Live execution
                  </span>
                </div>
              </div>

              {/* Right Mobile Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isDark
                      ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fetchProfile();
                    fetchLivePrice();
                    fetchOrders();
                    toast.success("Refreshed");
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isDark
                      ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* DESKTOP HEADER - OLD UI UNCHANGED */}
            <div className="hidden xl:flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <img width={30} src={Logo} alt="Trading Logo" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-wide">
                      Trading Terminal
                    </h2>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                      Live execution
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

                {/* Search */}
                <div
                  className={`flex w-full items-center gap-2 rounded-2xl border px-3 py-2 ${isDark
                      ? "border-slate-800 bg-slate-950"
                      : "border-slate-200 bg-white"
                    }`}
                >
                  <Search size={16} className="text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search symbols"
                    className={`w-full bg-transparent outline-none text-sm sm:w-[220px] ${isDark
                        ? "text-slate-100 placeholder:text-slate-500"
                        : "text-slate-900 placeholder:text-slate-400"
                      }`}
                  />
                </div>

                {/* Theme */}
                <button
                  type="button"
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark
                      ? "border-slate-800 bg-slate-950 hover:bg-slate-900"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}

                  <span>{isDark ? "Light" : "Dark"}</span>
                </button>

                {/* Refresh */}
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
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats / header area */}
          <div className="px-4 pt-4">
            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
              <div
                className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"
                  }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between h-full">
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
                      Live price:{" "}
                      <span className="font-semibold text-emerald-400">
                        {livePrice ? livePrice.toFixed(4) : "-"}
                      </span>
                      <span className="mx-2">•</span>
                      Selected symbol: {currentSymbol}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-slate-800 bg-slate-950 hover:bg-slate-900" : "border-slate-300 bg-white hover:bg-slate-50"
                        }`}
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        fetchProfile();
                        fetchLivePrice();
                        fetchOrders();
                        toast.success("Updated");
                      }}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${isDark ? "border-slate-800 bg-slate-950 hover:bg-slate-900" : "border-slate-300 bg-white hover:bg-slate-50"
                        }`}
                    >
                      <RefreshCw size={16} />
                      Sync
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {marketStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`min-w-0 rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"
                        }`}
                    >
                      <div className={`flex items-center gap-2 text-sm ${mutedText}`}>
                        <Icon size={16} />
                        {item.label}
                      </div>

                      <div
                        className={`mt-2 text-2xl font-semibold ${item.label === "Floating PnL"
                            ? item.positive
                              ? "text-emerald-400"
                              : "text-rose-400"
                            : ""
                          }`}
                      >
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 gap-4 p-4 2xl:grid-cols-[minmax(0,7fr)_minmax(360px,3fr)]">
            {/* Left - chart */}
            <main className="space-y-4">
              <div
                ref={chartWrapperRef}
                className={`relative overflow-hidden rounded-3xl border ${isDark ? "bg-black border-slate-800" : "bg-white border-slate-200"
                  } h-[420px] sm:h-[520px] lg:h-[68vh] min-h-[380px] lg:min-h-[560px]`}
              >
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-sm font-semibold text-white">
                    Loading chart...
                  </div>
                )}
                <div id={CONTAINER_ID} className="h-full w-full" />
              </div>
            </main>

            {/* Right - responsive panel */}
            <div className="flex h-auto flex-col gap-3 xl:grid xl:grid-cols-[1fr_72px] xl:h-[68vh] xl:min-h-[560px]">
              <div
                className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"
                  } overflow-hidden flex flex-col max-h-[600px] xl:min-h-0`}
              >
                <div className="xl:hidden mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rightTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activePanel === tab.key;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActivePanel(tab.key)}
                        className={`rounded-2xl px-3 py-3 text-xs font-semibold transition flex items-center justify-center gap-2 ${active
                            ? isDark
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-900"
                            : isDark
                              ? "bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto pr-1">{renderRightPanel()}</div>
              </div>

              <div
                className={`hidden xl:flex rounded-3xl border py-3 px-2 flex-col items-center gap-3 h-full ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"
                  }`}
              >
                {rightTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activePanel === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActivePanel(tab.key)}
                      className={`w-full flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-xs font-medium transition-all duration-200 ${active
                          ? isDark
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-900"
                          : isDark
                            ? "text-slate-400 hover:bg-slate-900 hover:text-white"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-slate-200 text-slate-900" : isDark ? "bg-slate-900" : "bg-slate-100"
                          }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="leading-tight text-center">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kept only for very small edge cases, but hidden when the main responsive panel is visible */}
          <div className={`hidden border-t ${isDark ? "border-slate-800" : "border-slate-200"} p-4 2xl:hidden`}>
            <div className={`rounded-3xl border p-4 ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-white"}`}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Orders</h3>
                <span className={`text-sm ${mutedText}`}>{refreshingOrders ? "Refreshing..." : activeOrders.length}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  ["open", `Open (${openOrders.length})`],
                  ["pending", `Pending (${pendingOrders.length})`],
                  ["closed", `Closed (${closedOrders.length})`],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setOrdersTab(key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${ordersTab === key
                        ? "bg-emerald-500 text-slate-950"
                        : isDark
                          ? "bg-slate-950 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {activeOrders.length === 0 ? (
                  <p className={`text-sm ${mutedText}`}>No {ordersTab} orders.</p>
                ) : (
                  activeOrders.map((order) => <OrdersCard key={order.id} order={order} type={ordersTab} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;