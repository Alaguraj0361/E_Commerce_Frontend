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
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { formatCurrency } from '../../lib/utils';
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
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800 gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xl font-bold">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
        </div>

        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs Sidebar */}
        <aside className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
              activeTab === 'overview'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <UserIcon className="w-4 h-4" /> Overview
          </button>

          <Link
            href="/account/orders"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Package className="w-4 h-4" /> My Orders
          </Link>

          <Link
            href="/wishlist"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Heart className="w-4 h-4" /> Wishlist
          </Link>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left ${
              activeTab === 'password'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </button>

          <div className="pt-4">
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'overview' ? (
            <>
              {/* Account Quick Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-xs uppercase font-bold text-zinc-400">Account Details</span>
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                  <p className="text-xs text-zinc-500">{user.phone || 'No phone set'}</p>
                </div>

                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-xs uppercase font-bold text-zinc-400">Account Status</span>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Verified Member
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Role: <span className="capitalize font-medium text-zinc-700 dark:text-zinc-300">{user.role}</span>
                  </p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Recent Orders
                  </h3>
                  <Link
                    href="/account/orders"
                    className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  >
                    View All Orders →
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
                    You have not placed any orders yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <Link
                        key={order._id}
                        href={`/account/orders/${order._id}`}
                        className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow flex items-center justify-between block"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            • {order.items.length} items
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(order.total)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Change Password Form */
            <form
              onSubmit={handleChangePassword}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg space-y-4 shadow-sm"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Update Password
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-4"
              >
                {isChangingPassword ? 'Updating...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
