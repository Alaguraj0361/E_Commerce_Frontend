'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, KeyRound, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo, LotusIcon } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      if (res.data?.success && res.data.data?.user) {
        if (res.data.data?.token) {
          localStorage.setItem('auth_token', res.data.data.token);
        }
        setUser(res.data.data.user);
        toast.success(`Welcome back, ${res.data.data.user.firstName}!`);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@ecommerce.com');
      setPassword('Admin@123456');
    } else {
      setEmail('customer@ecommerce.com');
      setPassword('Customer@123456');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Emblem & Welcome Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" theme="light" />
          </div>
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
              Client Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#061811]">
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
            Access your private couture wishlist, bespoke tailoring history, and order tracking.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl space-y-5">
          {/* Demo Credentials Quick Fill Banner */}
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#D4AF37]/25 text-xs space-y-2">
            <p className="font-bold text-[#061811] flex items-center gap-1.5 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" /> One-Click Demo Access:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="p-2 bg-white border border-zinc-200 rounded-xl text-left hover:border-[#D4AF37] transition-colors shadow-sm"
              >
                <span className="font-bold block text-[#061811] text-[11px]">Customer</span>
                <span className="text-[9px] text-zinc-400 truncate block">customer@ecommerce.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="p-2 bg-white border border-zinc-200 rounded-xl text-left hover:border-[#D4AF37] transition-colors shadow-sm"
              >
                <span className="font-bold block text-[#B8860B] text-[11px]">Admin Concierge</span>
                <span className="text-[9px] text-zinc-400 truncate block">admin@ecommerce.com</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Email Address
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#B8860B] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  Verifying...
                </>
              ) : (
                'Sign In to Account'
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-zinc-500">
            Don&apos;t have an account yet?{' '}
            <Link
              href={`/signup?redirect=${redirectUrl}`}
              className="font-bold text-[#061811] hover:text-[#B8860B] underline"
            >
              Create Client Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-zinc-400">Loading portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
