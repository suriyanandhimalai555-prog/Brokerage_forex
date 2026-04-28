import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const history = [
  {
    date: "Mon, Apr 27 2026",
    items: [
      {
        symbol: "XAU/USD",
        platform: "MT5",
        account: "#263244830",
        profit: "+0.01",
      },
    ],
  },
  {
    date: "Fri, Apr 24 2026",
    items: [
      {
        symbol: "XAU/USD",
        platform: "MT5",
        account: "#263244830",
        profit: "+0.01",
      },
    ],
  },
];

const SwapFree = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold">Swap-Free</h1>
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
          <h2 className="text-xl font-semibold">1.36 USD</h2>
          <p className="text-sm text-gray-500">Total swap fees saved</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">31 times</h2>
          <p className="text-sm text-gray-500">Swap fee avoided</p>
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold">
                        🪙
                      </div>

                      <div>
                        <p className="font-medium">{item.symbol}</p>
                        <p className="text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">
                            {item.platform}
                          </span>
                          {item.account}
                        </p>
                      </div>
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

export default SwapFree;