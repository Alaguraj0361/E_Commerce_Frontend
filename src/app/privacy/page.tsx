"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Eye, Database, Mail, ArrowRight } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

const SECTIONS = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "Personal Identification: Name, email address, phone number, and shipping/billing addresses provided during account creation, checkout, or private styling inquiries.",
      "Bespoke Measurements: Custom blouse and garment sizing preferences saved to your Nalmara Patron profile to ensure effortless future fittings.",
      "Transaction Records: Order history, payment method references (processed via PCI-DSS encrypted gateways; we never store raw card numbers), and GST invoicing details.",
      "Digital Atelier Telemetry: Device metadata, browser cookies, and browsing preferences used strictly to personalize your silk curation experience.",
    ],
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      "Order Fulfillment & Insured Transit: Coordinating artisan verification, custom tailoring, and BlueDart / DHL express delivery to your doorstep.",
      "Concierge Communication: Sending real-time order updates, dispatch tracking links, and responding to WhatsApp or email styling consultations.",
      "Private Archive Invitations: With your explicit consent, notifying you of limited-edition Kanchipuram and Banarasi handloom releases.",
      "Platform Integrity: Detecting fraud, securing patron accounts, and maintaining compliance with Indian and international e-commerce regulations.",
    ],
  },
  {
    icon: Lock,
    title: "3. Data Security & Encryption",
    content: [
      "All data transmitted between your browser and Nalmara Fashion is protected using 256-bit SSL/TLS encryption.",
      "Payment transactions are handled exclusively by certified Tier-1 payment processors (Razorpay / Stripe) with bank-grade security protocols.",
      "Access to patron records is strictly restricted to authorized Nalmara concierge and fulfillment personnel under confidentiality obligations.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "4. Third-Party Sharing & Your Rights",
    content: [
      "Zero Data Monetization: Nalmara Fashion never sells, rents, or trades your personal information to third-party marketers.",
      "Trusted Logistics Partners: We share only essential delivery details (Name, Address, Phone) with our insured courier partners to fulfill your order.",
      "Patron Control: You may request access to, correction of, or complete deletion of your personal data at any time by contacting our Privacy Officer.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy{" "}
            <span className="font-script italic font-normal bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent pr-1">
              Policy
            </span>
          </h1>
          <p className="text-[#FAF7F2]/75 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Your trust is important to us. Learn how Nalmara Fashion, Thoothukudi keeps your personal details, phone number, and delivery address 100% safe.
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] pt-1 font-bold">
            Last Updated: October 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-6">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.title}
              className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/75 rounded-2xl border-2 border-[#D4AF37]/55 p-6 md:p-8 shadow-[0_14px_35px_-12px_rgba(14,11,9,0.12)]"
            >
              <div className="pointer-events-none absolute inset-[4px] rounded-[12px] border border-[#D4AF37]/20" />
              <div className="relative z-10">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#0E0B09] to-[#1F1811] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0 shadow-md">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-lg md:text-xl font-serif font-semibold text-[#0E0B09]">
                    {sec.title}
                  </h2>
                </div>
                <ul className="space-y-3 pl-1">
                  {sec.content.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-[#4A3B2C] leading-relaxed font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Privacy Officer Contact */}
        <div className="relative bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-[#FFFDF9] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#D4AF37]/75 shadow-[0_24px_60px_rgba(14,11,9,0.3)] overflow-hidden">
          <div className="pointer-events-none absolute inset-[5px] rounded-[12px] border border-[#D4AF37]/20" />
          <div className="space-y-2 text-center md:text-left relative z-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] font-bold">
              Privacy & Compliance Desk
            </p>
            <h3 className="text-xl md:text-2xl font-serif font-normal text-[#FFFDF9]">
              Questions Regarding Your{" "}
              <span className="font-script italic text-[#FFE59E] text-2xl md:text-3xl">
                Data?
              </span>
            </h3>
            <p className="text-xs text-[#FAF7F2]/75 max-w-md leading-relaxed">
              Reach out to our Data Protection Officer at{" "}
              <span className="text-[#FFE59E] font-semibold">
                privacy@nalmarafashion.com
              </span>{" "}
              or contact our concierge team.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative z-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.22em] hover:brightness-105 transition-all shrink-0 shadow-[0_10px_25px_rgba(212,175,55,0.35)]"
          >
            <Mail className="w-3.5 h-3.5" /> Contact Officer{" "}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
