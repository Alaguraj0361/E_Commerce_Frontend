'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Heart,
  Headphones,
  ShieldCheck,
} from 'lucide-react';

const MannequinIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="4" r="2.2" stroke="#FFE59E" strokeWidth="1.5" />
    <path
      d="M8.5 7.5C8.5 7.5 10 6.5 12 6.5C14 6.5 15.5 7.5 15.5 7.5L14.5 14C14.5 14 13.5 15.5 12 15.5C10.5 15.5 9.5 14 9.5 14L8.5 7.5Z"
      stroke="#FFE59E"
      strokeWidth="1.4"
      fill="rgba(255,229,158,0.15)"
    />
    <line x1="12" y1="15.5" x2="12" y2="21" stroke="#FFE59E" strokeWidth="1.6" />
    <line x1="8.5" y1="21" x2="15.5" y2="21" stroke="#FFE59E" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="hidden md:block relative w-full bg-[#180010] text-[#F7E8D0] overflow-hidden select-none border-t-2 border-[#D4AF37]">
      {/* 1. Full-Bleed Ultra-HD Royal Wine-Plum Background Plate */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/nalmara/footer_luxury_bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-85"
        />
        {/* Soft Ambient Vignette Overlay for Crisp Contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(24, 0, 16, 0.5) 0%, rgba(24, 0, 16, 0.3) 40%, rgba(18, 0, 12, 0.88) 100%)',
          }}
        />
      </div>

      {/* 2. Main Luxury Content: 5 Columns Perfect Horizontal Alignment */}
      <div className="relative z-10 max-w-[1520px] mx-auto pt-10 sm:pt-14 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-start justify-between gap-8 lg:gap-2">
          
          {/* ======================================================== */}
          {/* COL 1: ROYAL ARCH PAVILION & NALMARA CREST               */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] lg:w-[22%] shrink-0 flex flex-col items-center text-center">
            {/* Scalloped 24K Gold Mughal Palace Cusped Arch */}
            <div className="relative w-full max-w-[260px] rounded-t-[60px] rounded-b-[18px] p-[2.5px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#7A4B0E] shadow-[0_16px_36px_rgba(0,0,0,0.7)]">
              <div
                className="relative rounded-t-[57.5px] rounded-b-[15.5px] px-5 py-5 flex flex-col items-center text-center border border-[#FFE59E]/40"
                style={{
                  background:
                    'linear-gradient(180deg, #300420 0%, #1A0112 55%, #10000B 100%)',
                }}
              >
                {/* Circular Golden Monogram Crest */}
                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#8C5818] shadow-lg mb-2.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0508] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/nalmara-logo.jpg"
                      alt="NALMARA"
                      className="w-full h-full object-cover scale-[1.38]"
                    />
                  </div>
                </div>

                {/* NALMARA Roman Serif Title */}
                <h3
                  className="font-serif font-extrabold text-2xl tracking-[0.16em] uppercase text-transparent bg-clip-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                  style={{
                    fontFamily: "'Cinzel', Georgia, serif",
                    backgroundImage:
                      'linear-gradient(180deg, #FFFDF9 0%, #FFE28A 45%, #C88A20 85%, #F8DF95 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }}
                >
                  NALMARA
                </h3>

                {/* FASHION with 24K Gold Flanking Rules */}
                <div className="flex items-center justify-center gap-2 mt-1 mb-1">
                  <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="font-serif text-[10px] tracking-[0.32em] text-[#FFE59E] uppercase font-bold">
                    FASHION
                  </span>
                  <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
              </div>
            </div>

            {/* Script Tagline: "Your Design, Our Craft ♡" */}
            <p
              className="text-[21px] sm:text-[23px] text-[#FFE59E] mt-3 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Your Design, Our Craft ♡
            </p>

            {/* Social Media Icons: ONLY Instagram and YouTube */}
            <div className="flex items-center justify-center gap-3.5 mt-3">
              {/* 1. Instagram */}
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#7A4B0E] shadow-[0_4px_14px_rgba(0,0,0,0.65)] hover:scale-110 active:scale-95 transition-transform"
                aria-label="Instagram"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#380424] to-[#1A0111] flex items-center justify-center text-[#FFE59E] group-hover:text-[#FFFDF9] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
              </a>

              {/* 2. YouTube */}
              <a
                href="https://youtube.com/@nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#7A4B0E] shadow-[0_4px_14px_rgba(0,0,0,0.65)] hover:scale-110 active:scale-95 transition-transform"
                aria-label="YouTube"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#380424] to-[#1A0111] flex items-center justify-center text-[#FFE59E] group-hover:text-[#FFFDF9] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Vertical 24K Gold Divider with Diamond Star */}
          <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/45 to-transparent relative flex items-center justify-center">
              <span className="w-2 h-2 rotate-45 bg-[#FFE59E] border border-[#8C5818] shadow-[0_0_8px_rgba(255,229,158,0.7)] z-10" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 2: SHOP LINKS                                        */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] lg:w-[15%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Scalloped Gold Plaque: SHOP LINKS */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.6)] mb-4"
              style={{ background: 'linear-gradient(180deg, #380424 0%, #1A0111 100%)' }}
            >
              <MannequinIcon className="w-3.5 h-3.5" />
              <span className="font-serif font-bold text-xs uppercase tracking-[0.16em] text-[#FFE59E] whitespace-nowrap">
                SHOP LINKS
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#F3E2CB]">
              {[
                { name: 'All Collections', href: '/shop' },
                { name: "Children's Wear", href: '/shop?category=childrens-wear' },
                { name: 'Long Top', href: '/shop?category=long-top' },
                { name: 'Maxi', href: '/shop?category=maxi' },
                { name: 'Saree', href: '/shop?category=saree' },
                { name: 'Sudidar', href: '/shop?category=sudidar' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-[#F3E2CB] hover:text-[#FFE59E] transition-colors"
                  >
                    <span className="text-[#D4AF37] font-bold text-xs mr-2 transition-transform group-hover:translate-x-0.5">&gt;</span>
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 24K Gold Divider with Diamond Star */}
          <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/45 to-transparent relative flex items-center justify-center">
              <span className="w-2 h-2 rotate-45 bg-[#FFE59E] border border-[#8C5818] shadow-[0_0_8px_rgba(255,229,158,0.7)] z-10" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 3: CUSTOMER SERVICE                                  */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] lg:w-[17%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Scalloped Gold Plaque: CUSTOMER SERVICE */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.6)] mb-4"
              style={{ background: 'linear-gradient(180deg, #380424 0%, #1A0111 100%)' }}
            >
              <Headphones className="w-3.5 h-3.5 text-[#FFE59E]" />
              <span className="font-serif font-bold text-xs uppercase tracking-[0.16em] text-[#FFE59E] whitespace-nowrap">
                CUSTOMER SERVICE
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#F3E2CB]">
              {[
                { name: 'Track Order', href: '/track-order' },
                { name: 'Shipping Policy', href: '/shipping' },
                { name: 'Return & Exchange', href: '/returns' },
                { name: 'FAQs', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-[#F3E2CB] hover:text-[#FFE59E] transition-colors"
                  >
                    <span className="text-[#D4AF37] font-bold text-xs mr-2 transition-transform group-hover:translate-x-0.5">&gt;</span>
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 24K Gold Divider with Diamond Star */}
          <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/45 to-transparent relative flex items-center justify-center">
              <span className="w-2 h-2 rotate-45 bg-[#FFE59E] border border-[#8C5818] shadow-[0_0_8px_rgba(255,229,158,0.7)] z-10" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 4: ABOUT US                                          */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] lg:w-[15%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Scalloped Gold Plaque: ABOUT US */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.6)] mb-4"
              style={{ background: 'linear-gradient(180deg, #380424 0%, #1A0111 100%)' }}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-[#FFE59E] text-[#FFE59E] flex items-center justify-center text-[10px] font-bold font-serif leading-none">
                i
              </span>
              <span className="font-serif font-bold text-xs uppercase tracking-[0.16em] text-[#FFE59E] whitespace-nowrap">
                ABOUT US
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#F3E2CB]">
              {[
                { name: 'Our Story', href: '/about' },
                { name: 'Why Nalmara', href: '/about#why-nalmara' },
                { name: 'Testimonials', href: '/reviews' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/contact#careers' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-[#F3E2CB] hover:text-[#FFE59E] transition-colors"
                  >
                    <span className="text-[#D4AF37] font-bold text-xs mr-2 transition-transform group-hover:translate-x-0.5">&gt;</span>
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 24K Gold Divider with Diamond Star */}
          <div className="hidden lg:flex flex-col items-center justify-center self-stretch px-1">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/45 to-transparent relative flex items-center justify-center">
              <span className="w-2 h-2 rotate-45 bg-[#FFE59E] border border-[#8C5818] shadow-[0_0_8px_rgba(255,229,158,0.7)] z-10" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* COL 5: CONTACT US & PAYMENTS                             */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] lg:w-[24%] shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Scalloped Gold Plaque: CONTACT US */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.6)] mb-4"
              style={{ background: 'linear-gradient(180deg, #380424 0%, #1A0111 100%)' }}
            >
              <Phone className="w-3.5 h-3.5 text-[#FFE59E]" />
              <span className="font-serif font-bold text-xs uppercase tracking-[0.16em] text-[#FFE59E] whitespace-nowrap">
                CONTACT US
              </span>
            </div>

            {/* Phone & Address */}
            <div className="space-y-3 text-xs sm:text-[13px] text-[#F3E2CB] w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#FFE59E] shrink-0" />
                <span>
                  <a href="tel:+916383163609" className="hover:text-[#FFE59E] transition-colors">
                    6383163609
                  </a>{' '}
                  |{' '}
                  <a href="tel:+917871207631" className="hover:text-[#FFE59E] transition-colors">
                    7871207631
                  </a>
                </span>
              </div>

              <div className="flex items-start justify-center lg:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFE59E] shrink-0 mt-0.5" />
                <span className="text-left leading-relaxed">
                  Q4R8+3FC, 3rd Mile, Near Bus Stop, Thoothukudi, 628008
                </span>
              </div>
            </div>

            {/* Lotus Motif Divider */}
            <div className="w-full flex items-center justify-center lg:justify-start my-3">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <svg viewBox="0 0 30 14" fill="none" className="w-6 h-auto mx-1.5">
                <path d="M15 1C13 5 11 9 15 13C19 9 17 5 15 1Z" fill="#D4AF37" />
                <path d="M15 13C10 11 7 7 9 4C11 5 13 8 15 13Z" fill="#B88228" />
                <path d="M15 13C20 11 23 7 21 4C19 5 17 8 15 13Z" fill="#B88228" />
              </svg>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* 4 Payment Method Badges: UPI | VISA | Mastercard | RuPay */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-2.5 py-1 rounded bg-white text-[#1A1A1A] font-extrabold text-[10px] tracking-wider shadow-xs">
                UPI
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#1A1F71] font-extrabold text-[10px] tracking-wider shadow-xs">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#EB001B] font-extrabold text-[10px] tracking-wider shadow-xs flex items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1 inline-block" />
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-[#097969] font-extrabold text-[10px] tracking-wider shadow-xs">
                RuPay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. SINUOUS 3D 24K GOLD WAVE RIBBON WITH CENTER GOLD LOTUS   */}
      {/* ============================================================ */}
      <div className="relative w-full flex items-center justify-center my-4 z-20 px-4">
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
        {/* Central 3D Sculpted Lotus */}
        <div className="px-3 shrink-0 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] border border-[#5A3807]" />
          <svg viewBox="0 0 60 28" fill="none" className="w-8 h-auto drop-shadow-[0_2px_8px_rgba(255,229,158,0.7)]">
            <path d="M30 3C26 10 23 16 30 24C37 16 34 10 30 3Z" fill="url(#ftLotusCenterNew)" stroke="#5A3807" strokeWidth="0.9" />
            <path d="M30 24C21 20 15 13 18 7C23 9 26 14 30 24Z" fill="url(#ftLotusSideNew)" stroke="#5A3807" strokeWidth="0.9" />
            <path d="M30 24C39 20 45 13 42 7C37 9 34 14 30 24Z" fill="url(#ftLotusSideNew)" stroke="#5A3807" strokeWidth="0.9" />
            <path d="M30 24C16 23 8 18 9 12C15 13 22 17 30 24Z" fill="url(#ftLotusOuterNew)" stroke="#5A3807" strokeWidth="0.8" />
            <path d="M30 24C44 23 52 18 51 12C45 13 38 17 30 24Z" fill="url(#ftLotusOuterNew)" stroke="#5A3807" strokeWidth="0.8" />
            <ellipse cx="30" cy="25" rx="10" ry="2" fill="#8C5818" />
            <defs>
              <linearGradient id="ftLotusCenterNew" x1="30" y1="3" x2="30" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDF9" />
                <stop offset="0.45" stopColor="#E5B84B" />
                <stop offset="1" stopColor="#9E6B18" />
              </linearGradient>
              <linearGradient id="ftLotusSideNew" x1="18" y1="7" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFE59E" />
                <stop offset="1" stopColor="#A6721E" />
              </linearGradient>
              <linearGradient id="ftLotusOuterNew" x1="9" y1="12" x2="51" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5D37E" />
                <stop offset="1" stopColor="#8C5818" />
              </linearGradient>
            </defs>
          </svg>
          <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] border border-[#5A3807]" />
        </div>
        <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM COPYRIGHT & TRUST ROW                              */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-[13px] text-[#F3E2CB]">
        {/* Left / Center Copyright */}
        <p className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-center">
          <span>© 2026 <strong className="text-[#FFE59E] font-bold">NALMARA FASHION</strong>. All rights reserved.</span>
          <span className="opacity-40">|</span>
          <span className="inline-flex items-center gap-1 text-[#FFE59E]">
            Elegance &bull; Tradition &bull; You
            <Heart className="w-3.5 h-3.5 fill-[#FFE59E] text-[#FFE59E]" />
          </span>
        </p>

        {/* Right Gold Bullion "Shop with Confidence" Pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
          style={{ background: 'linear-gradient(180deg, #380424 0%, #1A0111 100%)' }}
        >
          <ShieldCheck className="w-4 h-4 text-[#FFE59E]" />
          <span className="font-serif font-bold text-xs text-[#FFE59E] tracking-wide whitespace-nowrap">
            Shop with Confidence
          </span>
        </div>
      </div>
    </footer>
  );
};
