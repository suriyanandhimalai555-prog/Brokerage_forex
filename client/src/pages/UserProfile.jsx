import React from "react";

const steps = [
  {
    id: 1,
    title: "Personal details",
    subtitle: "pr******@gmail.com, +91 *** 2633",
    status: "Verified",
  },
  {
    id: 2,
    title: "Identity verification",
    subtitle: "PRABU MAYAKANNAN MAYAKANNAN THIMMI NAIDU",
    status: "Verified",
  },
  {
    id: 3,
    title: "Residential address verification",
    subtitle: "Kattukollai, M.N.Gunda",
    status: "Verified",
  },
];

const UserProfile = () => {
  return (
    <div className="space-y-8 max-w-6xl bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-semibold border-b pb-4">Profile</h1>

      {/* ACCOUNT SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>

        <div className="grid md:grid-cols-2 gap-4">

          {/* STATUS CARD */}
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Status</p>
            <h3 className="text-lg font-semibold text-green-600">
              Fully verified
            </h3>
            <p className="text-sm text-gray-500">
              3/3 steps complete
            </p>
          </div>

          {/* LIMIT CARD */}
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <p className="text-sm text-gray-500">Deposit limit</p>
            <h3 className="text-lg font-semibold text-green-600">
              Unlimited
            </h3>
            <p className="text-sm text-gray-500">
              Some payment methods may have limits
            </p>
          </div>

        </div>
      </div>

      {/* VERIFICATION STEPS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Verification steps</h2>

        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center justify-between p-5 ${
                index !== steps.length - 1
                  ? "border-b"
                  : ""
              }`}
            >

              {/* LEFT */}
              <div className="flex items-start gap-4">

                {/* NUMBER CIRCLE */}
                <div className="w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center font-medium">
                  {step.id}
                </div>

                {/* TEXT */}
                <div>
                  <p className="font-medium">
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.subtitle}
                  </p>
                </div>

              </div>

              {/* STATUS */}
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {step.status}
              </span>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default UserProfile;