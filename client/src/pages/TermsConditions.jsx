import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileContract, FaArrowLeft, FaExclamationTriangle, FaBalanceScale, FaUserCheck } from "react-icons/fa";
import Navbar from "../components/Website/Navbar";
import Footer from "../components/Website/Footer";

const TermsConditions = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Markets", href: "/#markets" },
    { label: "Contact", href: "/#contact" },
  ];

  const termsSections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content:
        "By accessing, registering for, or using the AVG Forex platform and services, you confirm that you are at least 18 years of age (or legal age in your jurisdiction) and agree to be bound by these Terms and Conditions in full.",
    },
    {
      id: "risk-disclosure",
      title: "2. High Risk Warning & Leverage",
      content:
        "Trading Foreign Exchange (Forex) and Contracts for Difference (CFDs) carries a high level of risk and may not be suitable for all investors. High leverage can work against you as well as for you. Before trading, ensure you fully understand the risks involved and take into account your investment objectives and level of experience.",
    },
    {
      id: "account-eligibility",
      title: "3. Account Eligibility & KYC",
      content:
        "To open a trading account, you must complete our Know Your Customer (KYC) identity verification process. You agree to provide accurate and updated information. Accounts found using fraudulent documentation or operating from restricted countries will be terminated immediately.",
    },
    {
      id: "trading-execution",
      title: "4. Market Execution & Spreads",
      content:
        "Orders are executed based on live market liquidity. While AVG Forex strives to deliver low-latency execution, slippage or market gaps may occur during news announcements or abnormal volatility. Spreads are variable unless stated otherwise and fluctuate based on underlying interbank liquidity.",
    },
    {
      id: "deposits-withdrawals",
      title: "5. Deposits & Withdrawals",
      content:
        "All deposits and withdrawals must be processed through payment methods registered under your verified legal name (third-party payments are strictly prohibited). Processing times depend on the selected gateway. Withdrawal approvals are subject to clear margin availability and mandatory security checks.",
    },
    {
      id: "prohibited-activities",
      title: "6. Prohibited Trading Practices",
      content:
        "Arbitrage trading targeting latency flaws, platform manipulation, unauthorized automated exploitation, or engaging in market manipulation is strictly prohibited. AVG Forex reserves the right to cancel trades, reverse profits, or freeze accounts engaging in abusive practices.",
    },
    {
      id: "termination",
      title: "7. Account Termination",
      content:
        "You may request account closure at any time provided all pending positions are closed and outstanding balances cleared. AVG Forex reserves the right to suspend or terminate accounts for breach of terms, regulatory orders, or non-compliance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Shared Navbar */}
      <Navbar navItems={navItems} />

      {/* Hero Sub-header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-blue-950/40 to-slate-950 pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* <button
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition hover:border-blue-400/40 hover:bg-blue-500/10"
          >
            <FaArrowLeft className="text-xs" /> Back to Home
          </button> */}

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <FaFileContract /> Legal Agreement
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Last updated: August 2026 • Please read these terms carefully before accessing our trading services.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Key Highlights */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaExclamationTriangle className="mb-3 text-2xl text-amber-400" />
            <h3 className="font-bold">Leverage Risk</h3>
            <p className="mt-1 text-xs text-slate-400">Forex trading involves significant risk of capital loss.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaUserCheck className="mb-3 text-2xl text-blue-400" />
            <h3 className="font-bold">Verified Accounts</h3>
            <p className="mt-1 text-xs text-slate-400">18+ legal age & strict KYC identity checks mandatory.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaBalanceScale className="mb-3 text-2xl text-indigo-400" />
            <h3 className="font-bold">Fair Trading</h3>
            <p className="mt-1 text-xs text-slate-400">Strict rules against latency arbitrage and market abuse.</p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          {termsSections.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 transition hover:border-white/20"
            >
              <h2 className="text-xl font-bold text-white sm:text-2xl">{section.title}</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">{section.content}</p>
            </article>
          ))}
        </div>

        {/* Regulatory Disclaimer Box */}
        <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center text-xs text-slate-400">
          <strong>Risk Notice:</strong> Leveraged financial instruments can result in losses exceeding your initial deposit. Ensure you fully understand how CFDs work before trading.
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default TermsConditions;