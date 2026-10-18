'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Truck, Home } from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { useCartStore } from '../../../store/cartStore';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart
    clearCart();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data?.success && res.data.data) {
          setOrder(res.data.data);
        }
      } catch (error) {
        // Ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="inline-flex p-4 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] border border-[#D4AF37]/40 shadow-md">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#4A0E17] font-bold">
          {order?.paymentMethod === 'cod'
            ? 'Order Confirmed • Cash on Delivery'
            : 'Payment Confirmed • Verified via UPI / Online'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
          Thank You For Your Order
        </h1>
        <p className="text-sm text-zinc-600 max-w-md mx-auto font-light">
          We have received your royal order and our master weavers are preparing your parcel for insured dispatch.
        </p>
        <div className="pt-2">
          <span className="inline-block bg-[#FAF7F2] border border-[#E8E2D5] text-[#4A0E17] px-4 py-1.5 rounded-full font-mono text-xs font-bold shadow-2xs">
            Order #{order?.orderNumber || 'ORD-2026-CONFIRMED'}
          </span>
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] text-left space-y-6 shadow-sm">
          <h3 className="font-serif font-bold text-base text-zinc-900">
            Order Summary
          </h3>

          <div className="divide-y divide-[#E8E2D5]/70">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-[#E8E2D5] shrink-0">
                    <Image
                      src={item.image || '/images/bestsellers/traditional_silk_saree.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-xs text-zinc-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-zinc-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E2D5]/70 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Taxes</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-serif font-bold text-zinc-900 pt-2 border-t border-[#E8E2D5]">
              <span>{order.paymentMethod === 'cod' ? 'Total (Due on Delivery)' : 'Total Paid'}</span>
              <span className="text-[#4A0E17]">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-[#E8E2D5]/70 text-xs text-zinc-500">
            <p className="font-bold text-zinc-900 mb-1">Shipping To:</p>
            <p>{order.shippingAddress.fullName}</p>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A0E17] hover:bg-[#5E141F] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md border border-[#7A1D2A]"
          >
            <Package className="w-4 h-4" /> View Order Details
          </Link>
        )}
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#E8E2D5] bg-[#FAF7F2] text-zinc-800 hover:text-[#4A0E17] hover:border-[#4A0E17] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Home className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-20 text-center text-zinc-400">Loading order status...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
