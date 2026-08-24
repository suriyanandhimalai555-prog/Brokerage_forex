import React from "react";

const marketInstruments = [
  "EUR/USD",
  "GBP/USD",
  "XAU/USD",
  "BTC/USD",
  "USD/JPY",
  "AUD/USD",
  "NAS100",
  "US30",
];

const platformStats = [
  { value: "1M+", label: "Active Traders" },
  { value: "$15B+", label: "Monthly Volume" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Support" },
];

const Markets = () => {
  return (
    <>
      {/* Popular Markets */}
      <section id="markets" className="bg-slate-900/70 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              Popular Markets
            </span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Trade the Instruments Traders Care About
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {marketInstruments.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center transition hover:border-blue-400/50 hover:bg-slate-900"
              >
                <h3 className="text-2xl font-bold">{item}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Market view and trading access
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((stat, idx) => (
              <div key={idx}>
                <h3 className="text-4xl font-black text-blue-300 sm:text-5xl">
                  {stat.value}
                </h3>
                <p className="mt-2 text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Markets;