'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, ChevronRight, Clock, ShieldCheck, Search } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Order History
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-zinc-400">Loading your purchase history...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No Orders Found
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
            You haven&apos;t placed any orders with us yet.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Top meta row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
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
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    Status: {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=200&q=80'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Qty: {item.quantity} • {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom footer row */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-xs text-zinc-500">Order Total: </span>
                  <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order._id}`}
                  className="inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  View Details & Timeline <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
