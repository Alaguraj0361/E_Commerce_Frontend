'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  ShoppingBag,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';
import { useCategoryStore } from '@/store/categoryStore';

export default function SitemapPage() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Navigation Directory</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Sitemap & Directory
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Quickly navigate across our couture catalog, client services, order tracking, and atelier stories.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Sitemap</span>
          </div>
        </div>
      </section>

      {/* 2. DIRECTORY COLUMNS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Main Pages */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <Compass className="w-4 h-4 text-[#B8860B]" />
              <h3 className="font-serif text-base font-bold text-[#061811]">
                Boutique & Catalog
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 font-light">
              <li>
                <Link href="/" className="hover:text-[#B8860B] transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#B8860B] transition-colors">
                  All Collections & Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#B8860B] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#B8860B] transition-colors">
                  Wishlist & Saved Items
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#B8860B] transition-colors">
                  Checkout Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B8860B] transition-colors">
                  About NALMARA Atelier
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#B8860B] transition-colors">
                  The Royal Journal & Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B8860B] transition-colors">
                  Contact & Atelier Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Our Categories (Dynamic) */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <h3 className="font-serif text-base font-bold text-[#061811]">
                Our Collections
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 font-light">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <li key={c._id || c.slug}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      className="hover:text-[#B8860B] transition-colors capitalize"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/shop" className="hover:text-[#B8860B] transition-colors">
                      All Weaves
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="hover:text-[#B8860B] transition-colors">
                      New Arrivals
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <HelpCircle className="w-4 h-4 text-[#B8860B]" />
              <h3 className="font-serif text-base font-bold text-[#061811]">
                Customer Service
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 font-light">
              <li>
                <Link href="/track-order" className="hover:text-[#B8860B] transition-colors font-medium text-[#061811]">
                  Track Order Online
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#B8860B] transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#B8860B] transition-colors">
                  7-Day Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#B8860B] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B8860B] transition-colors">
                  Bespoke Styling Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account & Legal */}
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/25 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
              <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
              <h3 className="font-serif text-base font-bold text-[#061811]">
                Account & Governance
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 font-light">
              <li>
                <Link href="/account" className="hover:text-[#B8860B] transition-colors">
                  Client Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#B8860B] transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#B8860B] transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#B8860B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#B8860B] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
