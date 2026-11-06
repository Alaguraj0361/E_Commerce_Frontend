"use client";

import Link from "next/link";
import { Scale, CheckCircle2, Sparkles, CreditCard, ShieldAlert, ArrowRight } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

const CLAUSES = [
  {
    icon: Sparkles,
    title: "1. Handloom Nature & Craftsmanship",
    body: "Every Nalmara saree and ensemble is authentically handwoven by master artisans. Subtle variations in weave texture, zari sheen, or motif alignment are natural hallmarks of genuine handloom artistry and are not considered manufacturing defects. Product colors may appear slightly different depending on calibrated screen lighting.",
  },
  {
    icon: CreditCard,
    title: "2. Pricing, Taxes & Order Acceptance",
    body: "All prices listed on Nalmara Fashion are in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise. An order is formally accepted once our atelier verifies loom inventory and dispatches your piece. In the rare event of an inventory discrepancy on a single-edition drape, a full 100% refund is initiated immediately.",
  },
  {
    icon: CheckCircle2,
    title: "3. Custom Tailoring & Bespoke Alterations",
    body: "Orders requesting custom blouse stitching, pico/fall finishing, or bespoke bridal alterations are crafted specifically to your submitted measurements. Once tailoring has commenced, custom-fitted garments are non-returnable, though complimentary fitting adjustments remain available at our flagship studio.",
  },
  {
    icon: ShieldAlert,
    title: "4. Intellectual Property & Archive Imagery",
    body: "All textile designs, campaign photography, brand insignia, and editorial content on this platform are the exclusive intellectual property of Nalmara Fashion. Unauthorized reproduction or commercial redistribution is strictly prohibited.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B09]">
      {/* Royal Obsidian & 24K Gold Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-[#FFFDF9] py-16 md:py-24 px-4 border-b-2 border-[#D4AF37]/50">
        <div className="pointer-events-none absolute inset-[6px] border border-[#D4AF37]/15" />
        <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#D4AF37]/75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.16),transparent_65%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#17120D]/90 border border-[#D4AF37]/50 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <NalmaraEmblem className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFE59E] font-bold">
              Nalmara Fashion • Thoothukudi
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-[#FFFDF9]">
            Terms &amp;{" "}
            <span className="font-script italic font-normal bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent pr-1">
              Conditions
            </span>
          </h1>
          <p className="text-[#FAF7F2]/75 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Simple, clear store terms for shopping sarees and ethnic wear from Nalmara Fashion, Thoothukudi, Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
        {CLAUSES.map((clause) => {
          const Icon = clause.icon;
          return (
            <div
              key={clause.title}
              className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/75 rounded-2xl border-2 border-[#D4AF37]/55 p-6 md:p-8 shadow-[0_14px_35px_-12px_rgba(14,11,9,0.12)]"
            >
              <div className="pointer-events-none absolute inset-[4px] rounded-[12px] border border-[#D4AF37]/20" />
              <div className="relative z-10">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#0E0B09] to-[#1F1811] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0 shadow-md">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-serif font-semibold text-[#0E0B09]">
                    {clause.title}
                  </h2>
                </div>
                <p className="text-sm text-[#4A3B2C] leading-relaxed pl-1 font-medium">
                  {clause.body}
                </p>
              </div>
            </div>
          );
        })}

        <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-2xl border-2 border-[#D4AF37]/65 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_14px_35px_-12px_rgba(14,11,9,0.12)]">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8C6518]">
              Need Clarification?
            </p>
            <p className="text-sm text-[#4A3B2C] font-medium">
              Review our{" "}
              <Link
                href="/returns"
                className="underline font-bold text-[#0E0B09] hover:text-[#8C6518]"
              >
                Returns & Exchange Policy
              </Link>{" "}
              or{" "}
              <Link
                href="/shipping"
                className="underline font-bold text-[#0E0B09] hover:text-[#8C6518]"
              >
                Shipping Guidelines
              </Link>
              .
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0E0B09] via-[#1F1811] to-[#0E0B09] border border-[#D4AF37] text-[#FFE59E] text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all shrink-0 shadow-md"
          >
            Speak With Concierge <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
