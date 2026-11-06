'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Mail,
  Phone,
  MapPin,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCategoryStore } from '../../store/categoryStore';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { categories } = useCategoryStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Subscribed! You will receive our latest collections & offers.');
    setEmail('');
  };

  return (
    <footer className="relative bg-[#220517] text-[#F7E8D0] overflow-hidden select-none">
      {/* ============================================================ */}
      {/* 1. STAY UPDATED NEWSLETTER STRIP                             */}
      {/* ============================================================ */}
      <div className="relative bg-gradient-to-r from-[#380725] via-[#540D3A] to-[#380725] border-t-2 border-b border-[#D4AF37]/60 py-4 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1340px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Envelope Icon + Stay Updated */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#2A051C] border border-[#D4AF37]/75 flex items-center justify-center text-[#FFE59E] shrink-0 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#FFFDF9] leading-tight">
                Stay Updated
              </h3>
              <p className="text-[11px] sm:text-xs text-[#EED9BA]/90">
                Get the latest collections &amp; offers!
              </p>
            </div>
          </div>

          {/* Center: Email Input + Gold Subscribe Button */}
          <form
            onSubmit={handleSubscribe}
            className="w-full max-w-md flex items-center gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-[#FFFDF9] text-[#23120B] placeholder:text-zinc-400 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-[#D4AF37]/70 focus:outline-none focus:ring-2 focus:ring-[#E5B85B]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-b from-[#F4CF76] via-[#E2B049] to-[#C68E28] hover:from-[#FFE59E] hover:to-[#D4AF37] text-[#23120B] font-serif font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </form>

          {/* Right: Connect with us + 5 Gold Social Icons */}
          <div className="flex flex-col items-center lg:items-end gap-1.5">
            <span className="text-[11px] font-serif text-[#F9E6C4] tracking-wide">
              Connect with us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#C8902B] text-[#2A051C] flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#C8902B] text-[#2A051C] flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#C8902B] text-[#2A051C] flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="Pinterest"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/916383163609"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#C8902B] text-[#2A051C] flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#C8902B] text-[#2A051C] flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN 5-COLUMN ROYAL BURGUNDY/PLUM FOOTER                  */}
      {/* ============================================================ */}
      <div className="relative bg-gradient-to-b from-[#2A061C] via-[#220517] to-[#1A0311] py-10 sm:py-12 px-4 sm:px-6 lg:px-10">
        {/* Left & Right Gold Floral Mandala Corner Ornaments */}
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="absolute -left-12 top-0 w-44 h-44 text-[#D4AF37]/30 pointer-events-none"
        >
          <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M100 10 L115 55 L160 40 L140 85 L185 100 L140 115 L160 160 L115 145 L100 190 L85 145 L40 160 L60 115 L15 100 L60 85 L40 40 L85 55 Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="absolute -right-12 bottom-0 w-48 h-48 text-[#D4AF37]/30 pointer-events-none"
        >
          <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M100 10 L115 55 L160 40 L140 85 L185 100 L140 115 L160 160 L115 145 L100 190 L85 145 L40 160 L60 115 L15 100 L60 85 L40 40 L85 55 Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>

        <div className="max-w-[1340px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 relative z-10">
          {/* Col 1 (3 cols): Official Emblem + NALMARA FASHION + Your Design, Our Craft */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="flex flex-col items-center sm:items-start group">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C6518] shadow-lg mb-2.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0E0B09]">
                  <img
                    src="/images/nalmara-logo.jpg"
                    alt="NALMARA FASHION"
                    className="w-full h-full object-cover scale-[1.34]"
                  />
                </div>
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.16em] text-[#FFE59E] uppercase">
                NALMARA
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-[1px] w-6 bg-[#D4AF37]/60" />
                <span className="text-[9px] tracking-[0.28em] text-[#E5C158] uppercase font-medium">
                  FASHION
                </span>
                <span className="h-[1px] w-6 bg-[#D4AF37]/60" />
              </div>
            </Link>

            <p className="font-serif italic text-xs sm:text-sm text-[#F5DFB8] mt-3 inline-flex items-center gap-1.5">
              <span>Your Design, Our Craft</span>
              <Heart className="w-3.5 h-3.5 text-[#FFE59E]" />
            </p>
          </div>

          {/* Col 2 (2 cols): Shop Links */}
          <div className="lg:col-span-2 space-y-2.5 text-center sm:text-left">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#FFE59E]">
              Shop Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#F2E2C8]">
              <li>
                <Link href="/shop" className="hover:text-[#FFE59E] transition-colors">
                  All Collections
                </Link>
              </li>
              {categories.slice(0, 6).map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-[#FFE59E] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 (2 cols): Customer Service */}
          <div className="lg:col-span-2 space-y-2.5 text-center sm:text-left">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#FFE59E]">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#F2E2C8]">
              <li>
                <Link href="/track-order" className="hover:text-[#FFE59E] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#FFE59E] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#FFE59E] transition-colors">
                  Return &amp; Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFE59E] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFE59E] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 (2 cols): About Us */}
          <div className="lg:col-span-2 space-y-2.5 text-center sm:text-left">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#FFE59E]">
              About Us
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#F2E2C8]">
              <li>
                <Link href="/about" className="hover:text-[#FFE59E] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFE59E] transition-colors">
                  Why Nalmara
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#FFE59E] transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFE59E] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFE59E] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5 (3 cols): Contact Us & Payment Methods */}
          <div className="lg:col-span-3 space-y-3 text-center sm:text-left">
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#FFE59E]">
              Contact Us
            </h4>

            <div className="space-y-2 text-xs sm:text-[13px] text-[#F2E2C8]">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#E5B85B] shrink-0" />
                <span>
                  <a href="tel:+916383163609" className="hover:text-[#FFE59E]">
                    6383163609
                  </a>{' '}
                  |{' '}
                  <a href="tel:+917871207631" className="hover:text-[#FFE59E]">
                    7871207631
                  </a>
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5B85B] shrink-0" />
                <span>Thoothukudi, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Payment Method Badges: UPI | VISA | Mastercard | RuPay */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
      {/* 3. BOTTOM COPYRIGHT BAR                                      */}
      {/* ============================================================ */}
      <div className="bg-[#18020F] border-t border-[#D4AF37]/30 py-3 px-4 text-center text-[11px] sm:text-xs text-[#EED9BA]/85">
        <p className="flex flex-wrap items-center justify-center gap-2">
          <span>© 2026 NALMARA FASHION. All rights reserved.</span>
          <span className="opacity-50">|</span>
          <span className="inline-flex items-center gap-1 text-[#FFE59E]">
            Elegance &bull; Tradition &bull; You
            <Heart className="w-3 h-3 fill-[#E5B85B] text-[#E5B85B]" />
          </span>
        </p>
      </div>
    </footer>
  );
};
