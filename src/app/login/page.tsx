'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
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
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-zinc-500">
          Enter your credentials to access your account and orders.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Quick Test Credentials:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('customer')}
            className="p-2 bg-white dark:bg-zinc-800 border rounded-xl text-left hover:border-zinc-400 transition-colors"
          >
            <span className="font-bold block text-zinc-900 dark:text-zinc-100">Customer</span>
            <span className="text-[10px] text-zinc-400">customer@ecommerce.com</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('admin')}
            className="p-2 bg-white dark:bg-zinc-800 border rounded-xl text-left hover:border-zinc-400 transition-colors"
          >
            <span className="font-bold block text-amber-600 dark:text-amber-400">Admin</span>
            <span className="text-[10px] text-zinc-400">admin@ecommerce.com</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
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
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
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
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50 mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="text-center pt-8 text-xs text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href={`/signup?redirect=${redirectUrl}`} className="font-bold text-zinc-900 dark:text-zinc-100 underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-zinc-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
