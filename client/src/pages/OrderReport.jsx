import React, { useEffect, useMemo, useState } from "react";

const dummyOrders = [
  {
    sno: 1,
    uid: 142,
    time: "2025-10-09 14:34:10",
    symbol: "XAUUSD",
    lot: 0.5,
    bs: "BUY",
    sl: 0,
    target: 0,
    status: "CLOSED",
    avg: 4007.13,
    exit: 4011.4,
    pnl: 213.5,
    sector: "metal",
    pair: "xxx",
    type: "market",
    trigger: 0,
    margin: 2003.57,
    reason: "transit",
    phase: "Phase 1",
    closingTime: "2025-10-09 14:38:15",
    swap: 0,
    spreadCommn: 0,
    customerName: "Xtreme Demo",
  },
  {
    sno: 2,
    uid: 120,
    time: "2025-10-10 10:10:10",
    symbol: "BTCUSD",
    lot: 0.2,
    bs: "SELL",
    sl: 0,
    target: 0,
    status: "OPEN",
    avg: 60000,
    exit: "-",
    pnl: -50,
    sector: "crypto",
    pair: "btc",
    type: "market",
    trigger: 0,
    margin: 500,
    reason: "manual",
    phase: "Phase 2",
    closingTime: "-",
    swap: 0,
    spreadCommn: 0,
    customerName: "Jinson Joseph",
  },
  {
    sno: 3,
    uid: 98,
    time: "2025-10-11 09:22:44",
    symbol: "US30",
    lot: 1,
    bs: "BUY",
    sl: 0,
    target: 0,
    status: "CLOSED",
    avg: 35210.22,
    exit: 35280.11,
    pnl: 69.89,
    sector: "index",
    pair: "us30",
    type: "market",
    trigger: 0,
    margin: 1200.22,
    reason: "transit",
    phase: "Phase 1",
    closingTime: "2025-10-11 09:30:18",
    swap: 0,
    spreadCommn: 0,
    customerName: "Shivani",
  },
  {
    sno: 4,
    uid: 77,
    time: "2025-10-12 13:14:55",
    symbol: "EURUSD",
    lot: 0.3,
    bs: "SELL",
    sl: 1.092,
    target: 1.087,
    status: "CLOSED",
    avg: 1.0912,
    exit: 1.0879,
    pnl: 32.7,
    sector: "forex",
    pair: "eurusd",
    type: "market",
    trigger: 0,
    margin: 320.5,
    reason: "manual",
    phase: "Phase 3",
    closingTime: "2025-10-12 13:48:01",
    swap: 0,
    spreadCommn: 0.12,
    customerName: "Demo User",
  },
];

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (value === "-") return "-";

  const num = Number(value);
  if (Number.isNaN(num)) return value;

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateOnly = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const badgeClass = (value) => {
  const v = String(value || "").toUpperCase();
  if (v === "BUY") return "bg-blue-100 text-blue-700";
  if (v === "SELL") return "bg-red-100 text-red-700";
  if (v === "OPEN") return "bg-amber-100 text-amber-700";
  if (v === "CLOSED") return "bg-indigo-100 text-indigo-700";
  return "bg-gray-100 text-gray-700";
};

const Field = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
    <div className="text-[11px] uppercase tracking-wide text-gray-500">
      {label}
    </div>
    <div className="mt-1 text-sm font-medium text-gray-900 break-words">
      {value}
    </div>
  </div>
);

