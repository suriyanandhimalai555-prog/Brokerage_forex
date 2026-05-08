import React, { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

const API_URL = "http://localhost:5000";

const HistoryOrders = () => {
  const [tab, setTab] = useState("closed");

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDateTime = (value) => {
    if (!value) return "-";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
      return String(value);
    }

    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE ORDER
  |--------------------------------------------------------------------------
  */

  const normalizeOrder = (row) => {
    const status = (row.status || "open").toLowerCase();

    return {
      id: row.id,

      symbol: row.symbol || "-",

      type: row.type
        ? row.type
            .replaceAll("_", " ")
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
            )
            .join(" ")
        : "-",

      openTime: formatDateTime(
        row.open_time || row.created_at
      ),

      closeTime: formatDateTime(row.close_time),

      lots:
        row.lot_size !== null &&
        row.lot_size !== undefined
          ? Number(row.lot_size).toFixed(2)
          : "-",

      openPrice:
        row.open_price !== null &&
        row.open_price !== undefined
          ? Number(row.open_price).toFixed(5)
          : "-",

      closePrice:
        row.close_price !== null &&
        row.close_price !== undefined
          ? Number(row.close_price).toFixed(5)
          : "-",

      profit:
        row.profit !== null &&
        row.profit !== undefined
          ? Number(row.profit)
          : null,

      positionId: row.position_id ?? row.id ?? "-",

      commission:
        row.commission !== null &&
        row.commission !== undefined
          ? row.commission
          : "0",

      status,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH ACCOUNTS
  |--------------------------------------------------------------------------
  */

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/accounts/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const list = Array.isArray(data.accounts)
        ? data.accounts
        : [];

      setAccounts(list);

      /*
      |--------------------------------------------------------------------------
      | AUTO SELECT FIRST ACCOUNT
      |--------------------------------------------------------------------------
      */

      if (list.length > 0 && !selectedAccount) {
        setSelectedAccount(list[0].id);
      }
    } catch (err) {
      console.error("Accounts fetch error:", err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH ORDERS
  |--------------------------------------------------------------------------
  */

  const fetchOrders = async () => {
    try {
      if (!selectedAccount) return;

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/orders?account_id=${selectedAccount}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const list = Array.isArray(data.orders)
        ? data.orders
        : [];

      setOrders(list.map(normalizeOrder));
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchOrders();
    }
  }, [selectedAccount]);

  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  const openOrders = useMemo(
    () =>
      orders.filter(
        (row) =>
          row.status === "open" ||
          row.status === "pending"
      ),
    [orders]
  );

  const closedOrders = useMemo(
    () =>
      orders.filter(
        (row) => row.status === "closed"
      ),
    [orders]
  );

  const currentRows =
    tab === "closed"
      ? closedOrders
      : openOrders;

  /*
  |--------------------------------------------------------------------------
  | SELECTED ACCOUNT INFO
  |--------------------------------------------------------------------------
  */

  const selectedAccountInfo = accounts.find(
    (acc) => acc.id === selectedAccount
  );

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
      <h1 className="text-2xl font-semibold border-b pb-6">
        History of orders
      </h1>

      {/* ACCOUNT SELECTOR */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedAccount}
            onChange={(e) =>
              setSelectedAccount(e.target.value)
            }
            className="border px-4 py-2 rounded-lg text-sm min-w-[280px]"
          >
            {accounts.map((acc) => (
              <option
                key={acc.id}
                value={acc.id}
              >
                {acc.account_type === "demo"
                  ? "Demo"
                  : "Real"}{" "}
                • {acc.nickname} • #
                {acc.account_no}
              </option>
            ))}
          </select>

          {selectedAccountInfo && (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedAccountInfo.account_type ===
                  "demo"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selectedAccountInfo.account_type.toUpperCase()}
              </span>

              <span className="font-medium">
                Balance:
              </span>

              <span>
                {Number(
                  selectedAccountInfo.balance || 0
                ).toFixed(2)}{" "}
                {selectedAccountInfo.currency}
              </span>
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm">
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTab("closed")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                tab === "closed"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Closed orders
            </button>

            <button
              onClick={() => setTab("open")}
              className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                tab === "open"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Open orders
            </button>
          </div>

          <select className="border px-4 py-2 rounded-lg text-sm">
            <option>All time</option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="border rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 text-left">
              {tab === "closed" ? (
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">
                    Opening time
                  </th>
                  <th className="px-4 py-3">
                    Closing time
                  </th>
                  <th className="px-4 py-3">Lots</th>
                  <th className="px-4 py-3">
                    Opening price
                  </th>
                  <th className="px-4 py-3">
                    Closing price
                  </th>
                  <th className="px-4 py-3 text-right">
                    Profit
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">
                    Opening time
                  </th>
                  <th className="px-4 py-3">Lots</th>
                  <th className="px-4 py-3">
                    Opening price
                  </th>
                  <th className="px-4 py-3">
                    Position ID
                  </th>
                  <th className="px-4 py-3 text-right">
                    Commission
                  </th>
                </tr>
              )}
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      tab === "closed" ? 8 : 7
                    }
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {row.symbol}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          row.type
                            .toLowerCase()
                            .includes("buy")
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {row.openTime}
                    </td>

                    {tab === "closed" ? (
                      <>
                        <td className="px-4 py-3">
                          {row.closeTime}
                        </td>

                        <td className="px-4 py-3">
                          {row.lots}
                        </td>

                        <td className="px-4 py-3">
                          {row.openPrice}
                        </td>

                        <td className="px-4 py-3">
                          {row.closePrice}
                        </td>

                        <td
                          className={`px-4 py-3 text-right font-medium ${
                            row.profit > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {row.profit > 0
                            ? "+"
                            : ""}
                          {row.profit !== null
                            ? row.profit.toFixed(2)
                            : "-"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          {row.lots}
                        </td>

                        <td className="px-4 py-3">
                          {row.openPrice}
                        </td>

                        <td className="px-4 py-3">
                          {row.positionId}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.commission}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      tab === "closed" ? 8 : 7
                    }
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrders;