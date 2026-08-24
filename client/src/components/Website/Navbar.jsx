import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import Logo from "../../assets/logo.png";

const Navbar = ({ navItems }) => {
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

  return (
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
  );
};

export default Navbar;