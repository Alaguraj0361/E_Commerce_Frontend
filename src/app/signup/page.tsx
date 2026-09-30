'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Phone, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo, LotusIcon } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';

  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data?.success && res.data.data?.user) {
        if (res.data.data?.token) {
          localStorage.setItem('auth_token', res.data.data.token);
        }
        setUser(res.data.data.user);
        toast.success(`Welcome to NALMARA FASHION, ${res.data.data.user.firstName}!`);
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Registration failed');
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
            <BrandLogo size="lg" theme="light" />
          </div>
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
              Join The Atelier
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#061811]">
            Create an Account
          </h1>
          <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto">
            Experience bespoke tailoring, private previews, and seamless order management.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Priya"
                    className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Sharma"
                  className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="priya@example.com"
                  className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
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
                  Creating Client Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-zinc-500">
            Already have an account?{' '}
            <Link
              href={`/login?redirect=${redirectUrl}`}
              className="font-bold text-[#061811] hover:text-[#B8860B] underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-zinc-400">Loading registration...</div>}>
      <SignupContent />
    </Suspense>
  );
}
