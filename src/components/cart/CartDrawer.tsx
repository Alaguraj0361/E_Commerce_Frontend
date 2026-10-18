'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import { LotusIcon } from '../ui/BrandLogo';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col animate-slide-up border-l border-[#E8E2D5]">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#E8E2D5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A0E17]/10 flex items-center justify-center text-[#4A0E17]">
                <LotusIcon className="w-4 h-4 text-[#4A0E17]" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-zinc-900 leading-tight">
                  Your Shopping Bag
                </h2>
                <p className="text-[10px] text-zinc-500 font-light">Handcrafted Indian Couture</p>
              </div>
              <span className="bg-[#4A0E17] text-white text-[11px] px-2 py-0.5 rounded-full font-bold ml-1">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF7F2] p-4 border-b border-[#E8E2D5]">
            <div className="flex justify-between text-xs text-zinc-600 mb-1.5 font-medium">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#4A0E17] font-bold">{formatCurrency(remainingForFreeShipping)}</strong> for Free Express Delivery
                </span>
              ) : (
                <span className="text-[#4A0E17] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>You've Unlocked Free Royal Delivery!</span>
                </span>
              )}
              <span className="font-semibold text-zinc-700">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-[#E8E2D5] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#4A0E17] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-[#E8E2D5] bg-[#FAF7F2]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-[#4A0E17] mb-4 shadow-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-lg text-zinc-900 mb-1">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6 font-light leading-relaxed">
                  Discover our pure silk sarees, festive partywear, and handcrafted bridal collections.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-[#4A0E17] hover:bg-[#5E141F] text-white px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md"
                >
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id || item.sku} className="py-4 flex gap-3.5">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white border border-[#E8E2D5] shrink-0 shadow-xs">
                    <Image
                      src={item.image || '/images/bestsellers/traditional_silk_saree.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif font-medium text-xs sm:text-sm text-zinc-900 hover:text-[#4A0E17] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item._id!)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="text-[10px] text-zinc-500 mt-1 space-y-0.5">
                          {Object.entries(item.attributes)
                            .filter(([key]) => key !== 'colorHex' && key !== '_id')
                            .map(([k, v]) => (
                              <div key={k} className="flex items-center gap-1">
                                <span className="font-semibold capitalize text-zinc-700">
                                  {k === 'neckDesign' ? 'Neck' : k}:
                                </span>
                                <span>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                              </div>
                            ))}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E8E2D5] bg-white rounded-full overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                          className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#4A0E17]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#E8E2D5] bg-white space-y-3.5 shadow-lg">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-zinc-600 font-serif">Subtotal</span>
                <span className="text-lg font-serif font-bold text-zinc-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-light">
                Shipping, taxes, and festive coupon codes applied at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center border border-[#E8E2D5] bg-[#FAF7F2] text-zinc-800 py-2.5 sm:py-3 rounded-full text-xs font-semibold hover:border-[#4A0E17] hover:text-[#4A0E17] transition-colors"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center bg-[#4A0E17] hover:bg-[#5E141F] text-white py-2.5 sm:py-3 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md gap-1 group"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 pt-1 border-t border-[#E8E2D5]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Authentic Handloom • Insured Pan-India Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
