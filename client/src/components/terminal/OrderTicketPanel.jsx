import React from "react";

const PanelButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 rounded px-3 py-2 text-[15px] font-medium transition ${
      active ? "bg-slate-700 text-white" : "text-slate-300"
    }`}
  >
    {children}
  </button>
);

const OrderTicketPanel = ({
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
  livePrice,
  orderLoading,
  canTrade,
  placeOrder,
  currentSymbol,
  onClose,
}) => {
  const pendingMode = orderKind === "limit";
  const baseButtonClass =
    "rounded-xl px-4 py-4 text-[16px] font-semibold transition disabled:opacity-60";

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[#111c22] text-slate-100 border-l lg:w-[344px]">
      <div className="flex items-center gap-2 border-b border-slate-700/60 px-4 py-4">
        <div className="text-[15px] font-semibold">
          {currentSymbol || "XAU/USD"}
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-xl leading-none text-slate-300 hover:text-white"
          title="Close panel"
        >
          ×
        </button>
      </div>

      <div className="no-scrollbar overflow-auto px-4 py-4">
        <div className="flex items-center justify-between rounded-md border border-slate-600/70 bg-[#17232b] p-2">
          <button
            onClick={() => setTicketMode("one_click")}
            className={`flex-1 rounded px-3 py-2 text-[15px] font-medium ${
              ticketMode === "one_click"
                ? "bg-slate-700 text-white"
                : "text-slate-300"
            }`}
          >
            One-click form
          </button>
          <button
            onClick={() => setTicketMode("regular")}
            className={`flex-1 rounded px-3 py-2 text-[15px] font-medium ${
              ticketMode === "regular"
                ? "bg-slate-700 text-white"
                : "text-slate-300"
            }`}
          >
            Regular form
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-md border border-slate-600/70 bg-[#17232b] p-1 text-[15px]">
          <PanelButton
            active={orderKind === "market"}
            onClick={() => setOrderKind("market")}
          >
            Market
          </PanelButton>
          <PanelButton
            active={orderKind === "limit"}
            onClick={() => setOrderKind("limit")}
          >
            Limit
          </PanelButton>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[15px] text-slate-200">
            Volume
          </label>
          <div className="flex items-stretch overflow-hidden rounded-md border border-slate-600/70 bg-[#17232b]">
            <input
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              type="number"
              step="0.01"
              min="0.01"
              className="w-full bg-transparent px-4 py-3 text-[16px] outline-none placeholder:text-slate-500"
            />
            <div className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
              Lots
            </div>
            <button className="border-l border-slate-600/70 px-4 text-2xl text-slate-300">
              −
            </button>
            <button className="border-l border-slate-600/70 px-4 text-2xl text-slate-300">
              +
            </button>
          </div>
        </div>

        {orderKind === "limit" && (
          <div className="mt-4">
            <label className="mb-2 block text-[15px] text-slate-200">
              Trigger Price
            </label>
            <input
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              type="text"
              className="w-full rounded-md border border-slate-600/70 bg-[#17232b] px-4 py-3 text-[16px] outline-none"
              placeholder={livePrice ? livePrice.toFixed(3) : "Enter price"}
            />
          </div>
        )}

        {ticketMode === "regular" && (
          <>
            <div className="mt-4">
              <label className="mb-2 block text-[15px] text-slate-200">
                Take Profit
              </label>
              <div className="flex items-stretch overflow-hidden rounded-md border border-slate-600/70 bg-[#17232b]">
                <input
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full bg-transparent px-4 py-3 text-[16px] outline-none placeholder:text-slate-500"
                  placeholder="Not set"
                />
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  Price
                </button>
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  −
                </button>
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  +
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[15px] text-slate-200">
                Stop Loss
              </label>
              <div className="flex items-stretch overflow-hidden rounded-md border border-slate-600/70 bg-[#17232b]">
                <input
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full bg-transparent px-4 py-3 text-[16px] outline-none placeholder:text-slate-500"
                  placeholder="Not set"
                />
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  Price
                </button>
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  −
                </button>
                <button className="border-l border-slate-600/70 px-4 py-3 text-[15px] text-slate-300">
                  +
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          {!pendingMode ? (
            <>
              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("buy")}
                className={`${baseButtonClass} bg-blue-500 text-white hover:bg-blue-400`}
              >
                <div>Buy</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>

              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("sell")}
                className={`${baseButtonClass} bg-rose-500 text-white hover:bg-rose-400`}
              >
                <div>Sell</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("buy_limit")}
                className={`${baseButtonClass} bg-emerald-600 text-white hover:bg-emerald-500`}
              >
                <div>Buy Limit</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>

              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("sell_limit")}
                className={`${baseButtonClass} bg-rose-700 text-white hover:bg-rose-600`}
              >
                <div>Sell Limit</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>

              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("buy_stop")}
                className={`${baseButtonClass} bg-sky-700 text-white hover:bg-sky-600`}
              >
                <div>Buy Stop</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>

              <button
                disabled={!canTrade || orderLoading}
                onClick={() => placeOrder("sell_stop")}
                className={`${baseButtonClass} bg-orange-700 text-white hover:bg-orange-600`}
              >
                <div>Sell Stop</div>
                <div className="mt-1 text-[13px] font-normal">
                  {livePrice ? livePrice.toFixed(2) : "--"}
                </div>
              </button>
            </>
          )}
        </div>

        <div className="mt-3 text-center text-[13px] text-slate-400">
          {ticketMode === "one_click"
            ? "One-click trading is enabled"
            : "Regular order entry"}
        </div>

        <div className="mt-4 border-t border-slate-700/60 pt-4 text-[14px] text-slate-300">
          <div className="flex items-center justify-between">
            <span>Fees:</span>
            <span>≈ 0.28 USC</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Leverage:</span>
            <span>1:2000</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Margin:</span>
            <span>2.23 USC</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OrderTicketPanel;