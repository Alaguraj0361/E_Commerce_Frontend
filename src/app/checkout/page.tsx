'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, appliedCoupon, getSubtotal, getDiscount, getShippingFee, getTax, getTotal, clearCart } =
    useCartStore();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: 'Flat 402, Signature Towers, Indiranagar',
    addressLine2: '100 Feet Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Add some items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to secure your order');
      router.push('/login?redirect=/checkout');
      return;
    }

    setIsLoading(true);

    try {
      const checkoutItems = items.map((i) => ({
        productId: typeof i.product === 'object' ? (i.product as any)._id : i.product,
        variantId: i.variantId,
        quantity: i.quantity,
      }));

      const res = await api.post('/payments/create-checkout-session', {
        items: checkoutItems,
        shippingAddress,
        couponCode: appliedCoupon?.code,
      });

      if (res.data?.success && res.data.data) {
        const { url, isTestMode, orderId } = res.data.data;

        if (isTestMode || !url) {
          // Test mode bypass
          clearCart();
          toast.success('Order placed successfully (Test Mode)');
          router.push(`/checkout/success?order_id=${orderId}`);
        } else {
          // Redirect to real Stripe Checkout page
          window.location.href = url;
        }
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Checkout failed. Please review your address and items.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
        <Link href="/cart" className="hover:text-zinc-900">
          Shopping Bag
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Address & Payment Info */}
        <form onSubmit={handleProcessCheckout} className="lg:col-span-7 space-y-8">
          {/* User Status Notice */}
          {!isAuthenticated && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200 font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <span>Have an account? Sign in for faster checkout and order tracking.</span>
              </div>
              <Link
                href="/login?redirect=/checkout"
                className="text-xs font-bold text-zinc-900 dark:text-white underline whitespace-nowrap ml-4"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* 1. Shipping Address */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Mobile Number (+91)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={shippingAddress.phone.replace(/^\+91\s*/, '')}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: `+91 ${e.target.value.replace(/[^\d\s]/g, '')}`,
                      })
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-12 pr-3 py-3 text-sm focus:outline-none focus:border-zinc-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  required
                  readOnly
                  value="India"
                  className="w-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Address Line 1"
                  value={shippingAddress.addressLine1}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 mb-2"
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, unit (optional)"
                  value={shippingAddress.addressLine2}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  State / Union Territory
                </label>
                <select
                  required
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                >
                  <option value="">Select State...</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  PIN Code (6 digits)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="e.g. 560038"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value.replace(/[^\d]/g, '').slice(0, 6),
                    })
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Method */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Shipping Method
              </h2>
            </div>

            <div className="p-4 border-2 border-zinc-900 dark:border-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    All-India Express Delivery
                  </h4>
                  <p className="text-xs text-zinc-500">2–4 business days across India with real-time tracking</p>
                </div>
              </div>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
              </span>
            </div>
          </div>

          {/* 3. Secure Stripe Payment */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Payment Verification
              </h2>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl flex items-center justify-between border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    Stripe Secure Checkout
                  </h4>
                  <p className="text-xs text-zinc-500">Credit Card, Apple Pay, Google Pay</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Securing Order...
                </>
              ) : (
                <>
                  PAY {formatCurrency(total)} WITH STRIPE <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right: Order Review Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Order Review ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            {/* Item Thumbnails */}
            <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800 pr-1">
              {items.map((item) => (
                <div key={item._id || item.sku} className="pt-4 first:pt-0 flex items-center gap-4">
                  <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-1 right-1 bg-zinc-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {item.name}
                    </h4>
                    {item.attributes && (
                      <p className="text-[11px] text-zinc-400 truncate">
                        {Object.entries(item.attributes)
                          .filter(([k]) => k !== 'colorHex')
                          .map(([_, v]) => v)
                          .join(' • ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>GST (18% Integrated Tax)</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Grand Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Full buyer protection and 30-day effortless returns policy.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
