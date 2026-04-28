import React from "react";
import {
  Info,
  AlertTriangle,
  Rocket,
  ShieldCheck,
  Clock,
  Smartphone,
} from "lucide-react";

const ProgressBar = ({ value, max }) => {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

const Vps = () => {
  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6">

      {/* HEADER */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Virtual Private Server</h1>
        <p className="text-sm text-gray-500">
          Run automated trading strategies with fast and reliable execution.
          <span className="text-blue-600 cursor-pointer ml-1">
            Read more
          </span>
        </p>
      </div>

      {/* INFO BOX */}
      <div className="flex items-start gap-3 bg-gray-100 border rounded-lg p-4 text-sm">
        <Info size={18} className="mt-0.5 text-gray-600" />
        <p>
          Balance and trading volume from EXT accounts are not included
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="border rounded-xl p-6 space-y-6">

        {/* WARNING */}
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 mt-1" />
          <div>
            <p className="font-medium">
              You do not currently qualify for a free VPS
            </p>
            <p className="text-sm text-gray-500 mt-1">
              To qualify, you need to meet one of the following:
            </p>
          </div>
        </div>

        {/* CONDITION 1 */}
        <div className="space-y-3">
          <p className="text-sm">
            <span className="font-medium">1.</span> Your balance must be at least{" "}
            <b>2,000 USD</b>
          </p>

          <div className="text-sm text-gray-600">
            Balance required: <b>1,994 USD</b>
          </div>

          <ProgressBar value={6} max={2000} />

          <div className="flex justify-between text-xs text-gray-500">
            <span>6 USD</span>
            <span>2,000 USD</span>
          </div>
        </div>

        {/* OR */}
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-gray-200 text-xs rounded-full">
            OR
          </span>
        </div>

        {/* CONDITION 2 */}
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">2.</span> Balance between{" "}
            <b>500 – 1,999 USD</b> AND trading volume of{" "}
            <b>1,500,000 USD</b>
          </p>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* BALANCE */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Balance required: <b>494 USD</b>
              </p>

              <ProgressBar value={6} max={2000} />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6 USD</span>
                <span>2,000 USD</span>
              </div>
            </div>

            {/* VOLUME */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Trading volume required: <b>1,499,713 USD</b>
              </p>

              <ProgressBar value={287} max={1500000} />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>287 USD</span>
                <span>1,500,000 USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* LINK */}
        <p className="text-blue-600 text-sm cursor-pointer">
          More about VPS requirements
        </p>
      </div>

      {/* FEATURES */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <Rocket className="text-gray-700" />
          <h3 className="font-medium">Speed</h3>
          <p className="text-sm text-gray-500">
            Servers located close to trading servers for fast execution.
          </p>
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <ShieldCheck className="text-gray-700" />
          <h3 className="font-medium">Stability</h3>
          <p className="text-sm text-gray-500">
            Ensure seamless execution regardless of connection quality.
          </p>
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <Clock className="text-gray-700" />
          <h3 className="font-medium">24-hour trading</h3>
          <p className="text-sm text-gray-500">
            Trade even when your computer is turned off.
          </p>
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <Smartphone className="text-gray-700" />
          <h3 className="font-medium">Mobility & portability</h3>
          <p className="text-sm text-gray-500">
            Access markets from anywhere in the world.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Vps;