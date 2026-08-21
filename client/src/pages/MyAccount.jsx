import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  MoreVertical,
  ChevronDown,
  ArrowUpDown,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const MyAccount = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [tab, setTab] = useState("real");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [showArchived, setShowArchived] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const sortOptions = ["Newest", "Oldest", "Balance", "Nickname"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const config = {
        withCredentials: true,
      };

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const { data } = await axios.get(
        `${API_URL}/api/accounts/me`,
        config
      );

      setAccounts(Array.isArray(data?.accounts) ? data.accounts : []);
    } catch (error) {
      console.error(
        "Failed to load accounts:",
        error?.response?.data || error.message
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        setAccounts([]);
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      toast.error(
        error?.response?.data?.message || "Failed to load accounts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const list = accounts.filter(
      (acc) =>
        acc.account_type?.toLowerCase() === tab &&
        acc.status !== "archived"
    );

    return [...list].sort((a, b) => {
      if (sort === "Oldest") {
        return (
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
        );
      }

      if (sort === "Balance") {
        return Number(b.balance || 0) - Number(a.balance || 0);
      }

      if (sort === "Nickname") {
        return String(a.nickname || "").localeCompare(
          String(b.nickname || "")
        );
      }

      return (
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
      );
    });
  }, [accounts, tab, sort]);

  const archivedAccounts = useMemo(() => {
    return accounts.filter((acc) => acc.status === "archived");
  }, [accounts]);

  const updateStatus = async (id, action) => {
    try {
      setSavingId(id);

      const token = getToken();

      const config = {
        withCredentials: true,
      };

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      await axios.patch(
        `${API_URL}/api/accounts/${id}/${action}`,
        {},
        config
      );

      toast.success(
        action === "archive"
          ? "Account archived"
          : "Account restored"
      );

      setActiveMenu(null);
      await fetchAccounts();
    } catch (error) {
      console.error(
        "Account status error:",
        error?.response?.data || error.message
      );

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      toast.error(
        error?.response?.data?.message || "Action failed"
      );
    } finally {
      setSavingId(null);
    }
  };

  const openPayment = (acc) => {
    navigate("/user/payment", {
      state: {
        account: acc,
        payment: {
          address: acc.payment_url,
          qrCode:
            acc.payment_raw?.qr_code ||
            acc.payment_raw?.data?.qr_code ||
            null,
          payAmount:
            acc.payment_raw?.pay_amount ||
            acc.initial_balance,
          amount: acc.initial_balance,
          payCurrency:
            acc.payment_raw?.pay_currency || "USDT",
          network:
            acc.payment_raw?.network || "TRC20",
        },
      },
    });
  };

  const openTrade = () => {
    window.open("/terminal", "_blank");
  };

  const getStatusClass = (status) => {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "pending_payment") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "archived") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          My accounts
        </h1>

        <button
          onClick={() => navigate("/user/open-account")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={17} />
          Open account
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab("real")}
            className={`px-5 py-2 text-sm rounded-md ${
              tab === "real"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Real
          </button>

          <button
            onClick={() => setTab("demo")}
            className={`px-5 py-2 text-sm rounded-md ${
              tab === "demo"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            Demo
          </button>
        </div>

        <div
          className="relative w-full sm:w-auto"
          ref={menuRef}
        >
          <button
            onClick={() => setSortOpen((value) => !value)}
            className="flex items-center justify-between gap-3 w-full sm:w-auto px-4 py-2.5 border rounded-lg text-sm bg-white"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown size={15} />
              {sort}
            </span>

            <ChevronDown
              size={15}
              className={sortOpen ? "rotate-180" : ""}
            />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-44 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2
            className="animate-spin text-blue-500"
            size={28}
          />
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-2xl p-10 bg-gray-50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg">
            <Plus size={28} />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No {tab} accounts found
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-md">
            You don't have any {tab} trading accounts yet.
            Create your first {tab} account to start trading.
          </p>

          <button
            onClick={() => navigate("/user/open-account")}
            className="mt-6 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow"
          >
            <Plus size={18} />
            Create account
          </button>
        </div>
      ) : (
        <div className="border rounded-xl overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Account
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Platform
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Plan
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Type
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Balance
                </th>

                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>

                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="hover:bg-gray-50 whitespace-nowrap"
                >
                  <td className="px-4 py-4 font-medium">
                    #{acc.account_no || "-"}
                  </td>

                  <td className="px-4 py-4">
                    {acc.platform || "-"}
                  </td>

                  <td className="px-4 py-4">
                    {acc.plan_name || "-"}
                  </td>

                  <td className="px-4 py-4 capitalize">
                    {acc.account_type || "-"}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {Number(acc.balance || 0).toFixed(2)}{" "}
                    <span className="text-gray-500 font-normal">
                      {acc.currency || "USD"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        acc.status
                      )}`}
                    >
                      {acc.status || "unknown"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={openTrade}
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-xs font-medium"
                      >
                        Trade
                      </button>

                      <button
                        onClick={() =>
                          navigate("/user/deposit", {
                            state: { account: acc },
                          })
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title="Deposit"
                      >
                        <ArrowDownCircle size={16} />
                      </button>

                      <button
                        onClick={() =>
                          navigate("/user/withdraw")
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title="Withdraw"
                      >
                        <ArrowUpCircle size={16} />
                      </button>

                      <button
                        onClick={() =>
                          navigate("/user/transfer")
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title="Transfer"
                      >
                        <Repeat size={16} />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === acc.id
                                ? null
                                : acc.id
                            )
                          }
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenu === acc.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                            {acc.status === "pending_payment" && (
                              <button
                                onClick={() => openPayment(acc)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <ExternalLink size={14} />
                                Continue payment
                              </button>
                            )}

                            <button
                              onClick={() =>
                                updateStatus(
                                  acc.id,
                                  "archive"
                                )
                              }
                              disabled={savingId === acc.id}
                              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {savingId === acc.id
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {archivedAccounts.length > 0 && (
        <div className="pt-4 border-t">
          <button
            onClick={() =>
              setShowArchived((value) => !value)
            }
            className="flex items-center gap-2 font-semibold text-gray-800"
          >
            Archived accounts
            <ChevronDown
              size={16}
              className={
                showArchived ? "rotate-180" : ""
              }
            />
          </button>

          {showArchived && (
            <div className="mt-4 border rounded-xl overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Account
                    </th>

                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Platform
                    </th>

                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Plan
                    </th>

                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Archived
                    </th>

                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {archivedAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className="hover:bg-gray-50 whitespace-nowrap"
                    >
                      <td className="px-4 py-4 font-medium">
                        #{acc.account_no || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {acc.platform || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {acc.plan_name || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {acc.archived_at
                          ? new Date(
                              acc.archived_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            updateStatus(
                              acc.id,
                              "restore"
                            )
                          }
                          disabled={
                            savingId === acc.id
                          }
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm disabled:opacity-50"
                        >
                          {savingId === acc.id
                            ? "Restoring..."
                            : "Restore"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAccount;
