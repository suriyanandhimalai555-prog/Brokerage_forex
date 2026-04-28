import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";

const conditions = [
  {
    id: "stopout",
    title: "Stop Out Protection",
    short:
      "Helps delay and sometimes completely avoid stop outs.",
    content: (
      <>
        <p>
          Stop Out Protection helps delay, and sometimes completely avoid stop outs during high market volatility.
        </p>
        <p className="mt-3">
          When your equity drops to zero, the feature <b>adds virtual funds</b> to give you more time to act.
        </p>
      </>
    ),
  },
  {
    id: "negative",
    title: "Negative Balance Protection",
    short:
      "You can never lose more than your deposit.",
    content: (
      <>
        <p>
          You can never lose more money than you put into your account.
        </p>
        <p className="mt-3">
          If your balance becomes negative, it will be reset to <b>0 automatically</b>.
        </p>
      </>
    ),
  },
  {
    id: "swap",
    title: "Swap-Free",
    short:
      "Trade without overnight charges.",
    tag: "Qualified",
    content: (
      <>
        <p>
          Trade without overnight charges on selected instruments.
        </p>

        <div className="mt-4">
          <span className="text-sm">Status:</span>
          <span className="ml-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
            Qualified
          </span>
        </div>

        <div className="mt-4 w-full bg-gray-200 h-2 rounded-full">
          <div className="w-[70%] h-2 bg-green-500 rounded-full"></div>
        </div>
      </>
    ),
  },
  {
    id: "zero",
    title: "Zero Stop Levels",
    short:
      "Place pending orders closer to market price.",
    content: (
      <>
        <p>
          Allows placing orders as close to market price as possible.
        </p>

        <div className="mt-4 text-sm space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span>Buy limit</span>
            <span>Below ask -1 point</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Sell limit</span>
            <span>Above bid +1 point</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Buy stop</span>
            <span>Above ask +1 point</span>
          </div>
          <div className="flex justify-between">
            <span>Sell stop</span>
            <span>Below bid -1 point</span>
          </div>
        </div>
      </>
    ),
  },
];

const TradingConditions = () => {
  const [active, setActive] = useState(null);

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">
          Trading Conditions
        </h1>
        <p className="text-sm text-gray-500">
          Better-than-market trading conditions available for your account
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {conditions.map((item) => (
          <div
            key={item.id}
            onClick={() => setActive(item)}
            className="bg-white border rounded-xl p-6 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">
                {item.title}
              </h3>

              <div className="flex items-center gap-2">
                {item.tag && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                <ChevronRight size={18} />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {item.short}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
          
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-lg">
            
            {/* CLOSE */}
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-4">
              {active.title}
            </h2>

            {/* CONTENT */}
            <div className="text-gray-600 text-sm leading-relaxed">
              {active.content}
            </div>

            {/* ACTION */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setActive(null)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium"
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

export default TradingConditions;