'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                Order Delivery
              </h5>
              <p className="text-[11px] text-zinc-400">3–8 Days Across India & Global</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                Easy Exchange
              </h5>
              <p className="text-[11px] text-zinc-400">Hassle-free size replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                100% Secure Payment
              </h5>
              <p className="text-[11px] text-zinc-400">UPI, Cards, Netbanking & COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                Custom Tailoring
              </h5>
              <p className="text-[11px] text-zinc-400">Bespoke necklines & heights</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-zinc-800/80">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-xl font-serif font-black tracking-widest uppercase text-white">
                EFFIDOO
              </span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium">
                Sculpted Couture & Atelier
              </p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Sculpted by Effidoo celebrates contemporary Indian luxury. We blend pure handloom weaves, intricate embroidery, and made-to-measure tailoring for timeless elegance.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <a
                href="https://wa.me/919361923406"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+91 93619 23406 / +91 99525 37388</span>
              </a>
              <a
                href="mailto:support@effidoo.com"
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>support@effidoo.com</span>
              </a>
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Atelier Studio, Chennai & Bengaluru, India</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/shop?category=lehenga-half-saree" className="hover:text-amber-400 transition-colors">
                  Lehenga & Half Saree
                </Link>
              </li>
              <li>
                <Link href="/shop?category=saree" className="hover:text-amber-400 transition-colors">
                  Pure Handloom Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=maxi-cotton" className="hover:text-amber-400 transition-colors">
                  Maxi Cotton Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?category=classy-casuals" className="hover:text-amber-400 transition-colors">
                  Classy Casuals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=festive-edit" className="hover:text-amber-400 transition-colors">
                  Festive Edit
                </Link>
              </li>
              <li>
                <Link href="/shop?category=comfy-cotton" className="hover:text-amber-400 transition-colors">
                  Comfy Cotton
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/account/orders" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-amber-400 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-amber-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <a href="https://wa.me/919361923406" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Express Shipping Inquiry
                </a>
              </li>
              <li>
                <a href="https://wa.me/919361923406" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                  Custom Sizing Support
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              About & Policies
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/shop?bestSeller=true" className="hover:text-amber-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/shop?newArrival=true" className="hover:text-amber-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-default">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Social, Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Sculpted by Effidoo. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">UPI</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">Visa</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
