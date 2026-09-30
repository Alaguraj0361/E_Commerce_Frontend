'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, ChevronRight, Clock, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { LotusIcon } from '../../../components/ui/BrandLogo';
import { useAuthStore } from '../../../store/authStore';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders');
        if (res.data?.success && res.data.data) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Order History</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Your Purchase Chronicles
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Review the status of your past and active orders, download tax invoices, and track live consignments.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <Link href="/account" className="hover:underline">Account</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Orders ({orders.length})</span>
          </div>
        </div>
      </section>

      {/* 2. ORDERS LIST */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-zinc-400">Loading your purchase history...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#D4AF37]/30 p-8 space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#E5C07B]">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#061811]">
              No Orders Placed Yet
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
              You haven&apos;t placed any orders with us yet. Discover our newest silk sarees and bridal couture.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-[#D4AF37]/25 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
              >
                {/* Top meta row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#061811] block">
                      #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0E3324] text-[#E5C07B] border border-[#D4AF37]/30">
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails */}
                <div className="flex flex-wrap gap-4 items-center">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-zinc-600 pl-2">
                    <p className="font-bold text-[#061811] font-serif text-sm">
                      {order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}
                    </p>
                    <p className="text-zinc-500 font-light mt-0.5">
                      {order.items[0]?.name}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </p>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Total Investment</span>
                    <span className="font-serif text-lg font-bold text-[#061811]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/track-order?id=${order._id}`}
                      className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:border-[#D4AF37] font-semibold text-xs transition-colors"
                    >
                      Track Shipment
                    </Link>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="px-5 py-2 rounded-full bg-[#0E3324] hover:bg-[#061811] text-[#E5C07B] border border-[#D4AF37]/30 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      View Order Particulars →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
