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
} from "lucide-react";
import { toast } from "react-hot-toast";

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

const TradingTerminal = () => {
  const widgetRef = useRef(null);
  const chartWrapperRef = useRef(null);

  const [selectedMarket, setSelectedMarket] = useState(DEFAULT_ITEM);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [livePrice, setLivePrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [refreshingOrders, setRefreshingOrders] = useState(false);

  const currentSymbol = selectedMarket.tvSymbol;

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
      theme: "dark",
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

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data?.user?.balance !== undefined) {
        setBalance(Number(data.user.balance || 0));
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const fetchLivePrice = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/market/price/${encodeURIComponent(currentSymbol)}`
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

      const res = await fetch("http://localhost:5000/api/orders", {
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
  }, [currentSymbol]);

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

  const visibleOrders = useMemo(
    () => orders.filter((o) => o.symbol === currentSymbol),
    [orders, currentSymbol]
  );

  const openOrders = useMemo(
    () => visibleOrders.filter((o) => (o.status || "open").toLowerCase() === "open"),
    [visibleOrders]
  );

  const closedOrders = useMemo(
    () => visibleOrders.filter((o) => (o.status || "").toLowerCase() === "closed"),
    [visibleOrders]
  );

  const floatingPnL = useMemo(() => {
    if (!livePrice || selectedMarket.marketType !== "crypto") return 0;

    return openOrders.reduce((sum, order) => {
      const entry = Number(order.open_price || 0);
      const units = Number(order.units || 0);
      const side = String(order.type || "").toLowerCase();

      if (side === "buy") {
        return sum + (livePrice - entry) * units;
      }

      return sum + (entry - livePrice) * units;
    }, 0);
  }, [openOrders, livePrice, selectedMarket.marketType]);

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
        toast.error("Trading is enabled only for live markets.");
        return;
      }

      setOrderLoading(true);
      const loadingToast = toast.loading(`${type.toUpperCase()} order placing...`);

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: currentSymbol,
          type,
          lot_size: 0.01,
          price: livePrice,
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
      toast.success(`${type.toUpperCase()} order placed ✅`);

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
        toast.error("Trading is enabled only for live markets.");
        return;
      }

      const loadingToast = toast.loading("Closing order...");

      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/close`, {
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

  return (
    <div className="p-4 space-y-4 bg-white rounded-2xl shadow-sm">
      <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Trading Terminal</h2>
            <p className="text-sm text-gray-500">
              {/* // {selectedMarket.marketType === "crypto" */}
              {/* // ? "Live execution enabled" */}
              {/* // : "View mode only for this market until a live price feed is added."} */}
            </p>
          </div>

          <div className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pair, index, metal..."
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredSections.map((section) => (
              <div key={section.title} className="rounded-2xl border p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-xs text-gray-500">
                      {section.marketType.toUpperCase()} • Spread {section.spread}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{section.items.length}</span>
                </div>

                <div className="space-y-2">
                  {section.items.map((item) => {
                    const active = item.tvSymbol === currentSymbol;

                    return (
                      <button
                        key={item.tvSymbol}
                        onClick={() => setSelectedMarket(item)}
                        className={`w-full flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${active
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div
                            className={`text-xs ${active ? "text-gray-200" : "text-gray-500"}`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Wallet size={16} />
                Balance
              </div>
              <div className="mt-2 text-2xl font-semibold">{availableBalance.toFixed(2)}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <TrendingUp size={16} />
                Equity
              </div>
              <div className="mt-2 text-2xl font-semibold">{equity.toFixed(2)}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
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

            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Wallet size={16} />
                Margin Used
              </div>
              <div className="mt-2 text-2xl font-semibold">{marginUsed.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{selectedMarket.label}</h3>
              <p className="text-sm text-gray-500">
                Live price:{" "}
                <span className="font-semibold text-gray-800">
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
                className="inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-lg"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>
          </div>

          <div
            ref={chartWrapperRef}
            className={`w-full relative bg-black rounded-xl overflow-hidden ${isFullscreen ? "h-[100vh]" : "h-[500px]"
              }`}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                Loading Chart...
              </div>
            )}
            <div id={CONTAINER_ID} className="w-full h-full" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Lot Size</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={0.01}
                readOnly
                className="border px-3 py-2 rounded-lg w-28 bg-gray-50"
              />
            </div>

            <div className="text-sm text-gray-500">
              Buy/Sell is enabled only when live price is available for this market.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => placeOrder("buy")}
              disabled={orderLoading || !canTrade}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
            >
              {orderLoading ? "Loading..." : "BUY"}
            </button>

            <button
              onClick={() => placeOrder("sell")}
              disabled={orderLoading || !canTrade}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
            >
              {orderLoading ? "Loading..." : "SELL"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Open Orders</h3>
                <span className="text-sm text-gray-500">
                  {refreshingOrders ? "Refreshing..." : openOrders.length}
                </span>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto">
                {openOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No open orders.</p>
                ) : (
                  openOrders.map((o) => {
                    const entry = Number(o.open_price || 0);
                    const units = Number(o.units || 0);
                    const side = String(o.type || "").toLowerCase();
                    const pnl = livePrice
                      ? side === "buy"
                        ? (livePrice - entry) * units
                        : (entry - livePrice) * units
                      : 0;

                    return (
                      <div
                        key={o.id}
                        className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{o.symbol}</p>
                          <p className="text-sm text-gray-500">
                            {String(o.type || "").toUpperCase()} • Lot{" "}
                            {Number(o.lot_size || 0).toFixed(2)} • Units{" "}
                            {Number(o.units || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Open: {entry.toFixed(4)} • Live:{" "}
                            {livePrice ? livePrice.toFixed(4) : "-"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Margin: {Number(o.margin || 0).toFixed(2)} • Leverage{" "}
                            1:{Number(o.leverage || 100)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2">
                          <div
                            className={`text-sm font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-500"
                              }`}
                          >
                            PnL: {pnl >= 0 ? "+" : ""}
                            {pnl.toFixed(2)}
                          </div>

                          <button
                            onClick={() => closeOrder(o.id)}
                            disabled={!canTrade}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Closed Orders</h3>
                <span className="text-sm text-gray-500">{closedOrders.length}</span>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto">
                {closedOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No closed orders.</p>
                ) : (
                  closedOrders.map((o) => (
                    <div key={o.id} className="border rounded-2xl p-4">
                      <p className="font-medium">{o.symbol}</p>
                      <p className="text-sm text-gray-500">
                        {String(o.type || "").toUpperCase()} • Lot{" "}
                        {Number(o.lot_size || 0).toFixed(2)} • Units{" "}
                        {Number(o.units || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Open: {Number(o.open_price || 0).toFixed(4)} • Close:{" "}
                        {Number(o.close_price || 0).toFixed(4)}
                      </p>
                      <p
                        className={`text-sm font-medium ${Number(o.profit || 0) >= 0
                            ? "text-green-600"
                            : "text-red-500"
                          }`}
                      >
                        PnL: {Number(o.profit || 0).toFixed(2)}
                      </p>
                    </div>
                  ))
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