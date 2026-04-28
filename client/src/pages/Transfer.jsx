import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, Users } from "lucide-react";

const options = [
  {
    id: "internal",
    title: "Between your accounts",
    desc: "Processing time Instant - 1 day",
    fee: "Fee 0%",
    limit: "Limits 1 - 1,000,000 USD",
    icon: <ArrowRightLeft size={20} />,
  },
  {
    id: "user",
    title: "To another user",
    desc: "Processing time Instant - 1 day",
    fee: "Fee 0%",
    limit: "Limits 1 - 1,000,000 USD",
    icon: <Users size={20} />,
  },
];

const Transfer = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-semibold border-b pb-6">Transfer</h1>

      <h2 className="text-lg font-medium">Transfer</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => navigate(`/user/transfer/${opt.id}`)}
            className="border rounded-xl p-5 bg-white cursor-pointer hover:border-gray-400 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-black text-yellow-400 p-2 rounded-full">
                {opt.icon}
              </div>
              <h3 className="font-semibold">{opt.title}</h3>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>{opt.desc}</p>
              <p>{opt.fee}</p>
              <p>{opt.limit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transfer;