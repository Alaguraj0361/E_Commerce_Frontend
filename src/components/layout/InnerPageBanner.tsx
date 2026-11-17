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
      className={`relative w-full h-[450px] overflow-hidden flex items-center justify-center border-b-2 border-[#D4AF37] shadow-md sm:shadow-[0_12px_36px_rgba(20,2,14,0.35)] select-none isolate ${className}`}
    >
      {/* 1. Background Banner Image (Exactly 450px Height) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          unoptimized
          className={`object-cover ${imagePosition}`}
        />

        {/* Multi-Layer Royal Plum & 24K Gold Cinematic Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,2,11,0.75) 0%, rgba(42,4,26,0.68) 48%, rgba(12,1,8,0.88) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 45%, rgba(212,175,55,0.22) 0%, transparent 68%), radial-gradient(ellipse at 50% 0%, rgba(255,244,194,0.15) 0%, transparent 55%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
      </div>

      {/* 2. Architectural 24K Gold Filigree Hairline Frame & Corner Brackets */}
      <div className="hidden sm:block absolute inset-4 lg:inset-6 border border-[#FFE59E]/25 rounded-2xl pointer-events-none z-10">
        <span className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#FFE59E] rounded-tl-sm shadow-xs" />
        <span className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#FFE59E] rounded-tr-sm shadow-xs" />
        <span className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#FFE59E] rounded-bl-sm shadow-xs" />
        <span className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#FFE59E] rounded-br-sm shadow-xs" />
      </div>

      {/* 3. Central Banner Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-3.5 my-auto">
        {/* Top Kicker Pill */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#4A0A30]/90 via-[#2E041E]/95 to-[#4A0A30]/90 border border-[#D4AF37]/80 text-[#FFE59E] text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <NalmaraEmblem className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
            <span>{badge}</span>
            <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
          </div>
        )}

        {/* Breadcrumb Trail */}
        {breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center flex-wrap gap-1.5 text-xs text-[#FFE59E]/85 font-medium"
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
                  <span className="text-[#FFFDF9] font-semibold">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Grand Page Title */}
        <h1 className="font-serif font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[50px] text-[#FFFDF9] tracking-tight uppercase leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          {title}{' '}
          {titleHighlight && (
            <span className="font-script italic font-normal text-3xl sm:text-5xl md:text-[58px] normal-case bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent block sm:inline sm:ml-2">
              {titleHighlight}
            </span>
          )}
        </h1>

        {/* 24K Gold Ornamental Divider */}
        <div className="flex items-center justify-center gap-2.5 my-1">
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#B88228]" />
          <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9]/60 shrink-0" />
          <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#B88228]" />
        </div>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="text-xs sm:text-sm md:text-[15px] text-[#FAF0DD]/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            {subtitle}
          </p>
        )}

        {/* Optional Extra Elements (Search input, category pills, etc.) */}
        {children && <div className="w-full pt-1">{children}</div>}
      </div>
    </section>
  );
}

