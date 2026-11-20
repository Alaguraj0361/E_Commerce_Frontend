'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Gem,
  CheckCircle2,
  Scissors,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Clock,
  Crown,
  Layers,
} from 'lucide-react';
import { LotusIcon, NalmaraEmblem } from '@/components/ui/BrandLogo';
import { InnerPageBanner } from '@/components/layout/InnerPageBanner';

interface AboutHeroSlide {
  id: string;
  kicker: string;
  line1: string;
  line2: string;
  subtitle: string;
  description: string;
  image: string;
  pills: string[];
  statValue: string;
  statLabel: string;
}

const ABOUT_HERO_SLIDES: AboutHeroSlide[] = [
  {
    id: 'heritage-1',
    kicker: 'ABOUT US • THOOTHUKUDI, TAMIL NADU',
    line1: 'ABOUT US',
    line2: 'OUR ROYAL HERITAGE',
    subtitle: 'TRADITION WOVEN IN 24K ELEGANCE',
    description:
      'Born in the pearl city of Thoothukudi, NALMARA FASHION curates authentic Kanchipuram pattu sarees, soft silks, Chettinad cottons, festive lehengas, and bespoke tailoring at honest boutique prices.',
    image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
    pills: ['Direct Weaver Sourcing', 'Master Tailor Atelier', '500+ Happy Families'],
    statValue: '500+',
    statLabel: 'Families Dressed Across Tamil Nadu',
  },
  {
    id: 'heritage-2',
    kicker: 'DIRECT FROM TAMIL NADU WEAVING HUBS',
    line1: 'AUTHENTIC LOOM',
    line2: 'SILK CURATION',
    subtitle: 'KANCHIPURAM • ELAMPILLAI • MADURAI • CHETTINAD',
    description:
      'Every saree in our collection is handpicked directly from master weavers—personally inspected for pure zari lustre, feather-soft drape, and full 6.3-meter length with contrast blouse piece.',
    image: '/images/nalmara/hd/prod_kanchipuram_saree_hd.jpg',
    pills: ['Full 6.3m Verified Length', 'Zero Middleman Markup', '5-Step Quality Check'],
    statValue: '100%',
    statLabel: 'Hand-Checked Before Gift Packaging',
  },
  {
    id: 'heritage-3',
    kicker: 'IN-HOUSE BESPOKE TAILORING HOUSE',
    line1: 'MASTER AARI &',
    line2: 'COUTURE ATELIER',
    subtitle: 'SCULPTED FIT • HANDCRAFTED ZARDOZI & KUNDAN',
    description:
      'From intricate Muhurtham bridal Aari work blouses to princess-cut saree blouses and custom kalidar lehengas, our Thoothukudi master tailors craft garments that fit like a second skin.',
    image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
    pills: ['Hand Aari & Zardozi', 'Pure Mulmul Lining', 'Free Alteration Support'],
    statValue: '6 Specialized',
    statLabel: 'Dedicated Bespoke Stitching Studios',
  },
  {
    id: 'heritage-4',
    kicker: 'CELEBRATING EVERY GENERATION',
    line1: 'KIDS PATTU &',
    line2: 'FESTIVE COUTURE',
    subtitle: 'PAVADAI SATTAI • BIRTHDAY GOWNS • HALF SAREES',
    description:
      'We dress little princesses in skin-friendly mulmul-lined Pattu Pavadai Sattai, organza birthday ball gowns, and traditional Langa Dhavani sets with hidden grow-with-child seam margins.',
    image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
    pills: ['Zero-Itch Cotton Lining', '2.5" Growth Seam Margin', 'Mom & Daughter Sets'],
    statValue: '4.9 ★',
    statLabel: 'Customer Satisfaction Rating',
  },
];

