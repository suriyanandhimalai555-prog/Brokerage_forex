import React, { useState, useMemo } from "react";

const dummyData = [
  {
    uid: 9,
    name: "RAJKUMAR",
    accountId: 10009,
    pnl: 0,
    brokerage: 0,
    lpBrokerage: 0,
    spread: 0,
  },
];

const UserOrderReport = () => {
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
            User Order Report
          </h2>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4">

          {/* EXPORT */}
          <div className="flex gap-2">
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              CSV
            </button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              PDF
            </button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">
              Excel
            </button>
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Search:</span>
            <input
              className="border rounded-md px-3 py-2 text-sm"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
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
                    <th className="px-3 py-3 text-left">User UID</th>
                    <th className="text-left">Customer Name</th>
                    <th className="text-left">Account ID</th>
                    <th className="text-left">PNL</th>
                    <th className="text-left">Brokerage</th>
                    <th className="text-left">LP Brokerage</th>
                    <th className="text-left">Spread Commission</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50 text-left"
                      >
                        <td className="py-2 px-3">{d.uid}</td>
                        <td>{d.name}</td>
                        <td>{d.accountId}</td>
                        <td>{d.pnl.toFixed(2)}</td>
                        <td>{d.brokerage.toFixed(2)}</td>
                        <td>{d.lpBrokerage.toFixed(2)}</td>
                        <td>{d.spread.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
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

export default UserOrderReport;