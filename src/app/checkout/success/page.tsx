'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Home } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { useCartStore } from '../../../store/cartStore';
import { NalmaraEmblem } from '../../../components/ui/BrandLogo';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data?.success && res.data.data) {
          setOrder(res.data.data);
        }
      } catch {
        // Ignore
      }
    };

    fetchOrder();
  }, [orderId, clearCart]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Royal Celebration Crest */}
        <div className="inline-flex p-5 rounded-full bg-[#0E0B09] text-[#FFE59E] border-2 border-[#D4AF37] shadow-[0_14px_34px_rgba(212,175,55,0.3)]">
          <CheckCircle2 className="w-12 h-12 text-[#D4AF37]" />
        </div>

        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0E0B09] border border-[#D4AF37] text-[#FFE59E] text-[10px] uppercase tracking-[0.22em] font-bold">
            <NalmaraEmblem className="w-4 h-4" />
            <span>
              {order?.paymentMethod === 'cod'
                ? 'Order Confirmed • Cash on Delivery'
                : 'Payment Confirmed • Verified Online'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0E0B09] tracking-tight">
            Thank You For Your{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl text-[#8C6518]">
              Order!
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4934] max-w-md mx-auto font-light leading-relaxed">
            We have received your order at our Thoothukudi store and our team is packing your parcel for fast Tamil Nadu & India delivery.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-gradient-to-r from-[#FFFDF9] to-[#FAF3E6] border-2 border-[#D4AF37]/75 text-[#0E0B09] px-5 py-1.5 rounded-full font-mono text-xs font-extrabold shadow-xs">
              Order #{order?.orderNumber || 'NAL-2026-CONFIRMED'}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/75 text-left space-y-6 shadow-[0_20px_50px_rgba(14,11,9,0.08)]">
            <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/30 pointer-events-none" />
            <h3 className="relative z-10 font-serif font-bold text-lg text-[#0E0B09] border-b border-[#D4AF37]/40 pb-3">
              Order Summary
            </h3>

            <div className="relative z-10 divide-y divide-[#D4AF37]/30">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-[#0E0B09] border border-[#D4AF37] shrink-0">
                      <Image
                        src={item.image || '/images/bestsellers/traditional_silk_saree.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#0E0B09] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#6B5740]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-extrabold text-xs sm:text-sm text-[#0E0B09]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative z-10 pt-4 border-t border-[#D4AF37]/40 space-y-2 text-xs">
              <div className="flex justify-between text-[#5C4934]">
                <span>Subtotal</span>
                <span className="font-bold text-[#0E0B09]">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Discount ({order.couponCode})</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C4934]">
                <span>Shipping</span>
                <span className="font-bold text-emerald-800">
                  {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#5C4934]">
                <span>GST</span>
                <span className="font-bold text-[#0E0B09]">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-extrabold text-[#0E0B09] pt-2 border-t border-[#D4AF37]/50">
                <span>{order.paymentMethod === 'cod' ? 'Total (Due on Delivery)' : 'Total Paid'}</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="relative z-10 pt-4 border-t border-[#D4AF37]/40 text-xs text-[#5C4934]">
              <p className="font-extrabold text-[#0E0B09] mb-1 uppercase tracking-wider">Shipping To:</p>
              <p className="font-semibold text-[#2C2117]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {order && (
            <Link
              href={`/account/orders/${order._id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0E0B09] via-[#1F1811] to-[#0E0B09] border-2 border-[#D4AF37] text-[#FFE59E] px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-[0.18em] transition-all shadow-md"
            >
              <Package className="w-4 h-4 text-[#D4AF37]" /> View Order Details
            </Link>
          )}
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-[0.18em] shadow-md transition-all"
          >
            <Home className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-20 text-center text-[#5C4934]">Loading royal order status...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
