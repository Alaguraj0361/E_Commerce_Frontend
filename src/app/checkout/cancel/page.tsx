'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

function OrderCancelContent() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-flex p-4 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
        <XCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Checkout Was Not Completed
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Your payment was not processed and your account has not been charged. Your selected items remain saved in your shopping bag.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Link
          href="/cart"
          className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Return to Cart
        </Link>
        <Link
          href="/shop"
          className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 py-3.5 rounded-full text-xs font-semibold hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Browsing
        </Link>
      </div>
    </div>
  );
}

export default function OrderCancelPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-zinc-400">Loading...</div>}>
      <OrderCancelContent />
    </Suspense>
  );
}
