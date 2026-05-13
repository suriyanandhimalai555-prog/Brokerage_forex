import React, { useEffect, useMemo, useState } from "react";

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const num = Number(value);

  if (Number.isNaN(num)) return value;

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const statusBadgeClass = (value) => {
  const v = String(value || "").toUpperCase();

  if (v === "BUY") return "bg-blue-100 text-blue-700";
  if (v === "SELL") return "bg-red-100 text-red-700";
  if (v === "OPEN") return "bg-amber-100 text-amber-700";
  if (v === "CLOSED") return "bg-indigo-100 text-indigo-700";
  if (v === "ACTIVE") return "bg-emerald-100 text-emerald-700";

  return "bg-gray-100 text-gray-700";
};

const FieldCard = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
    <div className="text-[11px] uppercase tracking-wide text-gray-500">
      {label}
    </div>

    <div className="mt-1 text-sm font-medium text-gray-900 break-words">
      {value ?? "-"}
    </div>
  </div>
);

const AllOrder = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      const grouped = {};

      data.orders.forEach((order) => {
        const accountId = order.account_no;

        if (!grouped[accountId]) {
          grouped[accountId] = {
            userId: order.user_id,
            customerName: order.customer_name || "Unknown",
            accountId: order.account_no,
            totalPnl: 0,
            totalSpreadCommission: 0,
            accountType: order.account_type || "-",
            phase: "-",
            fund: order.balance || 0,
            balance: order.balance || 0,
            equity: order.balance || 0,
            margin: 0,
            status: "ACTIVE",
            orders: [],
          };
        }

        grouped[accountId].totalPnl += Number(order.profit || 0);

        grouped[accountId].margin += Number(order.margin || 0);

        grouped[accountId].orders.push({
          sno: order.id,
          uid: order.user_id,
          edit: "✏️",
          time: order.created_at,
          symbol: order.symbol,
          lot: order.lot_size,
          bs: String(order.side || "").toUpperCase(),
          sl: 0,
          target: 0,
          status: String(order.status || "").toUpperCase(),
          avg: order.open_price,
          exit: order.close_price,
          pnl: order.profit,
          sector: "-",
          pair: "-",
          type: order.type,
          trigger: order.trigger_price,
          margin: order.margin,
          reason: "-",
          closingTime: order.close_time || "-",
          swap: 0,
          spreadCommn: 0,
        });
      });

      setAllOrders(Object.values(grouped));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return allOrders;

    return allOrders.filter((item) => {
      return (
        String(item.userId).includes(q) ||
        String(item.accountId).includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.accountType.toLowerCase().includes(q)
      );
    });
  }, [search, allOrders]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / pageSize)
  );

  const pagedAccounts = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, page, pageSize]);

  const startEntry =
    filteredAccounts.length === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endEntry = Math.min(
    page * pageSize,
    filteredAccounts.length
  );

  const openView = (account) => {
    setSelectedAccount(account);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedAccount(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="px-4 sm:px-6 py-5 border-b bg-gradient-to-r from-white to-indigo-50">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              All Order List
            </h2>
          </div>

          <div className="p-4 sm:p-6 space-y-4">

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <span>Show</span>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <span>entries</span>
                </label>

              </div>

              <div className="flex items-center gap-2 justify-end">

                <label className="text-sm text-gray-700">
                  Search:
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">

              <table className="min-w-[900px] w-full border-collapse text-xs">

                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">User ID</th>
                    <th className="px-3 py-3 text-left">Customer Name</th>
                    <th className="px-3 py-3 text-left">Account ID</th>
                    <th className="px-3 py-3 text-left">Account Type</th>
                    <th className="px-3 py-3 text-left">Fund</th>
                    <th className="px-3 py-3 text-left">Balance</th>
                    <th className="px-3 py-3 text-left">Equity</th>
                    <th className="px-3 py-3 text-left">Margin</th>
                    <th className="px-3 py-3 text-left">Total PNL</th>
                    <th className="px-3 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center py-10"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : pagedAccounts.length > 0 ? (

                    pagedAccounts.map((row) => (

                      <tr
                        key={row.accountId}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-3 py-2.5">
                          {row.userId}
                        </td>

                        <td className="px-3 py-2.5">
                          {row.customerName}
                        </td>

                        <td className="px-3 py-2.5">
                          {row.accountId}
                        </td>

                        <td className="px-3 py-2.5">
                          {row.accountType}
                        </td>

                        <td className="px-3 py-2.5">
                          {formatAmount(row.fund)}
                        </td>

                        <td className="px-3 py-2.5">
                          {formatAmount(row.balance)}
                        </td>

                        <td className="px-3 py-2.5">
                          {formatAmount(row.equity)}
                        </td>

                        <td className="px-3 py-2.5">
                          {formatAmount(row.margin)}
                        </td>

                        <td className="px-3 py-2.5 text-blue-600 font-semibold">
                          {formatAmount(row.totalPnl)}
                        </td>

                        <td className="px-3 py-2.5">

                          <button
                            onClick={() => openView(row)}
                            className="px-3 py-1.5 text-xs bg-[#353b8f] text-white rounded-md"
                          >
                            Show Orders
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="text-center py-10"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <p className="text-sm text-gray-700">
                Showing {startEntry} to {endEntry} of{" "}
                {filteredAccounts.length} entries
              </p>

            </div>
          </div>
        </div>
      </div>

      {selectedAccount && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm px-3 py-4 flex items-center justify-center">

          <div className="w-full max-w-[1600px] max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-start justify-between gap-4 border-b px-4 sm:px-6 py-4">

              <div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  User Order List
                </h3>

                <div className="mt-2 text-sm text-gray-700">
                  <b>Customer:</b> {selectedAccount.customerName}
                </div>

              </div>

              <button
                onClick={() => setSelectedAccount(null)}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(95vh-92px)] overflow-y-auto p-4 sm:p-6">

              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">

                <table className="min-w-[1900px] w-full border-collapse text-[11px]">

                  <thead className="bg-[#353b8f] text-white">

                    <tr>
                      <th className="px-3 py-3 text-left">ID</th>
                      <th className="px-3 py-3 text-left">Time</th>
                      <th className="px-3 py-3 text-left">Symbol</th>
                      <th className="px-3 py-3 text-left">Lot</th>
                      <th className="px-3 py-3 text-left">Side</th>
                      <th className="px-3 py-3 text-left">Status</th>
                      <th className="px-3 py-3 text-left">Open</th>
                      <th className="px-3 py-3 text-left">Close</th>
                      <th className="px-3 py-3 text-left">PNL</th>
                      <th className="px-3 py-3 text-left">Type</th>
                      <th className="px-3 py-3 text-left">Trigger</th>
                      <th className="px-3 py-3 text-left">Margin</th>
                    </tr>

                  </thead>

                  <tbody>

                    {selectedAccount.orders?.map((row) => (

                      <tr
                        key={row.sno}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-3 py-2">
                          {row.sno}
                        </td>

                        <td className="px-3 py-2">
                          {row.time}
                        </td>

                        <td className="px-3 py-2">
                          {row.symbol}
                        </td>

                        <td className="px-3 py-2">
                          {row.lot}
                        </td>

                        <td className="px-3 py-2">

                          <span
                            className={`rounded-md px-2 py-1 font-semibold ${statusBadgeClass(row.bs)}`}
                          >
                            {row.bs}
                          </span>

                        </td>

                        <td className="px-3 py-2">

                          <span
                            className={`rounded-md px-2 py-1 font-semibold ${statusBadgeClass(row.status)}`}
                          >
                            {row.status}
                          </span>

                        </td>

                        <td className="px-3 py-2">
                          {formatAmount(row.avg)}
                        </td>

                        <td className="px-3 py-2">
                          {formatAmount(row.exit)}
                        </td>

                        <td className="px-3 py-2 text-blue-600 font-semibold">
                          {formatAmount(row.pnl)}
                        </td>

                        <td className="px-3 py-2">
                          {row.type}
                        </td>

                        <td className="px-3 py-2">
                          {row.trigger}
                        </td>

                        <td className="px-3 py-2">
                          {formatAmount(row.margin)}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrder;