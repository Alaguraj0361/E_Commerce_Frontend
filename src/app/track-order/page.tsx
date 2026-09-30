'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Phone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { LotusIcon } from '@/components/ui/BrandLogo';
import { useAuthStore } from '@/store/authStore';

const TRACKING_STEPS = [
  { label: 'Order Confirmed', key: 'Confirmed', desc: 'Order details verified & artisan allocation' },
  { label: 'Artisan Crafting', key: 'Processing', desc: 'Handloom inspection & tailoring' },
  { label: 'Packed & Sealed', key: 'Packed', desc: 'Insured royal packaging completed' },
  { label: 'Out for Transit', key: 'Shipped', desc: 'Dispatched with express courier' },
  { label: 'Delivered', key: 'Delivered', desc: 'Safely handed over to you' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id') || searchParams.get('orderNumber') || '';

  const { isAuthenticated } = useAuthStore();
  const [orderId, setOrderId] = useState(urlId);
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Fetch logged in user's orders to enable 1-click tracking
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setUserOrders(res.data.data);
        }
      } catch (err) {
        // Guest user or not logged in - ignore
      }
    };

    fetchUserOrders();
  }, [isAuthenticated]);

  // Execute tracking for a given identifier
  const performTrack = async (searchId: string) => {
    const cleanId = searchId.trim();
    if (!cleanId) {
      setError('Please enter your Order ID or Order Number');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    // 1. Check if order exists in user's loaded orders
    if (userOrders.length > 0) {
      const normalizedSearch = cleanId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const localMatch = userOrders.find((o) => {
        const normNum = (o.orderNumber || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const normId = (o._id || '').toLowerCase();
        return (
          normNum === normalizedSearch ||
          normId === cleanId.toLowerCase() ||
          (cleanId.length >= 4 && normNum.includes(normalizedSearch))
        );
      });

      if (localMatch) {
        setOrder(localMatch);
        setLoading(false);
        return;
      }
    }

    // 2. Fetch from backend API
    try {
      let res;
      try {
        res = await api.get(`/orders/track/${encodeURIComponent(cleanId)}`);
      } catch (e: any) {
        // Fallback to standard order endpoint if public track fails with 404
        res = await api.get(`/orders/${encodeURIComponent(cleanId)}`);
      }

      if (res?.data?.success && res.data.data) {
        setOrder(res.data.data);
      } else {
        const errorMsg =
          res?.data?.message ||
          `We could not find an order matching "${cleanId}". Please verify your Order ID (e.g. ORD-20260929-9377) from your order confirmation email or SMS.`;
        setError(errorMsg);
      }
    } catch (err: any) {
      console.warn('Track order lookup result:', err);
      const rawMsg =
        err.response?.data?.message ||
        err.customMessage ||
        '';

      if (rawMsg && !rawMsg.includes('Cast') && !rawMsg.includes('ObjectId') && !rawMsg.includes('Resource not found')) {
        setError(rawMsg);
      } else {
        setError(
          `We could not find an order matching "${cleanId}". Please verify your Order ID (e.g. ORD-20260929-9377) from your order confirmation email or SMS.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if URL parameter provided
  useEffect(() => {
    if (urlId) {
      setOrderId(urlId);
      performTrack(urlId);
    }
  }, [urlId]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(orderId);
  };

  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'packed':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Shipment Intelligence</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Track Your Royal Order
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Follow the journey of your handcrafted couture from our atelier looms to your door.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Track Order</span>
          </div>
        </div>
      </section>

      {/* 2. TRACKING INPUT CARD */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl space-y-6">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Order ID or Order Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-20260929-9377"
                    className="w-full bg-[#FAF8F5] text-zinc-900 placeholder:text-zinc-400 text-xs px-4 py-3 pl-10 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email or Mobile (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-[#FAF8F5] text-zinc-900 placeholder:text-zinc-400 text-xs px-4 py-3 pl-10 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#061811] hover:bg-[#0E3324] text-[#E5C07B] border border-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5C07B]" />
                  Locating Royal Shipment...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#E5C07B]" />
                  Track Order Status
                </>
              )}
            </button>
          </form>

          {/* Quick Click-to-Track Section */}
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8860B] block">
              {userOrders.length > 0 ? 'Your Recent Orders (Click to track):' : 'Sample Orders (Click to preview live tracking):'}
            </span>
            <div className="flex flex-wrap gap-2">
              {userOrders.length > 0
                ? userOrders.slice(0, 4).map((uo) => (
                    <button
                      key={uo._id}
                      type="button"
                      onClick={() => {
                        setOrderId(uo.orderNumber || uo._id);
                        performTrack(uo.orderNumber || uo._id);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#0E3324]/10 hover:bg-[#0E3324] text-[#061811] hover:text-[#E5C07B] border border-[#D4AF37]/30 text-xs font-medium transition-all"
                    >
                      #{uo.orderNumber} ({uo.orderStatus})
                    </button>
                  ))
                : [
                    { num: 'ORD-20260929-9377', status: 'Confirmed' },
                    { num: 'ORD-20260929-9218', status: 'Confirmed' },
                    { num: 'ORD-20260929-1974', status: 'Confirmed' },
                  ].map((sample) => (
                    <button
                      key={sample.num}
                      type="button"
                      onClick={() => {
                        setOrderId(sample.num);
                        performTrack(sample.num);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#0E3324]/10 hover:bg-[#0E3324] text-[#061811] hover:text-[#E5C07B] border border-[#D4AF37]/30 text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#B8860B]" />
                      #{sample.num} ({sample.status})
                    </button>
                  ))}
            </div>
          </div>

          {/* Quick instructions / Help */}
          <div className="text-center pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
            <span>Where is my Order ID? Check your confirmation SMS or email invoice.</span>
            <Link href="/account/orders" className="text-[#B8860B] font-semibold hover:underline">
              View All Account Orders →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ERROR MESSAGE */}
      {error && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Unable to Locate Order</p>
              <p className="leading-relaxed text-zinc-700">{error}</p>
              <p className="text-[11px] text-zinc-500 pt-1">
                Need help? Contact our atelier concierge via{' '}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8860B] font-bold hover:underline"
                >
                  WhatsApp Concierge
                </a>{' '}
                or visit{' '}
                <Link href="/account/orders" className="text-[#B8860B] font-bold hover:underline">
                  My Orders
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 4. TRACKING RESULTS (If Found) */}
      {order && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
          {/* Order Header Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] block">
                  ORDER PARTICULARS
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#061811] mt-0.5">
                  Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0E3324] text-[#E5C07B] border border-[#D4AF37]/40">
                  {order.orderStatus}
                </span>
                <span className="text-sm font-serif font-bold text-[#061811]">
                  {formatCurrency(order.total || order.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="py-4">
              <div className="relative">
                {/* Progress bar line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-zinc-200">
                  <div
                    className="h-full bg-[#0E3324] transition-all duration-700"
                    style={{
                      width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md shrink-0 ${
                            isCompleted
                              ? 'bg-[#0E3324] text-[#E5C07B] border-2 border-[#D4AF37]'
                              : 'bg-white text-zinc-400 border-2 border-zinc-200'
                          } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30 scale-110' : ''}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#E5C07B]" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-serif font-bold ${
                              isCompleted ? 'text-[#061811]' : 'text-zinc-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-light leading-tight mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items in this Order */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-zinc-100 pt-6 space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#061811] uppercase tracking-wider">
                  Garments in this Consignment ({order.items.length})
                </h4>
                <div className="divide-y divide-zinc-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-zinc-400 m-auto mt-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{item.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#061811]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Destination */}
            {order.shippingAddress && (
              <div className="border-t border-zinc-100 pt-4 flex items-start gap-3 text-xs text-zinc-600">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#061811]">Delivery Destination: </strong>
                  {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{' '}
                  {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
                  {order.shippingAddress.postalCode}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. LIVE SUPPORT CALLOUT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 rounded-3xl bg-[#061811] text-white border border-[#D4AF37]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-serif text-xl font-bold text-[#E5C07B]">
              Need Urgent Courier Support?
            </h4>
            <p className="text-xs text-zinc-300 font-light max-w-md leading-relaxed">
              If your parcel has been in transit longer than expected, message our dispatch manager with your Order ID for real-time courier escalation.
            </p>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 text-xs font-bold uppercase tracking-wider shrink-0 transition-all shadow-md inline-flex items-center gap-2"
          >
            WhatsApp Support <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-zinc-400">Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
