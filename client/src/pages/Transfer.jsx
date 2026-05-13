import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Loader2,
  Search,
  CalendarDays,
  ArrowRightLeft,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");

const badge = (val) => {
  const status = String(val || "").toLowerCase();
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "failed") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};

const Transfer = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [form, setForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    note: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [accountsRes, transfersRes] = await Promise.all([
        axios.get(`${API_URL}/api/accounts/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),
        axios.get(`${API_URL}/api/transfers/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),
      ]);

      const activeAccounts = (accountsRes.data?.accounts || []).filter(
  (acc) =>
    acc.status === "active" &&
    acc.account_type === "real"
);

      setAccounts(activeAccounts);
      setTransfers(transfersRes.data?.transfers || []);

      if (!form.fromAccountId && activeAccounts.length > 0) {
        setForm((prev) => ({
          ...prev,
          fromAccountId: String(activeAccounts[0].id),
          toAccountId:
            activeAccounts.length > 1 ? String(activeAccounts[1].id) : "",
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transfers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedFromAccount = useMemo(() => {
    return accounts.find(
      (acc) => String(acc.id) === String(form.fromAccountId)
    );
  }, [accounts, form.fromAccountId]);

  const selectedToAccount = useMemo(() => {
    return accounts.find(
      (acc) => String(acc.id) === String(form.toAccountId)
    );
  }, [accounts, form.toAccountId]);

  const filtered = useMemo(() => {
    return transfers.filter((d) => {
      const text = [
        d.transfer_no,
        d.from_account_no,
        d.to_account_no,
        d.from_plan_name,
        d.to_plan_name,
        d.amount,
        d.currency,
        d.status,
        d.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      const date = d.created_at ? String(d.created_at).slice(0, 10) : "";
      const matchFrom = !from || date >= from;
      const matchTo = !to || date <= to;

      return matchSearch && matchFrom && matchTo;
    });
  }, [transfers, search, from, to]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (!form.fromAccountId || !form.toAccountId) {
        toast.error("Please select both accounts");
        return;
      }

      if (String(form.fromAccountId) === String(form.toAccountId)) {
        toast.error("From and To accounts cannot be same");
        return;
      }

      const amount = Number(form.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error("Enter a valid amount");
        return;
      }

      if (selectedFromAccount && amount > Number(selectedFromAccount.balance || 0)) {
        toast.error("Insufficient balance");
        return;
      }

      setSubmitting(true);

      const { data } = await axios.post(
        `${API_URL}/api/transfers`,
        {
          fromAccountId: form.fromAccountId,
          toAccountId: form.toAccountId,
          amount,
          note: form.note || "",
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Transfer completed");

      if (data?.transfer) {
        setTransfers((prev) => [data.transfer, ...prev]);
      }

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
        error?.response?.data?.error ||
        "Failed to transfer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Transfer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Transfer funds between your own accounts
            </p>
          </div>

          <button
            onClick={openModal}
            className="px-4 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Create Transfer
          </button>
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
                onChange={(e) => setFrom(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />

              <span>To:</span>
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
            </div>

            <div className="flex items-center gap-2">
              <Search size={14} />
              <input
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Search transfers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="rounded-xl border overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1300px] w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <tr>
                    <th className="px-3 py-3">S.No</th>
                    <th>Transfer No</th>
                    <th>From Account</th>
                    <th>To Account</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Date & Time</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin" size={18} />
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((d, i) => (
                      <tr key={d.id} className="border-b text-center hover:bg-gray-50">
                        <td className="py-2">{i + 1}</td>
                        <td>{d.transfer_no || "-"}</td>
                        <td>
                          {d.from_account_no || "-"}
                        </td>
                        <td>
                          {d.to_account_no || "-"}
                        </td>
                        <td>
                          {Number(d.amount || 0).toFixed(2)} {d.currency || "USD"}
                        </td>
                        <td>
                          <span className={`px-2 py-1 rounded ${badge(d.status)}`}>
                            {String(d.status || "-")}
                          </span>
                        </td>
                        <td className="max-w-[220px] truncate">
                          {d.note || "-"}
                        </td>
                        <td>
                          {d.created_at
                            ? new Date(d.created_at).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setForm({
                                fromAccountId: String(d.from_account_id || ""),
                                toAccountId: String(d.to_account_id || ""),
                                amount: String(d.amount || ""),
                                note: d.note || "",
                              });
                              setShowModal(true);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1 mx-auto"
                          >
                            <ArrowRightLeft size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-gray-500">
                        No transfer history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>Showing {filtered.length} entries</p>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded">Previous</button>
              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded">Next</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Create Transfer
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Move funds between your own accounts
                </p>
              </div>

              <button
                onClick={closeModal}
                className="min-w-[40px] h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">

              {/* FROM */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  From account
                </label>

                <select
                  name="fromAccountId"
                  value={form.fromAccountId}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                >
                  <option value="">
                    Choose source account
                  </option>

                  {accounts.map((acc) => (
                    <option
                      key={acc.id}
                      value={acc.id}
                    >
                      #{acc.account_no} — {acc.plan_name} — Balance:{" "}
                      {Number(acc.balance).toFixed(2)}{" "}
                      {acc.currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* TO */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  To account
                </label>

                <select
                  name="toAccountId"
                  value={form.toAccountId}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                >
                  <option value="">
                    Choose destination account
                  </option>

                  {accounts
                    .filter(
                      (acc) =>
                        String(acc.id) !==
                        String(form.fromAccountId)
                    )
                    .map((acc) => (
                      <option
                        key={acc.id}
                        value={acc.id}
                      >
                        #{acc.account_no} —{" "}
                        {acc.plan_name} — Balance:{" "}
                        {Number(acc.balance).toFixed(2)}{" "}
                        {acc.currency}
                      </option>
                    ))}
                </select>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Transfer amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter amount"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* NOTE */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Note
                </label>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Optional note"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                />
              </div>

              {/* SUMMARY */}
              <div className="rounded-2xl bg-gray-50 border p-4">

                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft
                    size={18}
                    className="text-indigo-600"
                  />

                  <h4 className="font-semibold text-gray-900">
                    Transfer Summary
                  </h4>
                </div>

                <div className="space-y-2 text-sm text-gray-700">

                  <div className="flex justify-between gap-4">
                    <span>From</span>

                    <span className="font-medium text-right">
                      {selectedFromAccount
                        ? `#${selectedFromAccount.account_no}`
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>To</span>

                    <span className="font-medium text-right">
                      {selectedToAccount
                        ? `#${selectedToAccount.account_no}`
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Amount</span>

                    <span className="font-semibold text-indigo-600 text-right">
                      {form.amount || "0"} USD
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 sm:px-6 py-4 bg-white">

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">

                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 transition text-white flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-70"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  Submit Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;