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
  const [showArchived, setShowArchived] = useState(true);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/accounts/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setAccounts(data?.accounts || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const list = accounts.filter((acc) => acc.account_type === tab);

    const sorted = [...list].sort((a, b) => {
      if (sort === "Oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "Balance") return Number(b.balance) - Number(a.balance);
      if (sort === "Nickname") return String(a.nickname).localeCompare(String(b.nickname));
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return sorted;
  }, [accounts, tab, sort]);

  const hasAccounts = filteredAccounts.length > 0;

  const archivedAccounts = useMemo(() => {
    return accounts.filter((acc) => acc.status === "archived");
  }, [accounts]);

  const updateStatus = async (id, action) => {
    try {
      setSavingId(id);
      await axios.patch(
        `${API_URL}/api/accounts/${id}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      toast.success(action === "archive" ? "Account archived" : "Account restored");
      fetchAccounts();
    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    } finally {
      setSavingId(null);
    }
  };

  const openPayLink = (url) => {
    if (!url) {
      toast.error("Payment link not found");
      return;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm space-y-6 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">My accounts</h1>

        <button
          onClick={() => navigate("/user/open-account")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm"
        >
          <Plus size={16} />
          Open account
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab("real")}
            className={`px-4 py-1.5 text-sm rounded-md ${tab === "real" ? "bg-white shadow" : "text-gray-500"
              }`}
          >
            Real
          </button>
          <button
            onClick={() => setTab("demo")}
            className={`px-4 py-1.5 text-sm rounded-md ${tab === "demo" ? "bg-white shadow" : "text-gray-500"
              }`}
          >
            Demo
          </button>
        </div>

        <div className="relative w-full sm:w-auto" ref={menuRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center justify-between gap-2 w-full sm:w-auto px-3 py-2 border rounded-lg text-sm"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown size={14} />
              {sort}
            </span>
            <ChevronDown size={14} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-44 bg-white border rounded-lg shadow z-10">
              {sortOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSort(opt);
                    setSortOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-4">

            {!hasAccounts ? (

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
                  className="mt-6 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <Plus size={18} />
                  Create account
                </button>
              </div>

            ) : (

              filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="border rounded-xl p-4 sm:p-5 bg-white space-y-4"
                >

                  <div className="flex justify-between items-start gap-4">

                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm">

                      <span className="px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                        {acc.account_type}
                      </span>

                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {acc.platform}
                      </span>

                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {acc.plan_name}
                      </span>

                      <span className="font-medium">
                        #{acc.account_no}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full ${acc.status === "active"
                          ? "bg-green-100 text-green-700"
                          : acc.status === "pending_payment"
                            ? "bg-yellow-100 text-yellow-700"
                            : acc.status === "archived"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {acc.status}
                      </span>
                    </div>

                    <div className="relative">

                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === acc.id ? null : acc.id
                          )
                        }
                        className="p-2 bg-gray-100 rounded-lg"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenu === acc.id && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">

                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Account info
                          </button>

                          {acc.status === "pending_payment" &&
                            acc.payment_url && (
                              <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPayLink(acc.payment_url);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <ExternalLink size={14} />
                                Continue payment
                              </button>
                            )}

                          {acc.status !== "archived" ? (
                            <button
                              onClick={() =>
                                updateStatus(acc.id, "archive")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              {savingId === acc.id
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updateStatus(acc.id, "restore")
                              }
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-2xl sm:text-3xl font-semibold">
                    {Number(acc.balance).toFixed(2)}

                    <span className="text-sm text-gray-500 ml-1">
                      {acc.currency}
                    </span>
                  </div>

                  {acc.status === "pending_payment" && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-900">
                      Payment pending. Complete OxaPay payment
                      to activate this account.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2">

                    <button
                      onClick={() =>
                        window.open("/terminal", "_blank")
                      }
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 rounded-lg font-medium"
                    >
                      Trade
                    </button>

                    <button
                      onClick={() =>
                        navigate("/user/deposit")
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm"
                    >
                      <ArrowDownCircle size={16} />
                      Deposit
                    </button>

                    <button
                      onClick={() =>
                        navigate("/user/withdraw")
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm"
                    >
                      <ArrowUpCircle size={16} />
                      Withdraw
                    </button>

                    <button
                      onClick={() =>
                        navigate("/user/transfer")
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm"
                    >
                      <Repeat size={16} />
                      Transfer
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Archived accounts</h2>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className="text-sm flex items-center gap-1"
              >
                {showArchived ? "Hide" : "Show"}
                <ChevronDown
                  className={showArchived ? "rotate-180" : ""}
                  size={14}
                />
              </button>
            </div>

            {showArchived && (
              <div className="space-y-3">
                {archivedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="border rounded-xl p-4 bg-white flex flex-col sm:flex-row sm:justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs sm:text-sm mb-1">
                        <span className="bg-gray-100 px-2 rounded-full capitalize">
                          {acc.account_type}
                        </span>
                        <span className="bg-gray-100 px-2 rounded-full">
                          {acc.platform}
                        </span>
                        <span className="bg-gray-100 px-2 rounded-full">
                          {acc.plan_name}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600">
                        Archived on{" "}
                        {acc.archived_at
                          ? new Date(acc.archived_at).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(acc.id, "restore")}
                        className="px-3 py-2 bg-gray-100 rounded-lg text-sm w-full sm:w-auto"
                      >
                        Restore
                      </button>
                      <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm w-full sm:w-auto">
                        Statements
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyAccount;