import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const history = [
  {
    date: "Fri, Dec 26 2025",
    items: [
      {
        time: "16:40:56",
        account: "MT5 • Standard Cent #263244830",
        profit: "+0.39",
      },
    ],
  },
  {
    date: "Thu, Apr 17 2025",
    items: [
      {
        time: "02:18:28",
        account: "MT5 • XAUUSD #183297012",
        profit: "+0.02",
      },
    ],
  },
];

const NegativeBalance = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold">
            Negative Balance Protection
          </h1>
        </div>
        <span className="text-sm text-gray-500">About the benefit</span>
      </div>

      {/* ACCOUNT */}
      <div>
        <p className="text-sm mb-1">Account</p>
        <select className="border rounded-lg px-4 py-2">
          <option>All accounts</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div className="border rounded-xl p-6 flex justify-between bg-white">
        <div>
          <h2 className="text-xl font-semibold">0.69 USD</h2>
          <p className="text-sm text-gray-500">
            Credited to restore balance
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">16 times</h2>
          <p className="text-sm text-gray-500">
            Balance restored to 0
          </p>
        </div>
      </div>

      {/* HISTORY */}
      <div>
        <h3 className="text-sm font-medium mb-4">Benefit history</h3>

        <div className="space-y-6">
          {history.map((group, i) => (
            <div key={i}>
              {/* DATE */}
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {group.date}
              </p>

              {/* ROWS */}
              <div className="border rounded-xl divide-y bg-white">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
                  >
                    {/* LEFT */}
                    <div>
                      <p className="text-sm font-medium">
                        {item.account}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.time}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <p className="text-green-600 font-medium">
                      {item.profit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NegativeBalance;