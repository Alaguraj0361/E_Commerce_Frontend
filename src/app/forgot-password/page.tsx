'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        setIsSubmitted(true);
        toast.success('Password reset instructions sent');
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#061811] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        {/* Brand Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="md" theme="light" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#061811]">
            Reset Your Password
          </h1>
          <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
            Enter your registered client email address to receive password restoration instructions.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl space-y-5">
          {isSubmitted ? (
            <div className="p-6 bg-[#0E3324]/5 border border-[#D4AF37]/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0E3324] mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#061811]">
                Check Your Inbox
              </h3>
              <p className="text-xs text-zinc-600 font-light leading-relaxed">
                If an account exists for <strong className="text-[#061811]">{email}</strong>, a secure reset link has been dispatched.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-block px-5 py-2.5 rounded-full bg-[#0E3324] text-[#E5C07B] text-xs font-bold uppercase tracking-wider"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
