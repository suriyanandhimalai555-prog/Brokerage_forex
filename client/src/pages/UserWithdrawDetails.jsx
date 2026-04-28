import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

const methods = {
  erc20: { name: "Tether (USDT ERC20)", fee: "0%", time: "Instant" },
  trc20: { name: "Tether (USDT TRC20)", fee: "0%", time: "Instant" },
  btc: { name: "Bitcoin (BTC)", fee: "0%", time: "Instant - 1 hour" },
};

const methodOptions = Object.entries(methods).map(([id, val]) => ({
  id,
  ...val,
}));

const accountOptions = [
  {
    id: 1,
    label: "Crypto wallet (USDT ERC20)",
    balance: "0.00 USDT",
  },
  {
    id: 2,
    label: "Crypto wallet (USDT TRC20)",
    balance: "120.00 USDT",
  },
];

const WithdrawDetails = () => {
  const { methodId } = useParams();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(methodId);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);
  const [amount, setAmount] = useState("");

  const [methodOpen, setMethodOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const methodRef = useRef();
  const accountRef = useRef();

  const method = methods[selectedMethod];

  useEffect(() => {
    const handleClick = (e) => {
      if (methodRef.current && !methodRef.current.contains(e.target)) {
        setMethodOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!method) return <div>Invalid method</div>;

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg sm:text-2xl font-semibold">
          Withdrawal
        </h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* METHOD */}
          <div ref={methodRef} className="relative">
            <p className="text-sm mb-1">Payment method</p>

            <button
              onClick={() => setMethodOpen(!methodOpen)}
              className="w-full border rounded-lg px-4 py-3 flex justify-between items-center text-left"
            >
              {methods[selectedMethod].name}
              <ChevronDown size={16} />
            </button>

            {methodOpen && (
              <div className="absolute w-full mt-2 border rounded-lg bg-white shadow z-50">
                {methodOptions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMethod(m.id);
                      setMethodOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WALLET */}
          <div>
            <p className="text-sm mb-1">To External Wallet</p>
            <input
              placeholder="Enter wallet address"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* ACCOUNT */}
          <div ref={accountRef} className="relative">
            <p className="text-sm mb-1">From account</p>

            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="w-full border rounded-lg px-4 py-3 flex justify-between text-left"
            >
              <span className="truncate">
                {selectedAccount.label}
              </span>
              <span className="text-gray-500 text-sm">
                {selectedAccount.balance}
              </span>
            </button>

            {accountOpen && (
              <div className="absolute w-full mt-2 border rounded-lg bg-white shadow z-50">
                {accountOptions.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setAccountOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
                  >
                    <span className="truncate">{acc.label}</span>
                    <span className="text-gray-500">
                      {acc.balance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <p className="text-sm mb-1">Amount</p>

            <div className="border rounded-lg flex items-center px-4 py-3">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 outline-none"
              />
              <span className="text-sm text-gray-500">USDT</span>
            </div>

            <p className="text-xs text-blue-600 mt-1">
              50.00 - 1,000,000.00 USDT
            </p>
          </div>

          {/* INFO */}
          <div className="bg-blue-50 border rounded-lg p-4 text-sm text-gray-700">
            Transfer funds from trading account to wallet before withdrawal.
          </div>

          {/* SUMMARY */}
          <div className="bg-gray-100 rounded-lg p-4 flex justify-between">
            <span>To be withdrawn</span>
            <span className="font-semibold">
              {amount || "0.00"} USDT
            </span>
          </div>

          {/* BUTTON */}
          <button
            disabled={!amount}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
          >
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 pt-6 lg:pt-0 lg:pl-6">

          <div>
            <h3 className="font-semibold mb-2">Terms</h3>
            <p className="text-sm">
              Avg time: <b>{method.time}</b>
            </p>
            <p className="text-sm">
              Fee: <b>{method.fee}</b>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <div className="space-y-2 text-sm text-blue-600">
              <p>Learn about crypto</p>
              <p>Verify address</p>
              <p>Withdraw guide</p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-500">
        All crypto wallet services are provided by Thecario Ltd.
      </p>
    </div>
  );
};

export default WithdrawDetails;