'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Youtube,
  Share2,
  ChevronDown,
  CreditCard,
  ShieldCheck,
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
    <footer className="bg-[#132E27] text-zinc-200 pt-12 sm:pt-16 pb-20 lg:pb-10 border-t border-[#0D201B] relative overflow-hidden">
      {/* Subtle corner botanical flourish */}
      <div className="absolute right-0 bottom-0 w-64 h-64 opacity-5 pointer-events-none">
        <LotusIcon className="w-full h-full text-[#D4AF37]" />
      </div>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Brand Header & Tagline */}
        <div className="flex flex-col items-center justify-center text-center pb-10 border-b border-[#1F4539]">
          <BrandLogo size="lg" theme="dark" showTagline={true} />
        </div>

        {/* 4 Footer Columns (Desktop Grid, Mobile Accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-b border-[#1F4539]">
          {/* Column 1: Shop */}
          <div className="border-b md:border-b-0 border-[#1F4539] pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between text-left font-serif font-bold text-sm tracking-wide text-[#F5E6BE] md:cursor-default"
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                  openSections.shop ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-zinc-600 font-light mt-3 ${
                openSections.shop ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link href="/shop?category=sarees" className="hover:text-[#4A0E17] transition-colors">
                  All Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new-arrivals" className="hover:text-[#4A0E17] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=best-sellers" className="hover:text-[#4A0E17] transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=festive" className="hover:text-[#4A0E17] transition-colors">
                  Festive Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-wear" className="hover:text-[#4A0E17] transition-colors">
                  Kidswear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="border-b md:border-b-0 border-[#1F4539] pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('care')}
              className="w-full flex items-center justify-between text-left font-serif font-bold text-sm tracking-wide text-[#F5E6BE] md:cursor-default"
            >
              <span>Customer Care</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                  openSections.care ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-zinc-300 font-light mt-3 ${
                openSections.care ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div className="border-b md:border-b-0 border-[#1F4539] pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between text-left font-serif font-bold text-sm tracking-wide text-[#F5E6BE] md:cursor-default"
            >
              <span>About Us</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                  openSections.about ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-zinc-300 font-light mt-3 ${
                openSections.about ? 'block' : 'hidden md:block'
              }`}
            >
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <button
              onClick={() => toggleSection('connect')}
              className="w-full flex items-center justify-between text-left font-serif font-bold text-sm tracking-wide text-[#F5E6BE] md:cursor-default"
            >
              <span>Connect</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform text-[#D4AF37] ${
                  openSections.connect ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`space-y-3 mt-3 text-xs text-zinc-300 font-light ${
                openSections.connect ? 'block' : 'hidden md:block'
              }`}
            >
              <p>
                <a
                  href="https://instagram.com/nalmarafashion_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" /> Instagram
                </a>
              </p>
              <p>
                <a
                  href="https://wa.me/916380163090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[9px] font-bold">W</span> WhatsApp Support
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@nalmarafashion.com"
                  className="hover:text-white transition-colors"
                >
                  Email Support
                </a>
              </p>

              {/* Social Icons Row */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/10 border border-[#1F4539] flex items-center justify-center text-zinc-300 hover:bg-[#D4AF37] hover:text-zinc-950 transition-all shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com/nalmarafashion_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/10 border border-[#1F4539] flex items-center justify-center text-zinc-300 hover:bg-[#D4AF37] hover:text-zinc-950 transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/10 border border-[#1F4539] flex items-center justify-center text-zinc-300 hover:bg-[#D4AF37] hover:text-zinc-950 transition-all shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-white/10 border border-[#1F4539] flex items-center justify-center text-zinc-300 hover:bg-[#D4AF37] hover:text-zinc-950 transition-all shadow-sm"
                  aria-label="Pinterest"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-light text-center sm:text-left">
          <p>© 2026 NALMARA FASHION. All rights reserved. Handcrafted with devotion.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-zinc-300">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-[#1F4539] shadow-xs">UPI</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-[#1F4539] shadow-xs">Visa</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-[#1F4539] shadow-xs">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-[#1F4539] shadow-xs">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-[#1F4539] shadow-xs">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
