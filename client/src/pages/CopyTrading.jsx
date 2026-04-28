import React, { useState } from "react";
import { Info, X } from "lucide-react";

const CopyTrading = () => {
  const [tab, setTab] = useState("assets");
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold border-b pb-4">Copy Trading</h1>

      {/* TABS */}
      <div className="flex gap-6 text-sm">
        <button
          onClick={() => setTab("assets")}
          className={`pb-2 ${
            tab === "assets"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Assets
        </button>

        <button
          onClick={() => setTab("strategies")}
          className={`pb-2 ${
            tab === "strategies"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          My strategies
        </button>
      </div>

      {/* ALERT */}
      <div className="flex justify-between items-center bg-blue-50 border rounded-lg p-4">
        <div className="flex gap-3 text-sm">
          <Info className="text-blue-600 mt-0.5" size={18} />
          <div>
            <p className="font-medium">Important: Copy Trading update</p>
            <p className="text-gray-600">
              We're phasing out the service in your region.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          See all details
        </button>
      </div>

      {/* CONTENT */}
      {tab === "assets" ? (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* EMPTY STATE */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center border rounded-xl p-10 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-medium">There are no active investments</p>
            <p className="text-sm text-gray-500 mb-4">
              When you start investing, it will appear here
            </p>

            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg font-medium">
              Discover strategies
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-4">

            <div className="border rounded-xl p-4">
              <p className="text-sm text-gray-500">Assets</p>
              <h2 className="text-xl font-semibold">0.00 USD</h2>
              <p className="text-xs text-gray-500">
                Invested 0.00 USD
              </p>
            </div>

            <div className="border rounded-xl p-4 space-y-3">
              <p className="text-sm">Investment wallet 0.00 USD</p>

              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                  Deposit
                </button>

                <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                  Withdraw
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <MyStrategies />
      )}

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl space-y-4 shadow-xl">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Closure of Copy Trading
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            <p className="text-sm text-gray-600">
              Copy Trading will be gradually phased out in your region.
            </p>

            <div className="text-sm space-y-2">
              <p className="font-medium">Key dates</p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Mar 16, 2026 - New investments disabled</li>
                <li>Jun 25, 2026 - Investments closed</li>
                <li>Jun 26, 2026 - Final payouts</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyTrading;

const MyStrategies = () => {
  const [open, setOpen] = useState(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  const data = [
    {
      title: "Fees",
      content:
        "Performance fee is calculated based on profit threshold...",
    },
    {
      title: "Trading and allocation",
      content:
        "Orders are based on equity and strategy allocation...",
    },
    {
      title: "Attracting investors",
      content:
        "Share your strategy link to attract investors...",
    },
    {
      title: "Privacy",
      content:
        "You can hide your strategy from the catalog...",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">FAQ</h2>

      {data.map((item, i) => (
        <div key={i} className="border rounded-lg">
          <button
            onClick={() => toggle(i)}
            className="w-full flex justify-between p-4 text-sm font-medium"
          >
            {item.title}
            <span>{open === i ? "-" : "+"}</span>
          </button>

          {open === i && (
            <div className="p-4 pt-0 text-sm text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};