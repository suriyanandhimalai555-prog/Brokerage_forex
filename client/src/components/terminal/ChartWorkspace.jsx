import React, {
  memo,
  useEffect,
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

const ChartWorkspace = memo(
  ({
    chartRef,
    selectedMarket,
    livePrice,
    onToggleFullscreen,
    isFullscreen,
    placeOrder,
  }) => {
    const widgetRef = useRef(null);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let mounted = true;
      let timeoutId = null;

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

          if (widgetRef.current && widgetRef.current.remove) {
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
            symbol: selectedMarket?.tvSymbol || "XAUUSD",
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

          timeoutId = window.setTimeout(() => {
            if (mounted) setLoading(false);
          }, 800);
        } catch (err) {
          console.error("TradingView Error:", err);
          setLoading(false);
        }
      };

      createWidget();

      return () => {
        mounted = false;

        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }

        if (widgetRef.current && widgetRef.current.remove) {
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
        {/* TOOLBAR */}

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
          <button className="rounded bg-[#17232b] px-4 py-2 text-white">
            +
          </button>

          <button className="rounded bg-[#17232b] px-4 py-2 text-white">
            1m
          </button>

          <button className="whitespace-nowrap rounded bg-[#17232b] px-4 py-2 text-white">
            Indicators
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
            <RotateCcw size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
            <Save size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
            <ZoomIn size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
            <ZoomOut size={16} />
          </button>

          <button className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b]">
            <Settings2 size={16} />
          </button>

          {/* DESKTOP BUY SELL */}

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <button
              onClick={() => placeOrder("sell")}
              className="
                rounded bg-rose-500 px-5 py-2
                font-semibold text-white
                transition hover:bg-rose-600
              "
            >
              Sell {Number(livePrice || 0).toFixed(3)}
            </button>

            <button
              onClick={() => placeOrder("buy")}
              className="
                rounded bg-blue-500 px-5 py-2
                font-semibold text-white
                transition hover:bg-blue-600
              "
            >
              Buy {Number(livePrice || 0).toFixed(3)}
            </button>
          </div>

          <button
            onClick={onToggleFullscreen}
            className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded bg-[#17232b] md:ml-0"
          >
            {isFullscreen ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>
        </div>

        {/* MOBILE BUY SELL */}

        <div className="grid grid-cols-2 gap-2 border-b border-slate-700 bg-[#10181d] p-2 md:hidden">
          <button
            onClick={() => placeOrder("sell")}
            className="
              rounded bg-rose-500 py-3
              text-sm font-semibold text-white
            "
          >
            Sell {Number(livePrice || 0).toFixed(3)}
          </button>

          <button
            onClick={() => placeOrder("buy")}
            className="
              rounded bg-blue-500 py-3
              text-sm font-semibold text-white
            "
          >
            Buy {Number(livePrice || 0).toFixed(3)}
          </button>
        </div>

        {/* CHART */}

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
            <div
              className="
                absolute inset-0 z-10
                flex items-center justify-center
                bg-black/40 text-white
              "
            >
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
            "
          />
        </div>
      </div>
    );
  }
);

export default ChartWorkspace;