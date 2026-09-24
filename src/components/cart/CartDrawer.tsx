'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                Your Shopping Bag
              </h2>
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1.5 font-medium">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-zinc-900 dark:text-zinc-100">{formatCurrency(remainingForFreeShipping)}</strong> for free shipping
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ You have unlocked Free Shipping!
                </span>
              )}
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-zinc-900 dark:bg-zinc-100 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                  Explore our curated seasonal collections and find your everyday essentials.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id || item.sku} className="py-4 flex gap-4">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item._id!)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 space-y-0.5">
                          {Object.entries(item.attributes)
                            .filter(([key]) => key !== 'colorHex' && key !== '_id')
                            .map(([k, v]) => (
                              <div key={k} className="flex items-center gap-1">
                                <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                                  {k === 'neckDesign' ? 'Neck' : k}:
                                </span>
                                <span>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                              </div>
                            ))}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md">
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Shipping, taxes, and promotional discounts calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 py-3 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  View Bag
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Checkout Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
