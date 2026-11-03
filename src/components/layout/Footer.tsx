'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Youtube,
  Share2,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Mail,
  MessageCircle,
  ArrowUpRight,
  Gem,
  Package,
  HeartHandshake,
} from 'lucide-react';
import { BrandLogo, LotusIcon } from '../ui/BrandLogo';

export const Footer = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shop: false,
    care: false,
    about: false,
    connect: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer className="relative bg-[#180306] text-[#EDE3D2] pt-14 sm:pt-18 pb-24 lg:pb-12 overflow-hidden select-none">
      {/* Top 24K Gold Shimmer Border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-90" />
      <div className="absolute top-[5px] inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

      {/* Ambient Radial Gold & Garnet Glow Behind Crest */}
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[640px] h-64 rounded-full bg-[#D4AF37]/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[520px] h-48 rounded-full bg-[#4A0812]/35 blur-3xl pointer-events-none" />

      {/* Subtle Corner Lotus Watermarks */}
      <div className="absolute -left-16 -bottom-12 w-72 h-72 opacity-[0.05] pointer-events-none">
        <LotusIcon className="w-full h-full text-[#D4AF37]" />
      </div>
      <div className="absolute -right-12 -bottom-10 w-80 h-80 opacity-[0.06] pointer-events-none">
        <LotusIcon className="w-full h-full text-[#D4AF37]" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Outer Subtle 24K Gold Architectural Frame on #180306 */}
        <div className="relative rounded-3xl border border-[#D4AF37]/35 bg-gradient-to-b from-[#24050A]/80 via-[#180306]/90 to-[#120204]/95 px-5 sm:px-8 lg:px-12 py-8 sm:py-11 shadow-[0_24px_65px_rgba(0,0,0,0.55)] backdrop-blur-[2px]">
          {/* Inner Hairline Gold Rim */}
          <div className="absolute inset-2.5 border border-[#D4AF37]/20 rounded-2xl pointer-events-none" />

          {/* Sculpted 24K Gold Corner Filigree Brackets */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#E5C158]/80 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#E5C158]/80 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#E5C158]/80 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#E5C158]/80 pointer-events-none" />

          {/* ============================================================ */}
          {/* 1. ROYAL BRAND CREST HEADER & HERITAGE PILLARS               */}
          {/* ============================================================ */}
          <div className="flex flex-col items-center justify-center text-center pb-8 sm:pb-10 border-b border-[#D4AF37]/25">
            {/* Decorative Gold Wings Flanking Logo */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-2xl">
              <div className="hidden sm:flex items-center gap-2 flex-1">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/75" />
                <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
              </div>

              <BrandLogo size="lg" theme="dark" showTagline={false} />

              <div className="hidden sm:flex items-center gap-2 flex-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/75" />
              </div>
            </div>

            {/* Luminous Champagne Tagline */}
            <p className="font-serif italic text-xs sm:text-sm text-[#E8D5B0] tracking-wider mt-2.5">
              Traditional Elegance &bull; Timeless Collections &bull; Made with Love
            </p>

            {/* 3 Mini Royal Assurance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2B060C]/90 border border-[#D4AF37]/45 text-[10px] sm:text-[11px] font-serif text-[#F5E6BE] tracking-wide shadow-2xs">
                <Gem className="w-3 h-3 text-[#E5C158]" />
                <span>100% Authentic Weaves</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2B060C]/90 border border-[#D4AF37]/45 text-[10px] sm:text-[11px] font-serif text-[#F5E6BE] tracking-wide shadow-2xs">
                <Package className="w-3 h-3 text-[#E5C158]" />
                <span>Signature Luxury Packaging</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2B060C]/90 border border-[#D4AF37]/45 text-[10px] sm:text-[11px] font-serif text-[#F5E6BE] tracking-wide shadow-2xs">
                <HeartHandshake className="w-3 h-3 text-[#E5C158]" />
                <span>Dedicated Stylist Support</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. 4 ARCHITECTURAL FOOTER COLUMNS                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-9 sm:py-11">
            {/* Column 1: Shop */}
            <div className="border-b md:border-b-0 border-[#D4AF37]/20 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection('shop')}
                className="w-full flex items-center justify-between text-left md:cursor-default group"
              >
                <div>
                  <span className="block font-serif font-bold text-sm sm:text-base tracking-[0.14em] uppercase text-[#FFE59E]">
                    Shop
                  </span>
                  <span className="hidden md:block h-[1.5px] w-9 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1.5" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                    openSections.shop ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <ul
                className={`space-y-3 text-xs sm:text-[13px] text-[#E6DEC8] font-normal mt-4 ${
                  openSections.shop ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link
                    href="/shop?category=sarees"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>All Sarees</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?filter=new-arrivals"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>New Arrivals</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#4A0812] border border-[#D4AF37]/60 text-[8.5px] font-serif font-bold uppercase tracking-wider text-[#FFE59E]">
                      New
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?filter=best-sellers"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Bestsellers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=festive"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Festive Collections</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=kids-wear"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Kidswear</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Customer Care */}
            <div className="border-b md:border-b-0 border-[#D4AF37]/20 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between text-left md:cursor-default"
              >
                <div>
                  <span className="block font-serif font-bold text-sm sm:text-base tracking-[0.14em] uppercase text-[#FFE59E]">
                    Customer Care
                  </span>
                  <span className="hidden md:block h-[1.5px] w-9 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1.5" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                    openSections.care ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <ul
                className={`space-y-3 text-xs sm:text-[13px] text-[#E6DEC8] font-normal mt-4 ${
                  openSections.care ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link
                    href="/contact"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Shipping Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Returns &amp; Exchanges</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>FAQs</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: About Us */}
            <div className="border-b md:border-b-0 border-[#D4AF37]/20 pb-4 md:pb-0">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between text-left md:cursor-default"
              >
                <div>
                  <span className="block font-serif font-bold text-sm sm:text-base tracking-[0.14em] uppercase text-[#FFE59E]">
                    About Us
                  </span>
                  <span className="hidden md:block h-[1.5px] w-9 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1.5" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                    openSections.about ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <ul
                className={`space-y-3 text-xs sm:text-[13px] text-[#E6DEC8] font-normal mt-4 ${
                  openSections.about ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link
                    href="/about"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Our Story</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Terms &amp; Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track-order"
                    className="group/link inline-flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/60 group-hover/link:bg-[#FFE59E] transition-colors" />
                    <span>Track Order</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Connect */}
            <div>
              <button
                onClick={() => toggleSection('connect')}
                className="w-full flex items-center justify-between text-left md:cursor-default"
              >
                <div>
                  <span className="block font-serif font-bold text-sm sm:text-base tracking-[0.14em] uppercase text-[#FFE59E]">
                    Connect
                  </span>
                  <span className="hidden md:block h-[1.5px] w-9 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1.5" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                    openSections.connect ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`space-y-3 mt-4 text-xs sm:text-[13px] text-[#E6DEC8] ${
                  openSections.connect ? 'block' : 'hidden md:block'
                }`}
              >
                {/* Instagram Direct Link */}
                <a
                  href="https://instagram.com/nalmarafashion_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/con flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-[#2B060C] border border-[#D4AF37]/55 group-hover/con:border-[#FFE59E] flex items-center justify-center text-[#E5C158] transition-colors shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/con:opacity-100 transition-opacity text-[#E5C158]" />
                </a>

                {/* WhatsApp Support */}
                <a
                  href="https://wa.me/916380163909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/con flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-[#25D366]/20 border border-[#25D366]/60 group-hover/con:bg-[#25D366] flex items-center justify-center text-[#25D366] group-hover/con:text-white transition-colors shrink-0">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                  <span>WhatsApp Support</span>
                </a>

                {/* Email Support */}
                <a
                  href="mailto:support@nalmarafashion.com"
                  className="group/con flex items-center gap-2.5 text-[#E6DEC8] hover:text-[#FFE59E] transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-[#2B060C] border border-[#D4AF37]/55 group-hover/con:border-[#FFE59E] flex items-center justify-center text-[#E5C158] transition-colors shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span>Email Support</span>
                </a>

                {/* 4 Royal Gold Social Medallions */}
                <div className="flex items-center gap-2.5 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2B060C] border border-[#D4AF37]/60 flex items-center justify-center text-[#E8D5B0] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#FFE59E] hover:scale-110 transition-all duration-300 shadow-sm"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://instagram.com/nalmarafashion_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2B060C] border border-[#D4AF37]/60 flex items-center justify-center text-[#E8D5B0] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#FFE59E] hover:scale-110 transition-all duration-300 shadow-sm"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2B060C] border border-[#D4AF37]/60 flex items-center justify-center text-[#E8D5B0] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#FFE59E] hover:scale-110 transition-all duration-300 shadow-sm"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#2B060C] border border-[#D4AF37]/60 flex items-center justify-center text-[#E8D5B0] hover:bg-[#D4AF37] hover:text-[#180306] hover:border-[#FFE59E] hover:scale-110 transition-all duration-300 shadow-sm"
                    aria-label="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. BOTTOM COPYRIGHT & LUXURY PAYMENT BADGES BAR              */}
          {/* ============================================================ */}
          <div className="pt-6 border-t border-[#D4AF37]/25 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#D5C9B4]">
            {/* Left Copyright */}
            <div className="flex items-center gap-2 text-center sm:text-left">
              <LotusIcon className="w-4 h-4 text-[#E5C158] shrink-0 hidden sm:block" />
              <p className="font-serif tracking-wide">
                © 2026 <strong className="text-[#FFE59E] font-semibold">NALMARA FASHION</strong>. All rights reserved. Handcrafted with devotion.
              </p>
            </div>

            {/* Right Payment Methods & Security Shield */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2B060C] border border-emerald-500/40 text-[10px] text-emerald-300 font-medium mr-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Secure
              </span>
              {['UPI', 'Visa', 'Mastercard', 'RuPay', 'NetBanking'].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1 rounded-md bg-gradient-to-b from-[#33070E] to-[#1D0307] border border-[#D4AF37]/50 text-[10.5px] font-serif font-semibold tracking-wider text-[#F5E6BE] shadow-xs"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
