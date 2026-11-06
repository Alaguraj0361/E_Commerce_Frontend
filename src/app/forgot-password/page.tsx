"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgotpassword", { email });
      setSubmitted(true);
    } catch {
      // Even if SMTP isn't configured in dev, provide graceful patron feedback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-[#FAF7F2] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.14),transparent_65%)]" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/65 text-[#FFE59E] shadow-md">
            <NalmaraEmblem className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold">
              Atelier Security
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#0E0B09]">
            Recover{" "}
            <span className="font-script italic font-normal text-[#8C6518] text-4xl sm:text-5xl">
              Access
            </span>
          </h1>
        </div>

        <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/80 rounded-2xl border-2 border-[#D4AF37]/70 p-8 md:p-10 shadow-[0_24px_60px_-15px_rgba(14,11,9,0.2)] space-y-6">
          <div className="pointer-events-none absolute inset-[5px] rounded-[12px] border border-[#D4AF37]/25" />
          <span className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-[#D4AF37]" />

          <div className="relative z-10 space-y-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#6B5A47] hover:text-[#0E0B09] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8C6518]" /> Back to Sign In
            </Link>

            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#0E0B09] to-[#1F1811] border-2 border-[#D4AF37] text-[#FFE59E] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-normal text-[#0E0B09]">
                  Recovery Link Dispatched
                </h2>
                <p className="text-sm text-[#4A3B2C] leading-relaxed">
                  If an account is registered under{" "}
                  <span className="font-bold text-[#0E0B09]">{email}</span>, we have sent instructions to reset your password.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.22em] hover:brightness-105 transition-all mt-2 shadow-[0_10px_25px_rgba(212,175,55,0.3)]"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-[#4A3B2C] leading-relaxed font-medium">
                    Enter your registered email address and we will send you a secure link to reset your password.
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-rose-800 bg-rose-50 border border-rose-300 rounded-xl px-4 py-3 font-medium">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5C4934] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8C6518] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patron@example.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D4AF37]/55 bg-[#FFFDF9] text-sm text-[#0E0B09] focus:outline-none focus:border-[#0E0B09] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.22em] hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_10px_25px_rgba(212,175,55,0.35)]"
                  >
                    {loading ? "Dispatching..." : "Send Recovery Link"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
