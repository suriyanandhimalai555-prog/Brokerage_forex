import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Plus,
  X,
  Loader2,
  Search,
  CalendarDays,
  Wallet,
  CreditCard,
  Landmark,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("token");

const PAYMENT_METHODS = [
  {
    id: "usdt_trc20",
    name: "USDT (TRC20)",
    network: "TRC20",
    payCurrency: "USDT",
    icon: Wallet,
  },
  {
    id: "usdt_bep20",
    name: "USDT (BEP20)",
    network: "BEP20",
    payCurrency: "USDT",
    icon: CreditCard,
  },
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    network: "BTC",
    payCurrency: "BTC",
    icon: Landmark,
  },
];

const badge = (val) => {
  const status = String(val || "").toLowerCase();

  if (status === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (
    status === "pending_payment"
  ) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "failed") {
    return "bg-red-100 text-red-600";
  }

  return "bg-gray-100 text-gray-600";
};

const Deposit = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [accounts, setAccounts] =
    useState([]);

  const [deposits, setDeposits] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [form, setForm] = useState({
    accountId: "",
    methodId: "usdt_trc20",
    amount: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [accountsRes, depositsRes] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/accounts/me`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          ),

          axios.get(
            `${API_URL}/api/deposits/me`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          ),
        ]);

      const activeAccounts = (
        accountsRes.data?.accounts || []
      ).filter(
        (acc) =>
          acc.account_type ===
            "real" &&
          acc.status === "active"
      );

      setAccounts(activeAccounts);

      setDeposits(
        depositsRes.data?.deposits || []
      );

      if (
        !form.accountId &&
        activeAccounts.length > 0
      ) {
        setForm((prev) => ({
          ...prev,
          accountId: String(
            activeAccounts[0].id
          ),
        }));
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load deposits"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(
      fetchData,
      10000
    );

    return () =>
      clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    return deposits.filter((d) => {
      const text = [
        d.deposit_no,
        d.account_no,
        d.plan_name,
        d.pay_currency,
        d.network,
        d.amount,
        d.currency,
        d.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch =
        text.includes(
          search.toLowerCase()
        );

      const date = d.created_at
        ? String(d.created_at).slice(
            0,
            10
          )
        : "";

      const matchFrom =
        !from || date >= from;

      const matchTo =
        !to || date <= to;

      return (
        matchSearch &&
        matchFrom &&
        matchTo
      );
    });
  }, [deposits, search, from, to]);

  const selectedAccount =
    accounts.find(
      (acc) =>
        String(acc.id) ===
        String(form.accountId)
    );

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.accountId) {
        toast.error(
          "Please select account"
        );
        return;
      }

      const amount = Number(
        form.amount
      );

      if (
        !Number.isFinite(amount) ||
        amount < 10
      ) {
        toast.error(
          "Minimum deposit is 10"
        );
        return;
      }

      setSubmitting(true);

      const { data } =
        await axios.post(
          `${API_URL}/api/deposits`,
          {
            accountId:
              form.accountId,
            methodId:
              form.methodId,
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      toast.success(
        "Deposit created"
      );

      setShowModal(false);

      fetchData();

      navigate("/user/payment", {
        state: {
          account: data.account,
          payment: data.payment,
          deposit: data.deposit,
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to create deposit"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50 flex justify-between items-center">

          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Deposit Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create and track deposits
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Create Deposit
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4">

          <div className="flex flex-wrap items-center gap-2">

            <span className="text-sm flex items-center gap-1">
              <CalendarDays size={14} />
              From:
            </span>

            <input
              type="date"
              value={from}
              onChange={(e) =>
                setFrom(
                  e.target.value
                )
              }
              className="border rounded px-2 py-1 text-sm"
            />

            <span className="text-sm">
              To:
            </span>

            <input
              type="date"
              value={to}
              onChange={(e) =>
                setTo(
                  e.target.value
                )
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

            <div className="flex items-center gap-2 ml-auto">

              <Search size={14} />

              <input
                className="border rounded-md px-3 py-2 text-sm"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-4 sm:px-6 pb-6">

          <div className="rounded-xl border overflow-hidden">

            <div className="w-full overflow-x-auto">

              <table className="min-w-[1400px] w-full text-sm">

                <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">

                  <tr>
                    <th className="px-3 py-3">
                      S.No
                    </th>

                    <th>
                      Deposit No
                    </th>

                    <th>
                      Account
                    </th>

                    <th>
                      Plan
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Network
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>
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
                  ) : filtered.length >
                    0 ? (
                    filtered.map(
                      (d, i) => (
                        <tr
                          key={d.id}
                          className="border-b text-center hover:bg-gray-50"
                        >
                          <td className="py-2">
                            {i + 1}
                          </td>

                          <td>
                            {d.deposit_no}
                          </td>

                          <td>
                            {d.account_no}
                          </td>

                          <td>
                            {d.plan_name}
                          </td>

                          <td>
                            {d.pay_currency}
                          </td>

                          <td>
                            {d.network}
                          </td>

                          <td>
                            {Number(
                              d.amount
                            ).toFixed(
                              2
                            )}{" "}
                            {
                              d.currency
                            }
                          </td>

                          <td>
                            <span
                              className={`px-2 py-1 rounded ${badge(
                                d.status
                              )}`}
                            >
                              {
                                d.status
                              }
                            </span>
                          </td>

                          <td>
                            {new Date(
                              d.created_at
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-gray-500"
                      >
                        No deposits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">

              <div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Create Deposit
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Deposit into your trading account
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="min-w-[40px] h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">

              {/* ACCOUNT */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Select account
                </label>

                <select
                  name="accountId"
                  value={
                    form.accountId
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="">
                    Choose account
                  </option>

                  {accounts.map(
                    (acc) => (
                      <option
                        key={acc.id}
                        value={acc.id}
                      >
                        #
                        {
                          acc.account_no
                        }{" "}
                        —{" "}
                        {
                          acc.plan_name
                        }{" "}
                        — Balance:{" "}
                        {Number(
                          acc.balance
                        ).toFixed(
                          2
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* METHODS */}
              <div>

                <label className="text-sm font-medium block mb-3">
                  Payment method
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  {PAYMENT_METHODS.map(
                    (method) => {
                      const Icon =
                        method.icon;

                      const active =
                        form.methodId ===
                        method.id;

                      return (
                        <button
                          key={
                            method.id
                          }
                          type="button"
                          onClick={() =>
                            setForm(
                              (
                                prev
                              ) => ({
                                ...prev,
                                methodId:
                                  method.id,
                              })
                            )
                          }
                          className={`border rounded-xl p-4 text-left transition ${
                            active
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                              <Icon
                                size={
                                  18
                                }
                              />
                            </div>

                            <div>
                              <div className="font-semibold">
                                {
                                  method.name
                                }
                              </div>

                              <div className="text-xs text-gray-500">
                                {
                                  method.network
                                }
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Deposit amount
                </label>

                <input
                  type="number"
                  name="amount"
                  min="10"
                  value={form.amount}
                  onChange={
                    handleChange
                  }
                  placeholder="Minimum 10"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              {/* SUMMARY */}
              <div className="rounded-2xl bg-gray-50 border p-4">

                <h4 className="font-semibold mb-3">
                  Deposit Summary
                </h4>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span>
                      Account
                    </span>

                    <span className="font-medium">
                      {selectedAccount
                        ? `#${selectedAccount.account_no}`
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Method
                    </span>

                    <span className="font-medium">
                      {
                        PAYMENT_METHODS.find(
                          (
                            m
                          ) =>
                            m.id ===
                            form.methodId
                        )?.name
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Amount
                    </span>

                    <span className="font-semibold text-indigo-600">
                      {form.amount ||
                        "0"}{" "}
                      USD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 sm:px-6 py-4 bg-white">

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">

                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    submitting
                  }
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;