const OrderReport = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2025-10-09");
  const [toDate, setToDate] = useState("2025-10-12");
  const [selectedUser, setSelectedUser] = useState("-- Select Individual --");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const userOptions = useMemo(() => {
    const users = Array.from(new Set(dummyOrders.map((item) => item.customerName)));
    return ["-- Select Individual --", ...users];
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return dummyOrders.filter((item) => {
      const matchesSearch =
        !q ||
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(q);

      const itemDate = formatDateOnly(item.time);
      const matchesFrom = !fromDate || itemDate >= fromDate;
      const matchesTo = !toDate || itemDate <= toDate;
      const matchesUser =
        selectedUser === "-- Select Individual --" || item.customerName === selectedUser;

      return matchesSearch && matchesFrom && matchesTo && matchesUser;
    });
  }, [search, fromDate, toDate, selectedUser]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const startEntry = filteredOrders.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, filteredOrders.length);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleFilter = () => {
    setPage(1);
  };

  const handleRefresh = () => {
    setSearch("");
    setFromDate("2025-10-09");
    setToDate("2025-10-12");
    setSelectedUser("-- Select Individual --");
    setPageSize(10);
    setPage(1);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Order Report
              </h2>
              <p className="text-sm text-gray-600">
                Total Orders:{" "}
                <span className="text-blue-600 font-semibold">
                  {filteredOrders.length}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                PDF
              </button>
              <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                CSV
              </button>
              <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                Excel
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Individual User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {userOptions.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  className="h-10 px-4 bg-black text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-800 transition"
                >
                  Filter
                </button>
                <button
                  onClick={handleRefresh}
                  className="h-10 px-4 bg-red-500 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-red-600 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Search:</label>
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>


            <div className="hidden lg:block rounded-xl border border-gray-200 overflow-hidden">
              {/* ✅ SCROLL ONLY HERE */}
              <div className="w-full overflow-x-auto">
                <table className="min-w-[1400px] w-full text-[12px]">
                  <thead className="bg-[#353b8f] text-white">
                    <tr>
                      <th className="px-3 py-3 text-left whitespace-nowrap">S.No</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">UID</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Time</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Symbol</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Lot</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">BS</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">SL</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Target</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Status</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Avg</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Exit</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">PNL</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Sector</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Pair</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Type</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Trigger</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Margin</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Reason</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Phase</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Closing Time</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Swap</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Spread Commn</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedOrders.length > 0 ? (
                      pagedOrders.map((row) => (
                        <tr key={row.sno} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">{row.sno}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.uid}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.time}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.symbol}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.lot}</td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded ${badgeClass(row.bs)}`}>
                              {row.bs}
                            </span>
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">{row.sl}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.target}</td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded ${badgeClass(row.status)}`}>
                              {row.status}
                            </span>
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatAmount(row.avg)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatAmount(row.exit)}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap text-blue-600 font-semibold">
                            {formatAmount(row.pnl)}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">{row.sector}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.pair}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.type}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.trigger}</td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatAmount(row.margin)}
                          </td>

                          <td className="px-3 py-2 whitespace-nowrap">{row.reason}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.phase}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.closingTime}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.swap}</td>

                          <td className="px-3 py-2 whitespace-nowrap">
                            {formatAmount(row.spreadCommn)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={22} className="text-center py-10 text-gray-500">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="2xl:hidden space-y-3">
              {pagedOrders.length > 0 ? (
                pagedOrders.map((row) => (
                  <div key={row.sno} className="border rounded-xl p-3 shadow-sm bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">
                          {row.symbol}
                        </h3>
                        <p className="text-xs text-gray-500">
                          S.No: {row.sno} • UID: {row.uid}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-md ${badgeClass(row.bs)}`}>
                          {row.bs}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-md ${badgeClass(row.status)}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-3 text-gray-700">
                      <Field label="Time" value={row.time} />
                      <Field label="Customer" value={row.customerName} />
                      <Field label="Lot" value={row.lot} />
                      <Field label="SL" value={row.sl} />
                      <Field label="Target" value={row.target} />
                      <Field label="Avg" value={formatAmount(row.avg)} />
                      <Field label="Exit" value={formatAmount(row.exit)} />
                      <Field label="PNL" value={formatAmount(row.pnl)} />
                      <Field label="Sector" value={row.sector} />
                      <Field label="Pair" value={row.pair} />
                      <Field label="Type" value={row.type} />
                      <Field label="Trigger" value={row.trigger} />
                      <Field label="Margin" value={formatAmount(row.margin)} />
                      <Field label="Reason" value={row.reason} />
                      <Field label="Phase" value={row.phase} />
                      <Field label="Closing Time" value={row.closingTime} />
                      <Field label="Swap" value={row.swap} />
                      <Field label="Spread Commn" value={formatAmount(row.spreadCommn)} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-8">
                  No data available in table
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
              <p>Showing {startEntry} to {endEntry} of {filteredOrders.length} entries</p>

              <div className="inline-flex items-center rounded-lg overflow-hidden border border-gray-300 self-start sm:self-auto">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white text-gray-600 border-r border-gray-300 disabled:opacity-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm bg-white text-gray-600 border-r border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button className="px-4 py-2 text-sm bg-[#353b8f] text-white border-r border-gray-300">
                  {page}
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white text-gray-600 border-r border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm bg-white text-gray-600 disabled:opacity-50"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReport;