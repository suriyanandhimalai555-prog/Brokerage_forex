import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    children: [
      {
        name: "Order Details",
        icon: Folder,
        children: [
          { name: "All", icon: Circle, path: "/admin/orders/all" },
          { name: "Open", icon: Circle, path: "/admin/orders/open" },
          { name: "Closed", icon: Circle, path: "/admin/orders/closed" },
        ],
      },
      // { name: "Funded AC", icon: File, path: "/admin/orders/funded" },
      {
        name: "Report",
        icon: Folder,
        children: [
          { name: "Orders", icon: Circle, path: "/admin/orders/report" },
        ],
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
          { name: "Funded", icon: Circle, path: "/admin/users/funded" },
          // { name: "Challenge", icon: Circle, path: "/admin/users/challenge" },
        ],
      },
      { name: "User Documents", icon: File, path: "/admin/users/docs" },
    ],
  },
  { name: "Withdraw", icon: Wallet, path: "/admin/withdraw" },
  {
    name: "Reports & Logs",
    icon: FileText,
    children: [
      // { name: "User Order Report", icon: Circle, path: "/admin/reports/user-order" },
      // { name: "Order Edit Log", icon: Circle, path: "/admin/reports/edit-log" },
      { name: "User Transaction Log", icon: Circle, path: "/admin/reports/transactions" },
    ],
  },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const { logout } = useAuth();

  // ✅ Only for opening menus (NOT styling)
  const hasActiveChild = (item) => {
    if (!item.children) return false;

    return item.children.some((child) => {
      if (child.children) {
        return child.children.some((sub) => location.pathname === sub.path);
      }
      return location.pathname === child.path;
    });
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMenu = (items, level = 0, parentKey = "root") => {
    return items.map((item, index) => {
      const key = `${parentKey}-${index}`;
      const Icon = item.icon || Circle;

      const isOpen = openMenus[key] || hasActiveChild(item);

      // ✅ Parent menu (NO active color)
      if (item.children) {
        return (
          <div key={key}>
            <button
              onClick={() => toggleMenu(key)}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg transition ${level > 0 ? "ml-4" : ""
                } text-gray-700 hover:bg-gray-100`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-gray-500" />
                {item.name}
              </div>

              <ChevronDown
                size={14}
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="mt-1 space-y-1">
                {renderMenu(item.children, level + 1, key)}
              </div>
            )}
          </div>
        );
      }

      // ✅ Only this gets active
      return (
        <NavLink
          key={key}
          to={item.path}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition ${level > 0 ? "ml-6" : ""
            } ${isActive
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
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-[45] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow transform transition-transform duration-300 z-[60] overflow-x-hidden
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">

            <div className="text-lg font-semibold flex items-center gap-2">
              <img width={50} src={Logo} alt="" />
              <span className="mt-2">AVG Forex</span>
            </div>

            <button
              className="md:hidden"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
            {renderMenu(menu)}
          </div>

          {/* Logout */}
          <div className="p-3">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;