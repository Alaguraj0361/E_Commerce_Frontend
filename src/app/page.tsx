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
      <span className="inline-flex items-center gap-2 px-4.5 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E]/85 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFE59E] mb-2.5 shadow-[0_4px_14px_rgba(56,7,37,0.22)]">
        <Sparkles className="w-3 h-3 text-[#FFE59E]" />
        <span>{badge}</span>
        <Sparkles className="w-3 h-3 text-[#FFE59E]" />
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

      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#280619] tracking-tight px-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
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
    name: 'ROYAL KANCHIPURAM BRIDAL SILK SAREE',
    titleLine1: 'ROYAL KANCHIPURAM',
    titleLine2: 'BRIDAL SILK SAREE',
    price: 1499,
    description:
      'Pure handwoven zari border silk saree with rich contrast pallu. Comes with unstitched blouse piece & custom Aari tailoring option.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
    slug: 'royal-kanchipuram-bridal-silk-saree',
    sku: 'NLM-384276-942',
  },
  {
    id: 'hero-2',
    name: 'IMPERIAL VELVET PARTY WEAR GOWN',
    titleLine1: 'IMPERIAL VELVET',
    titleLine2: 'PARTY WEAR GOWN',
    price: 999,
    description:
      'Flared floor-length festive gown with gold zari yoke embroidery. Full lining with sleeves & back tassel closure.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_party_wear_gown_hd.jpg',
    slug: 'imperial-velvet-party-wear-gown',
    sku: 'NLM-384276-943',
  },
  {
    id: 'hero-3',
    name: 'BRIDAL ZARDOZI LEHENGA CHOLI',
    titleLine1: 'BRIDAL ZARDOZI',
    titleLine2: 'LEHENGA CHOLI',
    price: 1299,
    description:
      'Handcrafted festive lehenga choli with heavy zari border, tailored blouse with puff sleeves, and sheer organza dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_lehenga_choli_hd.jpg',
    slug: 'bridal-zardozi-lehenga-choli',
    sku: 'NLM-384276-944',
  },
  {
    id: 'hero-4',
    name: 'EMERALD SILK FESTIVE KURTI SET',
    titleLine1: 'EMERALD SILK',
    titleLine2: 'FESTIVE KURTI SET',
    price: 799,
    description:
      'V-neck silk blend kurti with woven gold motifs, three-quarter sleeves with zari cuffs, and matching straight-fit trousers.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_kurti_set_hd.jpg',
    slug: 'emerald-silk-festive-kurti-set',
    sku: 'NLM-384276-945',
  },
  {
    id: 'hero-5',
    name: 'GOLDEN AARI DESIGNER BLOUSE',
    titleLine1: 'GOLDEN AARI',
    titleLine2: 'DESIGNER BLOUSE',
    price: 649,
    description:
      'Bespoke bridal silk blouse with intricate kundan & zari beadwork. Elbow-length sleeves with custom dori tie at back.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/nalmara/hd/prod_blouse_piece_hd.jpg',
    slug: 'golden-aari-designer-blouse',
    sku: 'NLM-384276-946',
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
    question: 'What types of stitching services do you offer?',
    answer:
      "We offer Saree Blouse Stitching, Bridal & Designer Aari Work Blouses, Girls' Frocks & Gowns, Pavadai Sattai & Pattu Pavadai, Lehenga Choli & Half Sarees, and Kurti & Salwar Stitching with perfect custom fitting.",
  },
  {
    id: 2,
    question: 'Do you provide custom designs?',
    answer:
      'Yes! You can share your reference neck designs, sleeve patterns, or measurements on WhatsApp (6383163609 | 7871207631) and our master tailors will stitch it to perfection.',
  },
  {
    id: 3,
    question: 'What is your delivery time?',
    answer:
      'Ready-to-ship sarees and dresses reach across Tamil Nadu in 1–3 business days (3–5 days across India). Custom stitched outfits are dispatched within 3–5 days.',
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
      <div className="relative z-10 -mt-4 px-4 py-1.5 min-w-[126px] sm:min-w-[142px] max-w-[165px] rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DC] to-[#E8D2AA] group-hover:from-[#4A0B32] group-hover:via-[#380725] group-hover:to-[#28041A] border-[1.5px] border-[#C8963E] shadow-[0_6px_16px_rgba(90,45,15,0.16)] transition-all">
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
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [reviewStartIndex, setReviewStartIndex] = useState(0);

  const [igPosts, setIgPosts] = useState<any[]>([]);
  const [likedInspire, setLikedInspire] = useState<Record<string, boolean>>({});

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

    loadLiveCatalogAndReviews();
    loadInstagramFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  // Build 5-item Hero Showcase from live API products (falling back gracefully so 01..05 is always populated)
  const heroShowcaseItems = React.useMemo(() => {
    const mappedLive = liveProducts.slice(0, 5).map((prod, idx) => {
      const { line1, line2 } = splitHeadlineTwoLines(prod.name || 'NALMARA COLLECTION');
      const fallbackEntry = HERO_SHOWCASE_FALLBACK[idx % HERO_SHOWCASE_FALLBACK.length];
      const resolvedImg =
        resolveMediaUrl(prod.images?.[0]?.url) ||
        getCategoryFallbackImage(
          typeof prod.category === 'object' ? prod.category?.slug : prod.name
        ) ||
        fallbackEntry.image;

      return {
        id: String(prod._id),
        name: prod.name,
        titleLine1: line1,
        titleLine2: line2,
        price: Number(prod.price) || fallbackEntry.price,
        description: cleanHeroDescription(prod.description, fallbackEntry.description),
        sizes: ['S', 'M', 'L'],
        image: resolvedImg,
        slug: prod.slug,
        sku: prod.sku || fallbackEntry.sku,
        rawProduct: prod,
      };
    });

    if (mappedLive.length >= 5) {
      return mappedLive.slice(0, 5);
    }

    const combined = [...mappedLive];
    for (let i = mappedLive.length; i < 5; i++) {
      const fb = HERO_SHOWCASE_FALLBACK[i];
      combined.push({
        ...fb,
        sizes: ['S', 'M', 'L'],
        rawProduct: undefined as unknown as Product,
      });
    }
    return combined;
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

  const visibleReviews =
    liveReviews.length > 3
      ? Array.from({ length: 3 }, (_, i) => liveReviews[(reviewStartIndex + i) % liveReviews.length])
      : liveReviews;

  // Derive Style Inspiration items from live Instagram feed or live API products
  const styleInspirationList =
    igPosts.length > 0
      ? igPosts.slice(0, 6).map((post: any) => ({
          id: String(post.id),
          title: post.title || '@nalmarafashion',
          image: resolveMediaUrl(post.image),
          href: post.permalink || 'https://www.instagram.com/nalmarafashion',
          external: true,
        }))
      : liveProducts.slice(0, 6).map((prod) => ({
          id: String(prod._id),
          title: prod.name,
          image:
            resolveMediaUrl(prod.images?.[0]?.url) ||
            getCategoryFallbackImage(
              typeof prod.category === 'object' ? prod.category?.slug : prod.name
            ),
          href: `/product/${prod.slug}`,
          external: false,
        }));

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
        <div className="sm:hidden">
          {/* UPPER ROYAL PALACE STAGE (DEEP PLUM VELVET + GOLDEN BOKEH ARCH) */}
          <div
            className="relative w-full pt-3 pb-12 overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 76% 36%, #8C4A12 0%, #520D38 38%, #2E041E 68%, #16010D 100%)',
            }}
          >
            {/* Multi-Point Warm Golden Palace Chandelier Bokeh Lights */}
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 60% 18%, rgba(255, 228, 150, 0.52) 0%, transparent 13%), radial-gradient(circle at 88% 24%, rgba(255, 218, 120, 0.45) 0%, transparent 15%), radial-gradient(circle at 55% 44%, rgba(255, 224, 140, 0.36) 0%, transparent 11%), radial-gradient(circle at 93% 50%, rgba(255, 214, 110, 0.40) 0%, transparent 14%), radial-gradient(circle at 18% 22%, rgba(212, 175, 55, 0.16) 0%, transparent 32%)',
              }}
            />

            {/* Top-Left Sculpted Royal Purple Silk Corner Valence */}
            <div className="pointer-events-none absolute top-0 left-0 w-[52%] h-24 z-10 overflow-hidden">
              <svg
                viewBox="0 0 460 160"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              >
                <path
                  d="M0 0H450C380 42 290 74 170 96C88 111 32 128 0 148V0Z"
                  fill="url(#heroPurpleDrapeGrad)"
                />
                <path
                  d="M0 40C130 34 260 18 380 0"
                  stroke="#B03082"
                  strokeWidth="5"
                  strokeOpacity="0.45"
                />
                <path
                  d="M0 82C145 66 285 36 420 0"
                  stroke="#220215"
                  strokeWidth="7"
                  strokeOpacity="0.55"
                />
                <path
                  d="M0 148C32 128 88 111 170 96C290 74 380 42 450 0"
                  stroke="url(#heroGoldTrimGrad)"
                  strokeWidth="4.5"
                />
                <defs>
                  <linearGradient id="heroPurpleDrapeGrad" x1="0" y1="0" x2="380" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4E0835" />
                    <stop offset="0.45" stopColor="#85165D" />
                    <stop offset="0.8" stopColor="#42052B" />
                    <stop offset="1" stopColor="#240216" />
                  </linearGradient>
                  <linearGradient id="heroGoldTrimGrad" x1="0" y1="148" x2="450" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9A6B18" />
                    <stop offset="0.5" stopColor="#FFF4C2" />
                    <stop offset="1" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Two Ornate Hanging 24K Gold Palace Lanterns (Top-Left) */}
            <div className="pointer-events-none absolute top-0 left-1.5 z-20 flex items-start gap-1">
              <svg
                viewBox="0 0 64 180"
                fill="none"
                className="w-8 h-24 drop-shadow-[0_6px_14px_rgba(255,200,80,0.5)]"
              >
                <line x1="32" y1="0" x2="32" y2="44" stroke="url(#lanternGold)" strokeWidth="2.2" strokeDasharray="3 2" />
                <circle cx="32" cy="44" r="3.5" fill="url(#lanternGold)" />
                <path d="M18 60C18 50 25 46 32 44C39 46 46 50 46 60H18Z" fill="url(#lanternGold)" stroke="#5A3807" strokeWidth="1" />
                <rect x="14" y="60" width="36" height="4" rx="2" fill="url(#lanternGold)" />
                <rect x="17" y="64" width="30" height="44" rx="4" fill="url(#lanternGlow)" stroke="url(#lanternGold)" strokeWidth="2" />
                <line x1="25" y1="64" x2="25" y2="108" stroke="#8C5818" strokeWidth="1.2" />
                <line x1="39" y1="64" x2="39" y2="108" stroke="#8C5818" strokeWidth="1.2" />
                <rect x="14" y="108" width="36" height="4" rx="2" fill="url(#lanternGold)" />
                <path d="M20 112L32 126L44 112H20Z" fill="url(#lanternGold)" stroke="#5A3807" strokeWidth="1" />
                <circle cx="32" cy="130" r="2.5" fill="#FFE59E" />
                <path d="M32 132V140" stroke="#FFE59E" strokeWidth="1.8" strokeLinecap="round" />
                <defs>
                  <linearGradient id="lanternGold" x1="14" y1="44" x2="50" y2="130" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4C2" />
                    <stop offset="0.5" stopColor="#D4AF37" />
                    <stop offset="1" stopColor="#7A4E0D" />
                  </linearGradient>
                  <radialGradient id="lanternGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 86) scale(18 24)">
                    <stop stopColor="#FFFDF9" />
                    <stop offset="0.55" stopColor="#FFD269" />
                    <stop offset="1" stopColor="#B86B11" />
                  </radialGradient>
                </defs>
              </svg>

              <svg
                viewBox="0 0 56 140"
                fill="none"
                className="w-6 h-18 -ml-1 drop-shadow-[0_6px_14px_rgba(255,200,80,0.5)]"
              >
                <line x1="28" y1="0" x2="28" y2="24" stroke="url(#lanternGold)" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="28" cy="24" r="3" fill="url(#lanternGold)" />
                <path d="M16 38C16 30 22 26 28 24C34 26 40 30 40 38H16Z" fill="url(#lanternGold)" stroke="#5A3807" strokeWidth="1" />
                <rect x="13" y="38" width="30" height="3.5" rx="1.5" fill="url(#lanternGold)" />
                <rect x="15" y="41.5" width="26" height="36" rx="3" fill="url(#lanternGlow)" stroke="url(#lanternGold)" strokeWidth="1.8" />
                <line x1="22" y1="41.5" x2="22" y2="77.5" stroke="#8C5818" strokeWidth="1" />
                <line x1="34" y1="41.5" x2="34" y2="77.5" stroke="#8C5818" strokeWidth="1" />
                <rect x="13" y="77.5" width="30" height="3.5" rx="1.5" fill="url(#lanternGold)" />
                <path d="M18 81L28 92L38 81H18Z" fill="url(#lanternGold)" stroke="#5A3807" strokeWidth="1" />
                <circle cx="28" cy="96" r="2" fill="#FFE59E" />
                <path d="M28 98V104" stroke="#FFE59E" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Left Edge & Top-Right Floral Accents */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_left.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-3 -left-6 w-24 h-24 object-contain z-20 opacity-95 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_right.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-2 -right-3 w-24 h-24 object-contain z-20 opacity-95 drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
            />

            {/* Mobile 2-Column Stage */}
            <div className="relative z-20 px-2.5">
              <div className="grid grid-cols-12 items-center gap-1.5">
                {/* Left 7 Cols: Editorial */}
                <div
                  key={`palace-mob-text-${heroAnimTick}`}
                  className="col-span-7 flex flex-col items-center text-center pt-4 pl-1 pb-2 z-20 animate-hero-text-up"
                >
                  {/* 1. Scalloped Royal Plum & 24K Gold Crown Plaque */}
                  <div className="relative inline-flex items-center mb-2">
                    <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -mr-1 z-10 shadow-xs" />
                    <div className="rounded-full p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FFE59E]/60"
                        style={{
                          background:
                            'linear-gradient(180deg, #4A0B32 0%, #280319 55%, #16010D 100%)',
                        }}
                      >
                        <svg viewBox="0 0 24 18" fill="none" className="w-3.5 h-3 shrink-0">
                          <path
                            d="M2 15L4 5L9 10L12 3L15 10L20 5L22 15H2Z"
                            fill="url(#crownGoldGrad)"
                            stroke="#FFF4C2"
                            strokeWidth="1"
                            strokeLinejoin="round"
                          />
                          <rect x="2" y="15.5" width="20" height="2" rx="1" fill="#FFE59E" />
                          <defs>
                            <linearGradient id="crownGoldGrad" x1="2" y1="3" x2="22" y2="16" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFF4C2" />
                              <stop offset="0.5" stopColor="#E5B84B" />
                              <stop offset="1" stopColor="#9A6B18" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="font-serif text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#FFF4C2] whitespace-nowrap">
                          ROYAL EDIT • 0{(currentHeroSlide % heroShowcaseItems.length) + 1}
                        </span>
                      </div>
                    </div>
                    <span className="w-2 h-2 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#9A6B18] border border-[#5A3807] -ml-1 z-10 shadow-xs" />
                  </div>

                  {/* 2. Two-Line Grand Palace Headline ('Cinzel' + 'Great Vibes') */}
                  <Link
                    href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                    className="group block max-w-full"
                  >
                    <h1 className="leading-[1.04]">
                      <span
                        className="block font-extrabold text-[19px] uppercase tracking-[0.03em] text-transparent bg-clip-text drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
                        style={{
                          fontFamily: "'Cinzel', Georgia, serif",
                          backgroundImage:
                            'linear-gradient(180deg, #FFFDF9 0%, #FFE28A 46%, #C88A20 88%, #F8DF95 100%)',
                        }}
                      >
                        {activeHeroItem.titleLine1}
                      </span>
                      <span
                        className="block -mt-0.5 font-normal text-[28px] text-[#FCE8C0] leading-[1.05] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]"
                        style={{ fontFamily: "'Great Vibes', Georgia, cursive" }}
                      >
                        {toTitleCase(activeHeroItem.titleLine2)}
                      </span>
                    </h1>
                  </Link>

                  {/* 3. Centered 24K Gold Lotus Divider */}
                  <div className="flex items-center justify-center gap-1.5 my-2 w-full max-w-[210px]">
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] shrink-0" />
                    <svg viewBox="0 0 36 22" fill="none" className="w-6 h-4 shrink-0">
                      <path d="M18 2C15 7 14 12 18 18C22 12 21 7 18 2Z" fill="url(#lotusCenterGrad)" />
                      <path d="M18 18C13 15 9 10 10 5C13 8 15 12 18 18Z" fill="url(#lotusCenterGrad)" fillOpacity="0.9" />
                      <path d="M18 18C23 15 27 10 26 5C23 8 21 12 18 18Z" fill="url(#lotusCenterGrad)" fillOpacity="0.9" />
                      <path d="M18 18C10 18 4 14 3 10C8 11 13 14 18 18Z" fill="url(#lotusCenterGrad)" fillOpacity="0.75" />
                      <path d="M18 18C26 18 32 14 33 10C28 11 23 14 18 18Z" fill="url(#lotusCenterGrad)" fillOpacity="0.75" />
                      <defs>
                        <linearGradient id="lotusCenterGrad" x1="3" y1="2" x2="33" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FFF4C2" />
                          <stop offset="0.5" stopColor="#E5B84B" />
                          <stop offset="1" stopColor="#9A6B18" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E] shrink-0" />
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFE59E]" />
                  </div>

                  {/* 4. Three-Line Clean Editorial Ivory Serif Description */}
                  <p className="font-serif text-[11px] text-[#FAF0DC] leading-[1.4] max-w-[235px] line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {activeHeroItem.description}
                  </p>

                  {/* 5. Three Ornate Scalloped Champagne-Gold Feature Plaques */}
                  <div className="grid grid-cols-3 gap-1.5 w-full max-w-[255px] mt-3">
                    {[
                      {
                        line1: 'Pure Silk',
                        line2: '& Zari',
                        icon: <Gem className="w-4 h-4 text-[#6E410A] stroke-[1.9] mb-1" />,
                      },
                      {
                        line1: 'Custom',
                        line2: 'Fit',
                        icon: <MannequinDummyIcon className="w-4 h-4 mb-1" />,
                      },
                      {
                        line1: 'Premium',
                        line2: 'Stitching',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 mb-1">
                            <path
                              d="M17 3L21 7L7 21L3 21L3 17L17 3Z"
                              stroke="#6E410A"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14 6C9 4 4 8 8 12C12 16 7 20 3 19"
                              stroke="#6E410A"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        ),
                      },
                    ].map((plaque) => (
                      <div
                        key={plaque.line1}
                        className="relative rounded-[14px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
                      >
                        <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#FFF4C2] border border-[#8C5818] z-20" />
                        <div
                          className="relative h-full rounded-[12px] px-1.5 py-2 flex flex-col items-center justify-center text-center border border-[#FFFDF9]"
                          style={{
                            background:
                              'linear-gradient(180deg, #FFFDF9 0%, #F9E9C8 55%, #E2C082 100%)',
                          }}
                        >
                          <span className="pointer-events-none absolute inset-[2.5px] rounded-[9.5px] border border-[#B88228]/50" />
                          {plaque.icon}
                          <span className="relative z-10 font-serif font-bold text-[9px] leading-[1.15] text-[#231008]">
                            {plaque.line1}
                            <br />
                            {plaque.line2}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 5 Cols: Palace Arch */}
                <div className="col-span-5 relative flex items-end justify-center self-stretch -mb-6">
                  <div
                    className="pointer-events-none absolute -inset-2 rounded-t-[60px] opacity-75 blur-md"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 35%, rgba(255, 224, 138, 0.55) 0%, transparent 70%)',
                    }}
                  />
                  <div className="relative w-full max-w-[198px] aspect-[3/4.25] rounded-t-[54px] rounded-b-[20px] p-[2.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/nalmara/hd/bouquet_corner_left.png"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute -top-3 left-1 w-14 h-14 object-contain z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
                    />
                    <Link
                      key={`palace-mob-img-${heroAnimTick}-${currentHeroSlide}`}
                      href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                      className="relative w-full h-full rounded-t-[51px] rounded-b-[17px] overflow-hidden bg-[#2A0519] block group animate-hero-rise-in"
                    >
                      <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                          background:
                            'radial-gradient(circle at 50% 25%, rgba(255,220,130,0.38) 0%, transparent 60%)',
                        }}
                      />
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
                        className="relative z-10 w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-[3px] rounded-t-[48px] rounded-b-[14px] border border-[#FFF4C2]/65 pointer-events-none z-20" />
                      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#1E0212]/90 via-[#1E0212]/40 to-transparent z-20 flex items-end justify-between px-2.5 pb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] font-serif font-bold text-[10.5px] text-[#FFE59E] shadow-md">
                          {formatCurrency(activeHeroItem.price)}
                        </span>
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#FFFDF9] bg-[#240216]/85 px-2 py-0.5 rounded-full border border-[#D4AF37]/60">
                          0{(currentHeroSlide % heroShowcaseItems.length) + 1} / 0{heroShowcaseItems.length}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER CURVED CHAMPAGNE-CREAM GALLERY DECK + OVERLAPPING CTA (Mobile) */}
          <div
            className="relative z-20 -mt-7 rounded-t-[40px] border-t-[3px] border-[#D4AF37] pt-8 pb-8 px-3 shadow-[0_-14px_34px_rgba(0,0,0,0.42)]"
            style={{
              background:
                'radial-gradient(circle at 50% 18%, #FFFDF9 0%, #FAF0D8 58%, #ECD3AA 100%)',
            }}
          >
            <div className="pointer-events-none absolute inset-x-2 top-1.5 h-8 rounded-t-[36px] border-t border-[#D4AF37]/50" />

            {/* Overlapping Center Scalloped Royal Plum & 24K Gold "Explore Collection →" Button */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-full max-w-[340px] px-2">
              <div className="flex items-center flex-1">
                <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C6923A] to-[#FFE59E]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] mr-1 shrink-0" />
                <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#8C5818] border border-[#5A3807] -mr-1.5 z-10 shadow-xs shrink-0" />
              </div>

              <Link
                href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                className="group relative rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] shadow-[0_10px_28px_rgba(38,3,22,0.58)] active:scale-95 transition-transform shrink-0"
              >
                <span
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#FFE59E]/75 font-serif font-bold text-[13.5px] text-[#FFFDF9] tracking-wide shadow-[inset_0_1px_2px_rgba(255,244,194,0.4)]"
                  style={{
                    background:
                      'linear-gradient(180deg, #5B0E3D 0%, #380624 55%, #220215 100%)',
                  }}
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-[#FFE59E]" />
                </span>
              </Link>

              <div className="flex items-center flex-1">
                <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#8C5818] border border-[#5A3807] -ml-1.5 z-10 shadow-xs shrink-0" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] ml-1 shrink-0" />
                <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C6923A] to-[#FFE59E]" />
              </div>
            </div>

            {/* 3 Rounded-Rectangle Gold-Bezel Thumbnail Cards Flanked by < and > Buttons */}
            <div className="relative z-20 max-w-[420px] mx-auto flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev - 1)}
                className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_16px_rgba(40,6,25,0.32)] active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Previous showcase slide"
              >
                <span
                  className="w-full h-full rounded-full flex items-center justify-center text-[#FFE59E]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 35%, #5B0E3D 0%, #2A031A 100%)',
                  }}
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
                </span>
              </button>

              <div className="grid grid-cols-3 gap-2.5 flex-1">
                {heroThreeThumbnails.map(({ item, slideIndex, position }) => {
                  const isCenter = position === 'active';
                  return (
                    <button
                      key={`mob-${item.id}-${position}`}
                      type="button"
                      onClick={() => goToHeroSlide(slideIndex)}
                      className={`group relative aspect-[4/3.3] rounded-[14px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C5818] transition-all duration-300 cursor-pointer ${
                        isCenter
                          ? 'shadow-[0_12px_26px_rgba(91,14,61,0.32)] scale-[1.05] ring-2 ring-[#D4AF37]'
                          : 'shadow-[0_6px_14px_rgba(70,40,10,0.18)] opacity-90'
                      }`}
                      aria-label={`Select ${item.name}`}
                    >
                      {isCenter && (
                        <span className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[#5B0E3D] border border-[#FFE59E] z-20 shadow-xs" />
                      )}
                      <div className="relative w-full h-full rounded-[12px] overflow-hidden bg-[#280619] border border-[#FFFDF9]/85">
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

              <button
                type="button"
                onClick={() => goToHeroSlide((prev) => prev + 1)}
                className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_6px_16px_rgba(40,6,25,0.32)] active:scale-95 transition-transform shrink-0 cursor-pointer"
                aria-label="Next showcase slide"
              >
                <span
                  className="w-full h-full rounded-full flex items-center justify-center text-[#FFE59E]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 35%, #5B0E3D 0%, #2A031A 100%)',
                  }}
                >
                  <ChevronRight className="w-4 h-4 stroke-[2.4]" />
                </span>
              </button>
            </div>

            {/* Bottom-Left & Bottom-Right 3D Golden Floral Bouquets */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_left.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-2 -left-2 w-24 h-24 object-contain z-20 drop-shadow-[0_6px_12px_rgba(90,52,16,0.3)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_right.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-2 -right-2 w-24 h-24 object-contain z-20 drop-shadow-[0_6px_12px_rgba(90,52,16,0.3)]"
            />

            {/* Bottom Sweeping Royal Purple Silk & 24K Gold Wave Ribbon */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 z-10 overflow-hidden">
              <svg
                viewBox="0 0 1200 60"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M0 12C220 55 420 58 600 48C780 58 980 55 1200 12V60H0V12Z"
                  fill="url(#bottomPurpleWaveGrad)"
                />
                <path
                  d="M0 12C220 55 420 58 600 48C780 58 980 55 1200 12"
                  stroke="url(#bottomGoldWaveStroke)"
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="bottomPurpleWaveGrad" x1="0" y1="12" x2="1200" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#42052B" />
                    <stop offset="0.3" stopColor="#7C1356" />
                    <stop offset="0.5" stopColor="#380424" />
                    <stop offset="0.7" stopColor="#7C1356" />
                    <stop offset="1" stopColor="#42052B" />
                  </linearGradient>
                  <linearGradient id="bottomGoldWaveStroke" x1="0" y1="30" x2="1200" y2="30" gradientUnits="userSpaceOnUse">
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
                    <stop stopColor="#520838" />
                    <stop offset="0.45" stopColor="#8E1864" />
                    <stop offset="0.8" stopColor="#42052B" />
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

            {/* Left & Top-Right 3D Golden & Magenta Floral Cascades */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_left.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute bottom-2 -left-4 w-44 h-44 object-contain z-20 opacity-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_right.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1 right-0 w-44 h-44 object-contain z-20 opacity-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
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
                  <div className="relative inline-flex items-center mb-3">
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

                  {/* 2. Monumental Two-Line Grand Palace Headline ('Cinzel' 3D Gold Serif + 'Great Vibes' Script) */}
                  <Link
                    href={activeHeroItem.rawProduct ? `/product/${activeHeroItem.slug}` : '/shop'}
                    className="group block max-w-full"
                  >
                    <h1 className="leading-[1.02]">
                      <span
                        className="block font-extrabold text-4xl lg:text-[52px] xl:text-[58px] uppercase tracking-[0.04em] text-transparent bg-clip-text drop-shadow-[0_5px_16px_rgba(0,0,0,0.85)]"
                        style={{
                          fontFamily: "'Cinzel', Georgia, serif",
                          backgroundImage:
                            'linear-gradient(180deg, #FFFDF9 0%, #FFE494 42%, #C98B20 82%, #FBE29A 100%)',
                        }}
                      >
                        {activeHeroItem.titleLine1}
                      </span>
                      <span
                        className="block -mt-1 font-normal text-5xl lg:text-[64px] xl:text-[72px] text-[#FCE8C0] leading-[1.02] drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)]"
                        style={{ fontFamily: "'Great Vibes', Georgia, cursive" }}
                      >
                        {toTitleCase(activeHeroItem.titleLine2)}
                      </span>
                    </h1>
                  </Link>

                  {/* 3. Centered 24K Gold Lotus Filigree Divider */}
                  <div className="flex items-center justify-center gap-3 my-2.5 w-full max-w-[440px]">
                    <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFE59E]" />
                    <span className="w-2 h-2 rotate-45 bg-[#FFE59E] shrink-0" />
                    <svg viewBox="0 0 40 24" fill="none" className="w-10 h-6 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                      <path d="M20 2C16.5 7.5 15.5 13 20 19.5C24.5 13 23.5 7.5 20 2Z" fill="#FFF4C2" />
                      <path d="M20 19.5C14.5 16 10 11 11 5.5C14.5 8.5 16.5 13 20 19.5Z" fill="#E5B84B" />
                      <path d="M20 19.5C25.5 16 30 11 29 5.5C25.5 8.5 23.5 13 20 19.5Z" fill="#E5B84B" />
                      <path d="M20 19.5C11 19.5 4.5 15 3.5 10.5C9 11.5 14.5 15 20 19.5Z" fill="#C6923A" />
                      <path d="M20 19.5C29 19.5 35.5 15 36.5 10.5C31 11.5 25.5 15 20 19.5Z" fill="#C6923A" />
                      <ellipse cx="20" cy="21" rx="6" ry="1.6" fill="#FFE59E" />
                    </svg>
                    <span className="w-2 h-2 rotate-45 bg-[#FFE59E] shrink-0" />
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
                            'linear-gradient(180deg, #5B0E3D 0%, #360422 55%, #1D0111 100%)',
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
                      className="relative w-full h-full rounded-t-[79px] rounded-b-[19.5px] overflow-hidden bg-[#2A0519] block group animate-hero-rise-in border border-[#380725]"
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
                        <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] font-serif font-bold text-base text-[#FFE59E] shadow-lg">
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

              {/* All 5 Royal Showcase Cards in a Compact, Beveled 24K Gold Row */}
              <div className="grid grid-cols-5 gap-3 lg:gap-4 flex-1">
                {heroShowcaseItems.map((item, idx) => {
                  const isActiveCard =
                    (currentHeroSlide % heroShowcaseItems.length) === idx;
                  return (
                    <button
                      key={`desk-terrace-${item.id}-${idx}`}
                      type="button"
                      onClick={() => goToHeroSlide(idx)}
                      className={`group relative rounded-[18px] p-[3px] bg-gradient-to-b from-[#FFF8DC] via-[#D4AF37] to-[#7A4B0E] transition-all duration-300 text-left cursor-pointer ${
                        isActiveCard
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
                          className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider border ${
                            isActiveCard
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

            {/* Bottom-Left & Bottom-Right Large 3D Golden & Magenta Floral Bouquets */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_left.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-3 left-0 w-44 h-44 object-contain z-20 drop-shadow-[0_8px_18px_rgba(40,10,25,0.45)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/nalmara/hd/bouquet_corner_right.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-3 right-0 w-44 h-44 object-contain z-20 drop-shadow-[0_8px_18px_rgba(40,10,25,0.45)]"
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
          badge="CURATED ROYAL COLLECTIONS"
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

              {/* Top-Left 3D Golden Lotus & Floral Bouquet */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/bouquet_corner_left.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute -top-2 -left-3 w-24 h-24 object-contain z-20 drop-shadow-[0_6px_10px_rgba(90,52,16,0.28)]"
              />

              {/* Upper-Right Delicate Golden Floral Blossom */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/bouquet_corner_right.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute top-7 -right-4 w-16 h-16 object-contain z-20 drop-shadow-[0_4px_8px_rgba(90,52,16,0.25)]"
              />

              {/* Bottom-Left Golden Thread Spool & Measuring Tape Illustration */}
              <div className="pointer-events-none select-none absolute -bottom-2 -left-2 z-20 opacity-95">
                <ThreadSpoolsIllustration className="w-20 h-20 drop-shadow-[0_6px_10px_rgba(56,28,8,0.3)]" />
              </div>

              {/* Bottom-Right 3D Golden Floral Bouquet */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nalmara/hd/bouquet_corner_right.png"
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
                          'linear-gradient(180deg, #5B0E3D 0%, #380725 55%, #220215 100%)',
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] shadow-[0_6px_16px_rgba(56,7,37,0.2)] mb-3">
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
                      <span className="block font-serif font-bold text-sm text-[#380725] leading-tight">
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
                    className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#4E0B34] hover:to-[#280619] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-[13.5px] tracking-wide shadow-[0_10px_26px_rgba(56,7,37,0.3)] transition-all duration-300 hover:scale-105"
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
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border-[1.5px] border-[#FFE59E] text-[#FFE59E] text-[9.5px] font-bold uppercase tracking-[0.18em] shadow-lg hover:scale-105 transition-transform"
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
                      <div className="h-full rounded-[14.5px] bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9] to-[#FAF0DD] group-hover/card:from-[#380725] group-hover/card:via-[#4A0B32] group-hover/card:to-[#280619] p-2.5 flex items-center gap-3 transition-all duration-300">
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
                        <span className="flex w-7 h-7 rounded-full bg-[#FAF0DD] group-hover/card:bg-gradient-to-b group-hover/card:from-[#FFF4C2] group-hover/card:to-[#D4AF37] border border-[#D4AF37]/75 items-center justify-center text-[#380725] shrink-0 transition-all group-hover/card:translate-x-0.5">
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
      <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-10 sm:pt-6 sm:pb-14">
        <RoyalCornerMandala className="hidden lg:block absolute top-2 left-4 w-28 h-28 pointer-events-none" />
        <RoyalCornerMandala className="hidden lg:block absolute top-2 right-4 w-28 h-28 -scale-x-100 pointer-events-none" />

        <GoldSectionHeader
          badge="LATEST COUTURE DROP"
          title="New Arrivals"
          subtitle="Fresh Styles, Just for You!"
        />

        {/* Grand 5-in-a-Row Luxury Showroom Stage */}
        <div className="relative rounded-[32px] p-[2.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_60px_rgba(40,6,25,0.16)]">
          {/* Top Royal Crown Emblem Stud */}
          <span className="hidden sm:block absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#5B0E3D] shadow-md" />

          <div className="relative rounded-[29.5px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F1DFBD] p-2.5 sm:p-6 lg:p-8 overflow-hidden">
            {/* Ambient Radial Gold Spotlight */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 18% 15%, rgba(212,175,55,0.18) 0%, transparent 42%), radial-gradient(circle at 82% 85%, rgba(91,14,61,0.07) 0%, transparent 42%)',
              }}
            />

            {/* Top Grand Curated Toolbar — Single-Row Symmetrical Arrangement */}
            <div className="relative z-10 flex items-center justify-between gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF1DE] to-[#FFFDF9] border border-[#D4AF37]/75 shadow-[0_6px_18px_rgba(40,6,25,0.06)]">
              {/* Left: Royal Edition Badge + Desktop Trust Tags */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border border-[#D4AF37] text-[9px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] shadow-xs shrink-0">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFE59E] shrink-0" />
                  <span className="sm:hidden">New Drops</span>
                  <span className="hidden sm:inline">Handpicked New Drops</span>
                </span>

                <span className="hidden md:inline-block w-[1px] h-4 bg-[#D4AF37]/60 shrink-0" />

                <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3D1D1A] truncate">
                  <Check className="w-3.5 h-3.5 text-[#9E1946] stroke-[2.8] shrink-0" />
                  <span>Full 6.3m Verified • Direct Loom Price</span>
                </span>

                <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#380725]/10 border border-[#D4AF37]/50 text-[10.5px] font-bold text-[#5B0E3D] shrink-0">
                  <Scissors className="w-3 h-3 text-[#9E1946]" />
                  <span>Custom Blouse Fit</span>
                </span>
              </div>

              {/* Right: Unified Prev/Next Rocker Capsule + View All CTA */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* Unified Segmented Prev / Next Pill */}
                <div className="inline-flex items-center rounded-full bg-[#FFFDF9] border-[1.5px] border-[#D4AF37] p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setProdStartIndex(
                        (prev) =>
                          (prev - 1 + newArrivalProducts.length) % newArrivalProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#280619] hover:bg-[#380725] hover:text-[#FFE59E] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous new arrivals"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-[1px] h-4 bg-[#D4AF37]/55" />
                  <button
                    type="button"
                    onClick={() =>
                      setProdStartIndex((prev) => (prev + 1) % newArrivalProducts.length)
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#280619] hover:bg-[#380725] hover:text-[#FFE59E] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next new arrivals"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Primary View All Pill Button */}
                <Link
                  href="/shop?sort=newest"
                  className="group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#5B0E3D] hover:to-[#280619] text-[#FFE59E] border-[1.5px] border-[#D4AF37] text-[10.5px] sm:text-xs font-serif font-bold shadow-[0_4px_12px_rgba(56,7,37,0.22)] transition-all"
                >
                  <span>View All</span>
                  <span className="hidden sm:inline">New Arrivals</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 2 CARDS PER ROW ON MOBILE (`grid-cols-2`), 5 IN A ROW ON DESKTOP (`lg:grid-cols-5`) */}
            {isProductsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5 relative z-10">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] border-2 border-[#C8963E]/60 p-2 sm:p-3 animate-pulse space-y-2.5"
                  >
                    <div className="h-[195px] sm:h-[290px] w-full rounded-[14px] sm:rounded-[18px] bg-[#EED9BA]" />
                    <div className="h-3 w-1/2 rounded bg-[#E5CCA4]" />
                    <div className="h-4 w-4/5 rounded bg-[#E5CCA4]" />
                    <div className="h-8 w-full rounded-full bg-[#D9BC8C]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5 items-stretch">
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
                  const discountPct = hasDiscount
                    ? Math.round(
                        ((Number(prod.compareAtPrice) - Number(prod.price)) /
                          Number(prod.compareAtPrice)) *
                          100
                      )
                    : 0;
                  const ratingVal =
                    Number(prod.rating) > 0 ? Number(prod.rating).toFixed(1) : '4.9';

                  return (
                    <div
                      key={`new-${prod._id}-${idx}`}
                      className="group relative rounded-[20px] sm:rounded-[24px] p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_12px_28px_rgba(40,6,25,0.14)] hover:shadow-[0_22px_46px_rgba(40,6,25,0.28)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                    >
                      {/* Top Gold Crown Jewel Stud on Each Card */}
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 w-2 sm:w-2.5 h-2 sm:h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#6E450A] shadow-2xs" />

                      <div className="h-full rounded-[18px] sm:rounded-[22px] bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#F3E1BF] p-2 sm:p-3 flex flex-col justify-between relative">
                        {/* TALL UNOBSTRUCTED ROYAL PORTRAIT IMAGE STAGE */}
                        <div className="relative h-[195px] sm:h-[290px] xl:h-[315px] w-full rounded-t-[14px] sm:rounded-t-[18px] rounded-b-[10px] sm:rounded-b-[12px] overflow-hidden bg-[#280619] border-[1.5px] border-[#D4AF37]/85 shadow-inner">
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
                              className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                            />
                          </Link>

                          {/* Inner 24K Gold Hairline Frame */}
                          <div className="absolute inset-1 sm:inset-1.5 border border-[#FFE59E]/40 rounded-t-[11px] sm:rounded-t-[14px] rounded-b-[7px] sm:rounded-b-[8px] pointer-events-none z-10" />

                          {/* Top-Left Edition Rank & Discount Pill */}
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] text-[#FFE59E] text-[8px] sm:text-[9px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase shadow-md">
                              <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FFE59E]" />
                              <span>NEW #{idx + 1}</span>
                            </span>
                            {hasDiscount && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-[#9E1946] border border-[#FFE59E] text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-sm w-fit">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>

                          {/* Top-Right Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => handleWishlistToggle(prod, e)}
                            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF9]/95 hover:bg-[#380725] border border-[#D4AF37] flex items-center justify-center text-[#23120B] hover:text-[#FFE59E] shadow-md cursor-pointer transition-all hover:scale-110"
                            aria-label="Add to wishlist"
                          >
                            <Heart
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                inWish
                                  ? 'fill-rose-600 text-rose-600'
                                  : 'fill-[#3D1D1A] text-[#3D1D1A]'
                              }`}
                            />
                          </button>

                          {/* Subtle Corner Rating Pill */}
                          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-20 inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#240316]/85 backdrop-blur-md border border-[#FFE59E]/75 text-[#FFE59E] text-[9px] sm:text-[10px] font-bold shadow-md">
                            <span>{ratingVal}</span>
                            <Star className="w-2.5 h-2.5 fill-[#F5C84C] text-[#F5C84C]" />
                          </div>
                        </div>

                        {/* Ornamental Gold Filigree Divider */}
                        <div className="flex items-center justify-center gap-1.5 my-1.5 sm:my-2.5">
                          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C8963E]" />
                          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
                          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C8963E]" />
                        </div>

                        {/* GRAND PRODUCT DETAILS & ACTION BAR */}
                        <div className="px-0.5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#380725]/10 border border-[#D4AF37]/60 text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.12em] sm:tracking-[0.15em] text-[#5B0E3D] uppercase truncate">
                                {categoryLabel}
                              </span>
                              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#15803D] inline-flex items-center gap-1 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                Ready
                              </span>
                            </div>

                            <Link href={`/product/${prod.slug}`} className="block mt-1 sm:mt-1.5">
                              <h3 className="font-serif font-bold text-[13px] sm:text-[16px] text-[#220915] group-hover:text-[#9E1946] transition-colors line-clamp-1">
                                {prod.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Price Row + Add to Cart Bar */}
                          <div className="mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-[#D4AF37]/35">
                            <div className="flex items-baseline justify-between gap-1 mb-2 sm:mb-2.5">
                              <div className="flex items-baseline gap-1 sm:gap-1.5">
                                <span className="font-serif font-extrabold text-[14px] sm:text-[18px] text-[#280619]">
                                  {formatCurrency(prod.price)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-[10px] sm:text-[11px] text-[#7A5B3E] line-through font-medium">
                                    {formatCurrency(Number(prod.compareAtPrice))}
                                  </span>
                                )}
                              </div>
                              <span className="hidden sm:inline text-[9px] font-bold text-[#8C5818] uppercase tracking-wider">
                                Free Ship
                              </span>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleAddToCart(prod, e)}
                                className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#5B0E3D] hover:to-[#280619] text-[#FFE59E] border border-[#D4AF37] text-[10px] sm:text-[11px] font-serif font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-[0_6px_16px_rgba(56,7,37,0.25)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                              >
                                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] shrink-0" />
                                <span className="truncate">Add to Cart</span>
                              </button>

                              <Link
                                href={`/product/${prod.slug}`}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-[#380725] text-[#280619] hover:text-[#FFE59E] border border-[#D4AF37] flex items-center justify-center shadow-2xs transition-all shrink-0"
                                aria-label={`View ${prod.name}`}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
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

            {/* Bottom Grand Couture Assurance Strip */}
            <div className="relative z-10 mt-6 pt-4 border-t border-[#D4AF37]/45 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-[#4A2511]">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#9E1946]" />
                  <span>5-Step Daylight Weave Inspection</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-[#9E1946]" />
                  <span>Optional Custom Princess / Aari Blouse Stitching</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#9E1946]" />
                  <span>Packed in Signature Nalmara Royal Box</span>
                </span>
              </div>
              <Link
                href="/shop?sort=newest"
                className="font-serif font-bold text-[#5B0E3D] hover:text-[#9E1946] underline underline-offset-4"
              >
                Explore Complete New Arrivals Catalog →
              </Link>
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
          className="sm:hidden relative rounded-[24px] p-[2.5px] shadow-[0_18px_42px_rgba(40,6,25,0.34)]"
          style={{
            background:
              'linear-gradient(90deg, #8C5818 0%, #FFE59E 25%, #D4AF37 50%, #FFE59E 75%, #8C5818 100%)',
          }}
        >
          {/* Top & Bottom Center Royal Diamond Studs */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#380725] shadow-xs" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#380725] shadow-xs" />

          <div className="relative rounded-[21.5px] overflow-hidden bg-[#240316]">
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
                    'linear-gradient(90deg, rgba(28, 2, 17, 0.96) 0%, rgba(44, 5, 27, 0.90) 48%, rgba(44, 5, 27, 0.28) 74%, rgba(24, 2, 14, 0.35) 100%)',
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#380725]/95 border border-[#FFE59E]/85 mb-1.5 shadow-sm">
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
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#380725]/90 border border-[#D4AF37]/75 text-[8.5px] font-serif font-semibold text-[#FFE59E] truncate shadow-2xs"
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#380725]/90 text-[#FFE59E] border border-[#D4AF37] font-serif font-bold text-[10px] shadow-sm shrink-0"
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
                      className="flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg bg-[#240316]/85 border border-[#D4AF37]/55"
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
          className="hidden sm:block relative rounded-[32px] p-[3px] shadow-[0_26px_65px_rgba(40,6,25,0.34)]"
          style={{
            background:
              'linear-gradient(90deg, #8C5818 0%, #FFE59E 25%, #D4AF37 50%, #FFE59E 75%, #8C5818 100%)',
          }}
        >
          {/* Top & Bottom Center Royal Diamond Studs */}
          <span className="hidden sm:block absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#380725] shadow-md" />
          <span className="hidden sm:block absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#380725] shadow-md" />

          <div className="relative rounded-[29px] overflow-hidden bg-[#240316] min-h-[410px] sm:min-h-[460px] lg:min-h-[500px] flex items-center">
            {/* Seamless 1920x640 Panoramic HD Festive Masterpiece + Smooth Royal Velvet Gradient */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/images/nalmara/hd/festive_panoramic_master.jpg"
                alt="Celebrate in Style - Festive Collection"
                fill
                unoptimized
                className="object-cover object-[center_top]"
              />
              {/* Seamless Multi-Stop Royal Plum Velvet Overlay (No Hard Vertical Cut) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(28, 2, 17, 0.96) 0%, rgba(44, 5, 27, 0.90) 36%, rgba(44, 5, 27, 0.32) 60%, rgba(28, 2, 17, 0.15) 74%, rgba(24, 2, 14, 0.78) 100%)',
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#380725]/95 border border-[#FFE59E]/90 mb-3.5 shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
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
                      className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#380725]/85 hover:bg-[#5B0E3D] border border-[#D4AF37]/80 shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 text-left"
                    >
                      <div className="min-w-0">
                        <span className="block font-serif font-bold text-xs sm:text-[13.5px] text-[#FFE59E] group-hover:text-white truncate">
                          {item.title}
                        </span>
                        <span className="block text-[10px] font-medium text-[#F5D996]/85 truncate mt-0.5">
                          {item.sub}
                        </span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 group-hover:bg-[#FFE59E] text-[#FFE59E] group-hover:text-[#280619] border border-[#D4AF37]/70 flex items-center justify-center shrink-0 transition-colors">
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
                    className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#380725]/90 hover:bg-[#5B0E3D] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-xs sm:text-sm shadow-[0_8px_22px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all hover:scale-105"
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
                    sub: '1–3 Days Across Tamil Nadu',
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
                      className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#240316]/90 hover:bg-[#380725] backdrop-blur-md border-[1.5px] border-[#D4AF37] shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-x-1"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] text-[#240316] flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
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
      <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-10 sm:pt-8 sm:pb-14">
        <RoyalCornerMandala className="hidden lg:block absolute top-2 left-4 w-28 h-28 pointer-events-none" />
        <RoyalCornerMandala className="hidden lg:block absolute top-2 right-4 w-28 h-28 -scale-x-100 pointer-events-none" />

        <GoldSectionHeader
          badge="MOST LOVED SIGNATURES"
          title="Best Sellers"
          subtitle="Customer Favorites & Top-Rated Royal Weaves!"
        />

        {/* Grand 5-in-a-Row Luxury Showroom Stage — Best Sellers */}
        <div className="relative rounded-[32px] p-[2.5px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_60px_rgba(40,6,25,0.16)]">
          {/* Top Royal Crown Emblem Stud */}
          <span className="hidden sm:block absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-4 h-4 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border-[1.5px] border-[#5B0E3D] shadow-md" />

          <div className="relative rounded-[29.5px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F1DFBD] p-2.5 sm:p-6 lg:p-8 overflow-hidden">
            {/* Ambient Radial Gold Spotlight */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 82% 15%, rgba(212,175,55,0.18) 0%, transparent 42%), radial-gradient(circle at 18% 85%, rgba(91,14,61,0.07) 0%, transparent 42%)',
              }}
            />

            {/* Top Grand Curated Toolbar — Single-Row Symmetrical Arrangement */}
            <div className="relative z-10 flex items-center justify-between gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF1DE] to-[#FFFDF9] border border-[#D4AF37]/75 shadow-[0_6px_18px_rgba(40,6,25,0.06)]">
              {/* Left: Royal Edition Badge + Desktop Trust Tags */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border border-[#D4AF37] text-[9px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] shadow-xs shrink-0">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#FFE59E] text-[#FFE59E] shrink-0" />
                  <span className="sm:hidden">Top Favorites</span>
                  <span className="hidden sm:inline">Top Customer Favorites</span>
                </span>

                <span className="hidden md:inline-block w-[1px] h-4 bg-[#D4AF37]/60 shrink-0" />

                <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3D1D1A] truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9E1946] shrink-0" />
                  <span>4.9★ Rated Across Tamil Nadu</span>
                </span>

                <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#380725]/10 border border-[#D4AF37]/50 text-[10.5px] font-bold text-[#5B0E3D] shrink-0">
                  <Gem className="w-3 h-3 text-[#9E1946]" />
                  <span>Signature Gift Box</span>
                </span>
              </div>

              {/* Right: Unified Prev/Next Rocker Capsule + Explore All CTA */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {/* Unified Segmented Prev / Next Pill */}
                <div className="inline-flex items-center rounded-full bg-[#FFFDF9] border-[1.5px] border-[#D4AF37] p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setBestSellerStartIndex(
                        (prev) =>
                          (prev - 1 + bestSellerProducts.length) % bestSellerProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#280619] hover:bg-[#380725] hover:text-[#FFE59E] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous best sellers"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-[1px] h-4 bg-[#D4AF37]/55" />
                  <button
                    type="button"
                    onClick={() =>
                      setBestSellerStartIndex(
                        (prev) => (prev + 1) % bestSellerProducts.length
                      )
                    }
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[#280619] hover:bg-[#380725] hover:text-[#FFE59E] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next best sellers"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Primary Explore All Pill Button */}
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#5B0E3D] hover:to-[#280619] text-[#FFE59E] border-[1.5px] border-[#D4AF37] text-[10.5px] sm:text-xs font-serif font-bold shadow-[0_4px_12px_rgba(56,7,37,0.22)] transition-all"
                >
                  <span>Explore All</span>
                  <span className="hidden sm:inline">Best Sellers</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 2 CARDS PER ROW ON MOBILE (`grid-cols-2`), 5 IN A ROW ON DESKTOP (`lg:grid-cols-5`) */}
            {isProductsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5 relative z-10">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[20px] sm:rounded-[24px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] border-2 border-[#C8963E]/60 p-2 sm:p-3 animate-pulse space-y-2.5"
                  >
                    <div className="h-[195px] sm:h-[290px] w-full rounded-[14px] sm:rounded-[18px] bg-[#EED9BA]" />
                    <div className="h-3 w-1/2 rounded bg-[#E5CCA4]" />
                    <div className="h-4 w-4/5 rounded bg-[#E5CCA4]" />
                    <div className="h-8 w-full rounded-full bg-[#D9BC8C]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5 items-stretch">
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
                  const discountPct = hasDiscount
                    ? Math.round(
                        ((Number(prod.compareAtPrice) - Number(prod.price)) /
                          Number(prod.compareAtPrice)) *
                          100
                      )
                    : 0;
                  const ratingVal =
                    Number(prod.rating) > 0 ? Number(prod.rating).toFixed(1) : '4.9';

                  return (
                    <div
                      key={`best-${prod._id}-${idx}`}
                      className="group relative rounded-[20px] sm:rounded-[24px] p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_12px_28px_rgba(40,6,25,0.14)] hover:shadow-[0_22px_46px_rgba(40,6,25,0.28)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
                    >
                      {/* Top Gold Crown Jewel Stud on Each Card */}
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 w-2 sm:w-2.5 h-2 sm:h-2.5 rotate-45 bg-gradient-to-br from-[#FFFDF9] via-[#FFE59E] to-[#B88228] border border-[#6E450A] shadow-2xs" />

                      <div className="h-full rounded-[18px] sm:rounded-[22px] bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#F3E1BF] p-2 sm:p-3 flex flex-col justify-between relative">
                        {/* TALL UNOBSTRUCTED ROYAL PORTRAIT IMAGE STAGE */}
                        <div className="relative h-[195px] sm:h-[290px] xl:h-[315px] w-full rounded-t-[14px] sm:rounded-t-[18px] rounded-b-[10px] sm:rounded-b-[12px] overflow-hidden bg-[#280619] border-[1.5px] border-[#D4AF37]/85 shadow-inner">
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
                              className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700"
                            />
                          </Link>

                          {/* Inner 24K Gold Hairline Frame */}
                          <div className="absolute inset-1 sm:inset-1.5 border border-[#FFE59E]/40 rounded-t-[11px] sm:rounded-t-[14px] rounded-b-[7px] sm:rounded-b-[8px] pointer-events-none z-10" />

                          {/* Top-Left Bestseller Rank & Discount Pill */}
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] text-[#FFE59E] text-[8px] sm:text-[9px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase shadow-md">
                              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-[#FFE59E] text-[#FFE59E]" />
                              <span>TOP #{idx + 1}</span>
                            </span>
                            {hasDiscount && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-[#9E1946] border border-[#FFE59E] text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-sm w-fit">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>

                          {/* Top-Right Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => handleWishlistToggle(prod, e)}
                            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF9]/95 hover:bg-[#380725] border border-[#D4AF37] flex items-center justify-center text-[#23120B] hover:text-[#FFE59E] shadow-md cursor-pointer transition-all hover:scale-110"
                            aria-label="Add to wishlist"
                          >
                            <Heart
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                inWish
                                  ? 'fill-rose-600 text-rose-600'
                                  : 'fill-[#3D1D1A] text-[#3D1D1A]'
                              }`}
                            />
                          </button>

                          {/* Subtle Corner Rating Pill */}
                          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-20 inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#240316]/85 backdrop-blur-md border border-[#FFE59E]/75 text-[#FFE59E] text-[9px] sm:text-[10px] font-bold shadow-md">
                            <span>{ratingVal}</span>
                            <Star className="w-2.5 h-2.5 fill-[#F5C84C] text-[#F5C84C]" />
                          </div>
                        </div>

                        {/* Ornamental Gold Filigree Divider */}
                        <div className="flex items-center justify-center gap-1.5 my-1.5 sm:my-2.5">
                          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C8963E]" />
                          <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
                          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C8963E]" />
                        </div>

                        {/* GRAND PRODUCT DETAILS & ACTION BAR */}
                        <div className="px-0.5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#380725]/10 border border-[#D4AF37]/60 text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.12em] sm:tracking-[0.15em] text-[#5B0E3D] uppercase truncate">
                                {categoryLabel}
                              </span>
                              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#9E1946] inline-flex items-center gap-1 shrink-0">
                                <Sparkles className="w-2.5 h-2.5" />
                                Hot
                              </span>
                            </div>

                            <Link href={`/product/${prod.slug}`} className="block mt-1 sm:mt-1.5">
                              <h3 className="font-serif font-bold text-[13px] sm:text-[16px] text-[#220915] group-hover:text-[#9E1946] transition-colors line-clamp-1">
                                {prod.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Price Row + Add to Cart Bar */}
                          <div className="mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-[#D4AF37]/35">
                            <div className="flex items-baseline justify-between gap-1 mb-2 sm:mb-2.5">
                              <div className="flex items-baseline gap-1 sm:gap-1.5">
                                <span className="font-serif font-extrabold text-[14px] sm:text-[18px] text-[#280619]">
                                  {formatCurrency(prod.price)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-[10px] sm:text-[11px] text-[#7A5B3E] line-through font-medium">
                                    {formatCurrency(Number(prod.compareAtPrice))}
                                  </span>
                                )}
                              </div>
                              <span className="hidden sm:inline text-[9px] font-bold text-[#8C5818] uppercase tracking-wider">
                                Gift Box
                              </span>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleAddToCart(prod, e)}
                                className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#5B0E3D] hover:to-[#280619] text-[#FFE59E] border border-[#D4AF37] text-[10px] sm:text-[11px] font-serif font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-[0_6px_16px_rgba(56,7,37,0.25)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                              >
                                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] shrink-0" />
                                <span className="truncate">Add to Cart</span>
                              </button>

                              <Link
                                href={`/product/${prod.slug}`}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-[#380725] text-[#280619] hover:text-[#FFE59E] border border-[#D4AF37] flex items-center justify-center shadow-2xs transition-all shrink-0"
                                aria-label={`View ${prod.name}`}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
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

            {/* Bottom Grand Couture Assurance Strip */}
            <div className="relative z-10 mt-6 pt-4 border-t border-[#D4AF37]/45 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-[#4A2511]">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#9E1946]" />
                  <span>Most Re-Ordered by 2,400+ Families</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-[#9E1946]" />
                  <span>Custom Bridal Aari &amp; Princess Tailoring Available</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#9E1946]" />
                  <span>1–3 Day Express Delivery Across Tamil Nadu</span>
                </span>
              </div>
              <Link
                href="/shop"
                className="font-serif font-bold text-[#5B0E3D] hover:text-[#9E1946] underline underline-offset-4"
              >
                Explore All Bestsellers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 06. WHY CHOOSE NALMARA FASHION? (4 Royal Heritage Pillar Cards)     */}
      {/* =================================================================== */}
      <section className="relative w-full py-8 sm:py-10 overflow-hidden">
        <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-8 lg:px-12">
          <GoldSectionHeader
            badge="THE NALMARA PROMISE"
            title="Why Choose NALMARA FASHION?"
            subtitle="Crafted with devotion in Thoothukudi for families across Tamil Nadu & India"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-1">
            {/* Card 1: Handpicked Styles */}
            <div className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_10px_24px_rgba(90,45,15,0.1)] hover:-translate-y-1.5 transition-all">
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F2DFBE] px-5 pt-6 pb-5 text-center flex flex-col items-center">
                <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#9E6B18] text-[#23120B] border-2 border-[#FFF8D6] flex items-center justify-center mb-3 shadow-md group-hover:scale-108 transition-transform">
                  <Gem className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-[16.5px] text-[#23120B]">
                  Handpicked Styles
                </h3>
                <p className="text-xs font-bold text-[#681145] uppercase tracking-wider mt-0.5">
                  Latest Trends
                </p>
                <p className="text-[11.5px] text-[#5C3D1E] mt-1.5 leading-relaxed">
                  Curated Kanchipuram silks, bridal lehengas &amp; festive kidswear updated weekly.
                </p>
              </div>
            </div>

            {/* Card 2: Premium Quality */}
            <div className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_10px_24px_rgba(90,45,15,0.1)] hover:-translate-y-1.5 transition-all">
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F2DFBE] px-5 pt-6 pb-5 text-center flex flex-col items-center">
                <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#9E6B18] text-[#23120B] border-2 border-[#FFF8D6] flex items-center justify-center mb-3 shadow-md group-hover:scale-108 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-[16.5px] text-[#23120B]">
                  Premium Quality
                </h3>
                <p className="text-xs font-bold text-[#681145] uppercase tracking-wider mt-0.5">
                  Best Fabrics
                </p>
                <p className="text-[11.5px] text-[#5C3D1E] mt-1.5 leading-relaxed">
                  100% quality-inspected weaves, skin-friendly linings &amp; rich zari borders.
                </p>
              </div>
            </div>

            {/* Card 3: Perfect Fit & Stitching */}
            <div className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_10px_24px_rgba(90,45,15,0.1)] hover:-translate-y-1.5 transition-all">
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F2DFBE] px-5 pt-6 pb-5 text-center flex flex-col items-center">
                <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#FFF8D6] to-[#E5C158] border-2 border-[#C8912E] flex items-center justify-center mb-3 shadow-md group-hover:scale-108 transition-transform">
                  <MannequinDummyIcon className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-[16.5px] text-[#23120B]">
                  Perfect Fit &amp; Stitching
                </h3>
                <p className="text-xs font-bold text-[#681145] uppercase tracking-wider mt-0.5">
                  With Care
                </p>
                <p className="text-[11.5px] text-[#5C3D1E] mt-1.5 leading-relaxed">
                  Master tailors crafting custom Aari blouses, pattu pavadais &amp; bridal gowns.
                </p>
              </div>
            </div>

            {/* Card 4: Trusted Customer Service */}
            <div className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_10px_24px_rgba(90,45,15,0.1)] hover:-translate-y-1.5 transition-all">
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF1DF] to-[#F2DFBE] px-5 pt-6 pb-5 text-center flex flex-col items-center">
                <div className="w-13 h-13 rounded-full bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#9E6B18] text-[#23120B] border-2 border-[#FFF8D6] flex items-center justify-center mb-3 shadow-md group-hover:scale-108 transition-transform">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-[16.5px] text-[#23120B]">
                  Trusted Customer Service
                </h3>
                <p className="text-xs font-bold text-[#681145] uppercase tracking-wider mt-0.5">
                  Always Here for You
                </p>
                <p className="text-[11.5px] text-[#5C3D1E] mt-1.5 leading-relaxed">
                  Personal WhatsApp styling assistance &amp; fast doorstep delivery across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 07. STYLE INSPIRATION ("Follow Us @nalmarafashion" — Live Feed)     */}
      {/* =================================================================== */}
      {styleInspirationList.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-9">
          <GoldSectionHeader
            badge="ROYAL LOOKBOOK"
            title="Style Inspiration"
            subtitle="Follow Us @nalmarafashion"
          />

          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Live Lookbook Cards */}
            <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {styleInspirationList.map((item) => {
                const isLiked = Boolean(likedInspire[item.id]);
                const fallbackImg = getCategoryFallbackImage(item.title);
                return (
                  <div
                    key={item.id}
                    className="group relative aspect-[4/3.6] rounded-2xl p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#C8963E] to-[#8C5818] shadow-[0_8px_22px_rgba(90,45,15,0.16)] hover:-translate-y-1.5 transition-all"
                  >
                    <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#EED9BA]">
                      <Link
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="block w-full h-full"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || fallbackImg}
                          alt={item.title}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== fallbackImg) {
                              target.src = fallbackImg;
                            }
                          }}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Bottom Subtle Luxury Label Overlay */}
                        <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 px-2 bg-gradient-to-t from-[#220415]/85 via-[#220415]/40 to-transparent">
                          <p className="text-[10.5px] font-serif font-semibold text-[#FFF4C2] text-center truncate">
                            {item.title}
                          </p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setLikedInspire((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className="absolute top-2 right-2 z-10 w-6.5 h-6.5 rounded-full bg-[#FFFDF9]/95 border border-[#D4AF37] flex items-center justify-center text-[#23120B] shadow-sm cursor-pointer transition-transform hover:scale-110"
                        aria-label="Like style"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked
                              ? 'fill-rose-600 text-rose-600'
                              : 'fill-[#3D1D1A] text-[#3D1D1A]'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: "Follow Us →" Pill Button + Instagram Icon */}
            <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:pl-2">
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5B0E3D] to-[#3D0829] hover:from-[#73134E] hover:to-[#5B0E3D] text-[#FFFDF9] border border-[#D4AF37] text-xs font-serif font-bold shadow-md transition-all hover:scale-105"
              >
                <span>Follow Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE59E]" />
              </a>

              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#F3E0C0] border-[1.5px] border-[#23120B] text-[#23120B] hover:bg-[#5B0E3D] hover:text-[#FFE59E] hover:border-[#D4AF37] flex items-center justify-center shadow-xs transition-all"
                aria-label="Instagram @nalmarafashion"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* 08. SPLIT SECTION: HAPPY CUSTOMERS (LIVE API REVIEWS) & FAQs        */}
      {/* =================================================================== */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-12 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT 7 COLUMNS: Happy Customers (100% Live API Reviews) */}
          <div className="lg:col-span-7 rounded-3xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_14px_34px_rgba(90,45,15,0.1)]">
            <div className="h-full rounded-[22px] bg-gradient-to-b from-[#FAF0DD] to-[#F3E0C0] p-5 sm:p-7 flex flex-col justify-between relative">
              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#5B0E3D]/10 border border-[#C8963E]/60 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#5B0E3D] mb-1.5">
                  Verified Patron Reviews
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#23120B]">
                  Happy Customers
                </h2>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="h-[1px] w-10 bg-[#C8963E]" />
                  <p className="text-xs text-[#4A2C2A] font-medium inline-flex items-center gap-1">
                    <span>Your Happiness is Our Joy</span>
                    <Heart className="w-3.5 h-3.5 text-[#5B0E3D] fill-[#5B0E3D]/20" />
                  </p>
                  <span className="h-[1px] w-10 bg-[#C8963E]" />
                </div>
              </div>

              <div className="relative px-2 sm:px-6 my-auto">
                {/* Left & Right Gold Arrows when more than 3 live reviews exist */}
                {liveReviews.length > 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setReviewStartIndex(
                          (prev) => (prev - 1 + liveReviews.length) % liveReviews.length
                        )
                      }
                      className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#9E6B18] text-white items-center justify-center shadow-xs hover:from-[#5B0E3D] hover:to-[#3D0829] transition-all cursor-pointer"
                      aria-label="Previous reviews"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReviewStartIndex((prev) => (prev + 1) % liveReviews.length)
                      }
                      className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#9E6B18] text-white items-center justify-center shadow-xs hover:from-[#5B0E3D] hover:to-[#3D0829] transition-all cursor-pointer"
                      aria-label="Next reviews"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {isReviewsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {[...Array(3)].map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/60 p-4 h-36 animate-pulse space-y-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#EED9BA]" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-2/3 rounded bg-[#EED9BA]" />
                            <div className="h-2.5 w-1/2 rounded bg-[#EED9BA]" />
                          </div>
                        </div>
                        <div className="h-3 w-full rounded bg-[#EED9BA]" />
                        <div className="h-3 w-4/5 rounded bg-[#EED9BA]" />
                      </div>
                    ))}
                  </div>
                ) : visibleReviews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {visibleReviews.map((rev) => {
                      const firstName = rev.user?.firstName || 'Valued';
                      const lastName = rev.user?.lastName || 'Patron';
                      const fullName = `${firstName} ${lastName}`.trim();
                      const initials = `${firstName.charAt(0)}${lastName.charAt(0) || ''}`.toUpperCase();
                      const avatarUrl = resolveMediaUrl(rev.user?.avatar);
                      const stars = Math.max(1, Math.min(5, Number(rev.rating) || 5));
                      const productName =
                        typeof rev.product === 'object' && rev.product?.name
                          ? rev.product.name
                          : 'Verified Purchase';

                      return (
                        <div
                          key={rev._id}
                          className="relative rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/80 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2.5 mb-2.5">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-gradient-to-b from-[#4A0B32] to-[#28041A] text-[#FFE59E] flex items-center justify-center font-serif font-bold text-xs shadow-2xs">
                                {avatarUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={avatarUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{initials}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <h4 className="font-serif font-bold text-xs sm:text-[13.5px] text-[#23120B] truncate">
                                    {fullName}
                                  </h4>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                                </div>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                  {[...Array(stars)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-2.5 h-2.5 fill-[#E5A93B] text-[#E5A93B]"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <p className="text-[11.5px] sm:text-xs text-[#3D251E] italic font-serif leading-relaxed line-clamp-3">
                              &ldquo;{rev.comment || rev.title}&rdquo;
                            </p>
                          </div>

                          <p className="text-[9.5px] font-semibold text-[#8C5818] mt-2.5 pt-2 border-t border-[#D4AF37]/25 truncate">
                            Verified Buyer • {productName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/80 p-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1 text-[#E5A93B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E5A93B]" />
                      ))}
                    </div>
                    <p className="font-serif font-bold text-sm text-[#23120B]">
                      Share Your NALMARA Experience
                    </p>
                    <p className="text-xs text-[#5C3D1E] max-w-md mx-auto">
                      Purchase your favourite saree or custom-stitched outfit and leave a verified review on the product page!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Frequently Asked Questions */}
          <div className="lg:col-span-5 rounded-3xl p-[2px] bg-gradient-to-b from-[#D4AF37] via-[#FFE59E] to-[#9E6B18] shadow-[0_14px_34px_rgba(90,45,15,0.1)]">
            <div className="h-full rounded-[22px] bg-gradient-to-b from-[#FAF0DD] to-[#F3E0C0] p-5 sm:p-7 flex flex-col justify-between">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#5B0E3D]/10 border border-[#C8963E]/60 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#5B0E3D] mb-1.5">
                  Customer Care
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#23120B]">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-[#4A2C2A] font-medium mt-0.5">
                  Find quick answers to your queries
                </p>
              </div>

              <div className="space-y-2.5 my-auto">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/80 overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FAF3E6] transition-colors"
                      >
                        <span className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-[#23120B]">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#FFE59E] to-[#D4AF37] text-[#23120B] text-[10px] font-serif font-bold flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#5B0E3D] shrink-0" />
                        ) : (
                          <Plus className="w-4 h-4 text-[#23120B] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-1.5 text-xs text-[#4A2C2A] border-t border-[#D4AF37]/30 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
