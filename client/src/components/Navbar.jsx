import React from "react";
import { Menu, Bell, Search } from "lucide-react";

const Navbar = ({ setOpen }) => {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-xl border-b">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          {/* Dashboard */}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* Search (hide on mobile) */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={16} className="mr-2 text-gray-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* Bell */}
        <div className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;