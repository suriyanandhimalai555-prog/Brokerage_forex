import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const OpenAccount = () => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("demo"); // demo | real
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("standard");

  const [form, setForm] = useState({
    currency: "USD",
    startingBalance: 500,
    nickname: "Standard",
    leverage: "1:2000",
    platform: "AVG Forex",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/accounts/plans`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const grouped = data?.plans || [];
        setPlans(grouped);

        const firstPlan = grouped?.[0]?.data?.[0];
        if (firstPlan) {
          setSelectedPlanId(firstPlan.id);
          setForm((prev) => ({
            ...prev,
            nickname: firstPlan.title,
            leverage: firstPlan.leverage || "1:2000",
          }));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load account plans");
      }
    };

    fetchPlans();
  }, []);

  const selectedPlan = useMemo(() => {
    return plans.flatMap((g) => g.data).find((p) => p.id === selectedPlanId);
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (selectedPlan) {
      setForm((prev) => ({
        ...prev,
        nickname: selectedPlan.title,
        leverage: selectedPlan.leverage || prev.leverage,
      }));
    }
  }, [selectedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }

      const amount = Number(form.startingBalance || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error("Enter a valid starting balance");
        return;
      }

      if (accountType === "real" && amount < (selectedPlan.minDepositAmount || 0)) {
        toast.error(
          `Minimum deposit for ${selectedPlan.title} is ${selectedPlan.minDeposit}`
        );
        return;
      }

      setLoading(true);

      const payload = {
        accountType,
        planId: selectedPlan.id,
        platform: form.platform,
        currency: form.currency,
        startingBalance: amount,
        nickname: form.nickname,
        leverage: form.leverage,
      };

      const { data } = await axios.post(`${API_URL}/api/accounts`, payload, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (accountType === "demo") {
        toast.success("Demo account created");
        navigate("/user/my-accounts");
        return;
      }

      if (data?.payLink) {
        toast.success("Payment created. Redirecting to OxaPay...");
        window.location.href = data.payLink;
        return;
      }

      toast.success(data?.message || "Account created");
      navigate("/user/my-account");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-2xl shadow-sm p-4 sm:p-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Set up your account</h1>
          <p className="text-sm text-gray-500">Create demo instantly or pay for a live account.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl border bg-gray-50 w-full sm:w-[420px]">
          <button
            onClick={() => setAccountType("demo")}
            className={`py-3 rounded-lg text-sm font-medium transition ${accountType === "demo" ? "bg-white shadow" : "text-gray-500"
              }`}
          >
            Demo
          </button>
          <button
            onClick={() => setAccountType("real")}
            className={`py-3 rounded-lg text-sm font-medium transition ${accountType === "real" ? "bg-white shadow" : "text-gray-500"
              }`}
          >
            Real
          </button>
        </div>

        <div className="rounded-xl border p-4 bg-blue-50 text-sm text-blue-900 flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <div>
            {accountType === "demo"
              ? "Demo account is risk-free and will be created instantly."
              : "Live account will be created in pending state and activated after OxaPay payment is confirmed."}
          </div>
        </div>

        <div className="space-y-4">
          {plans.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold mb-3">{section.category}</h2>

              <div className="space-y-3">
                {section.data.map((item) => {
                  const active = selectedPlanId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPlanId(item.id)}
                      className={`grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center border rounded-xl px-4 py-4 cursor-pointer transition ${active ? "border-blue-500 shadow-sm" : "hover:border-gray-300"
                        }`}
                    >
                      <div className="flex gap-4 items-start">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${active ? "border-blue-600" : "border-gray-400"
                            }`}
                        >
                          {active && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                      </div>

                      <div className="text-sm">{item.minDeposit}</div>
                      <div className="text-sm">{item.spread}</div>
                      <div className="text-sm">{item.leverage}</div>
                      <div className="text-sm">{item.commission}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold">Account details</h3>

            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 outline-none"
              >
                <option value="USD">USD - United States Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - Pound Sterling</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                {accountType === "demo" ? "Starting balance" : "Deposit amount"}
              </label>
              <input
                type="number"
                name="startingBalance"
                value={form.startingBalance}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 outline-none"
                placeholder="500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Nickname</label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 outline-none"
                placeholder="Standard"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nicknames should avoid special characters.
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <h3 className="font-semibold">Platform settings</h3>

            <div>
              <label className="text-sm text-gray-600">Max leverage</label>
              <select
                name="leverage"
                value={form.leverage}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 outline-none"
              >
                <option value="1:50">1:50</option>
                <option value="1:100">1:100</option>
                <option value="1:200">1:200</option>
                <option value="1:500">1:500</option>
                <option value="1:1000">1:1000</option>
                <option value="1:2000">1:2000</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Platform</label>

              <div className="mt-1 w-full border rounded-lg px-4 py-3 bg-gray-50 font-medium text-gray-800">
                AVG Forex
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <div className="font-medium mb-1">Selected plan</div>
              <div>{selectedPlan?.title || "-"}</div>
              <div className="text-gray-500 mt-1">{selectedPlan?.minDeposit || ""}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-4 sticky bottom-0 bg-white">
        <div className="max-w-6xl mx-auto flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {accountType === "demo" ? "Create account" : "Create & pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenAccount;