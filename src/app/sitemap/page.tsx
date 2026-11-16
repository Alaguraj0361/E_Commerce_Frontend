"use client";

import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";
import { InnerPageBanner } from "@/components/layout/InnerPageBanner";

const DIRECTORY = [
  {
    heading: "Saree & Ethnic Collections",
    links: [
      { label: "All Collections", href: "/shop" },
      { label: "Silk & Soft Silk Sarees", href: "/shop?category=sarees" },
      { label: "Bridal & Wedding Sarees", href: "/shop?category=wedding-silk" },
      { label: "Festival & Party Wear", href: "/shop?category=festive-wear" },
      { label: "Salwar Suits & Kurtis", href: "/shop?category=salwar-suits" },
      { label: "Kids Traditional Wear", href: "/shop?category=kids-wear" },
    ],
  },
  {
    heading: "My Account & Shopping Bag",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/signup" },
      { label: "My Account & Profile", href: "/account" },
      { label: "My Orders", href: "/account/orders" },
      { label: "Saved Wishlist", href: "/wishlist" },
      { label: "Shopping Bag", href: "/cart" },
    ],
  },
  {
    heading: "Nalmara Fashion & Customer Help",
    links: [
      { label: "About Our Thoothukudi Shop", href: "/about" },
      { label: "Saree & Style Blog", href: "/blog" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Shipping & Tamil Nadu Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Contact Us (Thoothukudi)", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B09]">
      {/* 1. ROYAL HERO BANNER (Height: 450px) */}
      <InnerPageBanner
        title="Store Directory &"
        titleHighlight="Sitemap"
        badge="DIRECT STORE DIRECTORY • THOOTHUKUDI"
        image="/images/nalmara/hd/hero_stage_clean_desktop.jpg"
        subtitle="All pages, handloom collections, customer policies, and contact information for Nalmara Fashion, Thoothukudi."
        breadcrumb={[{ label: 'Directory' }]}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {DIRECTORY.map((group) => (
          <div
            key={group.heading}
            className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/75 rounded-2xl border-2 border-[#D4AF37]/60 p-6 md:p-8 shadow-[0_16px_40px_-12px_rgba(14,11,9,0.14)]"
          >
            <div className="pointer-events-none absolute inset-[4px] rounded-[12px] border border-[#D4AF37]/25" />
            <span className="pointer-events-none absolute top-2.5 left-2.5 h-3 w-3 border-t-2 border-l-2 border-[#D4AF37]" />
            <span className="pointer-events-none absolute top-2.5 right-2.5 h-3 w-3 border-t-2 border-r-2 border-[#D4AF37]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#D4AF37]/35">
                <Compass className="w-4 h-4 text-[#8C6518]" />
                <h2 className="text-base font-serif font-bold text-[#0E0B09]">
                  {group.heading}
                </h2>
              </div>
              <ul className="space-y-3">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between text-sm text-[#4A3B2C] hover:text-[#0E0B09] font-medium transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8C6518] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
