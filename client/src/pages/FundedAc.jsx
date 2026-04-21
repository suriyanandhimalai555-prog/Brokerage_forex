import React, { useEffect, useMemo, useState } from "react";

const initialAccounts = [
  {
    userId: 33,
    customerName: "Xtreme Demo",
    accountId: 10033,
    fund: 112202,
    balance: 112202,
    equity: 112202,
    margin: 2003.57,
    totalPnl: 12202,
    status: "ACTIVE",
    orders: [],
  },
  {
    userId: 22,
    customerName: "Jinson Joseph",
    accountId: 10022,
    fund: 10000,
    balance: 10000,
    equity: 10000,
    margin: 1000,
    totalPnl: 0.46,
    status: "ACTIVE",
    orders: [],
  },
];

const format = (val) =>
  Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const FundedAc = () => {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialAccounts.filter((i) =>
      Object.values(i).join(" ").toLowerCase().includes(q)
    );
  }, [search]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="max-w-[1700px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* 🔥 Header (same as your screenshot) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <div>
            <h2 className="text-lg font-semibold">Funded Ac.</h2>
            <p className="text-sm text-gray-600">
              Total Used Margin: <span className="text-blue-600">$ 0.00</span>
            </p>
          </div>

          <div className="flex gap-2 mt-3 md:mt-0">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
              Buy Order
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">
              Sell Order
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#353b8f] text-white rounded">
                CSV
              </button>
              <button className="px-4 py-2 bg-[#353b8f] text-white rounded">
                PDF
              </button>
              <button className="px-4 py-2 bg-[#353b8f] text-white rounded">
                Excel
              </button>
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

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl">
            <table className="min-w-[900px] w-full text-xs">
              <thead className="bg-[#353b8f] text-white">
                <tr>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left">Customer Name</th>
                  <th className="p-3 text-left">Account ID</th>
                  <th className="p-3 text-left">Fund</th>
                  <th className="p-3 text-left">Balance</th>
                  <th className="p-3 text-left">Equity</th>
                  <th className="p-3 text-left">Margin</th>
                  <th className="p-3 text-left">Total PNL</th>
                  <th className="p-3 text-left">Details</th>
                </tr>
              </thead>

              <tbody>
                {paged.length > 0 ? (
                  paged.map((row) => (
                    <tr key={row.accountId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{row.userId}</td>
                      <td className="p-3">{row.customerName}</td>
                      <td className="p-3">{row.accountId}</td>
                      <td className="p-3">{format(row.fund)}</td>
                      <td className="p-3">{format(row.balance)}</td>
                      <td className="p-3">{format(row.equity)}</td>
                      <td className="p-3">{format(row.margin)}</td>
                      <td className="p-3">{format(row.totalPnl)}</td>
                      <td className="p-3">
                        <button className="px-3 py-1 bg-[#353b8f] text-white rounded text-xs">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paged.map((row) => (
              <div key={row.accountId} className="border rounded-xl p-3 shadow-sm bg-white">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-sm">{row.customerName}</h3>
                  <span className="text-xs text-gray-500">
                    #{row.accountId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <p>Fund: {format(row.fund)}</p>
                  <p>Balance: {format(row.balance)}</p>
                  <p>Equity: {format(row.equity)}</p>
                  <p>PNL: {format(row.totalPnl)}</p>
                </div>

                <button className="mt-3 w-full bg-[#353b8f] text-white py-2 rounded text-sm">
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm text-gray-600">
            <p>Showing {filtered.length} entries</p>
            <p>
              Total P/L: <span className="text-blue-600">$ 0.00</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundedAc;