'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { NalmaraEmblem } from '../ui/BrandLogo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface InnerPageBannerProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  breadcrumb?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
  imagePosition?: string;
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function InnerPageBanner({
  title,
  titleHighlight,
  subtitle,
  badge = 'NALMARA FASHION • THOOTHUKUDI',
  image = '/images/nalmara/hd/hero_panoramic_master.jpg',
  breadcrumb = [],
  children,
  className = '',
  imagePosition = 'object-center',
}: InnerPageBannerProps) {
  return (
    <section
      className={`relative w-full min-h-[340px] sm:min-h-[390px] md:h-[430px] overflow-hidden flex items-center justify-center border-b-2 border-[#D4AF37] shadow-[0_16px_40px_rgba(20,2,14,0.38)] select-none isolate ${className}`}
    >
      {/* 1. Background Banner Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          unoptimized
          className={`object-cover ${imagePosition} scale-[1.02] transition-transform duration-1000 ease-out`}
        />

        {/* Multi-Layer Royal #760159, Dark Ambient Vignette & 24K Gold Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,0,15,0.72) 0%, rgba(118,1,89,0.55) 45%, rgba(16,0,12,0.92) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.22) 0%, rgba(16,2,11,0.6) 65%, rgba(12,1,8,0.95) 100%)',
          }}
        />

        {/* Ambient Vignette & Hairline Gold Edge Highlights */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFE59E] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Architectural 24K Gold Filigree Hairline Frame & Corner Brackets */}
      <div className="hidden sm:block absolute inset-4 lg:inset-6 border border-[#FFE59E]/30 rounded-2xl pointer-events-none z-10">
        <span className="absolute -top-[2px] -left-[2px] w-6 h-6 border-t-2 border-l-2 border-[#FFE59E] rounded-tl-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        <span className="absolute -top-[2px] -right-[2px] w-6 h-6 border-t-2 border-r-2 border-[#FFE59E] rounded-tr-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        <span className="absolute -bottom-[2px] -left-[2px] w-6 h-6 border-b-2 border-l-2 border-[#FFE59E] rounded-bl-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
        <span className="absolute -bottom-[2px] -right-[2px] w-6 h-6 border-b-2 border-r-2 border-[#FFE59E] rounded-br-sm shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
      </div>

      {/* 3. Central Banner Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-3.5 my-auto py-8">
        {/* Top Kicker Pill */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#54013F] via-[#760159] to-[#54013F] border border-[#D4AF37]/85 text-[#FFE59E] text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.24em] uppercase shadow-[0_6px_20px_rgba(0,0,0,0.55)]">
            <NalmaraEmblem className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
            <span>{badge}</span>
            <Sparkles className="w-3 h-3 text-[#FFE59E] gold-flame-glow shrink-0" />
          </div>
        )}

        {/* Breadcrumb Trail */}
        {breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center flex-wrap gap-2 text-[11px] sm:text-xs font-sans tracking-[0.16em] uppercase text-[#FFE59E]/90 font-semibold"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {breadcrumb.map((b, idx) => (
              <React.Fragment key={idx}>
                <span className="text-[#D4AF37]/60">/</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-white transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-[#FFFDF9]">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Grand Page Title (Cinzel Roman Serif with Luminous Gold Shimmer + Bridal Script Font) */}
        <h1 className="font-serif font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[48px] leading-[1.15] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="uppercase tracking-wider bg-gradient-to-r from-[#FFFDF9] via-[#FFE59E] to-[#FFFDF9] bg-clip-text text-transparent">
            {title}
          </span>
          {titleHighlight && (
            <span
              className="font-script font-normal text-3xl sm:text-5xl md:text-[54px] text-[#FCE8C0] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-[1.15] overflow-visible inline-block"
              style={{
                fontFamily: "var(--font-script), 'Great Vibes', Georgia, cursive",
                textTransform: 'capitalize',
                letterSpacing: 'normal',
                fontStyle: 'normal',
              }}
            >
              {toTitleCase(titleHighlight)}
            </span>
          )}
        </h1>

        {/* 24K Gold Triple Jewel Ornamental Divider */}
        <div className="flex items-center justify-center gap-2.5 my-1 w-full max-w-md mx-auto">
          <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#B88228]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] shrink-0" />
          <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9]/80 shadow-[0_0_8px_rgba(212,175,55,0.7)] shrink-0" />
          <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] shrink-0" />
          <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#B88228]" />
        </div>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="text-xs sm:text-sm md:text-[15px] font-sans text-[#FAF0DD]/95 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] tracking-wide">
            {subtitle}
          </p>
        )}

        {/* Optional Extra Elements (Search input, category pills, etc.) */}
        {children && <div className="w-full pt-1">{children}</div>}
      </div>
    </section>
  );
}
