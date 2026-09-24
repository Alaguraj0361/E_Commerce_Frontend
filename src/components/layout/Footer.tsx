'use client';

import React from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Youtube,
  Share2,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer = () => {
  return (
    <footer className="bg-[#061811] text-[#FAF8F5] pt-16 pb-8 border-t border-[#D4AF37]/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#D4AF37]/20">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6 lg:pr-4">
            <BrandLogo size="md" theme="dark" />
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              EFFIDOO celebrates authentic Indian tradition, pure artisanal craftsmanship, and contemporary royal elegance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] hover:bg-[#D4AF37] hover:text-zinc-950 transition-all"
                aria-label="Pinterest"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#E5C07B] uppercase tracking-widest">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300 font-light">
              <li>
                <Link href="/" className="hover:text-[#E5C07B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E5C07B] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#E5C07B] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E5C07B] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E5C07B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#E5C07B] uppercase tracking-widest">
              Customer Service
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300 font-light">
              <li>
                <Link href="/account/orders" className="hover:text-[#E5C07B] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#E5C07B] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#E5C07B] transition-colors">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#E5C07B] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E5C07B] transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Collections */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#E5C07B] uppercase tracking-widest">
              Our Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300 font-light">
              <li>
                <Link href="/shop?category=sarees" className="hover:text-[#E5C07B] transition-colors">
                  Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lehengas" className="hover:text-[#E5C07B] transition-colors">
                  Lehengas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=salwar-suits" className="hover:text-[#E5C07B] transition-colors">
                  Salwar Suits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kurtis" className="hover:text-[#E5C07B] transition-colors">
                  Kurtis
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-wear" className="hover:text-[#E5C07B] transition-colors">
                  Men's Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-wear" className="hover:text-[#E5C07B] transition-colors">
                  Kids Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Download Our App */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#E5C07B] uppercase tracking-widest">
              Download Our App
            </h5>
            <p className="text-xs text-zinc-300 font-light">
              Get exclusive offers, early access and festive updates.
            </p>

            <div className="space-y-3 pt-2">
              {/* Google Play Button */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-[#D4AF37] transition-all group"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186A2.29 2.29 0 0 1 3 20.572V3.428c0-.622.222-1.203.609-1.614zm1.442-1.28l10.15 5.86-2.585 2.585-7.565-8.445zm0 22.932l7.565-8.445 2.585 2.585-10.15 5.86zM16.63 7.828l3.76 2.17c1.077.623 1.077 1.637 0 2.259l-3.76 2.17-2.837-2.837 2.837-2.837z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-400 leading-tight">
                    GET IT ON
                  </p>
                  <p className="text-xs font-semibold text-white tracking-wide leading-tight group-hover:text-[#E5C07B]">
                    Google Play
                  </p>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="https://apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-[#D4AF37] transition-all group"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.42-.59.68-1.11 1.76-.97 2.8 1.07.08 2.13-.57 2.75-1.35z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-400 leading-tight">
                    Download on the
                  </p>
                  <p className="text-xs font-semibold text-white tracking-wide leading-tight group-hover:text-[#E5C07B]">
                    App Store
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-light">
          <p>© 2026 EFFIDOO. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/privacy" className="hover:text-[#E5C07B] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">|</span>
            <Link href="/terms" className="hover:text-[#E5C07B] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-zinc-600">|</span>
            <Link href="/sitemap" className="hover:text-[#E5C07B] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
