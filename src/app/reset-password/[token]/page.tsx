'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
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
        toast.success('Your password has been updated!');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Reset link is invalid or has expired');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="md" theme="light" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#061811]">
            Create New Password
          </h1>
          <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
            Choose a strong password with at least 6 characters for your client account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl space-y-5">
          {isSuccess ? (
            <div className="p-6 bg-[#0E3324]/5 border border-[#D4AF37]/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0E3324] mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#061811]">
                Password Reset Successfully
              </h3>
              <p className="text-xs text-zinc-600 font-light">
                Your credentials are secure. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
