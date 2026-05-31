// import React, {
//   memo,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   Maximize2,
//   Minimize2,
//   RotateCcw,
//   Save,
//   Settings2,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";

// const SCRIPT_ID = "tradingview-widget-script";

// let tvScriptPromise = null;

// const loadTradingView = () => {
//   if (window.TradingView) return Promise.resolve();

//   if (tvScriptPromise) return tvScriptPromise;

//   tvScriptPromise = new Promise((resolve, reject) => {
//     const existing = document.getElementById(SCRIPT_ID);

//     if (existing) {
//       existing.onload = () => resolve();
//       return;
//     }

//     const script = document.createElement("script");

//     script.id = SCRIPT_ID;
//     script.src = "https://s3.tradingview.com/tv.js";
//     script.async = true;
//     script.onload = () => resolve();
//     script.onerror = reject;

//     document.body.appendChild(script);
//   });

//   return tvScriptPromise;
// };

// const waitForNextPaint = () =>
//   new Promise((resolve) => {
//     requestAnimationFrame(() => {
//       requestAnimationFrame(resolve);
//     });
//   });

// const ChartWorkspace = memo(
//   ({
//     chartRef,
//     selectedMarket,
//     livePrice,
//     onToggleFullscreen,
//     isFullscreen,
//     placeOrder,
//     volume,
//     setVolume,
//   }) => {
//     const widgetRef = useRef(null);
//     const containerRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const getPriceDecimals = () => {
//       const symbol = String(
//         selectedMarket?.displaySymbol ||
//         selectedMarket?.symbol ||
//         ""
//       ).toUpperCase();

//       // FOREX
//       if (
//         symbol.includes("EUR") ||
//         symbol.includes("GBP") ||
//         symbol.includes("AUD") ||
//         symbol.includes("NZD") ||
//         symbol.includes("CHF") ||
//         symbol.includes("CAD")
//       ) {
//         return 5;
//       }

//       // JPY
//       if (symbol.includes("JPY")) {
//         return 3;
//       }

//       // GOLD
//       if (
//         symbol.includes("XAU") ||
//         symbol.includes("GOLD")
//       ) {
//         return 3;
//       }

//       // CRYPTO
//       if (
//         symbol.includes("BTC") ||
//         symbol.includes("ETH") ||
//         symbol.includes("USDT")
//       ) {
//         return 2;
//       }

//       return 3;
//     };

//     const formatLivePrice = (price) => {
//       return Number(price || 0).toFixed(
//         getPriceDecimals()
//       );
//     };

//     const updateVolume = (type) => {
//       const current = Number(volume || 0.01);

//       if (type === "plus") {
//         setVolume((current + 0.01).toFixed(2));
//       } else {
//         setVolume(
//           Math.max(0.01, current - 0.01).toFixed(2)
//         );
//       }
//     };

//     useEffect(() => {
//       let mounted = true;
//       let timeoutId = null;

//       const createWidget = async () => {
//         try {
//           setLoading(true);

//           await loadTradingView();

//           if (!mounted) return;
//           if (!containerRef.current) return;

//           await waitForNextPaint();

//           if (!mounted) return;
//           if (!containerRef.current) return;

//           containerRef.current.innerHTML = "";

//           if (widgetRef.current && widgetRef.current.remove) {
//             try {
//               widgetRef.current.remove();
//             } catch (e) {
//               console.log(e);
//             }
//           }

//           const chartId = `tv_chart_${Date.now()}`;
//           const chartDiv = document.createElement("div");

//           chartDiv.id = chartId;
//           chartDiv.style.width = "100%";
//           chartDiv.style.height = "100%";
//           chartDiv.style.minHeight = "100%";

//           containerRef.current.appendChild(chartDiv);

//           widgetRef.current = new window.TradingView.widget({
//             container_id: chartId,
//             autosize: true,
//             symbol: selectedMarket?.tvSymbol || "XAUUSD",
//             interval: "1",
//             timezone: "Etc/UTC",
//             theme: "dark",
//             style: "1",
//             locale: "en",
//             toolbar_bg: "#0f171c",
//             enable_publishing: false,
//             allow_symbol_change: false,
//             hide_top_toolbar: true,
//             hide_side_toolbar: false,
//             withdateranges: false,
//             details: false,
//             hotlist: false,
//             calendar: false,
//             studies: [],
//             loading_screen: {
//               backgroundColor: "#0f171c",
//             },
//           });

