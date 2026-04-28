import { Edit } from "lucide-react";
import React, { useState, useMemo } from "react";

const dummyUsers = [
  {
    id: 3,
    name: "Admin",
    accId: 10002,
    email: "xtremenextdev@gmail.com",
    password: "123",
    invPassword: "123",
    emailStatus: "Verified",
    status: "Active",
    fund: 10000,
    balance: 10000,
    date: "2024-05-06 11:38:54",
    challenge: "Not Purchased",
    mobile: "+0123",
  },
  {
    id: 6,
    name: "Demo User",
    accId: 10006,
    email: "testinger@mailinator.com",
    password: "Test@123",
    invPassword: "-",
    emailStatus: "Verified",
    status: "Active",
    fund: 24999.99,
    balance: 24999.99,
    date: "2025-10-04 14:28:55",
    challenge: "Stellar 2-Step",
    mobile: "+911234567890",
  },
  {
    id: 8,
    name: "Xtreme Tester",
    accId: 10008,
    email: "xtremetester@mailinator.com",
    password: "Test@123",
    invPassword: "-",
    emailStatus: "Verified",
    status: "Active",
    fund: 10000,
    balance: 10000,
    date: "2025-10-04 15:18:28",
    challenge: "Stellar 1-Step",
    mobile: "+911234567800",
  },
  {
    id: 10,
    name: "RAJKUMAR",
    accId: 10010,
    email: "rajaeronautics@gmail.com",
    password: "Test@123",
    invPassword: "-",
    emailStatus: "Verified",
    status: "Inactive",
    fund: 10000,
    balance: 10000,
    date: "2025-10-05 06:47:31",
    challenge: "Stellar 2-Step",
    mobile: "+971542733331",
  },
  {
    id: 12,
    name: "Shivani",
    accId: 10012,
    email: "shivani.xinfo@gmail.com",
    password: "Shivani@1234",
    invPassword: "-",
    emailStatus: "Verified",
    status: "Inactive",
    fund: 1196.92,
    balance: 1196.92,
    date: "2025-10-06 02:34:27",
    challenge: "Stellar 2-Step",
    mobile: "+9715618732632",
  },
];

const badge = (val) => {
  if (val === "Verified") return "bg-green-100 text-green-700";
  if (val === "Active") return "bg-blue-100 text-blue-600";
  if (val === "Inactive") return "bg-gray-200 text-gray-700";
  return "bg-gray-100 text-gray-600";
};

const ChallengeUser = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return dummyUsers.filter((u) =>
      Object.values(u).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            Manage User
          </h2>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">CSV</button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">PDF</button>
            <button className="px-4 h-10 bg-[#353b8f] text-white rounded-lg text-sm">Excel</button>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            Show
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
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
              <table className="min-w-[1500px] w-full text-sm">

                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3">S.No</th>
                    <th>Deposit/Withdraw</th>
                    <th>Name</th>
                    <th>AC ID</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Inv Password</th>
                    <th>E-Mail</th>
                    <th>User Status</th>
                    <th>Fund</th>
                    <th>Balance</th>
                    <th>Date</th>
                    <th>Challenge</th>
                    <th>Mobile</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="border-b text-center hover:bg-gray-50">
                      <td className="py-2">{u.id}</td>
                      <td className="flex justify-center items-center mt-2"><Edit size={12}/></td>
                      <td>{u.name}</td>
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
                        <span className={`px-2 py-1 rounded ${badge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>

                      <td>{u.fund}</td>
                      <td>{u.balance}</td>
                      <td>{u.date}</td>
                      <td>{u.challenge}</td>
                      <td>{u.mobile}</td>
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

export default ChallengeUser;