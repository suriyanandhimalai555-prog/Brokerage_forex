import React from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0f2fe] relative overflow-hidden">

            {/* Soft Background */}
            <div className="absolute w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full top-[-150px] left-[-150px]" />
            <div className="absolute w-[400px] h-[400px] bg-indigo-200/40 blur-[120px] rounded-full bottom-[-120px] right-[-120px]" />

            {/* Card */}
            <div className="relative z-10 w-[400px] p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                        Forex Portal
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Access your trading account
                    </p>
                </div>

                {/* Inputs */}
                <div className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <div className="flex items-center mt-1 border border-gray-200 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-gray-600">Password</label>
                        <div className="flex items-center mt-1 border border-gray-200 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-blue-400 transition">
                            <Lock className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type={show ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                            <button
                                onClick={() => setShow(!show)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Forgot */}
                <div className="text-right mt-3">
                    <span className="text-sm text-blue-500 cursor-pointer hover:underline">
                        Forgot password?
                    </span>
                </div>

                {/* Button */}
                <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.01] transition">
                    Login
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6 text-gray-400 text-sm">
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                    OR
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>

                {/* Google */}
                <button className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700 font-medium flex items-center justify-center gap-2">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

                {/* Signup */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-500 hover:underline"
                    >
                        Create account
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;