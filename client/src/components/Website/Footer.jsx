import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Footer = () => {
    const navigate = useNavigate();

    return (
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
                                    onClick={() => navigate("/signup")}
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

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-sm text-slate-400 sm:flex-row sm:text-left">
                    <div>
                        © 2026 ForexPro. All Rights Reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="/privacy-policy"
                            className="transition hover:text-blue-300"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/terms-and-conditions"
                            className="transition hover:text-blue-300"
                        >
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;