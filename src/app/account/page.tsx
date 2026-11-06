'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  Heart,
  KeyRound,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { NalmaraEmblem } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'password'>('overview');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data?.success && res.data.data) {
          setRecentOrders(res.data.data.slice(0, 3));
        }
      } catch {
        // Ignore
      }
    };
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      if (res.data?.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setActiveTab('overview');
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[50vh] bg-[#FDF6EC] flex items-center justify-center text-[#280619] font-serif">
        Loading Your Royal Account...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B]">
      {/* 1. ROYAL PALACE HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280619] via-[#3D0829] to-[#280619] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]">
        <div className="max-w-[1480px] mx-auto relative rounded-3xl border border-[#D4AF37]/45 bg-[#220415]/65 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-serif font-bold text-[#FFE59E] shadow-[0_10px_28px_rgba(212,175,55,0.3)]">
              {user.firstName[0]}
              {user.lastName ? user.lastName[0] : ''}
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] px-3 py-1 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85">
                <NalmaraEmblem className="w-4 h-4" />
                <span>My Customer Account</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9]">
                {user.firstName}{' '}
                <span className="font-script italic font-normal text-3xl sm:text-4xl text-[#FFE59E]">
                  {user.lastName}
                </span>
              </h1>
              <p className="text-xs text-[#FAF0DD]/85 font-light">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard ↗
              </a>
            )}
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="inline-flex items-center gap-2 border border-[#D4AF37]/80 bg-[#380725] text-[#FFE59E] hover:bg-rose-950/80 hover:border-rose-400 px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN ACCOUNT CONTENT */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs Sidebar */}
          <aside className="space-y-2.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all text-left shadow-xs cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border-2 border-[#D4AF37]'
                  : 'bg-[#FFFDF9] text-[#280619] hover:border-[#D4AF37] border border-[#D4AF37]/50'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#D4AF37]" /> Profile Overview
            </button>

            <Link
              href="/account/orders"
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-[#FFFDF9] text-[#280619] hover:border-[#D4AF37] border border-[#D4AF37]/50 transition-all shadow-xs"
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#8C5818]" /> My Orders
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C5818]" />
            </Link>

            <Link
              href="/track-order"
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-[#FFFDF9] text-[#280619] hover:border-[#D4AF37] border border-[#D4AF37]/50 transition-all shadow-xs"
            >
              <span className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#8C5818]" /> Live Tracking
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C5818]" />
            </Link>

            <Link
              href="/wishlist"
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider bg-[#FFFDF9] text-[#280619] hover:border-[#D4AF37] border border-[#D4AF37]/50 transition-all shadow-xs"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#8C5818]" /> Wishlist
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C5818]" />
            </Link>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all text-left shadow-xs cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border-2 border-[#D4AF37]'
                  : 'bg-[#FFFDF9] text-[#280619] hover:border-[#D4AF37] border border-[#D4AF37]/50'
              }`}
            >
              <KeyRound className="w-4 h-4 text-[#D4AF37]" /> Security & Password
            </button>
          </aside>

          {/* Tab Content Panel */}
          <main className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/75 shadow-[0_14px_34px_rgba(56,7,37,0.08)] space-y-6">
                  <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
                  <h3 className="relative z-10 font-serif text-xl font-bold text-[#280619] border-b border-[#D4AF37]/35 pb-3">
                    Patron Particulars
                  </h3>
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/60">
                      <span className="text-[#8C5818] font-bold uppercase tracking-wider text-[10px] block">
                        Full Name
                      </span>
                      <strong className="text-[#280619] text-sm mt-1 block font-serif">
                        {user.firstName} {user.lastName}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/60">
                      <span className="text-[#8C5818] font-bold uppercase tracking-wider text-[10px] block">
                        Registered Email
                      </span>
                      <strong className="text-[#280619] text-sm mt-1 block">
                        {user.email}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/60">
                      <span className="text-[#8C5818] font-bold uppercase tracking-wider text-[10px] block">
                        Mobile Contact
                      </span>
                      <strong className="text-[#280619] text-sm mt-1 block font-mono">
                        {user.phone || 'Not provided'}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37]">
                      <span className="text-[#FFE59E]/80 font-bold uppercase tracking-wider text-[10px] block">
                        Membership Tier
                      </span>
                      <strong className="text-[#FFE59E] text-sm mt-1 block font-serif font-bold">
                        ✦ NALMARA Royal Patron
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/75 shadow-[0_14px_34px_rgba(56,7,37,0.08)] space-y-6">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-3">
                    <h3 className="font-serif text-xl font-bold text-[#280619]">
                      Recent Orders
                    </h3>
                    <Link
                      href="/account/orders"
                      className="text-xs font-extrabold uppercase tracking-wider text-[#5B0E3D] hover:text-[#280619] flex items-center gap-1"
                    >
                      View All Orders <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-xs text-[#5C3D1E]">No recent orders found.</p>
                      <Link
                        href="/shop"
                        className="inline-block text-xs font-extrabold text-[#380725] underline"
                      >
                        Start Exploring Collections →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-2xl border border-[#D4AF37]/60 bg-[#FFFDF9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <span className="font-mono font-extrabold text-[#280619]">
                              #{ord.orderNumber || ord._id.slice(-8).toUpperCase()}
                            </span>
                            <p className="text-[#5C3D1E] text-[11px] mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37]">
                              {ord.orderStatus}
                            </span>
                            <span className="font-extrabold text-[#280619] font-serif text-sm">
                              {formatCurrency(ord.totalAmount ?? ord.total ?? 0)}
                            </span>
                            <Link
                              href={`/account/orders/${ord._id}`}
                              className="text-xs font-extrabold text-[#5B0E3D] hover:text-[#280619] underline"
                            >
                              Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/75 shadow-[0_14px_34px_rgba(56,7,37,0.08)] space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#280619] border-b border-[#D4AF37]/35 pb-3">
                  Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#280619] mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#280619]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-gradient-to-r from-[#5B0E3D] via-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] py-3.5 px-7 rounded-full text-xs font-serif font-bold uppercase tracking-[0.2em] shadow-md transition-all disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
