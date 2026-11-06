'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Phone, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo, NalmaraEmblem } from '../../components/ui/BrandLogo';
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
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" theme="light" />
          </div>
          <div className="pt-1">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] px-4 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37]">
              <NalmaraEmblem className="w-4 h-4" />
              <span>Nalmara Fashion • Thoothukudi</span>
              <Sparkles className="w-3 h-3 text-[#FFE59E]" />
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#280619]">
            Create Your{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl text-[#5B0E3D]">
              Account
            </span>
          </h1>
          <p className="text-xs text-[#5C3D1E] font-normal max-w-xs mx-auto">
            Save your delivery address, track orders easily, and get early festival offers.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-3xl p-[2.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-[0_20px_50px_rgba(45,6,30,0.16)]">
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-[22px] p-6 sm:p-8 space-y-5">
            <div className="absolute inset-[5px] rounded-[18px] border border-[#D4AF37]/30 pointer-events-none" />
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8C5818] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Priya"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Sharma"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C5818] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C5818] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C5818] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C5818] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#5B0E3D] via-[#380725] to-[#5B0E3D] hover:from-[#70124B] hover:to-[#4A0A31] text-[#FFE59E] border border-[#D4AF37] py-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(56,7,37,0.3)] transition-all hover:scale-[1.01] disabled:opacity-50 mt-4 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFE59E]" />
                    Creating Patron Account...
                  </>
                ) : (
                  'Create Royal Account'
                )}
              </button>
            </form>

            <div className="relative z-10 text-center pt-2 text-xs text-[#5C3D1E]">
              Already have an account?{' '}
              <Link
                href={`/login?redirect=${redirectUrl}`}
                className="font-extrabold text-[#380725] hover:text-[#8C5818] underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-[#5C4934]">Loading registration...</div>}>
      <SignupContent />
    </Suspense>
  );
}
