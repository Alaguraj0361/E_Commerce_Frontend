import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Award,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Gem,
  CheckCircle2,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'About Us | EFFIDOO • Luxury Ethnic Wear & Couture',
  description:
    'Discover the story of EFFIDOO. Where ancient Indian handloom heritage meets contemporary royal couture. Empowering master artisans across India.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION (Deep Royal Emerald & Gold Filigree) */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        {/* Subtle decorative gold glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>The Atelier Story</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Where Ancient Heritage Meets Modern Royalty
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            EFFIDOO was born from an unyielding passion for India&apos;s timeless textile legacy. 
            We weave the royal grandeur of historic dynasties into contemporary couture for the discerning connoisseur.
          </p>

          {/* Breadcrumb */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">About Us</span>
          </div>
        </div>
      </section>

      {/* 2. OUR GENESIS & BRAND STORY */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Imagery Grid */}
          <div className="relative">
            <div className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="EFFIDOO Royal Silk Heritage"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061811]/70 via-transparent to-transparent" />
              
              {/* Floating Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-[#061811]/90 backdrop-blur-md border border-[#D4AF37]/40 text-white space-y-1.5 shadow-xl">
                <p className="font-serif text-base italic text-[#E5C07B]">
                  &ldquo;A saree is not merely six yards of fabric; it is a tapestry woven with centuries of royal soul.&rdquo;
                </p>
                <p className="text-[11px] text-zinc-300 uppercase tracking-widest font-semibold">
                  — The EFFIDOO Philosophy
                </p>
              </div>
            </div>

            {/* Subtle decorative gold corner motif */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/60 rounded-tl-3xl pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]/60 rounded-br-3xl pointer-events-none" />
          </div>

          {/* Right: Narrative */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                AUTHENTIC CRAFTSMANSHIP
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2518] font-bold leading-snug">
                Honoring 5,000 Years of Indian Weaving Mastery
              </h2>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              At EFFIDOO, every thread tells an epochal tale. From the sacred ghats of Varanasi where master weavers spin pure Mulberry silk and gold zari brocades, to the heritage temple looms of Kanchipuram and the royal courts of Maheshwar — we curate the finest authentic handcrafted textiles in the subcontinent.
            </p>

            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
              Unlike mass-manufactured fast fashion, every EFFIDOO ensemble is slow-crafted by generational artisans. Our lehengas, sarees, and couture garments embody weeks of painstaking hand-embroidery — including genuine Zardozi, Aari needlework, and delicate Gota Patti motifs.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">100% Pure Silks</h4>
                  <p className="text-xs text-zinc-600">Mulberry, Tussar, Chanderi & Organza</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Master Artisans</h4>
                  <p className="text-xs text-zinc-600">Empowering 400+ generational weaver families</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Heirloom Quality</h4>
                  <p className="text-xs text-zinc-600">Crafted to be cherished across generations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Ethical Fair Trade</h4>
                  <p className="text-xs text-zinc-600">Direct artisan support with dignified wages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="py-16 sm:py-24 bg-[#F2EDE4] border-y border-[#D4AF37]/20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
              THE EFFIDOO PROMISE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2518] font-bold">
              The Four Pillars of Our Atelier
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-4 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B2518]">Purest Raw Silks</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We select exclusively certified silk fibers woven with genuine tested zari threads that hold their royal sheen for decades.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-4 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B2518]">Artisan Empowerment</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                By eliminating exploitative middlemen, EFFIDOO ensures fair trade livelihoods for over 400 weaver clusters across India.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-4 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B2518]">Bespoke Hand Embroidery</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every embellishment is hand-embroidered by master kaarigars, creating singular works of wearable art.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-7 rounded-2xl border border-[#D4AF37]/30 shadow-md space-y-4 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0B2518]">Quality Assurance</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every garment undergoes a rigorous 5-stage quality audit before being sealed in our signature gold-embossed royal box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS & IMPACT */}
      <section className="py-14 sm:py-20 bg-[#061811] text-white border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#D4AF37]/20">
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#E5C07B]">10,000+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Connoisseurs Worldwide</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#E5C07B]">400+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Master Artisan Families</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#E5C07B]">18+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Heritage Weaving Guilds</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#E5C07B]">4.9 / 5.0</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Google Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <LotusIcon className="w-12 h-10 text-[#B8860B] mx-auto" />
        <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2518] font-bold">
          Step Into the World of EFFIDOO Royalty
        </h2>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto">
          Explore our handcrafted bridal lehengas, pure silk sarees, and bespoke couture crafted for your unforgettable celebrations.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#061811] hover:bg-[#0A261B] text-[#FAF8F5] border border-[#D4AF37] shadow-xl text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4 text-[#E5C07B] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
