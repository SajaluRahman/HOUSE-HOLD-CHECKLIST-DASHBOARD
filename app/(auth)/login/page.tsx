// app/login/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore"; // <== your Zustand store path
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const login = useAdminStore((state) => state.login);
  const loadingGlobal = useAdminStore((state) => state.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalLoading(true);

    const success = await login({ email, password });

    setLocalLoading(false);

    if (success) {
      router.push("/"); // Redirect after successful login
    }
  };

  const loading = localLoading || loadingGlobal;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#1D3C8F]/5 via-white to-[#17A2A2]/5 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo / Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1D3C8F] to-[#17A2A2] text-white text-3xl font-bold shadow-xl mb-4">
              HA
            </div>
            <h1 className="text-3xl font-bold text-[#1D3C8F]">
              Housekeeping Audit
            </h1>
            <p className="text-[#2E2E2E]/60 mt-2">Sign in to access your audits</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#D7DDE5] overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] text-center mb-8">
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@hospital.com"
                    className="w-full px-5 py-4 border-2 border-[#D7DDE5] rounded-xl focus:border-[#17A2A2] focus:outline-none transition-colors text-lg"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full px-5 py-4 pr-14 border-2 border-[#D7DDE5] rounded-xl focus:border-[#17A2A2] focus:outline-none transition-colors text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2E2E2E]/60 hover:text-[#17A2A2] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-6 h-6" />
                      ) : (
                        <Eye className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className={`
                    w-full py-4 rounded-xl font-bold text-white text-lg
                    bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2]
                    hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-3
                  `}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center">
                <a href="#" className="text-sm text-[#17A2A2] hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2]" />
          </div>

          <p className="text-center text-sm text-[#2E2E2E]/50 mt-8">
            © 2025 Housekeeping Audit System • All rights reserved
          </p>
        </div>
      </div>
    </>
  );
}
