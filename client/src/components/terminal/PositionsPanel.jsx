import React from "react";
import { X } from "lucide-react";
import { calcOrderPnl, cleanSymbol, formatPrice } from "../../utils/terminalHelpers";

const PositionsPanel = ({ activeTab, setActiveTab, orders, livePrice, closeOrder, onClose, accountStats, onEditProtection }) => {
  const tabs = [
    ["open", `Open ${orders.open.length}`],
    ["pending", `Pending ${orders.pending.length}`],
    ["closed", `Closed ${orders.closed.length}`],
  ];

  const rows = orders[activeTab] || [];

  return (
    <section className="flex h-full min-h-0 w-full flex-col border-t text-slate-100 lg:h-[250px] lg:min-h-[250px] lg:max-h-[250px]">
      <div className="flex items-center justify-between gap-4 px-4 pt-3 text-[15px]">
        <div className="flex items-center gap-8">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 ${activeTab === key ? "border-b-4 border-slate-200 text-white" : "text-slate-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="rounded-md border border-slate-700 bg-[#17232b] px-3 py-2 text-sm text-slate-300 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto border-t border-slate-700/60">
        <table className="w-full border-collapse text-[15px]">
          <thead className="sticky top-0 z-20 bg-[#10181d]">
            <tr className="text-left text-slate-400">
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Volume, lot</th>
              <th className="px-4 py-3 font-medium">Open price</th>
              <th className="px-4 py-3 font-medium">Current price</th>
              <th className="px-4 py-3 font-medium">T/P</th>
              <th className="px-4 py-3 font-medium">S/L</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Open time</th>
              <th className="px-4 py-3 font-medium">P/L, USC</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={11}>
                  No {activeTab} positions
                </td>
              </tr>
            ) : (
              rows.map((order) => {
                const isOpen = activeTab === "open";
                const pnl = calcOrderPnl(order, livePrice, isOpen);
                return (
                  <tr key={order.id} className="border-t border-slate-700/60">
                    <td className="px-4 py-4 whitespace-nowrap">{order.display_symbol || cleanSymbol(order.symbol)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-2 ${String(order.type).toLowerCase().startsWith("buy") ? "text-sky-400" : "text-rose-400"}`}>
                        <span className={`h-2 w-2 rounded-full ${String(order.type).toLowerCase().startsWith("buy") ? "bg-sky-400" : "bg-rose-400"}`} />
                        {String(order.type || "").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{Number(order.lot_size || 0).toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatPrice(order.open_price)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{Number(livePrice || 0).toFixed(3)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatPrice(order.take_profit)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatPrice(order.stop_loss)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{order.position_id || order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{order.created_at || order.open_time || "-"}</td>
                    <td className={`px-4 py-4 whitespace-nowrap font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {pnl >= 0 ? "+" : ""}
                      {pnl.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
  {isOpen ? (
    <div className="flex items-center gap-2">
      <button
        onClick={async () => {
          const tp = window.prompt(
            "Enter Take Profit",
            order.take_profit ?? ""
          );

          if (tp === null) return;

          const sl = window.prompt(
            "Enter Stop Loss",
            order.stop_loss ?? ""
          );

          if (sl === null) return;

          await onEditProtection?.(order.id, tp, sl);
        }}
        className="rounded border border-slate-600 px-3 py-1 text-[13px] hover:bg-slate-700"
      >
        Edit
      </button>

      <button
        onClick={() => closeOrder(order.id)}
        className="rounded border border-slate-600 px-3 py-1 text-[13px] hover:bg-slate-700"
      >
        Close
      </button>
    </div>
  ) : (
    <span className="text-slate-500">—</span>
  )}
</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-8 border-t px-4 py-3 text-[15px] text-slate-200 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Balance:</span>
          <span className="font-semibold text-white">
            {Number(accountStats?.balance || 0).toFixed(2)} USC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Equity:</span>
          <span className="font-semibold text-white">
            {Number(accountStats?.equity || 0).toFixed(2)} USC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Floating P/L:</span>
          <span
            className={`font-semibold ${
              Number(accountStats?.floatingPnL || 0) >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {Number(accountStats?.floatingPnL || 0) >= 0 ? "+" : ""}
            {Number(accountStats?.floatingPnL || 0).toFixed(2)} USC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Margin Used:</span>
          <span className="font-semibold text-white">
            {Number(accountStats?.marginUsed || 0).toFixed(2)} USC
          </span>
        </div>
      </div>
    </section>
  );
};

export default PositionsPanel;