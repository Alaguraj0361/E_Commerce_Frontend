'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, resolveMediaUrl } from '../../lib/utils';
import { NalmaraEmblem } from '../ui/BrandLogo';

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
        className="fixed inset-0 bg-[#1A0310]/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FDF6EC] shadow-2xl flex flex-col animate-slide-up border-l-2 border-[#D4AF37]">
          {/* Imperial Royal Plum & 24K Gold Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#280619] via-[#3D0829] to-[#280619] border-b-2 border-[#D4AF37] flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <NalmaraEmblem className="w-8 h-8" />
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-[#FFFDF9] leading-tight">
                  Your Royal Bag
                </h2>
                <p className="text-[10px] text-[#FFE59E]/85 uppercase tracking-widest">
                  Handcrafted Indian Couture
                </p>
              </div>
              <span className="bg-gradient-to-r from-[#FFF6D6] to-[#D4AF37] text-[#280619] text-[11px] px-2.5 py-0.5 rounded-full font-extrabold ml-1">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-[#380725] border border-[#D4AF37]/75 text-[#FFE59E] hover:bg-[#5B0E3D] transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF0DD] to-[#FFFDF9] p-4 border-b border-[#D4AF37]/45">
            <div className="flex justify-between text-xs text-[#4A2C2A] mb-1.5 font-semibold">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#280619] font-extrabold">{formatCurrency(remainingForFreeShipping)}</strong> for Free Express Delivery
                </span>
              ) : (
                <span className="text-[#280619] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C5818]" />
                  <span>You&apos;ve Unlocked Free Insured Royal Delivery!</span>
                </span>
              )}
              <span className="font-extrabold text-[#8C5818]">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-[#E8D5B5] h-2 rounded-full overflow-hidden border border-[#D4AF37]/40">
              <div
                className="bg-gradient-to-r from-[#380725] via-[#8C5818] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 bg-[#FDF6EC]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] mb-4 shadow-md">
                  <ShoppingBag className="w-7 h-7 text-[#FFE59E]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#280619] mb-1">
                  Your Royal Bag is Empty
                </h3>
                <p className="text-xs text-[#5C3D1E] max-w-xs mb-6 font-normal leading-relaxed">
                  Discover our pure silk sarees, festive partywear, and handcrafted bridal collections.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
                >
                  Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const imgSrc = resolveMediaUrl(item.image, '/images/nalmara/hd/cat_sarees_hd.jpg');
                return (
                  <div
                    key={item._id || item.sku}
                    className="p-3.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] border border-[#D4AF37]/65 flex gap-3.5 shadow-xs"
                  >
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37]/75 shrink-0 shadow-xs">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={item.slug ? `/product/${item.slug}` : '/shop'}
                            onClick={() => setIsCartOpen(false)}
                            className="font-serif font-bold text-xs sm:text-sm text-[#280619] hover:text-[#5B0E3D] transition-colors line-clamp-1"
                          >
                            {item.name}
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
                          <div className="text-[10px] text-[#5C3D1E] mt-1 space-y-0.5">
                            {Object.entries(item.attributes)
                              .filter(([key]) => key !== 'colorHex' && key !== '_id')
                              .map(([k, v]) => (
                                <div key={k} className="flex items-center gap-1">
                                  <span className="font-bold capitalize text-[#280619]">
                                    {k === 'neckDesign' ? 'Neck' : k}:
                                  </span>
                                  <span>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                                </div>
                              ))}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm font-extrabold text-[#280619] mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#D4AF37]/70 bg-[#FFFDF9] rounded-full overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 px-2.5 hover:bg-[#FAF0DD] text-[#280619] disabled:opacity-30 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-extrabold text-[#280619]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                            className="p-1 px-2.5 hover:bg-[#FAF0DD] text-[#280619] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-serif font-extrabold text-[#280619]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t-2 border-[#D4AF37]/80 bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] space-y-3.5 shadow-lg">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-[#5C3D1E] font-serif font-bold">Subtotal</span>
                <span className="text-lg font-serif font-extrabold text-[#280619]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#5C3D1E] font-normal">
                Shipping, GST, and privilege coupon codes applied at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center border-2 border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md gap-1 group"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#5C3D1E] font-semibold pt-2 border-t border-[#D4AF37]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C5818]" />
                <span>100% Authentic Handloom • Insured Pan-India Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
