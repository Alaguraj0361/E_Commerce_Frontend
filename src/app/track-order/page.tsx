'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  CheckCircle2,
  MapPin,
  AlertCircle,
  ArrowRight,
  Loader2,
  Phone,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { NalmaraEmblem } from '@/components/ui/BrandLogo';
import { useAuthStore } from '@/store/authStore';

const TRACKING_STEPS = [
  { label: 'Order Confirmed', key: 'Confirmed', desc: 'Order received at our Thoothukudi store' },
  { label: 'Quality Check', key: 'Processing', desc: 'Saree / dress checked & prepared' },
  { label: 'Packed in Gift Box', key: 'Packed', desc: 'Neatly packed & ready for courier' },
  { label: 'Shipped', key: 'Shipped', desc: 'Handed over to express courier' },
  { label: 'Delivered', key: 'Delivered', desc: 'Delivered safely to your address' },
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

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setUserOrders(res.data.data);
        }
      } catch {
        // Guest user
      }
    };

    fetchUserOrders();
  }, [isAuthenticated]);

  const performTrack = async (searchId: string) => {
    const cleanId = searchId.trim();
    if (!cleanId) {
      setError('Please enter your Order ID or Order Number');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

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

    try {
      let res;
      try {
        res = await api.get(`/orders/track/${encodeURIComponent(cleanId)}`);
      } catch {
        res = await api.get(`/orders/${encodeURIComponent(cleanId)}`);
      }

      if (res?.data?.success && res.data.data) {
        setOrder(res.data.data);
      } else {
        const errorMsg =
          res?.data?.message ||
          `We could not find an order matching "${cleanId}". Please verify your Order ID from your confirmation email or SMS.`;
        setError(errorMsg);
      }
    } catch (err: any) {
      const rawMsg = err.response?.data?.message || err.customMessage || '';
      if (rawMsg && !rawMsg.includes('Cast') && !rawMsg.includes('ObjectId') && !rawMsg.includes('Resource not found')) {
        setError(rawMsg);
      } else {
        setError(
          `We could not find an order matching "${cleanId}". Please verify your Order ID from your confirmation email or SMS.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO SECTION (Matching Home Page Look) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-8 sm:p-12 text-center space-y-4">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/75 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Nalmara Fashion • Thoothukudi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Track Your{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Order
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-xl mx-auto leading-relaxed">
            Enter your Order ID below to check live delivery status from our Thoothukudi store to your doorstep.
          </p>

          <div className="pt-1 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Track Order</span>
          </div>
        </div>
      </section>

      {/* 2. TRACKING INPUT CARD */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/75 shadow-[0_20px_50px_rgba(14,11,9,0.12)] space-y-6">
          <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
          <form onSubmit={handleTrackSubmit} className="relative z-10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0E0B09] mb-1.5">
                  Order ID or Order Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-[#8C6518] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-20260929-9377"
                    className="w-full bg-[#FFFDF9] text-[#0E0B09] placeholder:text-[#8C7A65] text-xs px-4 py-3 pl-10 rounded-xl border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0E0B09] mb-1.5">
                  Email or Mobile (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C6518] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-[#FFFDF9] text-[#0E0B09] placeholder:text-[#8C7A65] text-xs px-4 py-3 pl-10 rounded-xl border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.2em] transition-all shadow-[0_12px_28px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0E0B09]" />
                  Locating Royal Shipment...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#0E0B09]" />
                  Track Order Status
                </>
              )}
            </button>
          </form>

          {/* Quick Click-to-Track Section */}
          <div className="relative z-10 pt-3 border-t border-[#D4AF37]/35 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8C6518] block">
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
                      className="px-3.5 py-1.5 rounded-full bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37] text-xs font-bold transition-all cursor-pointer"
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
                      className="px-3.5 py-1.5 rounded-full bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37] text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      #{sample.num} ({sample.status})
                    </button>
                  ))}
            </div>
          </div>

          <div className="relative z-10 text-center pt-2 border-t border-[#D4AF37]/35 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C4934]">
            <span>Where is my Order ID? Check your confirmation SMS or email invoice.</span>
            <Link href="/account/orders" className="text-[#8C6518] font-extrabold hover:underline">
              View All Account Orders →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ERROR MESSAGE */}
      {error && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#D4AF37] text-[#0E0B09] text-xs flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#8C6518] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Unable to Locate Order</p>
              <p className="leading-relaxed text-[#5C4934]">{error}</p>
              <p className="text-[11px] text-[#6B5740] pt-1">
                Need help? Contact our atelier concierge via{' '}
                <a
                  href="https://wa.me/916383163609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8C6518] font-bold hover:underline"
                >
                  WhatsApp Concierge (6383163609 | 7871207631)
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 4. TRACKING RESULTS (If Found) */}
      {order && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/75 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/40 pb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6518] block">
                  ORDER PARTICULARS
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0E0B09] mt-0.5">
                  Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-xs text-[#6B5740] mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37]">
                  {order.orderStatus}
                </span>
                <span className="text-base font-serif font-extrabold text-[#0E0B09]">
                  {formatCurrency(order.total || order.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="py-4">
              <div className="relative">
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#E8DEC8]">
                  <div
                    className="h-full bg-gradient-to-r from-[#0E0B09] to-[#D4AF37] transition-all duration-700"
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
                              ? 'bg-[#0E0B09] text-[#FFE59E] border-2 border-[#D4AF37]'
                              : 'bg-[#FFFDF9] text-[#8C7A65] border-2 border-[#D4AF37]/40'
                          } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30 scale-110' : ''}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-serif font-bold ${
                              isCompleted ? 'text-[#0E0B09]' : 'text-[#8C7A65]'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-[#6B5740] font-light leading-tight mt-0.5">
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
              <div className="border-t border-[#D4AF37]/35 pt-6 space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#0E0B09] uppercase tracking-wider">
                  Garments in this Consignment ({order.items.length})
                </h4>
                <div className="divide-y divide-[#D4AF37]/30">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-xl bg-[#0E0B09] overflow-hidden shrink-0 border border-[#D4AF37]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-[#FFE59E] m-auto mt-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-serif font-bold text-[#0E0B09]">{item.name}</p>
                          <p className="text-[11px] text-[#6B5740]">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-serif font-extrabold text-[#0E0B09]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Destination */}
            {order.shippingAddress && (
              <div className="border-t border-[#D4AF37]/35 pt-4 flex items-start gap-3 text-xs text-[#5C4934]">
                <MapPin className="w-4 h-4 text-[#8C6518] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0E0B09]">Delivery Destination: </strong>
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
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white border-2 border-[#D4AF37] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-serif text-xl font-bold text-[#FFE59E]">
              Need Urgent Courier Support?
            </h4>
            <p className="text-xs text-[#EDE3D2]/85 font-light max-w-md leading-relaxed">
              If your parcel has been in transit longer than expected, message our dispatch manager at <strong className="text-[#FFE59E]">6383163609 | 7871207631</strong> with your Order ID.
            </p>
          </div>
          <a
            href="https://wa.me/916383163609"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-wider shrink-0 transition-all shadow-md inline-flex items-center gap-2"
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
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-[#5C4934]">Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
