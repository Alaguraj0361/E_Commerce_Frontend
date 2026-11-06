'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { api } from '../../../../lib/api';
import { Order } from '../../../../types';
import { formatCurrency } from '../../../../lib/utils';
import { NalmaraEmblem } from '../../../../components/ui/BrandLogo';

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
      <div className="min-h-[50vh] bg-[#FAF7F2] flex items-center justify-center text-[#5C4934] font-serif">
        Loading order particulars...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#0E0B09]">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs font-extrabold text-[#8C6518] underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-5xl mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs text-[#FFE59E] hover:underline mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Orders
            </Link>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] px-3 py-0.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]">
                <NalmaraEmblem className="w-3.5 h-3.5" />
                <span>Order Details</span>
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFDF9]">
              Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-[#EDE3D2]/80 font-light">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 sm:gap-3">
            <span
              className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37]'
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
            <span className="text-xs font-extrabold bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37] px-3.5 py-1.5 rounded-full">
              Status: {order.orderStatus}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* 1. VISUAL ORDER TIMELINE STEPPER */}
        <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/65 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C6518] mb-8">
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
                        ? 'bg-[#0E0B09] text-[#FFE59E] border-2 border-[#D4AF37]'
                        : isCurrent
                        ? 'bg-[#0E0B09] text-[#FFE59E] ring-4 ring-[#D4AF37]/40'
                        : 'bg-[#FFFDF9] text-[#8C7A65] border border-[#D4AF37]/40'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> : idx + 1}
                  </div>
                  <div className="text-left md:text-center">
                    <span
                      className={`text-xs font-serif font-bold block ${
                        isCompleted || isCurrent ? 'text-[#0E0B09]' : 'text-[#8C7A65]'
                      }`}
                    >
                      {step}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-[#8C6518] font-bold block">
                        Current Stage
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="mt-8 p-4 bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#5C4934]">
                <Truck className="w-4 h-4 text-[#8C6518]" />
                <span>Courier Tracking Number:</span>
                <strong className="font-mono text-[#0E0B09]">{order.trackingNumber}</strong>
              </div>
              <span className="text-emerald-800 font-bold">Live Transit</span>
            </div>
          )}
        </div>

        {/* 2. Order Breakdown and Shipping Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/65 space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#0E0B09] border-b border-[#D4AF37]/35 pb-3">
              Purchased Couture Ensembles
            </h3>

            <div className="divide-y divide-[#D4AF37]/30">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#0E0B09] border border-[#D4AF37] flex-shrink-0">
                      <Image
                        src={item.image || '/images/bestsellers/traditional_silk_saree.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#0E0B09]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6B5740] mt-0.5">
                        SKU: {item.sku} • Quantity: {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#0E0B09] mt-1">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                  <span className="font-serif font-extrabold text-sm text-[#0E0B09]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/40 space-y-2 text-xs">
              <div className="flex justify-between text-[#5C4934]">
                <span>Subtotal</span>
                <span className="font-bold text-[#0E0B09]">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Promotional Discount ({order.couponCode})</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C4934]">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-800">
                  {order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#5C4934]">
                <span>GST (5% Integrated Tax)</span>
                <span className="font-bold text-[#0E0B09]">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-[#0E0B09] pt-3 border-t border-[#D4AF37]/50">
                <span>Total Paid</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] p-6 rounded-3xl border-2 border-[#D4AF37]/65 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#8C6518]">
                <MapPin className="w-4 h-4" /> Delivery Destination
              </div>
              <div className="text-xs text-[#5C4934] space-y-1">
                <p className="font-serif font-bold text-[#0E0B09] text-sm">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2 text-[#6B5740] font-semibold">Contact: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] p-6 rounded-3xl border-2 border-[#D4AF37]/65 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#8C6518]">
                <CreditCard className="w-4 h-4" /> Payment Details
              </div>
              <div className="text-xs text-[#5C4934] space-y-1">
                <p className="font-bold text-[#0E0B09] capitalize">
                  Method: {order.paymentMethod}
                </p>
                <p className="text-emerald-800 font-bold">Payment Status: {order.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
