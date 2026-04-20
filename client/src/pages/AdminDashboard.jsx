import React from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  UserCheck,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Total Collected Amount",
    value: "$1613",
    icon: DollarSign,
  },
  {
    title: "Total Payout",
    value: "$0",
    icon: TrendingUp,
  },
  {
    title: "Pending Payout",
    value: "$0",
    icon: Clock,
  },
  {
    title: "Active Users",
    value: "2",
    icon: Users,
  },
  {
    title: "Verified Users",
    value: "1",
    icon: UserCheck,
  },
  {
    title: "Total Users",
    value: "18",
    icon: Users,
  },
  {
    title: "Phase 1 Profit",
    value: "$85",
    icon: TrendingUp,
  },
  {
    title: "Phase 2 Profit",
    value: "$0",
    icon: TrendingUp,
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">

                {/* Text */}
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-1">
                    {item.value}
                  </h2>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AdminDashboard;