const CRAFT_JOURNEY_STEPS = [
  {
    step: '01',
    tag: 'LOOM SELECTION',
    title: 'Direct Weaver Partnerships',
    description:
      'We travel directly to weaving clusters in Kanchipuram, Elampillai, Sungudi Madurai, and Chettinad to hand-select authentic weaves without showroom middlemen.',
    highlight: 'Honest Weaver-Direct Pricing',
  },
  {
    step: '02',
    tag: 'QUALITY ASSURANCE',
    title: '5-Point Hand Inspection',
    description:
      'Every saree and fabric undergoes a strict 5-point check under natural daylight for zari border alignment, weave density, color fastness, and full 6.3m measurement.',
    highlight: 'Zero Defect Guarantee',
  },
  {
    step: '03',
    tag: 'BESPOKE TAILORING',
    title: 'Master Aari & Fit Atelier',
    description:
      'Our in-house Thoothukudi tailoring studio crafts custom bridal Aari blouses, princess-cut saree blouses, kids pattu pavadai, and flared lehengas to your exact measurements.',
    highlight: 'Pre-Washed Pure Mulmul Lining',
  },
  {
    step: '04',
    tag: 'ROYAL DISPATCH',
    title: 'Signature Gift Box Delivery',
    description:
      'Folded in protective butter paper inside our royal Nalmara gift box and dispatched with live tracking—reaching homes across Tamil Nadu in 2–5 business days.',
    highlight: '2–5 Days Express TN Shipping',
  },
];

