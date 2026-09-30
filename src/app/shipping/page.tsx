import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  Clock,
  Globe2,
  PackageCheck,
  Gift,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Shipping Policy | NALMARA FASHION • Luxury Ethnic Couture Delivery',
  description:
    'Experience seamless, insured luxury shipping for your royal couture. Free delivery on orders above ₹1,499 across India. Global international shipping available.',
};

export default function ShippingPage() {
  const deliveryTiers = [
    {
      title: 'Metro Express Delivery',
      time: '2 – 4 Business Days',
      coverage: 'Mumbai, Bengaluru, Delhi NCR, Chennai, Hyderabad, Kolkata',
      charge: 'FREE on orders above ₹1,499 (Standard: ₹99)',
      badge: 'Most Popular',
    },
    {
      title: 'Rest of India',
      time: '4 – 6 Business Days',
      coverage: 'All Tier 2 & Tier 3 cities across all Indian states and Union Territories',
      charge: 'FREE on orders above ₹1,499 (Standard: ₹149)',
      badge: 'Pan-India Insured',
    },
    {
      title: 'Bespoke Tailoring & Bridal',
      time: '7 – 12 Business Days',
      coverage: 'Custom blouse stitching, fall/pico, feeding zips, can-can & bridal sets',
      charge: 'Includes artisan crafting & express priority dispatch',
      badge: 'Crafted For You',
    },
    {
      title: 'Worldwide International',
      time: '6 – 10 Business Days',
      coverage: 'USA, UK, Canada, UAE, Singapore, Australia, and 60+ countries',
      charge: 'Calculated at checkout based on destination weight',
      badge: 'Global Courier',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION (Royal Dark Emerald & Gold Filigree) */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>White-Glove Logistics</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Shipping & Delivery Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Every NALMARA FASHION heirloom is packed with utmost reverence and dispatched via premier insured courier networks right to your doorstep.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Shipping Policy</span>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROMISES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Gift,
              title: 'Free Express Shipping',
              desc: 'Complimentary shipping on all prepaid orders exceeding ₹1,499.',
            },
            {
              icon: ShieldCheck,
              title: '100% Insured Transit',
              desc: 'Every parcel is fully insured against damage or loss in transit.',
            },
            {
              icon: PackageCheck,
              title: 'Heirloom Packaging',
              desc: 'Delivered in tamper-proof royal emerald boxes with luxury ribbons.',
            },
            {
              icon: Clock,
              title: 'Real-Time Tracking',
              desc: 'Live SMS and WhatsApp notifications at every milestone.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#D4AF37]/25 shadow-md flex items-start gap-4 transition-all hover:shadow-xl hover:border-[#D4AF37]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#061811]">{item.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DELIVERY TIMELINES & TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
            DISPATCH ESTIMATES
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#061811] font-bold">
            Delivery Timelines & Charges
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-light">
            All ready-to-ship garments are carefully inspected and dispatched within 24–48 hours of order confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryTiers.map((tier, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-sm hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0E3324] text-[#E5C07B]">
                    {tier.badge}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#061811] mt-2">
                    {tier.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#0E3324] block">
                    {tier.time}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-zinc-600">
                  <strong className="text-[#061811]">Coverage:</strong> {tier.coverage}
                </p>
                <p className="text-zinc-600">
                  <strong className="text-[#061811]">Shipping Charges:</strong> {tier.charge}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DETAILED POLICY INFORMATION ACCORDION / CARDS */}
      <section className="bg-white border-y border-[#D4AF37]/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#061811]">
              Important Shipping Guidelines
            </h3>
            <p className="text-xs text-zinc-600 font-light">
              Clear terms designed for a smooth luxury shopping experience.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed font-light">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#061811] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                Order Tracking & Milestone Notifications
              </h4>
              <p>
                Once your package is picked up by our logistics partner (BlueDart, Delhivery, or DHL Express), a tracking AWB number is immediately sent to your registered email and mobile via WhatsApp. You can also monitor real-time shipment updates on our <Link href="/track-order" className="text-[#B8860B] font-semibold hover:underline">Track Order</Link> page.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#061811] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Bespoke Couture & Custom Tailoring Delays
              </h4>
              <p>
                Items with custom neck styling, blouse stitching, feeding zips, or custom length requests undergo tailored hand-crafting at our atelier. Please allow an additional 3–5 business days prior to dispatch for bespoke orders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#061811] flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#D4AF37]" />
                International Customs & Import Taxes
              </h4>
              <p>
                For international deliveries outside India, import duties, customs taxes, and VAT are determined by the destination country&apos;s customs authorities and must be borne by the recipient upon delivery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#061811] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                Failed Delivery Attempts & Address Corrections
              </h4>
              <p>
                Our courier partners attempt delivery up to 3 times before returning the parcel to our Chennai / Bangalore hub. If you need to modify your address after placing an order, contact our concierge team within 4 hours at <a href="mailto:support@nalmarafashion.com" className="text-[#B8860B] font-medium hover:underline">support@nalmarafashion.com</a>.
              </p>
            </div>
          </div>

          {/* Concierge Callout */}
          <div className="p-6 rounded-3xl bg-[#061811] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D4AF37]/40 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-bold text-[#E5C07B]">
                Need Urgent Delivery for a Wedding or Celebration?
              </h4>
              <p className="text-xs text-zinc-300 font-light">
                Our Royal Concierge offers priority expedited dispatch for urgent wedding events.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F2E] text-zinc-950 text-xs font-bold uppercase tracking-wider shrink-0 transition-all shadow-md inline-flex items-center gap-2"
            >
              Contact Concierge <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
