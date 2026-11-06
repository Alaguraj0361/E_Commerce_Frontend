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
import { NalmaraEmblem } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Shipping & Delivery | NALMARA FASHION • Thoothukudi, Tamil Nadu',
  description:
    'Fast 1–3 day delivery across Thoothukudi, Tirunelveli, Madurai, Chennai, Coimbatore, and all of Tamil Nadu. Free shipping on orders above ₹1,499.',
};

export default function ShippingPage() {
  const deliveryTiers = [
    {
      title: 'Thoothukudi, Tirunelveli & South TN',
      time: '1 – 2 Business Days',
      coverage: 'Thoothukudi, Tirunelveli, Kovilpatti, Nagercoil, Madurai, Virudhunagar, Tenkasi, Ramanathapuram',
      charge: 'FREE on orders above ₹1,499 (Below ₹1,499: ₹99)',
      badge: 'Fast Local Delivery',
    },
    {
      title: 'All Over Tamil Nadu & Puducherry',
      time: '2 – 3 Business Days',
      coverage: 'Chennai, Coimbatore, Trichy, Salem, Erode, Tiruppur, Vellore, Thanjavur & all TN districts',
      charge: 'FREE on orders above ₹1,499 (Below ₹1,499: ₹99)',
      badge: 'Most Popular',
    },
    {
      title: 'South India & Rest of India',
      time: '3 – 5 Business Days',
      coverage: 'Bengaluru, Kerala, Andhra Pradesh, Telangana, Mumbai, Delhi & all Indian states',
      charge: 'FREE on orders above ₹1,499 (Below ₹1,499: ₹99)',
      badge: 'All-India Courier',
    },
    {
      title: 'Custom Stitching & Bulk Wedding Orders',
      time: '4 – 7 Business Days',
      coverage: 'Sarees with blouse stitching, fall/pico finishing, or family wedding bulk sets',
      charge: 'Dispatched with priority express courier',
      badge: 'Custom Ready',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO SECTION (Obsidian #0E0B09 & 24K Gold matching Home Page) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-8 sm:p-12 text-center space-y-4">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/75 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Dispatched from Thoothukudi, Tamil Nadu</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Shipping &amp;{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Delivery Info
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-2xl mx-auto leading-relaxed">
            Every order is carefully checked, neatly packed in our gift box at our Thoothukudi store, and shipped fast to your home anywhere in Tamil Nadu and India.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Shipping Policy</span>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROMISES HIGHLIGHT */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Gift,
              title: 'Free Shipping Above ₹1,499',
              desc: 'Free delivery across Tamil Nadu & India on orders over ₹1,499.',
            },
            {
              icon: ShieldCheck,
              title: '100% Safe Delivery',
              desc: 'Waterproof & tamper-proof packing so your saree reaches safely.',
            },
            {
              icon: PackageCheck,
              title: 'Neat Gift Box Packing',
              desc: 'Packed with care — ready for weddings, functions & gifting.',
            },
            {
              icon: Clock,
              title: 'WhatsApp Tracking Updates',
              desc: 'Get instant courier tracking details on your WhatsApp & SMS.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-2xl p-5 border-2 border-[#D4AF37]/65 shadow-md flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0">
                <item.icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#0E0B09]">{item.title}</h4>
                <p className="text-xs text-[#5C4934] leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DELIVERY TIMELINES & TIERS */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#8C6518]">
            ✦ DELIVERY TIME
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0B09] font-bold">
            Delivery Time &amp;{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl text-[#8C6518]">
              Charges
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4934] font-normal">
            All ready-stock sarees and dresses are packed and dispatched from our Thoothukudi store within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryTiers.map((tier, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/65 shadow-sm space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/35 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0E0B09] text-[#FFE59E] border border-[#D4AF37]">
                    {tier.badge}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0E0B09] mt-2">
                    {tier.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#8C6518] block">
                    {tier.time}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[#5C4934]">
                  <strong className="text-[#0E0B09]">Cities Covered:</strong> {tier.coverage}
                </p>
                <p className="text-[#5C4934]">
                  <strong className="text-[#0E0B09]">Delivery Charge:</strong> {tier.charge}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DETAILED POLICY INFORMATION CARDS */}
      <section className="bg-[#F5EFE4] border-t-2 border-[#D4AF37]/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E0B09]">
              Simple Delivery Guidelines
            </h3>
            <p className="text-xs text-[#5C4934] font-normal">
              Everything you need to know about how your order reaches you.
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-[#3F3122] leading-relaxed font-normal">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/55 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0E0B09] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#8C6518]" />
                Trusted Courier Partners (ST Courier, Professional, BlueDart &amp; Delhivery)
              </h4>
              <p>
                We ship via Tamil Nadu&apos;s fastest and most reliable courier services (including ST Courier, Professional Couriers, BlueDart, and Delhivery). As soon as your parcel is shipped, we send your tracking number on WhatsApp and SMS, or you can check it anytime on our <Link href="/track-order" className="text-[#8C6518] font-bold hover:underline">Track Order</Link> page.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/55 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0E0B09] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C6518]" />
                Custom Stitching &amp; Fall/Pico Orders
              </h4>
              <p>
                If you choose custom blouse stitching or saree fall/pico work, please allow 2–3 extra days for neat tailoring before we ship your order.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/55 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#0E0B09] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#8C6518]" />
                Need to Change Your Delivery Address?
              </h4>
              <p>
                If you made a mistake in your address or pincode, please call or WhatsApp our Thoothukudi store team immediately at <strong className="text-[#0E0B09]">6383163609 | 7871207631</strong> before the parcel is dispatched.
              </p>
            </div>
          </div>

          {/* Urgent Delivery Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#D4AF37] shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-bold text-[#FFE59E]">
                Need Urgent Next-Day Delivery for a Function or Wedding?
              </h4>
              <p className="text-xs text-[#EDE3D2]/85 font-normal">
                Call or WhatsApp us at 6383163609 for priority same-day dispatch from Thoothukudi.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-wider shrink-0 transition-all shadow-md inline-flex items-center gap-2"
            >
              Contact Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
