import React from "react";

import {
  Search,
  X,
} from "lucide-react";

import {
  getSignalColor,
  getSignalIcon,
} from "../../utils/terminalHelpers";

const InstrumentSidebar = ({
  search,
  setSearch,
  watchlist,
  onSelectInstrument,
  activeSymbol,
  onClose,
}) => {
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r lg:w-[300px]">
      {/* HEADER */}

      <div className="shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="text-sm font-semibold tracking-widest text-slate-300">
            INSTRUMENTS
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-800"
              title="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* SEARCH */}

        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-600/70 bg-[#17232b] px-3 py-3">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* TABLE HEADER */}

        <div className="grid grid-cols-[1fr_72px_70px] border-y border-slate-700/70 px-6 py-3 text-[14px] text-slate-300">
          <div>Symbol</div>

          <div className="text-center">
            Signal
          </div>

          <div className="text-right">
            Bid
          </div>
        </div>
      </div>

      {/* SCROLLABLE MARKET LIST */}

      <div
        className="
          min-h-0 flex-1 overflow-y-auto overflow-x-hidden
          scrollbar-hide
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="space-y-1 p-2">
          {watchlist.map((item) => {
            const active =
              item.tvSymbol === activeSymbol;

            return (
              <button
                key={item.tvSymbol}
                onClick={() =>
                  onSelectInstrument(item)
                }
                className={`
                  grid w-full grid-cols-[1fr_72px_70px]
                  items-center rounded-md px-3 py-3
                  text-left text-[15px] transition
                  ${
                    active
                      ? "bg-[#1d2a31]"
                      : "hover:bg-[#18242b]"
                  }
                `}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-slate-500">
                    ⋮⋮
                  </span>

                  <span className="truncate">
                    {item.symbol}
                  </span>
                </div>

                <div className="flex justify-center">
                  <span
                    className={`
                      grid h-7 w-7 place-items-center rounded
                      text-sm text-white
                      ${getSignalColor(item.signal)}
                    `}
                  >
                    {getSignalIcon(item.signal)}
                  </span>
                </div>

                <div
                  className={`
                    text-right font-medium
                    ${
                      active
                        ? "text-emerald-400"
                        : "text-slate-100"
                    }
                  `}
                >
                  {item.bid}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </aside>
  );
};

export default InstrumentSidebar;