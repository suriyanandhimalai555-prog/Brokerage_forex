// PaymentCheckout.jsx
import React, { useEffect, useState } from "react";
import {
  Copy,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  Wallet,
  QrCode,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const account = state?.account;
  const payment = state?.payment;

  const [timeLeft, setTimeLeft] = useState(60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied successfully");
    } catch {
      toast.error("Copy failed");
    }
  };

  if (!payment || !account) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
            <Wallet className="text-red-500" size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Payment Not Found
          </h1>

          <p className="text-gray-500 mt-3 leading-relaxed">
            Open the account again and generate a fresh payment request.
          </p>

          <button
            onClick={() => navigate("/user/open-account")}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.01] transition"
          >
            Back To Open Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Payment
              </h1>

              <p className="text-gray-500 mt-1">
                Account #{account.account_no}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <Clock3 className="text-orange-500" size={18} />

            <div>
              <p className="text-xs text-gray-500">Expires In</p>
              <p className="font-semibold text-gray-900">
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">

          {/* LEFT */}

          <div className="space-y-6">

            {/* Payment Card */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">

                  <div>
                    <p className="text-sm opacity-90">
                      Payment Amount
                    </p>

                    <h2 className="text-4xl font-bold mt-1">
                      {payment.payAmount || payment.amount || "-"}
                    </h2>

                    <p className="mt-1 opacity-90">
                      {payment.payCurrency || "USDT"}
                    </p>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4">
                    <p className="text-xs opacity-80">
                      Network
                    </p>

                    <h3 className="text-2xl font-bold">
                      {payment.network || "TRC20"}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">

                {/* Wallet */}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="text-blue-600" size={18} />

                    <h3 className="font-semibold text-gray-900">
                      Wallet Address
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm break-all text-gray-700">
                      {payment.address}
                    </div>

                    <button
                      onClick={() => copyText(payment.address)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>

                {/* Instructions */}

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className="text-amber-600 mt-0.5"
                      size={20}
                    />

                    <div>
                      <h4 className="font-semibold text-amber-900">
                        Important Instructions
                      </h4>

                      <ul className="mt-3 space-y-2 text-sm text-amber-800">
                        <li>
                          • Send only{" "}
                          <span className="font-semibold">
                            {payment.payCurrency || "USDT"}
                          </span>
                        </li>

                        <li>
                          • Use only{" "}
                          <span className="font-semibold">
                            {payment.network || "TRC20"}
                          </span>{" "}
                          network
                        </li>

                        <li>
                          • Sending another network may permanently lose funds
                        </li>

                        <li>
                          • Payment confirmation usually takes 1–5 minutes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">

                  <button
                    onClick={() => navigate("/user/my-accounts")}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-medium text-gray-700"
                  >
                    I Have Paid
                  </button>

                  <button
                    onClick={() => navigate("/user/open-account")}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.01] transition"
                  >
                    Create Another Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* QR */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">

              <div className="flex items-center gap-2 mb-5">
                <QrCode className="text-indigo-600" size={20} />

                <h3 className="font-semibold text-gray-900">
                  Scan QR Code
                </h3>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 flex items-center justify-center">

                {payment.qrCode ? (
                  <img
                    src={payment.qrCode}
                    alt="Payment QR"
                    className="w-72 h-72 object-contain"
                  />
                ) : (
                  <div className="w-72 h-72 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center mt-5">
                Scan using your crypto wallet application
              </p>
            </div>

            {/* Status */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure Payment
                  </h3>

                  <p className="text-sm text-gray-500">
                    Your payment is encrypted and protected
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Account Type
                  </span>

                  <span className="font-semibold text-gray-900 capitalize">
                    {account.account_type}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Platform
                  </span>

                  <span className="font-semibold text-gray-900">
                    {account.platform}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Plan
                  </span>

                  <span className="font-semibold text-gray-900">
                    {account.plan_name}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Currency
                  </span>

                  <span className="font-semibold text-gray-900">
                    {account.currency}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;