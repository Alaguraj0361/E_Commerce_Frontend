'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    const success = await applyCoupon(couponCode.trim());
    setIsApplying(false);
    if (success) {
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
          You have no items in your cart. Discover our newest releases and curated essentials.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-lg"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
        Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item) => (
            <div key={item._id || item.sku} className="py-6 flex gap-6">
              {/* Product Thumbnail */}
              <div className="relative w-24 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                <Image
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details & Controls */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item._id!)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {Object.entries(item.attributes)
                        .filter(([key]) => key !== 'colorHex')
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' • ')}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl p-1 bg-white dark:bg-zinc-900">
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-rose-500 p-1"
                    aria-label="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-zinc-900"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {isApplying ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Try codes: <span className="font-mono font-semibold text-zinc-600 dark:text-zinc-300">WELCOME10</span> or <span className="font-mono font-semibold text-zinc-600 dark:text-zinc-300">SUMMER50</span>
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated Shipping</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>GST (18% Integrated Tax)</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(tax)}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 shadow-xl transition-all hover:scale-[1.02]"
            >
              PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted 256-bit Stripe checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
