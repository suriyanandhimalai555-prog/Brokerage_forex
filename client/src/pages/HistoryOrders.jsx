import React, { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

const HistoryOrders = () => {
  const [tab, setTab] = useState("closed");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountLabel] = useState("Standard Cent #263244830");

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);

    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const normalizeOrder = (row) => {
    const status = (row.status || "open").toLowerCase();

    return {
      id: row.id,
      symbol: row.symbol || "-",
      type: row.type
        ? row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()
        : "-",
      openTime: formatDateTime(row.open_time || row.created_at),
      closeTime: formatDateTime(row.close_time),
      lots:
        row.lot_size !== null && row.lot_size !== undefined
          ? Number(row.lot_size).toFixed(2)
          : "-",
      openPrice: row.open_price ?? row.price ?? "-",
      closePrice: row.close_price ?? "-",
      profit:
        row.profit !== null && row.profit !== undefined
          ? Number(row.profit)
          : null,
      positionId: row.position_id ?? row.id ?? "-",
      commission: row.commission ?? "0",
      status,
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const list = Array.isArray(data.orders) ? data.orders : [];
      setOrders(list.map(normalizeOrder));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrders = useMemo(
    () =>
      orders.filter(
        (row) => row.status === "open" || row.status === "pending"
      ),
    [orders]
  );

  const closedOrders = useMemo(
    () => orders.filter((row) => row.status === "closed"),
    [orders]
  );

  const currentRows = tab === "closed" ? closedOrders : openOrders;

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold border-b pb-6">History of orders</h1>

      <select className="border px-4 py-2 rounded-lg text-sm">
        <option>{accountLabel}</option>
      </select>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTab("closed")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                tab === "closed"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Closed orders
            </button>

            <button
              onClick={() => setTab("open")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                tab === "open"
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

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm">
          <Download size={16} />
          Download CSV
        </button>
      </div>

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
                  <th className="px-4 py-3 text-right">Profit</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Opening time</th>
                  <th className="px-4 py-3">Lots</th>
                  <th className="px-4 py-3">Opening price</th>
                  <th className="px-4 py-3">Position ID</th>
                  <th className="px-4 py-3 text-right">Commission</th>
                </tr>
              )}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={tab === "closed" ? 8 : 7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length > 0 ? (
                tab === "closed" ? (
                  currentRows.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.symbol}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            row.type === "Buy"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.openTime}</td>
                      <td className="px-4 py-3">{row.closeTime}</td>
                      <td className="px-4 py-3">{row.lots}</td>
                      <td className="px-4 py-3">{row.openPrice}</td>
                      <td className="px-4 py-3">{row.closePrice}</td>
                      <td
                        className={`px-4 py-3 text-right font-medium ${
                          row.profit > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {row.profit > 0 ? "+" : ""}
                        {row.profit !== null ? row.profit.toFixed(2) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  currentRows.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.symbol}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            row.type === "Buy"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.openTime}</td>
                      <td className="px-4 py-3">{row.lots}</td>
                      <td className="px-4 py-3">{row.openPrice}</td>
                      <td className="px-4 py-3">{row.positionId}</td>
                      <td className="px-4 py-3 text-right">{row.commission}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={tab === "closed" ? 8 : 7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrders;