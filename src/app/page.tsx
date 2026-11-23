'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Plus,
  Minus,
  Gem,
  ShieldCheck,
  Headphones,
  Instagram,
  Sparkles,
  Scissors,
  Package,
  RefreshCw,
  MessageCircle,
  CheckCircle2,
  FolderTree,
  Crown,
  Gift,
  User,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCategoryStore } from '../store/categoryStore';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { Category, Product } from '../types';
import { toast } from 'sonner';

// ============================================================================
// IMAGE RESOLUTION HELPERS FOR LIVE API CATEGORIES & PRODUCTS
// ============================================================================
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'https://e-commerce-backend-4c4d.onrender.com';

function resolveMediaUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/images/')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_ORIGIN}${trimmed}`;
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function getCategoryFallbackImage(slugOrName: string = ''): string {
  const key = slugOrName.toLowerCase();
  if (key.includes('blouse') || key.includes('aari')) {
    return '/images/nalmara/hd/cat_blouses_hd.jpg';
  }
  if (key.includes('kid') || key.includes('pattu') || key.includes('frock')) {
    return '/images/nalmara/hd/cat_kidswear_hd.jpg';
  }
  if (
    key.includes('dress') ||
    key.includes('gown') ||
    key.includes('anarkali') ||
    key.includes('party')
  ) {
    return '/images/nalmara/hd/cat_dresses_gowns_hd.jpg';
  }
  if (key.includes('lehenga') || key.includes('bridal') || key.includes('choli')) {
    return '/images/nalmara/hd/cat_lehengas_hd.jpg';
  }
  if (key.includes('kurti') || key.includes('salwar') || key.includes('suit')) {
    return '/images/nalmara/hd/cat_kurti_sets_hd.jpg';
  }
  return '/images/nalmara/hd/cat_sarees_hd.jpg';
}

function getCategoryImage(cat: Category): string {
  const apiImage = resolveMediaUrl(cat.image);
  if (apiImage) return apiImage;
  return getCategoryFallbackImage(`${cat.slug || ''} ${cat.name || ''}`);
}

// ============================================================================
// LUXURY ORNAMENTAL DIVIDERS & CUSTOM SVG EMBLEMS
// ============================================================================
const RoyalCornerMandala = ({ className = 'w-28 h-28' }: { className?: string }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <path
      d="M0 0 L72 0 C54 14, 38 30, 26 52 C14 30, 6 14, 0 0 Z"
      fill="url(#mandalaGold)"
      fillOpacity="0.16"
    />
    <circle cx="0" cy="0" r="88" stroke="#D4AF37" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="0" cy="0" r="68" stroke="#B88228" strokeOpacity="0.35" strokeWidth="1.2" />
    <circle cx="0" cy="0" r="46" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="1.5" />
    <path
      d="M0 18 C18 18, 32 32, 32 50 C14 50, 0 36, 0 18 Z"
      stroke="#B88228"
      strokeOpacity="0.4"
      strokeWidth="1.2"
    />
    <path
      d="M18 0 C18 18, 32 32, 50 32 C50 14, 36 0, 18 0 Z"
      stroke="#B88228"
      strokeOpacity="0.4"
      strokeWidth="1.2"
    />
    <circle cx="48" cy="48" r="3" fill="#D4AF37" fillOpacity="0.55" />
    <circle cx="28" cy="64" r="2.2" fill="#B88228" fillOpacity="0.45" />
    <circle cx="64" cy="28" r="2.2" fill="#B88228" fillOpacity="0.45" />
    <defs>
      <linearGradient id="mandalaGold" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE59E" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8C5818" />
      </linearGradient>
    </defs>
  </svg>
);

const GoogleReviewAvatar = ({
  avatarUrl,
  fullName,
}: {
  avatarUrl?: string;
  fullName: string;
}) => {
  const [hasError, setHasError] = useState(false);

  const isValid =
    !hasError &&
    Boolean(avatarUrl) &&
    typeof avatarUrl === 'string' &&
    avatarUrl.trim().length > 0 &&
    !avatarUrl.includes('happy_faq_reviewer_avatar.png');

  if (!isValid) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-b from-[#4A0A30] via-[#2E041E] to-[#18000E] flex items-center justify-center text-[#FFE59E]">
        <User className="w-6 h-6 text-[#FFE59E]" strokeWidth={1.8} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt={fullName}
      onError={() => setHasError(true)}
      className="w-full h-full rounded-full object-cover object-top"
    />
  );
};

