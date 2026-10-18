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
  Sparkles,
  Truck,
  RotateCcw,
  Gift,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency } from '../../lib/utils';
import { LotusIcon } from '../../components/ui/BrandLogo';
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
      <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
        {/* Empty State Hero */}
        <section className="relative overflow-hidden bg-[#4A0E17] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#5E141F] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Your Couture Bag is Empty
            </h1>
            <p className="text-xs sm:text-sm text-zinc-200 font-light max-w-md mx-auto leading-relaxed">
              You have no garments reserved in your shopping bag. Discover our newest handwoven silks, festive sarees, and royal wedding attire.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Value badges below empty cart */}
        <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs text-center space-y-2">
            <Truck className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h4 className="font-serif font-bold text-sm text-zinc-900">Free Express Shipping</h4>
            <p className="text-[11px] text-zinc-500 font-light">On all orders above ₹1,499</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs text-center space-y-2">
            <RotateCcw className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h4 className="font-serif font-bold text-sm text-zinc-900">7-Day Easy Returns</h4>
            <p className="text-[11px] text-zinc-500 font-light">Doorstep reverse pickup</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] mx-auto" />
            <h4 className="font-serif font-bold text-sm text-zinc-900">100% Authentic Handloom</h4>
            <p className="text-[11px] text-zinc-500 font-light">Pure silk mark certified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#4A0E17] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Reserved Ensembles</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Your Shopping Bag
          </h1>

          <p className="text-xs sm:text-sm text-zinc-200 font-light max-w-xl mx-auto leading-relaxed">
            Review your selected handcrafted couture pieces before proceeding to insured royal dispatch.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:underline text-zinc-200">Home</Link>
            <span className="text-white/50">/</span>
            <Link href="/shop" className="hover:underline text-zinc-200">Shop</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN BAG CONTENT */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-sm divide-y divide-[#E8E2D5]/70">
              {items.map((item) => (
                <div key={item._id || item.sku} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                  {/* Product Thumbnail */}
                  <div className="relative w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-[#E8E2D5]">
                    <Image
                      src={
                        item.image ||
                        '/images/bestsellers/traditional_silk_saree.jpg'
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        {(() => {
                          const itemSlug = item.slug || (typeof item.product === 'object' && item.product ? item.product.slug : item.product);
                          return (
                            <Link href={itemSlug ? `/product/${itemSlug}` : '/shop'}>
                              <h3 className="font-serif font-bold text-base text-zinc-900 hover:text-[#4A0E17] transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          );
                        })()}
                        <button
                          onClick={() => removeItem(item._id!)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-zinc-500">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 capitalize font-medium"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#E8E2D5] rounded-full overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item._id!, Math.max(1, item.quantity - 1))}
                          className="p-1.5 px-3 text-zinc-600 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                          className="p-1.5 px-3 text-zinc-600 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-serif text-base font-bold text-[#4A0E17]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-zinc-400">
                            {formatCurrency(item.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Shopping Link */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A0E17] hover:underline"
              >
                ← Continue Exploring Collections
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-lg space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-bold text-zinc-900">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#4A0E17]/5 border border-[#4A0E17]/20 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-[#4A0E17] font-semibold">
                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Code {appliedCoupon.code} Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-rose-500 p-1 cursor-pointer"
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
                      placeholder="Coupon Code"
                      className="flex-1 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-[#4A0E17] hover:bg-[#5E141F] text-white border border-[#7A1D2A] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-zinc-400">
                  Try coupon: <span className="font-mono font-bold text-[#4A0E17]">WELCOME10</span> (10% OFF)
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#E8E2D5]/70 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-rose-700 font-semibold">
                    <span>Special Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Integrated GST (Included)</span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-zinc-900 pt-3 border-t border-[#E8E2D5]">
                  <span>Total Amount</span>
                  <span className="text-[#4A0E17]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full bg-[#4A0E17] hover:bg-[#5E141F] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.01] border border-[#7A1D2A]"
              >
                PROCEED TO SECURE CHECKOUT <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>256-Bit SSL Encrypted Royal Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
