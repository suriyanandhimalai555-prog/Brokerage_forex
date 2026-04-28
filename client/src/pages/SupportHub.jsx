import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  X,
} from "lucide-react";

const categories = [
  "Payments",
  "Account and Security",
  "Exness platforms",
  "Account verification",
  "Trading",
  "Exness programs",
  "VPS",
];

const SupportHub = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold">My tickets</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg font-medium"
        >
          Open ticket
        </button>
      </div>

      {/* FILTER + SEARCH */}
      <div className="border rounded-xl p-4 space-y-4">

        <div className="flex flex-col sm:flex-row justify-between gap-4">

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm w-fit">
            Active statuses: All
            <ChevronDown size={14} />
          </button>

          <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-72">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search..."
              className="ml-2 w-full outline-none text-sm"
            />
          </div>

        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-4 text-sm font-medium border-b pb-2">
          <span>Subject</span>
          <span>Ticket ID</span>
          <span>Status</span>
          <span>Date created ↑</span>
        </div>

        {/* EMPTY STATE */}
        <div className="text-center py-10">
          <p className="text-lg font-medium">
            No matching results found
          </p>
          <p className="text-sm text-gray-500">
            Please try a different keyword.
          </p>
        </div>

      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">

          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-5 shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Open support ticket
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => setOpenModal(false)}
              />
            </div>

            {/* CATEGORY DROPDOWN */}
            <div>
              <p className="text-sm mb-1">Category</p>

              <div className="relative">
                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="border rounded-lg px-4 py-2 flex justify-between cursor-pointer"
                >
                  {selectedCategory || "Select category"}
                  <ChevronDown size={16} />
                </div>

                {openDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-md z-10">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setOpenDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SUBJECT */}
            <div>
              <p className="text-sm mb-1">Subject</p>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="w-full border rounded-lg px-4 py-2 outline-none"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <p className="text-sm mb-1">Message</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full border rounded-lg px-4 py-2 h-28 outline-none resize-none"
              />
            </div>

            {/* ACTION */}
            <button
              disabled={!selectedCategory || !subject || !message}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              Submit ticket
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default SupportHub;