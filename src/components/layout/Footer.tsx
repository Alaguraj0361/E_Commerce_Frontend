'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-800">
      {/* 1. Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-850">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-100 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Express Delivery</h4>
              <p className="text-xs text-zinc-400">Complimentary on orders over ₹1,499 across India.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-100 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">30-Day Returns</h4>
              <p className="text-xs text-zinc-400">Effortless online returns and exchanges.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-100 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Secure Payments</h4>
              <p className="text-xs text-zinc-400">256-bit encrypted checkout powered by Stripe.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-100 flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Client Care</h4>
              <p className="text-xs text-zinc-400">Dedicated specialists available 24 hours a day.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-white font-sans">
              EFFIDOO<span className="text-emerald-500">.</span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Purveyors of modern essentials, timeless apparel, precision optics, and architectural home artifacts designed for purposeful living.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-2">
                Join our private salon
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/50">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Welcome to the circle. Check your inbox for private previews.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-1"
                  >
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/shop?category=mens-fashion" className="hover:text-white transition-colors">
                  Men&apos;s Tailoring
                </Link>
              </li>
              <li>
                <Link href="/shop?category=womens-fashion" className="hover:text-white transition-colors">
                  Women&apos;s Wardrobe
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electronics" className="hover:text-white transition-colors">
                  Studio Acoustics
                </Link>
              </li>
              <li>
                <Link href="/shop?category=footwear" className="hover:text-white transition-colors">
                  Artisan Footwear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-white transition-colors">
                  Leather & Horology
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home-living" className="hover:text-white transition-colors">
                  Home & Ceramics
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Shipping Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Product Care Guide
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Contact Concierge
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">
              Account & Legal
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Admin Console</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-mono">
                    :3001
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} EFFIDOO Inc. All rights reserved. Crafted for modern commerce.</p>
        <div className="flex items-center gap-4 text-xs">
          <span>Stripe Certified</span>
          <span>•</span>
          <span>SSL 256-Bit</span>
          <span>•</span>
          <span>PCI-DSS Compliant</span>
        </div>
      </div>
    </footer>
  );
};
