import React, { useState } from "react";
import { X } from "lucide-react";

const Security = () => {
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-8 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold border-b pb-4">Security</h1>

      {/* LOGIN DETAILS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Login details</h2>

        <div className="border rounded-xl overflow-hidden bg-white">

          <div className="flex justify-between p-4 border-b">
            <span>Login</span>
            <span className="text-gray-600">p****@gmail.com</span>
          </div>

          <div className="flex justify-between items-center p-4">
            <span>Password</span>

            <div className="flex items-center gap-4">
              <span>••••••••</span>
              <button
                onClick={() => setModal("password")}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm"
              >
                Change
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2FA */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          2-Step verification
        </h2>

        <div className="border rounded-xl p-4 flex justify-between items-center bg-white">
          <div>
            <p className="text-sm text-gray-500">
              Verification method
            </p>
            <p>+91****2633</p>
          </div>

          <button
            onClick={() => setModal("2fa")}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm"
          >
            Change
          </button>
        </div>
      </div>

      {/* DEVICE */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Device & account security
        </h2>

        <div className="border rounded-xl p-4 flex justify-between items-center bg-white">
          <p className="text-sm text-gray-600">
            Log out from all other devices except this one
          </p>

          <button
            onClick={() => setModal("logout")}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
          >
            Log out from other devices
          </button>
        </div>
      </div>

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">

          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {modal === "password" && "Change Password"}
                {modal === "2fa" && "Change Verification Method"}
                {modal === "logout" && "Confirm Logout"}
              </h3>

              <X
                className="cursor-pointer"
                onClick={() => setModal(null)}
              />
            </div>

            {/* PASSWORD MODAL */}
            {modal === "password" && (
              <>
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full border rounded-lg px-4 py-2"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full border rounded-lg px-4 py-2"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border rounded-lg px-4 py-2"
                />

                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium">
                  Update Password
                </button>
              </>
            )}

            {/* 2FA MODAL */}
            {modal === "2fa" && (
              <>
                <p className="text-sm text-gray-500">
                  Choose verification method
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    SMS (+91****2633)
                  </div>
                  <div className="p-3 hover:bg-gray-50 cursor-pointer">
                    Email verification
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-medium">
                  Continue
                </button>
              </>
            )}

            {/* LOGOUT MODAL */}
            {modal === "logout" && (
              <>
                <p className="text-sm text-gray-600">
                  Are you sure you want to log out from all other devices?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="w-full border py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button className="w-full bg-red-500 text-white py-2 rounded-lg">
                    Confirm
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Security;