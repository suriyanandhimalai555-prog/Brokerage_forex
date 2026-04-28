import React, { useState, useMemo } from "react";

const dummyData = [
  {
    id: 1,
    accountNo: 10010,
    transaction: "Deposit",
    type: "Credit",
    value: 500,
    date: "2025-10-05 10:30:00",
  },
  {
    id: 2,
    accountNo: 10012,
    transaction: "Withdrawal",
    type: "Debit",
    value: 200,
    date: "2025-10-06 12:45:00",
  },
];

const UserTransactionLog = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return dummyData.filter((d) =>
      Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            User Transaction Log
          </h2>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4">

          <div className="flex items-center gap-2 text-sm">
            Show
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            entries
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Search:</span>
            <input
              className="border rounded-md px-3 py-2 text-sm"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* TABLE */}
        <div className="px-4 sm:px-6 pb-6">
          <div className="rounded-xl border overflow-hidden">

            {/* ONLY TABLE SCROLL */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">

                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">S.No</th>
                    <th className="text-left">Account No</th>
                    <th className="text-left">Transaction</th>
                    <th className="text-left">Transaction Type</th>
                    <th className="text-left">Transaction Value</th>
                    <th className="text-left">Modified Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr
                        key={d.id}
                        className="border-b hover:bg-gray-50 text-left"
                      >
                        <td className="py-2 px-3">{i + 1}</td>
                        <td>{d.accountNo}</td>
                        <td>{d.transaction}</td>
                        <td>{d.type}</td>
                        <td>{d.value}</td>
                        <td>{d.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
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
            <p>
              Showing {filtered.length > 0 ? 1 : 0} to {filtered.length} of{" "}
              {filtered.length} entries
            </p>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded opacity-50">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserTransactionLog;