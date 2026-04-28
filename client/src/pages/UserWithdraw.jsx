import React from "react";
import { useNavigate } from "react-router-dom";

const methods = [
  {
    id: "erc20",
    name: "Tether (USDT ERC20)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "50 - 1,000,000 USD",
    recommended: true,
  },
  {
    id: "trc20",
    name: "Tether (USDT TRC20)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "10 - 1,000,000 USD",
    recommended: true,
  },
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    time: "Instant - 1 hour",
    fee: "0%",
    limits: "200 - 1,000,000 USD",
  },
  {
    id: "eth",
    name: "Ethereum (ETH)",
    time: "Instant - 15 minutes",
    fee: "0%",
    limits: "10 - 1,000,000 USD",
  },
];

const UserWithdraw = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold border-b pb-6">Withdrawal</h1>

      <h2 className="text-lg font-medium">
        All payment methods
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/user/withdraw/${m.id}`)}
            className="border rounded-xl p-5 bg-white cursor-pointer hover:border-gray-400 transition"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{m.name}</h3>

              {m.recommended && (
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Recommended
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 mt-3 space-y-1">
              <p>Processing time {m.time}</p>
              <p>Fee {m.fee}</p>
              <p>Limits {m.limits}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWithdraw;