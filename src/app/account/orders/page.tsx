'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { NalmaraEmblem } from '../../../components/ui/BrandLogo';
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
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO HEADER (Matching Home Page Look) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-6 sm:p-10 text-center space-y-3">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/75 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Order History</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            My{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Orders
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-xl mx-auto leading-relaxed">
            Check the status of your orders, view invoices, and track live delivery from our Thoothukudi store.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <Link href="/account" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Account</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Orders ({orders.length})</span>
          </div>
        </div>
      </section>

      {/* 2. ORDERS LIST */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-[#5C4934] font-serif">Loading your purchase history...</div>
        ) : orders.length === 0 ? (
          <div className="relative text-center py-16 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl border-2 border-[#D4AF37]/70 p-8 space-y-4 max-w-md mx-auto shadow-lg">
            <div className="w-16 h-16 rounded-full bg-[#0E0B09] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#FFE59E]">
              <Package className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#0E0B09]">
              No Orders Placed Yet
            </h3>
            <p className="text-xs text-[#5C4934] max-w-xs mx-auto leading-relaxed">
              You haven&apos;t placed any orders with us yet. Discover our newest silk sarees and bridal couture.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] transition-all shadow-md"
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
                className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl border-2 border-[#D4AF37]/65 p-6 sm:p-8 shadow-[0_14px_34px_rgba(14,11,9,0.06)] space-y-6"
              >
                <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
                {/* Top meta row */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/35">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-[#0E0B09] block">
                      #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-[#6B5740]">
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
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-[#FFFDF9] text-[#8C6518] border border-[#D4AF37]'
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37]">
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails */}
                <div className="relative z-10 flex flex-wrap gap-4 items-center">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#0E0B09] border border-[#D4AF37]"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#FFE59E]">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-[#5C4934] pl-2">
                    <p className="font-bold text-[#0E0B09] font-serif text-sm">
                      {order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}
                    </p>
                    <p className="text-[#6B5740] font-light mt-0.5">
                      {order.items[0]?.name}
                      {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </p>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/35 text-xs">
                  <div>
                    <span className="text-[#6B5740] block">Order Total</span>
                    <span className="font-serif text-lg font-extrabold text-[#0E0B09]">
                      {formatCurrency(order.totalAmount ?? order.total ?? 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <Link
                      href={`/track-order?id=${order._id}`}
                      className="px-4 py-2 rounded-full border border-[#D4AF37] bg-[#FFFDF9] text-[#0E0B09] hover:bg-[#FAF3E6] font-extrabold text-xs transition-colors"
                    >
                      Track Order
                    </Link>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-[#0E0B09] via-[#1F1811] to-[#0E0B09] text-[#FFE59E] border border-[#D4AF37] font-extrabold text-xs uppercase tracking-wider transition-all"
                    >
                      View Order Details →
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
