import React, { useEffect, useMemo, useState } from "react";

const initialAccounts = [
  {
    userId: 33,
    customerName: "Xtreme Demo",
    accountId: 10033,
    totalPnl: 12202.0,
    totalSpreadCommission: 0.0,
    accountType: "Funded",
    phase: "-",
    fund: 10000,
    balance: 12202,
    equity: 12202,
    margin: 2003.57,
    status: "ACTIVE",
    orders: [
      {
        sno: 1,
        uid: 142,
        edit: "✏️",
        time: "2025-10-09 14:34:10",
        symbol: "C:XAUUSD",
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
        closingTime: "2025-10-09 14:38:15",
        swap: 0,
        spreadCommn: 0,
      },
      {
        sno: 2,
        uid: 141,
        edit: "✏️",
        time: "2025-10-09 14:34:02",
        symbol: "C:XAUUSD",
        lot: 0.5,
        bs: "BUY",
        sl: 0,
        target: 0,
        status: "CLOSED",
        avg: 4007.59,
        exit: 4011.31,
        pnl: 186.0,
        sector: "metal",
        pair: "xxx",
        type: "market",
        trigger: 0,
        margin: 2003.8,
        reason: "transit",
        closingTime: "2025-10-09 14:38:15",
        swap: 0,
        spreadCommn: 0,
      },
      {
        sno: 3,
        uid: 140,
        edit: "✏️",
        time: "2025-10-09 14:34:02",
        symbol: "C:XAUUSD",
        lot: 0.5,
        bs: "BUY",
        sl: 0,
        target: 0,
        status: "CLOSED",
        avg: 4007.59,
        exit: 4011.38,
        pnl: 189.5,
        sector: "metal",
        pair: "xxx",
        type: "market",
        trigger: 0,
        margin: 2003.8,
        reason: "transit",
        closingTime: "2025-10-09 14:38:16",
        swap: 0,
        spreadCommn: 0,
      },
    ],
  },
  {
    userId: 22,
    customerName: "Jinson Joseph",
    accountId: 10022,
    totalPnl: 0.46,
    totalSpreadCommission: 0.0,
    accountType: "Challenge",
    phase: "Phase 1",
    fund: 1000,
    balance: 1000.46,
    equity: 1000.46,
    margin: 1001.05,
    status: "ACTIVE",
    orders: [
      {
        sno: 1,
        uid: 120,
        edit: "✏️",
        time: "2025-10-09 15:10:10",
        symbol: "C:XAUUSD",
        lot: 0.25,
        bs: "BUY",
        sl: 0,
        target: 0,
        status: "OPEN",
        avg: 4002.1,
        exit: 4002.56,
        pnl: 0.46,
        sector: "metal",
        pair: "xxx",
        type: "market",
        trigger: 0,
        margin: 1001.05,
        reason: "manual",
        closingTime: "-",
        swap: 0,
        spreadCommn: 0,
      },
    ],
  },
  {
    userId: 12,
    customerName: "Shivani",
    accountId: 10012,
    totalPnl: -98803.08,
    totalSpreadCommission: 0.0,
    accountType: "Challenge",
    phase: "Phase 1",
    fund: 1000,
    balance: 1000,
    equity: 1000,
    margin: 1000,
    status: "ACTIVE",
    orders: [
      {
        sno: 1,
        uid: 98,
        edit: "✏️",
        time: "2025-10-09 11:22:10",
        symbol: "C:XAUUSD",
        lot: 1,
        bs: "SELL",
        sl: 0,
        target: 0,
        status: "CLOSED",
        avg: 1200.22,
        exit: 1101.19,
        pnl: -98.03,
        sector: "metal",
        pair: "xxx",
        type: "market",
        trigger: 0,
        margin: 1200.22,
        reason: "transit",
        closingTime: "2025-10-09 11:30:44",
        swap: 0,
        spreadCommn: 0,
      },
    ],
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

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase());
};

