import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/UserNavbar";

const UserLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <UserSidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
        <UserNavbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;