//           timeoutId = window.setTimeout(() => {
//             if (mounted) setLoading(false);
//           }, 800);
//         } catch (err) {
//           console.error("TradingView Error:", err);
//           setLoading(false);
//         }
//       };

//       createWidget();

//       return () => {
//         mounted = false;

//         if (timeoutId) {
//           window.clearTimeout(timeoutId);
//         }

//         if (widgetRef.current && widgetRef.current.remove) {
//           try {
//             widgetRef.current.remove();
//           } catch (e) {
//             console.log(e);
//           }
//         }

//         if (containerRef.current) {
//           containerRef.current.innerHTML = "";
//         }
//       };
//     }, [selectedMarket?.tvSymbol]);

//     return (
//       <div
//         ref={chartRef}
//         className="
//           flex
//           h-full
//           min-h-[calc(100dvh-68px)]
//           min-w-0
//           w-full
//           flex-1
//           flex-col
//           overflow-hidden
//           bg-[#0f171c]
//           md:min-h-0
//         "
//       >
//         {/* TOOLBAR */}

//         <div
//           className="
//             flex
//             h-[58px]
//             shrink-0
//             items-center
//             gap-2
//             overflow-x-auto
//             border-b
//             border-slate-700
//             bg-[#0f171c]
//             px-2
//             sm:px-4
//           "
//         >
//           <button className="rounded bg-[#17232b] px-4 py-2 text-white">
//             +
//           </button>

//           <button className="rounded bg-[#17232b] px-4 py-2 text-white">
//             1m
//           </button>

//           <button className="whitespace-nowrap rounded bg-[#17232b] px-4 py-2 text-white">
//             Indicators
//           </button>

//           <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
//             <RotateCcw size={16} />
//           </button>

//           <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
//             <Save size={16} />
//           </button>

//           <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
//             <ZoomIn size={16} />
//           </button>

//           <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
//             <ZoomOut size={16} />
//           </button>

//           <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
//             <Settings2 size={16} />
//           </button>

//           {/* DESKTOP BUY SELL */}

//           <div className="ml-auto hidden items-center gap-3 md:flex">
//             <button
//               onClick={() => placeOrder("sell")}
//               className="
//                 rounded bg-rose-500 px-5 py-2
//                 font-semibold text-white
//                 transition hover:bg-rose-600
//               "
//             >
//               Sell {formatLivePrice(livePrice)}
//             </button>

//             <button
//               onClick={() => placeOrder("buy")}
//               className="
//                 rounded bg-blue-500 px-5 py-2
//                 font-semibold text-white
//                 transition hover:bg-blue-600
//               "
//             >
//               Buy {formatLivePrice(livePrice)}
//             </button>
//           </div>

//           <button
//             onClick={onToggleFullscreen}
//             className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] md:ml-0"
//           >
//             {isFullscreen ? (
//               <Minimize2 size={16} />
//             ) : (
//               <Maximize2 size={16} />
//             )}
//           </button>
//         </div>

//         {/* MOBILE BUY SELL */}
//         <div className="border-b border-slate-700 bg-[#0f171c] p-[2px] md:hidden">
//           <div className="grid grid-cols-[1fr_82px_1fr] overflow-hidden rounded-sm">
//             {/* SELL */}

//             <button
//               onClick={() => placeOrder("sell")}
//               className="
//         flex flex-col items-start
//         bg-rose-500
//         px-2 py-1
//         text-white
//       "
//             >
//               <span className="text-[10px] font-semibold uppercase opacity-90">
//                 Sell
//               </span>

//               <span className="mt-[1px] text-[24px] font-bold leading-none">
//                 {formatLivePrice(livePrice)}
//               </span>
//             </button>

//             {/* LOT SIZE */}

