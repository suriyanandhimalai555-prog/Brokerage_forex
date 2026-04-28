import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  MoreVertical,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

const realAccounts = [
  {
    id: "22000005156",
    type: "Exness",
    name: "Standard Cent",
    balance: "0.00",
  },
  {
    id: "263244830",
    type: "MT5",
    name: "Standard Cent",
    balance: "692.90",
  },
];

const archivedAccounts = [
  {
    id: "148811713",
    platform: "MT5",
    name: "Standard",
    date: "11 Sep 2025 05:55",
  },
  {
    id: "27013273",
    platform: "MT4",
    name: "Standard Cent",
    date: "09 Aug 2025 13:46",
  },
];

const MyAccount = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("real");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [showArchived, setShowArchived] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const menuRef = useRef(null);

  const sortOptions = ["Newest", "Oldest", "Free margin", "Nickname"];

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

  return (
    <div className="bg-white rounded-2xl shadow-sm space-y-6 p-4 sm:p-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          My accounts
        </h1>

        <button
          onClick={() => navigate("/user/open-account")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm"
        >
          <Plus size={16} />
          Open account
        </button>
      </div>

      {/* TABS + FILTER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        {/* Tabs */}
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

        {/* SORT */}
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

      {/* REAL */}
      {tab === "real" && (
        <>
          {/* ACCOUNTS */}
          <div className="space-y-4">
            {realAccounts.map((acc) => (
              <div
                key={acc.id}
                className="border rounded-xl p-4 sm:p-5 bg-white space-y-4"
              >
                {/* TOP */}
                <div className="flex justify-between items-start">

                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">Real</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{acc.type}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{acc.name}</span>
                    <span className="font-medium">#{acc.id}</span>
                  </div>

                  {/* 3 DOT MENU */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === acc.id ? null : acc.id)
                      }
                      className="p-2 bg-gray-100 rounded-lg"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === acc.id && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          Adjust leverage
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          Add nickname
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          Account info
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                          Archive
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BALANCE */}
                <div className="text-2xl sm:text-3xl font-semibold">
                  {acc.balance}{" "}
                  <span className="text-sm text-gray-500">USC</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2">

                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 rounded-lg font-medium">
                    Trade
                  </button>

                  <button 
                  onClick={() => navigate("/user/deposit")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm">
                    <ArrowDownCircle size={16} />
                    Deposit
                  </button>

                  <button 
                  onClick={() => navigate("/user/withdraw")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm">
                    <ArrowUpCircle size={16} />
                    Withdraw
                  </button>

                  <button 
                  onClick={() => navigate("/user/transfer")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 rounded-lg text-sm">
                    <Repeat size={16} />
                    Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ARCHIVED */}
          <div className="pt-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                Archived accounts
              </h2>

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
                        <span className="bg-gray-100 px-2 rounded-full">
                          Real
                        </span>
                        <span className="bg-gray-100 px-2 rounded-full">
                          {acc.platform}
                        </span>
                        <span className="bg-gray-100 px-2 rounded-full">
                          {acc.name}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600">
                        Archived on {acc.date}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm w-full sm:w-auto">
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

      {/* DEMO */}
      {tab === "demo" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h2 className="text-lg font-medium">
            No demo accounts yet
          </h2>

          <button
            onClick={() => navigate("/user/open-account")}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg mt-3"
          >
            Open account
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAccount;