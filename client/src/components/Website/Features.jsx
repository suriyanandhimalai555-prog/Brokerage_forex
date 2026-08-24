import React from "react";
import { FaShieldAlt, FaChartLine, FaGlobe } from "react-icons/fa";
import { BsBarChartFill } from "react-icons/bs";

const featureList = [
  {
    icon: <FaShieldAlt className="mb-4 text-4xl text-blue-300" />,
    title: "Secure Trading",
    description: "Advanced security and fund protection for every client.",
  },
  {
    icon: <FaChartLine className="mb-4 text-4xl text-blue-300" />,
    title: "Tight Spreads",
    description: "Competitive spreads designed for active traders.",
  },
  {
    icon: <BsBarChartFill className="mb-4 text-4xl text-blue-300" />,
    title: "Fast Execution",
    description: "Execute trades instantly with low latency and stability.",
  },
  {
    icon: <FaGlobe className="mb-4 text-4xl text-blue-300" />,
    title: "Global Markets",
    description: "Forex, commodities, indices, and crypto in one place.",
  },
];

const Features = () => {
  return (
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
          {featureList.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/8"
            >
              {item.icon}
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;