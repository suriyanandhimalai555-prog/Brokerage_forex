import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

const methods = {
  internal: {
    name: "Between your accounts",
  },
  user: {
    name: "To another user",
  },
};

const accounts = [
  { id: 1, label: "MT5 263244830", balance: "693 USC" },
  { id: 2, label: "MT5 987654321", balance: "1200 USC" },
];

const TransferDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(type);
  const [fromAccount, setFromAccount] = useState(accounts[0]);
  const [toAccount, setToAccount] = useState(accounts[1]);
  const [amount, setAmount] = useState("");

  const [methodOpen, setMethodOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const methodRef = useRef();
  const fromRef = useRef();
  const toRef = useRef();

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (methodRef.current && !methodRef.current.contains(e.target))
        setMethodOpen(false);
      if (fromRef.current && !fromRef.current.contains(e.target))
        setFromOpen(false);
      if (toRef.current && !toRef.current.contains(e.target))
        setToOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const method = methods[selectedMethod];

  if (!method) return <div>Invalid transfer type</div>;

  return (
  <div className="min-h-screen">
    
    <div className="mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg sm:text-2xl font-semibold">Transfer</h1>
      </div>

      <button
        onClick={() => navigate("/user/transfer")}
        className="text-blue-600 text-sm"
      >
        See all payment methods
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* METHOD */}
          <div ref={methodRef} className="relative">
            <p className="text-sm mb-1">Payment method</p>

            <div
              onClick={() => setMethodOpen(!methodOpen)}
              className="h-12 border rounded-xl px-4 flex justify-between items-center cursor-pointer"
            >
              {method.name}
              <ChevronDown size={16} />
            </div>

            {methodOpen && (
              <div className="absolute w-full mt-2 border rounded-xl bg-white shadow z-50">
                {Object.entries(methods).map(([key, val]) => (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedMethod(key);
                      setMethodOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {val.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FROM */}
          <div ref={fromRef} className="relative">
            <p className="text-sm mb-1">From account</p>

            <div
              onClick={() => setFromOpen(!fromOpen)}
              className="h-12 border rounded-xl px-4 flex justify-between items-center cursor-pointer"
            >
              <span className="truncate">{fromAccount.label}</span>
              <span className="text-gray-400 text-sm">
                {fromAccount.balance}
              </span>
            </div>

            {fromOpen && (
              <div className="absolute w-full mt-2 border rounded-xl bg-white shadow z-50">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setFromAccount(acc);
                      setFromOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
                  >
                    <span>{acc.label}</span>
                    <span className="text-gray-400">
                      {acc.balance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO */}
          <div ref={toRef} className="relative">
            <p className="text-sm mb-1">To account</p>

            <div
              onClick={() => setToOpen(!toOpen)}
              className="h-12 border rounded-xl px-4 flex justify-between items-center cursor-pointer"
            >
              <span className="truncate">{toAccount.label}</span>
              <ChevronDown size={16} />
            </div>

            {toOpen && (
              <div className="absolute w-full mt-2 border rounded-xl bg-white shadow z-50">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setToAccount(acc);
                      setToOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {acc.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <p className="text-sm mb-1">Amount</p>

            <div className="h-12 border rounded-xl px-4 flex items-center">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 outline-none text-sm"
              />
              <span className="text-gray-400 text-sm">USC</span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={!amount}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium disabled:opacity-50"
          >
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 pt-6 lg:pt-0 lg:pl-6">
          <div>
            <h3 className="font-semibold mb-2">Terms</h3>
            <p className="text-sm">
              Average payment time: <b>Instant</b>
            </p>
            <p className="text-sm">
              Fee: <b>0%</b>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <p className="text-sm text-blue-600 cursor-pointer">
              General transfer rules
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
);
};

export default TransferDetails;