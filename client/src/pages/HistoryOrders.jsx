import React, { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const closedOrders = [
  {
    id: 1,
    symbol: "XAU/USD",
    type: "Sell",
    openTime: "20 Apr 08:48:35",
    closeTime: "20 Apr 08:51:15",
    lots: "0.01",
    openPrice: "4,792.895",
    closePrice: "4,794.975",
    profit: -2.1,
  },
  {
    id: 2,
    symbol: "XAU/USD",
    type: "Buy",
    openTime: "20 Apr 08:47:36",
    closeTime: "20 Apr 08:51:10",
    lots: "0.01",
    openPrice: "4,794.405",
    closePrice: "4,795.595",
    profit: 1.2,
  },
];

const openOrders = [
  {
    id: 1,
    symbol: "XAU/USD",
    type: "Sell",
    openTime: "20 Apr 09:37:10",
    lots: "0.01",
    openPrice: "4,785.294",
    positionId: "1226926708",
    commission: "0",
  },
  {
    id: 2,
    symbol: "XAU/USD",
    type: "Buy",
    openTime: "20 Apr 09:36:48",
    lots: "0.01",
    openPrice: "4,786.215",
    positionId: "1226925425",
    commission: "0",
  },
];

/* ---------------- COMPONENT ---------------- */

const HistoryOrders = () => {
  const [tab, setTab] = useState("closed");

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold border-b pb-6">History of orders</h1>


      <select className="border px-4 py-2 rounded-lg text-sm">
        <option>Standard Cent #263244830</option>
      </select>

      {/* FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">

          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTab("closed")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200
      ${tab === "closed"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Closed orders
            </button>

            <button
              onClick={() => setTab("open")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200
      ${tab === "open"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Open orders
            </button>
          </div>

          <select className="border px-4 py-2 rounded-lg text-sm">
            <option>All time</option>
          </select>
        </div>

        {/* CSV BUTTON */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm">
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 text-left">
              {tab === "closed" ? (
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Opening time</th>
                  <th className="px-4 py-3">Closing time</th>
                  <th className="px-4 py-3">Lots</th>
                  <th className="px-4 py-3">Opening price</th>
                  <th className="px-4 py-3">Closing price</th>
                  <th className="px-4 py-3 text-right">
                    Profit
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Opening time</th>
                  <th className="px-4 py-3">Lots</th>
                  <th className="px-4 py-3">Opening price</th>
                  <th className="px-4 py-3">Position ID</th>
                  <th className="px-4 py-3 text-right">
                    Commission
                  </th>
                </tr>
              )}
            </thead>

            <tbody>
              {tab === "closed"
                ? closedOrders.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {row.symbol}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${row.type === "Buy"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {row.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {row.openTime}
                    </td>

                    <td className="px-4 py-3">
                      {row.closeTime}
                    </td>

                    <td className="px-4 py-3">
                      {row.lots}
                    </td>

                    <td className="px-4 py-3">
                      {row.openPrice}
                    </td>

                    <td className="px-4 py-3">
                      {row.closePrice}
                    </td>

                    <td
                      className={`px-4 py-3 text-right font-medium ${row.profit > 0
                          ? "text-green-600"
                          : "text-red-500"
                        }`}
                    >
                      {row.profit > 0 ? "+" : ""}
                      {row.profit.toFixed(2)}
                    </td>
                  </tr>
                ))
                : openOrders.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {row.symbol}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${row.type === "Buy"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {row.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {row.openTime}
                    </td>

                    <td className="px-4 py-3">
                      {row.lots}
                    </td>

                    <td className="px-4 py-3">
                      {row.openPrice}
                    </td>

                    <td className="px-4 py-3">
                      {row.positionId}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {row.commission}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrders;