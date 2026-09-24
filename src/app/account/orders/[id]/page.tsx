'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { Order } from '../../../../types';
import { formatCurrency } from '../../../../lib/utils';

const STATUS_STEPS = ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        if (res.data?.success && res.data.data) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-400">
        Loading order particulars...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs font-bold underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  // Determine active step index
  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              order.paymentStatus === 'Paid'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            Payment: {order.paymentStatus}
          </span>
          <span className="text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1 rounded-full">
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      {/* 1. VISUAL ORDER TIMELINE STEPPER */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-8">
          Fulfillment Progress
        </h3>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-auto">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-zinc-900 text-white ring-4 ring-zinc-200'
                      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="text-left md:text-center">
                  <span
                    className={`text-xs font-bold block ${
                      isCompleted || isCurrent
                        ? 'text-zinc-900 dark:text-zinc-100'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Current Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Truck className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>Courier Tracking Number:</span>
              <strong className="font-mono text-zinc-900 dark:text-white">{order.trackingNumber}</strong>
            </div>
            <span className="text-emerald-600 font-semibold">Live Transit</span>
          </div>
        )}
      </div>

      {/* 2. Order Breakdown and Shipping Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-6">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            Purchased Artifacts
          </h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      SKU: {item.sku} • Quantity: {item.quantity}
                    </p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount ({order.couponCode})</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>GST (18% Integrated Tax)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total Paid</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <MapPin className="w-4 h-4" /> Delivery Destination
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 text-zinc-400">Contact: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <CreditCard className="w-4 h-4" /> Payment Details
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                Method: {order.paymentMethod}
              </p>
              <p className="text-emerald-600 font-semibold">Payment Status: {order.paymentStatus}</p>
              {order.stripeSessionId && (
                <p className="font-mono text-[10px] text-zinc-400 pt-1">
                  Session: {order.stripeSessionId.slice(0, 20)}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
