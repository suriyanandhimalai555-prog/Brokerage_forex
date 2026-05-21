import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DEFAULT_MARKET } from "../../data/terminalData";
import { useTradingTerminal } from "../../hooks/useTradingTerminal";
import TopBar from "./TopBar";
import InstrumentSidebar from "./InstrumentSidebar";
import ChartWorkspace from "./ChartWorkspace";
import OrderTicketPanel from "./OrderTicketPanel";
import PositionsPanel from "./PositionsPanel";

const TerminalShell = () => {
  const terminal = useTradingTerminal();

  const {
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
    accountSummary,
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
    refreshAll,
    placeOrder,
    closeOrder,
    filteredWatchlist,
    openOrders,
    pendingOrders,
    closedOrders,
    currentSymbol,
    accounts,
    activeAccount,
    switchAccount,
  } = terminal;

  const [mobileView, setMobileView] = useState("chart");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onFs = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", onFs);

    return () =>
      document.removeEventListener("fullscreenchange", onFs);
  }, [setIsFullscreen]);

  const createMarketObject = (item) => ({
    label: item.label || item.symbol,
    symbol: item.tvSymbol,
    displaySymbol: item.symbol || item.label,
    tvSymbol: item.tvSymbol,
    marketType: item.marketType || "forex",
    contractSize: item.contractSize || 1,
    spread: item.spread || "Variable",
  });

  const onSelectTopTab = (tab) => {
    setSelectedMarket(
      createMarketObject({
        label: tab.label,
        symbol: tab.label,
        tvSymbol: tab.tvSymbol || tab.symbol,
      })
    );
  };

  const onSelectInstrument = (item) => {
    setSelectedMarket(createMarketObject(item));
    setMobileView("chart");
    setMobileMenuOpen(false);
  };

  const openMobilePanel = (view) => {
    setMobileView(view);
    setMobileMenuOpen(false);
  };

  const mobilePanel = (() => {
    if (mobileView === "instruments") {
      return (
        <InstrumentSidebar
          search={search}
          setSearch={setSearch}
          watchlist={filteredWatchlist}
          onSelectInstrument={onSelectInstrument}
          activeSymbol={selectedMarket.tvSymbol}
          onClose={() => openMobilePanel("chart")}
        />
      );
    }

    if (mobileView === "positions") {
      return (
        <PositionsPanel
          activeTab={activeOrdersTab}
          setActiveTab={setActiveOrdersTab}
          orders={{
            open: openOrders,
            pending: pendingOrders,
            closed: closedOrders,
          }}
          livePrice={livePrice}
          closeOrder={closeOrder}
          onClose={() => openMobilePanel("chart")}
          accountStats={{
            balance,
            equity:
              Number(balance || 0) +
              openOrders.reduce((sum, order) => {
                const entry = Number(order.open_price || 0);
                const units = Number(order.units || 0);
                const side = String(order.type || "").toLowerCase();

                if (side.startsWith("buy")) {
                  return sum + (livePrice - entry) * units;
                }

                return sum + (entry - livePrice) * units;
              }, 0),
            floatingPnL: openOrders.reduce((sum, order) => {
              const entry = Number(order.open_price || 0);
              const units = Number(order.units || 0);
              const side = String(order.type || "").toLowerCase();

              if (side.startsWith("buy")) {
                return sum + (livePrice - entry) * units;
              }

              return sum + (entry - livePrice) * units;
            }, 0),
            marginUsed: openOrders.reduce(
              (sum, order) =>
                sum + Number(order.margin || 0),
              0
            ),
          }}
        />
      );
    }

    if (mobileView === "ticket") {
      return (
        <OrderTicketPanel
          ticketMode={ticketMode}
          setTicketMode={setTicketMode}
          orderKind={orderKind}
          setOrderKind={setOrderKind}
          volume={volume}
          setVolume={setVolume}
          takeProfit={takeProfit}
          setTakeProfit={setTakeProfit}
          stopLoss={stopLoss}
          setStopLoss={setStopLoss}
          triggerPrice={triggerPrice}
          setTriggerPrice={setTriggerPrice}
          livePrice={livePrice}
          orderLoading={orderLoading}
          canTrade={canTrade}
          placeOrder={placeOrder}
          currentSymbol={currentSymbol}
          onClose={() => openMobilePanel("chart")}
        />
      );
    }

    return (
      <ChartWorkspace
        chartRef={chartRef}
        theme={theme}
        selectedMarket={selectedMarket}
        livePrice={livePrice}
        placeOrder={placeOrder}
        onToggleFullscreen={async () => {
          try {
            if (!chartRef.current) return;

            if (!document.fullscreenElement)
              await chartRef.current.requestFullscreen();
            else await document.exitFullscreen();
          } catch (err) {
            console.error(err);
            toast.error("Fullscreen not supported");
          }
        }}
        isFullscreen={isFullscreen}
        onRefreshChart={refreshAll}
      />
    );
  })();

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#0b1217]" : "bg-slate-50"
      } text-slate-100`}
    >
      {/* MOBILE */}
      <div className="flex min-h-screen flex-col lg:hidden">
        <TopBar
          accountSummary={accountSummary}
          balance={balance}
          onDeposit={() => toast("Deposit clicked")}
          onSelectTab={onSelectTopTab}
          activeTab={selectedMarket}
          accounts={accounts}
          activeAccount={activeAccount}
          switchAccount={switchAccount}
          onMobileMenuClick={() =>
            setMobileMenuOpen((prev) => !prev)
          }
        />

        <div className="relative flex-1 overflow-hidden">
          {mobilePanel}
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[68px] z-[60] bg-black/55 backdrop-blur-[2px]">
            <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-[#111c22] shadow-2xl">
              <button
                onClick={() => openMobilePanel("chart")}
                className={`flex w-full items-center justify-between border-b border-slate-800 px-4 py-4 text-left ${
                  mobileView === "chart"
                    ? "bg-[#1d2a31]"
                    : "hover:bg-[#17232b]"
                }`}
              >
                <span>Graph Page</span>
                <span className="text-slate-400">→</span>
              </button>

              <button
                onClick={() =>
                  openMobilePanel("instruments")
                }
                className={`flex w-full items-center justify-between border-b border-slate-800 px-4 py-4 text-left ${
                  mobileView === "instruments"
                    ? "bg-[#1d2a31]"
                    : "hover:bg-[#17232b]"
                }`}
              >
                <span>Instruments</span>
                <span className="text-slate-400">→</span>
              </button>

              <button
                onClick={() =>
                  openMobilePanel("positions")
                }
                className={`flex w-full items-center justify-between border-b border-slate-800 px-4 py-4 text-left ${
                  mobileView === "positions"
                    ? "bg-[#1d2a31]"
                    : "hover:bg-[#17232b]"
                }`}
              >
                <span>Order Positions</span>
                <span className="text-slate-400">→</span>
              </button>

              <button
                onClick={() =>
                  openMobilePanel("ticket")
                }
                className={`flex w-full items-center justify-between px-4 py-4 text-left ${
                  mobileView === "ticket"
                    ? "bg-[#1d2a31]"
                    : "hover:bg-[#17232b]"
                }`}
              >
                <span>Order Ticket</span>
                <span className="text-slate-400">→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden min-h-screen flex-col lg:flex">
        <TopBar
          accountSummary={accountSummary}
          balance={balance}
          onDeposit={() => toast("Deposit clicked")}
          onSelectTab={onSelectTopTab}
          activeTab={selectedMarket}
          accounts={accounts}
          activeAccount={activeAccount}
          switchAccount={switchAccount}
        />

        <div className="flex h-[calc(100vh-68px)] overflow-hidden">
          {leftOpen ? (
            <InstrumentSidebar
              search={search}
              setSearch={setSearch}
              watchlist={filteredWatchlist}
              onSelectInstrument={onSelectInstrument}
              activeSymbol={selectedMarket.tvSymbol}
              onClose={() => setLeftOpen(false)}
            />
          ) : (
            <button
              onClick={() => setLeftOpen(true)}
              className="absolute left-2 top-[86px] z-30 rounded-xl border border-slate-700 bg-[#17232b] px-3 py-2 text-sm text-slate-200 shadow-lg hover:bg-slate-700"
            >
              Instruments
            </button>
          )}

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
                  <ChartWorkspace
                    chartRef={chartRef}
                    theme={theme}
                    selectedMarket={selectedMarket}
                    livePrice={livePrice}
                    placeOrder={placeOrder}
                    onToggleFullscreen={async () => {
                      try {
                        if (!chartRef.current) return;

                        if (!document.fullscreenElement)
                          await chartRef.current.requestFullscreen();
                        else
                          await document.exitFullscreen();
                      } catch (err) {
                        console.error(err);
                        toast.error("Fullscreen not supported");
                      }
                    }}
                    isFullscreen={isFullscreen}
                    onRefreshChart={refreshAll}
                  />
                </div>

                {bottomOpen ? (
                  <PositionsPanel
                    activeTab={activeOrdersTab}
                    setActiveTab={setActiveOrdersTab}
                    orders={{
                      open: openOrders,
                      pending: pendingOrders,
                      closed: closedOrders,
                    }}
                    livePrice={livePrice}
                    closeOrder={closeOrder}
                    onClose={() => setBottomOpen(false)}
                    accountStats={{
                      balance,
                      equity:
                        Number(balance || 0) +
                        openOrders.reduce((sum, order) => {
                          const entry = Number(
                            order.open_price || 0
                          );

                          const units = Number(
                            order.units || 0
                          );

                          const side = String(
                            order.type || ""
                          ).toLowerCase();

                          if (side.startsWith("buy")) {
                            return sum + (livePrice - entry) * units;
                          }

                          return sum + (entry - livePrice) * units;
                        }, 0),

                      floatingPnL:
                        openOrders.reduce((sum, order) => {
                          const entry = Number(
                            order.open_price || 0
                          );

                          const units = Number(
                            order.units || 0
                          );

                          const side = String(
                            order.type || ""
                          ).toLowerCase();

                          if (side.startsWith("buy")) {
                            return sum + (livePrice - entry) * units;
                          }

                          return sum + (entry - livePrice) * units;
                        }, 0),

                      marginUsed: openOrders.reduce(
                        (sum, order) =>
                          sum + Number(order.margin || 0),
                        0
                      ),
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center border-t border-slate-700/60 bg-[#10181d] py-2">
                    <button
                      onClick={() => setBottomOpen(true)}
                      className="rounded-md border border-slate-700 bg-[#17232b] px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                    >
                      Open positions
                    </button>
                  </div>
                )}
              </div>

              {rightOpen ? (
                <OrderTicketPanel
                  ticketMode={ticketMode}
                  setTicketMode={setTicketMode}
                  orderKind={orderKind}
                  setOrderKind={setOrderKind}
                  volume={volume}
                  setVolume={setVolume}
                  takeProfit={takeProfit}
                  setTakeProfit={setTakeProfit}
                  stopLoss={stopLoss}
                  setStopLoss={setStopLoss}
                  triggerPrice={triggerPrice}
                  setTriggerPrice={setTriggerPrice}
                  livePrice={livePrice}
                  orderLoading={orderLoading}
                  canTrade={canTrade}
                  placeOrder={placeOrder}
                  currentSymbol={currentSymbol}
                  onClose={() => setRightOpen(false)}
                />
              ) : (
                <button
                  onClick={() => setRightOpen(true)}
                  className="absolute right-2 top-16 z-30 rounded-xl border border-slate-700 bg-[#17232b] px-3 py-2 text-sm text-slate-200 shadow-lg hover:bg-slate-700"
                >
                  Order ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalShell;