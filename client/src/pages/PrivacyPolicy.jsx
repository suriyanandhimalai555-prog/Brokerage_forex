import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaLock, FaUserSecret, FaGlobe } from "react-icons/fa";
import Navbar from "../components/Website/Navbar";
import Footer from "../components/Website/Footer";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Markets", href: "/#markets" },
    { label: "Contact", href: "/#contact" },
  ];

  const sections = [
    {
      id: "information-collection",
      title: "1. Information We Collect",
      content:
        "To provide trading services and comply with financial regulations (including Anti-Money Laundering and Know Your Customer rules), we collect personal details (name, email, phone number, physical address), verification documentation (passport, ID cards, proof of residency), and trading/financial activity data.",
    },
    {
      id: "how-we-use",
      title: "2. How We Use Your Data",
      content:
        "Your information is used strictly to process transactions, authenticate your trading account, execute order requests, provide customer support, detect fraudulent activity, and send critical market updates or system notices.",
    },
    {
      id: "cookies-tracking",
      title: "3. Cookies & Analytical Data",
      content:
        "We utilize session cookies, persistent cookies, and analytical tools to preserve your authentication state, measure platform latency, and deliver a personalized interface. You can disable cookies via your browser settings, but certain platform capabilities may become unavailable.",
    },
    {
      id: "data-sharing",
      title: "4. Third-Party Sharing & Regulatory Disclosure",
      content:
        "We do not sell or rent your personal information to third parties. We only share details with trusted service partners (such as identity verification services and payment processors) or when legally required by financial regulatory bodies, court orders, or law enforcement.",
    },
    {
      id: "security",
      title: "5. Data Security & Storage",
      content:
        "We employ institutional-grade 256-bit SSL encryption, strict access controls, multi-factor authentication protocols, and secure cloud infrastructure to protect your personal and financial data from unauthorized access, breach, or alteration.",
    },
    {
      id: "user-rights",
      title: "6. Your Privacy Rights",
      content:
        "Depending on your jurisdiction, you have the right to request access to your stored personal data, request correction of inaccurate details, object to certain automated profiling, or request account data erasure (subject to mandatory legal record-keeping requirements).",
    },
    {
      id: "contact-us",
      title: "7. Contact Privacy Team",
      content:
        "If you have questions regarding this Privacy Policy or wish to exercise your data protection rights, please contact our compliance department at privacy@avgforex.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Global Shared Navbar */}
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
              <FaShieldAlt /> Regulatory Compliance
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Last updated: August 2026 • Please read carefully to understand how we protect your information.
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaLock className="mb-3 text-2xl text-blue-400" />
            <h3 className="font-bold">256-Bit SSL</h3>
            <p className="mt-1 text-xs text-slate-400">Bank-level encryption standards for data transmissions.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaUserSecret className="mb-3 text-2xl text-indigo-400" />
            <h3 className="font-bold">Strict KYC / AML</h3>
            <p className="mt-1 text-xs text-slate-400">Compliant identity verification processes.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <FaGlobe className="mb-3 text-2xl text-blue-400" />
            <h3 className="font-bold">No Data Sale</h3>
            <p className="mt-1 text-xs text-slate-400">Your information is never sold to third parties.</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          {sections.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 transition hover:border-white/20"
            >
              <h2 className="text-xl font-bold text-white sm:text-2xl">{section.title}</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">{section.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center text-xs text-slate-400">
          Trading Foreign Exchange (Forex) and Contracts for Difference (CFDs) carries high risk. AVG Forex strictly protects account credentials, execution records, and financial identity data as required by law.
        </div>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;