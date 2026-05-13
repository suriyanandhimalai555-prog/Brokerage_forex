import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Loader2,
  Search,
  CalendarDays,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const methods = [
  {
    id: "erc20",
    name: "Tether (USDT ERC20)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "50 - 1,000,000 USD",
  },
  {
    id: "trc20",
    name: "Tether (USDT TRC20)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "10 - 1,000,000 USD",
  },
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    time: "Instant - 1 hour",
    fee: "0%",
    limits: "200 - 1,000,000 USD",
  },
  {
    id: "eth",
    name: "Ethereum (ETH)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "10 - 1,000,000 USD",
  },
];

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

const UserWithdraw = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [form, setForm] = useState({
    accountId: "",
    methodId: "trc20",
    amount: "",
    note: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [accountsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/accounts/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),

        axios.get(`${API_URL}/api/withdrawals/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),
      ]);

      const activeRealAccounts = (accountsRes.data?.accounts || []).filter(
        (acc) =>
          acc.account_type === "real" &&
          acc.status === "active"
      );

      setAccounts(activeRealAccounts);
      setWithdrawals(withdrawalsRes.data?.withdrawals || []);

      if (!form.accountId && activeRealAccounts.length > 0) {
        setForm((prev) => ({
          ...prev,
          accountId: String(activeRealAccounts[0].id),
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      const date = d.created_at
        ? String(d.created_at).slice(0, 10)
        : "";

      const matchFrom = !from || date >= from;
      const matchTo = !to || date <= to;

      return matchSearch && matchFrom && matchTo;
    });
  }, [withdrawals, search, from, to]);

  const selectedAccount = useMemo(() => {
    return accounts.find(
      (acc) => String(acc.id) === String(form.accountId)
    );
  }, [accounts, form.accountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.accountId) {
        toast.error("Please select account");
        return;
      }

      const amount = Number(form.amount);

      if (!Number.isFinite(amount) || amount < 100) {
        toast.error("Minimum withdraw is 100");
        return;
      }

      if (
        selectedAccount &&
        amount > Number(selectedAccount.balance || 0)
      ) {
        toast.error("Insufficient balance");
        return;
      }

      setSubmitting(true);

      const { data } = await axios.post(
        `${API_URL}/api/withdrawals`,
        {
          accountId: form.accountId,
          methodId: form.methodId,
          amount,
          note: form.note,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Withdraw request submitted");

      setWithdrawals((prev) => [
        data.withdrawal,
        ...prev,
      ]);

      setForm((prev) => ({
        ...prev,
        amount: "",
        note: "",
      }));

      setShowModal(false);

      fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create withdraw"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Withdraw Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create and track withdrawal requests
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Create Withdraw
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm flex items-center gap-1">
              <CalendarDays size={14} />
              From:
            </span>

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

            <div className="flex items-center gap-2 ml-auto">
              <Search size={14} />

              <input
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Search..."
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
              <table className="min-w-[1200px] w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <tr>
                    <th className="px-3 py-3">S.No</th>
                    <th>Withdraw No</th>
                    <th>Account</th>
                    <th>Plan</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Admin Note</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" />
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
                        <td className="py-2">{i + 1}</td>

                        <td>{d.withdrawal_no}</td>

                        <td>{d.account_no}</td>

                        <td>{d.plan_name}</td>

                        <td>{d.method_id}</td>

                        <td>
                          {Number(d.amount).toFixed(2)}{" "}
                          {d.currency}
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
                          {d.admin_note || "-"}
                        </td>

                        <td>
                          {new Date(
                            d.created_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-gray-500"
                      >
                        No withdrawals found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-999 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
              <div>
                <h3 className="text-lg font-semibold">
                  Create Withdraw
                </h3>

                <p className="text-sm text-gray-500">
                  Submit request for admin approval
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Select Account
                </label>

                <select
                  name="accountId"
                  value={form.accountId}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3"
                >
                  <option value="">
                    Choose account
                  </option>

                  {accounts.map((acc) => (
                    <option
                      key={acc.id}
                      value={acc.id}
                    >
                      #{acc.account_no} —{" "}
                      {acc.plan_name} — Balance:{" "}
                      {Number(acc.balance).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Payment Method
                </label>

                <select
                  name="methodId"
                  value={form.methodId}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3"
                >
                  {methods.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                    >
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  min="100"
                  placeholder="Minimum 100"
                  value={form.amount}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Note
                </label>

                <textarea
                  rows={4}
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 resize-none"
                  placeholder="Optional note"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center gap-2"
              >
                {submitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWithdraw;