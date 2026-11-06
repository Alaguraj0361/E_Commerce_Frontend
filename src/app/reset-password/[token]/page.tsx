"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../../../lib/api";
import { NalmaraEmblem } from "../../../components/ui/BrandLogo";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      if (res.data?.success) {
        setIsSuccess(true);
        toast.success("Your password has been updated!");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error: any) {
      toast.error(error.customMessage || "Reset link is invalid or has expired");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-[#FAF7F2] text-[#0E0B09] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.14),transparent_65%)]" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Emblem & Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/65 text-[#FFE59E] shadow-md">
            <NalmaraEmblem className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold">
              Patron Credentials
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#0E0B09]">
            Create New{" "}
            <span className="font-script italic font-normal text-[#8C6518] text-4xl sm:text-5xl">
              Password
            </span>
          </h1>
          <p className="text-xs text-[#6B5A47] font-medium max-w-xs mx-auto">
            Choose a strong password with at least 6 characters for your Nalmara Patron account.
          </p>
        </div>

        {/* Royal Ivory & 24K Gold Card */}
        <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/80 rounded-2xl p-8 md:p-10 border-2 border-[#D4AF37]/70 shadow-[0_24px_60px_-15px_rgba(14,11,9,0.2)] space-y-5">
          <div className="pointer-events-none absolute inset-[5px] rounded-[12px] border border-[#D4AF37]/25" />
          <span className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[#D4AF37]" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-[#D4AF37]" />

          <div className="relative z-10">
            {isSuccess ? (
              <div className="p-6 bg-[#FFFDF9] border border-[#D4AF37]/60 rounded-xl text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#0E0B09] to-[#1F1811] border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-[#0E0B09]">
                  Password Reset Successfully
                </h3>
                <p className="text-xs text-[#6B5A47] font-medium">
                  Your credentials are secure. Redirecting to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5C4934] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6518] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/55 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#0E0B09] text-[#0E0B09]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5C4934] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C6518] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/55 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#0E0B09] text-[#0E0B09]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] py-4 rounded-full text-xs font-extrabold uppercase tracking-[0.22em] flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(212,175,55,0.35)] transition-all hover:brightness-105 disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0E0B09]" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
