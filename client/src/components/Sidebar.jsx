import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wallet,
  FileText,
  Settings,
  ChevronDown,
  X,
  Circle,
  Folder,
  File,
  LogOut,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    children: [
      {
        name: "Order Details",
        icon: Folder,
        children: [
          { name: "All", icon: Circle, path: "/orders/all" },
          { name: "Open", icon: Circle, path: "/orders/open" },
          { name: "Closed", icon: Circle, path: "/orders/closed" },
        ],
      },
      { name: "Funded AC", icon: File, path: "/orders/funded" },
      {
        name: "Report",
        icon: Folder,
        children: [{ name: "Orders", icon: Circle, path: "/orders/report" }],
      },
    ],
  },
  {
    name: "Manage User",
    icon: Users,
    children: [
      {
        name: "Account Details",
        icon: Folder,
        children: [
          { name: "Funded", icon: Circle, path: "/users/funded" },
          { name: "Challenge", icon: Circle, path: "/users/challenge" },
        ],
      },
      { name: "User Documents", icon: File, path: "/users/docs" },
    ],
  },
  {
    name: "Withdraw",
    icon: Wallet,
    path: "/withdraw",
  },
  {
    name: "Reports & Logs",
    icon: FileText,
    children: [
      { name: "User Order Report", icon: Circle, path: "/reports/user-order" },
      { name: "Order Edit Log", icon: Circle, path: "/reports/edit-log" },
      { name: "User Transaction Log", icon: Circle, path: "/reports/transactions" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = ({ open, setOpen }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // 👉 add your logout logic here
    // localStorage.clear();
    // navigate("/login");
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item, index) => {
      const key = `${item.name}-${index}`;
      const Icon = item.icon || Circle;

      if (item.children) {
        return (
          <div key={key}>
            <button
              onClick={() => toggleMenu(key)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg transition hover:bg-gray-100 ${
                level > 0 ? "ml-4" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-gray-500" />
                {item.name}
              </div>

              <ChevronDown
                size={14}
                className={`transition ${
                  openMenus[key] ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus[key] && (
              <div className="mt-1 space-y-1">
                {renderMenu(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      return (
        <NavLink
          key={key}
          to={item.path}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition ${
              level > 0 ? "ml-6" : ""
            } ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Icon size={14} />
          {item.name}
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <span className="text-lg font-semibold">Forex Admin</span>

            <button className="md:hidden" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
            {renderMenu(menu)}
          </div>

          {/* Logout (Fixed Bottom) */}
          <div className="p-3 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;