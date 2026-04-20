import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Content */}
      <div className="flex-1 flex flex-col md:ml-64">

        <Navbar setOpen={setOpen} />

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;