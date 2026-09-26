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
  QrCode,
  Smartphone,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';
import { loadRazorpayScript } from '../../lib/razorpay';
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

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'stripe'>('razorpay');

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

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error('Please complete all required shipping address fields');
      return;
    }

    setIsLoading(true);

    try {
      const checkoutItems = items.map((i) => ({
        productId: typeof i.product === 'object' ? (i.product as any)._id : i.product,
        variantId: i.variantId,
        quantity: i.quantity,
      }));

      // 1. CASH ON DELIVERY (COD)
      if (paymentMethod === 'cod') {
        const res = await api.post('/payments/cod/create-order', {
          items: checkoutItems,
          shippingAddress,
          couponCode: appliedCoupon?.code,
        });

        if (res.data?.success && res.data.data) {
          clearCart();
          toast.success('Order placed successfully with Cash on Delivery!');
          router.push(`/checkout/success?order_id=${res.data.data.orderId}&method=cod`);
        }
        return;
      }

      // 2. RAZORPAY UPI & CARDS
      if (paymentMethod === 'razorpay') {
        const res = await api.post('/payments/razorpay/create-order', {
          items: checkoutItems,
          shippingAddress,
          couponCode: appliedCoupon?.code,
        });

        if (res.data?.success && res.data.data) {
          const { orderId, orderNumber, razorpayOrderId, amount, currency, keyId, isTestMode, customer } =
            res.data.data;

          // If in sandbox / placeholder test mode without live keys:
          if (isTestMode || keyId?.includes('placeholder')) {
            const verifyRes = await api.post('/payments/razorpay/verify-payment', {
              orderId,
              razorpayOrderId,
              razorpayPaymentId: `pay_test_${Date.now()}`,
              razorpaySignature: 'sig_test_verified',
            });

            if (verifyRes.data?.success) {
              clearCart();
              toast.success('UPI / Online Payment confirmed (Test Sandbox)');
              router.push(`/checkout/success?order_id=${orderId}&method=upi`);
            }
            return;
          }

          // Live Razorpay Checkout SDK
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            toast.error('Payment gateway script failed to load. Please check your internet connection.');
            return;
          }

          const options = {
            key: keyId,
            amount,
            currency: currency || 'INR',
            name: 'EFFIDOO • Luxury Ethnic Wear',
            description: `Order #${orderNumber}`,
            image: '/images/offers/arch_badge.svg',
            order_id: razorpayOrderId,
            prefill: {
              name: customer?.name || shippingAddress.fullName,
              email: customer?.email,
              contact: customer?.phone || shippingAddress.phone,
            },
            theme: {
              color: '#B8860B',
            },
            modal: {
              ondismiss: () => {
                toast.info('Payment window closed. Your items remain saved in cart.');
                setIsLoading(false);
              },
            },
            handler: async (response: any) => {
              try {
                const verifyRes = await api.post('/payments/razorpay/verify-payment', {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                if (verifyRes.data?.success) {
                  clearCart();
                  toast.success('Payment verified! Your order is placed.');
                  router.push(`/checkout/success?order_id=${orderId}&method=upi`);
                }
              } catch (verifyErr) {
                toast.error('Payment verification failed. Please contact support.');
              }
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
        return;
      }

      // 3. STRIPE GLOBAL CHECKOUT
      if (paymentMethod === 'stripe') {
        const res = await api.post('/payments/create-checkout-session', {
          items: checkoutItems,
          shippingAddress,
          couponCode: appliedCoupon?.code,
        });

        if (res.data?.success && res.data.data) {
          const { url, isTestMode, orderId } = res.data.data;

          if (isTestMode || !url) {
            clearCart();
            toast.success('Order placed successfully (Test Mode)');
            router.push(`/checkout/success?order_id=${orderId}`);
          } else {
            window.location.href = url;
          }
        }
        return;
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

          {/* 3. Payment Method Selection */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#B8860B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  3
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Select Payment Method
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Razorpay UPI, Cards, NetBanking */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#B8860B] bg-[#FAF8F5] dark:bg-amber-950/20 shadow-md ring-1 ring-[#B8860B]/30'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#B8860B] bg-[#B8860B]'
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          UPI & Instant Online Payment
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-2 py-0.5 rounded-full shadow-sm">
                          ⚡ Instant 0% Fee
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Google Pay, PhonePe, Paytm, CRED, any UPI ID, QR Code scan, RuPay/Cards & Net Banking.
                      </p>

                      {/* UPI & Payment Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" /> GPay
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EDE7F6] text-[#5E35B1] border border-[#D1C4E9] flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" /> PhonePe
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E1F5FE] text-[#0277BD] border border-[#B3E5FC] flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" /> Paytm
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2] flex items-center gap-1">
                          <QrCode className="w-2.5 h-2.5" /> Scan QR
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          RuPay / Cards
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          Net Banking
                        </span>
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#B8860B] shrink-0" />
                </div>
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#B8860B] bg-[#FAF8F5] dark:bg-amber-950/20 shadow-md ring-1 ring-[#B8860B]/30'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-[#B8860B] bg-[#B8860B]'
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          Cash on Delivery (COD)
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          Doorstep
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Pay with cash or scan the courier delivery partner's UPI QR code upon arrival at your doorstep.
                      </p>
                      {paymentMethod === 'cod' && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 font-medium bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                          ℹ️ Please keep exact cash or any UPI app ready during courier delivery.
                        </p>
                      )}
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              </div>

              {/* Option 3: International Cards / Stripe */}
              <div
                onClick={() => setPaymentMethod('stripe')}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-[#B8860B] bg-[#FAF8F5] dark:bg-amber-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'stripe' ? 'border-[#B8860B] bg-[#B8860B]' : 'border-zinc-300'
                      }`}
                    >
                      {paymentMethod === 'stripe' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                        International Card (Stripe Global)
                      </h4>
                      <p className="text-[11px] text-zinc-500">For non-INR overseas credit cards</p>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#18140B] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#B8860B] transition-all shadow-xl disabled:opacity-50 mt-4 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> Processing Order...
                </>
              ) : paymentMethod === 'cod' ? (
                <>
                  CONFIRM ORDER WITH COD ({formatCurrency(total)}) <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : paymentMethod === 'stripe' ? (
                <>
                  PAY {formatCurrency(total)} WITH STRIPE <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  PAY {formatCurrency(total)} VIA UPI / ONLINE <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