const ScallopedFaqBadge = ({ num }: { num: string }) => (
  <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id={`scallopGrad-${num}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#4A0830" />
          <stop offset="60%" stopColor="#2D031C" />
          <stop offset="100%" stopColor="#12000B" />
        </radialGradient>
        <linearGradient id={`scallopGold-${num}`} x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#FFF4C2" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C5818" />
        </linearGradient>
      </defs>
      <path
        d="M20 2 C22.5 2, 24.5 4, 26.5 5 C28.8 6.2, 31 6.5, 32.5 8.5 C34 10.5, 33.8 12.8, 35 15 C36 17, 38 18.5, 38 20 C38 21.5, 36 23, 35 25 C33.8 27.2, 34 29.5, 32.5 31.5 C31 33.5, 28.8 33.8, 26.5 35 C24.5 36, 22.5 38, 20 38 C17.5 38, 15.5 36, 13.5 35 C11.2 33.8, 9 33.5, 7.5 31.5 C6 29.5, 6.2 27.2, 5 25 C4 23, 2 21.5, 2 20 C2 18.5, 4 17, 5 15 C6.2 12.8, 6 10.5, 7.5 8.5 C9 6.5, 11.2 6.2, 13.5 5 C15.5 4, 17.5 2, 20 2 Z"
        fill={`url(#scallopGrad-${num})`}
        stroke={`url(#scallopGold-${num})`}
        strokeWidth="1.2"
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center font-serif font-bold text-xs sm:text-[13px] text-[#FFE59E] tracking-tight">
      {num}
    </span>
  </div>
);

const GoldSectionHeader = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) => (
  <div className="flex flex-col items-center text-center mb-7 sm:mb-9 relative z-10">
    {badge && (
      <span className="inline-flex items-center gap-2 px-4.5 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#FFE59E]/85 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#FFE59E] mb-2.5 shadow-[0_4px_14px_rgba(56,7,37,0.22)]">
        <Sparkles className="w-3 h-3 text-[#FFE59E] gold-flame-glow" />
        <span>{badge}</span>
        <Sparkles className="w-3 h-3 text-[#FFE59E] gold-flame-glow" />
      </span>
    )}
    <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-3xl">
      {/* Left Ornamental Filigree Line + Triple Jewel */}
      <div className="flex items-center flex-1 max-w-[100px] sm:max-w-[220px]">
        <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C6923A] to-[#8C5818]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] mr-1.5 shrink-0" />
        <span className="w-2 h-2 rotate-45 border border-[#8C5818] mr-1.5 shrink-0" />
        <span className="w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#7A4B0E] border border-[#FFFDF9] shadow-xs shrink-0" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#280619] tracking-wider uppercase px-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
        {title}
      </h2>

      {/* Right Ornamental Filigree Line + Triple Jewel */}
      <div className="flex items-center flex-1 max-w-[100px] sm:max-w-[220px]">
        <span className="w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#7A4B0E] border border-[#FFFDF9] shadow-xs shrink-0" />
        <span className="w-2 h-2 rotate-45 border border-[#8C5818] ml-1.5 shrink-0" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] ml-1.5 shrink-0" />
        <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C6923A] to-[#8C5818]" />
      </div>
    </div>

    {subtitle && (
      <p className="text-xs sm:text-sm text-[#5A342E] font-medium mt-1.5 tracking-wide italic font-serif">
        {subtitle}
      </p>
    )}
  </div>
);

const VintageSewingMachineIcon = ({ className = 'w-11 h-9' }: { className?: string }) => (
  <svg viewBox="0 0 64 48" fill="none" className={className}>
    <rect x="6" y="38" width="52" height="5" rx="2.5" fill="url(#goldGradMachine)" stroke="#2A1208" strokeWidth="1.5" />
    <path
      d="M46 38V14C46 10.5 43 8 39 8H18C14.5 8 12 10.5 12 14V24H18V16C18 14.8 19 14 20.2 14H34C36.2 14 38 15.8 38 18V38H46Z"
      fill="#260E07"
      stroke="#D4AF37"
      strokeWidth="1.6"
    />
    <path d="M21 11H35" stroke="#FFE59E" strokeWidth="2" strokeLinecap="round" />
    <circle cx="28" cy="11" r="1.6" fill="#FFE59E" />
    <rect x="38" y="3" width="4" height="5" rx="1" fill="#D4AF37" stroke="#260E07" strokeWidth="0.8" />
    <circle cx="49" cy="20" r="6.2" fill="url(#goldGradMachine)" stroke="#260E07" strokeWidth="1.8" />
    <circle cx="49" cy="20" r="2" fill="#260E07" />
    <line x1="15" y1="24" x2="15" y2="37" stroke="#260E07" strokeWidth="2.2" />
    <line x1="11" y1="37" x2="19" y2="37" stroke="#260E07" strokeWidth="2.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="goldGradMachine" x1="6" y1="8" x2="58" y2="43" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF2C2" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8E6015" />
      </linearGradient>
    </defs>
  </svg>
);

const MannequinDummyIcon = ({ className = 'w-9 h-9' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="6" r="2.2" fill="#9E6B18" />
    <path d="M22 8H26L27 11H21L22 8Z" fill="#9E6B18" />
    <path
      d="M15 12C15 12 18 11 24 11C30 11 33 12 33 12L35 18C35 21 31 23 30 26L33 34C28 36 20 36 15 34L18 26C17 23 13 21 13 18L15 12Z"
      fill="url(#dummyGrad)"
      stroke="#784E0D"
      strokeWidth="1.5"
    />
    <path d="M17.5 25.5C21 27 27 27 30.5 25.5" stroke="#FFFDF9" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="35" x2="24" y2="43" stroke="#784E0D" strokeWidth="2.2" />
    <path d="M16 44C19 41.5 29 41.5 32 44" stroke="#784E0D" strokeWidth="2.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="dummyGrad" x1="13" y1="11" x2="35" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF2C2" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#9A6919" />
      </linearGradient>
    </defs>
  </svg>
);

const ThreadSpoolsIllustration = ({ className = 'w-36 h-36' }: { className?: string }) => (
  <svg viewBox="0 0 180 160" fill="none" className={className}>
    <ellipse cx="105" cy="142" rx="64" ry="10" fill="#8C5818" fillOpacity="0.18" />

    <g transform="translate(52, 66)">
      <rect x="2" y="0" width="32" height="7" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
      <rect x="5" y="7" width="26" height="44" rx="2" fill="url(#purpleThread)" />
      <path d="M5 16L31 12M5 24L31 20M5 32L31 28M5 40L31 36M5 48L31 44" stroke="#9B3878" strokeWidth="1.2" strokeOpacity="0.55" />
      <rect x="2" y="51" width="32" height="7" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
    </g>

    <g transform="translate(92, 54)">
      <rect x="2" y="0" width="34" height="7" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
      <rect x="5" y="7" width="28" height="54" rx="2" fill="url(#emeraldThread)" />
      <path d="M5 16L33 12M5 26L33 22M5 36L33 32M5 46L33 42M5 56L33 52" stroke="#32A875" strokeWidth="1.2" strokeOpacity="0.5" />
      <rect x="2" y="61" width="34" height="7" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
    </g>

    <g transform="translate(122, 74)">
      <rect x="2" y="0" width="30" height="6" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
      <rect x="5" y="6" width="24" height="38" rx="2" fill="url(#goldThread)" />
      <path d="M5 14L29 10M5 22L29 18M5 30L29 26M5 38L29 34" stroke="#FFF5C0" strokeWidth="1.2" strokeOpacity="0.65" />
      <rect x="2" y="44" width="30" height="6" rx="3" fill="url(#woodSpool)" stroke="#6B4214" strokeWidth="1" />
    </g>

    <path
      d="M18 136 C38 124, 68 148, 102 136 C132 126, 152 142, 170 132"
      stroke="url(#tapeGrad)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path
      d="M24 134v4M36 133v4M48 135v4M60 138v4M72 140v4M84 139v4M96 137v4M108 134v4M120 133v4M132 134v4M144 135v4"
      stroke="#3D1F08"
      strokeWidth="1.2"
    />

    <defs>
      <linearGradient id="woodSpool" x1="0" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E6BA7E" />
        <stop offset="0.5" stopColor="#FFF0D4" />
        <stop offset="1" stopColor="#B88240" />
      </linearGradient>
      <linearGradient id="purpleThread" x1="5" y1="7" x2="31" y2="7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#42082C" />
        <stop offset="0.45" stopColor="#7C1B58" />
        <stop offset="1" stopColor="#380624" />
      </linearGradient>
      <linearGradient id="emeraldThread" x1="5" y1="7" x2="33" y2="7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#083B26" />
        <stop offset="0.45" stopColor="#146E49" />
        <stop offset="1" stopColor="#062B1B" />
      </linearGradient>
      <linearGradient id="goldThread" x1="5" y1="6" x2="29" y2="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9A6B18" />
        <stop offset="0.5" stopColor="#F5D37E" />
        <stop offset="1" stopColor="#855810" />
      </linearGradient>
      <linearGradient id="tapeGrad" x1="18" y1="130" x2="170" y2="140" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5C84C" />
        <stop offset="0.5" stopColor="#FFE58F" />
        <stop offset="1" stopColor="#D49B26" />
      </linearGradient>
    </defs>
  </svg>
);

// ============================================================================
// BRAND EDITORIAL BANNERS & STOREFRONT SERVICE COPY
// ============================================================================
const HERO_SHOWCASE_FALLBACK = [
  {
    id: 'hero-1',
    name: 'BUTTERFLY GOWN',
    titleLine1: 'BUTTERFLY',
    titleLine2: 'Gown',
    price: 399,
    description:
      'Make your little princess look extra adorable! Elegant Black & Yellow butterfly design with gorgeous floral appliqué work.',
    sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y'],
    image: '/images/nalmara/hero_butterfly_gown.jpg',
    mobileBg: '/images/nalmara/hero_butterfly_gown.jpg',
    slug: 'butterfly-gown',
    sku: 'NLM-KIDS-399',
    badges: [
      { line1: 'BUTTERFLY', line2: 'DESIGN' },
      { line1: 'FLORAL', line2: 'APPLIQUÉ' },
      { line1: 'PREMIUM', line2: 'PARTY WEAR' },
      { line1: 'BIRTHDAYS &', line2: 'PARTIES' },
    ],
  },
  {
    id: 'hero-2',
    name: 'IMPERIAL VELVET PARTY WEAR GOWN',
    titleLine1: 'IMPERIAL VELVET',
    titleLine2: 'Party Wear Gown',
    price: 2999,
    description:
      'Flared floor-length festive gown with gold zari yoke embroidery. Full lining with sleeves & back tassel closure.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_party_wear_gown_hd.jpg',
    mobileBg: '/images/nalmara/mobile_hero_bg_gown.jpg',
    slug: 'imperial-velvet-party-wear-gown',
    sku: 'NLM-384276-943',
    badges: [
      { line1: 'IMPERIAL', line2: 'VELVET' },
      { line1: 'GOLD ZARI', line2: 'YOKE' },
      { line1: 'CUSTOM', line2: 'TAILORED' },
      { line1: 'PARTY', line2: 'WEAR' },
    ],
  },
  {
    id: 'hero-3',
    name: 'BRIDAL ZARDOZI LEHENGA CHOLI',
    titleLine1: 'BRIDAL ZARDOZI',
    titleLine2: 'Lehenga Choli',
    price: 5499,
    description:
      'Handcrafted festive lehenga choli with heavy zari border, tailored blouse with puff sleeves, and sheer organza dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_lehenga_choli_hd.jpg',
    mobileBg: '/images/nalmara/mobile_hero_bg_lehenga.jpg',
    slug: 'bridal-zardozi-lehenga-choli',
    sku: 'NLM-384276-944',
    badges: [
      { line1: 'BRIDAL', line2: 'ZARDOZI' },
      { line1: 'ORGANZA', line2: 'DUPATTA' },
      { line1: 'PUFF SLEEVES', line2: 'BLOUSE' },
      { line1: 'ROYAL', line2: 'COUTURE' },
    ],
  },
  {
    id: 'hero-4',
    name: 'EMERALD SILK FESTIVE KURTI SET',
    titleLine1: 'EMERALD SILK',
    titleLine2: 'Festive Kurti Set',
    price: 1899,
    description:
      'V-neck silk blend kurti with woven gold motifs, three-quarter sleeves with zari cuffs, and matching straight-fit trousers.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_kurti_set_hd.jpg',
    mobileBg: '/images/nalmara/mobile_hero_bg_kurti.jpg',
    slug: 'emerald-silk-festive-kurti-set',
    sku: 'NLM-384276-945',
    badges: [
      { line1: 'EMERALD SILK', line2: '& ZARI' },
      { line1: 'WOVEN', line2: 'MOTIFS' },
      { line1: 'STRAIGHT', line2: 'FIT' },
      { line1: 'FESTIVE', line2: 'ELEGANCE' },
    ],
  },
];

function splitHeadlineTwoLines(name: string): { line1: string; line2: string } {
  const cleanName = name
    .replace(/[*_#~`]+/g, '')
    .replace(/[^\w\s&-]/g, ' ')
    .trim()
    .toUpperCase();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { line1: 'ROYAL SILK', line2: 'Festive Couture Edit' };
  }
  if (words.length === 1) {
    return { line1: `ROYAL ${words[0]}`, line2: 'Festive Couture Edit' };
  }
  if (words.length === 2) {
    return {
      line1: `ROYAL ${words[0]}`,
      line2: `Festive ${words[1]} Collection`,
    };
  }
  if (words.length === 3) {
    return {
      line1: `${words[0]} ${words[1]}`,
      line2: `Festive ${words[2]} Edit`,
    };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
}

function cleanHeroDescription(rawDesc: string | undefined, fallbackDesc: string): string {
  if (!rawDesc || typeof rawDesc !== 'string') return fallbackDesc;
  // Strip markdown symbols, emojis, and noisy promotional banners
  let stripped = rawDesc
    .replace(/[*_#~`>|]+/g, ' ')
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu,
      ' '
    )
    .replace(/new arrival alert!?/gi, ' ')
    .replace(/glam up your every occasion!?/gi, ' ')
    .replace(/grace in every twirl\s*[—–-]?\s*/gi, ' ')
    .replace(/ladies,?\s*your next favourite outfit is here!?/gi, ' ')
    .replace(/\b[A-Z]{4,}\b/g, (word) => word.charAt(0) + word.slice(1).toLowerCase())
    .replace(/\s+/g, ' ')
    .replace(/^[\s—–\-:•.,!]+/, '')
    .trim();

  if (stripped.length < 25) return fallbackDesc;

  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

const STITCHING_ATELIER_CARDS = [
  {
    label: 'Saree Blouse Stitching',
    mobileLabel: 'Saree Blouse Stitching',
    subtitle: 'Princess Cut • Pure Mulmul Lining',
    tag: '2 – 4 Days',
    image: '/images/nalmara/hd/prod_blouse_piece_hd.jpg',
    href: '/stitching-services/saree-blouse-stitching',
  },
  {
    label: 'Bridal & Designer Blouses',
    mobileLabel: 'Bridal & Designer Blouses',
    subtitle: 'Hand Aari, Zardozi & Cutwork',
    tag: 'Bridal Craft',
    image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
    href: '/stitching-services/bridal-designer-blouses',
  },
  {
    label: "Girls' Frocks & Gowns",
    mobileLabel: "Girls' Frocks & Gowns",
    subtitle: 'Birthday Gowns & Soft Cancan',
    tag: 'Kids Couture',
    image: '/images/nalmara/hd/prod_kids_frock_hd.jpg',
    href: '/stitching-services/girls-frocks-gowns',
  },
  {
    label: 'Pavadai Sattai & Pattu Pavadai',
    mobileLabel: 'Pavadai Sattai & Pattu Pavadai',
    subtitle: 'Box-Pleat Pattu & Growth Tuck',
    tag: 'Traditional',
    image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
    href: '/stitching-services/pavadai-sattai-pattu-pavadai',
  },
  {
    label: 'Lehenga Choli & Half Saree',
    mobileLabel: 'Lehenga Choli & Half Saree',
    subtitle: '16-Kali Flare & Pattu Dhavani',
    tag: 'Festive Flair',
    image: '/images/nalmara/hd/cat_lehengas_hd.jpg',
    href: '/stitching-services/lehenga-choli-half-saree',
  },
  {
    label: 'Kurti & Salwar Stitching',
    mobileLabel: 'Kurti & Salwar',
    subtitle: 'Anarkali, Straight Suit & Pants',
    tag: 'Pocket Fit',
    image: '/images/nalmara/hd/cat_kurti_sets_hd.jpg',
    href: '/stitching-services/kurti-salwar-stitching',
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    num: '01',
    category: 'Master Tailoring',
    question: 'What types of stitching services do you offer?',
    answer:
      "We offer Saree Blouse Stitching, Bridal & Designer Aari Work Blouses, Girls' Frocks & Gowns, Pavadai Sattai & Pattu Pavadai, Lehenga Choli & Half Sarees, and Kurti & Salwar Stitching with perfect custom fitting and pure mulmul cotton lining.",
    highlights: ['Princess & Katori Cut', 'Bridal Hand Aari & Zardozi', 'Soft Mulmul Lining'],
  },
  {
    id: 2,
    num: '02',
    category: 'Bespoke Design',
    question: 'Do you provide custom neck designs & WhatsApp measurement support?',
    answer:
      'Yes! You can share your reference neck designs, sleeve patterns, or sample garment measurements on WhatsApp (+91 63831 63609 | +91 78712 07631) and our master tailors in Thoothukudi will craft it to your exact fit.',
    highlights: ['Video Call Assistance', 'Custom Neck & Sleeve Catalogue', 'Exact Fit Guarantee'],
  },
  {
    id: 3,
    num: '03',
    category: 'Express Shipping',
    question: 'What is your delivery time across Tamil Nadu & India?',
    answer:
      'Ready-to-ship silk sarees, kurtis, and festive kidswear reach across Tamil Nadu in 2–5 business days (3–5 days across India). Custom-stitched blouses and bridal outfits are dispatched within 2–5 business days with live tracking.',
    highlights: ['2–5 Days in Tamil Nadu', '3–5 Days Pan-India', 'Free Delivery Above ₹2,999'],
  },
  {
    id: 4,
    num: '04',
    category: 'Saree + Blouse',
    question: 'Can I order a saree with custom blouse stitching & fall-pico done?',
    answer:
      'Absolutely! When ordering any Kanchipuram silk, soft silk, or designer saree, you can opt for ready-to-wear finishing including saree fall & pico edging, tassel (kuchu) knotting, and custom-stitched blouse before dispatch.',
    highlights: ['Fall & Pico Finishing', 'Bridal Tassel Work', 'Ready-to-Drape Delivery'],
  },
  {
    id: 5,
    num: '05',
    category: 'Kids Couture',
    question: "How do you ensure comfort in girls' pattu pavadai & party frocks?",
    answer:
      'Every kidswear outfit is lined with 100% breathable, hypoallergenic soft cotton so zari borders and sequins never touch delicate skin. We also include extra inner seam allowance (growth tuck) so the outfit grows with your child.',
    highlights: ['Skin-Friendly Cotton Lining', 'Extra Growth Seam Margin', 'Featherlight Cancan'],
  },
];

// ============================================================================
// CATEGORY MEDALLION CARD WITH AUTOMATIC IMAGE FALLBACK
// ============================================================================
const CategoryMedallionCard = ({ cat }: { cat: Category }) => {
  const primarySrc = getCategoryImage(cat);
  const fallbackSrc = getCategoryFallbackImage(`${cat.slug || ''} ${cat.name || ''}`);
  const [imgSrc, setImgSrc] = useState<string>(primarySrc);

  useEffect(() => {
    setImgSrc(getCategoryImage(cat));
  }, [cat]);

  const cleanSubtext = React.useMemo(() => {
    if (!cat.description) return 'Explore Collection';
    const stripped = cat.description
      .replace(/[*_~`#>]/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    return stripped.length > 2 ? stripped.slice(0, 24) : 'Explore Collection';
  }, [cat.description]);

  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
    >
      {/* Triple-Bezel 24K Gold Medallion Frame — Strictly 1:1 Perfect Circle Across All Sizes */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 aspect-square shrink-0 rounded-full p-[4px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#855810] shadow-[0_12px_28px_rgba(90,45,15,0.22)] group-hover:shadow-[0_16px_36px_rgba(212,175,55,0.5)] transition-all">
        {/* Top Royal Crown Jewel Stud */}
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#6E450A] shadow-2xs" />
        {/* Inner Gold Filigree Ring */}
        <div className="relative w-full h-full aspect-square rounded-full p-[2px] bg-[#FFF8EB] overflow-hidden">
          <div className="relative w-full h-full aspect-square rounded-full overflow-hidden bg-[#F7E5C8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={cat.name}
              onError={() => {
                if (imgSrc !== fallbackSrc) {
                  setImgSrc(fallbackSrc);
                }
              }}
              className="w-full h-full aspect-square rounded-full object-cover object-top group-hover:scale-110 transition-transform duration-500 block"
            />
            {/* Subtle Bottom Inner Vignette */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#240615]/35 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Overlapping 3D Double-Bordered Cream & Gold Ribbon Plaque */}
      <div className="relative z-10 -mt-4 px-4 py-1.5 min-w-[126px] sm:min-w-[142px] max-w-[165px] rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#E8D2AA] group-hover:from-[#4A0B32] group-hover:via-[#760159] group-hover:to-[#28041A] border-[1.5px] border-[#C8963E] shadow-[0_6px_16px_rgba(90,45,15,0.16)] transition-all">
        <span className="block font-serif font-bold text-xs sm:text-[14px] text-[#23120B] group-hover:text-[#FFE59E] leading-tight truncate transition-colors">
          {cat.name}
        </span>
        <span className="block text-[9.5px] font-medium text-[#7A542E] group-hover:text-[#F5D37E]/85 leading-tight mt-0.5 truncate transition-colors">
          {cleanSubtext}
        </span>
      </div>
    </Link>
  );
};

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [prevHeroSlide, setPrevHeroSlide] = useState<number | null>(null);
  const [heroAnimTick, setHeroAnimTick] = useState(0);
  const [selectedHeroSize, setSelectedHeroSize] = useState<string>('S');
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  // Live API Data States
  const {
    categories,
    isLoading: isCategoriesLoading,
    fetchCategories,
  } = useCategoryStore();
  const [catStartIndex, setCatStartIndex] = useState(0);

  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [prodStartIndex, setProdStartIndex] = useState(0);
  const [bestSellerStartIndex, setBestSellerStartIndex] = useState(0);

  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [googleMeta, setGoogleMeta] = useState<{
    overallRating: number;
    totalReviews: number;
    googleMapsUrl: string;
    googleReviewUrl: string;
  }>({
    overallRating: 5.0,
    totalReviews: 9,
    googleMapsUrl: 'https://g.page/r/CTOKP0LCfhhDEAE/review',
    googleReviewUrl: 'https://g.page/r/CTOKP0LCfhhDEAE/review',
  });
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [reviewStartIndex, setReviewStartIndex] = useState(0);
  const [reviewTouchStartX, setReviewTouchStartX] = useState<number | null>(null);

  const [igPosts, setIgPosts] = useState<any[]>([]);
  const [likedInspire, setLikedInspire] = useState<Record<string, boolean>>({});
  const [instaStartIndex, setInstaStartIndex] = useState(0);

  const { addItem, setIsCartOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // 1. Fetch Live Categories from /categories API
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 2. Fetch Live Products & Live Reviews from Backend API
  useEffect(() => {
    let isMounted = true;

    const loadLiveCatalogAndReviews = async () => {
      setIsProductsLoading(true);
      setIsReviewsLoading(true);

      let fetchedProducts: Product[] = [];
      try {
        const res = await api.get('/products?limit=24&sort=newest');
        const list = res.data?.data?.products || res.data?.data || [];
        if (Array.isArray(list)) {
          fetchedProducts = list;
        }
      } catch {
        fetchedProducts = [];
      }

      if (isMounted) {
        setLiveProducts(fetchedProducts);
        setIsProductsLoading(false);
      }

      // Fetch live verified customer reviews from /reviews API
      let fetchedReviews: any[] = [];
      try {
        const revRes = await api.get('/reviews?limit=6');
        const revList = revRes.data?.data?.reviews || revRes.data?.data || [];
        if (Array.isArray(revList) && revList.length > 0) {
          fetchedReviews = revList;
        }
      } catch {
        // Fallback: if /reviews root route is not yet deployed on remote server, fetch reviews from top rated products
      }

      if (fetchedReviews.length === 0 && fetchedProducts.length > 0) {
        try {
          const productsWithReviews = fetchedProducts
            .filter((p) => (p.reviewCount || 0) > 0)
            .slice(0, 3);
          const reviewPromises = (
            productsWithReviews.length > 0 ? productsWithReviews : fetchedProducts.slice(0, 2)
          ).map((p) =>
            api
              .get(`/reviews/product/${p._id}?limit=3`)
              .then((r) => r.data?.data?.reviews || [])
              .catch(() => [])
          );
          const nested = await Promise.all(reviewPromises);
          fetchedReviews = nested.flat().slice(0, 6);
        } catch {
          fetchedReviews = [];
        }
      }

      if (isMounted) {
        setLiveReviews(fetchedReviews);
        setIsReviewsLoading(false);
      }
    };

    const loadInstagramFeed = async () => {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        if (isMounted && Array.isArray(data?.posts) && data.posts.length > 0) {
          setIgPosts(data.posts);
        }
      } catch {
        // Ignore
      }
    };

    const loadGoogleReviews = async () => {
      try {
        const res = await fetch('/api/google-reviews');
        const data = await res.json();
        if (isMounted && Array.isArray(data?.reviews) && data.reviews.length > 0) {
          setGoogleReviews(data.reviews);
          setGoogleMeta({
            overallRating: Number(data.overallRating) || 5.0,
            totalReviews: Number(data.totalReviews) || (data.reviews?.length ?? 9),
            googleMapsUrl:
              data.googleMapsUrl || 'https://g.page/r/CTOKP0LCfhhDEAE/review',
            googleReviewUrl:
              data.googleReviewUrl || 'https://g.page/r/CTOKP0LCfhhDEAE/review',
          });
        }
      } catch {
        // Ignore
      }
    };

    loadLiveCatalogAndReviews();
    loadInstagramFeed();
    loadGoogleReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // 4 Curated Static Luxury Hero Showcase Products (Static Sliders)
  const heroShowcaseItems = React.useMemo(() => {
    return HERO_SHOWCASE_FALLBACK.slice(0, 4).map((item) => {
      // Find matching live DB product if available by slug or title match
      const matchedProd = liveProducts.find(
        (p) =>
          p.slug === item.slug ||
          (p.name && p.name.toLowerCase().includes(item.titleLine2.toLowerCase()))
      );
      return {
        ...item,
        sizes: item.sizes || ['S', 'M', 'L', 'XL'],
        rawProduct: matchedProd,
      };
    });
  }, [liveProducts]);

  // Unified Slide Transition Handler:
  // Outgoing image arcs along the top half-circle to the right & hides,
  // while the incoming image rises from the bottom into the center showcase.
  const goToHeroSlide = React.useCallback(
    (nextIndexOrUpdater: number | ((prev: number) => number)) => {
      setCurrentHeroSlide((prev) => {
        const total = heroShowcaseItems.length || 5;
        const rawNext =
          typeof nextIndexOrUpdater === 'function'
            ? nextIndexOrUpdater(prev)
            : nextIndexOrUpdater;
        const normalizedNext = ((rawNext % total) + total) % total;
        if (normalizedNext !== prev % total) {
          setPrevHeroSlide(prev % total);
          setHeroAnimTick((t) => t + 1);
        }
        return normalizedNext;
      });
    },
    [heroShowcaseItems.length]
  );

  // Clear outgoing slide layer after the 1050ms 3D half-circle orbital exit animation completes
  useEffect(() => {
    if (prevHeroSlide === null) return;
    const cleanup = setTimeout(() => {
      setPrevHeroSlide(null);
    }, 1080);
    return () => clearTimeout(cleanup);
  }, [prevHeroSlide, heroAnimTick]);

  // Gentle auto-play for Hero Slides every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      goToHeroSlide((prev) => prev + 1);
    }, 6500);
    return () => clearInterval(timer);
  }, [goToHeroSlide]);

  const activeHeroItem =
    heroShowcaseItems[currentHeroSlide % heroShowcaseItems.length] || heroShowcaseItems[0];

  const outgoingHeroItem =
    prevHeroSlide !== null
      ? heroShowcaseItems[prevHeroSlide % heroShowcaseItems.length]
      : null;

  useEffect(() => {
    if (activeHeroItem?.sizes?.length) {
      setSelectedHeroSize(activeHeroItem.sizes[0]);
    }
  }, [currentHeroSlide, activeHeroItem]);

  const visibleCategories =
    categories.length > 6
      ? Array.from({ length: 6 }, (_, i) => categories[(catStartIndex + i) % categories.length])
      : categories;

  // New Arrivals list: strictly from live API products (`liveProducts`), prioritizing `newArrival` flag
  const newArrivalProducts = React.useMemo(() => {
    const flagged = liveProducts.filter((p) => p.newArrival);
    const others = liveProducts.filter((p) => !p.newArrival);
    return [...flagged, ...others];
  }, [liveProducts]);

  // Best Sellers list: strictly from live API products (`liveProducts`), prioritizing `bestSeller` flag + rating
  const bestSellerProducts = React.useMemo(() => {
    const flagged = liveProducts.filter((p) => p.bestSeller);
    const others = liveProducts
      .filter((p) => !p.bestSeller)
      .slice()
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    const merged = [...flagged, ...others];
    if (flagged.length === 0 && merged.length > 5) {
      return [...merged.slice(2), ...merged.slice(0, 2)];
    }
    return merged;
  }, [liveProducts]);

  const visibleNewArrivals =
    newArrivalProducts.length > 5
      ? Array.from(
        { length: 5 },
        (_, i) => newArrivalProducts[(prodStartIndex + i) % newArrivalProducts.length]
      )
      : newArrivalProducts;

  const visibleBestSellers =
    bestSellerProducts.length > 5
      ? Array.from(
        { length: 5 },
        (_, i) =>
          bestSellerProducts[(bestSellerStartIndex + i) % bestSellerProducts.length]
      )
      : bestSellerProducts;

  const allHappyReviews = React.useMemo(() => {
    const defaultGoogleReviews = [
      {
        _id: 'serp-vidhya-b',
        rating: 5,
        comment:
          "Thank you, Nalmara, for this beautiful saree! ❤️ I really loved it. The colour shade is exactly what I expected, and I'm so happy that I received the same colour I had in mind. The quality is really good and totally worth the price. The packaging was neat, and the delivery was also on time. Truly satisfied with the overall experience! 😊✨",
        authorBadge: 'Local Guide • 4 reviews',
        relativeTime: '3 weeks ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'Vidhya',
          lastName: 'B',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjUOKE0PanhBD9XX_QvgxQRK_a2G5J7Femqy7dRiWHqJGekUb0ue=s64-c-rp-mo-br100',
        },
      },
      {
        _id: 'serp-ranjini-priya',
        rating: 5,
        comment:
          'I had a wonderful shopping experience with Nalmara Fashion! ❤️ I purchased a saree for my mom, and the product was absolutely beautiful. The design was lovely, the quality was excellent, and the price was very reasonable. The saree was exactly what I expected, and the delivery was quick and right on time as promised. Highly recommended! 💖✨',
        authorBadge: 'Local Guide • 2 reviews',
        relativeTime: 'a month ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'Ranjini',
          lastName: 'priya',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjURuyIfqgxPq8WV7nzpadG7EgnqVcs4h_mJHilkA_srVviJlZgScg=s64-c-rp-mo-br100',
        },
      },
      {
        _id: 'serp-kalai-selvi',
        rating: 5,
        comment:
          'Recently I came across Nalmara Fashion on Instagram and saw their kurti and saree collections. I ordered a kurti and the experience was beyond expectations! The material, lining, and custom stitching were tailored perfectly to my size. The fabric quality is really good and the fitting & finishing are just perfect 😍💜. Packed beautifully and shipped so quickly!',
        authorBadge: 'Verified Google Reviewer',
        relativeTime: '3 weeks ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'Kalai',
          lastName: 'Selvi',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjXGQdnN_lZdv9dXmp76m2L8iOqSJourUOVvjLQ_G7lcciZ05Ro=s64-c-rp-mo-br100',
        },
      },
      {
        _id: 'serp-jayashree-s',
        rating: 5,
        comment:
          'Love the collection at Nalmara Fashion! Great quality, beautiful styles, and wonderful customer service. Highly recommended!',
        authorBadge: 'Local Guide • 3 reviews',
        relativeTime: '3 weeks ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'Jayashree',
          lastName: 'S',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjVigjwyFIdB2kJj-M0JAyguG6YACPLZySDK4L0Mk91uQ_UeThav=s64-c-rp-mo-br100',
        },
      },
      {
        _id: 'serp-brindha-selvi',
        rating: 5,
        comment:
          "Fabric is soft, color doesn't bleed, border is neat, falls nicely when draped and delivery was on time. Value for money. Thank you! Nalmara Fashion :)",
        authorBadge: 'Local Guide • 2 reviews',
        relativeTime: '3 weeks ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'brindha',
          lastName: 'selvi',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjXNs4wgc_hjDjBImYlL_5u1xsC0Q8YZq4VZGHmWsRO8DXYh49mK=s64-c-rp-mo-br100',
        },
      },
      {
        _id: 'serp-surya-k',
        rating: 5,
        comment:
          'I purchased this saree from Nalmara Fashion for my family. The quality is really good, and the design is beautiful. The saree looks elegant and is worth the price. My family is happy with the purchase. Thank you, Nalmara Fashion! ❤️',
        authorBadge: 'Local Guide • 3 reviews',
        relativeTime: '3 weeks ago',
        reviewUrl: googleMeta.googleReviewUrl,
        isGoogle: true,
        user: {
          firstName: 'Surya',
          lastName: 'K',
          avatar:
            'https://lh3.googleusercontent.com/a-/ALV-UjVWPNYCzlLPqHOWL-OvZDCe1AN0uuHlfF688tHe0EtnotjF50h5=s64-c-rp-mo-br100',
        },
      },
    ];

    const normalizedGoogle =
      googleReviews.length > 0
        ? googleReviews.map((g: any, idx: number) => {
          const parts = String(g.authorName || 'Alagu Raj').split(' ');
          return {
            _id: g.id || `g-rev-${idx}`,
            rating: Number(g.rating) || 5,
            comment: g.comment,
            authorBadge: g.authorBadge || 'Verified Google Review',
            relativeTime: g.relativeTime || 'Recent on Google',
            reviewUrl: g.reviewUrl || googleMeta.googleMapsUrl,
            isGoogle: true,
            user: {
              firstName: parts[0] || 'Alagu',
              lastName: parts.slice(1).join(' ') || 'Raj',
              avatar: g.avatar || '',
            },
          };
        })
        : defaultGoogleReviews;

    const normalizedLive = liveReviews.map((rev: any) => ({
      ...rev,
      authorBadge: 'Verified Google & Store Patron',
      relativeTime: 'Verified Purchase',
      reviewUrl: googleMeta.googleMapsUrl,
      isGoogle: true,
    }));

    return [...normalizedGoogle, ...normalizedLive];
  }, [googleReviews, liveReviews, googleMeta.googleMapsUrl]);

  const displayHappyReviews = React.useMemo(() => {
    return Array.from(
      { length: 3 },
      (_, i) => allHappyReviews[(reviewStartIndex + i) % allHappyReviews.length]
    );
  }, [allHappyReviews, reviewStartIndex]);

  // Curated 5 Lookbook styles from Nalmara Fashion Thoothukudi Boutique
  const CURATED_STYLE_INSPIRATION = React.useMemo(
    () => [
      {
        id: 'curated-trending-sarees',
        title: 'Trending Sarees',
        category: 'sarees',
        image: '/images/nalmara/hd/style_photo_1_trending_hd.png',
        cardImage: '/images/nalmara/hd/style_card_1_trending_hd.png',
        href: '/shop?category=sarees',
        external: false,
      },
      {
        id: 'curated-kanchi-cotton',
        title: 'Kanchi Cotton',
        category: 'kanchi-cotton',
        image: '/images/nalmara/hd/style_photo_2_kanchi_hd.png',
        cardImage: '/images/nalmara/hd/style_card_2_kanchi_hd.png',
        href: '/shop?category=sarees',
        external: false,
      },
      {
        id: 'curated-party-wear',
        title: 'Party Wear Dresses',
        category: 'party-wear',
        image: '/images/nalmara/hd/style_photo_3_party_hd.png',
        cardImage: '/images/nalmara/hd/style_card_3_party_hd.png',
        href: '/shop?category=dresses',
        external: false,
      },
      {
        id: 'curated-fancy-sarees',
        title: 'Fancy Sarees',
        category: 'fancy-sarees',
        image: '/images/nalmara/hd/style_photo_4_fancy_hd.png',
        cardImage: '/images/nalmara/hd/style_card_4_fancy_hd.png',
        href: '/shop?category=sarees',
        external: false,
      },
      {
        id: 'curated-kids-fashion',
        title: 'Kids Fashion',
        category: 'kids-wear',
        image: '/images/nalmara/hd/style_photo_5_kids_hd.png',
        cardImage: '/images/nalmara/hd/style_card_5_kids_hd.png',
        href: '/shop?category=kids-wear',
        external: false,
      },
    ],
    []
  );

  // Derive Style Inspiration items from curated lookbook or live Instagram feed
  const styleInspirationList = React.useMemo(() => {
    if (igPosts && igPosts.length > 0) {
      const igMapped = igPosts.map((post: any) => ({
        id: String(post.id),
        title: post.title || 'Nalmara Lookbook',
        category: 'instagram',
        image: resolveMediaUrl(post.image),
        cardImage: resolveMediaUrl(post.image),
        href: post.permalink || 'https://www.instagram.com/nalmarafashion',
        external: true,
      }));
      return [...CURATED_STYLE_INSPIRATION, ...igMapped];
    }
    return CURATED_STYLE_INSPIRATION;
  }, [igPosts, CURATED_STYLE_INSPIRATION]);

  const visibleStyleInspiration = React.useMemo(
    () =>
      Array.from(
        { length: 5 },
        (_, i) => styleInspirationList[(instaStartIndex + i) % styleInspirationList.length]
      ),
    [styleInspirationList, instaStartIndex]
  );

  const handleAddToCart = async (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const imageUrl =
      resolveMediaUrl(prod.images?.[0]?.url) || getCategoryFallbackImage(prod.name);
    await addItem({
      productId: String(prod._id),
      name: prod.name,
      slug: prod.slug,
      image: imageUrl,
      price: Number(prod.price),
      sku: prod.sku,
      quantity: 1,
    });
    toast.success(`${prod.name} added to your cart!`);
    setIsCartOpen(true);
  };

  const handleHeroAddClick = async () => {
    if (!activeHeroItem) return;
    await addItem({
      productId: String(activeHeroItem.id),
      name: activeHeroItem.name,
      slug: activeHeroItem.slug,
      image: activeHeroItem.image,
      price: Number(activeHeroItem.price),
      sku: activeHeroItem.sku,
      attributes: { Size: selectedHeroSize },
      quantity: 1,
    });
    toast.success(`${activeHeroItem.name} (${selectedHeroSize}) added to your cart!`);
    setIsCartOpen(true);
  };

  const handleWishlistToggle = async (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(prod);
  };

  // Bottom 3-card carousel items (Prev, Active Center, Next) for the Royal Palace Hero Banner
  const heroThreeThumbnails = React.useMemo(() => {
    const len = heroShowcaseItems.length;
    if (len === 0) return [];
    const activeIdx = currentHeroSlide % len;
    const prevIdx = (activeIdx - 1 + len) % len;
    const nextIdx = (activeIdx + 1) % len;
    return [
      { item: heroShowcaseItems[prevIdx], slideIndex: prevIdx, position: 'prev' as const },
      { item: heroShowcaseItems[activeIdx], slideIndex: activeIdx, position: 'active' as const },
      { item: heroShowcaseItems[nextIdx], slideIndex: nextIdx, position: 'next' as const },
    ];
  }, [heroShowcaseItems, currentHeroSlide]);

  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(/\s+/)
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
      .join(' ');

  return (
    <div className="bg-[#FDF6EC] text-[#2A1019] w-full max-w-full overflow-x-hidden font-sans select-none">
      {/* =================================================================== */}
      {/* 01. ROYAL ATELIER INTERACTIVE PRODUCT SHOWCASE BANNER               */}
      {/* =================================================================== */}
      <section className="relative w-full overflow-hidden border-b-2 border-[#D4AF37]">
        {/* Load Cinzel (3D Beveled 24K Gold Roman Serif) & Great Vibes (Royal Calligraphic Script) */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Great+Vibes&display=swap');
        `}</style>

        {/* ================================================================= */}
        {/* MOBILE VIEW (sm:hidden): EXACT PORTRAIT ROYAL PALACE BANNER       */}
        {/* ================================================================= */}
        <div className="sm:hidden relative w-full overflow-hidden select-none bg-[#1A0112]">
          {/* Continuous Full-Bleed Royal Plum & Silk Background with Dedicated Per-Slider Garment */}
          <div className="relative w-full overflow-hidden min-h-[660px] flex flex-col justify-between pt-4 pb-5 px-3">
            
            {/* Background Image Layer: Dedicated Ultra-HD Per-Slider Boutique Background */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`mob-bg-${activeHeroItem.id || currentHeroSlide}`}
                src={activeHeroItem.mobileBg || activeHeroItem.image}
                alt={activeHeroItem.name}
                aria-hidden="true"
                className="w-full h-full object-cover object-center animate-fade-in transition-all duration-700 brightness-[1.03] contrast-[1.03]"
              />
              {/* Ultra-Light Ambient Contrast Vignette so the Luxury Background Image is Vivid & Highly Visible */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(20, 2, 14, 0.25) 0%, rgba(20, 2, 14, 0.10) 30%, rgba(20, 2, 14, 0.15) 65%, rgba(14, 1, 9, 0.60) 100%)',
                }}
              />
              {/* Subtle bottom gradient just to anchor the thumbnail carousel */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{
                  background: 'linear-gradient(0deg, rgba(14, 1, 9, 0.70) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* TOP & MIDDLE CONTENT STACK (ALL CENTER ALIGNED TOP TO BOTTOM) */}
            <div className="relative z-10 w-full flex flex-col items-center text-center">
              {/* 1. Ornate Gold Filigree Crown Crest + ROYAL EDIT Badge (Centered) */}
              <div className="flex flex-col items-center text-center mb-1.5 mx-auto">
                {/* Crown Filigree SVG */}
                <svg viewBox="0 0 120 28" fill="none" className="w-16 h-auto drop-shadow-[0_2px_8px_rgba(255,220,120,0.6)] mb-0.5 mx-auto">
                  <path
                    d="M60 2 L64 12 L74 6 L70 18 L60 14 L50 18 L46 6 L56 12 Z"
                    fill="url(#mobCrownGold)"
                    stroke="#FFE59E"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M20 18 C35 15, 48 8, 60 14 C72 8, 85 15, 100 18"
                    stroke="url(#mobCrownGold)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="60" cy="3" r="1.8" fill="#FFFDF9" stroke="#9A6B18" strokeWidth="0.8" />
                  <circle cx="46" cy="6" r="1.4" fill="#FFE59E" />
                  <circle cx="74" cy="6" r="1.4" fill="#FFE59E" />
                  <circle cx="34" cy="16" r="1" fill="#FFE59E" />
                  <circle cx="86" cy="16" r="1" fill="#FFE59E" />
                  <defs>
                    <linearGradient id="mobCrownGold" x1="20" y1="2" x2="100" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF4C2" />
                      <stop offset="0.5" stopColor="#E5B84B" />
                      <stop offset="1" stopColor="#9A6B18" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Scalloped Plaque: ROYAL EDIT - 01 */}
                <div className="relative inline-flex items-center mx-auto">
                  {/* Left scroll horn */}
                  <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -mr-1 z-10 shadow-xs" />
                  <div className="rounded-full p-[1.5px] bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#FFE59E]/70"
                      style={{
                        background: 'linear-gradient(180deg, #380424 0%, #200115 100%)',
                      }}
                    >
                      <Crown className="w-3 h-3 text-[#FFE59E] fill-[#FFE59E]/40" />
                      <span className="font-serif text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] whitespace-nowrap">
                        ROYAL EDIT - 0{(currentHeroSlide % heroShowcaseItems.length) + 1}
                      </span>
                    </div>
                  </div>
                  {/* Right scroll horn */}
                  <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -ml-1 z-10 shadow-xs" />
                </div>
              </div>

              {/* 2. Two-Line Grand Palace Headline (Centered) */}
              <Link
                href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                className="group block text-center max-w-[92%] mx-auto overflow-visible my-1"
              >
                <h1 className="leading-tight overflow-visible text-center">
                  <span
                    className="block font-extrabold text-[20px] sm:text-[23px] uppercase tracking-[0.08em] text-transparent bg-clip-text drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight text-center mx-auto"
                    style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      backgroundImage:
                        'linear-gradient(180deg, #FFFDF9 0%, #FFE28A 46%, #C88A20 88%, #F8DF95 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  >
                    {activeHeroItem.titleLine1 || 'ROYAL COLLECTION'}
                  </span>
                  <span
                    className="block font-normal text-[38px] sm:text-[44px] text-[#FFE8B5] leading-[1.05] mt-0.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] text-center mx-auto"
                    style={{
                      fontFamily: "'Great Vibes', Georgia, cursive",
                      textShadow:
                        '0 0 24px rgba(255, 220, 130, 0.5), 0 4px 10px rgba(0,0,0,0.9)',
                    }}
                  >
                    {toTitleCase(activeHeroItem.titleLine2 || 'Palace Couture')}
                  </span>
                </h1>
              </Link>

              {/* 3. Centered 3D Sculpted 24K Gold Lotus Divider */}
              <div className="flex items-center justify-center gap-2.5 my-2 w-full max-w-[280px] mx-auto">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] border border-[#5A3807] shrink-0" />
                <svg viewBox="0 0 60 28" fill="none" className="w-6 h-auto shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  <path d="M30 3C26 10 23 16 30 24C37 16 34 10 30 3Z" fill="url(#mobHeroLotusCenterNew)" stroke="#5A3807" strokeWidth="0.9" />
                  <path d="M30 24C21 20 15 13 18 7C23 9 26 14 30 24Z" fill="url(#mobHeroLotusSideNew)" stroke="#5A3807" strokeWidth="0.9" />
                  <path d="M30 24C39 20 45 13 42 7C37 9 34 14 30 24Z" fill="url(#mobHeroLotusSideNew)" stroke="#5A3807" strokeWidth="0.9" />
                  <path d="M30 24C16 23 8 18 9 12C15 13 22 17 30 24Z" fill="url(#mobHeroLotusOuterNew)" stroke="#5A3807" strokeWidth="0.8" />
                  <path d="M30 24C44 23 52 18 51 12C45 13 38 17 30 24Z" fill="url(#mobHeroLotusOuterNew)" stroke="#5A3807" strokeWidth="0.8" />
                  <ellipse cx="30" cy="25" rx="10" ry="2" fill="#8C5818" />
                  <defs>
                    <linearGradient id="mobHeroLotusCenterNew" x1="30" y1="3" x2="30" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFDF9" />
                      <stop offset="0.45" stopColor="#E5B84B" />
                      <stop offset="1" stopColor="#9E6B18" />
                    </linearGradient>
                    <linearGradient id="mobHeroLotusSideNew" x1="18" y1="7" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFE59E" />
                      <stop offset="1" stopColor="#A6721E" />
                    </linearGradient>
                    <linearGradient id="mobHeroLotusOuterNew" x1="9" y1="12" x2="51" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5D37E" />
                      <stop offset="1" stopColor="#8C5818" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] border border-[#5A3807] shrink-0" />
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
              </div>

              {/* 4. Subtitle / Product Tagline (Centered) */}
              <p className="font-serif text-[10px] uppercase tracking-[0.16em] text-[#FFE59E] text-center font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[92%] mx-auto line-clamp-2 mb-3.5">
                {activeHeroItem.description || 'PURE HANDWOVEN HERITAGE SILK & LUXURY ATELIER'}
              </p>

              {/* 5. Centered 4 Badges (2x2 Grid) */}
              <div className="w-full max-w-[270px] mx-auto mb-3">
                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {(
                    activeHeroItem.badges || [
                      { line1: 'BUTTERFLY', line2: 'DESIGN' },
                      { line1: 'FLORAL', line2: 'APPLIQUÉ' },
                      { line1: 'PREMIUM', line2: 'PARTY WEAR' },
                      { line1: 'BIRTHDAYS &', line2: 'PARTIES' },
                    ]
                  ).map((plaque, pIdx) => {
                    const icons = [
                      <Gem key="gem" className="w-4 h-4 text-[#FFE59E] mb-1" />,
                      <Sparkles key="sparkles" className="w-4 h-4 mb-1 text-[#FFE59E]" />,
                      <Crown key="crown" className="w-4 h-4 text-[#FFE59E] mb-1" />,
                      <MannequinDummyIcon key="dummy" className="w-4 h-4 mb-1 text-[#FFE59E]" />,
                    ];
                    return (
                      <div
                        key={plaque.line1 + plaque.line2 + pIdx}
                        className="relative rounded-[12px] p-[1.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_16px_rgba(0,0,0,0.65)]"
                      >
                        <div
                          className="relative h-full rounded-[10px] px-2 py-2 flex flex-col items-center justify-center text-center border border-[#FFE59E]/40"
                          style={{
                            background:
                              'linear-gradient(180deg, rgba(46, 5, 30, 0.92) 0%, rgba(20, 2, 14, 0.96) 100%)',
                          }}
                        >
                          <span className="pointer-events-none absolute inset-[2px] rounded-[8px] border border-[#FFE59E]/20" />
                          {icons[pIdx % icons.length]}
                          <span className="relative z-10 font-serif font-extrabold text-[8.5px] leading-[1.15] text-[#FFE59E] tracking-wider uppercase">
                            {plaque.line1}
                            <br />
                            {plaque.line2}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Highlight Badge: PRICE: ₹399/- ONLY */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#5B0E3D]/95 via-[#2E051E]/95 to-[#5B0E3D]/95 border border-[#FFE59E] shadow-[0_4px_14px_rgba(0,0,0,0.6)] mb-2.5">
                <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#FFFDF9]">
                  PRICE:{' '}
                  <span className="text-[#FFE59E] font-extrabold text-[13px] drop-shadow-sm">
                    {formatCurrency(activeHeroItem.price)}/- ONLY
                  </span>
                </span>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E]" />
              </div>

              {/* 6. Sculpted 3D Metallic Gold CTA Button (Centered) */}
              <div className="flex justify-center w-full mt-0.5 mb-1">
                <Link
                  href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                  className="group relative inline-flex items-center justify-between gap-3 px-5 py-2.5 rounded-full border-2 border-[#FFE59E] shadow-[0_8px_22px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.8)] active:scale-95 transition-transform"
                  style={{
                    background: 'linear-gradient(180deg, #FFF4C2 0%, #F5C658 35%, #D4AF37 75%, #9E6B18 100%)',
                  }}
                >
                  <span className="font-serif font-extrabold text-[11.5px] uppercase tracking-[0.14em] text-[#280619] whitespace-nowrap">
                    EXPLORE COLLECTION
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#200318] flex items-center justify-center text-[#FFE59E] shadow-inner shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.8]" />
                  </span>
                </Link>
              </div>
            </div>

            {/* BOTTOM 3-THUMBNAIL CAROUSEL STRIP */}
            <div className="relative z-20 w-full max-w-[380px] mx-auto mt-6 mb-1 flex items-center justify-center gap-2 px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev - 1)}
                className="w-8 h-8 rounded-full border border-[#D4AF37] bg-[#220215]/90 text-[#FFE59E] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.7)] active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Previous showcase slide"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.6]" />
              </button>

              {/* 3 Thumbnails with Thick Gold Bezel */}
              <div className="grid grid-cols-3 gap-2 flex-1">
                {heroThreeThumbnails.map(({ item, slideIndex, position }) => {
                  const isCenter = position === 'active';
                  return (
                    <button
                      key={`mob-new-${item.id}-${position}`}
                      type="button"
                      onClick={() => goToHeroSlide(slideIndex)}
                      className={`group relative aspect-square rounded-[14px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] transition-all duration-300 cursor-pointer ${
                        isCenter
                          ? 'shadow-[0_8px_22px_rgba(0,0,0,0.8)] scale-[1.06] ring-2 ring-[#FFE59E]'
                          : 'shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-85 hover:opacity-100'
                      }`}
                      aria-label={`Select ${item.name}`}
                    >
                      {isCenter && (
                        <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#FFE59E] border border-[#8C5818] z-20 shadow-xs" />
                      )}
                      <div className="relative w-full h-full rounded-[11px] overflow-hidden bg-[#24031B] border border-[#FFFDF9]/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              HERO_SHOWCASE_FALLBACK[
                                slideIndex % HERO_SHOWCASE_FALLBACK.length
                              ].image;
                          }}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev + 1)}
                className="w-8 h-8 rounded-full border border-[#D4AF37] bg-[#220215]/90 text-[#FFE59E] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.7)] active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Next showcase slide"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.6]" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TABLET & DESKTOP VIEW (hidden sm:block): ULTRA-PREMIUM PALACE     */}
        {/* ================================================================= */}
        <div className="hidden sm:block relative w-full overflow-hidden">
          {/* UPPER FULL-BLEED ROYAL PALACE STAGE */}
          <div
            className="relative w-full pt-7 lg:pt-9 pb-14 lg:pb-16 overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 72% 40%, #B87228 0%, #6D261A 24%, #480A30 52%, #260318 78%, #13010B 100%)',
            }}
          >
            {/* Palace Chandelier Architecture Backdrop on Right Pavilion */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-screen">
              <Image
                src="/images/nalmara/hd/festive_panoramic_master.jpg"
                alt=""
                fill
                unoptimized
                className="object-cover object-right scale-105"
              />
            </div>

            {/* Warm Multi-Point Golden Palace Chandelier Bokeh & Left Velvet Vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 45%, rgba(28, 2, 17, 0.72) 0%, rgba(45, 5, 28, 0.35) 38%, transparent 62%), radial-gradient(circle at 58% 18%, rgba(255, 232, 160, 0.55) 0%, transparent 12%), radial-gradient(circle at 86% 22%, rgba(255, 220, 130, 0.50) 0%, transparent 14%), radial-gradient(circle at 55% 52%, rgba(255, 224, 140, 0.38) 0%, transparent 11%), radial-gradient(circle at 92% 54%, rgba(255, 214, 110, 0.42) 0%, transparent 13%)',
              }}
            />

            {/* Top Ornate 24K Gold Palace Arch Molding & Center Chandelier Finial */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2.5 bg-gradient-to-r from-[#8C5818] via-[#FFF4C2] to-[#8C5818] z-20 shadow-[0_2px_12px_rgba(212,175,55,0.5)]" />

            {/* Top-Left Sweeping Royal Purple Silk Curtain Drape with 24K Gold Bullion Trim */}
            <div className="pointer-events-none absolute top-0 left-0 w-[34%] h-36 lg:h-42 z-10 overflow-hidden">
              <svg
                viewBox="0 0 500 200"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
              >
                <path
                  d="M0 0H485C400 46 285 82 165 106C82 122 28 142 0 166V0Z"
                  fill="url(#deskLeftPurpleDrape)"
                />
                <path
                  d="M0 44C135 36 270 20 395 0"
                  stroke="#B83288"
                  strokeWidth="6"
                  strokeOpacity="0.45"
                />
                <path
                  d="M0 90C150 72 295 38 435 0"
                  stroke="#220215"
                  strokeWidth="8"
                  strokeOpacity="0.55"
                />
                <path
                  d="M0 166C28 142 82 122 165 106C285 82 400 46 485 0"
                  stroke="url(#deskLeftGoldTrim)"
                  strokeWidth="5.5"
                />
                <defs>
                  <linearGradient id="deskLeftPurpleDrape" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#760159" />
                    <stop offset="0.45" stopColor="#9E0277" />
                    <stop offset="0.8" stopColor="#54013F" />
                    <stop offset="1" stopColor="#240216" />
                  </linearGradient>
                  <linearGradient id="deskLeftGoldTrim" x1="0" y1="166" x2="485" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9A6B18" />
                    <stop offset="0.5" stopColor="#FFF4C2" />
                    <stop offset="1" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Two Ornate Hanging 24K Gold Palace Lanterns (Top-Left) */}
            <div className="pointer-events-none absolute top-0 left-6 lg:left-12 z-20 flex items-start gap-2.5">
              <svg
                viewBox="0 0 64 180"
                fill="none"
                className="w-14 h-44 drop-shadow-[0_8px_22px_rgba(255,205,85,0.65)]"
              >
                <line x1="32" y1="0" x2="32" y2="44" stroke="#FFE59E" strokeWidth="2.2" strokeDasharray="3 2" />
                <circle cx="32" cy="44" r="3.5" fill="#D4AF37" />
                <path d="M18 60C18 50 25 46 32 44C39 46 46 50 46 60H18Z" fill="#D4AF37" stroke="#5A3807" strokeWidth="1" />
                <rect x="14" y="60" width="36" height="4" rx="2" fill="#FFE59E" />
                <rect x="17" y="64" width="30" height="44" rx="4" fill="#FFD875" stroke="#D4AF37" strokeWidth="2" />
                <line x1="25" y1="64" x2="25" y2="108" stroke="#8C5818" strokeWidth="1.2" />
                <line x1="39" y1="64" x2="39" y2="108" stroke="#8C5818" strokeWidth="1.2" />
                <rect x="14" y="108" width="36" height="4" rx="2" fill="#FFE59E" />
                <path d="M20 112L32 126L44 112H20Z" fill="#D4AF37" stroke="#5A3807" strokeWidth="1" />
                <circle cx="32" cy="130" r="2.5" fill="#FFE59E" />
                <path d="M32 132V144" stroke="#FFE59E" strokeWidth="1.8" strokeLinecap="round" />
              </svg>

              <svg
                viewBox="0 0 56 140"
                fill="none"
                className="w-11 h-32 -ml-1 drop-shadow-[0_8px_22px_rgba(255,205,85,0.65)]"
              >
                <line x1="28" y1="0" x2="28" y2="24" stroke="#FFE59E" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="28" cy="24" r="3" fill="#D4AF37" />
                <path d="M16 38C16 30 22 26 28 24C34 26 40 30 40 38H16Z" fill="#D4AF37" stroke="#5A3807" strokeWidth="1" />
                <rect x="13" y="38" width="30" height="3.5" rx="1.5" fill="#FFE59E" />
                <rect x="15" y="41.5" width="26" height="36" rx="3" fill="#FFD875" stroke="#D4AF37" strokeWidth="1.8" />
                <line x1="22" y1="41.5" x2="22" y2="77.5" stroke="#8C5818" strokeWidth="1" />
                <line x1="34" y1="41.5" x2="34" y2="77.5" stroke="#8C5818" strokeWidth="1" />
                <rect x="13" y="77.5" width="30" height="3.5" rx="1.5" fill="#FFE59E" />
                <path d="M18 81L28 92L38 81H18Z" fill="#D4AF37" stroke="#5A3807" strokeWidth="1" />
                <circle cx="28" cy="96" r="2" fill="#FFE59E" />
              </svg>
            </div>

            {/* Top-Right 3D Cream & Burgundy Floral Cascade with 24K Gold Leaves */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/hero_corner_tr.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-0 right-0 w-48 sm:w-56 h-auto object-contain z-20 opacity-95 drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)]"
            />

            {/* MAIN WIDESCREEN PALACE STAGE (7 Cols Left Royal Editorial | 5 Cols Right Grand Mughal Arch) */}
            <div className="relative z-20 max-w-[1360px] mx-auto px-8 lg:px-14">
              <div className="grid grid-cols-12 items-center gap-6 lg:gap-10">
                {/* LEFT 7 COLUMNS: CENTERED MONUMENTAL ROYAL EDITORIAL (Exact Match to Reference Master) */}
                <div
                  key={`desk-palace-text-${heroAnimTick}`}
                  className="col-span-7 flex flex-col items-center text-center pt-2 pb-2 z-20 animate-hero-text-up"
                >
                  {/* 1. Scalloped Royal Plum & 24K Gold Crown Jewel Plaque */}
                  <div className="relative inline-flex items-center mb-4 sm:mb-5">
                    <span className="h-[1.5px] w-14 lg:w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFF4C2] mr-2" />
                    <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -mr-1.5 z-10 shadow-xs" />
                    <div className="rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_10px_26px_rgba(0,0,0,0.6)]">
                      <div
                        className="inline-flex items-center gap-2.5 px-6 py-1.5 rounded-full border border-[#FFE59E]/75 shadow-[inset_0_1px_3px_rgba(255,244,194,0.4)]"
                        style={{
                          background:
                            'linear-gradient(180deg, #580A3B 0%, #30041E 55%, #18010E 100%)',
                        }}
                      >
                        <svg viewBox="0 0 24 18" fill="none" className="w-5 h-4 shrink-0 drop-shadow">
                          <path
                            d="M2 15L4 5L9 10L12 3L15 10L20 5L22 15H2Z"
                            fill="#F2C960"
                            stroke="#FFF4C2"
                            strokeWidth="1"
                            strokeLinejoin="round"
                          />
                          <rect x="2" y="15.5" width="20" height="2" rx="1" fill="#FFE59E" />
                        </svg>
                        <span className="font-serif text-xs lg:text-[13.5px] font-bold uppercase tracking-[0.24em] text-[#FFF6D6] whitespace-nowrap">
                          ROYAL EDIT • 0{(currentHeroSlide % heroShowcaseItems.length) + 1}
                        </span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -ml-1.5 z-10 shadow-xs" />
                    <span className="h-[1.5px] w-14 lg:w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFF4C2] ml-2" />
                  </div>

                  {/* 2. Monumental Two-Line Grand Palace Headline (Fully Visible Ascenders & No Clipping) */}
                  <Link
                    href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                    className="group block max-w-full overflow-visible"
                  >
                    <h1 className="leading-tight pt-1 pb-1 overflow-visible">
                      <span
                        className="block font-extrabold text-4xl lg:text-[52px] xl:text-[58px] uppercase tracking-[0.04em] text-transparent bg-clip-text drop-shadow-[0_5px_16px_rgba(0,0,0,0.85)] pt-3 pb-1 leading-[1.2] overflow-visible"
                        style={{
                          fontFamily: "'Cinzel', Georgia, serif",
                          backgroundImage:
                            'linear-gradient(180deg, #FFFDF9 0%, #FFE494 42%, #C98B20 82%, #FBE29A 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                        }}
                      >
                        {activeHeroItem.titleLine1}
                      </span>
                      <span
                        className="block font-normal text-5xl lg:text-[64px] xl:text-[72px] text-[#FCE8C0] leading-[1.12] pt-0.5 pb-1 drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] overflow-visible"
                        style={{ fontFamily: "'Great Vibes', Georgia, cursive" }}
                      >
                        {toTitleCase(activeHeroItem.titleLine2)}
                      </span>
                    </h1>
                  </Link>

                  {/* 3. Centered 3D Sculpted 24K Gold Lotus & Filigree Divider Element */}
                  <div className="flex items-center justify-center gap-3 my-3 w-full max-w-[460px]">
                    <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
                    <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] shadow-xs shrink-0" />
                    <svg
                      viewBox="0 0 60 28"
                      fill="none"
                      width={52}
                      height={24}
                      className="w-12 sm:w-14 h-auto shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
                    >
                      <path
                        d="M30 3C26 10 23 16 30 24C37 16 34 10 30 3Z"
                        fill="url(#deskHeroLotusCenter)"
                        stroke="#5A3807"
                        strokeWidth="0.9"
                      />
                      <path
                        d="M30 24C21 20 15 13 18 7C23 9 26 14 30 24Z"
                        fill="url(#deskHeroLotusSide)"
                        stroke="#5A3807"
                        strokeWidth="0.9"
                      />
                      <path
                        d="M30 24C39 20 45 13 42 7C37 9 34 14 30 24Z"
                        fill="url(#deskHeroLotusSide)"
                        stroke="#5A3807"
                        strokeWidth="0.9"
                      />
                      <path
                        d="M30 24C16 23 8 18 9 12C15 13 22 17 30 24Z"
                        fill="url(#deskHeroLotusOuter)"
                        stroke="#5A3807"
                        strokeWidth="0.8"
                      />
                      <path
                        d="M30 24C44 23 52 18 51 12C45 13 38 17 30 24Z"
                        fill="url(#deskHeroLotusOuter)"
                        stroke="#5A3807"
                        strokeWidth="0.8"
                      />
                      <ellipse cx="30" cy="25" rx="10" ry="2" fill="#8C5818" />
                      <defs>
                        <linearGradient
                          id="deskHeroLotusCenter"
                          x1="30"
                          y1="3"
                          x2="30"
                          y2="24"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FFFDF9" />
                          <stop offset="0.45" stopColor="#E5B84B" />
                          <stop offset="1" stopColor="#9E6B18" />
                        </linearGradient>
                        <linearGradient
                          id="deskHeroLotusSide"
                          x1="18"
                          y1="7"
                          x2="42"
                          y2="24"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FFE59E" />
                          <stop offset="1" stopColor="#A6721E" />
                        </linearGradient>
                        <linearGradient
                          id="deskHeroLotusOuter"
                          x1="9"
                          y1="12"
                          x2="51"
                          y2="24"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F5D37E" />
                          <stop offset="1" stopColor="#8C5818" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] shadow-xs shrink-0" />
                    <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
                  </div>

                  {/* 4. Clean Centered Ivory Serif Description */}
                  <p className="font-serif text-base lg:text-[17px] text-[#FAF0DC] leading-[1.52] max-w-[520px] line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {activeHeroItem.description}
                  </p>

                  {/* 5. Three Sleek Horizontal Scalloped 24K Gold Bullion Feature Plaques (Matches Desktop Master) */}
                  <div className="grid grid-cols-3 gap-3.5 w-full max-w-[540px] mt-5">
                    {[
                      {
                        line1: 'Pure Silk',
                        line2: '& Zari',
                        href: '/shop',
                        icon: <Gem className="w-6 h-6 text-[#6B3E0B] stroke-[2] shrink-0" />,
                      },
                      {
                        line1: 'Custom',
                        line2: 'Fit',
                        href: '/stitching-services',
                        icon: <MannequinDummyIcon className="w-6 h-6 shrink-0" />,
                      },
                      {
                        line1: 'Premium',
                        line2: 'Stitching',
                        href: '/stitching-services',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 shrink-0">
                            <path
                              d="M17 3L21 7L7 21L3 21L3 17L17 3Z"
                              stroke="#6B3E0B"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 6C9 4 4 8 8 12C12 16 7 20 3 19"
                              stroke="#6B3E0B"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                      },
                    ].map((plaque) => (
                      <Link
                        key={plaque.line1}
                        href={plaque.href}
                        className="group relative rounded-[16px] p-[2.5px] bg-gradient-to-b from-[#FFF9E6] via-[#D4AF37] to-[#8C5818] shadow-[0_12px_26px_rgba(0,0,0,0.58)] hover:-translate-y-0.5 transition-transform"
                      >
                        {/* Top & Bottom Gold Jewel Accents */}
                        <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#FFF4C2] border border-[#8C5818] z-20" />
                        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#D4AF37] border border-[#5A3807] z-20" />
                        <div
                          className="relative h-full rounded-[13.5px] px-3.5 py-2.5 flex items-center justify-center gap-2.5 border border-[#FFFDF9]"
                          style={{
                            background:
                              'linear-gradient(180deg, #FFFDF7 0%, #F7E3B4 55%, #DFB864 100%)',
                          }}
                        >
                          <span className="pointer-events-none absolute inset-[3px] rounded-[10.5px] border border-[#B88228]/55" />
                          <span className="relative z-10 w-9 h-9 rounded-lg bg-[#FFFDF9]/75 border border-[#C6923A]/55 flex items-center justify-center shadow-inner shrink-0">
                            {plaque.icon}
                          </span>
                          <span className="relative z-10 font-serif font-bold text-[13.5px] leading-[1.15] text-[#231008] text-left">
                            {plaque.line1}
                            <br />
                            {plaque.line2}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* 6. Ornate Scalloped Royal Plum & 24K Gold "Explore Collection →" Button on the Left Editorial Stage */}
                  <div className="flex items-center justify-center gap-3 mt-6 w-full max-w-[520px]">
                    {/* Left Golden Lotus Scrollwork Wing */}
                    <svg viewBox="0 0 80 24" fill="none" className="w-16 lg:w-20 h-5 shrink-0">
                      <line x1="2" y1="12" x2="52" y2="12" stroke="url(#ctaWingGrad)" strokeWidth="1.6" />
                      <path
                        d="M44 12C48 5 58 5 64 12C58 19 48 19 44 12Z"
                        stroke="#FFE59E"
                        strokeWidth="1.3"
                        fill="#D4AF37"
                      />
                      <circle cx="72" cy="12" r="3" fill="#FFF4C2" />
                      <defs>
                        <linearGradient id="ctaWingGrad" x1="2" y1="12" x2="64" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#D4AF37" stopOpacity="0" />
                          <stop offset="0.5" stopColor="#D4AF37" />
                          <stop offset="1" stopColor="#FFF4C2" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Link
                      href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                      className="group relative rounded-full p-[3px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_14px_34px_rgba(20,1,12,0.75)] hover:scale-105 active:scale-95 transition-transform shrink-0"
                    >
                      <span
                        className="inline-flex items-center gap-3 px-9 lg:px-11 py-2.5 rounded-full border border-[#FFE59E]/85 font-serif font-bold text-base lg:text-[18px] text-[#FCE8C0] tracking-wide shadow-[inset_0_1px_3px_rgba(255,244,194,0.45)] whitespace-nowrap"
                        style={{
                          background:
                            'linear-gradient(180deg, #760159 0%, #54013F 55%, #1D0111 100%)',
                        }}
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-5 h-5 text-[#FFE59E] group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>

                    {/* Right Golden Lotus Scrollwork Wing */}
                    <svg viewBox="0 0 80 24" fill="none" className="w-16 lg:w-20 h-5 shrink-0 -scale-x-100">
                      <line x1="2" y1="12" x2="52" y2="12" stroke="url(#ctaWingGrad)" strokeWidth="1.6" />
                      <path
                        d="M44 12C48 5 58 5 64 12C58 19 48 19 44 12Z"
                        stroke="#FFE59E"
                        strokeWidth="1.3"
                        fill="#D4AF37"
                      />
                      <circle cx="72" cy="12" r="3" fill="#FFF4C2" />
                    </svg>
                  </div>
                </div>

                {/* RIGHT 5 COLUMNS: SCULPTED 24K GOLD MUGHAL PALACE ARCH PAVILION */}
                <div className="col-span-5 relative flex items-end justify-center self-stretch -mb-10">
                  {/* Warm Golden Chandelier Aura Behind Arch */}
                  <div
                    className="pointer-events-none absolute -inset-6 rounded-t-[140px] opacity-90 blur-2xl"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 42%, rgba(255, 226, 142, 0.72) 0%, rgba(212, 175, 55, 0.30) 55%, transparent 76%)',
                    }}
                  />

                  {/* Left Ornate 24K Gold Arabesque Filigree Spandrel Scrollwork (Matches Reference Arch Frame) */}
                  <svg
                    viewBox="0 0 90 420"
                    fill="none"
                    className="pointer-events-none absolute -left-5 lg:-left-7 top-6 bottom-6 w-16 lg:w-20 h-[88%] z-20 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
                  >
                    <path
                      d="M78 16C42 28 24 58 34 92C42 118 68 124 68 152C68 180 38 194 38 224C38 254 68 268 68 298C68 328 40 352 24 388"
                      stroke="url(#archSpandrelGold)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M58 46C34 40 16 56 24 78C30 94 52 92 58 76Z"
                      fill="url(#archSpandrelGold)"
                      fillOpacity="0.85"
                    />
                    <path
                      d="M62 210C38 202 20 218 28 238C34 252 56 250 62 234Z"
                      fill="url(#archSpandrelGold)"
                      fillOpacity="0.85"
                    />
                    <path
                      d="M58 348C34 340 16 356 24 376C30 390 52 388 58 372Z"
                      fill="url(#archSpandrelGold)"
                      fillOpacity="0.85"
                    />
                    <circle cx="48" cy="148" r="4.5" fill="#FFF4C2" />
                    <circle cx="48" cy="292" r="4.5" fill="#FFF4C2" />
                    <defs>
                      <linearGradient id="archSpandrelGold" x1="16" y1="16" x2="78" y2="390" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFF6D6" />
                        <stop offset="0.5" stopColor="#D4AF37" />
                        <stop offset="1" stopColor="#8C5818" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Right Ornate 24K Gold Arabesque Filigree Spandrel Scrollwork */}
                  <svg
                    viewBox="0 0 90 420"
                    fill="none"
                    className="pointer-events-none absolute -right-5 lg:-right-7 top-6 bottom-6 w-16 lg:w-20 h-[88%] z-20 -scale-x-100 drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
                  >
                    <path
                      d="M78 16C42 28 24 58 34 92C42 118 68 124 68 152C68 180 38 194 38 224C38 254 68 268 68 298C68 328 40 352 24 388"
                      stroke="url(#archSpandrelGold)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M58 46C34 40 16 56 24 78C30 94 52 92 58 76Z"
                      fill="url(#archSpandrelGold)"
                      fillOpacity="0.85"
                    />
                    <path
                      d="M62 210C38 202 20 218 28 238C34 252 56 250 62 234Z"
                      fill="url(#archSpandrelGold)"
                      fillOpacity="0.85"
                    />
                    <circle cx="48" cy="148" r="4.5" fill="#FFF4C2" />
                  </svg>

                  {/* Triple-Bezel 24K Gold Mughal Palace Archway (Gentle Top Curve So Portraits & Flyers Never Clip) */}
                  <div className="relative z-10 w-full max-w-[370px] xl:max-w-[405px] h-[430px] xl:h-[455px] rounded-t-[84px] rounded-b-[24px] p-[4.5px] bg-gradient-to-b from-[#FFF8DC] via-[#D4AF37] to-[#7A4B0E] shadow-[0_28px_70px_rgba(0,0,0,0.78)]">
                    {/* Top Sculpted Cusped Mughal Crown Crest SVG */}
                    <svg
                      viewBox="0 0 220 36"
                      fill="none"
                      className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 w-44 h-8 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
                    >
                      <path
                        d="M10 34C45 34 65 20 85 14C98 10 105 4 110 1C115 4 122 10 135 14C155 20 175 34 210 34H10Z"
                        fill="url(#archCrestGrad)"
                        stroke="#FFF6D6"
                        strokeWidth="1.5"
                      />
                      <circle cx="110" cy="12" r="4" fill="#FFFDF9" />
                      <circle cx="82" cy="22" r="2.5" fill="#FFE59E" />
                      <circle cx="138" cy="22" r="2.5" fill="#FFE59E" />
                      <defs>
                        <linearGradient id="archCrestGrad" x1="10" y1="1" x2="210" y2="34" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#8C5818" />
                          <stop offset="0.5" stopColor="#FFE59E" />
                          <stop offset="1" stopColor="#8C5818" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Link
                      key={`desk-palace-img-${heroAnimTick}-${currentHeroSlide}`}
                      href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                      className="relative w-full h-full rounded-t-[79px] rounded-b-[19.5px] overflow-hidden bg-[#2A0519] block group animate-hero-rise-in border border-[#760159]"
                    >
                      {/* Soft Ambient Blurred Backdrop Layer */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeHeroItem.image}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-45"
                      />

                      {/* Main Portrait Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeHeroItem.image}
                        alt={activeHeroItem.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            HERO_SHOWCASE_FALLBACK[
                              currentHeroSlide % HERO_SHOWCASE_FALLBACK.length
                            ].image;
                        }}
                        className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Inner Sculpted 24K Gold Cusped Arch Filigree Overlay */}
                      <div className="pointer-events-none absolute inset-[5px] rounded-t-[74px] rounded-b-[15px] border-[1.5px] border-[#FFF4C2]/70 z-20 shadow-[inset_0_0_24px_rgba(0,0,0,0.35)]" />

                      {/* Bottom Royal Price & Slide Medallion */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#16010D]/95 via-[#16010D]/60 to-transparent z-20 flex items-end justify-between px-5 pb-3.5">
                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#FFE59E] font-serif font-bold text-base text-[#FFE59E] shadow-lg">
                          {formatCurrency(activeHeroItem.price)}
                        </span>
                        <span className="px-3.5 py-1 rounded-full bg-[#240216]/90 border border-[#D4AF37]/80 text-xs font-serif font-bold text-[#FFFDF9] tracking-wider">
                          0{(currentHeroSlide % heroShowcaseItems.length) + 1} / 0{heroShowcaseItems.length}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SCULPTED CHAMPAGNE-GOLD & ROYAL PURPLE SILK WAVE TERRACE (Compact, Zero Empty Space) */}
          <div
            className="relative z-20 -mt-7 rounded-t-[54px] border-t-[3.5px] border-[#D4AF37] pt-6 pb-8 px-8 lg:px-14 shadow-[0_-18px_45px_rgba(0,0,0,0.52)] overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 25%, #FFFDF9 0%, #F9EED4 52%, #E5C48F 100%)',
            }}
          >
            {/* Inner 24K Gold Arched Top Hairline */}
            <div className="pointer-events-none absolute inset-x-4 top-1.5 h-8 rounded-t-[48px] border-t border-[#C6923A]/60" />

            {/* Subtle Ornate Gold Damask & Mandala Filigree Pattern on the Left & Right Wings */}
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 12% 50%, rgba(198, 146, 58, 0.45) 0%, transparent 28%), radial-gradient(circle at 88% 50%, rgba(198, 146, 58, 0.45) 0%, transparent 28%)',
              }}
            />

            {/* Left Sweeping 3D Royal Purple Silk Corner Drapery Wave */}
            <div className="pointer-events-none absolute left-0 bottom-0 w-[26%] h-full z-10">
              <svg
                viewBox="0 0 400 180"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_-6px_16px_rgba(45,4,28,0.35)]"
              >
                <path
                  d="M0 28C75 68 165 118 310 162L390 180H0V28Z"
                  fill="url(#terraceLeftPurpleSilk)"
                />
                <path
                  d="M0 78C85 110 180 146 310 180"
                  stroke="#A82476"
                  strokeWidth="5"
                  strokeOpacity="0.5"
                />
                <path
                  d="M0 28C75 68 165 118 310 162L390 180"
                  stroke="url(#terraceGoldRibbon)"
                  strokeWidth="4.5"
                />
                <defs>
                  <linearGradient id="terraceLeftPurpleSilk" x1="0" y1="28" x2="340" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4A0730" />
                    <stop offset="0.45" stopColor="#85155C" />
                    <stop offset="0.8" stopColor="#3B0426" />
                    <stop offset="1" stopColor="#220114" />
                  </linearGradient>
                  <linearGradient id="terraceGoldRibbon" x1="0" y1="28" x2="390" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9A6B18" />
                    <stop offset="0.5" stopColor="#FFF4C2" />
                    <stop offset="1" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right Sweeping 3D Royal Purple Silk Corner Drapery Wave */}
            <div className="pointer-events-none absolute right-0 bottom-0 w-[26%] h-full z-10 -scale-x-100">
              <svg
                viewBox="0 0 400 180"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_-6px_16px_rgba(45,4,28,0.35)]"
              >
                <path
                  d="M0 28C75 68 165 118 310 162L390 180H0V28Z"
                  fill="url(#terraceLeftPurpleSilk)"
                />
                <path
                  d="M0 78C85 110 180 146 310 180"
                  stroke="#A82476"
                  strokeWidth="5"
                  strokeOpacity="0.5"
                />
                <path
                  d="M0 28C75 68 165 118 310 162L390 180"
                  stroke="url(#terraceGoldRibbon)"
                  strokeWidth="4.5"
                />
              </svg>
            </div>

            {/* 5-CARD GRAND ROYAL LOOKBOOK GALLERY ROW (Framed by Gold Filigree Vines & 3D Bouquets) */}
            <div className="relative z-20 max-w-[1160px] mx-auto flex items-center justify-center gap-3.5 lg:gap-4">
              {/* Left Circular < Prev Button */}
              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev - 1)}
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_20px_rgba(40,6,25,0.4)] hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Previous showcase slide"
              >
                <span
                  className="w-full h-full rounded-full flex items-center justify-center text-[#FFE59E]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 35%, #5B0E3D 0%, #240216 100%)',
                  }}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </span>
              </button>

              {/* All 4 Royal Showcase Cards in a Compact, Beveled 24K Gold Row */}
              <div className="grid grid-cols-4 gap-3 lg:gap-4 flex-1">
                {heroShowcaseItems.map((item, idx) => {
                  const isActiveCard =
                    (currentHeroSlide % heroShowcaseItems.length) === idx;
                  return (
                    <button
                      key={`desk-terrace-${item.id}-${idx}`}
                      type="button"
                      onClick={() => goToHeroSlide(idx)}
                      className={`group relative rounded-[18px] p-[3px] bg-gradient-to-b from-[#FFF8DC] via-[#D4AF37] to-[#7A4B0E] transition-all duration-300 text-left cursor-pointer ${isActiveCard
                        ? 'shadow-[0_14px_30px_rgba(91,14,61,0.42)] -translate-y-1 scale-[1.03] ring-2 ring-[#5B0E3D]'
                        : 'shadow-[0_8px_18px_rgba(70,40,10,0.22)] opacity-95 hover:opacity-100 hover:-translate-y-0.5'
                        }`}
                      aria-label={`Select ${item.name}`}
                    >
                      {isActiveCard && (
                        <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#5B0E3D] border border-[#FFE59E] z-30 shadow-xs" />
                      )}

                      <div className="relative aspect-[16/10.5] w-full rounded-[15px] overflow-hidden bg-[#280619] border border-[#FFFDF9]/90">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              HERO_SHOWCASE_FALLBACK[
                                idx % HERO_SHOWCASE_FALLBACK.length
                              ].image;
                          }}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Top-Left Drop Badge */}
                        <span
                          className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider border ${isActiveCard
                            ? 'bg-[#5B0E3D] text-[#FFE59E] border-[#FFE59E]'
                            : 'bg-[#240216]/85 text-[#FFFDF9] border-[#D4AF37]/65'
                            }`}
                        >
                          0{idx + 1}
                        </span>

                        {/* Bottom Royal Plum & Gold Title & Price Strip */}
                        <div className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 bg-gradient-to-t from-[#18010E]/95 via-[#18010E]/75 to-transparent flex items-end justify-between gap-1.5">
                          <span className="font-serif font-bold text-[10.5px] text-[#FFFDF9] truncate">
                            {item.name}
                          </span>
                          <span className="font-serif font-bold text-[10.5px] text-[#FFE59E] shrink-0">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Circular > Next Button */}
              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev + 1)}
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_20px_rgba(40,6,25,0.4)] hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Next showcase slide"
              >
                <span
                  className="w-full h-full rounded-full flex items-center justify-center text-[#FFE59E]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 35%, #5B0E3D 0%, #240216 100%)',
                  }}
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </span>
              </button>
            </div>

            {/* Bottom-Left & Bottom-Right Large 3D Cream & Burgundy Floral Bouquets with 24K Gold Leaves */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/hero_corner_bl.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-3 left-0 w-44 sm:w-52 h-auto object-contain z-20 drop-shadow-[0_8px_18px_rgba(40,10,25,0.45)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/hero_corner_br.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-3 right-0 w-44 sm:w-52 h-auto object-contain z-20 drop-shadow-[0_8px_18px_rgba(40,10,25,0.45)]"
            />

            {/* Bottom Sweeping Royal Purple Silk & 24K Gold Wave Ribbon */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 z-10 overflow-hidden">
              <svg
                viewBox="0 0 1200 60"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M0 12C220 55 420 58 600 48C780 58 980 55 1200 12V60H0V12Z"
                  fill="url(#deskBottomPurpleWave)"
                />
                <path
                  d="M0 12C220 55 420 58 600 48C780 58 980 55 1200 12"
                  stroke="url(#deskBottomGoldStroke)"
                  strokeWidth="4.5"
                />
                <defs>
                  <linearGradient id="deskBottomPurpleWave" x1="0" y1="12" x2="1200" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#42052B" />
                    <stop offset="0.3" stopColor="#7C1356" />
                    <stop offset="0.5" stopColor="#380424" />
                    <stop offset="0.7" stopColor="#7C1356" />
                    <stop offset="1" stopColor="#42052B" />
                  </linearGradient>
                  <linearGradient id="deskBottomGoldStroke" x1="0" y1="30" x2="1200" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9A6B18" />
                    <stop offset="0.25" stopColor="#FFF4C2" />
                    <stop offset="0.5" stopColor="#D4AF37" />
                    <stop offset="0.75" stopColor="#FFF4C2" />
                    <stop offset="1" stopColor="#9A6B18" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 01B. FLOATING ROYAL CONCIERGE & ASSURANCE RIBBON (Desktop/Tablet)   */}
      {/* =================================================================== */}
      <div className="hidden sm:block relative z-30 max-w-[1220px] mx-auto px-4 sm:px-8 mt-6 sm:mt-8 mb-4">
        <div className="rounded-2xl sm:rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DC] border-[1.5px] border-[#D4AF37] p-1 shadow-[0_14px_34px_rgba(45,10,28,0.12)]">
          <div className="rounded-xl sm:rounded-full border border-[#D4AF37]/35 px-4 py-3 sm:px-7 sm:py-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-center divide-y sm:divide-y-0 lg:divide-x divide-[#D4AF37]/35">
            {/* Item 1: Royal Unboxing */}
            <div className="flex items-center gap-3 pt-1 sm:pt-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3A0826] to-[#220415] border-[1.5px] border-[#D4AF37] text-[#FFE59E] flex items-center justify-center shrink-0 shadow-sm">
                <Package className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                  ROYAL UNBOXING
                </p>
                <p className="font-serif font-bold text-xs sm:text-[13.5px] text-[#23120B] leading-tight">
                  Carefully Packed
                </p>
                <p className="text-[10.5px] italic font-serif text-[#5C3D1E]">
                  with Love &amp; Care
                </p>
              </div>
            </div>

            {/* Item 2: 100% Authentic */}
            <div className="flex items-center gap-3 pt-2.5 sm:pt-0 lg:pl-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3A0826] to-[#220415] border-[1.5px] border-[#D4AF37] text-[#FFE59E] flex items-center justify-center shrink-0 shadow-sm">
                <Gem className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                  100% AUTHENTIC
                </p>
                <p className="font-serif font-bold text-xs sm:text-[13.5px] text-[#23120B] leading-tight">
                  Premium Quality
                </p>
                <p className="text-[10.5px] italic font-serif text-[#5C3D1E]">
                  Handpicked Fabrics
                </p>
              </div>
            </div>

            {/* Item 3: Peace of Mind */}
            <div className="flex items-center gap-3 pt-2.5 sm:pt-0 lg:pl-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3A0826] to-[#220415] border-[1.5px] border-[#D4AF37] text-[#FFE59E] flex items-center justify-center shrink-0 shadow-sm">
                <RefreshCw className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                  PEACE OF MIND
                </p>
                <p className="font-serif font-bold text-xs sm:text-[13.5px] text-[#23120B] leading-tight">
                  Easy Returns
                </p>
                <p className="text-[10.5px] italic font-serif text-[#5C3D1E]">
                  &amp; Quick Exchanges
                </p>
              </div>
            </div>

            {/* Item 4: Direct Concierge */}
            <div className="flex items-center gap-3 pt-2.5 sm:pt-0 lg:pl-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3A0826] to-[#220415] border-[1.5px] border-[#D4AF37] text-[#FFE59E] flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                  DIRECT CONCIERGE
                </p>
                <p className="font-serif font-bold text-xs sm:text-[13.5px] text-[#23120B] leading-tight">
                  WhatsApp Support
                </p>
                <p className="text-[10.5px] font-bold text-[#3B0826]">
                  6383163609 | 7871207631
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 02. SHOP BY CATEGORY (100% Live API Categories + HD Category Image) */}
      {/* =================================================================== */}
      <section className="relative max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-10 sm:pb-12">
        {/* Subtle Corner Royal Mandala Filigree Watermarks */}
        <RoyalCornerMandala className="hidden lg:block absolute top-0 left-4 w-28 h-28 pointer-events-none" />
        <RoyalCornerMandala className="hidden lg:block absolute top-0 right-4 w-28 h-28 -scale-x-100 pointer-events-none" />

        <GoldSectionHeader
          badge="CURATED COLLECTIONS"
          title="Shop by Category"
          subtitle="Handpicked traditional & contemporary ensembles for every celebration"
        />

        <div className="relative px-6 sm:px-11">
          {/* Left Arrow */}
          {categories.length > 6 && (
            <button
              type="button"
              onClick={() =>
                setCatStartIndex((prev) => (prev - 1 + categories.length) % categories.length)
              }
              className="hidden sm:flex absolute left-0 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#240715] hover:bg-[#D4AF37] border-2 border-[#D4AF37] text-[#FFE59E] hover:text-[#240715] items-center justify-center shadow-md transition-colors cursor-pointer"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Right Arrow */}
          {categories.length > 6 && (
            <button
              type="button"
              onClick={() => setCatStartIndex((prev) => (prev + 1) % categories.length)}
              className="hidden sm:flex absolute right-0 top-[40%] -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#240715] hover:bg-[#D4AF37] border-2 border-[#D4AF37] text-[#FFE59E] hover:text-[#240715] items-center justify-center shadow-md transition-colors cursor-pointer"
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Live Category Medallions */}
          {isCategoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 items-start">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 aspect-square shrink-0 rounded-full p-[4px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#855810] animate-pulse">
                    <div className="w-full h-full rounded-full bg-[#F3E2C3]" />
                  </div>
                  <div className="-mt-4 w-32 h-9 rounded-full bg-[#F3E2C3] border border-[#D4AF37]/50 animate-pulse" />
                </div>
              ))}
            </div>
          ) : visibleCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 items-start">
              {visibleCategories.map((cat) => (
                <CategoryMedallionCard key={cat._id} cat={cat} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DC] border-[1.5px] border-[#D4AF37]/70 p-8 text-center">
              <FolderTree className="w-8 h-8 text-[#8C5818] mx-auto mb-2" />
              <p className="font-serif font-bold text-base text-[#23120B]">
                Collections Updating Soon
              </p>
              <p className="text-xs text-[#5C3D1E] mt-1">
                Our curated categories are being refreshed in the catalog.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 03. "OUR CRAFT YOUR STYLE" — HAUTE COUTURE STITCHING ATELIER CARD   */}
      {/* =================================================================== */}
      <section
        id="stitching-services"
        className="max-w-[1360px] mx-auto px-3.5 sm:px-8 lg:px-12 pb-10 sm:pb-12"
      >
        {/* ================================================================= */}
        {/* MOBILE VIEW (sm:hidden): EXACT ROYAL ATELIER CARD MOCKUP          */}
        {/* ================================================================= */}
        <div className="sm:hidden relative pt-7 pb-2">
          {/* Top-Left & Bottom-Right Royal Purple Silk Drape Accents */}
          <div
            className="pointer-events-none absolute -top-1 -left-2 w-28 h-28 rounded-br-[60px] opacity-90 z-0"
            style={{
              background:
                'radial-gradient(circle at 15% 15%, #7C1554 0%, #46072E 52%, transparent 74%)',
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-1 -right-2 w-28 h-28 rounded-tl-[60px] opacity-90 z-0"
            style={{
              background:
                'radial-gradient(circle at 85% 85%, #7C1554 0%, #46072E 52%, transparent 74%)',
            }}
          />

          {/* Top Centered Arch Crest with Vintage Gold Sewing Machine + BESPOKE TAILORING ATELIER Plaque */}
          <div className="relative z-30 flex flex-col items-center -mb-5">
            {/* Upper Half-Arch Dome Housing the Vintage Gold Sewing Machine */}
            <div className="relative w-20 h-11 rounded-t-full p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_-4px_14px_rgba(45,6,30,0.28)] -mb-2 z-10">
              <div
                className="w-full h-full rounded-t-full flex items-center justify-center pt-1 border-t border-x border-[#FFF4C2]/60"
                style={{
                  background:
                    'radial-gradient(circle at 50% 70%, #5B0E3D 0%, #340521 70%, #220215 100%)',
                }}
              >
                <VintageSewingMachineIcon className="w-9 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]" />
              </div>
            </div>

            {/* Wide Royal Plum & 24K Gold Double-Bezel Plaque */}
            <div className="relative inline-flex items-center">
              {/* Left Ornamental Gold Diamond Spur */}
              <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] -mr-1 z-20 shadow-2xs" />

              <div className="rounded-full p-[2px] bg-gradient-to-r from-[#8C5818] via-[#FFF2B8] to-[#8C5818] shadow-[0_8px_20px_rgba(38,4,24,0.38)]">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#D4AF37]/80"
                  style={{
                    background:
                      'linear-gradient(180deg, #4A0B32 0%, #2E051E 55%, #1E0212 100%)',
                  }}
                >
                  {/* Gold Spool / Thread Crest Icon */}
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0">
                    <path
                      d="M3 3.5H13M3 12.5H13M4.5 3.5L11.5 12.5M11.5 3.5L4.5 12.5"
                      stroke="#FFE59E"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#FFE59E] whitespace-nowrap">
                    BESPOKE TAILORING ATELIER
                  </span>
                  <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
                </div>
              </div>

              {/* Right Ornamental Gold Diamond Spur */}
              <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] -ml-1 z-20 shadow-2xs" />
            </div>
          </div>

          {/* Outer Triple-Bezel 24K Gold Royal Arched Card Frame */}
          <div className="relative z-10 rounded-[28px] p-[3px] bg-gradient-to-b from-[#FFE89E] via-[#C6923A] to-[#8C5818] shadow-[0_18px_42px_rgba(45,6,30,0.26)]">
            <div
              className="relative rounded-[25px] pt-8 pb-4 px-2.5 border border-[#FFFDF9]/90 overflow-hidden"
              style={{
                background:
                  'radial-gradient(circle at 50% 18%, #FFFDF9 0%, #FCF3E0 52%, #F2DEC0 100%)',
              }}
            >
              {/* Inner Hairline Gold Border */}
              <div className="pointer-events-none absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/45 z-10" />

              {/* Top-Left 3D Cream & Burgundy Floral Bouquet */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/showcase_corner_tl.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-2 -left-3 w-24 h-24 object-contain z-20 drop-shadow-[0_6px_10px_rgba(90,52,16,0.28)]"
              />

              {/* Upper-Right Delicate Golden Floral Blossom */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/showcase_corner_tr.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute top-7 -right-4 w-16 h-16 object-contain z-20 drop-shadow-[0_4px_8px_rgba(90,52,16,0.25)]"
              />

              {/* Bottom-Left Golden Thread Spool & Measuring Tape Illustration */}
              <div className="pointer-events-none select-none absolute -bottom-2 -left-2 z-20 opacity-95">
                <ThreadSpoolsIllustration className="w-20 h-20 drop-shadow-[0_6px_10px_rgba(56,28,8,0.3)]" />
              </div>

              {/* Bottom-Right 3D Cream & Burgundy Floral Bouquet */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/showcase_corner_br.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -bottom-2 -right-3 w-24 h-24 object-contain z-20 drop-shadow-[0_6px_12px_rgba(90,52,16,0.3)]"
              />

              {/* Headline & Subtitle */}
              <div className="relative z-20 text-center px-3">
                <h2 className="font-serif text-[23px] leading-[1.12] font-bold text-[#1E0A10] tracking-tight">
                  <span>Our Craft, </span>
                  <span className="italic font-serif font-semibold text-[#5B0E3D]">
                    Your Royal Style
                  </span>{' '}
                  <Heart className="inline-block w-5 h-5 text-[#5B0E3D] stroke-[2] -mt-1 ml-0.5" />
                </h2>

                <p className="font-serif text-[11.5px] leading-[1.35] text-[#261116] font-medium mt-1.5 max-w-[295px] mx-auto">
                  Custom Aari blouses, pattu pavadai &amp; lehengas stitched to your measurements.
                </p>

                {/* Centered Golden Filigree Scroll Divider */}
                <div className="flex items-center justify-center gap-1.5 my-2">
                  <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C6923A] to-[#8C5818]" />
                  <svg viewBox="0 0 36 14" fill="none" className="w-8 h-3 text-[#9E6B18] shrink-0">
                    <path
                      d="M18 1L21 7L18 13L15 7L18 1Z"
                      fill="url(#mobileCraftFiligree)"
                      stroke="#7A4E0D"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M14 7C11 3 6 3 2 7C6 11 11 11 14 7ZM22 7C25 3 30 3 34 7C30 11 25 11 22 7Z"
                      stroke="#9E6B18"
                      strokeWidth="1.1"
                      fill="#FFE59E"
                      fillOpacity="0.45"
                    />
                    <defs>
                      <linearGradient id="mobileCraftFiligree" x1="15" y1="1" x2="21" y2="13" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFF4C2" />
                        <stop offset="0.5" stopColor="#D4AF37" />
                        <stop offset="1" stopColor="#8C5818" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#C6923A] to-[#8C5818]" />
                </div>
              </div>

              {/* 2×3 Grid of Rounded-Pill Couture Cards */}
              <div className="relative z-20 grid grid-cols-2 gap-2 mt-1">
                {STITCHING_ATELIER_CARDS.map((card) => (
                  <Link
                    key={card.label}
                    href={card.href}
                    className="group/mcard relative rounded-[18px] p-[1.5px] bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#9A6B18] shadow-[0_5px_12px_rgba(70,38,10,0.14)] active:scale-[0.99] transition-transform"
                  >
                    <div
                      className="h-full rounded-[16.5px] p-1.5 flex items-center gap-1.5 border border-[#FFFDF9]"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFFDF9 0%, #FDF4E3 60%, #F6E5C8 100%)',
                      }}
                    >
                      {/* Left: Clearly Visible Gold-Framed Garment Photo */}
                      <div className="relative w-[56px] h-[58px] rounded-[13px] p-[1.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shrink-0 shadow-xs">
                        <div className="w-full h-full rounded-[11.5px] overflow-hidden bg-[#280619]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.image}
                            alt={card.label}
                            className="w-full h-full object-cover object-top group-hover/mcard:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Middle: Gold Pill Tag + 2-Line Serif Title */}
                      <div className="min-w-0 flex-1 py-0.5">
                        <span
                          className="inline-block px-1.5 py-[2px] rounded-full text-[6.8px] font-extrabold uppercase tracking-[0.06em] text-[#1E0A10] leading-none shadow-2xs mb-1 whitespace-nowrap"
                          style={{
                            background:
                              'linear-gradient(90deg, #F7D774 0%, #E5B84B 55%, #D49B26 100%)',
                          }}
                        >
                          {card.tag}
                        </span>
                        <h3 className="font-serif font-bold text-[10.5px] leading-[1.15] text-[#1E0A10] line-clamp-2">
                          {card.mobileLabel || card.label}
                        </h3>
                      </div>

                      {/* Right: 3D Metallic Bronze-Gold Chevron Circle Button */}
                      <span
                        className="w-[18px] h-[18px] rounded-full border border-[#FFF2B8] flex items-center justify-center text-white shrink-0 shadow-[0_2px_4px_rgba(60,35,5,0.3)]"
                        style={{
                          background:
                            'linear-gradient(180deg, #E5B84B 0%, #B37D24 55%, #784B0D 100%)',
                        }}
                      >
                        <ChevronRight className="w-3 h-3 text-white stroke-[2.8]" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom Golden Filigree Crest + 3D Royal Plum & Gold Pill CTA */}
              <div className="relative z-20 mt-2.5 flex flex-col items-center">
                {/* Upper Mini Filigree Crown */}
                <svg viewBox="0 0 60 14" fill="none" className="w-12 h-3 -mb-1 text-[#9E6B18]">
                  <path
                    d="M30 1L33 7L30 13L27 7L30 1Z"
                    fill="#D4AF37"
                    stroke="#7A4E0D"
                    strokeWidth="0.7"
                  />
                  <path
                    d="M25 8C20 3 12 4 4 10M35 8C40 3 48 4 56 10"
                    stroke="#9E6B18"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* CTA Row Flanked by Left/Right Gold Diamond Lines */}
                <div className="flex items-center justify-center gap-2 w-full px-6">
                  <div className="flex items-center flex-1">
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#9E6B18]" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] ml-1 shrink-0" />
                  </div>

                  <Link
                    href="/stitching-services"
                    className="rounded-full p-[2px] bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_20px_rgba(45,6,30,0.38)] active:scale-95 transition-transform shrink-0"
                  >
                    <span
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/60 font-serif font-medium text-[12px] text-[#FFFDF9] tracking-wide"
                      style={{
                        background:
                          'linear-gradient(180deg, #5B0E3D 0%, #760159 55%, #220215 100%)',
                      }}
                    >
                      <span>Explore All Stitching Services</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFE59E]" />
                    </span>
                  </Link>

                  <div className="flex items-center flex-1">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] mr-1 shrink-0" />
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#9E6B18]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TABLET & DESKTOP VIEW (hidden sm:block): 3-COLUMN ROYAL SHOWCASE  */}
        {/* ================================================================= */}
        <div className="hidden sm:block relative rounded-[30px] p-[3px] bg-gradient-to-r from-[#9E6B18] via-[#FFF2B8] to-[#9E6B18] shadow-[0_24px_60px_rgba(45,6,30,0.22)]">
          <div className="relative rounded-[27px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF0DC] to-[#EFE0C2] overflow-hidden">
            {/* Ambient Royal Gold & Plum Silk Glows */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 14% 25%, rgba(212,175,55,0.20) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(91,14,61,0.08) 0%, transparent 50%), radial-gradient(circle at 88% 75%, rgba(212,175,55,0.22) 0%, transparent 45%)',
              }}
            />

            {/* Subtle Corner Mandala Watermarks */}
            <RoyalCornerMandala className="hidden xl:block absolute -top-4 -left-4 w-32 h-32 opacity-35 pointer-events-none z-0" />
            <RoyalCornerMandala className="hidden xl:block absolute -bottom-4 -right-4 w-32 h-32 -scale-x-100 -scale-y-100 opacity-35 pointer-events-none z-0" />

            {/* Inner 24K Gold Architectural Hairline & Corner Jewels */}
            <div className="absolute inset-3 rounded-[20px] border border-[#D4AF37]/55 pointer-events-none z-20">
              <span className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#B88228] rounded-tl-md" />
              <span className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#B88228] rounded-tr-md" />
              <span className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#B88228] rounded-bl-md" />
              <span className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#B88228] rounded-br-md" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-4 p-9 lg:px-10 lg:py-9">
              {/* LEFT COLUMN (4 Cols): Royal Editorial Story, Guarantees & Dual CTAs */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Luxury Plum & 24K Gold Kicker Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#D4AF37] shadow-[0_6px_16px_rgba(56,7,37,0.2)] mb-3">
                  <Scissors className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E]">
                    BESPOKE TAILORING ATELIER
                  </span>
                  <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
                </div>

                {/* 2-Line Editorial Headline */}
                <h2 className="font-serif text-4xl xl:text-[42px] font-bold text-[#220915] leading-[1.08] tracking-tight">
                  <span className="block">Our Craft, </span>
                  <span className="inline-flex items-center gap-2 mt-1">
                    <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#4A0B32] via-[#9E1946] to-[#B88228]">
                      Your Royal Style
                    </span>
                    <Heart className="w-7 h-7 text-[#9E1946] fill-[#9E1946]/20 stroke-[2.2] rotate-6 shrink-0" />
                  </span>
                </h2>

                {/* Ornamental 24K Gold Diamond Rule */}
                <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-3 mb-3">
                  <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] shrink-0" />
                  <span className="h-[1.5px] w-28 bg-gradient-to-r from-[#D4AF37] via-[#B88228] to-transparent" />
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[#8C5818]">
                    MASTER FIT GUARANTEE
                  </span>
                </div>

                <p className="text-[13.5px] text-[#4A2C2A] font-medium leading-[1.68] max-w-sm">
                  From intricate Muhurtham bridal Aari work blouses to princess-cut saree blouses, kids pattu pavadai, and kalidar lehengas—hand-tailored in Thoothukudi to your exact measurements.
                </p>

                {/* 3 Mini Atelier Highlight Badges */}
                <div className="grid mt-4 grid-cols-3 gap-2 w-full max-w-sm">
                  {[
                    { val: '2–5 Days', lbl: 'Express Stitch' },
                    { val: '100% Pure', lbl: 'Mulmul Lining' },
                    { val: '6 Studios', lbl: 'Custom Forms' },
                  ].map((item) => (
                    <div
                      key={item.lbl}
                      className="rounded-xl bg-[#FFFDF9]/90 border border-[#D4AF37]/65 px-2.5 py-2 text-center shadow-2xs"
                    >
                      <span className="block font-serif font-bold text-sm text-[#760159] leading-tight">
                        {item.val}
                      </span>
                      <span className="block text-[9.5px] font-semibold text-[#7A542E] mt-0.5">
                        {item.lbl}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA Button */}
                <div className="flex mt-5 flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <Link
                    href="/stitching-services"
                    className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] hover:from-[#4E0B34] hover:to-[#280619] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-[13.5px] tracking-wide shadow-[0_10px_26px_rgba(56,7,37,0.3)] transition-all duration-300 hover:scale-105"
                  >
                    <span>Explore All Stitching Services</span>
                    <ArrowRight className="w-4 h-4 text-[#FFE59E] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* CENTER COLUMN (3 Cols): Uncropped Royal Arch Bridal Portrait */}
              <div className="lg:col-span-3 relative flex flex-col items-center justify-center py-2">
                {/* Circular Champagne & Gold Aura Behind Arch */}
                <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#F2E2BE]/80 via-[#FAF1DC]/90 to-[#EFE6CE]/80 border border-[#D4AF37]/45 shadow-[inset_0_0_40px_rgba(212,175,55,0.25)] pointer-events-none" />

                {/* Triple-Bezel Royal Arch Portrait */}
                <div className="relative z-10 w-64 lg:w-full max-w-[255px] h-[335px] rounded-t-[140px] rounded-b-2xl p-[3.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_20px_45px_rgba(40,6,25,0.28)] group">
                  {/* Top Crown Diamond Stud */}
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#5B0E3D] shadow-sm" />

                  <div className="relative w-full h-full rounded-t-[136px] rounded-b-[13px] overflow-hidden bg-[#280619] border border-[#FFFDF9]/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/nalmara/hd/stitching_blouse_hd.jpg"
                      alt="Bridal & Designer Blouse Stitching"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#220414]/85 via-[#220414]/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Bottom Floating Royal Gold-on-Plum Plaque */}
                  <Link
                    href="/stitching-services/bridal-designer-blouses"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border-[1.5px] border-[#FFE59E] text-[#FFE59E] text-[9.5px] font-bold uppercase tracking-[0.18em] shadow-lg hover:scale-105 transition-transform"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFE59E]" />
                    <span>Master Aari &amp; Bridal Fit</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN (5 Cols): 6 Interactive Couture Studio Cards */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#580E3A]">
                    SELECT A DEDICATED STITCHING STUDIO:
                  </span>
                  <span className="text-[10px] font-bold text-[#8C5818]">
                    6 Custom Fit Pages
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {STITCHING_ATELIER_CARDS.map((card) => (
                    <Link
                      key={card.label}
                      href={card.href}
                      className="group/card relative rounded-2xl p-[1.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_16px_rgba(56,7,37,0.08)] hover:shadow-[0_14px_28px_rgba(56,7,37,0.2)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="h-full rounded-[14.5px] bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9] to-[#FAF0DD] group-hover/card:from-[#760159] group-hover/card:via-[#4A0B32] group-hover/card:to-[#280619] p-2.5 flex items-center gap-3 transition-all duration-300">
                        {/* Mini Gold-Framed Garment Thumbnail */}
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37] shrink-0 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.image}
                            alt={card.label}
                            className="w-full h-full object-cover object-top group-hover/card:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Service Title, Craft Subtitle & Tag */}
                        <div className="min-w-0 flex-1">
                          <span className="block text-[8.5px] font-extrabold uppercase tracking-[0.16em] text-[#9E1946] group-hover/card:text-[#FFE59E]/85 truncate transition-colors">
                            {card.tag}
                          </span>
                          <h3 className="font-serif font-bold text-[13px] text-[#23120B] group-hover/card:text-[#FFFDF9] leading-snug line-clamp-1 transition-colors">
                            {card.label}
                          </h3>
                          <p className="text-[10px] text-[#6E4726] group-hover/card:text-[#FAF0DD]/80 truncate mt-0.5 transition-colors">
                            {card.subtitle}
                          </p>
                        </div>

                        {/* Gold Arrow Medallion */}
                        <span className="flex w-7 h-7 rounded-full bg-[#FAF0DD] group-hover/card:bg-gradient-to-b group-hover/card:from-[#FFF4C2] group-hover/card:to-[#D4AF37] border border-[#D4AF37]/75 items-center justify-center text-[#760159] shrink-0 transition-all group-hover/card:translate-x-0.5">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Bottom Couture Assurance Strip */}
                <div className="flex mt-3.5 pt-2.5 border-t border-[#D4AF37]/40 flex-wrap items-center justify-between gap-2 px-1 text-[10.5px] font-bold text-[#4A2C2A]">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#9E1946] stroke-[2.8]" />
                    <span>Collection-Based Measurement Forms</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#9E1946] stroke-[2.8]" />
                    <span>WhatsApp Video Fit Consultation</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 04. NEW ARRIVALS — GRAND 5-PRODUCTS-IN-A-ROW ROYAL SHOWCASE         */}
      {/* =================================================================== */}
      <section className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 pt-4 pb-10 sm:pt-8 sm:pb-14 overflow-hidden">
        {/* =============================================================== */}
        {/* STAGE WRAPPER WITH PERFECTLY ANCHORED 3D FLORAL & SILK CORNERS  */}
        {/* =============================================================== */}
        <div className="relative max-w-[1360px] mx-auto">
          {/* Top-Left 3D Cream & Burgundy Floral Bouquet with Gold Leaves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-40 md:w-52 lg:w-64 pointer-events-none z-30 select-none"
          />
          {/* Top-Right 3D Cream & Burgundy Floral Bouquet with Gold Leaves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tr.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-40 md:w-52 lg:w-64 pointer-events-none z-30 select-none"
          />

          {/* Bottom-Left 3D Floral Bouquet & Sweeping Royal Purple Silk Wave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_bl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -bottom-5 -left-4 lg:-bottom-7 lg:-left-6 w-48 md:w-64 lg:w-80 pointer-events-none z-30 select-none"
          />
          {/* Bottom-Right 3D Floral Bouquet & Sweeping Royal Purple Silk Wave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_br.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -bottom-5 -right-4 lg:-bottom-7 lg:-right-6 w-48 md:w-64 lg:w-80 pointer-events-none z-30 select-none"
          />

          {/* ============================================================= */}
          {/* 1. 3D SCALLOPED ROYAL PLUM & 24K GOLD CROWN CARTOUCHE HEADER  */}
          {/* ============================================================= */}
          <div className="relative z-20 flex items-center justify-center w-full max-w-[1140px] mx-auto mb-1 sm:mb-2 px-2">
            {/* Left Extending Gold Filigree Line */}
            <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8963E]/70 to-[#9A6816] -mr-4 mt-3" />

            {/* Exact 3D Sculpted Gold Crown & Royal Plum Cartouche Plaque */}
            <div className="relative w-[330px] sm:w-[500px] md:w-[590px] lg:w-[630px] aspect-[420/94] shrink-0 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/showcase_cartouche_header.png"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_22px_rgba(40,6,25,0.22)]"
              />
              {/* Crisp Live Typography Centered Inside the Velvet Cartouche */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 sm:pt-4 md:pt-5 pb-1 px-12 text-center">
                <h2 className="font-serif font-extrabold text-[20px] sm:text-[32px] md:text-[38px] lg:text-[41px] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#FFE8A3] to-[#D4AF37] tracking-wide leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                  New Arrivals
                </h2>
                <p className="font-serif italic text-[#F8E7C8] text-[10px] sm:text-[14px] md:text-[15.5px] tracking-wide mt-0.5 sm:mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  Fresh Styles, Just for You!
                </p>
              </div>
            </div>

            {/* Right Extending Gold Filigree Line */}
            <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8963E]/70 to-[#9A6816] -ml-4 mt-3" />
          </div>

          {/* ============================================================= */}
          {/* 2. OVERLAPPING UPPER CREAM & 24K GOLD PILL TOOLBAR            */}
          {/* ============================================================= */}
          <div className="relative z-20 max-w-[1220px] mx-auto px-2 sm:px-8 -mb-5 sm:-mb-6">
            {/* Top-Center 24K Gold Diamond Clasp Connecting Header to Toolbar */}
            <span className="hidden sm:block absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#8C5818] border border-[#760159] shadow-xs" />

            <div className="rounded-full p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_12px_28px_rgba(40,6,25,0.16)]">
              <div className="rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EED9B3] px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 border border-[#FFFDF9]/85">
                {/* Left Group: Handpicked New Drops Pill + Verified Text + Custom Blouse Fit Gold Pill */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Dark Royal Magenta Pill Badge with Hanger SVG */}
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] text-[#FFE59E] border-[1.5px] border-[#D4AF37] text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.13em] shadow-sm shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE59E] shrink-0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 6a2 2 0 1 0-2-2c0 1.1.9 2 2 2v2L3.6 14.3A2 2 0 0 0 4.8 18h14.4a2 2 0 0 0 1.2-3.7L12 8" />
                    </svg>
                    <span className="sm:hidden">New Drops</span>
                    <span className="hidden sm:inline">Handpicked New Drops</span>
                  </span>

                  <span className="hidden md:inline-block w-[1.5px] h-5 bg-[#C8963E]/55 shrink-0" />

                  {/* Gold Checkmark Circle + Direct Loom Price Text */}
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[11.5px] lg:text-xs font-bold text-[#220915] truncate">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#B88228] border border-[#8C5818] flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-2.5 h-2.5 text-[#220915] stroke-[3]" />
                    </span>
                    <span>Full 6.3m Verified • Direct Loom Price</span>
                  </span>

                  {/* 3D Champagne-Gold Custom Blouse Fit Pill */}
                  <Link
                    href="/stitching-services"
                    className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-b from-[#FFF6D6] via-[#EED294] to-[#C8963E] hover:brightness-105 border border-[#8C5818] text-[11px] font-bold text-[#220915] shadow-xs transition-all shrink-0"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#760159]" />
                    <span>Custom Blouse Fit</span>
                  </Link>
                </div>

                {/* Right Group: Separate Circular < > Buttons + View All New Arrivals Pill */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setProdStartIndex(
                        (prev) =>
                          (prev - 1 + newArrivalProducts.length) % newArrivalProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#220915] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    aria-label="Previous new arrivals"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProdStartIndex((prev) => (prev + 1) % newArrivalProducts.length)
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#220915] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    aria-label="Next new arrivals"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </button>

                  <Link
                    href="/shop?sort=newest"
                    className="group inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] hover:from-[#9E0277] hover:to-[#54013F] text-[#FFFDF9] border-[1.5px] border-[#D4AF37] text-[10.5px] sm:text-xs font-serif font-bold shadow-[0_4px_12px_rgba(118,1,89,0.3)] transition-all"
                  >
                    <span>View All</span>
                    <span className="hidden sm:inline">New Arrivals</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. MAIN 24K GOLD SHOWROOM STAGE WITH 5 CARDS IN A ROW           */}
          {/* =============================================================== */}
          <div className="relative z-10 rounded-[26px] sm:rounded-[34px] p-[2.5px] bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_60px_rgba(40,6,25,0.18)]">
            <div className="relative rounded-[23.5px] sm:rounded-[31.5px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EFE0BE] pt-8 sm:pt-10 pb-6 sm:pb-8 px-2.5 sm:px-5 lg:px-6 overflow-hidden border border-[#FFFDF9]/70">
              {/* Ambient Warm Gold Glow */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.16) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(91,14,61,0.06) 0%, transparent 45%)',
                }}
              />

              {/* 2 CARDS PER ROW ON MOBILE (`grid-cols-2`), 5 IN A ROW ON DESKTOP (`lg:grid-cols-5`) */}
              {isProductsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 xl:gap-4 relative z-10">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-[20px] sm:rounded-[22px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] border-2 border-[#C8963E]/60 p-2 sm:p-2.5 animate-pulse space-y-2.5"
                    >
                      <div className="h-[195px] sm:h-[280px] w-full rounded-[14px] sm:rounded-[16px] bg-[#EED9BA]" />
                      <div className="h-3 w-1/2 rounded bg-[#E5CCA4]" />
                      <div className="h-4 w-4/5 rounded bg-[#E5CCA4]" />
                      <div className="h-8 w-full rounded-full bg-[#D9BC8C]" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 xl:gap-4 items-stretch">
                  {visibleNewArrivals.slice(0, 5).map((prod, idx) => {
                    const inWish = isInWishlist(prod._id);
                    const categoryObj = typeof prod.category === 'object' ? prod.category : null;
                    const categoryLabel = categoryObj?.name || 'ROYAL SAREE';
                    const fallbackImg = getCategoryFallbackImage(
                      `${categoryObj?.slug || ''} ${prod.name || ''}`
                    );
                    const prodImage = resolveMediaUrl(prod.images?.[0]?.url) || fallbackImg;
                    const hasDiscount =
                      Number(prod.compareAtPrice) > 0 &&
                      Number(prod.compareAtPrice) > Number(prod.price);

                    return (
                      <div
                        key={`new-${prod._id}-${idx}`}
                        className="group relative rounded-[20px] sm:rounded-[22px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_10px_24px_rgba(40,6,25,0.14)] hover:shadow-[0_20px_42px_rgba(118,1,89,0.26)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                      >
                        {/* Top-Center 24K Gold Diamond Star Finial on Each Card */}
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6816] border border-[#760159] shadow-2xs" />

                        <div className="h-full rounded-[18px] sm:rounded-[20px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EED9B3] p-2 sm:p-2.5 flex flex-col justify-between relative">
                          {/* TALL ROYAL PORTRAIT IMAGE FRAME */}
                          <div className="relative h-[195px] sm:h-[275px] xl:h-[295px] w-full rounded-[14px] sm:rounded-[16px] overflow-hidden bg-[#54013F] border-[1.5px] border-[#D4AF37] shadow-inner">
                            <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prodImage}
                                alt={prod.name}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.src !== fallbackImg) {
                                    target.src = fallbackImg;
                                  }
                                }}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                              />
                            </Link>

                            {/* Top-Left `✦ NEW #1` Royal Magenta & Gold Pill */}
                            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] border border-[#D4AF37] text-[#FFE59E] text-[8px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase shadow-md">
                                <Sparkles className="w-2.5 h-2.5 text-[#FFE59E] fill-[#FFE59E]" />
                                <span>NEW #{idx + 1}</span>
                              </span>
                            </div>

                            {/* Top-Right Circular White Wishlist Heart Button */}
                            <button
                              type="button"
                              onClick={(e) => handleWishlistToggle(prod, e)}
                              className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-[#FFF5F7] border border-[#E5D3B3] flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
                              aria-label="Add to wishlist"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWish
                                  ? 'fill-rose-600 text-rose-600'
                                  : 'fill-[#760159] text-[#760159]'
                                  }`}
                              />
                            </button>

                            {/* Bottom-Right Dark Royal Magenta & 24K Gold Oval Price Badge Inside Image */}
                            <div className="absolute bottom-2 right-2 z-20 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#25001C] border-[1.5px] border-[#D4AF37] text-[#FFE59E] font-serif font-extrabold text-[11px] sm:text-[13.5px] shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
                              {formatCurrency(prod.price)}
                            </div>
                          </div>

                          {/* PRODUCT DETAILS & ACTION BAR */}
                          <div className="pt-2 sm:pt-2.5 px-0.5 flex flex-col justify-between flex-1">
                            <div>
                              {/* Row 1: Warm Tan Category Pill + Green `● Ready` */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-b from-[#F5E3BE] to-[#E3C68C] border border-[#C8963E]/85 text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.08em] text-[#2B1206] uppercase truncate shadow-2xs">
                                  {categoryLabel}
                                </span>
                                <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#15803D] inline-flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                  Ready
                                </span>
                              </div>

                              {/* Row 2: Bold Uppercase Serif Title */}
                              <Link href={`/product/${prod.slug}`} className="block mt-1.5">
                                <h3 className="font-serif font-extrabold text-[11.5px] sm:text-[13.5px] uppercase tracking-tight text-[#1E0A10] group-hover:text-[#760159] transition-colors truncate">
                                  {prod.name}
                                </h3>
                              </Link>
                            </div>

                            {/* Row 3 & 4: Price & Add to Cart Pill + Arrow Circle */}
                            <div className="mt-1.5 sm:mt-2">
                              <div className="flex items-baseline justify-between gap-1 mb-2">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-serif font-extrabold text-[14px] sm:text-[16.5px] text-[#1E0A10]">
                                    {formatCurrency(prod.price)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-[9.5px] sm:text-[10.5px] text-[#7A5B3E] line-through font-medium">
                                      {formatCurrency(Number(prod.compareAtPrice))}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToCart(prod, e)}
                                  className="flex-1 py-1.5 sm:py-2 px-2.5 rounded-full bg-gradient-to-b from-[#760159] via-[#8E016B] to-[#54013F] hover:from-[#9E0277] hover:to-[#760159] text-[#FFFDF9] border-[1.5px] border-[#D4AF37] text-[10px] sm:text-[11px] font-serif font-bold flex items-center justify-center gap-1.5 shadow-[0_6px_14px_rgba(84,1,63,0.3)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                                >
                                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] shrink-0" />
                                  <span className="truncate">Add to Cart</span>
                                </button>

                                <Link
                                  href={`/product/${prod.slug}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#1E0A10] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all shrink-0"
                                  aria-label={`View ${prod.name}`}
                                >
                                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* 4. LOWER ATTACHED ROYAL PLUM & 24K GOLD ASSURANCE & CATALOG BAR */}
          {/* =============================================================== */}
          <div className="relative z-20 max-w-[1320px] mx-auto px-1 sm:px-4 -mt-3 sm:-mt-3.5">
            {/* Top-Center & Bottom-Center Ornate 24K Gold Diamond Clasps */}
            <span className="hidden sm:block absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] border border-[#760159] shadow-xs" />
            <span className="hidden sm:block absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] border border-[#760159] shadow-xs" />

            <div className="rounded-2xl lg:rounded-full p-[2px] bg-gradient-to-r from-[#8C5818] via-[#FFE59E] to-[#8C5818] shadow-[0_16px_36px_rgba(84,1,63,0.32)]">
              <div className="rounded-[14px] lg:rounded-full bg-gradient-to-b from-[#54013F] via-[#760159] to-[#3B012C] px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Left / Center 3 Gold-Icon Trust Pillars */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-[10.5px] sm:text-xs font-medium text-[#F8E7C8]">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] shrink-0" />
                    <span>5-Step Daylight Weave Inspection</span>
                  </span>

                  <span className="hidden sm:inline-block w-[1px] h-4 bg-[#D4AF37]/40" />

                  <span className="inline-flex items-center gap-2">
                    <Crown className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] fill-[#D4AF37] shrink-0" />
                    <span>Optional Custom Princess / Aari Blouse Stitching</span>
                  </span>

                  <span className="hidden md:inline-block w-[1px] h-4 bg-[#D4AF37]/40" />

                  <span className="hidden md:inline-flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] shrink-0" />
                    <span>Packed in Signature Nalmara Royal Box</span>
                  </span>
                </div>

                {/* Right: 3D Metallic 24K Gold Pill CTA Button */}
                <Link
                  href="/shop?sort=newest"
                  className="group inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-b from-[#FFF4B8] via-[#DFB752] to-[#9A6816] hover:brightness-105 border border-[#FFF6D6] text-[#1E0A10] font-serif font-extrabold text-[10.5px] sm:text-xs shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#760159] fill-[#760159]" />
                  <span>Explore Complete New Arrivals Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1E0A10] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 05. FESTIVE COLLECTION SHOWCASE — GRAND ROYAL PALACE MASTERPIECE    */}
      {/* =================================================================== */}
      <section className="relative max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-10 pb-8 sm:pb-12">
        {/* ================================================================= */}
        {/* MOBILE VIEW (sm:hidden): SHORT & GRAND ROYAL PALACE BANNER        */}
        {/* ================================================================= */}
        <div
          className="sm:hidden relative rounded-[24px] p-[2.5px] shadow-[0_18px_42px_rgba(84,1,63,0.34)]"
          style={{
            background:
              'linear-gradient(90deg, #8C5818 0%, #FFE59E 25%, #D4AF37 50%, #FFE59E 75%, #8C5818 100%)',
          }}
        >
          {/* Top & Bottom Center Royal Diamond Studs */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#760159] shadow-xs" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#760159] shadow-xs" />

          <div className="relative rounded-[21.5px] overflow-hidden bg-[#54013F]">
            {/* Background Bride Portrait Positioned on Right + Smooth Left Royal Velvet Gradient */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/images/nalmara/hd/festive_panoramic_master.jpg"
                alt="Celebrate in Style - Festive Collection"
                fill
                unoptimized
                className="object-cover object-[74%_top]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(84, 1, 63, 0.96) 0%, rgba(118, 1, 89, 0.90) 48%, rgba(118, 1, 89, 0.28) 74%, rgba(84, 1, 63, 0.35) 100%)',
                }}
              />
            </div>

            {/* Inner 24K Gold Hairline & Corner Brackets */}
            <div className="pointer-events-none absolute inset-2 border border-[#D4AF37]/45 rounded-[16px] z-20">
              <span className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-[1.5px] border-l-[1.5px] border-[#FFE59E] rounded-tl-md" />
              <span className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-[1.5px] border-r-[1.5px] border-[#FFE59E] rounded-tr-md" />
              <span className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-[1.5px] border-l-[1.5px] border-[#FFE59E] rounded-bl-md" />
              <span className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-[1.5px] border-r-[1.5px] border-[#FFE59E] rounded-br-md" />
            </div>

            {/* Compact Grand Editorial Content Stage */}
            <div className="relative z-10 p-4 pb-3">
              <div className="w-[68%] flex flex-col items-start text-left">
                {/* Top Royal Muhurtham Crest Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#760159]/95 border border-[#FFE59E]/85 mb-1.5 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-[#FFE59E]" />
                  <span className="text-[8px] font-bold tracking-[0.18em] text-[#FFE59E] uppercase">
                    CELEBRATE IN STYLE
                  </span>
                  <Sparkles className="w-2.5 h-2.5 text-[#FFE59E]" />
                </div>

                {/* Grand Festive Headline */}
                <h2 className="font-serif text-[24px] font-bold text-[#FFFDF9] tracking-tight leading-[1.06] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  Festive{' '}
                  <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FFF9E2] via-[#FFE08A] to-[#D4AF37]">
                    Collection
                  </span>
                </h2>

                {/* Gold Diamond Rule + Subtitle */}
                <div className="flex items-center gap-1.5 my-1">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] shrink-0" />
                  <span className="text-[10px] font-serif italic text-[#FFE59E] tracking-wide">
                    Traditional to Trendy – Just for You!
                  </span>
                </div>

                {/* Compact 2x2 Royal Category Pills */}
                <div className="grid grid-cols-2 gap-1.5 w-full mt-1.5 mb-2.5">
                  {[
                    { title: 'Kanchipuram Silks', href: '/shop?category=sarees' },
                    { title: 'Bridal Aari Blouses', href: '/stitching-services/bridal-designer-blouses' },
                    { title: 'Lehenga & Half Saree', href: '/stitching-services/lehenga-choli-half-saree' },
                    { title: 'Kids Pattu Couture', href: '/stitching-services/pavadai-sattai-pattu-pavadai' },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#760159]/90 border border-[#D4AF37]/75 text-[8.5px] font-serif font-semibold text-[#FFE59E] truncate shadow-2xs"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#FFE59E] shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))}
                </div>

                {/* Dual Compact Luxury CTA Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-b from-[#FFF4C2] via-[#E8BC56] to-[#B8801E] text-[#231008] font-serif font-bold text-[10.5px] shadow-[0_6px_16px_rgba(0,0,0,0.5)] border border-[#FFF6D6] shrink-0"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href="/stitching-services"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#760159]/90 text-[#FFE59E] border border-[#D4AF37] font-serif font-bold text-[10px] shadow-sm shrink-0"
                  >
                    <Scissors className="w-2.5 h-2.5 text-[#FFE59E]" />
                    <span>Stitching</span>
                  </Link>
                </div>
              </div>

              {/* Bottom 4-Item Royal Velvet & 24K Gold Assurance Strip */}
              <div className="mt-3 pt-2 border-t border-[#D4AF37]/40 grid grid-cols-4 gap-1">
                {[
                  { icon: Sparkles, label: 'Silk Sarees' },
                  { icon: Gem, label: 'Hand Aari' },
                  { icon: Package, label: 'Fast Delivery' },
                  { icon: Heart, label: 'Custom Fit' },
                ].map((pillar, i) => {
                  const IconComp = pillar.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg bg-[#54013F]/85 border border-[#D4AF37]/55"
                    >
                      <IconComp className="w-2.5 h-2.5 text-[#FFE59E] shrink-0" />
                      <span className="text-[8px] font-serif font-bold text-[#FFFDF9] truncate">
                        {pillar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TABLET & DESKTOP VIEW (hidden sm:block): FULL PALACE MASTERPIECE  */}
        {/* ================================================================= */}
        <div
          className="hidden sm:block relative rounded-[32px] p-[3px] shadow-[0_26px_65px_rgba(84,1,63,0.34)]"
          style={{
            background:
              'linear-gradient(90deg, #8C5818 0%, #FFE59E 25%, #D4AF37 50%, #FFE59E 75%, #8C5818 100%)',
          }}
        >
          {/* Top & Bottom Center Royal Diamond Studs */}
          <span className="hidden sm:block absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#760159] shadow-md" />
          <span className="hidden sm:block absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#760159] shadow-md" />

          <div className="relative rounded-[29px] overflow-hidden bg-[#54013F] min-h-[410px] sm:min-h-[460px] lg:min-h-[500px] flex items-center">
            {/* Seamless 1920x640 Panoramic HD Festive Masterpiece + Smooth Royal Velvet Gradient */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/images/nalmara/hd/festive_panoramic_master.jpg"
                alt="Celebrate in Style - Festive Collection"
                fill
                unoptimized
                className="object-cover object-[center_top]"
              />
              {/* Seamless Multi-Stop Royal Magenta Velvet Overlay (No Hard Vertical Cut) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(84, 1, 63, 0.96) 0%, rgba(118, 1, 89, 0.90) 36%, rgba(118, 1, 89, 0.32) 60%, rgba(84, 1, 63, 0.15) 74%, rgba(59, 1, 44, 0.78) 100%)',
                }}
              />
              {/* Subtle Top & Bottom Golden Temple Glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 22% 25%, rgba(212, 175, 55, 0.16) 0%, transparent 45%)',
                }}
              />
            </div>

            {/* Inner 24K Gold Hairline Frame & Ornamental Corner Filigree Brackets */}
            <div className="hidden sm:block absolute inset-3.5 border border-[#D4AF37]/55 rounded-[22px] pointer-events-none z-20">
              <span className="absolute -top-[1.5px] -left-[1.5px] w-8 h-8 border-t-2 border-l-2 border-[#FFE59E] rounded-tl-lg" />
              <span className="absolute -top-[1.5px] -right-[1.5px] w-8 h-8 border-t-2 border-r-2 border-[#FFE59E] rounded-tr-lg" />
              <span className="absolute -bottom-[1.5px] -left-[1.5px] w-8 h-8 border-b-2 border-l-2 border-[#FFE59E] rounded-bl-lg" />
              <span className="absolute -bottom-[1.5px] -right-[1.5px] w-8 h-8 border-b-2 border-r-2 border-[#FFE59E] rounded-br-lg" />
            </div>

            {/* Content Stage: Left Grand Festive Story + Center Bride Portrait + Right Royal Velvet Pillar Plaques */}
            <div className="relative z-20 w-full px-5 sm:px-10 lg:px-14 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Grand Festive Editorial Stage */}
              <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Top Royal Muhurtham Crest Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#760159]/95 border border-[#FFE59E]/90 mb-3.5 shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE59E]" />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-[#FFE59E] uppercase">
                    CELEBRATE IN STYLE • ROYAL FESTIVE EDIT
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE59E]" />
                </div>

                {/* Grand Editorial Headline */}
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-[60px] font-bold text-[#FFFDF9] tracking-tight leading-[1.06] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                  Festive{' '}
                  <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-b from-[#FFF9E2] via-[#FFE08A] to-[#D4AF37]">
                    Collection
                  </span>
                </h2>

                {/* Ornamental Gold Filigree Accent Bar */}
                <div className="flex items-center justify-center lg:justify-start gap-2.5 my-3 w-full max-w-sm">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[#FFE59E] border border-[#D4AF37]" />
                  <span className="h-[1.5px] flex-1 bg-gradient-to-r from-[#FFE59E] via-[#D4AF37] to-transparent" />
                  <span className="text-[11px] font-serif italic text-[#FFE59E] tracking-wider">
                    Traditional to Trendy – Just for You!
                  </span>
                </div>

                <p className="text-xs sm:text-sm lg:text-[15px] text-[#F9E8CA]/95 font-medium leading-relaxed max-w-xl drop-shadow">
                  Step into the season of lights and auspicious weddings with our handwoven Kanchipuram zari silks, custom-fitted bridal Aari blouses, and royal kids pattu couture.
                </p>

                {/* 2x2 Grand Festive Category Showcase Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl mt-5 mb-6">
                  {[
                    {
                      title: 'Kanchipuram Silks',
                      sub: 'Pure 6.3m Zari Weaves',
                      href: '/shop?category=sarees',
                    },
                    {
                      title: 'Bridal Aari Blouses',
                      sub: 'Hand Zardozi & Maggam',
                      href: '/stitching-services/bridal-designer-blouses',
                    },
                    {
                      title: 'Lehenga & Half Sarees',
                      sub: '16-Kali Festive Flare',
                      href: '/stitching-services/lehenga-choli-half-saree',
                    },
                    {
                      title: 'Kids Pattu Couture',
                      sub: 'Soft-Lined Pavadai Sets',
                      href: '/stitching-services/pavadai-sattai-pattu-pavadai',
                    },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#760159]/85 hover:bg-[#9E0277] border border-[#D4AF37]/80 shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 text-left"
                    >
                      <div className="min-w-0">
                        <span className="block font-serif font-bold text-xs sm:text-[13.5px] text-[#FFE59E] group-hover:text-white truncate">
                          {item.title}
                        </span>
                        <span className="block text-[10px] font-medium text-[#F5D996]/85 truncate mt-0.5">
                          {item.sub}
                        </span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 group-hover:bg-[#FFE59E] text-[#FFE59E] group-hover:text-[#760159] border border-[#D4AF37]/70 flex items-center justify-center shrink-0 transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Dual Luxury CTA Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 rounded-full bg-gradient-to-b from-[#FFF4C2] via-[#E8BC56] to-[#B8801E] hover:from-[#FFF8D6] hover:to-[#D4AF37] text-[#231008] font-serif font-bold text-xs sm:text-sm shadow-[0_10px_28px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.95)] border-[1.5px] border-[#FFF6D6] transition-all duration-300 hover:scale-105"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/stitching-services"
                    className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#760159]/90 hover:bg-[#9E0277] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-xs sm:text-sm shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all hover:scale-105"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#FFE59E]" />
                    <span>Book Festive Stitching</span>
                  </Link>
                </div>
              </div>

              {/* Right High-Contrast Royal Velvet & 24K Gold Pillar Plaques */}
              <div className="w-full lg:w-[250px] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2.5 sm:gap-3">
                {[
                  {
                    icon: Sparkles,
                    title: 'Premium Silk Sarees',
                    sub: 'Handloom 6.3m Zari Weaves',
                  },
                  {
                    icon: Gem,
                    title: 'Authentic Craftsmanship',
                    sub: 'Hand Aari & Zardozi Detail',
                  },
                  {
                    icon: Package,
                    title: 'Express Secure Delivery',
                    sub: '2–5 Days Across Tamil Nadu',
                  },
                  {
                    icon: Heart,
                    title: 'Stitched with Love',
                    sub: 'Custom Fit Guarantee',
                  },
                ].map((pillar, i) => {
                  const IconComp = pillar.icon;
                  return (
                    <div
                      key={i}
                      className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#54013F]/90 hover:bg-[#760159] backdrop-blur-md border-[1.5px] border-[#D4AF37] shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-x-1"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] text-[#54013F] flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="block font-serif font-bold text-[11px] sm:text-xs text-[#FFFDF9] group-hover:text-[#FFE59E] leading-tight truncate">
                          {pillar.title}
                        </span>
                        <span className="block text-[9.5px] font-medium text-[#FFE59E]/85 leading-tight mt-0.5 truncate">
                          {pillar.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 06. BEST SELLERS — GRAND 5-PRODUCTS-IN-A-ROW ROYAL SHOWCASE         */}
      {/* =================================================================== */}
      <section className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 pt-4 pb-10 sm:pt-8 sm:pb-14 overflow-hidden">
        {/* =============================================================== */}
        {/* STAGE WRAPPER WITH PERFECTLY ANCHORED 3D FLORAL & SILK CORNERS  */}
        {/* =============================================================== */}
        <div className="relative max-w-[1360px] mx-auto">
          {/* Top-Left 3D Cream & Burgundy Floral Bouquet with Gold Leaves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-4 -left-4 lg:-top-6 lg:-left-6 w-40 md:w-52 lg:w-64 pointer-events-none z-30 select-none"
          />
          {/* Top-Right 3D Cream & Burgundy Floral Bouquet with Gold Leaves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tr.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-40 md:w-52 lg:w-64 pointer-events-none z-30 select-none"
          />

          {/* Bottom-Left 3D Floral Bouquet & Sweeping Royal Purple Silk Wave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_bl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -bottom-5 -left-4 lg:-bottom-7 lg:-left-6 w-48 md:w-64 lg:w-80 pointer-events-none z-30 select-none"
          />
          {/* Bottom-Right 3D Floral Bouquet & Sweeping Royal Purple Silk Wave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_br.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute -bottom-5 -right-4 lg:-bottom-7 lg:-right-6 w-48 md:w-64 lg:w-80 pointer-events-none z-30 select-none"
          />

          {/* ============================================================= */}
          {/* 1. 3D SCALLOPED ROYAL PLUM & 24K GOLD CROWN CARTOUCHE HEADER  */}
          {/* ============================================================= */}
          <div className="relative z-20 flex items-center justify-center w-full max-w-[1140px] mx-auto mb-1 sm:mb-2 px-2">
            {/* Left Extending Gold Filigree Line */}
            <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8963E]/70 to-[#9A6816] -mr-4 mt-3" />

            {/* Exact 3D Sculpted Gold Crown & Royal Plum Cartouche Plaque */}
            <div className="relative w-[330px] sm:w-[500px] md:w-[590px] lg:w-[630px] aspect-[420/94] shrink-0 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/showcase_cartouche_header.png"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_22px_rgba(40,6,25,0.22)]"
              />
              {/* Crisp Live Typography Centered Inside the Velvet Cartouche */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 sm:pt-4 md:pt-5 pb-1 px-12 text-center">
                <h2 className="font-serif font-extrabold text-[20px] sm:text-[32px] md:text-[38px] lg:text-[41px] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#FFE8A3] to-[#D4AF37] tracking-wide leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                  Best Sellers
                </h2>
                <p className="font-serif italic text-[#F8E7C8] text-[10px] sm:text-[13.5px] md:text-[15px] tracking-wide mt-0.5 sm:mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] truncate max-w-full">
                  Customer Favorites &amp; Top-Rated Royal Weaves!
                </p>
              </div>
            </div>

            {/* Right Extending Gold Filigree Line */}
            <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8963E]/70 to-[#9A6816] -ml-4 mt-3" />
          </div>

          {/* ============================================================= */}
          {/* 2. OVERLAPPING UPPER CREAM & 24K GOLD PILL TOOLBAR            */}
          {/* ============================================================= */}
          <div className="relative z-20 max-w-[1220px] mx-auto px-2 sm:px-8 -mb-5 sm:-mb-6">
            {/* Top-Center 24K Gold Diamond Clasp Connecting Header to Toolbar */}
            <span className="hidden sm:block absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#8C5818] border border-[#760159] shadow-xs" />

            <div className="rounded-full p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_12px_28px_rgba(40,6,25,0.16)]">
              <div className="rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EED9B3] px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 border border-[#FFFDF9]/85">
                {/* Left Group: Top Customer Favorites Pill + Verified Text + Custom Blouse Fit Gold Pill */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Dark Royal Magenta Pill Badge with Crown Icon */}
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] text-[#FFE59E] border-[1.5px] border-[#D4AF37] text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.13em] shadow-sm shrink-0">
                    <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE59E] fill-[#D4AF37] shrink-0" />
                    <span className="sm:hidden">Top Favorites</span>
                    <span className="hidden sm:inline">Top Customer Favorites</span>
                  </span>

                  <span className="hidden md:inline-block w-[1.5px] h-5 bg-[#C8963E]/55 shrink-0" />

                  {/* Gold Checkmark Circle + Rated Text */}
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[11.5px] lg:text-xs font-bold text-[#220915] truncate">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#B88228] border border-[#8C5818] flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-2.5 h-2.5 text-[#220915] stroke-[3]" />
                    </span>
                    <span>4.9★ Rated Across Tamil Nadu • Direct Loom Price</span>
                  </span>

                  {/* 3D Champagne-Gold Custom Blouse Fit Pill */}
                  <Link
                    href="/stitching-services"
                    className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-b from-[#FFF6D6] via-[#EED294] to-[#C8963E] hover:brightness-105 border border-[#8C5818] text-[11px] font-bold text-[#220915] shadow-xs transition-all shrink-0"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#760159]" />
                    <span>Custom Blouse Fit</span>
                  </Link>
                </div>

                {/* Right Group: Separate Circular < > Buttons + View All Best Sellers Pill */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setBestSellerStartIndex(
                        (prev) =>
                          (prev - 1 + bestSellerProducts.length) % bestSellerProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#220915] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    aria-label="Previous best sellers"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBestSellerStartIndex(
                        (prev) => (prev + 1) % bestSellerProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#220915] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    aria-label="Next best sellers"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </button>

                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] hover:from-[#9E0277] hover:to-[#54013F] text-[#FFFDF9] border-[1.5px] border-[#D4AF37] text-[10.5px] sm:text-xs font-serif font-bold shadow-[0_4px_12px_rgba(118,1,89,0.3)] transition-all"
                  >
                    <span>View All</span>
                    <span className="hidden sm:inline">Best Sellers</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. MAIN 24K GOLD SHOWROOM STAGE WITH 5 CARDS IN A ROW           */}
          {/* =============================================================== */}
          <div className="relative z-10 rounded-[26px] sm:rounded-[34px] p-[2.5px] bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_60px_rgba(40,6,25,0.18)]">
            <div className="relative rounded-[23.5px] sm:rounded-[31.5px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EFE0BE] pt-8 sm:pt-10 pb-6 sm:pb-8 px-2.5 sm:px-5 lg:px-6 overflow-hidden border border-[#FFFDF9]/70">
              {/* Ambient Warm Gold Glow */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.16) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(91,14,61,0.06) 0%, transparent 45%)',
                }}
              />

              {/* 2 CARDS PER ROW ON MOBILE (`grid-cols-2`), 5 IN A ROW ON DESKTOP (`lg:grid-cols-5`) */}
              {isProductsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 xl:gap-4 relative z-10">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-[20px] sm:rounded-[22px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] border-2 border-[#C8963E]/60 p-2 sm:p-2.5 animate-pulse space-y-2.5"
                    >
                      <div className="h-[195px] sm:h-[280px] w-full rounded-[14px] sm:rounded-[16px] bg-[#EED9BA]" />
                      <div className="h-3 w-1/2 rounded bg-[#E5CCA4]" />
                      <div className="h-4 w-4/5 rounded bg-[#E5CCA4]" />
                      <div className="h-8 w-full rounded-full bg-[#D9BC8C]" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 xl:gap-4 items-stretch">
                  {visibleBestSellers.slice(0, 5).map((prod, idx) => {
                    const inWish = isInWishlist(prod._id);
                    const categoryObj = typeof prod.category === 'object' ? prod.category : null;
                    const categoryLabel = categoryObj?.name || 'ROYAL SAREE';
                    const fallbackImg = getCategoryFallbackImage(
                      `${categoryObj?.slug || ''} ${prod.name || ''}`
                    );
                    const prodImage = resolveMediaUrl(prod.images?.[0]?.url) || fallbackImg;
                    const hasDiscount =
                      Number(prod.compareAtPrice) > 0 &&
                      Number(prod.compareAtPrice) > Number(prod.price);

                    return (
                      <div
                        key={`best-${prod._id}-${idx}`}
                        className="group relative rounded-[20px] sm:rounded-[22px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_10px_24px_rgba(40,6,25,0.14)] hover:shadow-[0_20px_42px_rgba(118,1,89,0.26)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                      >
                        {/* Top-Center 24K Gold Diamond Star Finial on Each Card */}
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6816] border border-[#760159] shadow-2xs" />

                        <div className="h-full rounded-[18px] sm:rounded-[20px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#EED9B3] p-2 sm:p-2.5 flex flex-col justify-between relative">
                          {/* TALL ROYAL PORTRAIT IMAGE FRAME */}
                          <div className="relative h-[195px] sm:h-[275px] xl:h-[295px] w-full rounded-[14px] sm:rounded-[16px] overflow-hidden bg-[#54013F] border-[1.5px] border-[#D4AF37] shadow-inner">
                            <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={prodImage}
                                alt={prod.name}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.src !== fallbackImg) {
                                    target.src = fallbackImg;
                                  }
                                }}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                              />
                            </Link>

                            {/* Top-Left `✦ TOP #1` Royal Magenta & Gold Pill */}
                            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#300024] border border-[#D4AF37] text-[#FFE59E] text-[8px] sm:text-[9.5px] font-bold tracking-[0.08em] uppercase shadow-md">
                                <Sparkles className="w-2.5 h-2.5 text-[#FFE59E] fill-[#FFE59E]" />
                                <span>TOP #{idx + 1}</span>
                              </span>
                            </div>

                            {/* Top-Right Circular White Wishlist Heart Button */}
                            <button
                              type="button"
                              onClick={(e) => handleWishlistToggle(prod, e)}
                              className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-[#FFF5F7] border border-[#E5D3B3] flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
                              aria-label="Add to wishlist"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWish
                                  ? 'fill-rose-600 text-rose-600'
                                  : 'fill-[#760159] text-[#760159]'
                                  }`}
                              />
                            </button>

                            {/* Bottom-Right Dark Royal Magenta & 24K Gold Oval Price Badge Inside Image */}
                            <div className="absolute bottom-2 right-2 z-20 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-b from-[#760159] via-[#54013F] to-[#25001C] border-[1.5px] border-[#D4AF37] text-[#FFE59E] font-serif font-extrabold text-[11px] sm:text-[13.5px] shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
                              {formatCurrency(prod.price)}
                            </div>
                          </div>

                          {/* PRODUCT DETAILS & ACTION BAR */}
                          <div className="pt-2 sm:pt-2.5 px-0.5 flex flex-col justify-between flex-1">
                            <div>
                              {/* Row 1: Warm Tan Category Pill + Green `● Ready` */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-b from-[#F5E3BE] to-[#E3C68C] border border-[#C8963E]/85 text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.08em] text-[#2B1206] uppercase truncate shadow-2xs">
                                  {categoryLabel}
                                </span>
                                <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#15803D] inline-flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                  Ready
                                </span>
                              </div>

                              {/* Row 2: Bold Uppercase Serif Title */}
                              <Link href={`/product/${prod.slug}`} className="block mt-1.5">
                                <h3 className="font-serif font-extrabold text-[11.5px] sm:text-[13.5px] uppercase tracking-tight text-[#1E0A10] group-hover:text-[#760159] transition-colors truncate">
                                  {prod.name}
                                </h3>
                              </Link>
                            </div>

                            {/* Row 3 & 4: Price & Add to Cart Pill + Arrow Circle */}
                            <div className="mt-1.5 sm:mt-2">
                              <div className="flex items-baseline justify-between gap-1 mb-2">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-serif font-extrabold text-[14px] sm:text-[16.5px] text-[#1E0A10]">
                                    {formatCurrency(prod.price)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-[9.5px] sm:text-[10.5px] text-[#7A5B3E] line-through font-medium">
                                      {formatCurrency(Number(prod.compareAtPrice))}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToCart(prod, e)}
                                  className="flex-1 py-1.5 sm:py-2 px-2.5 rounded-full bg-gradient-to-b from-[#760159] via-[#8E016B] to-[#54013F] hover:from-[#9E0277] hover:to-[#760159] text-[#FFFDF9] border-[1.5px] border-[#D4AF37] text-[10px] sm:text-[11px] font-serif font-bold flex items-center justify-center gap-1.5 shadow-[0_6px_14px_rgba(84,1,63,0.3)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                                >
                                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] shrink-0" />
                                  <span className="truncate">Add to Cart</span>
                                </button>

                                <Link
                                  href={`/product/${prod.slug}`}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#F1DFBD] hover:from-[#760159] hover:to-[#54013F] text-[#1E0A10] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37] flex items-center justify-center shadow-xs transition-all shrink-0"
                                  aria-label={`View ${prod.name}`}
                                >
                                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* 4. LOWER ATTACHED ROYAL PLUM & 24K GOLD ASSURANCE & CATALOG BAR */}
          {/* =============================================================== */}
          <div className="relative z-20 max-w-[1320px] mx-auto px-1 sm:px-4 -mt-3 sm:-mt-3.5">
            {/* Top-Center & Bottom-Center Ornate 24K Gold Diamond Clasps */}
            <span className="hidden sm:block absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] border border-[#760159] shadow-xs" />
            <span className="hidden sm:block absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] border border-[#760159] shadow-xs" />

            <div className="rounded-2xl lg:rounded-full p-[2px] bg-gradient-to-r from-[#8C5818] via-[#FFE59E] to-[#8C5818] shadow-[0_16px_36px_rgba(84,1,63,0.32)]">
              <div className="rounded-[14px] lg:rounded-full bg-gradient-to-b from-[#54013F] via-[#760159] to-[#3B012C] px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Left / Center 3 Gold-Icon Trust Pillars */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-[10.5px] sm:text-xs font-medium text-[#F8E7C8]">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] shrink-0" />
                    <span>5-Step Daylight Weave Inspection</span>
                  </span>

                  <span className="hidden sm:inline-block w-[1px] h-4 bg-[#D4AF37]/40" />

                  <span className="inline-flex items-center gap-2">
                    <Crown className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] fill-[#D4AF37] shrink-0" />
                    <span>Optional Custom Princess / Aari Blouse Stitching</span>
                  </span>

                  <span className="hidden md:inline-block w-[1px] h-4 bg-[#D4AF37]/40" />

                  <span className="hidden md:inline-flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#FFE59E] shrink-0" />
                    <span>Packed in Signature Nalmara Royal Box</span>
                  </span>
                </div>

                {/* Right: 3D Metallic 24K Gold Pill CTA Button */}
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-b from-[#FFF4B8] via-[#DFB752] to-[#9A6816] hover:brightness-105 border border-[#FFF6D6] text-[#1E0A10] font-serif font-extrabold text-[10.5px] sm:text-xs shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#760159] fill-[#760159]" />
                  <span>Explore Complete Best Sellers Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1E0A10] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 06. WHY CHOOSE NALMARA FASHION? (Full Container-Fluid Bleed Section)*/}
      {/* =================================================================== */}
      <section className="relative w-full max-w-full overflow-hidden border-y-2 border-[#D4AF37]/80 py-10 sm:py-16 shadow-[0_24px_64px_rgba(30,2,20,0.45)] isolate">
        {/* Full-Bleed Container-Fluid High Clarity Royal Magenta Silk Background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/why_choose_bg_hd.jpg"
            alt="Why Choose Nalmara Fashion Background"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
          {/* Subtle Ambient Vignette & Top/Bottom Gold Edge Filigree Highlighting */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE59E] to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent z-20 pointer-events-none" />
        </div>

        {/* Fluid Interior Container */}
        <div className="relative z-10 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* ============================================================= */}
          {/* 1. 3D CROWN & "THE NALMARA PROMISE" SCALLOPED PLAQUE HEADER   */}
          {/* ============================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[1040px] mx-auto">
            {/* Top Crown & Promise Plaque Flanked by Extending Gold Filigree Lines */}
            <div className="flex items-center justify-center w-full max-w-[960px] mx-auto">
              <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E] -mr-3 mt-4" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/why_choose_promise_plaque.png"
                alt="The Nalmara Promise"
                className="w-[280px] sm:w-[380px] md:w-[440px] h-auto object-contain select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
              />
              <div className="hidden md:block h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E] -ml-3 mt-4" />
            </div>

            {/* Grand Headline: WHY CHOOSE NALMARA FASHION? */}
            <h2 className="font-serif font-black text-2xl sm:text-4xl lg:text-[44px] tracking-tight leading-tight mt-2 sm:mt-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]">
              <span className="text-[#FFFDF9]">WHY CHOOSE </span>
              <span className="text-[#FFE59E] bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
                NALMARA FASHION?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="font-sans font-bold text-[10.5px] sm:text-xs md:text-[13.5px] tracking-[0.22em] uppercase text-[#FFE59E]/95 mt-1.5 sm:mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              CRAFTED WITH PASSION • DESIGNED FOR YOU • TRUSTED BY THOUSANDS
            </p>

            {/* Upper 3D Golden Lotus Divider */}
            <div className="flex items-center justify-center gap-3 mt-2 sm:mt-3 mb-4 sm:mb-6 w-full max-w-[560px] mx-auto">
              <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/why_choose_gold_lotus.png"
                alt=""
                aria-hidden="true"
                className="w-14 sm:w-18 h-auto object-contain select-none drop-shadow-md"
              />
              <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. 5 SCULPTED 3D ROYAL MUGHAL ARCH SHIELD PILLAR CARDS        */}
          {/* ============================================================= */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 xl:gap-6 w-full max-w-[1580px] mx-auto items-stretch">
            {[
              {
                medallion: '/images/nalmara/hd/why_choose_medallion_1.png',
                title: 'HANDPICKED STYLES',
                kicker: 'LATEST TRENDS',
                desc: 'Curated collections to keep you stylish and trendy.',
              },
              {
                medallion: '/images/nalmara/hd/why_choose_medallion_2.png',
                title: 'PREMIUM QUALITY',
                kicker: 'BEST FABRICS',
                desc: '100% quality fabrics for lasting comfort.',
              },
              {
                medallion: '/images/nalmara/hd/why_choose_medallion_3.png',
                title: 'PERFECT FIT & STITCHING',
                kicker: 'WITH CARE',
                desc: 'Master tailoring for a flawless fit every time.',
              },
              {
                medallion: '/images/nalmara/hd/why_choose_medallion_4.png',
                title: 'TRUSTED CUSTOMER SERVICE',
                kicker: 'ALWAYS HERE FOR YOU',
                desc: 'Personalized support for a hassle-free shopping experience.',
              },
              {
                medallion: '/images/nalmara/hd/why_choose_medallion_5.png',
                title: 'VALUE FOR MONEY',
                kicker: 'MORE STYLE, LESS COST',
                desc: 'Premium fashion at the best prices.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative aspect-[240/275] w-full flex flex-col items-center justify-between text-center select-none transition-transform duration-300 hover:-translate-y-2 hover:drop-shadow-[0_16px_32px_rgba(212,175,55,0.4)]"
              >
                {/* Sculpted 3D Royal Mughal Arch Shield Card Frame with Bottom Gold Lotus */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/nalmara/hd/why_choose_arch_shield_card.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none drop-shadow-[0_14px_28px_rgba(0,0,0,0.35)]"
                />

                {/* Card Interior Content Aligned Inside the Mughal Arch Shield */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-[12%] sm:pt-[13%] pb-[14%] px-[8%] sm:px-[9%]">
                  {/* 3D Royal Plum & 24K Gold Medallion Icon */}
                  <div className="w-[32%] sm:w-[34%] aspect-square shrink-0 mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.medallion}
                      alt={card.title}
                      className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
                    />
                  </div>

                  {/* Bold Serif Pillar Title */}
                  <h3 className="font-serif font-extrabold text-[#1E0A10] leading-tight tracking-tight text-[11px] sm:text-[13px] md:text-[14px] xl:text-[15px] uppercase">
                    {card.title}
                  </h3>

                  {/* Scalloped Deep Royal Plum & 24K Gold Kicker Pill with 4-Point Stars */}
                  <div className="mt-1 sm:mt-1.5 mb-1.5 inline-flex items-center">
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rotate-45 bg-[#D4AF37] -mr-1 z-10" />
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-gradient-to-b from-[#54013F] via-[#450035] to-[#2B031B] border border-[#D4AF37] text-[#FFFDF9] text-[7.5px] sm:text-[8.5px] xl:text-[9px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.1em] shadow-[0_2px_6px_rgba(0,0,0,0.3)] whitespace-nowrap">
                      <span className="text-[#FFE59E] text-[7px] sm:text-[8px]">✦</span>
                      <span>{card.kicker}</span>
                      <span className="text-[#FFE59E] text-[7px] sm:text-[8px]">✦</span>
                    </span>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rotate-45 bg-[#D4AF37] -ml-1 z-10" />
                  </div>

                  {/* Crisp 3-Line Description */}
                  <p className="text-[9px] sm:text-[11px] xl:text-[11.5px] font-medium text-[#220915] leading-[1.35] line-clamp-3">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================= */}
          {/* 3. LOWER 3D GOLDEN LOTUS EMBLEM & FILIGREE RULE               */}
          {/* ============================================================= */}
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-[620px] mx-auto">
            <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/why_choose_gold_lotus.png"
              alt=""
              aria-hidden="true"
              className="w-16 sm:w-20 h-auto object-contain select-none drop-shadow-md"
            />
            <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 07. STYLE INSPIRATION ("Follow Us @nalmarafashion" — Live Feed)     */}
      {/* =================================================================== */}
      {visibleStyleInspiration.length > 0 && (
        <section
          className="relative w-full overflow-hidden py-10 sm:py-16 border-b border-[#D4AF37]/45"
          style={{
            backgroundImage: "url('/images/nalmara/hd/style_inspiration_bg_hd.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#FAF5ED',
          }}
        >
          {/* Left Mannequin in Couture Plum Gown (100% Transparent Cutout, Full HD, Majestic Sizing) */}
          <div className="hidden lg:block absolute left-0 xl:left-4 2xl:left-10 bottom-0 z-10 pointer-events-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/style_mannequin_transparent_hd.png"
              alt="Nalmara Fashion Couture Mannequin"
              className="w-52 lg:w-64 xl:w-72 2xl:w-84 h-auto object-contain drop-shadow-[0_20px_42px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
            {/* TOP HEADER BLOCK: GOLD LOTUS + PLAQUE + "Style Inspiration" + INSTAGRAM LINK */}
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              {/* 3D Gold Lotus Icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/why_choose_gold_lotus.png"
                alt="Nalmara Lotus"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
              />

              {/* Royal Plum Plaque: Nalmara Fashion */}
              <div className="inline-flex items-center px-5 py-1 rounded-full bg-[#760159] border border-[#D4AF37] shadow-[0_3px_10px_rgba(118,1,89,0.35)] mt-1">
                <span className="font-serif text-[10.5px] sm:text-xs font-bold text-[#FFE59E] uppercase tracking-[0.22em]">
                  Nalmara Fashion
                </span>
              </div>

              {/* Main Headline: Style Inspiration with Golden Laurel Leaves */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-1">
                {/* Left Gold Leaf Sprig */}
                <svg
                  className="w-6 sm:w-10 lg:w-12 h-auto text-[#D4AF37] opacity-85 shrink-0"
                  viewBox="0 0 60 30"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 25C15 18 35 15 55 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M18 19C14 14 16 7 23 8C25 14 22 18 18 19Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M32 16C28 10 31 3 38 5C39 11 36 15 32 16Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M44 14C42 8 46 2 52 4C53 10 49 13 44 14Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                </svg>

                <h2 className="flex items-center gap-2 sm:gap-3 leading-none">
                  <span className="font-script text-4xl sm:text-6xl lg:text-7xl text-[#760159] font-normal drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">
                    Style
                  </span>
                  <span className="font-serif font-black text-2xl sm:text-4xl lg:text-[46px] uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#9E6B18] via-[#D4AF37] to-[#8C5818] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                    Inspiration
                  </span>
                </h2>

                {/* Right Gold Leaf Sprig (Mirrored) */}
                <svg
                  className="w-6 sm:w-10 lg:w-12 h-auto text-[#D4AF37] opacity-85 shrink-0 -scale-x-100"
                  viewBox="0 0 60 30"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 25C15 18 35 15 55 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M18 19C14 14 16 7 23 8C25 14 22 18 18 19Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M32 16C28 10 31 3 38 5C39 11 36 15 32 16Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M44 14C42 8 46 2 52 4C53 10 49 13 44 14Z" fill="#D4AF37" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>

              {/* Subtitle Link: Follow Us @NalmaraFashion */}
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-serif font-bold text-xs sm:text-sm lg:text-base text-[#4A0830] hover:text-[#760159] transition-colors mt-1"
              >
                <Instagram className="w-4 h-4 text-[#760159]" />
                <span>Follow Us @NalmaraFashion</span>
              </a>
            </div>

            {/* 5-CARD CAROUSEL GALLERY WITH LEFT < AND RIGHT > BUTTONS */}
            <div className="relative px-2 sm:px-6 lg:px-8 max-w-[1220px] mx-auto">
              {/* Left Circular Navigation Arrow */}
              <button
                type="button"
                onClick={() =>
                  setInstaStartIndex(
                    (prev) =>
                      (prev - 1 + Math.max(1, styleInspirationList.length)) %
                      Math.max(1, styleInspirationList.length)
                  )
                }
                aria-label="Previous lookbook inspiration"
                className="absolute -left-2 sm:-left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_20px_rgba(74,10,46,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="w-full h-full rounded-full flex items-center justify-center bg-white text-[#760159] shadow-inner">
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.6]" />
                </span>
              </button>

              {/* Right Circular Navigation Arrow */}
              <button
                type="button"
                onClick={() =>
                  setInstaStartIndex(
                    (prev) => (prev + 1) % Math.max(1, styleInspirationList.length)
                  )
                }
                aria-label="Next lookbook inspiration"
                className="absolute -right-2 sm:-right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_20px_rgba(74,10,46,0.35)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="w-full h-full rounded-full flex items-center justify-center bg-white text-[#760159] shadow-inner">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.6]" />
                </span>
              </button>

              {/* 5 Cards Grid */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
                {visibleStyleInspiration.map((item, idx) => {
                  const isLiked = Boolean(likedInspire[item.id]);
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`group relative rounded-[20px] p-[2.5px] shadow-[0_12px_28px_rgba(74,10,46,0.22)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(118,1,89,0.35)] transition-all duration-300 ${
                        idx === 4
                          ? 'col-span-2 sm:col-span-1 max-w-[220px] sm:max-w-none mx-auto w-full'
                          : ''
                      }`}
                      style={{
                        background:
                          'linear-gradient(145deg, #FFFDF7 0%, #FFE59E 22%, #D4AF37 52%, #8C5818 82%, #FFE59E 100%)',
                      }}
                    >
                      <div className="relative w-full aspect-[3/3.88] rounded-[18px] overflow-hidden bg-[#240316] border border-[#FFE59E]/70">
                        <Link
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          className="block w-full h-full"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-[#1A010E]/80 via-[#1A010E]/25 to-transparent" />
                        </Link>

                        {/* Top-Right Instagram Square Rounded Badge */}
                        <a
                          href={item.external ? item.href : 'https://www.instagram.com/nalmarafashion'}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${item.title} on Instagram`}
                          className="absolute top-2.5 right-2.5 z-20 w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-[9px] bg-gradient-to-br from-[#760159] to-[#450134] border border-[#FFE59E]/85 flex items-center justify-center text-[#FFFDF9] shadow-[0_3px_8px_rgba(0,0,0,0.45)] hover:scale-110 transition-transform"
                        >
                          <Instagram className="w-4 h-4 stroke-[2.2]" />
                        </a>

                        {/* Bottom Royal Plum Pill Badge with Category Name */}
                        <div className="absolute inset-x-1.5 sm:inset-x-2 bottom-2 z-20">
                          <div
                            className="px-2.5 py-1.5 rounded-full border border-[#FFE59E]/85 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
                            style={{
                              background:
                                'linear-gradient(180deg, #760159 0%, #54013F 58%, #220215 100%)',
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLikedInspire((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }));
                              }}
                              aria-label="Like style"
                              className="shrink-0 text-[#FFF4C2] hover:scale-120 transition-transform cursor-pointer"
                            >
                              <Heart
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  isLiked
                                    ? 'fill-rose-500 text-rose-500'
                                    : 'text-[#FFE59E] stroke-[2.2]'
                                }`}
                              />
                            </button>
                            <Link
                              href={item.href}
                              target={item.external ? '_blank' : undefined}
                              rel={item.external ? 'noopener noreferrer' : undefined}
                              className="min-w-0 font-serif font-bold text-[9px] sm:text-[10.5px] lg:text-[11px] uppercase tracking-wider text-[#FFFDF9] truncate text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM FEATURE BADGES & "Follow Us →" CTA BAR (Always Single Line, No Wrapping) */}
            <div className="mt-7 sm:mt-9 w-full max-w-[1240px] mx-auto px-2 sm:px-4 overflow-x-auto no-scrollbar">
              <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3.5 md:gap-5 lg:gap-6 text-[#4A0830] whitespace-nowrap min-w-max mx-auto py-1.5">
                {/* Feature 1: Trendy Collections */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-serif font-semibold shrink-0">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#760159] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2.1L2 14v2h20v-2l-7.8-6.9c.5-.6.8-1.3.8-2.1a3 3 0 0 0-3-3zM2 18h20v2H2z"/>
                  </svg>
                  <span>Trendy Collections</span>
                </div>

                <span className="h-3.5 sm:h-4 w-[1px] bg-[#D4AF37]/50 shrink-0" />

                {/* Feature 2: Premium Quality */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-serif font-semibold shrink-0">
                  <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#760159] shrink-0" />
                  <span>Premium Quality</span>
                </div>

                <span className="h-3.5 sm:h-4 w-[1px] bg-[#D4AF37]/50 shrink-0" />

                {/* Center CTA Button: Follow Us -> */}
                <a
                  href="https://www.instagram.com/nalmarafashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-full p-[2px] shadow-[0_8px_20px_rgba(118,1,89,0.38)] hover:scale-105 active:scale-95 transition-transform shrink-0"
                  style={{
                    background:
                      'linear-gradient(90deg, #9E6B18 0%, #FFE59E 28%, #FFFDF9 50%, #FFE59E 72%, #9E6B18 100%)',
                  }}
                >
                  <span
                    className="inline-flex items-center gap-2 px-5 sm:px-7 md:px-8 py-1.5 sm:py-2 rounded-full border border-[#FFE59E]/85 font-serif font-bold text-xs sm:text-sm text-[#FFFDF9] tracking-wider shadow-inner"
                    style={{
                      background:
                        'linear-gradient(180deg, #760159 0%, #54013F 60%, #300124 100%)',
                    }}
                  >
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE59E]" />
                    <span>Follow Us</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFE59E] group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <span className="h-3.5 sm:h-4 w-[1px] bg-[#D4AF37]/50 shrink-0" />

                {/* Feature 3: Stylish Choices */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-serif font-semibold shrink-0">
                  <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#760159] shrink-0" />
                  <span>Stylish Choices</span>
                </div>

                <span className="h-3.5 sm:h-4 w-[1px] bg-[#D4AF37]/50 shrink-0" />

                {/* Feature 4: For Every You */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-serif font-semibold shrink-0">
                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#760159] shrink-0" />
                  <span>For Every You</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 08. DEDICATED SECTION: HAPPY CUSTOMERS & GOOGLE VERIFIED REVIEWS    */}
      {/* =================================================================== */}
      <section className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-10 overflow-hidden">
        <div
          className="relative max-w-[1360px] mx-auto rounded-[28px] sm:rounded-[36px] px-4 sm:px-8 lg:px-12 pt-7 pb-9 sm:pt-10 sm:pb-12 overflow-hidden border border-[#D4AF37]/45 shadow-[0_18px_48px_rgba(40,6,25,0.10)]"
          style={{
            background:
              'radial-gradient(circle at 50% 18%, #FFFDF9 0%, #FAF0DC 52%, #EFE0BE 100%)',
          }}
        >
          {/* Subtle Champagne Silk Drape Highlights */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 20% 0%, rgba(255,253,249,0.85) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(255,253,249,0.85) 0%, transparent 50%), radial-gradient(circle at 50% 65%, rgba(212,175,55,0.15) 0%, transparent 55%)',
            }}
          />

          {/* Top-Left & Top-Right 3D Cream & Burgundy Floral Bouquets with 24K Gold Leaves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute top-0 left-0 w-36 md:w-48 lg:w-60 pointer-events-none z-20 select-none"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_tr.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute top-0 right-0 w-36 md:w-48 lg:w-60 pointer-events-none z-20 select-none"
          />

          {/* Bottom-Left & Bottom-Right 3D Floral Bouquets & Sweeping Royal Purple Silk Waves */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_bl.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute bottom-0 left-0 w-44 md:w-60 lg:w-72 pointer-events-none z-20 select-none"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nalmara/hd/showcase_corner_br.png"
            alt=""
            aria-hidden="true"
            className="hidden sm:block absolute bottom-0 right-0 w-44 md:w-60 lg:w-72 pointer-events-none z-20 select-none"
          />

          {/* ============================================================= */}
          {/* 1. TOP CENTERED ROYAL HEADER + GOOGLE BUSINESS RATING PILL    */}
          {/* ============================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[980px] mx-auto">
            {/* Scalloped Royal Plum & Gold "OUR HAPPY FAMILY" Plaque Flanked by Extending Gold Filigree Lines */}
            <div className="flex items-center justify-center w-full max-w-[780px] mx-auto">
              <div className="hidden sm:block h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8963E] to-[#9A6816]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/happy_faq_top_plaque.png"
                alt="Our Happy Family"
                className="w-[190px] sm:w-[240px] md:w-[265px] h-auto object-contain mx-2 select-none drop-shadow-[0_6px_14px_rgba(40,6,25,0.18)]"
              />
              <div className="hidden sm:block h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8963E] to-[#9A6816]" />
            </div>

            {/* Main Royal Burgundy-Plum Serif Headline */}
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-[44px] text-[#4A0830] tracking-tight leading-[1.1] mt-1 sm:mt-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
              Happy Customers &amp; Google Reviews
            </h2>

            {/* Italic Subtitle */}
            <p className="font-serif italic text-xs sm:text-base lg:text-[19px] text-[#220915] font-medium mt-1 inline-flex items-center justify-center gap-1.5">
              <span>Your trust inspires us to do better</span>
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#4A0830] stroke-[2.2]" />
            </p>

            {/* Upper 3D Golden Lotus Divider */}
            <div className="flex items-center justify-center gap-2 mt-1.5 mb-3">
              <span className="h-[1px] w-14 sm:w-28 bg-gradient-to-r from-transparent to-[#B88228]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/why_choose_gold_lotus.png"
                alt=""
                aria-hidden="true"
                className="w-24 sm:w-28 h-auto object-contain select-none"
              />
              <span className="h-[1px] w-14 sm:w-28 bg-gradient-to-l from-transparent to-[#B88228]" />
            </div>

            {/* Official Google Business Profile Summary Pill Bar + 5 Smiling Patron Avatars */}
            <a
              href={googleMeta.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0BD] border-[1.5px] border-[#D4AF37] shadow-[0_8px_22px_rgba(65,10,38,0.10)] hover:shadow-[0_12px_28px_rgba(65,10,38,0.18)] hover:-translate-y-0.5 transition-all mb-6 sm:mb-8"
            >
              {/* Multi-Color Official Google "G" Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-b from-[#4A0830] to-[#240114] border border-[#D4AF37] text-[#FFE59E] text-[10.5px] sm:text-xs font-serif font-bold">
                <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" width={12} height={12} className="w-3 h-3">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                </span>
                <span>Google Verified</span>
              </span>

              {/* 4.9 ★★★★★ (248+ Google Reviews) */}
              <div className="inline-flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-sm sm:text-base text-[#231008]">
                  {googleMeta.overallRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FBBC05] text-[#D99B00]"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#4A0830]">
                  ({googleMeta.totalReviews}+ Reviews)
                </span>
              </div>

              <span className="hidden md:inline-block h-4 w-[1px] bg-[#C8922E]/50" />

              {/* 5 Circular Smiling Patron Portraits Strip + "Join our happy customers ♡" */}
              <div className="hidden sm:inline-flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/nalmara/hd/happy_faq_avatars_strip.png"
                  alt="Happy Nalmara Patrons"
                  className="h-7 sm:h-8 w-auto object-contain rounded-full"
                />
                <span className="font-serif font-bold text-xs sm:text-[13.5px] text-[#231008] group-hover:text-[#4A0830] transition-colors">
                  Join our happy customers ♡
                </span>
              </div>
            </a>
          </div>

          {/* ============================================================= */}
          {/* 2. 3 SCULPTED 3D ROYAL GOOGLE REVIEW CARDS WITH < > ARROWS    */}
          {/* ============================================================= */}
          <div className="relative z-10 max-w-[1180px] mx-auto px-2 sm:px-7">
            {/* Left Circular Pearl & 24K Gold Bezel Navigation Arrow */}
            <button
              type="button"
              onClick={() =>
                setReviewStartIndex(
                  (prev) =>
                    (prev - 1 + Math.max(1, allHappyReviews.length)) %
                    Math.max(1, allHappyReviews.length)
                )
              }
              aria-label="Previous Google review"
              className="absolute -left-1.5 sm:-left-1 lg:-left-2.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF9E2] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_22px_rgba(74,10,46,0.28)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span
                className="w-full h-full rounded-full flex items-center justify-center text-[#380523] border border-[#FFFDF9] shadow-inner"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FFFDF9 0%, #FAF0DC 62%, #E5C892 100%)',
                }}
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.6]" />
              </span>
            </button>

            {/* Right Circular Pearl & 24K Gold Bezel Navigation Arrow */}
            <button
              type="button"
              onClick={() =>
                setReviewStartIndex(
                  (prev) => (prev + 1) % Math.max(1, allHappyReviews.length)
                )
              }
              aria-label="Next Google review"
              className="absolute -right-1.5 sm:-right-1 lg:-right-2.5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF9E2] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_22px_rgba(74,10,46,0.28)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span
                className="w-full h-full rounded-full flex items-center justify-center text-[#380523] border border-[#FFFDF9] shadow-inner"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, #FFFDF9 0%, #FAF0DC 62%, #E5C892 100%)',
                }}
              >
                <ChevronRight className="w-5 h-5 stroke-[2.6]" />
              </span>
            </button>

            {/* 3 Sculpted 3D Royal Gold-Framed Google Review Cards (Mobile: 1 Card Slider | Desktop: 3 Cards) */}
            <div
              onTouchStart={(e) => setReviewTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (reviewTouchStartX === null) return;
                const diff = reviewTouchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) {
                    setReviewStartIndex(
                      (prev) => (prev + 1) % Math.max(1, allHappyReviews.length)
                    );
                  } else {
                    setReviewStartIndex(
                      (prev) =>
                        (prev - 1 + Math.max(1, allHappyReviews.length)) %
                        Math.max(1, allHappyReviews.length)
                    );
                  }
                }
                setReviewTouchStartX(null);
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch pt-3"
            >
              {displayHappyReviews.map((rev, idx) => {
                const firstName = rev.user?.firstName || 'Alagu';
                const lastName = rev.user?.lastName || 'Raj';
                const fullName = `${firstName} ${lastName}`.trim();
                const rawAvatar = rev.user?.avatar || '';
                const avatarUrl =
                  rawAvatar.startsWith('/images/') ||
                    rawAvatar.startsWith('http://') ||
                    rawAvatar.startsWith('https://')
                    ? rawAvatar
                    : rawAvatar
                    ? resolveMediaUrl(rawAvatar)
                    : '';
                const stars = Math.max(1, Math.min(5, Number(rev.rating) || 5));
                const quoteText =
                  rev.comment ||
                  rev.title ||
                  "The zari work and the full circular flare look spectacular in person. Don't think twice, just buy!";
                const badgeText = rev.authorBadge || 'Verified Google Review';
                const timeText = rev.relativeTime || 'Recent on Google';

                return (
                  <a
                    key={`${rev._id || idx}-${idx}`}
                    href={rev.reviewUrl || googleMeta.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative rounded-[24px] p-[2.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_14px_32px_rgba(60,25,8,0.16)] hover:shadow-[0_20px_42px_rgba(60,25,8,0.24)] hover:-translate-y-1.5 transition-all duration-300 flex-col justify-between ${
                      idx > 0 ? 'hidden md:flex' : 'flex'
                    }`}
                  >
                    {/* Top Overlapping Scalloped Royal Burgundy & 24K Gold "★ Verified Reviews" Pill */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                      <div className="rounded-full p-[1.5px] bg-gradient-to-r from-[#9E6B18] via-[#FFE59E] to-[#9E6B18] shadow-[0_4px_12px_rgba(42,4,26,0.34)]">
                        <div
                          className="px-4 py-0.5 rounded-full flex items-center gap-1.5 border border-[#FFE59E]/65 whitespace-nowrap"
                          style={{
                            background:
                              'linear-gradient(180deg, #5E0E3F 0%, #360422 58%, #1E0112 100%)',
                          }}
                        >
                          <Star className="w-3 h-3 fill-[#FFE59E] text-[#FFE59E] shrink-0" />
                          <span className="font-serif font-bold text-[11px] text-[#FFFDF9] tracking-wide">
                            Verified Reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top-Right Official Google "G" + 3D Gold Rosette Medallion */}
                    <div
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-xs"
                      title="Posted on Google"
                    >
                      <span className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4">
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                          />
                        </svg>
                      </span>
                    </div>

                    {/* Card Interior */}
                    <div
                      className="h-full rounded-[21.5px] pt-7 pb-5 px-5 flex flex-col justify-between border border-[#FFFDF9]"
                      style={{
                        background:
                          'linear-gradient(180deg, #FFFDF9 0%, #FAF0DD 58%, #F2DFBC 100%)',
                      }}
                    >
                      {/* Centered Italic Quote Text with Ornamental Gold Quotation Marks */}
                      <div className="relative text-center my-auto px-1 py-2">
                        <span
                          aria-hidden="true"
                          className="font-serif font-bold text-2xl leading-none text-[#9E6B18] select-none mr-1 align-top"
                        >
                          &ldquo;
                        </span>
                        <span className="font-serif italic text-[13.5px] sm:text-[14.5px] text-[#231008] leading-[1.6] line-clamp-6">
                          {quoteText}
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-serif font-bold text-2xl leading-none text-[#9E6B18] select-none ml-1 align-bottom"
                        >
                          &rdquo;
                        </span>
                      </div>

                      {/* Bottom Reviewer Avatar + Full Name + 5 Gold Stars + Google Metadata */}
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#D4AF37]/40">
                        <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-sm shrink-0">
                          <GoogleReviewAvatar
                            avatarUrl={avatarUrl}
                            fullName={fullName}
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#15803D] border border-white flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-serif font-bold text-[14.5px] sm:text-[15.5px] text-[#1E0A10] group-hover:text-[#4A0830] transition-colors truncate">
                              {fullName}
                            </h4>
                            <span className="text-[10px] text-[#7A542E] font-semibold shrink-0">
                              {timeText}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(stars)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 fill-[#FBBC05] text-[#D99B00]"
                              />
                            ))}
                          </div>
                          <p className="text-[10.5px] font-bold text-[#6E420C] truncate mt-0.5">
                            {badgeText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Mobile Single Card Slider Indicator Dots & Pagination */}
            <div className="flex md:hidden flex-col items-center gap-2 mt-4">
              <div className="flex items-center justify-center gap-1.5">
                {allHappyReviews.slice(0, Math.min(10, allHappyReviews.length)).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setReviewStartIndex(dotIdx)}
                    aria-label={`Go to review ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      reviewStartIndex % allHappyReviews.length === dotIdx
                        ? 'w-6 bg-gradient-to-r from-[#D4AF37] to-[#FFE59E]'
                        : 'w-2 bg-[#D4AF37]/35'
                    }`}
                  />
                ))}
              </div>
              <span className="font-serif text-[11px] font-semibold text-[#6E420C]">
                Review {((reviewStartIndex % allHappyReviews.length) + 1)} of {allHappyReviews.length}
              </span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 3. 3 3D EMBOSSED ROSETTE SEALS + "Write a Google Review →"    */}
          {/* ============================================================= */}
          <div className="relative z-10 flex flex-col items-center mt-7 sm:mt-8">
            {/* 3 3D Embossed Scalloped Rosette Trust Seals Separated by Vertical Gold Filigree Dividers */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
              {[
                {
                  id: 'seal-quality',
                  alt: 'Premium Quality',
                  src: '/images/nalmara/hd/happy_faq_seal_1.png',
                },
                {
                  id: 'seal-trusted',
                  alt: 'Trusted Brand',
                  src: '/images/nalmara/hd/happy_faq_seal_2.png',
                },
                {
                  id: 'seal-loved',
                  alt: 'Loved by Thousands',
                  src: '/images/nalmara/hd/happy_faq_seal_3.png',
                },
              ].map((seal, sIdx) => (
                <React.Fragment key={seal.id}>
                  {sIdx > 0 && (
                    <div className="flex flex-col items-center justify-center h-18 sm:h-22 shrink-0">
                      <span className="w-[1.5px] flex-1 bg-gradient-to-b from-transparent via-[#B88228] to-[#8C5818]" />
                      <span className="w-2 h-2 rotate-45 bg-[#B88228] my-1 shrink-0" />
                      <span className="w-[1.5px] flex-1 bg-gradient-to-t from-transparent via-[#B88228] to-[#8C5818]" />
                    </div>
                  )}
                  <div className="relative w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={seal.src}
                      alt={seal.alt}
                      className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(90,45,15,0.16)]"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Bottom Centered Scalloped 3D Royal Plum & 24K Gold "Write a Google Review →" Button */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-full max-w-[820px] mx-auto">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8922E] to-[#8C5818]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#8C5818] shrink-0" />
                <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shadow-2xs shrink-0" />
              </div>

              <a
                href={googleMeta.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-full p-[3px] shadow-[0_14px_32px_rgba(118,1,89,0.42)] hover:scale-105 active:scale-95 transition-transform shrink-0"
                style={{
                  background:
                    'linear-gradient(90deg, #760159 0%, #FFE59E 28%, #FFFDF9 50%, #FFE59E 72%, #760159 100%)',
                }}
              >
                <span
                  className="inline-flex items-center gap-2.5 px-6 sm:px-9 py-2 sm:py-2.5 rounded-full border border-[#FFE59E]/85 font-serif font-bold text-xs sm:text-base text-[#FFFDF9] tracking-wide shadow-[inset_0_1px_3px_rgba(255,244,194,0.5)]"
                  style={{
                    background:
                      'linear-gradient(180deg, #760159 0%, #54013F 55%, #220215 100%)',
                  }}
                >
                  <Star className="w-4 h-4 fill-[#FFE59E] text-[#FFE59E]" />
                  <span>Write a Google Review</span>
                  <ArrowRight className="w-4 h-4 text-[#FFE59E] group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <div className="flex items-center gap-1.5 flex-1">
                <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shadow-2xs shrink-0" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#8C5818] shrink-0" />
                <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8922E] to-[#8C5818]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 09. DEDICATED SECTION: FREQUENTLY ASKED QUESTIONS (FAQs)            */}
      {/* =================================================================== */}
      <section className="relative max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-10 overflow-hidden">
        <div
          className="relative max-w-[1360px] mx-auto rounded-[28px] sm:rounded-[36px] px-4 sm:px-8 lg:px-12 pt-8 pb-10 sm:pt-11 sm:pb-14 overflow-hidden border border-[#D4AF37]/50 shadow-[0_18px_48px_rgba(40,6,25,0.10)]"
          style={{
            background:
              'radial-gradient(circle at 50% 18%, #FFFDF9 0%, #FAF0DC 52%, #EFE0BE 100%)',
          }}
        >
          {/* Subtle Champagne Silk Drape Highlights */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 20% 0%, rgba(255,253,249,0.85) 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(255,253,249,0.85) 0%, transparent 50%), radial-gradient(circle at 50% 65%, rgba(212,175,55,0.15) 0%, transparent 55%)',
            }}
          />

          {/* Sinuous 3D Metallic Gold Draped Wave Ribbons on Left and Right Framing */}
          <svg
            viewBox="0 0 300 600"
            fill="none"
            className="pointer-events-none absolute left-0 top-0 bottom-0 h-full w-44 sm:w-64 lg:w-80 select-none opacity-85 z-0"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 0 C120 100, 180 250, 40 450 C-20 530, -50 600, -50 600"
              stroke="url(#goldRibbonLeftFaq)"
              strokeWidth="20"
              fill="none"
            />
            <path
              d="M-40 0 C130 100, 190 250, 50 450 C-10 530, -40 600, -40 600"
              stroke="url(#goldRibbonHighlightFaq)"
              strokeWidth="4"
              fill="none"
            />
            <defs>
              <linearGradient id="goldRibbonLeftFaq" x1="0" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8C5818" />
                <stop offset="35%" stopColor="#D4AF37" />
                <stop offset="65%" stopColor="#FFFDF9" />
                <stop offset="100%" stopColor="#A6721E" />
              </linearGradient>
              <linearGradient id="goldRibbonHighlightFaq" x1="0" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF4C2" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFE28A" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            viewBox="0 0 300 600"
            fill="none"
            className="pointer-events-none absolute right-0 top-0 bottom-0 h-full w-44 sm:w-64 lg:w-80 select-none opacity-85 -scale-x-100 z-0"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 0 C120 100, 180 250, 40 450 C-20 530, -50 600, -50 600"
              stroke="url(#goldRibbonRightFaq)"
              strokeWidth="20"
              fill="none"
            />
            <path
              d="M-40 0 C130 100, 190 250, 50 450 C-10 530, -40 600, -40 600"
              stroke="url(#goldRibbonHighlightFaq2)"
              strokeWidth="4"
              fill="none"
            />
            <defs>
              <linearGradient id="goldRibbonRightFaq" x1="0" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8C5818" />
                <stop offset="35%" stopColor="#D4AF37" />
                <stop offset="65%" stopColor="#FFFDF9" />
                <stop offset="100%" stopColor="#A6721E" />
              </linearGradient>
              <linearGradient id="goldRibbonHighlightFaq2" x1="0" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF4C2" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFE28A" />
              </linearGradient>
            </defs>
          </svg>

          {/* ============================================================= */}
          {/* 1. 3D CROWN & ROYAL FAQ HEADER                                */}
          {/* ============================================================= */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[980px] mx-auto mb-7 sm:mb-9">
            {/* Top 3D Gold Crown + Scalloped Royal Plum Plaque */}
            <div className="flex flex-col items-center w-full max-w-[880px] mx-auto">
              {/* Crisp 3D 24K Gold Crown SVG */}
              <svg
                viewBox="0 0 64 32"
                fill="none"
                width={52}
                height={26}
                className="w-11 sm:w-[52px] h-auto -mb-1.5 relative z-20 drop-shadow-[0_3px_6px_rgba(42,4,26,0.28)]"
              >
                <path
                  d="M8 26L4 11L19 18L32 4L45 18L60 11L56 26H8Z"
                  fill="url(#faqCrownGoldNew)"
                  stroke="#7A4B0E"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <rect
                  x="7"
                  y="26"
                  width="50"
                  height="4"
                  rx="2"
                  fill="url(#faqCrownGoldNew)"
                  stroke="#7A4B0E"
                  strokeWidth="1.2"
                />
                <circle cx="32" cy="3.5" r="2.5" fill="#FFF4C2" stroke="#7A4B0E" strokeWidth="1" />
                <circle cx="18.5" cy="10" r="2" fill="#FFF4C2" stroke="#7A4B0E" strokeWidth="1" />
                <circle cx="45.5" cy="10" r="2" fill="#FFF4C2" stroke="#7A4B0E" strokeWidth="1" />
                <circle cx="4" cy="10.5" r="2" fill="#FFE59E" stroke="#7A4B0E" strokeWidth="1" />
                <circle cx="60" cy="10.5" r="2" fill="#FFE59E" stroke="#7A4B0E" strokeWidth="1" />
                <defs>
                  <linearGradient id="faqCrownGoldNew" x1="4" y1="4" x2="60" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4C2" />
                    <stop offset="0.45" stopColor="#E5B84B" />
                    <stop offset="1" stopColor="#8C5818" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Filigree Lines + Royal Plum Scalloped Badge: NALMARA FASHION */}
              <div className="flex items-center justify-center w-full gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-1.5 flex-1">
                  <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8963E] to-[#8C5818]" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] shrink-0" />
                  <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shrink-0" />
                </div>

                <div
                  className="rounded-full p-[2.5px] shadow-[0_8px_22px_rgba(118,1,89,0.32)] shrink-0"
                  style={{
                    background:
                      'linear-gradient(90deg, #760159 0%, #FFE59E 28%, #FFFDF9 50%, #FFE59E 72%, #760159 100%)',
                  }}
                >
                  <div
                    className="px-6 sm:px-8 py-1.5 rounded-full border border-[#FFE59E]/75 flex items-center gap-2.5 shadow-[inset_0_1px_2px_rgba(255,244,194,0.45)]"
                    style={{
                      background:
                        'linear-gradient(180deg, #760159 0%, #54013F 55%, #220215 100%)',
                    }}
                  >
                    <span className="text-[#FFE59E] text-xs">✦</span>
                    <span className="font-serif font-bold text-[11px] sm:text-[13px] tracking-[0.24em] uppercase text-[#FFF4C2]">
                      NALMARA FASHION
                    </span>
                    <span className="text-[#FFE59E] text-xs">✦</span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 flex-1">
                  <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shrink-0" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#B88228] shrink-0" />
                  <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8963E] to-[#8C5818]" />
                </div>
              </div>
            </div>

            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl lg:text-[42px] text-[#240A18] tracking-tight leading-[1.12] mt-3 sm:mt-3.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] uppercase">
              Frequently Asked Questions
            </h2>

            <p className="font-serif italic text-xs sm:text-base lg:text-[17px] text-[#4A2612] font-medium mt-1.5">
              Everything you need to know about our silks, bespoke wear and tailored services
            </p>

            {/* 3D Golden Lotus & Filigree Divider */}
            <div className="flex items-center justify-center gap-2.5 mt-2.5">
              <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C8963E] to-[#8C5818]" />
              <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFF4C2] to-[#8C5818] shrink-0" />
              <svg
                viewBox="0 0 60 28"
                fill="none"
                width={52}
                height={24}
                className="w-12 sm:w-14 h-auto shrink-0 drop-shadow-[0_2px_4px_rgba(140,88,24,0.25)]"
              >
                <path
                  d="M30 3C26 10 23 16 30 24C37 16 34 10 30 3Z"
                  fill="url(#lotusCenterFaqNew)"
                  stroke="#7A4B0E"
                  strokeWidth="1"
                />
                <path
                  d="M30 24C21 20 15 13 18 7C23 9 26 14 30 24Z"
                  fill="url(#lotusSideFaqNew)"
                  stroke="#7A4B0E"
                  strokeWidth="1"
                />
                <path
                  d="M30 24C39 20 45 13 42 7C37 9 34 14 30 24Z"
                  fill="url(#lotusSideFaqNew)"
                  stroke="#7A4B0E"
                  strokeWidth="1"
                />
                <path
                  d="M30 24C16 23 8 18 9 12C15 13 22 17 30 24Z"
                  fill="url(#lotusOuterFaqNew)"
                  stroke="#7A4B0E"
                  strokeWidth="0.9"
                />
                <path
                  d="M30 24C44 23 52 18 51 12C45 13 38 17 30 24Z"
                  fill="url(#lotusOuterFaqNew)"
                  stroke="#7A4B0E"
                  strokeWidth="0.9"
                />
                <ellipse cx="30" cy="25" rx="10" ry="2" fill="#8C5818" />
                <defs>
                  <linearGradient id="lotusCenterFaqNew" x1="30" y1="3" x2="30" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4C2" />
                    <stop offset="0.5" stopColor="#E5B84B" />
                    <stop offset="1" stopColor="#9E6B18" />
                  </linearGradient>
                  <linearGradient id="lotusSideFaqNew" x1="18" y1="7" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFE59E" />
                    <stop offset="1" stopColor="#A6721E" />
                  </linearGradient>
                  <linearGradient id="lotusOuterFaqNew" x1="9" y1="12" x2="51" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F5D37E" />
                    <stop offset="1" stopColor="#8C5818" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFF4C2] to-[#8C5818] shrink-0" />
              <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#C8963E] to-[#8C5818]" />
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. GRAND ROYAL 2-PAVILION SHOWCASE: LEFT ARCH + RIGHT FAQ     */}
          {/* ============================================================= */}
          <div className="relative z-10 max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mt-6">
            
            {/* LEFT COLUMN (4 COLS): ROYAL ARCH PORTRAIT & STYLING DESK */}
            <div className="lg:col-span-4 flex flex-col items-center">
              {/* Upper Portrait with Mughal Arch Border */}
              <div className="relative w-full max-w-[340px] rounded-t-[100px] rounded-b-[24px] p-[3px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#7A4B0E] shadow-[0_16px_38px_rgba(70,25,8,0.22)]">
                <div className="relative w-full h-[320px] sm:h-[350px] rounded-t-[97px] rounded-b-[21px] overflow-hidden bg-[#2A041A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/nalmara/hd/happy_faq_bride_arch.jpg"
                    alt="Nalmara Bridal Silk & Custom Tailoring"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A0112] via-[#1A0112]/50 to-transparent" />
                </div>
              </div>

              {/* Overlapping Velvet Card at Bottom */}
              <div className="relative -mt-16 sm:-mt-20 z-20 w-full max-w-[320px] rounded-[22px] p-[2.5px] bg-gradient-to-b from-[#FFFDF9] via-[#D4AF37] to-[#7A4B0E] shadow-[0_14px_34px_rgba(0,0,0,0.55)]">
                <div
                  className="rounded-[19.5px] p-5 sm:p-6 flex flex-col items-center text-center border border-[#FFE59E]/40"
                  style={{
                    background:
                      'linear-gradient(180deg, #3A0526 0%, #220216 55%, #12000C 100%)',
                  }}
                >
                  <h3
                    className="font-serif font-bold text-lg sm:text-[20px] leading-snug tracking-wide text-transparent bg-clip-text"
                    style={{
                      fontFamily: "'Cinzel', Georgia, serif",
                      backgroundImage:
                        'linear-gradient(180deg, #FFFDF9 0%, #FFE28A 45%, #C88A20 85%, #F8DF95 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  >
                    Personal Styling &amp; Fit Assistance
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#F3E2CB]/90 mt-2 leading-relaxed font-sans">
                    Need help with blouse measurements, bridal wear or custom designs?
                  </p>

                  <a
                    href="https://wa.me/916383163609?text=Hi%20Nalmara%20Fashion!%20I%20need%20help%20with%20blouse%20measurements%20and%20custom%20stitching."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-2 rounded-full border border-[#D4AF37] shadow-[0_4px_14px_rgba(0,0,0,0.4)] text-[#FFE59E] hover:text-[#FFFDF9] hover:border-[#FFE59E] active:scale-95 transition-all text-xs sm:text-[13px] font-serif font-bold tracking-wide"
                    style={{
                      background: 'linear-gradient(180deg, #200215 0%, #0E0008 100%)',
                    }}
                  >
                    <span>Chat with Master Tailor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (8 COLS): GOLDEN PANEL & 5 ACCORDION FAQ CARDS */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full rounded-[28px] p-[2.5px] bg-gradient-to-b from-[#FFFDF9] via-[#E2C37A] to-[#A67524] shadow-[0_18px_45px_rgba(70,30,8,0.16)]">
                <div
                  className="relative rounded-[25.5px] pt-10 sm:pt-11 pb-6 px-3.5 sm:px-7 border border-[#FFFDF9]"
                  style={{
                    background:
                      'linear-gradient(180deg, #F8EEDA 0%, #F5E5C4 50%, #ECCFA1 100%)',
                  }}
                >
                  {/* Top Scalloped Plaque Header: Quick Answers to Your Queries */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                    <div className="rounded-full p-[2px] bg-gradient-to-r from-[#D4AF37] via-[#FFFDF9] to-[#D4AF37] shadow-[0_8px_20px_rgba(70,10,45,0.35)]">
                      <div
                        className="px-6 sm:px-9 py-2 rounded-full border border-[#FFE59E]/75 flex items-center justify-center gap-2 shadow-inner"
                        style={{
                          background:
                            'linear-gradient(180deg, #5B0E3D 0%, #380424 55%, #1F0114 100%)',
                        }}
                      >
                        <h3 className="font-serif font-bold text-xs sm:text-base text-[#FFFDF9] tracking-wide whitespace-nowrap">
                          Quick Answers to Your Queries
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-[12px] sm:text-[13px] text-[#4A2612] font-semibold text-center mb-4">
                    Find answers to the most common questions below
                  </p>

                  {/* 5 Accordion Cards */}
                  <div className="space-y-3">
                    {FAQ_ITEMS.map((faq) => {
                      const isOpen = openFaq === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className="rounded-[22px] p-[1.5px] bg-gradient-to-r from-[#D4AF37]/50 via-[#FFE59E] to-[#D4AF37]/50 shadow-[0_3px_12px_rgba(80,40,10,0.06)] transition-all"
                        >
                          <div
                            className="rounded-[20.5px] overflow-hidden border border-[#FFFDF9]"
                            style={{
                              background:
                                'linear-gradient(90deg, #FFFDF9 0%, #FAF1E0 50%, #FFFDF9 100%)',
                            }}
                          >
                            {/* Header Row */}
                            <button
                              type="button"
                              onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                              className="w-full px-3.5 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors hover:bg-[#FFFDF9]"
                            >
                              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                                <ScallopedFaqBadge num={faq.num} />
                                <span className="font-serif font-bold text-xs sm:text-[15px] text-[#1E0A10] leading-snug">
                                  {faq.question}
                                </span>
                              </div>

                              <span
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37]/80 flex items-center justify-center shrink-0 shadow-xs transition-colors duration-300 ${
                                  isOpen
                                    ? 'bg-gradient-to-b from-[#4A0830] to-[#200214] text-[#FFE59E]'
                                    : 'bg-gradient-to-b from-[#FFFDF9] to-[#EBD2A0] text-[#3D2010]'
                                }`}
                              >
                                <ChevronDown
                                  className={`w-4 h-4 stroke-[2.4] transition-transform duration-300 ${
                                    isOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </span>
                            </button>

                            {/* Smooth Expandable Answer Body */}
                            {isOpen && (
                              <div className="px-5 pb-4 pt-1 border-t border-[#D4AF37]/25 animate-fadeIn">
                                <p className="text-xs sm:text-[14px] text-[#231008] leading-relaxed font-sans font-medium">
                                  {faq.answer}
                                </p>
                                {faq.highlights && faq.highlights.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                    {faq.highlights.map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF0DC] border border-[#D4AF37]/60 text-[10.5px] font-bold text-[#4A0830]"
                                      >
                                        <span className="text-[#B88228]">✦</span>
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 3. BOTTOM CENTERED "Still Have Questions? Contact Us →" CTA   */}
          {/* ============================================================= */}
          <div className="relative z-10 mt-8 sm:mt-10 flex items-center justify-center gap-2.5 sm:gap-4 max-w-[860px] mx-auto px-4">
            <div className="hidden sm:flex items-center gap-1.5 flex-1">
              <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C8922E] to-[#8C5818]" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#8C5818] shrink-0" />
              <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shadow-2xs shrink-0" />
            </div>

            <Link
              href="/contact"
              className="group relative rounded-full p-[2.5px] shadow-[0_10px_28px_rgba(118,1,89,0.38)] hover:scale-105 active:scale-95 transition-transform shrink-0"
              style={{
                background:
                  'linear-gradient(90deg, #760159 0%, #FFE59E 28%, #FFFDF9 50%, #FFE59E 72%, #760159 100%)',
              }}
            >
              <span
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 rounded-full border border-[#FFE59E]/85 shadow-[inset_0_1px_3px_rgba(255,244,194,0.45)]"
                style={{
                  background:
                    'linear-gradient(180deg, #5B0E3D 0%, #380424 55%, #1F0114 100%)',
                }}
              >
                <Headphones className="w-4 h-4 text-[#FFE59E] shrink-0" />
                <span className="font-serif font-bold text-xs sm:text-sm text-[#FFFDF9] tracking-wide whitespace-nowrap">
                  Still Have Questions?{' '}
                  <span className="text-[#FFE59E] underline decoration-[#FFE59E]/60 underline-offset-4 group-hover:text-white transition-colors">
                    Contact Us
                  </span>{' '}
                  →
                </span>
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 flex-1">
              <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#6E420C] shadow-2xs shrink-0" />
              <span className="w-1.5 h-1.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#8C5818] shrink-0" />
              <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C8922E] to-[#8C5818]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
