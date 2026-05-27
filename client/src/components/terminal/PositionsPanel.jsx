import React, { useState } from "react";
import { X } from "lucide-react";
import {
  calcOrderPnl,
  cleanSymbol,
  formatPrice,
} from "../../utils/terminalHelpers";

const PositionsPanel = ({
  activeTab,
  setActiveTab,
  orders,
  livePrice,
  closeOrder,
  onClose,
  accountStats,
  onEditProtection,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tpValue, setTpValue] = useState("");
  const [slValue, setSlValue] = useState("");
  const [saving, setSaving] = useState(false);

  const tabs = [
    ["open", `Open ${orders.open.length}`],
    ["pending", `Pending ${orders.pending.length}`],
    ["closed", `Closed ${orders.closed.length}`],
  ];

  const rows = orders[activeTab] || [];

  const getPriceDecimals = (symbol) => {
    const s = String(symbol || "").toUpperCase();

    if (
      s.includes("EUR") ||
      s.includes("GBP") ||
      s.includes("AUD") ||
      s.includes("NZD") ||
      s.includes("CHF") ||
      s.includes("CAD")
    ) {
      return 5;
    }

    if (s.includes("JPY")) return 3;

    if (s.includes("XAU") || s.includes("GOLD")) return 3;

    if (s.includes("BTC") || s.includes("ETH") || s.includes("USDT")) {
      return 2;
    }

    return 3;
  };

  const formatCurrentPrice = (order) => {
    const decimals = getPriceDecimals(order?.symbol);
    const value = Number(livePrice || 0);

    if (!Number.isFinite(value)) return "-";
    return value.toFixed(decimals);
  };

  const openEditPopup = (order) => {
    setSelectedOrder(order);
    setTpValue(
      order?.take_profit === null || order?.take_profit === undefined
        ? ""
        : String(order.take_profit)
    );
    setSlValue(
      order?.stop_loss === null || order?.stop_loss === undefined
        ? ""
        : String(order.stop_loss)
    );
    setIsEditOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
    setTpValue("");
    setSlValue("");
    setSaving(false);
  };

  const handleSaveProtection = async () => {
    if (!selectedOrder) return;

    try {
      setSaving(true);

      const tp = tpValue === "" ? null : Number(tpValue);
      const sl = slValue === "" ? null : Number(slValue);

      if (tp !== null && (!Number.isFinite(tp) || tp <= 0)) return;
      if (sl !== null && (!Number.isFinite(sl) || sl <= 0)) return;

      await onEditProtection?.(selectedOrder.id, tp, sl);
      closeEditPopup();
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    {
      label: "Balance",
      value: `${Number(accountStats?.balance || 0).toFixed(2)} USC`,
      tone: "text-white",
    },
    {
      label: "Equity",
      value: `${Number(accountStats?.equity || 0).toFixed(2)} USC`,
      tone: "text-white",
    },
    {
      label: "Floating P/L",
      value: `${Number(accountStats?.floatingPnL || 0) >= 0 ? "+" : ""}${Number(
        accountStats?.floatingPnL || 0
      ).toFixed(2)} USC`,
      tone:
        Number(accountStats?.floatingPnL || 0) >= 0
          ? "text-emerald-400"
          : "text-rose-400",
    },
    {
      label: "Margin Used",
      value: `${Number(accountStats?.marginUsed || 0).toFixed(2)} USC`,
      tone: "text-white",
    },
  ];

  const renderMobileCard = (order) => {
    const isOpen = activeTab === "open";
    const pnl = calcOrderPnl(order, livePrice, isOpen);
    const isBuy = String(order.type || "")
      .toLowerCase()
      .startsWith("buy");

    return (
      <div
        key={order.id}
        className="rounded-2xl border border-slate-700 bg-[#111c22] p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold text-white">
              {order.display_symbol || cleanSymbol(order.symbol)}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium ${isBuy
                    ? "bg-sky-500/15 text-sky-400"
                    : "bg-rose-500/15 text-rose-400"
                  }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isBuy ? "bg-sky-400" : "bg-rose-400"
                    }`}
                />
                {String(order.type || "")
                  .replace(/_/g, " ")
                  .replace(/^./, (c) => c.toUpperCase())}
              </span>

              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                Lot {Number(order.lot_size || 0).toFixed(2)}
              </span>

              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300">
                Pos {order.position_id || order.id}
              </span>
            </div>
          </div>

          <div
            className={`shrink-0 rounded-xl px-3 py-2 text-right ${pnl >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"
              }`}
          >
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              P/L
            </div>
            <div
              className={`text-[18px] font-bold leading-none ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
            >
              {pnl >= 0 ? "+" : ""}
              {pnl.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">Open price</div>
            <div className="mt-1 font-semibold text-white">
              {formatPrice(order.open_price)}
            </div>
          </div>

          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">Current price</div>
            <div className="mt-1 font-semibold text-white">
              {formatCurrentPrice(order)}
            </div>
          </div>

          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">T/P</div>
            <div className="mt-1 font-semibold text-white">
              {formatPrice(order.take_profit)}
            </div>
          </div>

          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">S/L</div>
            <div className="mt-1 font-semibold text-white">
              {formatPrice(order.stop_loss)}
            </div>
          </div>

          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">Open time</div>
            <div className="mt-1 line-clamp-2 text-[13px] font-medium text-white">
              {order.created_at || order.open_time || "-"}
            </div>
          </div>

          <div className="rounded-xl bg-[#17232b] px-3 py-3">
            <div className="text-[11px] text-slate-400">Position</div>
            <div className="mt-1 font-semibold text-white">
              {order.position_id || order.id}
            </div>
          </div>
        </div>

        {isOpen ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => openEditPopup(order)}
              className="rounded-xl border border-slate-600 bg-[#17232b] py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
            >
              Edit
            </button>

            <button
              onClick={() => closeOrder(order.id)}
              className="rounded-xl border border-slate-600 bg-[#17232b] py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-[#17232b] px-3 py-2.5 text-center text-sm text-slate-500">
            No actions available
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="flex h-full min-h-0 w-full flex-col text-slate-100 lg:h-[250px] lg:min-h-[250px] lg:max-h-[250px] lg:border-t">
        <div className="flex items-center justify-between gap-4 px-4 pt-3 text-[15px]">
          <div className="flex items-center gap-8">
            {tabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 ${activeTab === key
                    ? "border-b-4 border-slate-200 text-white"
                    : "text-slate-300"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-800 text-sm text-slate-300 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* MOBILE STATS */}
        <div className="px-3 pt-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {statCards.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-700 bg-[#111c22] px-3 py-2.5"
              >
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  {item.label}
                </div>
                <div className={`mt-1 text-[14px] font-semibold ${item.tone}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="min-h-0 flex-1 overflow-auto border-t border-slate-700/60 px-3 py-3 lg:hidden">
          <div className="space-y-3">
            {rows.length === 0 ? (
              <div className="rounded-2xl border border-slate-700 bg-[#111c22] px-4 py-8 text-center text-slate-400">
                No {activeTab} positions
              </div>
            ) : (
              rows.map(renderMobileCard)
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden min-h-0 flex-1 overflow-auto border-t border-slate-700/60 lg:block">
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
                  const isBuy = String(order.type || "")
                    .toLowerCase()
                    .startsWith("buy");

                  return (
                    <tr key={order.id} className="border-t border-slate-700/60">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {order.display_symbol || cleanSymbol(order.symbol)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-2 ${isBuy ? "text-sky-400" : "text-rose-400"
                            }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${isBuy ? "bg-sky-400" : "bg-rose-400"
                              }`}
                          />
                          {String(order.type || "")
                            .replace(/_/g, " ")
                            .replace(/^./, (c) => c.toUpperCase())}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {Number(order.lot_size || 0).toFixed(2)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatPrice(order.open_price)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatCurrentPrice(order)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatPrice(order.take_profit)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatPrice(order.stop_loss)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {order.position_id || order.id}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {order.created_at || order.open_time || "-"}
                      </td>

                      <td
                        className={`px-4 py-4 whitespace-nowrap font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {pnl.toFixed(2)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {isOpen ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditPopup(order)}
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

        <div className="hidden md:flex items-center gap-8 overflow-x-auto whitespace-nowrap border-t px-4 py-3 text-[15px] text-slate-200">
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
              className={`font-semibold ${Number(accountStats?.floatingPnL || 0) >= 0
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

      {isEditOpen && selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111c22] p-5 text-slate-100 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Edit Take Profit / Stop Loss
                </h3>
                <p className="text-sm text-slate-400">
                  {selectedOrder.display_symbol ||
                    cleanSymbol(selectedOrder.symbol)}
                </p>
              </div>

              <button
                onClick={closeEditPopup}
                className="rounded-md border border-slate-700 px-2 py-1 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Take Profit
                </label>
                <input
                  value={tpValue}
                  onChange={(e) => setTpValue(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full rounded-md border border-slate-600 bg-[#17232b] px-4 py-3 text-[15px] outline-none"
                  placeholder="Enter take profit"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Stop Loss
                </label>
                <input
                  value={slValue}
                  onChange={(e) => setSlValue(e.target.value)}
                  type="number"
                  step="0.0001"
                  className="w-full rounded-md border border-slate-600 bg-[#17232b] px-4 py-3 text-[15px] outline-none"
                  placeholder="Enter stop loss"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditPopup}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProtection}
                disabled={saving}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PositionsPanel;