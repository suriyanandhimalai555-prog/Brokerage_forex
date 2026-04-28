import React, { useState, useMemo } from "react";

const dummyDocs = [
  {
    id: 1,
    name: "RAJKUMAR",
    accId: 10010,
    addressFront: "front1.jpg",
    addressBack: "back1.jpg",
    idFront: "idfront1.jpg",
    idBack: "idback1.jpg",
    updated: "2025-10-05 10:30:00",
    bank: "HDFC",
    document: "Pending",
    remarks: "Waiting for approval",
  },
  {
    id: 2,
    name: "Shivani",
    accId: 10012,
    addressFront: "front2.jpg",
    addressBack: "back2.jpg",
    idFront: "idfront2.jpg",
    idBack: "idback2.jpg",
    updated: "2025-10-06 12:45:00",
    bank: "ICICI",
    document: "Verified",
    remarks: "Approved",
  },
];

const badge = (val) => {
  if (val === "Verified") return "bg-green-100 text-green-700";
  if (val === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

const UserDoc = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return dummyDocs.filter((d) =>
      Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            User Documents
          </h2>

          <button className="px-4 h-10 bg-black text-white rounded-lg text-sm">
            Add Document
          </button>
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
              onChange={(e) => setSearch(e.target.value)}
            />
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
                    <th>User Name</th>
                    <th>Account ID</th>
                    <th>Address (Front)</th>
                    <th>Address (Back)</th>
                    <th>National ID (Front)</th>
                    <th>National ID (Back)</th>
                    <th>Updated Time</th>
                    <th>Bank</th>
                    <th>Document</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr key={d.id} className="border-b text-center hover:bg-gray-50">
                        <td className="py-2">{i + 1}</td>
                        <td>{d.name}</td>
                        <td>{d.accId}</td>

                        <td className="text-blue-600 cursor-pointer">
                          View
                        </td>
                        <td className="text-blue-600 cursor-pointer">
                          View
                        </td>
                        <td className="text-blue-600 cursor-pointer">
                          View
                        </td>
                        <td className="text-blue-600 cursor-pointer">
                          View
                        </td>

                        <td>{d.updated}</td>
                        <td>{d.bank}</td>

                        <td>
                          <span className={`px-2 py-1 rounded ${badge(d.document)}`}>
                            {d.document}
                          </span>
                        </td>

                        <td>{d.remarks}</td>

                        <td className="flex justify-center gap-2">
                          <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                            Approve
                          </button>
                          <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="py-10 text-gray-500">
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

export default UserDoc;