import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

/* ---------------- DATA ---------------- */

const assets = [
  {
    id: 1,
    name: "Bitcoin (BTC)",
    symbol: "BTC",
    balance: "0.00000000",
    usd: "≈ 0.00 USD",
  },
  {
    id: 2,
    name: "Ether (ETH)",
    symbol: "ETH",
    balance: "0.00000000",
    usd: "≈ 0.00 USD",
  },
  {
    id: 3,
    name: "Tether (USDT BEP20)",
    symbol: "USDT",
    balance: "0.00",
    usd: "= 0.00 USD",
  },
];

/* ---------------- COMPONENT ---------------- */

const CryptoWallet = () => {
  const [tab, setTab] = useState("accounts");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("Account name");

  const [showModal, setShowModal] = useState(false);
  const [walletType, setWalletType] = useState("exchange");
  const [address, setAddress] = useState("");

  const filterRef = useRef();
  const modalRef = useRef();

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* CLOSE MODAL */
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModal]);

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-4 sm:p-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold border-b pb-4">
          Crypto wallet
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Total balance
        </p>

        <p className="text-xl sm:text-2xl font-semibold">
          0.90 USD
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-6 text-sm overflow-x-auto">
        <button
          onClick={() => setTab("accounts")}
          className={`pb-2 whitespace-nowrap ${
            tab === "accounts"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Accounts
        </button>

        <button
          onClick={() => setTab("external")}
          className={`pb-2 whitespace-nowrap ${
            tab === "external"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          External wallets
        </button>
      </div>

      {/* FILTER */}
      {tab === "accounts" && (
        <div ref={filterRef} className="relative w-full sm:w-fit">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full sm:w-auto border rounded-lg px-4 py-2 flex justify-between items-center gap-2 text-sm"
          >
            {filter}
            <ChevronDown size={14} />
          </button>

          {filterOpen && (
            <div className="absolute mt-2 w-full sm:w-44 bg-white border rounded-lg shadow z-50">
              {["Account name", "Balance"].map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setFilter(opt);
                    setFilterOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACCOUNTS */}
      {tab === "accounts" ? (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="border rounded-xl p-4 bg-white space-y-4"
            >
              {/* TOP */}
              <div>
                <p className="text-sm text-gray-600">
                  {asset.name}
                </p>

                <p className="text-xl sm:text-2xl font-semibold">
                  {asset.balance} {asset.symbol}
                </p>

                <p className="text-sm text-gray-500">
                  {asset.usd}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2">
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 rounded-lg text-sm font-medium">
                  Deposit
                </button>

                <button className="w-full bg-gray-100 py-2.5 rounded-lg text-sm">
                  Withdraw
                </button>

                <button className="w-full bg-gray-100 py-2.5 rounded-lg text-sm">
                  Transfer
                </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY */
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📂</div>

          <p className="font-medium text-lg">
            No external wallet added
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Add and verify your external crypto wallets
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-4 py-2 bg-gray-100 rounded-lg"
          >
            + Add new external wallet
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999 px-3">

          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-5 sm:p-6 space-y-5"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                Add external wallet
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-sm mb-1">
                Enter crypto address
              </p>

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste wallet address"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />

              <p className="text-xs text-gray-500 mt-1">
                You can find it in your crypto platform
              </p>
            </div>

            {/* TYPE */}
            <div>
              <p className="text-sm mb-2">
                Select wallet type
              </p>

              <div className="border rounded-lg overflow-hidden">

                <div
                  onClick={() => setWalletType("exchange")}
                  className={`p-4 cursor-pointer ${
                    walletType === "exchange"
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  Exchange wallet
                </div>

                <div
                  onClick={() => setWalletType("self")}
                  className={`p-4 border-t cursor-pointer ${
                    walletType === "self"
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  Self-hosted wallet
                </div>

              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={!address}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 rounded-lg font-medium disabled:opacity-50"
            >
              Continue
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoWallet;