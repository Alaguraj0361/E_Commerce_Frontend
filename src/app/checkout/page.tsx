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
  ArrowRight,
  Loader2,
  AlertCircle,
  QrCode,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, resolveMediaUrl } from '../../lib/utils';
import { loadRazorpayScript } from '../../lib/razorpay';
import { RazorpayTestModal } from '../../components/checkout/RazorpayTestModal';
import { LotusIcon, NalmaraEmblem } from '../../components/ui/BrandLogo';
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
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Tamil Nadu',
    postalCode: '',
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

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'stripe'>('razorpay');
  const [razorpaySimulator, setRazorpaySimulator] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  } | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FDF6EC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-10 rounded-3xl border-2 border-[#D4AF37]/80 text-center space-y-4 shadow-xl">
          <NalmaraEmblem className="w-12 h-12 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-[#280619]">
            Your Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D1E]">
            Add your favorite sarees and couture ensembles to your bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] shadow-md"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shippingFee = getShippingFee();
  const tax = getTax();
  const total = getTotal();

  const handleSimulatorSuccess = async () => {
    if (!razorpaySimulator) return;
    try {
      const verifyRes = await api.post('/payments/razorpay/verify-payment', {
        orderId: razorpaySimulator.orderId,
        razorpayOrderId: razorpaySimulator.razorpayOrderId,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: 'sig_test_verified',
      });

      if (verifyRes.data?.success) {
        clearCart();
        setRazorpaySimulator(null);
        toast.success('Payment verified! Your order has been placed.');
        router.push(`/checkout/success?order_id=${razorpaySimulator.orderId}&method=upi`);
      }
    } catch {
      toast.error('Payment verification failed. Please try again.');
    }
  };

  const handleSimulatorFailure = (reason?: string) => {
    setRazorpaySimulator(null);
    setIsLoading(false);
    toast.error(reason || 'Payment failed or declined. Your cart items are saved.');
  };

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
        productId: i.product && typeof i.product === 'object' ? (i.product as any)._id : i.product,
        variantId: i.variantId,
        quantity: i.quantity,
      }));

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

      if (paymentMethod === 'razorpay') {
        const res = await api.post('/payments/razorpay/create-order', {
          items: checkoutItems,
          shippingAddress,
          couponCode: appliedCoupon?.code,
        });

        if (res.data?.success && res.data.data) {
          const { orderId, orderNumber, razorpayOrderId, amount, currency, keyId, customer } =
            res.data.data;

          const isRealKey = Boolean(
            keyId &&
              !keyId.includes('placeholder') &&
              (keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_'))
          );

          if (isRealKey) {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
              toast.error('Payment gateway script failed to load. Please check your internet connection.');
              setIsLoading(false);
              return;
            }

            const options = {
              key: keyId,
              amount,
              currency: currency || 'INR',
              name: 'NALMARA FASHION • Luxury Ethnic Wear',
              description: `Order #${orderNumber}`,
              image: typeof window !== 'undefined' ? `${window.location.origin}/images/nalmara-logo.jpg` : undefined,
              order_id: razorpayOrderId,
              prefill: {
                name: customer?.name || shippingAddress.fullName,
                email: customer?.email,
                contact: customer?.phone || shippingAddress.phone,
                method: 'upi',
              },
              theme: {
                color: '#D4AF37',
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
                } catch {
                  toast.error('Payment verification failed. Please contact support.');
                  setIsLoading(false);
                }
              },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
              toast.error(
                response.error?.description ||
                  response.error?.reason ||
                  'Payment was declined or failed. Please try again.'
              );
              setIsLoading(false);
            });
            rzp.open();
            return;
          }

          setRazorpaySimulator({
            isOpen: true,
            orderId,
            orderNumber,
            razorpayOrderId,
            amount,
            currency: currency || 'INR',
          });
          setIsLoading(false);
        }
        return;
      }

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
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B]">
      {/* 1. ROYAL PALACE HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280619] via-[#3D0829] to-[#280619] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/45 bg-[#220415]/65 p-6 sm:p-10 text-center space-y-3">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Safe &amp; Fast Checkout • Thoothukudi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Complete Your{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Order
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#FAF0DD]/85 font-light max-w-xl mx-auto leading-relaxed">
            Fast 1–3 day delivery across Tamil Nadu &amp; India directly from our Thoothukudi store.
          </p>

          <div className="pt-1 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#FAF0DD]/75">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <Link href="/cart" className="hover:text-[#FFE59E] text-[#FAF0DD]/75">Shopping Bag</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Checkout</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left: Address & Payment Info */}
          <form onSubmit={handleProcessCheckout} className="lg:col-span-7 space-y-7">
            {/* User Status Notice */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-[#FFFDF9] to-[#FAF0DD] border-2 border-[#D4AF37]/75 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 text-xs text-[#280619] font-semibold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#8C5818]" />
                  <span>Have an account? Sign in for faster checkout and easy order tracking.</span>
                </div>
                <Link
                  href="/login?redirect=/checkout"
                  className="self-start sm:self-auto text-xs font-extrabold text-[#FFE59E] bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* 1. Shipping Address Card */}
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/75 space-y-5 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
              <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 pb-3 border-b border-[#D4AF37]/35">
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center text-xs font-extrabold">
                  1
                </div>
                <h2 className="text-lg font-bold font-serif text-[#280619]">
                  Delivery Address
                </h2>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter recipient full name"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    Mobile Number (+91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8C5818]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={shippingAddress.phone.replace(/^\+91\s*/, '')}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: `+91 ${e.target.value.replace(/[^\d\s]/g, '')}`,
                        })
                      }
                      className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl pl-12 pr-3 py-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value="India"
                    className="w-full bg-[#EED9BA]/60 border border-[#D4AF37]/45 rounded-xl p-3 text-sm font-bold text-[#5C3D1E] cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat No., Street Name, Area"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, landmark (optional)"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thoothukudi, Chennai, Madurai"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    State / Union Territory
                  </label>
                  <select
                    required
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                  <label className="block font-extrabold uppercase tracking-wider text-[#5C3D1E] mb-1.5">
                    PIN Code (6 digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="e.g. 628001"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value.replace(/[^\d]/g, '').slice(0, 6),
                      })
                    }
                    className="w-full bg-[#FFFDF9] border border-[#D4AF37]/65 rounded-xl p-3 text-sm text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Method Card */}
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/75 space-y-4 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
              <div className="flex items-center gap-3 pb-3 border-b border-[#D4AF37]/35">
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center text-xs font-extrabold">
                  2
                </div>
                <h2 className="text-lg font-serif font-bold text-[#280619]">
                  Insured Dispatch Method
                </h2>
              </div>

              <div className="p-4 border-2 border-[#D4AF37] bg-[#FFFDF9] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#8C5818]" />
                  <div>
                    <h4 className="font-bold text-sm text-[#280619]">
                      All-India Insured Express Delivery
                    </h4>
                    <p className="text-xs text-[#5C3D1E]">
                      1–3 business days in Tamil Nadu (3–5 days across India) with real-time tracking
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-emerald-800">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                </span>
              </div>
            </div>

            {/* 3. Payment Method Selection Card */}
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/75 space-y-5 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/35">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center text-xs font-extrabold">
                    3
                  </div>
                  <h2 className="text-lg font-serif font-bold text-[#280619]">
                    Select Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#280619] font-bold bg-[#FFE59E]/50 px-3 py-1 rounded-full border border-[#D4AF37]">
                  <Lock className="w-3 h-3 text-[#8C5818]" /> 256-Bit SSL
                </div>
              </div>

              <div className="space-y-3">
                {/* Option 1: Razorpay UPI, Cards, NetBanking */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#D4AF37] bg-[#FFFDF9] shadow-md ring-2 ring-[#D4AF37]/30'
                      : 'border-[#D4AF37]/35 bg-[#FFFDF9]/60 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'razorpay'
                            ? 'border-[#D4AF37] bg-[#380725]'
                            : 'border-[#8C5818]'
                        }`}
                      >
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2 h-2 rounded-full bg-[#FFE59E]" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#280619]">
                            UPI & Instant Online Payment
                          </h4>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] px-2.5 py-0.5 rounded-full">
                            ⚡ Instant 0% Fee
                          </span>
                        </div>
                        <p className="text-xs text-[#5C3D1E] mt-1">
                          Google Pay, PhonePe, Paytm, CRED, any UPI ID, QR Code scan, RuPay/Cards & Net Banking.
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF0DD] text-[#280619] border border-[#D4AF37]/50 flex items-center gap-1">
                            <Smartphone className="w-2.5 h-2.5 text-[#8C5818]" /> GPay / PhonePe / Paytm
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF0DD] text-[#280619] border border-[#D4AF37]/50 flex items-center gap-1">
                            <QrCode className="w-2.5 h-2.5 text-[#8C5818]" /> Scan QR
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF0DD] text-[#280619] border border-[#D4AF37]/50">
                            Cards & Net Banking
                          </span>
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#8C5818] shrink-0" />
                  </div>
                </div>

                {/* Option 2: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#D4AF37] bg-[#FFFDF9] shadow-md ring-2 ring-[#D4AF37]/30'
                      : 'border-[#D4AF37]/35 bg-[#FFFDF9]/60 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          paymentMethod === 'cod'
                            ? 'border-[#D4AF37] bg-[#380725]'
                            : 'border-[#8C5818]'
                        }`}
                      >
                        {paymentMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-[#FFE59E]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#280619]">
                            Cash on Delivery (COD)
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF0DD] text-[#8C5818] border border-[#D4AF37]/50 px-2 py-0.5 rounded-full">
                            Pay at Doorstep
                          </span>
                        </div>
                        <p className="text-xs text-[#5C3D1E] mt-1">
                          Pay with cash or scan the courier partner&apos;s UPI QR code upon arrival at your doorstep.
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-[#8C5818] shrink-0" />
                  </div>
                </div>

                {/* Option 3: International Cards / Stripe */}
                <div
                  onClick={() => setPaymentMethod('stripe')}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-[#D4AF37] bg-[#FFFDF9] shadow-md'
                      : 'border-[#D4AF37]/35 bg-[#FFFDF9]/60 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentMethod === 'stripe'
                            ? 'border-[#D4AF37] bg-[#380725]'
                            : 'border-[#8C5818]'
                        }`}
                      >
                        {paymentMethod === 'stripe' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FFE59E]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#280619]">
                          International Card (Stripe Global)
                        </h4>
                        <p className="text-[11px] text-[#5C3D1E]">
                          For non-INR overseas credit cards
                        </p>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-[#8C5818]" />
                  </div>
                </div>
              </div>

              {/* Action Submit Button (3D Liquid 24K Gold Foil) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] py-4 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-[0_14px_34px_rgba(212,175,55,0.45)] disabled:opacity-50 mt-4 group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#280619]" /> Processing Royal Order...
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
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/80 space-y-6 sticky top-28 shadow-[0_20px_50px_rgba(56,7,37,0.12)]">
              <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/30 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#D4AF37]/40">
                <h2 className="text-lg font-serif font-bold text-[#280619]">
                  Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
                <LotusIcon className="w-5 h-4 text-[#8C5818]" />
              </div>

              {/* Item Thumbnails */}
              <div className="relative z-10 space-y-4 max-h-80 overflow-y-auto divide-y divide-[#D4AF37]/30 pr-1">
                {items.map((item) => {
                  const imgSrc = resolveMediaUrl(item.image, '/images/nalmara/hd/cat_sarees_hd.jpg');
                  return (
                    <div key={item._id || item.sku} className="pt-4 first:pt-0 flex items-center gap-4">
                      <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37] flex-shrink-0">
                        <Image
                          src={imgSrc}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                        <span className="absolute top-1 right-1 bg-[#380725] text-[#FFE59E] border border-[#D4AF37] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-[#280619] truncate">
                          {item.name}
                        </h4>
                        {item.attributes && (
                          <p className="text-[11px] text-[#5C3D1E] truncate">
                            {Object.entries(item.attributes)
                              .filter(([k]) => k !== 'colorHex')
                              .map(([, v]) => v)
                              .join(' • ')}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-serif font-extrabold text-[#280619]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Summary */}
              <div className="relative z-10 space-y-2.5 pt-4 border-t border-[#D4AF37]/40 text-xs">
                <div className="flex justify-between text-[#5C3D1E]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#280619]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C3D1E]">
                  <span>Insured Shipping</span>
                  <span className="font-bold text-emerald-800">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5C3D1E]">
                  <span>GST (5% Integrated Tax)</span>
                  <span className="font-bold text-[#280619]">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-extrabold text-[#280619] pt-3 border-t border-[#D4AF37]/50">
                  <span>Grand Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#5C3D1E] font-medium pt-2">
                <ShieldCheck className="w-4 h-4 text-[#8C5818] flex-shrink-0" />
                <span>Full buyer protection and 7-day effortless exchange policy.</span>
              </div>
            </div>
          </div>
        </div>

        {razorpaySimulator && (
          <RazorpayTestModal
            isOpen={razorpaySimulator.isOpen}
            orderNumber={razorpaySimulator.orderNumber}
            amount={razorpaySimulator.amount}
            currency={razorpaySimulator.currency}
            onSuccess={handleSimulatorSuccess}
            onFailure={handleSimulatorFailure}
            onClose={() => {
              setRazorpaySimulator(null);
              setIsLoading(false);
              toast.info('Payment window closed. Your items remain saved in cart.');
            }}
          />
        )}
      </div>
    </div>
  );
}
