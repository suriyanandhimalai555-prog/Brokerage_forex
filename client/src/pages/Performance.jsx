import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------- FULL 12 MONTHS BASE ---------- */
const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

/* ---------- DATA ---------- */

// Net profit (profit + loss)
const netData = months.map((m) => ({
  name: m,
  profit: m === "Apr" ? 2 : 0,
  loss: m === "Dec" ? -10 : 0,
}));

// Closed orders
const ordersData = months.map((m, i) => ({
  name: m,
  value: [120, 90, 140, 180, 160, 200, 170, 210, 190, 220, 250, 300][i],
}));

// Trading volume
const volumeData = months.map((m, i) => ({
  name: m,
  value: [
    12000, 15000, 18000, 20000, 22000, 25000,
    23000, 27000, 30000, 35000, 40000, 65000
  ][i],
}));

// Equity
const equityData = months.map((m, i) => ({
  name: m,
  value: [5, 6, 5, 6, 7, 6, 5, 6, 7, 6, 7, 8][i],
}));

/* ---------- COMPONENT ---------- */

const Performance = () => {
  const [tab, setTab] = useState("net");

  const getChartConfig = () => {
    switch (tab) {
      case "closed":
        return {
          data: ordersData,
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
          data: volumeData,
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
          data: equityData,
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
          data: netData,
          bars: [
            <Bar key="profit" dataKey="profit" fill="#16a34a" />,
            <Bar key="loss" dataKey="loss" fill="#1f2937" />,
          ],
        };
    }
  };

  const { data, bars } = getChartConfig();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-8">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold border-b pb-6">Summary</h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select className="border px-3 py-2 rounded-lg text-sm">
          <option>All accounts</option>
        </select>

        <select className="border px-3 py-2 rounded-lg text-sm">
          <option>Last 365 days</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Net profit</p>
          <p className="text-lg font-semibold text-red-500">
            -12.01 USD
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Profit +22.35 / Loss -34.35
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Closed orders</p>
          <p className="text-lg font-semibold">1553</p>
          <p className="text-xs text-gray-500 mt-1">
            Profitable 748 / Unprofitable 805
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Trading volume</p>
          <p className="text-lg font-semibold">
            125,502.05 USD
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Lifetime 125,502.05
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Equity</p>
          <p className="text-lg font-semibold text-green-600">
            6.93 USD
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Current 7.93 USD
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-lg">
        <div>
            <p><span className="text-sm text-gray-500">Profit</span> +22.35 USD</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Profitable</span> 748</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Lifetime</span> 125,502.05 USD</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Current</span> 7.93 USD</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Loss</span> -34.35 USD</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Unprofitable</span> 805</p>
        </div>

        <div>
            <p><span className="text-sm text-gray-500">Unrealised P/L</span> -1.00 USD</p>
        </div>
      </div>

      {/* CHART TABS */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Charts</h2>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "net", label: "Net profit" },
            { key: "closed", label: "Closed orders" },
            { key: "volume", label: "Trading volume" },
            { key: "equity", label: "Equity" },
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

      {/* CHART */}
      <div className="w-full h-[350px] bg-white border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            {bars}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-500">
        Please keep in mind that only closed position count.
        Updated on 04/28/2026, 04:51 AM (UTC). For real-time
        statistics, check Terminal.
      </p>
    </div>
  );
};

export default Performance;