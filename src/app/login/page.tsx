'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo, NalmaraEmblem } from '../../components/ui/BrandLogo';
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

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Emblem & Royal Welcome Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" theme="light" />
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] px-4 py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#540D3A] to-[#380725] border border-[#D4AF37] shadow-sm">
              <NalmaraEmblem className="w-4 h-4" />
              <span>Nalmara Fashion • Thoothukudi</span>
              <Sparkles className="w-3 h-3 text-[#FFE59E]" />
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
            Welcome{' '}
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#681145] via-[#9E6B18] to-[#580E3A]">
              Back
            </span>
          </h1>
          <p className="text-xs text-[#5C3D1E] font-medium max-w-xs mx-auto">
            Sign in to view your saved wishlist, delivery addresses, and live order status.
          </p>
        </div>

        {/* Royal Auth Card */}
        <div className="relative rounded-3xl p-[2.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-[0_22px_54px_rgba(45,6,30,0.16)]">
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-[22px] p-6 sm:p-8 space-y-5">
            <div className="absolute inset-2.5 rounded-[16px] border border-[#D4AF37]/40 pointer-events-none" />
            <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
            <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />
            <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-[#B88228] pointer-events-none" />
            <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-[#B88228] pointer-events-none" />

            <form onSubmit={handleLogin} className="relative z-10 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#23120B] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6518] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/75 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#23120B] placeholder:text-[#8C7A65]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#23120B]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#681145] hover:text-[#23120B] underline font-bold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C6518] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/75 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#23120B] placeholder:text-[#8C7A65]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#5B0E3D] via-[#3D0829] to-[#5B0E3D] hover:from-[#73124C] hover:to-[#4E0B34] text-[#FFE59E] border border-[#D4AF37] py-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(61,8,41,0.35)] transition-all hover:scale-[1.01] disabled:opacity-50 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFE59E]" />
                    Signing In...
                  </>
                ) : (
                  'Sign In to Your Account'
                )}
              </button>
            </form>

            <div className="relative z-10 flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#6B5035]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6518]" />
              <span>100% Secure &amp; Encrypted Login</span>
            </div>

            <div className="relative z-10 text-center pt-2 border-t border-[#D4AF37]/30 text-xs text-[#5C3D1E]">
              Don&apos;t have an account yet?{' '}
              <Link
                href={`/signup?redirect=${redirectUrl}`}
                className="font-extrabold text-[#5B0E3D] hover:text-[#23120B] underline"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-20 text-center text-[#5C3D1E] font-serif">
          Loading sign-in portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