const isNumericField = (key) => {
  const fields = [
    "lot",
    "sl",
    "target",
    "avg",
    "exit",
    "pnl",
    "trigger",
    "margin",
    "swap",
    "spreadCommn",
    "fund",
    "balance",
    "equity",
    "totalPnl",
    "totalSpreadCommission",
  ];
  return fields.some((f) => key.toLowerCase().includes(f.toLowerCase()));
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

const OrderClosed = () => {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialAccounts;

    return initialAccounts.filter((item) => {
      return (
        String(item.userId).includes(q) ||
        String(item.accountId).includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.accountType.toLowerCase().includes(q) ||
        item.phase.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));

  const pagedAccounts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, page, pageSize]);

  const startEntry = filteredAccounts.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, filteredAccounts.length);

  const openView = (account) => {
    setSelectedAccount(account);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedAccount(null);
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
              Closed Order List
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
                    className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                    CSV
                  </button>
                  <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                    PDF
                  </button>
                  <button className="h-10 px-4 rounded-lg bg-[#353b8f] text-white text-sm font-medium shadow-sm hover:bg-[#2a2f7f] transition">
                    Excel
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <label className="text-sm text-gray-700">Search:</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-[900px] w-full border-collapse text-xs">
                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left whitespace-nowrap">User ID</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Customer Name</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Account ID</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Account Type</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Phase</th>
                    {/* <th className="px-3 py-3 text-left whitespace-nowrap">Fund</th> */}
                    {/* <th className="px-3 py-3 text-left whitespace-nowrap">Balance</th> */}
                    <th className="px-3 py-3 text-left whitespace-nowrap">Equity</th>
                    {/* <th className="px-3 py-3 text-left whitespace-nowrap">Marigin</th> */}
                    <th className="px-3 py-3 text-left whitespace-nowrap">Total PNL</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedAccounts.length > 0 ? (
                    pagedAccounts.map((row) => (
                      <tr key={row.accountId} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2.5 whitespace-nowrap">{row.userId}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{row.customerName}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{row.accountId}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{row.accountType}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{row.phase}</td>
                        {/* <td className="px-3 py-2.5 whitespace-nowrap">{formatAmount(row.fund)}</td> */}
                        {/* <td className="px-3 py-2.5 whitespace-nowrap">{formatAmount(row.balance)}</td> */}
                        <td className="px-3 py-2.5 whitespace-nowrap">{formatAmount(row.equity)}</td>
                        {/* <td className="px-3 py-2.5 whitespace-nowrap">{formatAmount(row.margin)}</td> */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {formatAmount(row.totalPnl)}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <button
                            onClick={() => openView(row)}
                            className="px-3 py-1.5 text-xs bg-[#353b8f] text-white rounded-md hover:bg-[#2a2f7f] transition"
                          >
                            Show Orders
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {pagedAccounts.length > 0 ? (
                pagedAccounts.map((row) => (
                  <div key={row.accountId} className="border rounded-xl p-3 bg-white shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {row.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Account #{row.accountId}
                        </div>
                      </div>
                      <span className={`text-xs rounded-full px-2 py-1 ${statusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-3 text-gray-700">
                      <p>User ID: {row.userId}</p>
                      <p>Type: {row.accountType}</p>
                      <p>Phase: {row.phase}</p>
                      <p>PNL: {formatAmount(row.totalPnl)}</p>
                      <p>Spread: {formatAmount(row.totalSpreadCommission)}</p>
                    </div>

                    <button
                      onClick={() => openView(row)}
                      className="mt-3 w-full bg-[#353b8f] text-white py-2 rounded-lg text-sm"
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-8">
                  No records found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-700">
                Showing {startEntry} to {endEntry} of {filteredAccounts.length} entries
              </p>

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

      {/* Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm px-3 py-4 sm:px-4 flex items-center justify-center">
          <div className="w-full max-w-[1600px] max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b px-4 sm:px-6 py-4">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Open Order List
                </h3>

                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-700">
                  <p><b>Account ID:</b> {selectedAccount.accountId}</p>
                  <p><b>Customer Name:</b> {selectedAccount.customerName}</p>
                  <p><b>Total PNL:</b> {formatAmount(selectedAccount.totalPnl)}</p>
                  <p>
                    <b>Total Spread Commission:</b>{" "}
                    {formatAmount(selectedAccount.totalSpreadCommission)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAccount(null)}
                className="shrink-0 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(95vh-92px)] overflow-y-auto p-4 sm:p-6">
              {/* Desktop modal table */}
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-[1900px] w-full border-collapse text-[11px]">
                  <thead className="bg-[#353b8f] text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left whitespace-nowrap">S.No</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">UID</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Edit</th>
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
                      <th className="px-3 py-3 text-left whitespace-nowrap">Closing Time</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Swap</th>
                      <th className="px-3 py-3 text-left whitespace-nowrap">Spread Commn</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedAccount.orders?.length > 0 ? (
                      selectedAccount.orders.map((row) => (
                        <tr key={row.sno} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">{row.sno}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.uid}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.edit}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.time}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.symbol}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.lot}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`rounded-md px-2 py-1 font-semibold ${statusBadgeClass(row.bs)}`}>
                              {row.bs}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.sl}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.target}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`rounded-md px-2 py-1 font-semibold ${statusBadgeClass(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatAmount(row.avg)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatAmount(row.exit)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-blue-600 font-semibold">
                            {formatAmount(row.pnl)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.sector}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.pair}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.type}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.trigger}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{formatAmount(row.margin)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.reason}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.closingTime}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.swap}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.spreadCommn}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={22}
                          className="px-4 py-10 text-center text-sm text-gray-500"
                        >
                          No order rows available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile modal cards */}
              <div className="lg:hidden space-y-4">
                {selectedAccount.orders?.length > 0 ? (
                  selectedAccount.orders.map((row) => (
                    <div key={row.sno} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Order #{row.sno}
                          </div>
                          <div className="text-xs text-gray-500">
                            UID: {row.uid} • {row.symbol}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(row.status)}`}>
                            {row.status}
                          </span>
                          <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(row.bs)}`}>
                            {row.bs}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                        {[
                          ["Time", row.time],
                          ["Symbol", row.symbol],
                          ["Lot", row.lot],
                          ["SL", row.sl],
                          ["Target", row.target],
                          ["Avg", formatAmount(row.avg)],
                          ["Exit", formatAmount(row.exit)],
                          ["PNL", formatAmount(row.pnl)],
                          ["Sector", row.sector],
                          ["Pair", row.pair],
                          ["Type", row.type],
                          ["Trigger", row.trigger],
                          ["Margin", formatAmount(row.margin)],
                          ["Reason", row.reason],
                          ["Closing Time", row.closingTime],
                          ["Swap", row.swap],
                          ["Spread Commn", row.spreadCommn],
                        ].map(([label, value]) => (
                          <FieldCard key={label} label={label} value={String(value)} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-8">
                    No order rows available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderClosed;