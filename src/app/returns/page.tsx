import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Package,
  CreditCard,
  Truck,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Return & Exchange Policy | NALMARA FASHION • 7-Day Easy Returns',
  description:
    'Enjoy peace of mind with NALMARA FASHION’s 7-Day Easy Return & Exchange policy. Doorstep pickup, transparent refunds, and dedicated concierge support.',
};

export default function ReturnsPage() {
  const steps = [
    {
      step: '01',
      title: 'Initiate Request',
      desc: 'Submit a return or exchange request within 7 days of delivery via your Account portal or our WhatsApp concierge.',
    },
    {
      step: '02',
      title: 'Free Reverse Pickup',
      desc: 'Our courier representative will pick up the securely packaged parcel from your doorstep with zero pickup fee.',
    },
    {
      step: '03',
      title: 'Atelier Quality Check',
      desc: 'Our artisans verify that the garment is unworn, unwashed, and retained with original tags and security ribbons.',
    },
    {
      step: '04',
      title: 'Instant Refund / Exchange',
      desc: 'Refund is processed immediately to your original payment mode or UPI, or your replacement size is dispatched.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Hassle-Free Assurance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Return & Exchange Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Your delight is our foremost promise. If your ensemble isn&apos;t a perfect fit or match, we make returns and size exchanges effortless.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Return & Exchange</span>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#061811]">7-Day Window</h4>
              <p className="text-xs text-zinc-600 mt-1 font-light leading-relaxed">
                Generous 7 days from the moment of doorstep receipt to request an exchange or return.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#061811]">Free Doorstep Pickup</h4>
              <p className="text-xs text-zinc-600 mt-1 font-light leading-relaxed">
                Pan-India reverse pickup arranged directly from your home with no extra pickup charges.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#061811]">100% Full Refunds</h4>
              <p className="text-xs text-zinc-600 mt-1 font-light leading-relaxed">
                Direct refunds to original cards, UPI, net banking, or store credits with zero deductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP BY STEP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
            HOW IT WORKS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#061811] font-bold">
            Four Simple Steps to Exchange or Return
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-light">
            We handle logistics so you can shop with complete luxury confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm hover:shadow-xl transition-all space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-serif font-bold text-[#D4AF37]/40">
                {item.step}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#061811]">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ELIGIBILITY CRITERIA & REFUND TIMELINES */}
      <section className="bg-white border-y border-[#D4AF37]/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Eligible Items */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-emerald-600/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-serif font-bold text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Items Eligible for Return</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 leading-relaxed font-light">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  Ready-to-wear sarees, lehengas, kurtis, and unstitched dress materials.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  Garments in original pristine condition with brand tags, barcode labels, and security seal intact.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  Items returned in original protective cloth bags and rigid courier box.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  Size exchanges for identical product in an alternate size.
                </li>
              </ul>
            </div>

            {/* Ineligible Items */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-rose-600/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-serif font-bold text-lg">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Non-Returnable Exceptions</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-700 leading-relaxed font-light">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  Customized bespoke couture (blouses stitched to custom body measurements, custom neck/sleeve modifications).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  Sarees with completed fall, pico, or tassel customization services.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  Garments showing visible perfume smell, makeup stains, or detached tags.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  Products purchased on final clearance or archival archive sales.
                </li>
              </ul>
            </div>
          </div>

          {/* Refund Timelines Table */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#061811]">
              Refund Settlement Methods & Durations
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/30">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#061811] text-[#E5C07B] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Refund Destination</th>
                    <th className="py-3 px-4">Settlement Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-[#FAF8F5]">
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-900">UPI / QR Code / GPay / PhonePe</td>
                    <td className="py-3 px-4 text-zinc-600">Original UPI linked Bank Account</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Instant (within 24 hours)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-900">Credit / Debit Cards (Razorpay/Stripe)</td>
                    <td className="py-3 px-4 text-zinc-600">Original Issuing Bank Card</td>
                    <td className="py-3 px-4 text-zinc-600">3 – 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-zinc-900">Cash on Delivery (COD)</td>
                    <td className="py-3 px-4 text-zinc-600">Direct Bank Transfer (NEFT/IMPS) or UPI ID</td>
                    <td className="py-3 px-4 text-zinc-600">1 – 2 Business Days post-pickup</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Help Banner */}
          <div className="p-6 rounded-3xl bg-[#061811] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D4AF37]/40 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-bold text-[#E5C07B]">
                Ready to Initiate an Exchange or Return?
              </h4>
              <p className="text-xs text-zinc-300 font-light">
                Sign in to your orders or message our support team on WhatsApp for fast approval.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Go To Orders
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full border border-[#D4AF37] text-[#E5C07B] hover:bg-[#0E3324] text-xs font-bold uppercase tracking-wider transition-all"
              >
                Support Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
