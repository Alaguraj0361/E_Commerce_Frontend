'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  AlertTriangle,
  Clock,
  TrendingUp,
  Tag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login?redirect=/admin');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/analytics');
        if (res.data?.success && res.data.data) {
          setAnalytics(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-400">
        Loading admin console...
      </div>
    );
  }

  const { metrics, salesChart, recentOrders, lowStockProducts } = analytics || {
    metrics: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      pendingOrders: 0,
      lowStockCount: 0,
    },
    salesChart: [],
    recentOrders: [],
    lowStockProducts: [],
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Registered Clients',
      value: metrics.totalCustomers,
      icon: Users,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
    },
    {
      title: 'Active Artifacts',
      value: metrics.totalProducts,
      icon: ShoppingBag,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Pending Orders',
      value: metrics.pendingOrders,
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
    },
    {
      title: 'Low Stock Alerts',
      value: metrics.lowStockCount,
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
            <ShieldCheck className="w-4 h-4" /> Administrative Command
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Executive Overview
          </h1>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/admin/products"
            className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-zinc-800"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-zinc-200"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/coupons"
            className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-zinc-200"
          >
            Coupons
          </Link>
        </div>
      </div>

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. Sales Analytics Visualizer */}
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-zinc-400">Financial Performance</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              Sales Volume (Past 7 Days)
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Healthy Flow
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-zinc-100 dark:border-zinc-800">
          {salesChart.map((day: any, idx: number) => {
            const maxVal = Math.max(...salesChart.map((d: any) => d.sales || 0), 100);
            const heightPercent = Math.max(15, (day.sales / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono font-bold text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatCurrency(day.sales)}
                </span>
                <div
                  className="w-full max-w-[48px] bg-zinc-900 dark:bg-zinc-100 group-hover:bg-amber-500 rounded-t-xl transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-zinc-400 truncate w-full text-center">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Two Column Section: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Recent Transactions
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              All Orders →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {recentOrders.map((order: any) => (
              <div key={order._id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 block">
                    {order.orderNumber}
                  </span>
                  <span className="text-zinc-400">
                    {order.shippingAddress?.fullName || 'Customer'} • {order.items?.length || 0} items
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                    {formatCurrency(order.total)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Watch */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5" /> Low Inventory Watch
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900"
            >
              Restock →
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {lowStockProducts.length === 0 ? (
              <p className="text-zinc-400 py-6 text-center">All inventory levels are optimal.</p>
            ) : (
              lowStockProducts.map((prod: any) => (
                <div key={prod._id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {prod.name}
                    </h4>
                    <span className="font-mono text-zinc-400 text-[11px]">{prod.sku}</span>
                  </div>
                  <span className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold px-2.5 py-1 rounded-full text-xs">
                    {prod.stock} units left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
