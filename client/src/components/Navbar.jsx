import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Menu,
  Bell,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = ({ setOpen }) => {
  const [openDropdown, setOpenDropdown] =
    useState(false);

  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "admin@email.com",
  });

  const dropdownRef = useRef(null);

  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      if (data?.user) {
        setAdmin({
          name:
            data.user.name || "Admin",

          email:
            data.user.email ||
            "admin@email.com",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

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

        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">

          <Search
            size={16}
            className="mr-2 text-gray-500"
          />

          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />

        </div>

        <div className="relative cursor-pointer">

          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />

        </div>

        <div
          className="relative"
          ref={dropdownRef}
        >

          <button
            onClick={() =>
              setOpenDropdown(
                (prev) => !prev
              )
            }
            className="flex items-center gap-2 cursor-pointer"
          >

            <img
              src="https://i.pravatar.cc/40"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />

            <span className="hidden sm:block text-sm font-medium">
              {/* {admin.name} */}Admin
            </span>

          </button>

          {openDropdown && (

            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-[9999]">

              <div className="px-3 py-2 border-b">

                <p className="text-sm font-medium text-gray-800">
                  {admin.name}
                </p>

                <p className="text-xs text-gray-500 break-all">
                  {admin.email}
                </p>

              </div>

              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-100 mt-2">
                Profile
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;