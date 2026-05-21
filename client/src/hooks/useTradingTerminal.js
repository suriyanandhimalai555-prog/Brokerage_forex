import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { DEFAULT_MARKET, WATCHLIST } from "../data/terminalData";
import {
  buildApiUrl,
  calcOrderPnl,
  cleanSymbol,
  getInitialTheme,
  isPendingType,
  orderTypeLabel,
} from "../utils/terminalHelpers";

export const useTradingTerminal = () => {
  const chartRef = useRef(null);

  const [theme, setTheme] = useState(getInitialTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMarket, setSelectedMarket] = useState(DEFAULT_MARKET);

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(true);

  const [livePrice, setLivePrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refreshingOrders, setRefreshingOrders] = useState(false);

  const [orderLoading, setOrderLoading] = useState(false);
  const [ticketMode, setTicketMode] = useState("regular");
  const [orderKind, setOrderKind] = useState("market");
  const [volume, setVolume] = useState("0.01");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [activeOrdersTab, setActiveOrdersTab] = useState("open");

  const currentSymbol = selectedMarket.tvSymbol;
  const isDark = theme === "dark";
  const canTrade = livePrice > 0;

  useEffect(() => {
    localStorage.setItem("terminal_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (livePrice > 0) setTriggerPrice(String(livePrice));
  }, [currentSymbol, livePrice]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(buildApiUrl("/api/auth/me"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return;

      const account = data?.user?.trading_account || null;
      setActiveAccount(account);
      setBalance(Number(account?.balance || 0));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(buildApiUrl("/api/accounts/me"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return;

      setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLivePrice = async () => {
    try {
      const encodedSymbol = btoa(currentSymbol);
      const res = await fetch(buildApiUrl(`/api/market/price/${encodedSymbol}`));
      const data = await res.json();

      if (res.ok && data?.price != null && !Number.isNaN(Number(data.price))) {
        setLivePrice(Number(data.price));
      } else {
        setLivePrice(0);
      }
    } catch (err) {
      console.error(err);
      setLivePrice(0);
    }
  };

  const fetchOrders = async () => {
    try {
      setRefreshingOrders(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(buildApiUrl("/api/orders"), {
        headers: { Authorization: `Bearer ${token}` },
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

  const switchAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(buildApiUrl(`/api/accounts/active/${accountId}`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
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

  const placeOrder = async (side) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token missing. Please login again.");
        return;
      }
      if (!canTrade) {
        toast.error("Live price not available");
        return;
      }

      const normalized = String(side || "").toLowerCase();
      const pending = isPendingType(normalized);
      const vol = Number(volume);

      if (!Number.isFinite(vol) || vol <= 0) {
        toast.error("Enter a valid volume");
        return;
      }

      if (pending) {
        const tp = Number(String(triggerPrice).replace(/,/g, ""));
        if (!Number.isFinite(tp) || tp <= 0) {
          toast.error("Enter a valid trigger price");
          return;
        }
      }

      if (takeProfit && Number(takeProfit) <= 0) {
        toast.error("Take profit must be valid");
        return;
      }

      if (stopLoss && Number(stopLoss) <= 0) {
        toast.error("Stop loss must be valid");
        return;
      }

      setOrderLoading(true);
      const loadingToast = toast.loading(`${orderTypeLabel(normalized)} placing...`);

      const res = await fetch(buildApiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: currentSymbol,
          type: normalized,
          lot_size: vol,
          price: livePrice,
          trigger_price: pending ? Number(String(triggerPrice).replace(/,/g, "")) : null,
          take_profit: takeProfit ? Number(takeProfit) : null,
          stop_loss: stopLoss ? Number(stopLoss) : null,
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
      toast.success(`${orderTypeLabel(normalized)} placed ✅`);

      if (data?.balance !== undefined) setBalance(Number(data.balance || 0));
      else await fetchProfile();

      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Order failed");
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
        toast.error("Live price not available");
        return;
      }

      const loadingToast = toast.loading("Closing order...");

      const res = await fetch(buildApiUrl(`/api/orders/${orderId}/close`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ close_price: livePrice }),
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

      if (data?.balance !== undefined) setBalance(Number(data.balance || 0));
      else await fetchProfile();

      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Close order failed");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAccounts();
    fetchLivePrice();
    fetchOrders();

    const priceTimer = setInterval(fetchLivePrice, 1200);
    const orderTimer = setInterval(fetchOrders, 5000);
    const profileTimer = setInterval(fetchProfile, 7000);

    return () => {
      clearInterval(priceTimer);
      clearInterval(orderTimer);
      clearInterval(profileTimer);
    };
  }, [currentSymbol]);

  const visibleOrders = useMemo(() => {
    const activeKey = cleanSymbol(currentSymbol);
    return orders.filter((o) => cleanSymbol(o.symbol) === activeKey);
  }, [orders, currentSymbol]);

  const openOrders = useMemo(() => visibleOrders.filter((o) => String(o.status || "open").toLowerCase() === "open"), [visibleOrders]);
  const pendingOrders = useMemo(() => visibleOrders.filter((o) => String(o.status || "").toLowerCase() === "pending"), [visibleOrders]);
  const closedOrders = useMemo(() => visibleOrders.filter((o) => String(o.status || "").toLowerCase() === "closed"), [visibleOrders]);

  const floatingPnL = useMemo(
    () => openOrders.reduce((sum, order) => sum + calcOrderPnl(order, livePrice, true), 0),
    [openOrders, livePrice]
  );

  const marginUsed = useMemo(() => openOrders.reduce((sum, order) => sum + Number(order.margin || 0), 0), [openOrders]);
  const equity = Number(balance || 0) + floatingPnL;
  const availableBalance = Number(balance || 0);

  const filteredWatchlist = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return WATCHLIST;
    return WATCHLIST.filter((item) => `${item.symbol} ${item.tvSymbol}`.toLowerCase().includes(q));
  }, [search]);

  const activeOrders = activeOrdersTab === "open" ? openOrders : activeOrdersTab === "pending" ? pendingOrders : closedOrders;

  const accountSummary = {
    id: activeAccount?.account_no || activeAccount?.id || "—",
    currency: activeAccount?.currency || "USC",
    type: activeAccount?.account_type || "real",
    platform: activeAccount?.platform || "Standard Cent",
  };

  const stats = [
    { label: "Balance", value: availableBalance.toFixed(2), positive: true },
    { label: "Equity", value: equity.toFixed(2), positive: true },
    { label: "Floating PnL", value: `${floatingPnL >= 0 ? "+" : ""}${floatingPnL.toFixed(2)}`, positive: floatingPnL >= 0 },
    { label: "Margin Used", value: marginUsed.toFixed(2), positive: true },
  ];

  return {
    chartRef,
    theme,
    setTheme,
    isDark,
    isFullscreen,
    setIsFullscreen,
    search,
    setSearch,
    selectedMarket,
    setSelectedMarket,
    leftOpen,
    setLeftOpen,
    rightOpen,
    setRightOpen,
    bottomOpen,
    setBottomOpen,
    livePrice,
    balance,
    accounts,
    activeAccount,
    accountSummary,
    orders,
    refreshingOrders,
    orderLoading,
    ticketMode,
    setTicketMode,
    orderKind,
    setOrderKind,
    volume,
    setVolume,
    takeProfit,
    setTakeProfit,
    stopLoss,
    setStopLoss,
    triggerPrice,
    setTriggerPrice,
    activeOrdersTab,
    setActiveOrdersTab,
    canTrade,
    refreshAll: () => {
      fetchProfile();
      fetchAccounts();
      fetchOrders();
      fetchLivePrice();
      toast.success("Refreshed");
    },
    switchAccount,
    placeOrder,
    closeOrder,
    filteredWatchlist,
    openOrders,
    pendingOrders,
    closedOrders,
    activeOrders,
    stats,
    currentSymbol,
  };
};
