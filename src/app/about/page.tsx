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
  title: 'About Us | NALMARA FASHION • Luxury Ethnic Wear & Couture',
  description:
    'Discover the story of NALMARA FASHION. Where ancient Indian handloom heritage meets contemporary royal couture. Empowering master artisans across India.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. HERO SECTION (Deep Royal Wine & Gold Filigree) */}
      <section className="relative overflow-hidden bg-[#2D070C] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        {/* Subtle decorative gold glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E6BE] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5 text-[#D4AF37]" />
            <span>The Atelier Story</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Where Ancient Heritage Meets Modern Royalty
          </h1>

          <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed max-w-2xl mx-auto">
            NALMARA FASHION was born from an unyielding passion for India&apos;s timeless textile legacy. 
            We weave the royal grandeur of historic dynasties into contemporary couture for the discerning connoisseur.
          </p>

          {/* Breadcrumb */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:underline text-zinc-300">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">About Us</span>
          </div>
        </div>
      </section>

      {/* 2. OUR GENESIS & BRAND STORY */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Imagery Grid */}
          <div className="relative">
            <div className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border-2 border-[#E8E2D5] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="Artisan weaving silk saree on traditional loom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl max-w-xs space-y-1">
              <div className="flex items-center gap-2 text-[#4A0E17]">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-wider">Heritage Certified</span>
              </div>
              <p className="text-xs text-zinc-600 font-light">
                Preserving authentic handloom weaving traditions since inception.
              </p>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D2D]">
                OUR ORIGINS
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#4A0E17] font-bold leading-tight">
                Born From the Whispers of Golden Looms
              </h2>
            </div>

            <p className="text-sm text-zinc-600 font-light leading-relaxed">
              Every saree in our collection is not merely an outfit; it is a tapestry of patience, heritage, and artistic devotion. 
              From the temple corridors of Kanchipuram to the ethereal mist of Varanasi, our master artisans dedicate weeks—sometimes months—to 
              a single weave.
            </p>

            <p className="text-sm text-zinc-600 font-light leading-relaxed">
              Our founder envisioned a couture house where age-old craft does not compromise with modern aesthetics. 
              We curate pure zari threads, authentic Mulberry silks, and natural dyes to bring you garments worthy of becoming treasured family heirlooms.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-700 font-medium">100% Authentic Handloom Silk Marks</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-700 font-medium">Fair Trade & Ethical Artisan Wages</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-700 font-medium">Tested Pure Gold & Silver Zari</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-700 font-medium">Bespoke Bridal Couture Services</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="py-16 sm:py-24 bg-[#F2EDE4] border-y border-[#D4AF37]/30 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[1560px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D2D]">
              THE NALMARA FASHION PROMISE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4A0E17] font-bold">
              The Four Pillars of Our Atelier
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-2xl border-2 border-[#E8E2D5] shadow-md space-y-4 hover:border-[#D4AF37] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#4A0E17] transition-colors">Purest Raw Silks</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                We select exclusively certified silk fibers woven with genuine tested zari threads that hold their royal sheen for decades.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-2xl border-2 border-[#E8E2D5] shadow-md space-y-4 hover:border-[#D4AF37] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#4A0E17] transition-colors">Artisan Empowerment</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                By eliminating exploitative middlemen, NALMARA FASHION ensures fair trade livelihoods for over 400 weaver clusters across India.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-2xl border-2 border-[#E8E2D5] shadow-md space-y-4 hover:border-[#D4AF37] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#4A0E17] transition-colors">Bespoke Hand Embroidery</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Every embellishment is hand-embroidered by master kaarigars, creating singular works of wearable art.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-7 rounded-2xl border-2 border-[#E8E2D5] shadow-md space-y-4 hover:border-[#D4AF37] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-[#4A0E17] transition-colors">Quality Assurance</h3>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Every garment undergoes a rigorous 5-stage quality audit before being sealed in our signature gold-embossed royal box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS & IMPACT */}
      <section className="py-14 sm:py-20 bg-[#2D070C] text-white border-y border-[#D4AF37]/30">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#D4AF37]/20">
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#F5E6BE]">10,000+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Connoisseurs Worldwide</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#F5E6BE]">400+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Master Artisan Families</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#F5E6BE]">18+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Heritage Weaving Guilds</p>
            </div>
            <div className="space-y-2 pt-4 lg:pt-0">
              <p className="font-serif text-3xl sm:text-5xl font-bold text-[#F5E6BE]">4.9 / 5.0</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">Google Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <LotusIcon className="w-12 h-10 text-[#D4AF37] mx-auto" />
        <h2 className="font-serif text-3xl sm:text-4xl text-[#4A0E17] font-bold">
          Step Into the World of NALMARA FASHION Royalty
        </h2>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto font-light">
          Explore our handcrafted bridal lehengas, pure silk sarees, and bespoke couture crafted for your unforgettable celebrations.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#4A0E17] hover:bg-[#5E141F] text-white border-2 border-[#D4AF37] shadow-xl text-xs font-bold uppercase tracking-widest transition-all group"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
