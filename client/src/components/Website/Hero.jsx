import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-24"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950" />
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              Trusted Forex Broker
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Trade Forex
              <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Access global financial markets with ultra-fast execution,
              competitive spreads, advanced tools, and a premium trading
              experience built for modern traders.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                Login to Trade <FaArrowRight />
              </button>

              <a
                href="#markets"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
              >
                Explore Markets
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="block text-white font-bold">0.0</span>
                Spread from
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="block text-white font-bold">1ms</span>
                Fast execution
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="block text-white font-bold">24/7</span>
                Support
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f"
                alt="Trading"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;