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
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { LotusIcon } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'password'>('overview');

  // Change password states
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
      } catch (error) {
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
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-400">
        Loading client profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-[#0E3324] border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-serif font-bold text-[#E5C07B] shadow-xl">
              {user.firstName[0]}
              {user.lastName ? user.lastName[0] : ''}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                <LotusIcon className="w-3 h-3" />
                <span>Client Privilege Account</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs text-zinc-300 font-light">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard ↗
              </a>
            )}
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="inline-flex items-center gap-2 border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN ACCOUNT CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs Sidebar */}
          <aside className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left shadow-sm ${
                activeTab === 'overview'
                  ? 'bg-[#061811] text-[#E5C07B] border border-[#D4AF37]/40'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#D4AF37]" /> Profile Overview
            </button>

            <Link
              href="/account/orders"
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 transition-all shadow-sm"
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#D4AF37]" /> My Orders
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/track-order"
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 transition-all shadow-sm"
            >
              <span className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37]" /> Live Tracking
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <Link
              href="/wishlist"
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 transition-all shadow-sm"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#D4AF37]" /> Wishlist
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all text-left shadow-sm ${
                activeTab === 'password'
                  ? 'bg-[#061811] text-[#E5C07B] border border-[#D4AF37]/40'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
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
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-sm space-y-6">
                  <h3 className="font-serif text-xl font-bold text-[#061811]">
                    Client Particulars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-100">
                      <span className="text-zinc-500 font-medium block">Full Name</span>
                      <strong className="text-[#061811] text-sm mt-0.5 block font-serif">
                        {user.firstName} {user.lastName}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-100">
                      <span className="text-zinc-500 font-medium block">Registered Email</span>
                      <strong className="text-[#061811] text-sm mt-0.5 block">
                        {user.email}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-100">
                      <span className="text-zinc-500 font-medium block">Mobile Contact</span>
                      <strong className="text-[#061811] text-sm mt-0.5 block font-mono">
                        {user.phone || 'Not provided'}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-100">
                      <span className="text-zinc-500 font-medium block">Membership Tier</span>
                      <strong className="text-[#B8860B] text-sm mt-0.5 block font-serif">
                        NALMARA Royal Patron
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-[#061811]">
                      Recent Orders
                    </h3>
                    <Link
                      href="/account/orders"
                      className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1"
                    >
                      View All Orders <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <p className="text-xs text-zinc-500">No recent orders found.</p>
                      <Link
                        href="/shop"
                        className="inline-block text-xs font-bold text-[#061811] hover:underline"
                      >
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((ord) => (
                        <div
                          key={ord._id}
                          className="p-4 rounded-2xl border border-zinc-100 bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#061811]">
                              #{ord.orderNumber || ord._id.slice(-8).toUpperCase()}
                            </span>
                            <p className="text-zinc-500 text-[11px] mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0E3324] text-[#E5C07B]">
                              {ord.orderStatus}
                            </span>
                            <span className="font-bold text-[#061811] font-serif">
                              {formatCurrency(ord.totalAmount)}
                            </span>
                            <Link
                              href={`/account/orders/${ord._id}`}
                              className="text-xs font-bold text-[#B8860B] hover:underline"
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
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#061811]">
                  Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-[#FAF8F5] border border-zinc-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-zinc-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all disabled:opacity-50 mt-2"
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
