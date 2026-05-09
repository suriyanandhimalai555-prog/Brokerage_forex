import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Performance = () => {
  const [tab, setTab] = useState("net");

  const [accounts, setAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] =
    useState("");

  const [summary, setSummary] = useState({
    net_profit: 0,
    total_profit: 0,
    total_loss: 0,
    closed_orders: 0,
    profitable_orders: 0,
    unprofitable_orders: 0,
    trading_volume: 0,
    equity: 0,
  });

  const [chartData, setChartData] = useState([]);

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

      if (list.length > 0 && !selectedAccount) {
        setSelectedAccount(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH PERFORMANCE
  |--------------------------------------------------------------------------
  */

  const fetchPerformance = async () => {
    try {
      if (!selectedAccount) return;

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/accounts/performance?account_id=${selectedAccount}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setSummary(data.summary || {});

      setChartData(
        Array.isArray(data.charts)
          ? data.charts
          : []
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchPerformance();
    }
  }, [selectedAccount]);

  /*
  |--------------------------------------------------------------------------
  | CHART CONFIG
  |--------------------------------------------------------------------------
  */

  const chartConfig = useMemo(() => {
    switch (tab) {
      case "closed":
        return {
          data: chartData.map((row) => ({
            name: row.month,
            value: Number(row.orders || 0),
          })),
          bars: [
            <Bar
              key="orders"
              dataKey="value"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />,
          ],
        };

      case "volume":
        return {
          data: chartData.map((row) => ({
            name: row.month,
            value: Number(row.volume || 0),
          })),
          bars: [
            <Bar
              key="volume"
              dataKey="value"
              fill="#7c3aed"
              radius={[6, 6, 0, 0]}
            />,
          ],
        };

      case "equity":
        return {
          data: chartData.map((row) => ({
            name: row.month,
            value: Number(
              summary.equity || 0
            ),
          })),
          bars: [
            <Bar
              key="equity"
              dataKey="value"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />,
          ],
        };

      default:
        return {
          data: chartData.map((row) => ({
            name: row.month,
            profit: Number(row.profit || 0),
            loss: Number(row.loss || 0),
          })),
          bars: [
            <Bar
              key="profit"
              dataKey="profit"
              fill="#16a34a"
            />,
            <Bar
              key="loss"
              dataKey="loss"
              fill="#ef4444"
            />,
          ],
        };
    }
  }, [tab, chartData, summary]);

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-8">
      <h1 className="text-2xl font-semibold border-b pb-6">
        Summary
      </h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedAccount}
          onChange={(e) =>
            setSelectedAccount(e.target.value)
          }
          className="border px-3 py-2 rounded-lg text-sm"
        >
          {accounts.map((acc) => (
            <option
              key={acc.id}
              value={acc.id}
            >
              {acc.account_type === "demo"
                ? "Demo"
                : "Real"}{" "}
              • {acc.nickname}
            </option>
          ))}
        </select>

        <select className="border px-3 py-2 rounded-lg text-sm">
          <option>Last 365 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">
            Net profit
          </p>

          <p
            className={`text-lg font-semibold ${
              summary.net_profit >= 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {summary.net_profit.toFixed(2)} USD
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Profit +
            {summary.total_profit.toFixed(2)} /
            Loss{" "}
            {summary.total_loss.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Closed orders
          </p>

          <p className="text-lg font-semibold">
            {summary.closed_orders}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Profitable{" "}
            {summary.profitable_orders} /
            Unprofitable{" "}
            {summary.unprofitable_orders}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Trading volume
          </p>

          <p className="text-lg font-semibold">
            {summary.trading_volume.toFixed(2)}{" "}
            USD
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Equity
          </p>

          <p className="text-lg font-semibold text-green-600">
            {summary.equity.toFixed(2)} USD
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Charts
        </h2>

        <div className="flex gap-2 flex-wrap">
          {[
            {
              key: "net",
              label: "Net profit",
            },
            {
              key: "closed",
              label: "Closed orders",
            },
            {
              key: "volume",
              label: "Trading volume",
            },
            {
              key: "equity",
              label: "Equity",
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                tab === t.key
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[350px] bg-white border rounded-xl p-4">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={chartConfig.data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            {chartConfig.bars}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Performance;