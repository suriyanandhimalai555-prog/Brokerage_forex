import { Delete, DeleteIcon, Edit, Trash } from "lucide-react";
import React, { useState, useMemo } from "react";

const dummyUsers = [
  {
    id: 9,
    name: "RAJKUMAR",
    accId: 10009,
    email: "rajaeronautics@gmail.com",
    password: "Test@123",
    invPassword: "-",
    emailStatus: "Verified",
    document: "Not Verified",
    status: "Active",
    fund: 10066.7,
    balance: 10066.7,
    date: "2025-10-05 06:47:31",
    challenge: "Stellar 2-Step",
    challengeAcc: 10010,
  },
  {
    id: 33,
    name: "Xtreme Demo",
    accId: 10033,
    email: "xtredemo@mailinator.com",
    password: "Test@123",
    invPassword: "-",
    emailStatus: "Verified",
    document: "Not Verified",
    status: "Active",
    fund: 112202,
    balance: 112202,
    date: "2025-10-09 12:58:19",
    challenge: "Stellar 1-Step",
    challengeAcc: 10034,
  },
];

const badge = (value) => {
  if (value === "Verified") return "bg-green-100 text-green-700";
  if (value === "Not Verified") return "bg-red-100 text-red-600";
  if (value === "Active") return "bg-blue-100 text-blue-600";
  return "bg-gray-100 text-gray-600";
};

const FundedUser = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return dummyUsers.filter((u) =>
      Object.values(u).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">Manage User</h2>

          <div className="flex gap-2 flex-wrap">
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">Create User</button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">Add User</button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">CSV</button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">PDF</button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">Excel</button>
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
            
            {/* SCROLL ONLY HERE */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1400px] w-full text-sm">
                
                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3">S.No</th>
                    <th>Name</th>
                    <th>Deposit <br /> Withdraw</th>
                    <th>AC ID</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Inv Password</th>
                    <th>E-Mail</th>
                    <th>Document</th>
                    <th>Status</th>
                    <th>Fund</th>
                    <th>Balance</th>
                    <th>Date</th>
                    <th>Challenge</th>
                    <th>Challenge Account</th>
                    <th>Edit <br /> Password</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 text-center">
                      <td className="py-2">{i + 1}</td>
                      <td>{u.name}</td>
                      <td className="flex justify-center gap-1 items-center mt-1.5"> <Edit size={12}/> <br /> <Trash size={12}/></td>
                      <td>{u.accId}</td>
                      <td>{u.email}</td>
                      <td>{u.password}</td>
                      <td>{u.invPassword}</td>

                      <td>
                        <span className={`px-2 py-1 rounded ${badge(u.emailStatus)}`}>
                          {u.emailStatus}
                        </span>
                      </td>

                      <td>
                        <span className={`px-2 py-1 rounded ${badge(u.document)}`}>
                          {u.document}
                        </span>
                      </td>

                      <td>
                        <span className={`px-2 py-1 rounded ${badge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>

                      <td>{u.fund}</td>
                      <td>{u.balance}</td>
                      <td>{u.date}</td>
                      <td>{u.challenge}</td>
                      <td>{u.challengeAcc}</td>
                      <td className="flex justify-center"><Edit size={12}/></td>
                    </tr>
                  ))}
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

export default FundedUser;