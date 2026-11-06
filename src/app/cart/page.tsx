'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, resolveMediaUrl } from '../../lib/utils';
import { LotusIcon, NalmaraEmblem } from '../../components/ui/BrandLogo';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getTax,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
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

    try {
      setIsApplying(true);
      const ok = await applyCoupon(couponCode.trim());
      if (ok) {
        setCouponCode('');
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#FDF6EC] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative max-w-md w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-10 rounded-3xl border-2 border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(56,7,37,0.12)] space-y-5">
          <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/30 pointer-events-none" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] mx-auto shadow-lg">
            <ShoppingBag className="w-9 h-9 text-[#FFE59E]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#280619]">
            Your Royal Bag is{' '}
            <span className="font-script italic font-normal text-3xl sm:text-4xl text-[#5B0E3D]">
              Empty
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C3D1E] font-normal leading-relaxed">
            Explore our pure Kanchipuram silk sarees, soft cotton drapes, and festive family collections crafted with authentic Zari.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] transition-all shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:scale-[1.02]"
          >
            Explore Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] pb-20">
      {/* 1. ROYAL PALACE HEADER BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280619] via-[#3D0829] to-[#280619] text-white py-10 sm:py-14 px-4 border-b-2 border-[#D4AF37] shadow-lg">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/45 bg-[#220415]/65 p-6 sm:p-8 text-center space-y-2.5">
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>NALMARA FASHION • THOOTHUKUDI</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFDF9]">
            Your Shopping{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Bag
            </span>
          </h1>
          <p className="text-xs text-[#FAF0DD]/85 font-light">
            Check your selected sarees and dresses and apply discount codes before checkout.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-4">
              {items.map((item) => {
                const imgSrc = resolveMediaUrl(item.image, '/images/nalmara/hd/cat_sarees_hd.jpg');
                return (
                  <div
                    key={item._id || item.sku}
                    className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-4 sm:p-6 rounded-2xl border-2 border-[#D4AF37]/75 flex flex-col sm:flex-row gap-5 shadow-[0_10px_28px_rgba(56,7,37,0.08)]"
                  >
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />

                    {/* Product Image */}
                    <div className="relative w-full sm:w-28 h-36 rounded-xl overflow-hidden bg-[#280619] border-2 border-[#D4AF37]/75 shrink-0 shadow-sm">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link href={item.slug ? `/product/${item.slug}` : '/shop'}>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-[#280619] hover:text-[#5B0E3D] transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeItem(item._id!)}
                            className="text-[#8C7A65] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1.5 text-[11px]">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/60 text-[#280619] capitalize font-semibold"
                              >
                                {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/30">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-[#D4AF37]/75 rounded-full overflow-hidden bg-[#FFFDF9] shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item._id!, Math.max(1, item.quantity - 1))}
                            className="p-1.5 px-3 text-[#280619] hover:bg-[#FAF0DD] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-extrabold text-[#280619]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                            className="p-1.5 px-3 text-[#280619] hover:bg-[#FAF0DD] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-serif text-lg font-extrabold text-[#280619]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-[#5C3D1E] font-medium">
                              {formatCurrency(item.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Shopping Link */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#380725] hover:text-[#8C5818] transition-colors"
              >
                ← Continue Exploring Royal Collections
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar (Royal Silk Cream & 24K Gold Plaque) */}
          <div className="lg:col-span-4">
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(56,7,37,0.12)] space-y-6 sticky top-28">
              <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/30 pointer-events-none" />
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-[#D4AF37]/40 pb-3">
                <h2 className="font-serif text-xl font-bold text-[#280619]">
                  Order Summary
                </h2>
                <LotusIcon className="w-5 h-4 text-[#8C5818]" />
              </div>

              {/* Coupon Code Input */}
              <div className="relative z-10 space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] p-3 rounded-xl text-xs text-[#FFE59E]">
                    <div className="flex items-center gap-2 font-bold">
                      <Tag className="w-3.5 h-3.5 text-[#FFE59E]" />
                      <span>Code {appliedCoupon.code} Applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#FFE59E]/75 hover:text-rose-400 p-1 cursor-pointer"
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
                      placeholder="Privilege Code"
                      className="flex-1 bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl px-3.5 py-2 text-xs uppercase font-mono font-bold tracking-wider text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border border-[#D4AF37] px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="relative z-10 space-y-3 pt-4 border-t border-[#D4AF37]/40 text-xs">
                <div className="flex justify-between text-[#5C3D1E]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#280619]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Privilege Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5C3D1E]">
                  <span>Insured Express Shipping</span>
                  <span className="font-bold text-emerald-800">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-[#5C3D1E]">
                  <span>Integrated GST (Included)</span>
                  <span className="font-bold text-[#280619]">
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-serif font-extrabold text-[#280619] pt-3 border-t border-[#D4AF37]/50">
                  <span>Total Payable</span>
                  <span className="text-lg text-[#280619]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout CTA (3D Liquid 24K Gold Foil) */}
              <Link
                href="/checkout"
                className="relative z-10 w-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] py-4 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(212,175,55,0.45)] transition-all hover:scale-[1.01]"
              >
                PROCEED TO ROYAL CHECKOUT <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] text-[#5C3D1E] font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-[#8C5818]" />
                <span>256-Bit SSL Encrypted • 100% Authentic Loom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
