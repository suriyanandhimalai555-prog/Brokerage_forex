import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Loader2,
  Search,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const badge = (val) => {
  const status = String(val || "").toLowerCase();

  if (status === "approved") {
    return "bg-green-100 text-green-700";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-600";
  }

  return "bg-gray-100 text-gray-600";
};

const AdminWithdraw = () => {
  const [loading, setLoading] = useState(true);

  const [withdrawals, setWithdrawals] = useState([]);

  const [search, setSearch] = useState("");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/api/withdrawals`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setWithdrawals(data?.withdrawals || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(fetchData, 10000);

    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    return withdrawals.filter((d) => {
      const text = [
        d.withdrawal_no,
        d.account_no,
        d.plan_name,
        d.method_id,
        d.amount,
        d.currency,
        d.status,
        d.name,
        d.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = text.includes(
        search.toLowerCase()
      );

      const date = d.created_at
        ? String(d.created_at).slice(0, 10)
        : "";

      const matchFrom = !from || date >= from;

      const matchTo = !to || date <= to;

      return matchSearch && matchFrom && matchTo;
    });
  }, [withdrawals, search, from, to]);

  const approveWithdraw = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/api/withdrawals/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Withdrawal approved");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to approve");
    }
  };

  const rejectWithdraw = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/api/withdrawals/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Withdrawal rejected");

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to reject");
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            Withdraw Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage all user withdrawal requests
          </p>
        </div>

        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                From:
              </span>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                className="border rounded px-2 py-1 text-sm"
              />

              <span>To:</span>

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                className="border rounded px-2 py-1 text-sm"
              />

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
              <Search size={14} />

              <input
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Search withdrawals..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="rounded-xl border overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1600px] w-full text-sm">
                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3">
                      S.No
                    </th>

                    <th>User</th>

                    <th>Email</th>

                    <th>Withdraw No</th>

                    <th>Account No</th>

                    <th>Plan</th>

                    <th>Method</th>

                    <th>Amount</th>

                    <th>Status</th>

                    <th>Note</th>

                    <th>Admin Note</th>

                    <th>Date & Time</th>

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={13}
                        className="py-10 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Loader2
                            className="animate-spin"
                            size={18}
                          />

                          Loading...
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr
                        key={d.id}
                        className="border-b text-center hover:bg-gray-50"
                      >
                        <td className="py-2">
                          {i + 1}
                        </td>

                        <td>{d.name || "-"}</td>

                        <td>{d.email || "-"}</td>

                        <td>
                          {d.withdrawal_no || "-"}
                        </td>

                        <td>
                          {d.account_no || "-"}
                        </td>

                        <td>
                          {d.plan_name || "-"}
                        </td>

                        <td>
                          {d.method_id || "-"}
                        </td>

                        <td>
                          {Number(
                            d.amount || 0
                          ).toFixed(2)}{" "}
                          {d.currency || "USD"}
                        </td>

                        <td>
                          <span
                            className={`px-2 py-1 rounded ${badge(
                              d.status
                            )}`}
                          >
                            {d.status}
                          </span>
                        </td>

                        <td>
                          {d.note || "-"}
                        </td>

                        <td>
                          {d.admin_note || "-"}
                        </td>

                        <td>
                          {d.created_at
                            ? new Date(
                                d.created_at
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td>
                          {d.status ===
                          "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  approveWithdraw(
                                    d.id
                                  )
                                }
                                className="px-3 py-1 bg-green-500 text-white rounded text-xs flex items-center gap-1"
                              >
                                <CheckCircle2 size={14} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  rejectWithdraw(
                                    d.id
                                  )
                                }
                                className="px-3 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={13}
                        className="py-10 text-center text-gray-500"
                      >
                        No withdrawal requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Showing {filtered.length} entries
            </p>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">
                Previous
              </button>

              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">
                1
              </button>

              <button className="px-3 py-1 border rounded">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdraw;