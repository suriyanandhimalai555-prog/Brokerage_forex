import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaChartLine,
  FaShieldAlt,
  FaGlobe,
  FaArrowRight,
  FaRegEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { BsBarChartFill } from "react-icons/bs";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import Logo from "../assets/logo.png";

const Website = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setMenuOpen(false);
  };

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Markets", href: "#markets" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-left text-2xl font-extrabold tracking-wide text-white flex items-center gap-1"
            >
                <img src={Logo} width={40} alt="logo" />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mt-1">
                AVG Forex
              </span>
            </button>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-blue-300"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
              >
                Open Account
              </button>
            </div>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-blue-400 hover:bg-blue-500/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${
            menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-blue-300"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={handleLogin}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-blue-400 hover:bg-blue-500/10"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  Open Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
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
                  onClick={handleLogin}
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

      {/* Features */}
      <section id="about" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              Why Choose Us
            </span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Built for Performance and Trust
            </h2>
            <p className="mt-4 text-slate-300">
              A clean, modern broker layout with a strong blue-indigo identity
              and a smooth experience on every screen size.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/8">
              <FaShieldAlt className="mb-4 text-4xl text-blue-300" />
              <h3 className="text-xl font-bold">Secure Trading</h3>
              <p className="mt-3 text-slate-300">
                Advanced security and fund protection for every client.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/8">
              <FaChartLine className="mb-4 text-4xl text-blue-300" />
              <h3 className="text-xl font-bold">Tight Spreads</h3>
              <p className="mt-3 text-slate-300">
                Competitive spreads designed for active traders.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/8">
              <BsBarChartFill className="mb-4 text-4xl text-blue-300" />
              <h3 className="text-xl font-bold">Fast Execution</h3>
              <p className="mt-3 text-slate-300">
                Execute trades instantly with low latency and stability.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/8">
              <FaGlobe className="mb-4 text-4xl text-blue-300" />
              <h3 className="text-xl font-bold">Global Markets</h3>
              <p className="mt-3 text-slate-300">
                Forex, commodities, indices, and crypto in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Markets */}
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
            {[
              "EUR/USD",
              "GBP/USD",
              "XAU/USD",
              "BTC/USD",
              "USD/JPY",
              "AUD/USD",
              "NAS100",
              "US30",
            ].map((item) => (
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
            <div>
              <h3 className="text-4xl font-black text-blue-300 sm:text-5xl">
                1M+
              </h3>
              <p className="mt-2 text-slate-300">Active Traders</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-blue-300 sm:text-5xl">
                $15B+
              </h3>
              <p className="mt-2 text-slate-300">Monthly Volume</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-blue-300 sm:text-5xl">
                150+
              </h3>
              <p className="mt-2 text-slate-300">Countries</p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-blue-300 sm:text-5xl">
                24/7
              </h3>
              <p className="mt-2 text-slate-300">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-extrabold flex items-center gap-1">
                <img src={Logo} width={40} alt="logo" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mt-1">
                  AVG Forex
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-slate-300">
                Professional Forex Trading Platform for global traders. Clean
                design, fast access, and a trusted broker-style experience.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>
                  <a href="#about" className="transition hover:text-blue-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#markets" className="transition hover:text-blue-300">
                    Markets
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleSignup}
                    className="transition hover:text-blue-300"
                  >
                    Open Account
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Markets</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>Forex</li>
                <li>Metals</li>
                <li>Crypto</li>
                <li>Indices</li>
              </ul>
            </div>

            
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
            © 2026 ForexPro. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Website;