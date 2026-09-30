import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'The Royal Journal | NALMARA FASHION • Handloom Heritage & Couture Chronicles',
  description:
    'Immerse yourself in articles on authentic Indian handlooms, bridal couture trends, pure silk care, and generational artisan stories.',
};

const ARTICLES = [
  {
    slug: 'sacred-heritage-of-kanchipuram-pure-silk',
    title: 'The Sacred Heritage of Kanchipuram: Weaving Gold Zari and Eternity',
    category: 'Handloom Heritage',
    readTime: '5 min read',
    date: 'September 28, 2026',
    excerpt:
      'Unravel the timeless artistry of Tamil Nadu’s temple weavers, where pure Mulberry silk intertwines with silver and gold electroplated zari to craft heirlooms passed through generations.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    slug: 'bridal-lehengas-royal-velvet-zardozi',
    title: 'Bridal Couture 2026: The Resurgence of Royal Velvet and Pure Zardozi',
    category: 'Bridal Trends',
    readTime: '6 min read',
    date: 'September 22, 2026',
    excerpt:
      'Discover why contemporary brides are turning toward deep jewel tones, Mughal-inspired motifs, and intricate French wire needlework for their sacred ceremonies.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    slug: 'timeless-saree-draping-styles',
    title: '5 Timeless Saree Draping Styles for Modern Celebrations',
    category: 'Styling Guides',
    readTime: '4 min read',
    date: 'September 15, 2026',
    excerpt:
      'From the regal pleated pallu of royal courts to effortless fusion belts and cape accents, elevate your ethnic presence with our master stylist guide.',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    slug: 'pure-silk-and-zari-care-guide',
    title: 'How to Care for Pure Mulberry Silk & Zari: A Connoisseur’s Guide',
    category: 'Fabric Care',
    readTime: '4 min read',
    date: 'September 08, 2026',
    excerpt:
      'Essential conservation techniques to keep your handloom drapes radiant for decades. Why muslin wrapping, dry cleaning, and gentle airing safeguard zari sheen.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>The Royal Journal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Chronicles of Craft & Couture
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Stories celebrating Indian textile artistry, bridal heritage, styling wisdom, and generational master weavers.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Journal</span>
          </div>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-3xl border border-[#D4AF37]/25 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image banner */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0E3324]/90 backdrop-blur-sm text-[#E5C07B] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/40">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#061811] group-hover:text-[#B8860B] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#061811] flex items-center gap-1.5 group-hover:text-[#B8860B] transition-colors">
                    Read Chronicle <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <Link
                    href="/shop"
                    className="text-[#B8860B] hover:underline text-[11px] font-medium"
                  >
                    Explore Handlooms →
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
