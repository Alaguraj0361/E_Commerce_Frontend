import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldAlert,
  Scale,
  Award,
  CheckCircle,
  HelpCircle,
  Gem,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Terms & Conditions | NALMARA FASHION • Luxury Couture Client Agreement',
  description:
    'Review the official Terms & Conditions governing orders, bespoke atelier tailoring, payments, and site usage on NALMARA FASHION.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Client Agreement</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Terms & Conditions
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before placing an order with NALMARA FASHION. They outline our mutual commitments to authentic luxury commerce.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Terms & Conditions</span>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">Authentic Weaves</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Every saree and lehenga is certified authentic handloom craft sourced directly from registered master weaver clusters.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <Gem className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">Transparent Pricing</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              All prices shown are inclusive of applicable goods & services tax (GST). Free shipping is applicable on qualifying amounts.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">Bespoke Integrity</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Tailoring customizations are executed strictly in accordance with client measurement submissions and style choices.
            </p>
          </div>
        </div>
      </section>

      {/* 3. DETAILED TERMS CLAUSES */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10 text-xs sm:text-sm text-zinc-700 leading-relaxed font-light">
        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            1. Preamble & Acceptance of Terms
          </h2>
          <p>
            Welcome to NALMARA FASHION (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing, browsing, or purchasing from our digital atelier (<span className="text-[#B8860B] font-medium">nalmarafashion.com</span>), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms & Conditions, our Privacy Policy, and our Shipping & Return guidelines.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            2. Handloom Authenticity & Subtle Weave Nuances
          </h2>
          <p>
            Because authentic Indian textiles and pure zari brocades are handwoven by master artisans, subtle irregularities in thread texture, slight selvedge tension shifts, or slight tonal shade variations are characteristic hallmarks of genuine handcrafting, rather than manufacturing flaws. Photographic color reproduction may also differ subtly based on individual screen calibration and studio lighting.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            3. Bespoke Tailoring & Sizing Obligations
          </h2>
          <p>
            When ordering bespoke tailoring (such as custom blouse stitching, fall/pico finishes, feeding zips, can-can padding, or custom length skirts), the customer is responsible for providing accurate body measurements. We provide complimentary alteration advice via our WhatsApp concierge, but cannot accept returns for items stitched to personalized body measurements once tailoring is completed.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            4. Pricing, Orders, & Cancellations
          </h2>
          <p>
            All prices are denominated in Indian Rupees (INR) and are inclusive of GST. We reserve the right to decline or cancel any order in instances of pricing discrepancies or inadvertent inventory shortages. In the event of an order cancellation initiated by us, a 100% full refund will be immediately re-credited to your original payment method.
          </p>
          <p>
            Clients may cancel orders within 4 hours of submission without penalty. Beyond 4 hours, orders enter the fabric cutting and tailoring phase and cannot be unilaterally cancelled.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            5. Intellectual Property Rights
          </h2>
          <p>
            All content published on this website—including high-resolution photography, text, graphics, logos, video drapes, button icons, and proprietary blouse designs—is the exclusive intellectual property of NALMARA FASHION and is protected under Indian and international copyright and trademark laws. Any unauthorized commercial duplication or redistribution is strictly prohibited.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            6. Governing Law & Dispute Resolution
          </h2>
          <p>
            These Terms shall be interpreted and governed by the laws of India. Any legal dispute, claim, or controversy arising out of or relating to transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts situated in Bengaluru, Karnataka, India.
          </p>
        </div>
      </section>
    </div>
  );
}
