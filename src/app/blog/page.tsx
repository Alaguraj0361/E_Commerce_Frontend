import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { NalmaraEmblem } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'The Royal Journal | NALMARA FASHION • Handloom Heritage & Couture Chronicles',
  description:
    'Immerse yourself in articles on authentic Indian handlooms, bridal couture trends, pure silk care, and generational artisan stories.',
};

const ARTICLES = [
  {
    slug: 'sacred-heritage-of-kanchipuram-pure-silk',
    title: 'How to Choose the Best Kanchipuram & Soft Silk Sarees for Weddings',
    category: 'Saree Guide',
    readTime: '4 min read',
    date: 'September 28, 2026',
    excerpt:
      'Simple tips from our Thoothukudi store team on choosing rich zari borders, contrast pallus, and auspicious colours for Tamil Nadu weddings and functions.',
    image: '/images/banners/royal_handlooms_hero.png',
  },
  {
    slug: 'bridal-lehengas-royal-velvet-zardozi',
    title: 'Trending Festival Colours & Lightweight Sarees for Family Celebrations',
    category: 'Festival Trends',
    readTime: '3 min read',
    date: 'September 22, 2026',
    excerpt:
      'Discover why soft silk, semi-tissue, and breathable Chettinad cotton sarees are the most loved choices for comfortable all-day festival wear.',
    image: '/images/banners/traditional_elegance_hero.png',
  },
  {
    slug: 'timeless-saree-draping-styles',
    title: '5 Easy Tips to Keep Your Silk & Zari Sarees Shining Like New',
    category: 'Saree Care',
    readTime: '3 min read',
    date: 'September 15, 2026',
    excerpt:
      'Learn how to fold, store in cotton cloth, and care for your silk and zari sarees at home so they stay bright for years.',
    image: '/images/banners/festive_splendor_hero.png',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO SECTION (Obsidian #0E0B09 & 24K Gold matching Home Page) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-8 sm:p-12 text-center space-y-4">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/75 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Nalmara Fashion • Thoothukudi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Saree Style &amp;{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Care Guide
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-xl mx-auto leading-relaxed">
            Helpful tips on choosing wedding silk sarees, festival fashion trends, and easy saree care from Nalmara Fashion, Thoothukudi.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Journal</span>
          </div>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] rounded-3xl border-2 border-[#D4AF37]/65 overflow-hidden shadow-[0_14px_34px_rgba(14,11,9,0.08)] hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-between group p-2.5"
            >
              {/* Image banner */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#0E0B09] border border-[#D4AF37]/50">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0B09]/70 via-transparent to-transparent" />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#0E0B09]/90 text-[#FFE59E] text-[10px] font-extrabold uppercase tracking-wider border border-[#D4AF37]">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-4 text-[11px] text-[#6B5740] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8C6518]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6518]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0E0B09] group-hover:text-[#8C6518] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C4934] font-light leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/35 flex items-center justify-between text-xs">
                  <Link
                    href="/shop"
                    className="font-extrabold text-[#0E0B09] flex items-center gap-1.5 group-hover:text-[#8C6518] transition-colors uppercase tracking-wider"
                  >
                    Explore Handlooms <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