//             <div className="flex items-center bg-[#111c22] text-white">
//               <button
//                 onClick={() => updateVolume("minus")}
//                 className="
//           flex h-full w-6 items-center
//           justify-center
//           text-[15px]
//           text-slate-300
//           active:bg-slate-700
//         "
//               >
//                 ˅
//               </button>

//               <input
//                 value={volume}
//                 onChange={(e) => {
//                   const value = e.target.value;

//                   if (
//                     value === "" ||
//                     Number(value) >= 0
//                   ) {
//                     setVolume(value);
//                   }
//                 }}
//                 type="number"
//                 step="0.01"
//                 min="0.01"
//                 className="
//           w-full bg-transparent
//           text-center text-[14px]
//           font-medium text-white
//           outline-none
//           [appearance:textfield]
//         "
//               />

//               <button
//                 onClick={() => updateVolume("plus")}
//                 className="
//           flex h-full w-6 items-center
//           justify-center
//           text-[15px]
//           text-slate-300
//           active:bg-slate-700
//         "
//               >
//                 ˄
//               </button>
//             </div>

//             {/* BUY */}

//             <button
//               onClick={() => placeOrder("buy")}
//               className="
//         flex flex-col items-end
//         bg-blue-500
//         px-2 py-1
//         text-white
//       "
//             >
//               <span className="text-[10px] font-semibold uppercase opacity-90">
//                 Buy
//               </span>

//               <span className="mt-[1px] text-[24px] font-bold leading-none">
//                 {formatLivePrice(livePrice)}
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* CHART */}

//         <div
//           className="
//             relative
//             flex-1
//             min-h-[320px]
//             overflow-hidden
//             md:min-h-0
//           "
//         >
//           {loading && (
//             <div
//               className="
//                 absolute inset-0 z-10
//                 flex items-center justify-center
//                 bg-black/40 text-white
//               "
//             >
//               Loading chart...
//             </div>
//           )}

//           <div
//             ref={containerRef}
//             className="
//               absolute
//               inset-0
//               h-full
//               w-full
//             "
//           />
//         </div>
//       </div>
//     );
//   }
// );

// export default ChartWorkspace;


import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Settings2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const SCRIPT_ID = "tradingview-widget-script";

let tvScriptPromise = null;

const loadTradingView = () => {
  if (window.TradingView) return Promise.resolve();

  if (tvScriptPromise) return tvScriptPromise;

  tvScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);

    if (existing) {
      existing.onload = () => resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;

    document.body.appendChild(script);
  });

  return tvScriptPromise;
};

const waitForNextPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

const normalizeSymbol = (symbol) =>
  String(symbol || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^BINANCE:/, "")
    .replace(/^OANDA:/, "")
    .replace(/^TVC:/, "")
    .replace(/\//g, "");

const parseNumericText = (text) => {
  const cleaned = String(text || "").trim().replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
};

const ChartWorkspace = memo(
  ({
    chartRef,
    selectedMarket,
    livePrice,
    onToggleFullscreen,
    isFullscreen,
    placeOrder,
    volume,
    setVolume,
    openOrders = [],
    pendingOrders = [],
    onRefreshChart,
  }) => {
    const widgetRef = useRef(null);
    const containerRef = useRef(null);
    const overlayRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [scaleInfo, setScaleInfo] = useState(null);

    const getPriceDecimals = () => {
      const symbol = String(
        selectedMarket?.displaySymbol || selectedMarket?.symbol || ""
      ).toUpperCase();

      if (
        symbol.includes("EUR") ||
        symbol.includes("GBP") ||
        symbol.includes("AUD") ||
        symbol.includes("NZD") ||
        symbol.includes("CHF") ||
        symbol.includes("CAD")
      ) {
        return 5;
      }

      if (symbol.includes("JPY")) return 3;

      if (symbol.includes("XAU") || symbol.includes("GOLD")) return 3;

      if (
        symbol.includes("BTC") ||
        symbol.includes("ETH") ||
        symbol.includes("USDT")
      ) {
        return 2;
      }

      return 3;
    };

    const formatPrice = (price) =>
      Number(price || 0).toFixed(getPriceDecimals());

    const updateVolume = (type) => {
      const current = Number(volume || 0.01);

      if (type === "plus") {
        setVolume((current + 0.01).toFixed(2));
      } else {
        setVolume(Math.max(0.01, current - 0.01).toFixed(2));
      }
    };

    const currentSymbolOrders = useMemo(() => {
      const chartSymbol = normalizeSymbol(selectedMarket?.tvSymbol || "");

      return [...openOrders, ...pendingOrders].filter((order) => {
        const orderSymbol = normalizeSymbol(
          order.symbol || order.display_symbol || order.tvSymbol || ""
        );

        return (
          chartSymbol &&
          orderSymbol &&
          (chartSymbol === orderSymbol ||
            chartSymbol.includes(orderSymbol) ||
            orderSymbol.includes(chartSymbol))
        );
      });
    }, [openOrders, pendingOrders, selectedMarket?.tvSymbol]);

    const measureVisiblePriceScale = useCallback(() => {
      const host = containerRef.current;
      const overlay = overlayRef.current;

      if (!host || !overlay) return null;

      const overlayRect = overlay.getBoundingClientRect();
      if (!overlayRect.width || !overlayRect.height) return null;

      const nodes = host.querySelectorAll("*");
      const candidates = [];

      nodes.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        const text = String(el.textContent || "").trim();
        const price = parseNumericText(text);
        if (price === null) return;

        const rect = el.getBoundingClientRect();

        if (rect.width > 140 || rect.height > 28) return;
        if (rect.right < overlayRect.left + overlayRect.width * 0.72) return;
        if (rect.left < overlayRect.left + overlayRect.width * 0.45) return;
        if (rect.top < overlayRect.top + 18) return;

        const y = rect.top + rect.height / 2 - overlayRect.top;
        candidates.push({ price, y });
      });

      if (candidates.length < 2) return null;

      const deduped = [];
      const seen = new Set();

      for (const item of candidates) {
        const key = `${Math.round(item.price * 1000)}_${Math.round(item.y)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(item);
      }

      deduped.sort((a, b) => a.y - b.y);

      const top = deduped[0];
      const bottom = deduped[deduped.length - 1];

      if (
        !top ||
        !bottom ||
        !Number.isFinite(top.price) ||
        !Number.isFinite(bottom.price) ||
        top.y >= bottom.y ||
        top.price <= bottom.price
      ) {
        return null;
      }

      const priceSpan = top.price - bottom.price;
      const pixelSpan = bottom.y - top.y;

      if (priceSpan <= 0 || pixelSpan <= 0) return null;

      return {
        topPrice: top.price,
        topY: top.y,
        pixelsPerPrice: pixelSpan / priceSpan,
        height: overlayRect.height,
      };
    }, []);

    const priceToY = useCallback(
      (price) => {
        const p = Number(price);
        if (!Number.isFinite(p) || p <= 0) return null;
        if (!scaleInfo) return null;

        const y =
          scaleInfo.topY +
          (scaleInfo.topPrice - p) * scaleInfo.pixelsPerPrice;

        return Math.max(10, Math.min(scaleInfo.height - 10, y));
      },
      [scaleInfo]
    );

    useEffect(() => {
      let mounted = true;
      let rafId = 0;
      let intervalId = 0;
      let resizeObserver = null;
      let mutationObserver = null;

      const updateScale = () => {
        if (!mounted) return;
        const next = measureVisiblePriceScale();
        if (next) setScaleInfo(next);
      };

      if (loading) return undefined;

      updateScale();
      intervalId = window.setInterval(updateScale, 200);

      if (overlayRef.current && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(overlayRef.current);
      }

      if (containerRef.current && "MutationObserver" in window) {
        mutationObserver = new MutationObserver(() => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(updateScale);
        });

        mutationObserver.observe(containerRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }

      const onResize = () => updateScale();
      window.addEventListener("resize", onResize);

      return () => {
        mounted = false;
        window.removeEventListener("resize", onResize);
        window.clearInterval(intervalId);
        cancelAnimationFrame(rafId);
        resizeObserver?.disconnect();
        mutationObserver?.disconnect();
      };
    }, [loading, measureVisiblePriceScale, selectedMarket?.tvSymbol]);

    useEffect(() => {
      let mounted = true;

      const createWidget = async () => {
        try {
          setLoading(true);

          await loadTradingView();

          if (!mounted) return;
          if (!containerRef.current) return;

          await waitForNextPaint();

          if (!mounted) return;
          if (!containerRef.current) return;

          containerRef.current.innerHTML = "";

          if (widgetRef.current?.remove) {
            try {
              widgetRef.current.remove();
            } catch (e) {
              console.log(e);
            }
          }

          const chartId = `tv_chart_${Date.now()}`;
          const chartDiv = document.createElement("div");

          chartDiv.id = chartId;
          chartDiv.style.width = "100%";
          chartDiv.style.height = "100%";
          chartDiv.style.minHeight = "100%";

          containerRef.current.appendChild(chartDiv);

          widgetRef.current = new window.TradingView.widget({
            container_id: chartId,
            autosize: true,
            symbol: selectedMarket?.tvSymbol || "BINANCE:BTCUSDT",
            interval: "1",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#0f171c",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_top_toolbar: true,
            hide_side_toolbar: false,
            withdateranges: false,
            details: false,
            hotlist: false,
            calendar: false,
            studies: [],
            loading_screen: {
              backgroundColor: "#0f171c",
            },
          });

          if (widgetRef.current?.onChartReady) {
            widgetRef.current.onChartReady(() => {
              if (mounted) setLoading(false);
            });
          } else {
            window.setTimeout(() => {
              if (mounted) setLoading(false);
            }, 1000);
          }
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };

      createWidget();

      return () => {
        mounted = false;

        if (widgetRef.current?.remove) {
          try {
            widgetRef.current.remove();
          } catch (e) {
            console.log(e);
          }
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    }, [selectedMarket?.tvSymbol]);

    return (
      <div
        ref={chartRef}
        className="
          flex
          h-full
          min-h-[calc(100dvh-68px)]
          min-w-0
          w-full
          flex-1
          flex-col
          overflow-hidden
          bg-[#0f171c]
          md:min-h-0
        "
      >
        <div
          className="
            flex
            h-[58px]
            shrink-0
            items-center
            gap-2
            overflow-x-auto
            border-b
            border-slate-700
            bg-[#0f171c]
            px-2
            sm:px-4
          "
        >
          <button className="rounded bg-[#17232b] px-4 py-2 text-white" type="button">
            +
          </button>

          <button className="rounded bg-[#17232b] px-4 py-2 text-white" type="button">
            1m
          </button>

          <button className="whitespace-nowrap rounded bg-[#17232b] px-4 py-2 text-white" type="button">
            Indicators
          </button>

          <button
            onClick={() => onRefreshChart?.()}
            className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white"
            type="button"
          >
            <RotateCcw size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white" type="button">
            <Save size={16} />
          </button>

          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white"
            type="button"
          >
            <ZoomIn size={16} />
          </button>

          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white"
            type="button"
          >
            <ZoomOut size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white" type="button">
            <Settings2 size={16} />
          </button>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <button
              onClick={() => placeOrder("sell")}
              className="
                rounded bg-rose-500 px-5 py-2
                font-semibold text-white
                transition hover:bg-rose-600
              "
              type="button"
            >
              Sell {formatPrice(livePrice)}
            </button>

            <button
              onClick={() => placeOrder("buy")}
              className="
                rounded bg-blue-500 px-5 py-2
                font-semibold text-white
                transition hover:bg-blue-600
              "
              type="button"
            >
              Buy {formatPrice(livePrice)}
            </button>
          </div>

          <button
            onClick={onToggleFullscreen}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] text-white md:ml-0"
            type="button"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <div className="border-b border-slate-700 bg-[#0f171c] p-[2px] md:hidden">
          <div className="grid grid-cols-[1fr_82px_1fr] overflow-hidden rounded-sm">
            <button
              onClick={() => placeOrder("sell")}
              className="
                flex flex-col items-start
                bg-rose-500
                px-2 py-1
                text-white
              "
              type="button"
            >
              <span className="text-[10px] font-semibold uppercase opacity-90">
                Sell
              </span>

              <span className="mt-[1px] text-[24px] font-bold leading-none">
                {formatPrice(livePrice)}
              </span>
            </button>

            <div className="flex items-center bg-[#111c22] text-white">
              <button
                onClick={() => updateVolume("minus")}
                className="
                  flex h-full w-6 items-center
                  justify-center
                  text-[15px]
                  text-slate-300
                  active:bg-slate-700
                "
                type="button"
              >
                ˅
              </button>

              <input
                value={volume}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) {
                    setVolume(value);
                  }
                }}
                type="number"
                step="0.01"
                min="0.01"
                className="
                  w-full bg-transparent
                  text-center text-[14px]
                  font-medium text-white
                  outline-none
                  [appearance:textfield]
                "
              />

              <button
                onClick={() => updateVolume("plus")}
                className="
                  flex h-full w-6 items-center
                  justify-center
                  text-[15px]
                  text-slate-300
                  active:bg-slate-700
                "
                type="button"
              >
                ˄
              </button>
            </div>

            <button
              onClick={() => placeOrder("buy")}
              className="
                flex flex-col items-end
                bg-blue-500
                px-2 py-1
                text-white
              "
              type="button"
            >
              <span className="text-[10px] font-semibold uppercase opacity-90">
                Buy
              </span>

              <span className="mt-[1px] text-[24px] font-bold leading-none">
                {formatPrice(livePrice)}
              </span>
            </button>
          </div>
        </div>

        <div
          className="
            relative
            flex-1
            min-h-[320px]
            overflow-hidden
            md:min-h-0
          "
        >
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-white">
              Loading chart...
            </div>
          )}

          <div
  ref={containerRef}
  className="
    absolute
    inset-0
    h-full
    w-full
    pr-[92px]
  "
/>

          {/* RIGHT PRICE OVERLAY */}

<div
  className="
    pointer-events-none
    absolute
    right-0
    top-0
    bottom-0
    z-40
    w-[92px]
  "
>
  {currentSymbolOrders.map(
    (order, index) => {
      const side = String(
        order.type || ""
      ).toLowerCase();

      const isBuy =
        side.includes("buy");

      const price = Number(
        order.open_price ||
          order.trigger_price ||
          0
      );

      if (!price) return null;

      /*
        PERFECT POSITION
      */

      const current =
        Number(livePrice || 0);

      const diff =
        price - current;

      /*
        Dynamic BTC scaling
      */

      const symbol = String(
        selectedMarket?.tvSymbol || ""
      );

      let scale = 1;

      if (
        symbol.includes("BTC")
      ) {
        scale = 7;
      } else if (
        symbol.includes("ETH")
      ) {
        scale = 2;
      } else if (
        symbol.includes("XAU")
      ) {
        scale = 0.4;
      } else {
        scale = 0.01;
      }

      let top =
        50 - diff / scale;

      top = Math.max(
        8,
        Math.min(92, top)
      );

      return (
        <div
          key={
            order.id || index
          }
          className="absolute left-0 right-0"
          style={{
            top: `${top}%`,
          }}
        >
          {/* LINE */}

          <div
            className={`
              absolute
              right-[88px]
              h-[1px]
              w-[calc(100vw-540px)]
              ${
                isBuy
                  ? "bg-blue-500"
                  : "bg-rose-500"
              }
            `}
          />

          {/* LABEL */}

          <div
            className={`
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded
              px-2
              py-[3px]
              text-[11px]
              font-semibold
              text-white
              shadow-lg
              ${
                isBuy
                  ? "bg-blue-500"
                  : "bg-rose-500"
              }
            `}
          >
            {isBuy
              ? "BUY"
              : "SELL"}{" "}
            •{" "}
            {formatPrice(price)}
          </div>
        </div>
      );
    }
  )}
</div>
        </div>
      </div>
    );
  }
);

export default ChartWorkspace;