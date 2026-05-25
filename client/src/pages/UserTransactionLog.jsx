import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const formatMoney = (value, currency = "USD") => {
  const amount = Number(value || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
};

const getStatusClasses = (status = "") => {
  const s = String(status).toLowerCase();

  if (["paid", "completed", "approved"].includes(s)) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (["pending", "pending_payment"].includes(s)) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (["rejected", "failed", "cancelled"].includes(s)) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getTxnLabel = (row) => {
  const kind = String(row?.transaction_kind || "").toLowerCase();

  if (kind === "deposit") return "Deposit";
  if (kind === "withdrawal") return "Withdrawal";
  if (kind === "transfer") return "Transfer";

  return row?.transaction_kind || "-";
};

const getAccountLabel = (row) => {
  if (row?.transaction_kind === "transfer") {
    return `${row?.from_account_no || "-"} → ${row?.to_account_no || "-"}`;
  }

  return row?.account_no || "-";
};

const UserTransactionLog = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get("/api/admin/transactions");
      setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load transaction logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return transactions;

    return transactions.filter((row) => {
      const searchable = [
        row?.user_name,
        row?.user_email,
        row?.transaction_kind,
        row?.transaction_type,
        row?.reference_no,
        row?.account_no,
        row?.from_account_no,
        row?.to_account_no,
        row?.status,
        row?.note,
        row?.currency,
        row?.amount,
        row?.plan_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [transactions, search]);

  const visibleRows = filtered.slice(0, Number(pageSize));

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-indigo-50">
          <h2 className="text-lg sm:text-xl font-semibold">
            User Transaction Log
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            Show
            <select
              className="border rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm whitespace-nowrap">Search:</span>
            <input
              className="border rounded-md px-3 py-2 text-sm w-full md:w-72"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="rounded-xl border overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-[#353b8f] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left">S.No</th>
                    <th className="px-3 py-3 text-left">User</th>
                    <th className="px-3 py-3 text-left">Email</th>
                    <th className="px-3 py-3 text-left">Account No</th>
                    <th className="px-3 py-3 text-left">Transaction</th>
                    <th className="px-3 py-3 text-left">Transaction Type</th>
                    <th className="px-3 py-3 text-left">Transaction Value</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left">Modified Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-gray-500">
                        Loading transaction logs...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-red-600">
                        {error}
                      </td>
                    </tr>
                  ) : visibleRows.length > 0 ? (
                    visibleRows.map((row, index) => (
                      <tr key={`${row.transaction_kind}-${row.source_id}`} className="border-b hover:bg-gray-50 text-left">
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="px-3">{row.user_name || "-"}</td>
                        <td className="px-3">{row.user_email || "-"}</td>
                        <td className="px-3">{getAccountLabel(row)}</td>
                        <td className="px-3">{getTxnLabel(row)}</td>
                        <td className="px-3">{row.transaction_type || "-"}</td>
                        <td className="px-3">
                          {formatMoney(row.amount, row.currency)}
                        </td>
                        <td className="px-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium ${getStatusClasses(
                              row.status
                            )}`}
                          >
                            {row.status || "-"}
                          </span>
                        </td>
                        <td className="px-3">
                          {row.updated_at || row.created_at
                            ? new Date(row.updated_at || row.created_at).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-gray-500">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mt-4 text-sm text-gray-600">
            <p>
              Showing {filtered.length > 0 ? 1 : 0} to{" "}
              {Math.min(visibleRows.length, filtered.length)} of{" "}
              {filtered.length} entries
            </p>

            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-[#353b8f] text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border rounded opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTransactionLog;