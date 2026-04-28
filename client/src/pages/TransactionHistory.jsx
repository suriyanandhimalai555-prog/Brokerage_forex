import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const data = [
  {
    group: "Yesterday, 27 April 2026",
    items: [
      {
        id: 1,
        title: "Reward",
        time: "27 Apr, 17:32",
        invoice: "2251800577079987",
        amount: "+0.16 USD",
      },
      {
        id: 2,
        title: "Reward",
        time: "27 Apr, 16:47",
        invoice: "2251800577031633",
        amount: "+0.09 USD",
      },
      {
        id: 3,
        title: "Reward",
        time: "27 Apr, 13:44",
        invoice: "2251800576816786",
        amount: "+0.19 USD",
      },
    ],
  },
  {
    group: "April 2026",
    items: [
      {
        id: 4,
        title: "Reward",
        time: "24 Apr, 19:08",
        invoice: "2251800575062590",
        amount: "+0.03 USD",
      },
    ],
  },
];

/* ---------------- DROPDOWN CHIP ---------------- */

const Filter = ({ label, options }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[0]);

  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm cursor-pointer"
      >
        {value}
        <ChevronDown size={14} />
      </div>

      {open && (
        <div className="absolute mt-2 bg-white border rounded-lg shadow w-48 z-50">
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- COMPONENT ---------------- */

const TransactionHistory = () => {
  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b pb-6">
        <h1 className="text-2xl font-semibold">
          Transaction history
        </h1>

        <div className="text-sm text-blue-600 flex gap-4">
          <span className="cursor-pointer">Get support</span>
          <span className="cursor-pointer">
            Support requests (0)
          </span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        <Filter
          options={[
            "Last 7 days",
            "Last 30 days",
            "All time",
          ]}
        />
        <Filter
          options={[
            "All transaction types",
            "Deposits",
            "Withdrawals",
          ]}
        />
        <Filter
          options={[
            "All statuses",
            "Done",
            "Pending",
          ]}
        />
        <Filter
          options={[
            "All accounts",
            "MT5 263244830",
          ]}
        />
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {data.map((group, i) => (
          <div key={i}>
            {/* GROUP TITLE */}
            <div className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-600 mb-3">
              {group.group}
            </div>

            {/* ITEMS */}
            <div className="space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-4 bg-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  {/* LEFT */}
                  <div className="flex items-start gap-3">
                    <div className="text-xl">💰</div>

                    <div>
                      <p className="font-medium">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.time}
                      </p>
                      <p className="text-xs text-gray-400">
                        Invoice ID {item.invoice}
                      </p>
                    </div>
                  </div>

                  {/* CENTER */}
                  <div className="text-sm text-gray-500">
                    ex → 1046922606162242556
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      ● Done
                    </span>

                    <span className="font-medium">
                      {item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;