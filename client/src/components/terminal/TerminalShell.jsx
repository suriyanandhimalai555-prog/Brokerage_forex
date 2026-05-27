import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BarChart3,
  LayoutGrid,
  Briefcase,
  FileText,
  Wallet,
} from "lucide-react";

import { useTradingTerminal } from "../../hooks/useTradingTerminal";
import TopBar from "./TopBar";
import InstrumentSidebar from "./InstrumentSidebar";
import ChartWorkspace from "./ChartWorkspace";
import OrderTicketPanel from "./OrderTicketPanel";
import PositionsPanel from "./PositionsPanel";

const MobileTabButton = ({ active, icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${active
        ? "text-white"
        : "text-slate-400 hover:text-slate-200"
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && (
        <span className="mt-1 h-[3px] w-8 rounded-full bg-white" />
      )}
    </button>
  );
};

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
    placeProtectionUpdate,
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
  const [mobileAccountsOpen, setMobileAccountsOpen] =
    useState(false);

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
  };

  const openMobileView = (view) => {
    setMobileView(view);
  };

  const openPnL = openOrders.reduce((sum, order) => {
    const entry = Number(order.open_price || 0);
    const units = Number(order.units || 0);
    const side = String(order.type || "").toLowerCase();

    if (side.startsWith("buy")) {
      return sum + (Number(livePrice || 0) - entry) * units;
    }

    return sum + (entry - Number(livePrice || 0)) * units;
  }, 0);

  const accountStats = {
    balance,
    equity: Number(balance || 0) + openPnL,
    floatingPnL: openPnL,
    marginUsed: openOrders.reduce(
      (sum, order) => sum + Number(order.margin || 0),
      0
    ),
  };

  const mobilePanel = (() => {
    if (mobileView === "instruments") {
      return (
        <InstrumentSidebar
          search={search}
          setSearch={setSearch}
          watchlist={filteredWatchlist}
          onSelectInstrument={onSelectInstrument}
          activeSymbol={selectedMarket?.tvSymbol}
          onClose={() => setMobileView("chart")}
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
          onEditProtection={placeProtectionUpdate}
          onClose={() => setMobileView("chart")}
          accountStats={accountStats}
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
          onClose={() => setMobileView("chart")}
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
        volume={volume}
        setVolume={setVolume}
        onToggleFullscreen={async () => {
          try {
            if (!chartRef.current) return;

            if (!document.fullscreenElement) {
              await chartRef.current.requestFullscreen();
            } else {
              await document.exitFullscreen();
            }
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
      className={`min-h-screen ${isDark ? "bg-[#0b1217]" : "bg-slate-50"
        } text-slate-100`}
    >
      {/* MOBILE ONLY */}
      <div className="flex min-h-screen flex-col lg:hidden">
        {/* No topbar on mobile */}
        <div className="relative flex-1 overflow-hidden pb-[76px]">
          {mobilePanel}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-[70] border-t border-slate-700 bg-[#0f171c] pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5">
            <MobileTabButton
              active={mobileView === "chart"}
              icon={BarChart3}
              label="Graph"
              onClick={() => openMobileView("chart")}
            />
            <MobileTabButton
              active={mobileView === "instruments"}
              icon={LayoutGrid}
              label="Instruments"
              onClick={() => openMobileView("instruments")}
            />
            <MobileTabButton
              active={mobileView === "positions"}
              icon={Briefcase}
              label="Positions"
              onClick={() => openMobileView("positions")}
            />
            <MobileTabButton
              active={mobileView === "ticket"}
              icon={FileText}
              label="Order Ticket"
              onClick={() => openMobileView("ticket")}
            />
            <MobileTabButton
              active={mobileAccountsOpen}
              icon={Wallet}
              label="Accounts"
              onClick={() =>
                setMobileAccountsOpen(true)
              }
            />
          </div>
        </nav>
        {mobileAccountsOpen && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-[2px]">
            <div
              className="
        absolute bottom-0 left-0 right-0
        rounded-t-[28px]
        border-t border-slate-700
        bg-[#111c22]
        shadow-2xl
      "
            >
              {/* HANDLE */}

              <div className="flex justify-center py-3">
                <div className="h-1.5 w-14 rounded-full bg-slate-600" />
              </div>

              {/* HEADER */}

              <div className="flex items-center justify-between px-5 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Trading Accounts
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Select active account
                  </p>
                </div>

                <button
                  onClick={() =>
                    setMobileAccountsOpen(false)
                  }
                  className="
            grid h-10 w-10 place-items-center
            rounded-full bg-[#17232b]
            text-slate-300
          "
                >
                  ×
                </button>
              </div>

              {/* ACCOUNT LIST */}

              <div className="max-h-[65vh] overflow-y-auto px-4 pb-8">
                <div className="space-y-3">
                  {accounts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-700 bg-[#17232b] px-4 py-10 text-center text-sm text-slate-400">
                      No accounts found
                    </div>
                  ) : (
                    accounts.map((account) => {
                      const isActive =
                        activeAccount?.id === account.id;

                      return (
                        <button
                          key={account.id}
                          onClick={() => {
                            switchAccount(account.id);
                            setMobileAccountsOpen(false);
                          }}
                          className={`
                    w-full rounded-2xl border px-4 py-4 text-left transition
                    ${isActive
                              ? "border-blue-500 bg-[#1d2a31]"
                              : "border-slate-700 bg-[#17232b]"
                            }
                  `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`
                            rounded-sm px-2 py-[2px]
                            text-[10px] font-bold
                            ${account.account_type === "demo"
                                      ? "bg-sky-500 text-white"
                                      : "bg-lime-300 text-black"
                                    }
                          `}
                                >
                                  {account.account_type === "demo"
                                    ? "Demo"
                                    : "Real"}
                                </span>

                                <span className="font-medium text-white">
                                  {account.platform || "Standard"}
                                </span>
                              </div>

                              <div className="mt-2 text-sm text-slate-400">
                                #
                                {account.account_no ||
                                  account.id}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-semibold text-white">
                                {Number(
                                  account.balance || 0
                                ).toFixed(2)}
                              </div>

                              <div className="text-xs text-slate-400">
                                {account.currency || "USD"}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
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
              activeSymbol={selectedMarket?.tvSymbol}
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

                        if (!document.fullscreenElement) {
                          await chartRef.current.requestFullscreen();
                        } else {
                          await document.exitFullscreen();
                        }
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
                    onEditProtection={placeProtectionUpdate}
                    onClose={() => setBottomOpen(false)}
                    accountStats={accountStats}
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