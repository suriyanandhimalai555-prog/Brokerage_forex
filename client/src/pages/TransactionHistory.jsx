import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  ChevronDown,
  Search,
  Loader2,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Wallet,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("token");

/* ---------------- FILTER ---------------- */

const Filter = ({
  value,
  setValue,
  options,
}) => {
  const [open, setOpen] =
    useState(false);

  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(
          e.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
    >
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-xl text-sm"
      >
        {value}

        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute mt-2 bg-white border rounded-xl shadow-lg w-52 z-50 max-h-60 overflow-y-auto">

          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- BADGE ---------------- */

const badge = (status) => {
  const s = String(
    status || ""
  ).toLowerCase();

  if (
    s === "paid" ||
    s === "approved" ||
    s === "completed"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    s === "pending" ||
    s === "pending_payment"
  ) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (
    s === "failed" ||
    s === "rejected"
  ) {
    return "bg-red-100 text-red-600";
  }

  return "bg-gray-100 text-gray-600";
};

/* ---------------- TYPE CONFIG ---------------- */

const typeConfig = {
  deposit: {
    title: "Deposit",
    icon: ArrowDownCircle,
    iconBg:
      "bg-green-100",
    iconColor:
      "text-green-600",
    amountColor:
      "text-green-600",
  },

  withdraw: {
    title: "Withdraw",
    icon: ArrowUpCircle,
    iconBg:
      "bg-red-100",
    iconColor:
      "text-red-600",
    amountColor:
      "text-red-500",
  },

  transfer: {
    title: "Transfer",
    icon: Repeat,
    iconBg:
      "bg-blue-100",
    iconColor:
      "text-blue-600",
    amountColor:
      "text-blue-600",
  },
};

const TransactionHistory = () => {
  const [loading, setLoading] =
    useState(true);

  const [transactions, setTransactions] =
    useState([]);

  const [accounts, setAccounts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("Last 30 days");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All categories");

  const [
    accountFilter,
    setAccountFilter,
  ] = useState("All accounts");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        depositsRes,
        withdrawalsRes,
        transfersRes,
        accountsRes,
      ] = await Promise.all([
        axios.get(
          `${API_URL}/api/deposits/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        ),

        axios.get(
          `${API_URL}/api/withdrawals/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        ),

        axios.get(
          `${API_URL}/api/transfers/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        ),

        axios.get(
          `${API_URL}/api/accounts/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        ),
      ]);

      const userAccounts = (
        accountsRes.data?.accounts || []
      ).filter(
        (acc) =>
          acc.account_type ===
          "real"
      );

      setAccounts(userAccounts);

      const deposits = (
        depositsRes.data?.deposits || []
      ).map((d) => ({
        id: d.id,
        type: "deposit",
        amount: Number(
          d.amount || 0
        ),
        status: d.status,
        account:
          d.account_no,
        plan:
          d.plan_name,
        invoice:
          d.deposit_no,
        created_at:
          d.created_at,
        currency:
          d.currency || "USD",
        network:
          d.network,
      }));

      const withdrawals = (
        withdrawalsRes.data
          ?.withdrawals || []
      ).map((d) => ({
        id: d.id,
        type: "withdraw",
        amount: Number(
          d.amount || 0
        ),
        status: d.status,
        account:
          d.account_no,
        plan:
          d.plan_name,
        invoice:
          d.withdrawal_no,
        created_at:
          d.created_at,
        currency:
          d.currency || "USD",
      }));

      const transfers = (
        transfersRes.data
          ?.transfers || []
      ).map((d) => ({
        id: d.id,
        type: "transfer",
        amount: Number(
          d.amount || 0
        ),
        status: d.status,
        account: `${d.from_account_no} → ${d.to_account_no}`,
        plan: `${d.from_plan_name} → ${d.to_plan_name}`,
        invoice:
          d.transfer_no,
        created_at:
          d.created_at,
        currency:
          d.currency || "USD",
      }));

      const merged = [
        ...deposits,
        ...withdrawals,
        ...transfers,
      ].sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(a.created_at)
      );

      setTransactions(merged);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filtered =
    useMemo(() => {
      let result = [
        ...transactions,
      ];

      if (search.trim()) {
        result = result.filter(
          (item) =>
            [
              item.account,
              item.plan,
              item.invoice,
              item.type,
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
      }

      if (
        categoryFilter !==
        "All categories"
      ) {
        result = result.filter(
          (item) =>
            item.type ===
            categoryFilter.toLowerCase()
        );
      }

      if (
        accountFilter !==
        "All accounts"
      ) {
        result = result.filter(
          (item) =>
            item.account?.includes(
              accountFilter
            )
        );
      }

      const now =
        new Date();

      if (
        dateFilter ===
        "Last 7 days"
      ) {
        result = result.filter(
          (item) =>
            new Date(
              item.created_at
            ) >=
            new Date(
              now.getTime() -
                7 *
                  24 *
                  60 *
                  60 *
                  1000
            )
        );
      }

      if (
        dateFilter ===
        "Last 30 days"
      ) {
        result = result.filter(
          (item) =>
            new Date(
              item.created_at
            ) >=
            new Date(
              now.getTime() -
                30 *
                  24 *
                  60 *
                  60 *
                  1000
            )
        );
      }

      return result;
    }, [
      transactions,
      search,
      dateFilter,
      categoryFilter,
      accountFilter,
    ]);

  /* ---------------- SUMMARY ---------------- */

  const summary =
    useMemo(() => {
      let deposits = 0;
      let withdraws = 0;
      let transfers = 0;

      filtered.forEach((t) => {
        if (
          t.type ===
          "deposit"
        ) {
          deposits += t.amount;
        }

        if (
          t.type ===
          "withdraw"
        ) {
          withdraws += t.amount;
        }

        if (
          t.type ===
          "transfer"
        ) {
          transfers += t.amount;
        }
      });

      return {
        deposits,
        withdraws,
        transfers,
      };
    }, [filtered]);

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b pb-6">

        <div>
          <h1 className="text-2xl font-semibold">
            Transaction History
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View all deposits,
            withdrawals and transfers
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full xl:w-80">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm"
          />
        </div>
      </div>

      {/* SUMMARY */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-green-700">
                Total Deposits
              </p>

              <h2 className="text-2xl font-bold mt-1 text-green-700">
                $
                {summary.deposits.toFixed(
                  2
                )}
              </h2>
            </div>

            <ArrowDownCircle className="text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-red-700">
                Total Withdraws
              </p>

              <h2 className="text-2xl font-bold mt-1 text-red-700">
                $
                {summary.withdraws.toFixed(
                  2
                )}
              </h2>
            </div>

            <ArrowUpCircle className="text-red-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-blue-700">
                Total Transfers
              </p>

              <h2 className="text-2xl font-bold mt-1 text-blue-700">
                $
                {summary.transfers.toFixed(
                  2
                )}
              </h2>
            </div>

            <Repeat className="text-blue-600" />
          </div>
        </div>
      </div> */}

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">

        <Filter
          value={dateFilter}
          setValue={
            setDateFilter
          }
          options={[
            "Last 7 days",
            "Last 30 days",
            "All time",
          ]}
        />

        <Filter
          value={
            categoryFilter
          }
          setValue={
            setCategoryFilter
          }
          options={[
            "All categories",
            "Deposit",
            "Withdraw",
            "Transfer",
          ]}
        />

        <Filter
          value={
            accountFilter
          }
          setValue={
            setAccountFilter
          }
          options={[
            "All accounts",
            ...accounts.map(
              (a) =>
                a.account_no
            ),
          ]}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-gray-500">

            <Loader2 className="animate-spin" />

            Loading transactions...
          </div>
        ) : filtered.length >
          0 ? (
          filtered.map(
            (item) => {
              const cfg =
                typeConfig[
                  item.type
                ];

              const Icon =
                cfg.icon;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border rounded-2xl p-4 sm:p-5 hover:shadow-md transition bg-white"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cfg.iconBg}`}
                      >
                        <Icon
                          className={
                            cfg.iconColor
                          }
                          size={
                            28
                          }
                        />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-lg">
                            {
                              cfg.title
                            }
                          </h3>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${badge(
                              item.status
                            )}`}
                          >
                            {
                              item.status
                            }
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </p>

                        <div className="mt-3 space-y-1 text-sm">

                          <div className="flex items-center gap-2 text-gray-700">

                            <Wallet size={14} />

                            <span>
                              {
                                item.account
                              }
                            </span>
                          </div>

                          <div className="text-gray-500">
                            {
                              item.plan
                            }
                          </div>

                          <div className="text-xs text-gray-400">
                            Transaction ID:{" "}
                            {
                              item.invoice
                            }
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:text-right">

                      <div
                        className={`text-2xl font-bold ${cfg.amountColor}`}
                      >
                        {item.type ===
                        "deposit"
                          ? "+"
                          : item.type ===
                            "withdraw"
                          ? "-"
                          : ""}

                        {item.amount.toFixed(
                          2
                        )}{" "}

                        {
                          item.currency
                        }
                      </div>

                      {item.network && (
                        <div className="mt-2 text-xs text-gray-500">
                          Network:{" "}
                          {
                            item.network
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )
        ) : (
          <div className="text-center text-gray-500 py-20">

            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;