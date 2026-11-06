import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Truck,
} from 'lucide-react';
import { NalmaraEmblem } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Return & Exchange Policy | NALMARA FASHION • Thoothukudi, Tamil Nadu',
  description:
    'Easy 7-Day Return & Exchange policy at NALMARA FASHION, Thoothukudi. Simple exchange process and fast customer support.',
};

export default function ReturnsPage() {
  const steps = [
    {
      step: '01',
      title: 'Message Us Within 7 Days',
      desc: 'Contact our WhatsApp support (6383163609) or go to My Orders within 7 days of receiving your parcel.',
    },
    {
      step: '02',
      title: 'Easy Doorstep Pickup',
      desc: 'We arrange courier pickup from your home or guide you on quick return shipping to our Thoothukudi store.',
    },
    {
      step: '03',
      title: 'Quick Quality Check',
      desc: 'Once received at our Thoothukudi shop, we verify that the saree/dress is unused with original tags intact.',
    },
    {
      step: '04',
      title: 'Fast Exchange or Refund',
      desc: 'We immediately ship your replacement saree/size or refund the full amount to your UPI or bank account.',
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
            <span>Easy &amp; Customer Friendly</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Return &amp;{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Exchange Policy
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-2xl mx-auto leading-relaxed">
            Your happiness matters most to us. If you need a different size or wish to exchange your saree or dress, our Thoothukudi team makes it simple and quick.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Return &amp; Exchange</span>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE GUARANTEES */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 border-2 border-[#D4AF37]/65 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0">
              <RotateCcw className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#0E0B09]">7-Day Easy Exchange</h4>
              <p className="text-xs text-[#5C4934] mt-1 font-normal leading-relaxed">
                7 days from delivery date to request a size change, saree exchange, or return.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 border-2 border-[#D4AF37]/65 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0">
              <Truck className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#0E0B09]">Easy Pickup Support</h4>
              <p className="text-xs text-[#5C4934] mt-1 font-normal leading-relaxed">
                Doorstep return pickup arranged across Tamil Nadu &amp; India.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 border-2 border-[#D4AF37]/65 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0">
              <CreditCard className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#0E0B09]">Quick UPI / Bank Refund</h4>
              <p className="text-xs text-[#5C4934] mt-1 font-normal leading-relaxed">
                Fast refund directly to your Google Pay, PhonePe, UPI, or bank card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP BY STEP PROCESS */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#8C6518]">
            ✦ HOW IT WORKS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0E0B09] font-bold">
            4 Simple Steps to{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl text-[#8C6518]">
              Exchange or Return
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4934] font-normal">
            Simple, clear, and worry-free shopping for your whole family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl p-6 border-2 border-[#D4AF37]/65 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="text-3xl font-serif font-extrabold text-[#8C6518]">
                {item.step}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0E0B09]">
                {item.title}
              </h3>
              <p className="text-xs text-[#5C4934] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ELIGIBILITY CRITERIA & REFUND TIMELINES */}
      <section className="bg-[#F5EFE4] border-t-2 border-[#D4AF37]/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/60 space-y-4">
              <div className="flex items-center gap-2 text-[#0E0B09] font-serif font-bold text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>What Can Be Returned / Exchanged</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#3F3122] leading-relaxed font-normal">
                <li>• Sarees, salwar suits, kurtis, lehengas, and kids wear in unused condition.</li>
                <li>• Items with original price tags, folding, and gift box intact.</li>
                <li>• Size exchanges for kurtis, salwars, or kids dresses.</li>
                <li>• Immediate replacement if any transit damage is shown in parcel opening video.</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/60 space-y-4">
              <div className="flex items-center gap-2 text-[#0E0B09] font-serif font-bold text-lg">
                <AlertCircle className="w-5 h-5 text-[#8C6518]" />
                <span>Items That Cannot Be Returned</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#3F3122] leading-relaxed font-normal">
                <li>• Sarees where the blouse piece has been cut or stitched.</li>
                <li>• Custom-stitched blouses or dresses altered to your measurements.</li>
                <li>• Used, washed, or perfume-sprayed garments without tags.</li>
              </ul>
            </div>
          </div>

          {/* Refund Timelines Table */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#0E0B09]">
              How Fast Will I Get My Refund?
            </h3>
            <div className="overflow-x-auto rounded-2xl border-2 border-[#D4AF37]/65">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0E0B09] text-[#FFE59E] uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-4">How You Paid</th>
                    <th className="py-3.5 px-4">How You Get Refund</th>
                    <th className="py-3.5 px-4">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/30 bg-[#FFFDF9]">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0E0B09]">GPay / PhonePe / Paytm / UPI</td>
                    <td className="py-3.5 px-4 text-[#5C4934]">Same UPI Bank Account</td>
                    <td className="py-3.5 px-4 text-emerald-800 font-bold">Within 24 Hours</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0E0B09]">Debit / Credit Card / NetBanking</td>
                    <td className="py-3.5 px-4 text-[#5C4934]">Same Bank Account / Card</td>
                    <td className="py-3.5 px-4 text-[#5C4934]">3 – 5 Working Days</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#0E0B09]">Cash on Delivery (COD)</td>
                    <td className="py-3.5 px-4 text-[#5C4934]">Sent to your GPay / PhonePe / Bank Account</td>
                    <td className="py-3.5 px-4 text-[#5C4934]">1 – 2 Working Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Help Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-[#D4AF37] shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-lg font-bold text-[#FFE59E]">
                Need Help With an Exchange or Return?
              </h4>
              <p className="text-xs text-[#EDE3D2]/85 font-normal">
                Message our Thoothukudi support team on WhatsApp (<strong className="text-[#FFE59E]">6383163609 | 7871207631</strong>) for quick help.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                My Orders
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full border border-[#D4AF37] text-[#FFE59E] hover:bg-[#1F1811] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
