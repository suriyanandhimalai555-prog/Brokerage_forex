import { InfoIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Swap-Free", value: 1.36, color: "#4F46E5" },
  { name: "Negative Balance Protection", value: 0.69, color: "#F9A8D4" },
];

const total = data.reduce((acc, cur) => acc + cur.value, 0);

const Savings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      
      {/* HEADER */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Savings</h1>
        <p className="text-sm text-gray-500">
          This shows how much each trading benefit has saved you.
        </p>
      </div>

      {/* ACCOUNT */}
      <div>
        <p className="text-sm mb-1">Account</p>
        <select className="border rounded-lg px-4 py-2">
          <option>All accounts</option>
        </select>
      </div>

      {/* INFO */}
      <div className="bg-gray-100 border rounded-lg p-3 text-sm text-red-400">
        <InfoIcon className="inline mr-2" />
        EXT accounts are not supported yet.
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        
        {/* 🔥 REAL DONUT */}
        <div className="w-full h-[300px] relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={90}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${value} USD`}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <h2 className="text-2xl font-semibold">
              {total.toFixed(2)}
            </h2>
            <p className="text-sm text-gray-500">USD</p>
          </div>
        </div>

        {/* CARDS */}
        <div className="space-y-4">
          
          <div
            onClick={() => navigate("/user/savings/swap")}
            className="border rounded-xl p-5 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <h3 className="font-medium">Swap-Free</h3>
              <span>›</span>
            </div>
            <p className="text-xl font-semibold mt-2">1.36 USD</p>
          </div>

          <div
            onClick={() => navigate("/user/savings/negative")}
            className="border rounded-xl p-5 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <h3 className="font-medium">
                Negative Balance Protection
              </h3>
              <span>›</span>
            </div>
            <p className="text-xl font-semibold mt-2">0.69 USD</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Savings;