const SIGNATURE_ATELIER_PILLARS = [
  {
    title: 'Kanchipuram & Bridal Silks',
    subtitle: 'Rich Korvai Borders & Temple Zari Weaves',
    image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
    href: '/shop',
    cta: 'Explore Sarees',
    tag: 'READY TO WEAR',
  },
  {
    title: 'Bridal Aari & Blouse Stitching',
    subtitle: 'Hand Zardozi, Temple Cutwork & Princess Fit',
    image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
    href: '/stitching-services/bridal-designer-blouses',
    cta: 'Book Bridal Blouse',
    tag: 'BESPOKE ATELIER',
  },
  {
    title: 'Pattu Pavadai & Kids Couture',
    subtitle: 'Traditional Box-Pleat Pavadai & Birthday Gowns',
    image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
    href: '/stitching-services/pavadai-sattai-pattu-pavadai',
    cta: 'Customize Kids Wear',
    tag: 'KIDS HERITAGE',
  },
  {
    title: 'Lehenga Choli & Half Sarees',
    subtitle: '16-Kali Bridal Flare & Pre-Pleated Dhavani Sets',
    image: '/images/nalmara/hd/cat_lehengas_hd.jpg',
    href: '/stitching-services/lehenga-choli-half-saree',
    cta: 'Customize Lehenga',
    tag: 'FESTIVE COUTURE',
  },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animTick, setAnimTick] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  useEffect(() => {
    if (prevIndex === null) return;
    const timer = setTimeout(() => setPrevIndex(null), 1080);
    return () => clearTimeout(timer);
  }, [prevIndex, animTick]);

  useEffect(() => {
    if (isHeroHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((curr) => {
        const next = (curr + 1) % ABOUT_HERO_SLIDES.length;
        setPrevIndex(curr);
        setAnimTick((t) => t + 1);
        return next;
      });
    }, 5600);
    return () => clearInterval(interval);
  }, [isHeroHovered]);

  const goToSlide = (idx: number) => {
    const normalized =
      ((idx % ABOUT_HERO_SLIDES.length) + ABOUT_HERO_SLIDES.length) %
      ABOUT_HERO_SLIDES.length;
    if (normalized !== currentIndex) {
      setPrevIndex(currentIndex);
      setCurrentIndex(normalized);
      setAnimTick((t) => t + 1);
    }
  };

  const activeSlide = ABOUT_HERO_SLIDES[currentIndex] || ABOUT_HERO_SLIDES[0];
  const outgoingSlide = prevIndex !== null ? ABOUT_HERO_SLIDES[prevIndex] : null;

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B] overflow-x-hidden select-none">
      {/* =================================================================== */}
      {/* 01. ROYAL 450PX HERO BANNER */}
      <InnerPageBanner
        title="Our Royal"
        titleHighlight="Heritage"
        badge="ABOUT US • THOOTHUKUDI, TAMIL NADU"
        image="/images/nalmara/hd/festive_panoramic_master.jpg"
        subtitle="Born in the pearl city of Thoothukudi, NALMARA FASHION curates authentic Kanchipuram pattu sarees, soft silks, Chettinad cottons, and bespoke Aari tailoring at honest boutique prices."
        breadcrumb={[{ label: 'About Us' }]}
      />

      {/* =================================================================== */}
      {/* 02. IMPERIAL ROYAL #760159 & 24K GOLD HERITAGE METRICS RIBBON       */}
      {/* =================================================================== */}
      <section className="relative bg-gradient-to-r from-[#54013F] via-[#760159] to-[#54013F] border-b-2 border-[#D4AF37] py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              value: '500+',
              label: 'Happy Tamil Nadu Families',
              sub: 'Repeat Bridal & Festive Patrons',
            },
            {
              value: '2–5 Days',
              label: 'Express TN Dispatch',
              sub: 'Packed in Signature Royal Gift Box',
            },
            {
              value: '4.9 ★',
              label: 'Verified Boutique Rating',
              sub: 'Loved for Fit & Pure Zari Finish',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-[1.5px] bg-gradient-to-b from-[#FFF4C2]/80 via-[#D4AF37]/60 to-[#8C5818]/50 shadow-lg"
            >
              <div className="h-full rounded-[14px] bg-[#430132]/95 px-4 py-4 sm:px-5 sm:py-5 text-center flex flex-col items-center justify-center">
                <span className="font-serif text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-[#FFFDF9] mt-1">
                  {stat.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#FFE59E]/75 mt-0.5">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 03. OUR ROYAL HERITAGE STORY (ASYMMETRIC ARCHED COUTURE COLLAGE)    */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left 6 Cols: Dual-Frame Royal Arch & Aari Atelier Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Primary Royal Arch Portrait Frame */}
              <div className="relative w-full sm:w-[82%] h-[420px] sm:h-[510px] rounded-t-[180px] rounded-b-3xl p-[3px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_55px_rgba(40,6,25,0.24)]">
                <div className="relative w-full h-full rounded-t-[177px] rounded-b-[21px] overflow-hidden bg-[#280619]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/nalmara/hd/prod_designer_saree_hd.jpg"
                    alt="Nalmara Fashion Royal Silk Heritage"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#280619]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#760159]/90 border border-[#FFE59E] text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
                      <Crown className="w-3 h-3" />
                      <span>THOOTHUKUDI FLAGSHIP ATELIER</span>
                    </span>
                    <p className="font-serif text-lg sm:text-xl font-bold text-[#FFFDF9] mt-1.5">
                      Handpicked Silks &amp; Master Tailoring Under One Roof
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Overlapping Gold-Framed Aari Craft Card (Bottom Right) */}
              <div className="relative sm:absolute mt-5 sm:mt-0 sm:-bottom-8 sm:right-0 w-full sm:w-[56%] rounded-2xl p-[2.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_20px_45px_rgba(40,6,25,0.28)]">
                <div className="rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-3.5">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37]/60 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/nalmara/hd/stitching_blouse_hd.jpg"
                      alt="Master Aari Embroidery"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#760159]/90 border border-[#FFE59E] text-[8.5px] font-bold uppercase tracking-wider text-[#FFE59E]">
                      IN-HOUSE TAILORING
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#280619]">
                    <Award className="w-4 h-4 text-[#9E1946] shrink-0" />
                    <span className="font-serif text-xs sm:text-sm font-bold">
                      Bespoke Bridal &amp; Festive Fit
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C3D1E] mt-0.5 leading-snug">
                    Handcrafted Zardozi, Kundan &amp; Princess-Cut tailoring by Thoothukudi master artisans.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Editorial Heritage Narrative & Founder's Promise */}
          <div className="lg:col-span-6 space-y-6 pt-4 sm:pt-8 lg:pt-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#D4AF37] text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
                <Sparkles className="w-3 h-3" />
                <span>FROM THOOTHUKUDI TO ALL OF TAMIL NADU</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#220915] font-bold leading-[1.12]">
                Where South Indian Loom Tradition Meets{' '}
                <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#4A0B32] via-[#9E1946] to-[#B88228]">
                  Bespoke Couture
                </span>
              </h2>
            </div>

            <p className="text-xs sm:text-[14.5px] text-[#3F251A] leading-[1.75] font-medium">
              At <strong className="text-[#280619]">NALMARA FASHION</strong> in Thoothukudi, we started with a simple belief: every woman and child deserves to wear authentic, showroom-grade silk sarees and custom-fitted traditional wear for weddings, temple festivals, and family milestones without paying inflated middleman markups.
            </p>

            <p className="text-xs sm:text-[14.5px] text-[#3F251A] leading-[1.75]">
              We partner directly with heritage weaving families across <strong>Kanchipuram, Elampillai, Madurai, and Chettinad</strong>, and pair our handpicked collections with our own <strong>in-house Master Tailoring &amp; Aari Embroidery Atelier</strong>—so your saree, bridal blouse, kids pattu pavadai, or lehenga arrives ready to wear with a flawless royal fit.
            </p>

            {/* Framed Founder's Quote Plaque */}
            <div className="rounded-2xl p-[2px] bg-gradient-to-r from-[#D4AF37] via-[#FFE59E] to-[#B88228] shadow-md">
              <div className="rounded-[14px] bg-gradient-to-r from-[#280619] via-[#760159] to-[#280619] p-4 sm:p-5 text-[#FAF0DD]">
                <p className="font-serif italic text-xs sm:text-sm text-[#FFF4C2] leading-relaxed">
                  &ldquo;Every saree we fold and every blouse we stitch is inspected as if it were for our own family celebration. Your design, our craft—stitched and packed with love in Thoothukudi.&rdquo;
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  <span>— NALMARA FASHION ATELIER</span>
                  <span>THOOTHUKUDI, TN</span>
                </div>
              </div>
            </div>

            {/* 4 Gold-Checked Craft Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                'Full 6.3m Sarees with Unstitched Blouse',
                'Direct Weaver Prices — Zero Middlemen',
                '6 Dedicated Custom Stitching Studios',
                'Live WhatsApp Video Saree Selection',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-[#FFFDF9] to-[#FAF0DD] border border-[#D4AF37]/70 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#9E1946] shrink-0" />
                  <span className="text-xs text-[#280619] font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 04. OUR 4-STEP LOOM-TO-WARDROBE CRAFTSMANSHIP JOURNEY               */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-22 bg-gradient-to-b from-[#FAF0DD] via-[#F5E4C3] to-[#FAF0DD] border-y-2 border-[#D4AF37]/65 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1380px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFE59E] mb-2.5">
              <Layers className="w-3 h-3" />
              <span>THE ART OF NALMARA</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#280619]">
              From Heritage Loom to Your Wardrobe
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3D1E] mt-1.5">
              Every garment passes through four meticulous stages of curation, tailoring, and quality assurance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CRAFT_JOURNEY_STEPS.map((item) => (
              <div
                key={item.step}
                className="group rounded-3xl p-[2.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_16px_38px_rgba(40,6,25,0.12)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="h-full rounded-[21px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F2DFBE] p-6 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#760159] text-[#FFE59E] border border-[#D4AF37] text-[9.5px] font-bold uppercase tracking-[0.18em]">
                        {item.tag}
                      </span>
                      <span className="font-serif text-3xl font-bold text-[#D4AF37]/55 group-hover:text-[#9E1946] transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#280619] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4E3629] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#D4AF37]/40 flex items-center gap-2 text-[11px] font-bold text-[#8C5818]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E1946] shrink-0" />
                    <span>{item.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 05. SIGNATURE COLLECTIONS & BESPOKE ATELIER SHOWCASE                */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-22 px-4 sm:px-8 lg:px-12 max-w-[1380px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#760159] to-[#5B0E3D] border border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] mb-2.5">
              <Gem className="w-3 h-3" />
              <span>OUR SIGNATURE WINGS</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#280619]">
              Curated Silks &amp; Custom Tailoring Studios
            </h2>
          </div>
          <Link
            href="/stitching-services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-[#760159] hover:text-[#9E1946]"
          >
            <span>Explore All 6 Stitching Studios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_ATELIER_PILLARS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl p-[2.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_14px_34px_rgba(40,6,25,0.14)] hover:-translate-y-1.5 transition-all duration-300 block"
            >
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="relative h-56 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37]/55 mb-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#760159]/90 border border-[#FFE59E]/80 text-[9px] font-bold uppercase tracking-wider text-[#FFE59E]">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#280619] group-hover:text-[#9E1946] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#5C3D1E] mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#D4AF37]/35 flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#760159]">
                    {card.cta}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#9E1946] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 06. WHY TAMIL NADU FAMILIES TRUST NALMARA (4 LUXURY PROMISE CARDS)  */}
      {/* =================================================================== */}
      <section className="pb-16 sm:pb-22 px-4 sm:px-8 lg:px-12 max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Gem,
              title: 'Handpicked Loom Purity',
              desc: 'We personally verify soft silk, semi-Kanchipuram, pure cotton, and festive weaves for all-day comfort and rich zari finish.',
            },
            {
              icon: HeartHandshake,
              title: 'Honest Boutique Pricing',
              desc: 'Direct sourcing from Tamil Nadu weaving looms to our Thoothukudi boutique means showroom quality at fair family prices.',
            },
            {
              icon: Sparkles,
              title: 'Live WhatsApp Video Shopping',
              desc: 'Want to see the exact saree drape and zari border in natural light? Message +91 63831 63609 for a live video preview.',
            },
            {
              icon: ShieldCheck,
              title: 'Gift Box & Alteration Care',
              desc: 'Every order arrives in a neat gift box, and all custom-stitched garments include generous interior margin seams.',
            },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-6 sm:p-7 rounded-3xl border-2 border-[#D4AF37]/75 shadow-[0_14px_34px_rgba(56,7,37,0.08)] space-y-3.5 hover:border-[#D4AF37] hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#760159] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[#FFE59E]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#280619]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#5C3D1E] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 07. ROYAL THOOTHUKUDI CONCIERGE & LIVE VIDEO CALL CTA BANNER        */}
      {/* =================================================================== */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        <div className="rounded-3xl p-[3px] bg-gradient-to-r from-[#B88228] via-[#FFF2B8] to-[#B88228] shadow-[0_24px_55px_rgba(40,6,25,0.24)]">
          <div className="relative rounded-[22px] bg-gradient-to-r from-[#240315] via-[#3E0829] to-[#240315] p-7 sm:p-12 lg:p-14 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9]/10 border border-[#FFE59E]/60 text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.22em]">
                <LotusIcon className="w-4 h-3.5 text-[#FFE59E]" />
                <span>EXPERIENCE NALMARA FASHION</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#FFFDF9] leading-tight">
                Ready to Find Your Perfect Saree or Custom-Stitched Ensemble?
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF0DD]/85 leading-relaxed">
                Explore our live online collections, book bespoke tailoring with collection-specific measurements, or connect with our Thoothukudi team on WhatsApp at{' '}
                <strong className="text-[#FFE59E]">+91 63831 63609</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0 relative z-10">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                <span>Shop All Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20would%20like%20to%20explore%20your%20sarees%20and%20stitching%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#15803D] hover:bg-[#166534] text-white border border-[#FFE59E]/60 font-serif font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
