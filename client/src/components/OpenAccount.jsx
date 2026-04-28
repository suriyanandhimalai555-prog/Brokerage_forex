import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const accounts = [
  {
    category: "Standard accounts",
    data: [
      {
        id: "standard",
        title: "Standard",
        desc: "Low minimum deposit with no commission. Made for all traders.",
        minDeposit: "10 USD",
        spread: "0.20 pips",
        leverage: "1:Unlimited",
        commission: "No commission",
      },
      {
        id: "cent",
        title: "Standard Cent",
        desc: "Smaller lots, lower risk. Great for practicing.",
        minDeposit: "10 USD",
        spread: "0.30 pips",
        leverage: "1:Unlimited",
        commission: "No commission",
      },
    ],
  },
  {
    category: "Professional accounts",
    data: [
      {
        id: "pro",
        title: "Pro",
        desc: "Instant or market execution with tighter spreads.",
        minDeposit: "500 USD",
        spread: "0.10 pips",
        leverage: "1:Unlimited",
        commission: "No commission",
      },
      {
        id: "raw",
        title: "Raw spread",
        desc: "Direct market pricing with fixed commission.",
        minDeposit: "500 USD",
        spread: "0.00 pips",
        leverage: "1:Unlimited",
        commission: "Up to 3.50 USD per lot/side",
      },
      {
        id: "zero",
        title: "Zero",
        desc: "Spreads from 0 pips on top instruments.",
        minDeposit: "500 USD",
        spread: "0.00 pips",
        leverage: "1:Unlimited",
        commission: "From 0.05 USD per lot/side",
      },
    ],
  },
];

const OpenAccount = () => {
  const [selected, setSelected] = useState("standard");
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl min-h-screen shadow-sm p-4 sm:p-8">
      {/* HEADER */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">Open account</h1>
        </div>

        <button className="text-blue-600 text-sm hover:underline">
          Contract specifications ↗
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* TABLE HEAD */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-sm text-gray-500 px-6">
          <span></span>
          <span>Min deposit</span>
          <span>Min spread</span>
          <span>Max leverage</span>
          <span>Commission</span>
        </div>

        {/* SECTIONS */}
        {accounts.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-semibold mb-3">
              {section.category}
            </h2>

            <div className="space-y-3">
              {section.data.map((item) => {
                const active = selected === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                    className={`grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center 
                    bg-white border rounded-xl px-6 py-4 cursor-pointer transition
                    ${
                      active
                        ? "border-blue-500 shadow-sm"
                        : "hover:border-gray-300"
                    }`}
                  >
                    {/* LEFT */}
                    <div className="flex gap-4 items-start">
                      {/* Radio */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1
                        ${
                          active
                            ? "border-blue-600"
                            : "border-gray-400"
                        }`}
                      >
                        {active && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-sm">{item.minDeposit}</div>
                    <div className="text-sm">{item.spread}</div>
                    <div className="text-sm">{item.leverage}</div>
                    <div className="text-sm">{item.commission}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="border-t px-6 py-4 bottom-0">
        <div className="max-w-6xl mx-auto">
          <button
            disabled={!selected}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenAccount;