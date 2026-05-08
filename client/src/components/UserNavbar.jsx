import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@email.com";

  const realBalance =
    Number(user?.wallets?.real || 0);

  const demoBalance =
    Number(user?.wallets?.demo || 0);

  const initials = userName
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-xl border-b">

      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">

        {/* BALANCE */}
        <div className="hidden md:flex items-center gap-3">

          {/* REAL WALLET */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 px-4 py-2 rounded-2xl min-w-[150px]">

            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <Wallet size={18} className="text-green-600" />
            </div>

            <div className="flex flex-col leading-tight">

              <span className="text-sm font-bold text-gray-800">
                {realBalance.toLocaleString()} USD
              </span>

              <span className="text-[11px] font-semibold uppercase text-green-600">
                Real Wallet
              </span>

            </div>
          </div>

          {/* DEMO WALLET */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl min-w-[150px]">

            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
              <Wallet size={18} className="text-orange-500" />
            </div>

            <div className="flex flex-col leading-tight">

              <span className="text-sm font-bold text-gray-800">
                {demoBalance.toLocaleString()} USD
              </span>

              <span className="text-[11px] font-semibold uppercase text-orange-500">
                Demo Wallet
              </span>

            </div>
          </div>

        </div>

        {/* NOTIFICATION */}
        <div className="relative cursor-pointer">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* USER DROPDOWN */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() =>
              setOpenDropdown((prev) => !prev)
            }
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow">
              {initials}
            </div>

            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-gray-800">
                {userName}
              </span>

              <span className="text-xs text-gray-500">
                {userEmail}
              </span>
            </div>
          </button>

          {openDropdown && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-[9999]">

              {/* TOP USER INFO */}
              <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                    {initials}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {userName}
                    </p>

                    <p className="text-sm text-gray-500 break-all">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* MENU */}
              <div className="p-2">

                <button
                  className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-gray-100 transition"
                  onClick={() => {
                    navigate("/user/profile");
                    setOpenDropdown(false);
                  }}
                >
                  Profile
                </button>

                <button
                  className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-gray-100 transition"
                  onClick={() => {
                    navigate("/user/my-accounts");
                    setOpenDropdown(false);
                  }}
                >
                  Trading Accounts
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-500 rounded-xl hover:bg-red-50 transition"
                >
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;