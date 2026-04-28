import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowLeft } from "lucide-react";

const methods = {
  bep20: {
    name: "Tether (USDT BEP20)",
    fee: "0%",
    time: "Instant",
  },
  erc20: {
    name: "Tether (USDT ERC20)",
    fee: "0%",
    time: "Instant",
  },
  btc: {
    name: "Bitcoin (BTC)",
    fee: "0%",
    time: "Instant - 1 hour",
  },
};

const methodOptions = Object.entries(methods).map(([key, val]) => ({
  id: key,
  name: val.name,
}));

const accountOptions = [
  { id: 1, label: "MT5 263244830", balance: "692 USC" },
  { id: 2, label: "MT5 987654321", balance: "1200 USC" },
];

const DepositDetails = () => {
  const { methodId } = useParams();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(methodId);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);

  const [methodOpen, setMethodOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const methodRef = useRef();
  const accountRef = useRef();

  const method = methods[selectedMethod];

  /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
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
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Deposit Details</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">

          {/* PAYMENT METHOD DROPDOWN */}
          <div ref={methodRef}>
            <p className="text-sm mb-1">Payment method</p>

            <div
              onClick={() => setMethodOpen(!methodOpen)}
              className="border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer"
            >
              {methods[selectedMethod].name}
              <ChevronDown size={16} />
            </div>

            {methodOpen && (
              <div className="mt-2 border rounded-lg bg-white shadow">
                {methodOptions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMethod(m.id);
                      setMethodOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACCOUNT DROPDOWN */}
          <div ref={accountRef}>
            <p className="text-sm mb-1">To account</p>

            <div
              onClick={() => setAccountOpen(!accountOpen)}
              className="border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer"
            >
              <span>{selectedAccount.label}</span>
              <span className="text-gray-500">
                {selectedAccount.balance}
              </span>
            </div>

            {accountOpen && (
              <div className="mt-2 border rounded-lg bg-white shadow">
                {accountOptions.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc);
                      setAccountOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex justify-between"
                  >
                    <span>{acc.label}</span>
                    <span className="text-gray-500">
                      {acc.balance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Funds will be credited to the selected account.
          </p>

          <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium">
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Terms</h3>
            <p className="text-sm">
              Average payment time: <b>{method.time}</b>
            </p>
            <p className="text-sm">
              Fee: <b>{method.fee}</b>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <div className="space-y-2 text-sm text-blue-600">
              <p>Learn more about crypto</p>
              <p>How do I deposit with {method.name}?</p>
              <p>How do I buy crypto?</p>
              <p>How do I verify address?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositDetails;