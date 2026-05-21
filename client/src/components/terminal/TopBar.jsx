import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  ChevronDown,
  Bell,
  Clock3,
  Grid2x2,
  UserCircle2,
  X,
  Plus,
  Search,
  Menu,
} from "lucide-react";

import {
  TOP_TABS,
  MARKET_SECTIONS,
} from "../../data/terminalData";

import Logo from "../../assets/logo.png";

const TopBar = ({
  accountSummary,
  balance,
  onDeposit,
  onSelectTab,
  activeTab,

  accounts = [],
  activeAccount,
  switchAccount,
  onMobileMenuClick,
}) => {
  const [openDropdown, setOpenDropdown] =
    useState(false);

  const [openMarketPopup, setOpenMarketPopup] =
    useState(false);

  const [search, setSearch] = useState("");

  const [tabs, setTabs] = useState(TOP_TABS);

  const dropdownRef = useRef(null);

  const popupRef = useRef(null);

  useEffect(() => {
    const closeAll = (e) => {
      if (
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpenDropdown(false);
      }

      if (!popupRef.current?.contains(e.target)) {
        setOpenMarketPopup(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeAll
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeAll
      );
    };
  }, []);

  const allMarkets = useMemo(() => {
    return MARKET_SECTIONS.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        marketType: section.marketType,
      }))
    );
  }, []);

  const filteredMarkets = allMarkets.filter(
    (item) =>
      item.label
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const addTab = (market) => {
    const exists = tabs.find(
      (t) => t.tvSymbol === market.tvSymbol
    );

    if (exists) {
      onSelectTab(exists);
      setOpenMarketPopup(false);
      return;
    }

    const newTab = {
      label: market.label,
      symbol: market.tvSymbol,
      tvSymbol: market.tvSymbol,
    };

    setTabs((prev) => [...prev, newTab]);

    onSelectTab(newTab);

    setOpenMarketPopup(false);
  };

  const removeTab = (tab, e) => {
    e.stopPropagation();

    if (tabs.length <= 1) return;

    const updatedTabs = tabs.filter(
      (t) => t.symbol !== tab.symbol
    );

    setTabs(updatedTabs);

    if (activeTab?.symbol === tab.symbol) {
      onSelectTab(updatedTabs[0]);
    }
  };

  return (
    <header
  className="
    fixed
    left-0
    top-0
    z-[1000]
    flex
    h-[68px]
    w-full
    items-center
    border-b
    border-slate-700
    bg-[#0b1217]
    px-4
    text-white
    backdrop-blur-md
  "
>
      {/* LEFT */}

      <div className="flex items-center gap-3 lg:gap-10">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-700 bg-[#111c22] text-slate-200 lg:hidden"
          aria-label="Open menu"
          title="Menu"
        >
          <Menu size={18} />
        </button>

        {/* LOGO */}

        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="logo"
            className="h-[42px] w-auto object-contain"
          />

          <div className="leading-tight">
            <div className="text-[18px] font-bold">
              AVG
            </div>

            <div className="text-[11px] text-slate-400">
              Terminal
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="hidden h-[68px] items-center gap-8 lg:flex">
          {tabs.map((tab) => {
            const isActive =
              activeTab?.tvSymbol ===
              (tab.tvSymbol || tab.symbol);

            return (
              <button
                key={tab.symbol}
                onClick={() => onSelectTab(tab)}
                className={`
                  group relative flex h-full items-center gap-3
                  text-[16px] font-medium transition
                  ${isActive
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                  }
                `}
              >
                <span>{tab.label}</span>

                {tabs.length > 1 && (
                  <span
                    onClick={(e) =>
                      removeTab(tab, e)
                    }
                    className="
                      invisible flex h-5 w-5 items-center
                      justify-center rounded-full text-slate-400
                      hover:bg-slate-700 hover:text-white
                      group-hover:visible
                    "
                  >
                    <X size={12} />
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-white" />
                )}
              </button>
            );
          })}

          <div
            className="relative"
            ref={popupRef}
          >
            <button
              onClick={() =>
                setOpenMarketPopup((prev) => !prev)
              }
              className="text-3xl font-light text-slate-300 hover:text-white"
            >
              +
            </button>

            {openMarketPopup && (
              <div className="absolute left-0 top-[60px] z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-700 bg-[#111c22] shadow-2xl">
                <div className="border-b border-slate-700 p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#17232b] px-3 py-3">
                    <Search
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search pair..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {filteredMarkets.map((market) => (
                    <button
                      key={market.tvSymbol}
                      onClick={() =>
                        addTab(market)
                      }
                      className="flex w-full items-center justify-between border-b border-slate-800 px-4 py-4 text-left transition hover:bg-[#17232b]"
                    >
                      <div>
                        <div className="font-medium text-white">
                          {market.label}
                        </div>

                        <div className="text-xs text-slate-400">
                          {market.marketType}
                        </div>
                      </div>

                      <Plus
                        size={16}
                        className="text-slate-400"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="ml-auto flex items-center gap-3">
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() =>
              setOpenDropdown((prev) => !prev)
            }
            className={`
              flex items-center gap-3 rounded-2xl
              border px-4 py-2 transition
              ${openDropdown
                ? "border-slate-500 bg-[#17232b]"
                : "border-slate-700 bg-[#111c22]"
              }
            `}
          >
            <div className="flex flex-col items-end leading-tight">
              <div className="flex items-center gap-2">
                <span
                  className={`
                    rounded-md px-2 py-[2px]
                    text-[11px] font-bold
                    ${accountSummary?.type === "demo"
                      ? "bg-sky-500 text-white"
                      : "bg-lime-300 text-black"
                    }
                  `}
                >
                  {accountSummary?.type === "demo"
                    ? "Demo"
                    : "Real"}
                </span>

                <span className="text-sm text-slate-300">
                  {accountSummary?.platform ||
                    "Standard"}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-[18px] font-semibold">
                  {Number(balance || 0).toFixed(2)}
                </span>

                <span className="text-sm text-slate-400">
                  {accountSummary?.currency || "USD"}
                </span>
              </div>
            </div>

            <ChevronDown
              size={18}
              className={`transition ${
                openDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown && (
            <div
              className="
                absolute right-0 top-[70px] z-[999]
                w-[340px] overflow-hidden rounded-2xl
                border border-slate-700 bg-[#111c22]
                shadow-2xl
              "
            >
              <div className="border-b border-slate-700 px-4 py-4">
                <div className="text-sm font-semibold text-white">
                  Trading Accounts
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Select active account
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto">
                {accounts.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-400">
                    No accounts found
                  </div>
                ) : (
                  accounts.map((account) => {
                    const isActive =
                      activeAccount?.id === account.id;

                    return (
                      <button
                        key={account.id}
                        onClick={() => {
                          switchAccount(account.id);

                          setOpenDropdown(false);
                        }}
                        className={`
                          flex w-full items-center justify-between
                          border-b border-slate-800 px-4 py-4
                          text-left transition
                          hover:bg-[#17232b]
                          ${isActive
                            ? "bg-[#1d2a31]"
                            : ""
                          }
                        `}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`
                                rounded-sm px-2 py-[2px]
                                text-[10px] font-bold
                                ${account.account_type ===
                                  "demo"
                                  ? "bg-sky-500 text-white"
                                  : "bg-lime-300 text-black"
                                }
                              `}
                            >
                              {account.account_type ===
                                "demo"
                                ? "Demo"
                                : "Real"}
                            </span>

                            <span className="font-medium text-white">
                              {account.platform ||
                                "Standard"}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            #
                            {account.account_no ||
                              account.id}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[16px] font-semibold text-white">
                            {Number(
                              account.balance || 0
                            ).toFixed(2)}
                          </div>

                          <div className="text-xs text-slate-400">
                            {account.currency || "USD"}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;