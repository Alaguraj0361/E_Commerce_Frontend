"use client";

import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

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
      {/* Royal Obsidian & 24K Gold Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-[#FFFDF9] py-16 md:py-20 px-4 border-b-2 border-[#D4AF37]/50">
        <div className="pointer-events-none absolute inset-[6px] border border-[#D4AF37]/15" />
        <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#D4AF37]/75" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#D4AF37]/75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.16),transparent_65%)]" />

        <div className="max-w-5xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#17120D]/90 border border-[#D4AF37]/50 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <NalmaraEmblem className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFE59E] font-bold">
              Nalmara Fashion • Thoothukudi
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#FFFDF9]">
            Website{" "}
            <span className="font-script italic font-normal bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent pr-1">
              Pages
            </span>
          </h1>
          <p className="text-[#FAF7F2]/75 text-sm max-w-md mx-auto">
            All pages, collections, and customer help links for Nalmara Fashion, Thoothukudi.
          </p>
        </div>
      </section>

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
