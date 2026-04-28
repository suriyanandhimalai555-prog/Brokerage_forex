import React, { useState, useMemo } from "react";

const dummyData = [
  {
    id: 1,
    accountId: 10010,
    name: "RAJKUMAR",
    email: "rajaeronautics@gmail.com",
    token: "TXN12345",
    date: "2025-10-05 10:30:00",
    method: "Crypto",
    accountInfo: "BTC Wallet",
    amount: 250,
    status: "Pending",
    reason: "-",
    type: "Manual",
  },
  {
    id: 2,
    accountId: 10012,
    name: "Shivani",
    email: "shivani@gmail.com",
    token: "TXN67890",
    date: "2025-10-06 12:45:00",
    method: "Bank",
    accountInfo: "HDFC - 2345",
    amount: 500,
    status: "Approved",
    reason: "-",
    type: "Auto",
  },
];

const badge = (val) => {
  if (val === "Approved") return "bg-green-100 text-green-700";
  if (val === "Pending") return "bg-yellow-100 text-yellow-700";
  if (val === "Rejected") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};

const Withdraw = () => {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return dummyData.filter((d) => {
      const matchSearch = Object.values(d)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const date = d.date.slice(0, 10);
      const matchFrom = !from || date >= from;
      const matchTo = !to || date <= to;

      return matchSearch && matchFrom && matchTo;
    });
  }, [search, from, to]);

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            Withdraw Details
          </h2>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">

          {/* ROW 1 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              Show
              <select className="border rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              entries
            </div>

            <div className="flex gap-2">
              <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">CSV</button>
              <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">PDF</button>
              <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">Excel</button>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex flex-wrap items-center gap-3 justify-between">

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">From:</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />

              <span className="text-sm">To:</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />

              <button className="px-3 py-1 bg-black text-white rounded text-sm">
                Go
              </button>

              <button
                onClick={() => {
                  setFrom("");
                  setTo("");
                  setSearch("");
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Search:</span>
              <input
                className="border rounded-md px-3 py-2 text-sm"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="rounded-xl border overflow-hidden">

            {/* ONLY TABLE SCROLL */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1600px] w-full text-sm">

                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3">S.No</th>
                    <th>Account ID</th>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>Token</th>
                    <th>Date & Time</th>
                    <th>Method</th>
                    <th>Account Info</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr key={d.id} className="border-b text-center hover:bg-gray-50">
                        <td className="py-2">{i + 1}</td>
                        <td>{d.accountId}</td>
                        <td>{d.name}</td>
                        <td>{d.email}</td>
                        <td>{d.token}</td>
                        <td>{d.date}</td>
                        <td>{d.method}</td>
                        <td>{d.accountInfo}</td>
                        <td>{d.amount}</td>

                        <td>
                          <span className={`px-2 py-1 rounded ${badge(d.status)}`}>
                            {d.status}
                          </span>
                        </td>

                        <td>{d.reason}</td>
                        <td>{d.type}</td>

                        <td>
                          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="py-10 text-gray-500 text-center">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>Showing {filtered.length} entries</p>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">Previous</button>
              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">1</button>
              <button className="px-3 py-1 border rounded">Next</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Withdraw;