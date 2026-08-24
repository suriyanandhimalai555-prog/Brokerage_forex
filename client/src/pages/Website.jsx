import React from "react";
import Navbar from "../components/Website/Navbar";
import Hero from "../components/Website/Hero";
import Features from "../components/Website/Features";
import Markets from "../components/Website/Markets";
import Footer from "../components/Website/Footer";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Markets", href: "#markets" },
  { label: "Contact", href: "#contact" },
];

const Website = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar navItems={navItems} />
      <Hero />
      <Features />
      <Markets />
      <Footer />
    </div>
  );
};

export default Website;