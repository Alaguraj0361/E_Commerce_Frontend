'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
  Gem,
  RefreshCcw,
  MessageCircle,
  Sparkles,
  FileCheck2,
  HeartHandshake,
  Sprout,
  Play,
  Instagram,
  Check,
  Plus,
  Minus,
  Crown,
  Flame,
  ShoppingBag,
} from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';
import { LotusIcon } from '../components/ui/BrandLogo';

// ==============================================================
// BOTANICAL BRANCH SVG DECORATION
// ==============================================================
const BotanicalBranch = ({ className = 'w-24 h-24 text-[#C5A059]' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M10 90C35 80 55 60 70 30M70 30C75 20 85 10 92 8C90 18 82 25 70 30ZM35 73C28 65 24 50 32 42C38 48 37 63 35 73ZM50 56C46 45 46 32 55 26C59 34 56 47 50 56ZM63 41C63 30 68 18 78 16C78 25 72 35 63 41Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ==============================================================
// 02. HERO SLIDES DATA (Trending Royal Couture Lookbook Showcase)
// ==============================================================
const HERO_SLIDES = [
  {
    edition: '01',
    tag: 'Signature Silk Edit • 2026',
    title: 'Traditional Elegance',
    subtitle: 'Handpicked Kanchipuram & Heritage Silk Drapes',
    description:
      'Woven with luminous 24K-finish zari and feather-soft mulberry silk for weddings, muhurthams, and timeless celebrations.',
    highlights: ['Pure Zari Border', 'With Unstitched Blouse', 'Silk Mark Assured'],
    image: '/images/nalmara/hero_traditional_elegance.jpg',
    detailImage: '/images/categories/sarees.jpg',
    fullWidthImage: '/images/hero_banner.jpg',
    lookTitle: 'Royal Mauve Kanchipuram Silk',
    lookSub: 'Temple Zari & Contrast Pallu',
    startingPrice: '₹2,499',
    craftTitle: '24K-Finish Temple Zari',
    craftSub: '6.3m Saree + Contrast Blouse',
    bentoKicker: 'DIRECT LOOM ARCHIVE',
    bentoHeadline: 'Pure Heritage Silk Weaves',
    bentoOffer: 'Complimentary Royal Gift Box & Insured Pan-India Delivery',
    primaryLink: '/shop?category=sarees',
    primaryText: 'Shop Silk Sarees',
    secondaryLink: '/shop?filter=new-arrivals',
    secondaryText: 'Explore New Arrivals',
    isDark: true,
  },
  {
    edition: '02',
    tag: 'The Muhurtham Bridal Archive',
    title: 'Royal Handlooms',
    subtitle: 'Heirloom Bridal Lehengas & Grand Wedding Silks',
    description:
      'Intricate zardosi hand-embroidery and regal crimson weaves crafted to make every bride shine on her most auspicious day.',
    highlights: ['Bridal Trousseau Ready', 'Handcrafted Zardosi', 'Custom Fit Available'],
    image: '/images/categories/lehengas.jpg',
    detailImage: '/images/bestsellers/traditional_silk_saree.jpg',
    fullWidthImage: '/images/hero_banner_2.jpg',
    lookTitle: 'Crimson Palace Bridal Lehenga',
    lookSub: 'Heavy Zardosi & Double Dupatta',
    startingPrice: '₹4,999',
    craftTitle: 'Intricate Hand Zardosi',
    craftSub: 'Bridal Flair & Rich Pallu',
    bentoKicker: 'MUHURTHAM TROUSSEAU',
    bentoHeadline: 'Bespoke Bridal Couture',
    bentoOffer: '1-on-1 Live WhatsApp Video Drape Consultation Available',
    primaryLink: '/shop?category=lehengas',
    primaryText: 'Shop Bridal Edit',
    secondaryLink: '/shop?category=sarees',
    secondaryText: 'View Wedding Silks',
    isDark: true,
  },
  {
    edition: '03',
    tag: 'Auspicious Celebrations',
    title: 'Festive Splendor',
    subtitle: 'Celebratory Drapes & Designer Festive Ensembles',
    description:
      'Radiant jewel-toned sarees, designer party wear, and family festive ensembles curated for unforgettable milestones.',
    highlights: ['Jewel-Tone Palettes', 'Lightweight Comfort', 'Express Pan-India Ship'],
    image: '/images/nalmara/festive_green_saree_model.jpg',
    detailImage: '/images/nalmara/festive_folded_saree.jpg',
    fullWidthImage: '/images/hero_banner_3.jpg',
    lookTitle: 'Emerald Deepam Zari Silk',
    lookSub: 'Festive Gold Brocade Weave',
    startingPrice: '₹1,999',
    craftTitle: 'Rich Brocade & Tissue Zari',
    craftSub: 'Featherlight All-Day Drape',
    bentoKicker: 'FESTIVE SEASON EDIT',
    bentoHeadline: 'Celebration Ready Drapes',
    bentoOffer: '24–48 Hr Express Insured Dispatch Across India',
    primaryLink: '/shop?category=festive',
    primaryText: 'Shop Festive Wear',
    secondaryLink: '/shop?filter=new-arrivals',
    secondaryText: 'Explore New Arrivals',
    isDark: true,
  },
];

// ==============================================================
// 04. CATEGORIES DATA (Mockup 5 Categories)
// ==============================================================
const RoyalMedallionBadge = ({ slug, className = 'w-11 h-11' }: { slug: string; className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#7A0D1B] via-[#5C0612] to-[#360309] border-2 border-[#D4AF37] shadow-[0_4px_14px_rgba(54,3,9,0.4)] flex items-center justify-center">
      <div className="absolute inset-[2px] rounded-full border border-[#FFE59E]/30 pointer-events-none" />
      <CategoryMedallionIcon slug={slug} className="w-5 h-5 text-[#FFE59E] drop-shadow-xs" />
    </div>
  </div>
);

const CategoryMedallionIcon = ({ slug, className = 'w-5 h-5' }: { slug: string; className?: string }) => {
  switch (slug) {
    case 'sarees':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M7 3L17 5L15 21L5 19L7 3Z" strokeLinejoin="round" />
          <path d="M7 7L16 9" />
          <path d="M6.5 11L15.5 13" />
          <path d="M6 15L15 17" />
        </svg>
      );
    case 'semi-kanchivaram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M12 3L9 8H15L12 3Z" />
          <path d="M9 8L5 21H19L15 8" strokeLinejoin="round" />
          <path d="M9 13H15" />
          <path d="M7 17H17" />
        </svg>
      );
    case 'cotton-sarees':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="4" y="6" width="16" height="3.5" rx="1.5" />
          <rect x="4" y="11" width="16" height="3.5" rx="1.5" />
          <rect x="4" y="16" width="16" height="3.5" rx="1.5" />
        </svg>
      );
    case 'party-wear':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M12 3L8 9L5 21H19L16 9L12 3Z" strokeLinejoin="round" />
          <path d="M12 9V21" />
          <circle cx="12" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'kids-wear':
    case 'kidswear':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M9 4L6 8L7 12L4 20H20L17 12L18 8L15 4L12 6L9 4Z" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'lehengas':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M8 5H16L19 20H5L8 5Z" strokeLinejoin="round" />
          <path d="M6.5 15C10 17 14 17 17.5 15" />
        </svg>
      );
    case 'anarkali':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M12 3L9 7H15L12 3Z" />
          <path d="M9 7L4 21H20L15 7" strokeLinejoin="round" />
        </svg>
      );
    case 'kurtis':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M8 3H16V9L18 10L17 21H7L6 10L8 9V3Z" strokeLinejoin="round" />
          <path d="M12 3V9" />
        </svg>
      );
    case 'salwar-suits':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M7 4H17L19 11L17 17H7L5 11L7 4Z" strokeLinejoin="round" />
          <path d="M9 17L8 21H16L15 17" />
        </svg>
      );
    case 'mens-wear':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M9 3H15L17 9L16 21H8L7 9L9 3Z" strokeLinejoin="round" />
          <path d="M12 3V11" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};

const CATEGORIES_DATA = [
  {
    id: 'sarees',
    title: 'Sarees',
    subtitle: 'Royal Zari Weaves',
    image: '/images/nalmara/card_kanchivaram.jpg',
    link: '/shop?category=sarees',
    slug: 'sarees',
  },
  {
    id: 'semi-kanchivaram',
    title: 'Semi Kanchipuram',
    subtitle: 'Temple Border Silk',
    image: '/images/nalmara/category_semi_kanchivaram.jpg',
    link: '/shop?category=semi-kanchipuram',
    slug: 'semi-kanchivaram',
  },
  {
    id: 'cotton-sarees',
    title: 'Cotton Sarees',
    subtitle: 'Breathable Handloom',
    image: '/images/nalmara/cotton_saree_stack.jpg',
    link: '/shop?category=cotton-sarees',
    slug: 'cotton-sarees',
  },
  {
    id: 'party-wear',
    title: 'Party Wear',
    subtitle: 'Designer Shimmer',
    image: '/images/nalmara/category_party_wear.jpg',
    link: '/shop?category=party-wear',
    slug: 'party-wear',
  },
  {
    id: 'kids-wear',
    title: 'Kids',
    subtitle: 'Festive Pattu & Gowns',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    link: '/shop?category=kids-wear',
    slug: 'kids-wear',
  },
  {
    id: 'lehengas',
    title: 'Lehengas',
    subtitle: 'Bridal & Festive Edit',
    image: '/images/categories/lehengas.jpg',
    link: '/shop?category=lehengas',
    slug: 'lehengas',
  },
  {
    id: 'anarkali',
    title: 'Anarkali',
    subtitle: 'Regal Floor-Length',
    image: '/images/categories/anarkali.jpg',
    link: '/shop?category=anarkali',
    slug: 'anarkali',
  },
  {
    id: 'kurtis',
    title: 'Kurtis',
    subtitle: 'Everyday Elegance',
    image: '/images/categories/kurtis.jpg',
    link: '/shop?category=kurtis',
    slug: 'kurtis',
  },
  {
    id: 'salwar-suits',
    title: 'Salwar Suits',
    subtitle: 'Artisanal Ensembles',
    image: '/images/categories/salwar-suits.jpg',
    link: '/shop?category=salwar-suits',
    slug: 'salwar-suits',
  },
  {
    id: 'mens-wear',
    title: "Men's Wear",
    subtitle: 'Classic Ethnic Silk',
    image: '/images/categories/mens-wear.jpg',
    link: '/shop?category=mens-wear',
    slug: 'mens-wear',
  },
];

// ==============================================================
// 06. NEW ARRIVALS DATA (Mockup exact products)
// ==============================================================
const NEW_ARRIVALS_DATA = [
  {
    _id: 'na-1',
    name: 'Semi Kanchivaram Silk Saree',
    price: 1299,
    compareAtPrice: 1999,
    priceDisplay: '₹1,299',
    rating: 4.8,
    reviewsCount: 115,
    colors: ['#E85A88', '#3B82F6', '#EAB308'],
    image: '/images/nalmara/category_semi_kanchivaram.jpg',
    slug: 'semi-kanchivaram-silk-saree',
  },
  {
    _id: 'na-2',
    name: 'Cotton Saree',
    price: 799,
    compareAtPrice: 1199,
    priceDisplay: '₹799',
    rating: 4.9,
    reviewsCount: 89,
    colors: ['#10B981', '#EC4899', '#3B82F6'],
    image: '/images/nalmara/cotton_saree_stack.jpg',
    slug: 'cotton-saree',
  },
  {
    _id: 'na-3',
    name: 'Party Wear Saree',
    price: 1489,
    compareAtPrice: 1999,
    priceDisplay: '₹1,489',
    rating: 4.7,
    reviewsCount: 72,
    colors: ['#F97316', '#14B8A6', '#F59E0B'],
    image: '/images/nalmara/category_party_wear.jpg',
    slug: 'party-wear-saree',
  },
  {
    _id: 'na-4',
    name: 'Art Silk Saree',
    price: 909,
    compareAtPrice: 1499,
    priceDisplay: '₹909',
    rating: 4.8,
    reviewsCount: 95,
    colors: ['#1E3A8A', '#475569', '#881337'],
    image: '/images/bestsellers/traditional_silk_saree.jpg',
    slug: 'art-silk-saree',
  },
  {
    _id: 'na-5',
    name: 'Kids Butterfly Gown',
    price: 369,
    compareAtPrice: 699,
    priceDisplay: '₹369',
    rating: 4.9,
    reviewsCount: 64,
    colors: ['#EAB308', '#EC4899'],
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    slug: 'kids-butterfly-gown',
  },
];

// ==============================================================
// 07. BESTSELLERS & TRENDING DATA (Mockup exact products)
// ==============================================================
const BESTSELLERS_DATA = [
  {
    _id: 'bs-1',
    name: 'Kanchivaram Saree',
    price: 1499,
    compareAtPrice: 2499,
    priceDisplay: '₹1,499',
    badge: 'BESTSELLER',
    badgeType: 'crown',
    rating: 4.8,
    reviewsCount: '1.2k',
    colors: ['#881337', '#D4AF37'],
    image: '/images/nalmara/card_kanchivaram.jpg',
    slug: 'kanchivaram-saree',
  },
  {
    _id: 'bs-2',
    name: 'Semi Tissue Saree',
    price: 1150,
    compareAtPrice: 1750,
    priceDisplay: '₹1,150',
    badge: 'TRENDING',
    badgeType: 'flame',
    rating: 4.7,
    reviewsCount: '980',
    colors: ['#F59E0B', '#EC4899'],
    image: '/images/nalmara/card_semi_tissue.jpg',
    slug: 'semi-tissue-saree',
  },
  {
    _id: 'bs-3',
    name: 'Chettinadu Cotton',
    price: 798,
    compareAtPrice: 1199,
    priceDisplay: '₹798',
    badge: 'NEW ARRIVAL',
    badgeType: 'star',
    rating: 4.6,
    reviewsCount: '742',
    colors: ['#10B981', '#3B82F6'],
    image: '/images/nalmara/card_chettinadu.jpg',
    slug: 'chettinadu-cotton',
  },
  {
    _id: 'bs-4',
    name: 'Designer Saree',
    price: 1200,
    compareAtPrice: 1850,
    priceDisplay: '₹1,200',
    badge: 'TRENDING',
    badgeType: 'flame',
    rating: 4.8,
    reviewsCount: '1.1k',
    colors: ['#881337', '#14B8A6'],
    image: '/images/nalmara/card_designer.jpg',
    slug: 'designer-saree',
  },
  {
    _id: 'bs-5',
    name: 'Fancy Saree',
    price: 749,
    compareAtPrice: 1299,
    priceDisplay: '₹749',
    badge: 'POPULAR',
    badgeType: 'star',
    rating: 4.6,
    reviewsCount: '876',
    colors: ['#EC4899', '#8B5CF6'],
    image: '/images/nalmara/card_fancy_saree.jpg',
    slug: 'fancy-saree',
  },
  {
    _id: 'bs-6',
    name: 'Embroidered Saree',
    price: 1099,
    compareAtPrice: 1799,
    priceDisplay: '₹1,099',
    badge: 'LIMITED STOCK',
    badgeType: 'crown',
    rating: 4.7,
    reviewsCount: '642',
    colors: ['#C084FC', '#F43F5E'],
    image: '/images/nalmara/card_embroidered_saree.jpg',
    slug: 'embroidered-saree',
  },
];

// ==============================================================
// 09. WHY CHOOSE NALMARA FASHION (Exact Desktop Cards for Mobile)
// ==============================================================
const WHY_CHOOSE_CARDS = [
  {
    id: 1,
    title: 'Handpicked Styles',
    subtitle: 'Trendy & Traditional',
    image: '/images/nalmara/why_choose_card_1_exact.png',
  },
  {
    id: 2,
    title: 'Transparent Details',
    subtitle: 'Fabric | Length | Blouse | Care',
    image: '/images/nalmara/why_choose_card_2_exact.png',
  },
  {
    id: 3,
    title: 'Personal Support',
    subtitle: "We're here to help",
    image: '/images/nalmara/why_choose_card_3_exact.png',
  },
  {
    id: 4,
    title: 'Small Business',
    subtitle: 'With a Big Dream',
    image: '/images/nalmara/why_choose_card_4_exact.png',
  },
];

// ==============================================================
// 10. STYLE INSPIRATION (Exact Reference Mockup 6 items)
// ==============================================================
const STYLE_INSPIRATION_ITEMS = [
  {
    id: 'ig-post-1',
    title: 'Royal Kanchivaram Silk',
    subtitle: 'Grace in Every Drape',
    caption: 'Handpicked bridal magenta & gold zari Kanchivaram silk drape for timeless celebrations ✨ #nalmarafashion',
    image: '/images/nalmara/card_kanchivaram.jpg',
    cardImage: '/images/nalmara/style_inspire_card_1_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=sarees',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '1.4k',
    isReel: true,
    postedAgo: 'Recent Reel',
    left: '4.68%',
    width: '14.06%',
  },
  {
    id: 'ig-post-2',
    title: 'Traditional Heritage Wear',
    subtitle: 'Timeless Zari Weaves',
    caption: 'Rich maroon heirloom silk saree woven with intricate temple borders & pure zari work 👑 #nalmarafashion',
    image: '/images/nalmara/hero_maroon_saree.jpg',
    cardImage: '/images/nalmara/style_inspire_card_2_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=semi-kanchivaram',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '982',
    isReel: false,
    postedAgo: 'Recent Post',
    left: '20.23%',
    width: '14.06%',
  },
  {
    id: 'ig-post-3',
    title: 'Kids Festive Couture',
    subtitle: 'Little Smiles, Big Joy',
    caption: 'Playful sunshine yellow butterfly gown & festive pattu wear crafted with feather-soft comfort 💛 #nalmarafashion',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    cardImage: '/images/nalmara/style_inspire_card_3_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=kids-wear',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '1.8k',
    isReel: true,
    postedAgo: 'Recent Reel',
    left: '35.78%',
    width: '14.06%',
  },
  {
    id: 'ig-post-4',
    title: 'Signature Royal Unboxing',
    subtitle: 'Luxury in Every Thread',
    caption: 'Every NALMARA saree arrives in our signature royal gift box — wrapped with love & devotion 🎁 #nalmarafashion',
    image: '/images/nalmara/brand_story_box.jpg',
    cardImage: '/images/nalmara/style_inspire_card_4_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '2.1k',
    isReel: true,
    postedAgo: 'Pinned Reel',
    left: '51.33%',
    width: '14.06%',
  },
  {
    id: 'ig-post-5',
    title: 'Pastel Shimmer Party Wear',
    subtitle: 'Real Moments, Real Us',
    caption: 'Effortless lilac organza & shimmer tissue drapes designed for evening receptions & cocktail soirées ✨ #nalmarafashion',
    image: '/images/nalmara/category_party_wear.jpg',
    cardImage: '/images/nalmara/style_inspire_card_5_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=party-wear',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '1.2k',
    isReel: true,
    postedAgo: 'Recent Reel',
    left: '66.88%',
    width: '14.06%',
  },
  {
    id: 'ig-post-6',
    title: 'Pure Handloom Cotton',
    subtitle: 'Celebrate in Style',
    caption: 'Vibrant stack of breathable Chettinad & handloom cotton sarees for everyday royal elegance 🌸 #nalmarafashion',
    image: '/images/nalmara/cotton_saree_stack.jpg',
    cardImage: '/images/nalmara/style_inspire_card_6_clean.png',
    permalink: 'https://www.instagram.com/nalmarafashion',
    shopLink: '/shop?category=cotton-sarees',
    href: 'https://www.instagram.com/nalmarafashion',
    likes: '1.5k',
    isReel: false,
    postedAgo: 'Recent Post',
    left: '82.42%',
    width: '14.06%',
  },
];

const INSTAGRAM_POSTS_DATA = STYLE_INSPIRATION_ITEMS;

// ==============================================================
// 12. CUSTOMER REVIEWS DATA
// ==============================================================
const CUSTOMER_REVIEWS_DATA = [
  {
    id: 1,
    name: 'Priya S.',
    location: 'Chennai',
    tag: 'Signature Silk Saree',
    quote: 'Product quality was superb. Loved entire packaging!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    verified: true,
  },
  {
    id: 2,
    name: 'Meena K.',
    location: 'Coimbatore',
    tag: 'Semi Kanchivaram',
    quote: 'Beautiful collection! Extremely happy!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    verified: true,
  },
  {
    id: 3,
    name: 'Divya R.',
    location: 'Bengaluru',
    tag: 'Festive Collection',
    quote: 'Great customer support! Fast delivery.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    verified: true,
  },
];

// ==============================================================
// 13. FREQUENTLY ASKED QUESTIONS
// ==============================================================
const FAQ_ITEMS = [
  {
    id: 1,
    category: 'Fabric & Length',
    summary: '6.3m Total • With Unstitched Blouse',
    question: 'What is the fabric and saree length?',
    answer:
      'All our sarees measure a full 6.3 meters in total length, including an unstitched 0.8 meter matching blouse piece. Each drape is crafted from authentic semi-kanchivaram silk, pure cotton, art silk, or zari tissue weaves.',
    highlight: '100% Authentic Loom Quality',
  },
  {
    id: 2,
    category: 'Order Tracking',
    summary: 'Instant SMS & WhatsApp Updates',
    question: 'How can I track my order?',
    answer:
      'As soon as your order is carefully packed and dispatched, you receive an instant SMS and WhatsApp notification with your live tracking link. You can also monitor real-time status from your My Orders page.',
    highlight: '24–48 Hr Express Dispatch',
  },
  {
    id: 3,
    category: 'Shipping Charges',
    summary: 'Complimentary Above ₹1,999',
    question: 'What are the shipping charges?',
    answer:
      'Enjoy complimentary insured shipping across India on all orders above ₹1,999. For orders below ₹1,999, a nominal flat delivery charge of ₹79 is applied transparently at checkout.',
    highlight: 'Pan-India Insured Delivery',
  },
  {
    id: 4,
    category: 'Saree Care',
    summary: 'Dry Clean & Heritage Preservation',
    question: 'How should I wash my saree?',
    answer:
      'To preserve the rich zari lustre of silk, semi-kanchivaram, and tissue sarees, we recommend professional dry cleaning. Pure cotton sarees may be gently hand-washed separately in cold water.',
    highlight: 'Long-Lasting Zari Brilliance',
  },
];

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  // Live dynamic API state (strictly from backend API, no static fallback data)
  const [categories, setCategories] = useState<any[]>([]);

  // Section 04: Shop by Category Auto-Slide State ("auto slice on")
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isCategoryPaused, setIsCategoryPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (isCategoryPaused || !categories || categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isCategoryPaused, categories]);

  const handlePrevCategory = () => {
    if (!categories || categories.length === 0) return;
    setActiveCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleNextCategory = () => {
    if (!categories || categories.length === 0) return;
    setActiveCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<any[]>(INSTAGRAM_POSTS_DATA);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  const bestsellersContainerRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Fetch recent 6 Instagram posts from @nalmarafashion via /api/instagram
  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setInstagramPosts(data.posts.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live Categories and Products directly from the API
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setIsLoadingApi(true);

        const [catRes, prodRes] = await Promise.all([
          api.get('/categories').catch(() => null),
          api.get('/products?limit=100&isActive=true').catch(() => null),
        ]);

        // 1. Live Categories from Backend API
        if (catRes?.data?.success && Array.isArray(catRes.data.data)) {
          const liveCats = catRes.data.data
            .filter((c: any) => c.isActive !== false)
            .map((c: any) => ({
              _id: c._id,
              id: c._id || c.slug,
              name: c.name,
              title: c.name,
              subtitle: c.description || 'Royal Heritage Collection',
              image: c.image || '/images/nalmara/category_sarees_stack.jpg',
              link: `/shop?category=${c.slug}`,
              slug: c.slug,
            }));
          setCategories(liveCats);
        }

        // 2. Live Products from Backend API
        if (prodRes?.data?.success && Array.isArray(prodRes.data.data)) {
          const liveList = prodRes.data.data;

          const mapApiProduct = (p: any) => {
            const mainImg =
              p.images?.find((img: any) => img.isMain)?.url ||
              p.images?.[0]?.url ||
              '/images/nalmara/category_semi_kanchivaram.jpg';
            const variantColors = Array.isArray(p.variants)
              ? Array.from(
                  new Set(
                    p.variants
                      .map((v: any) => v.attributes?.colorHex)
                      .filter(Boolean)
                  )
                )
              : [];
            const catName =
              p.category && typeof p.category === 'object'
                ? p.category.name
                : 'Handpicked';

            return {
              ...p,
              _id: p._id,
              id: p._id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              priceDisplay: formatCurrency(p.price),
              image: mainImg,
              images: p.images || [{ url: mainImg, isMain: true }],
              rating: p.rating || 4.9,
              reviewsCount: p.reviewCount ?? 0,
              colors: variantColors,
              categoryName: catName,
              badge: p.bestSeller
                ? 'BESTSELLER'
                : p.featured
                ? 'FEATURED'
                : p.newArrival
                ? 'NEW ARRIVAL'
                : 'TRENDING',
              badgeType: p.bestSeller ? 'crown' : p.featured ? 'star' : 'flame',
            };
          };

          const mappedProducts = liveList.map(mapApiProduct);

          // New Arrivals: ONLY products marked newArrival=true, maximum 5 products
          const onlyNewArrivals = mappedProducts
            .filter((p: any) => Boolean(p.newArrival))
            .slice(0, 5);
          setNewArrivals(onlyNewArrivals);

          // Bestsellers: ONLY products marked bestSeller=true, maximum 6 products
          const onlyBestsellers = mappedProducts
            .filter((p: any) => Boolean(p.bestSeller))
            .slice(0, 6);
          setBestsellers(onlyBestsellers);
        }
      } catch (err) {
        console.error('Failed to load API catalog:', err);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchApiData();
  }, []);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Auto advance hero banner (pauses on hover)
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const img = product.images?.[0]?.url || product.image || '/images/bestsellers/traditional_silk_saree.jpg';
    addItem({
      productId: String(product._id || product.id),
      name: product.name,
      image: img,
      price: product.price,
      sku: product.sku || `SKU-${product._id || product.id}`,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const img = product.images?.[0]?.url || product.image || '/images/bestsellers/traditional_silk_saree.jpg';
    const formatted = {
      _id: product._id || product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ url: img, isMain: true }],
      rating: product.rating || 5,
      reviewCount: product.reviewCount || product.numReviews || 0,
      sku: product.sku || `SKU-${product._id || product.id}`,
      stock: product.stock ?? 50,
      isActive: true,
      category: product.category || 'sarees',
      variants: product.variants || [],
      tags: product.tags || [],
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
    } as unknown as Product;

    toggleWishlist(formatted);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      toast.success('Thank you for subscribing to NALMARA FASHION!');
      setEmailInput('');
    }
  };

  const scrollBestsellers = (direction: 'left' | 'right') => {
    if (bestsellersContainerRef.current) {
      const scrollAmount = 320;
      bestsellersContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const slide = HERO_SLIDES[currentHeroSlide];

  return (
    <div className="bg-[#FAF7F2] text-zinc-900 selection:bg-[#180306] selection:text-[#FFE59E] w-full max-w-full overflow-x-hidden font-sans">
      {/* ============================================================== */}
      {/* 02. HERO BANNER SECTION (Ultra-Premium Maharani Couture Stage)  */}
      {/* ============================================================== */}
      <section
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        className="relative w-full max-w-full overflow-hidden border-b-2 border-[#D4AF37] bg-[#1A0307]"
      >
        <div className="relative w-full lg:min-h-[690px] xl:min-h-[730px] flex items-center">
          {/* Rich Imperial Crimson-Velvet & Golden Palace Illumination Backdrop */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.fullWidthImage || slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover object-center opacity-35 sm:opacity-40 scale-105 transition-all duration-1000 select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#180206]/96 via-[#28050C]/90 to-[#160205]/82 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,229,158,0.26),transparent_58%)] lg:bg-[radial-gradient(circle_at_70%_45%,rgba(212,175,55,0.32),transparent_56%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(138,20,38,0.38),transparent_50%)] pointer-events-none" />

            {/* Ornate 24K Gold Palace Mandala / Jharokha Filigree Watermark */}
            <svg
              viewBox="0 0 600 600"
              fill="none"
              className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[640px] h-[640px] text-[#D4AF37] opacity-[0.11] pointer-events-none select-none"
            >
              <circle cx="300" cy="300" r="280" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="300" cy="300" r="245" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
              <path
                d="M300 20 L330 90 L400 60 L380 130 L450 130 L400 190 L460 220 L390 260 L440 300 L390 340 L460 380 L400 410 L450 470 L380 470 L400 540 L330 510 L300 580 L270 510 L200 540 L220 470 L150 470 L200 410 L140 380 L210 340 L160 300 L210 260 L140 220 L200 190 L150 130 L220 130 L200 60 L270 90 Z"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Outer Royal Architectural Double Gold Frame & 4 Corner Brackets */}
          <div className="absolute inset-2.5 sm:inset-3.5 lg:inset-5 border border-[#D4AF37]/45 rounded-2xl sm:rounded-3xl pointer-events-none z-10" />
          <div className="hidden sm:block absolute inset-4 lg:inset-6.5 border border-[#FFE59E]/15 rounded-xl sm:rounded-2xl pointer-events-none z-10" />

          {/* Top-Center Royal Atelier Crest Embedded in the Gold Frame */}
          <div className="hidden md:flex absolute top-2.5 lg:top-3 left-1/2 -translate-x-1/2 z-20 items-center gap-2.5 px-5 py-1 rounded-full bg-[#1A0307] border border-[#D4AF37]/80 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
            <span className="font-serif text-[9px] font-bold tracking-[0.28em] uppercase text-[#FFE59E]">
              The House of Nalmara • Royal Handloom & Bridal Atelier
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
          </div>

          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 lg:top-7 lg:left-7 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none z-10" />
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 lg:top-7 lg:right-7 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none z-10" />
          <div className="absolute bottom-7 left-4 sm:bottom-9 sm:left-5 lg:bottom-11 lg:left-7 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none z-10" />
          <div className="absolute bottom-7 right-4 sm:bottom-9 sm:right-5 lg:bottom-11 lg:right-7 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none z-10" />

          {/* Top-Left Botanical Gold Filigree Watermark */}
          <div className="hidden sm:block absolute top-6 left-6 pointer-events-none opacity-35 select-none z-10">
            <BotanicalBranch className="w-40 h-40 text-[#FFE59E]" />
          </div>

          {/* Main 12-Column Ultra-Premium Couture Stage */}
          <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 pt-7 pb-11 sm:pt-11 sm:pb-14 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-center">
              {/* ============================================================ */}
              {/* RIGHT 6 COLUMNS: SCULPTED ROYAL ARCH + IVORY-GOLD ATELIER    */}
              {/* ============================================================ */}
              <div className="order-1 lg:order-2 lg:col-span-6 relative pt-2 pb-2 sm:py-0">
                {/* Ambient 24K Gold Spotlight Halo */}
                <div className="absolute -inset-5 rounded-[44px] bg-gradient-to-tr from-[#D4AF37]/25 via-[#FFE59E]/20 to-transparent blur-2xl pointer-events-none" />

                <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch max-w-[345px] sm:max-w-none mx-auto">
                  {/* CENTERPIECE (7 Cols on Tablet/Desktop): Sculpted Grand Royal Crown Arch */}
                  <div className="sm:col-span-7 relative">
                    {/* Outer Decorative Arch Hairline Ring */}
                    <div className="absolute -inset-1.5 rounded-t-[190px] sm:rounded-t-[220px] rounded-b-[28px] border border-[#D4AF37]/55 pointer-events-none" />

                    {/* 3-Layer 24K Metallic Gold Arch Bezel */}
                    <div className="relative p-[3px] rounded-t-[184px] sm:rounded-t-[214px] rounded-b-[26px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#7A5411] shadow-[0_26px_65px_rgba(0,0,0,0.8)] group">
                      {/* Top-Center Royal Crown Medallion */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#2B050B] via-[#180306] to-[#2B050B] border-2 border-[#FFE59E] shadow-[0_8px_20px_rgba(0,0,0,0.7)] whitespace-nowrap">
                        <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E]" />
                        <span className="font-serif font-bold text-[8.5px] sm:text-[9px] tracking-[0.24em] text-[#FFE59E] uppercase">
                          Nalmara Couture
                        </span>
                      </div>

                      <div className="relative h-[340px] sm:h-[465px] lg:h-[505px] w-full rounded-t-[180px] sm:rounded-t-[210px] rounded-b-[23px] overflow-hidden bg-[#180306]">
                        {/* Inner Gold Filigree Arch Line */}
                        <div className="absolute inset-2.5 rounded-t-[172px] sm:rounded-t-[200px] rounded-b-[18px] border border-[#FFE59E]/55 pointer-events-none z-10" />

                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          priority
                          className="object-cover object-[center_12%] transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Top-Right Pure Zari Foil Seal */}
                        <div className="absolute top-6 right-3.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FFF5CC] via-[#FFE59E] to-[#D4AF37] text-[#180306] border border-white/80 shadow-lg">
                          <Gem className="w-3 h-3" />
                          <span className="font-serif font-bold text-[8px] tracking-[0.16em] uppercase">
                            Pure Zari
                          </span>
                        </div>

                        {/* Mobile-Only Floating Zari Detail Inset */}
                        <div className="sm:hidden absolute left-3 bottom-24 z-20 w-20 p-1 rounded-xl bg-gradient-to-b from-[#FFF3C4] via-[#D4AF37] to-[#8C6518] shadow-xl">
                          <div className="relative h-22 w-full rounded-lg overflow-hidden bg-[#180306]">
                            <Image
                              src={slide.detailImage || slide.image}
                              alt={slide.lookTitle || slide.title}
                              fill
                              className="object-cover object-top"
                            />
                            <div className="absolute inset-x-0 bottom-0 py-0.5 bg-[#120204]/90 text-center">
                              <span className="block font-serif font-bold text-[6.5px] tracking-[0.14em] uppercase text-[#FFE59E]">
                                Zari Weave
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Gradient & Royal Ivory-Trimmed Featured Look Bar */}
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#120204] via-[#120204]/70 to-transparent pointer-events-none" />

                        <Link
                          href={slide.primaryLink}
                          className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#1E0308]/95 via-[#2D070F]/95 to-[#1E0308]/95 backdrop-blur-md border-2 border-[#D4AF37] hover:border-[#FFE59E] shadow-[0_14px_34px_rgba(0,0,0,0.75)] transition-all"
                        >
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-serif font-bold text-[8px] sm:text-[8.5px] tracking-[0.2em] uppercase text-[#FFE59E]">
                                Featured Runway Look
                              </span>
                            </div>
                            <h3 className="font-serif text-xs sm:text-[15px] font-bold text-[#FFFDF9] truncate mt-0.5">
                              {slide.lookTitle || slide.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] sm:text-xs font-serif font-bold text-[#FFE59E]">
                                Starting at <span className="text-white">{slide.startingPrice || '₹2,499'}</span>
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FFE59E] hidden xl:inline-block">
                                6.3m + Blouse
                              </span>
                            </div>
                          </div>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#FFF5CC] via-[#FFE59E] to-[#D4AF37] text-[#180306] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_4px_14px_rgba(212,175,55,0.5)]">
                            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT STACK (5 Cols on Tablet/Desktop): Zari Macro Card + Royal Ivory Certificate */}
                  <div className="hidden sm:flex sm:col-span-5 flex-col gap-4 h-[465px] lg:h-[505px]">
                    {/* TOP CARD: Sculpted Zari Macro Weave Showcase with Metallic Swatches */}
                    <Link
                      href={slide.primaryLink}
                      className="relative flex-1 rounded-[26px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#7A5411] shadow-[0_20px_45px_rgba(0,0,0,0.7)] group overflow-hidden"
                    >
                      <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#180306]">
                        <div className="absolute inset-2 rounded-[18px] border border-[#FFE59E]/45 pointer-events-none z-10" />
                        <Image
                          src={slide.detailImage || slide.image}
                          alt={slide.craftTitle || 'Zari Weave Detail'}
                          fill
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140205]/95 via-[#140205]/30 to-transparent" />

                        {/* Top Bar: Macro Weave Badge + 3 Zari Thread Metallic Swatches */}
                        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#180306]/90 backdrop-blur-md border border-[#D4AF37]">
                            <Sparkles className="w-2.5 h-2.5 text-[#FFE59E]" />
                            <span className="font-serif font-bold text-[8px] tracking-[0.18em] uppercase text-[#FFE59E]">
                              Close-Up Weave
                            </span>
                          </div>
                          <div className="flex items-center -space-x-1">
                            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFF6D6] to-[#D4AF37] border border-[#180306] shadow-xs" title="24K Gold Zari" />
                            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#F3C68F] to-[#B87333] border border-[#180306] shadow-xs" title="Antique Copper Zari" />
                            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#F5F5F5] to-[#B8B8B8] border border-[#180306] shadow-xs" title="Silver Tissue" />
                          </div>
                        </div>

                        <div className="absolute inset-x-3.5 bottom-3.5 z-20 text-left">
                          <span className="text-[8.5px] font-serif font-bold tracking-[0.18em] uppercase text-[#D4AF37] block">
                            Master Loom Craft
                          </span>
                          <p className="font-serif font-bold text-xs lg:text-sm text-[#FFFDF9] leading-snug mt-0.5">
                            {slide.craftTitle || '24K-Finish Temple Zari'}
                          </p>
                          <p className="text-[10px] text-[#FFE59E]/90 mt-0.5">
                            {slide.craftSub || '6.3m Saree + Unstitched Blouse'}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* BOTTOM CARD: Luminous Royal Ivory & 24K Gold "Atelier Authenticity Certificate" */}
                    <div className="relative rounded-[26px] p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C6518] shadow-[0_20px_45px_rgba(0,0,0,0.75)]">
                      <div className="relative rounded-[24px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF2E1] to-[#F1DFBA] p-4 lg:p-5 overflow-hidden text-left">
                        {/* Inner Royal Gold Certificate Hairline */}
                        <div className="absolute inset-1.5 rounded-[19px] border border-[#B8860B]/45 pointer-events-none" />
                        <div className="absolute -right-5 -bottom-5 opacity-15 pointer-events-none">
                          <LotusIcon className="w-24 h-24 text-[#8C6518]" />
                        </div>

                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#180306] text-[#FFE59E] border border-[#D4AF37] font-serif font-bold text-[7.5px] tracking-[0.18em] uppercase">
                              <Crown className="w-2.5 h-2.5 text-[#D4AF37]" />
                              {slide.bentoKicker || 'DIRECT LOOM ARCHIVE'}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFE59E] to-[#B8860B] text-[#180306] flex items-center justify-center font-serif font-bold text-[9px] shadow-xs">
                              ✓
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-sm lg:text-[16px] text-[#180306] leading-snug">
                            {slide.bentoHeadline || 'Pure Heritage Silk Weaves'}
                          </h4>

                          <p className="text-[10.5px] text-[#4A2511] font-medium leading-relaxed">
                            {slide.bentoOffer || 'Complimentary Royal Gift Box & Insured Pan-India Delivery'}
                          </p>

                          <div className="pt-2 border-t border-[#B8860B]/30 flex items-center justify-between text-[9.5px] font-serif font-bold uppercase tracking-[0.14em]">
                            <span className="text-emerald-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              100% Loom Verified
                            </span>
                            <Link
                              href="/shop"
                              className="text-[#180306] hover:text-[#6B1220] inline-flex items-center gap-1 underline decoration-[#D4AF37]"
                            >
                              Explore Archive <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* LEFT 6 COLUMNS: ROYAL COUTURE MANIFESTO & LOOKBOOK DOCK      */}
              {/* ============================================================ */}
              <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
                {/* Top Status Row: Gold-Foil Edition Kicker + Customer Avatar Social Proof */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <div className="inline-flex items-center gap-2 p-1 pr-3.5 rounded-full bg-[#2B050B]/95 border border-[#D4AF37] shadow-[0_6px_18px_rgba(0,0,0,0.45)] max-w-full">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-[#FFF5CC] via-[#FFE59E] to-[#D4AF37] text-[#180306] font-serif font-bold text-[9px] sm:text-[10px] tracking-[0.18em] uppercase shrink-0">
                      <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      EDITION {slide.edition || `0${currentHeroSlide + 1}`}
                    </span>
                    <span className="font-serif font-bold text-[9.5px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#FFE59E] truncate">
                      {slide.tag}
                    </span>
                    <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
                  </div>

                  {/* Desktop/Tablet Overlapping Bride Avatars + 4.9/5 Rating Pill */}
                  <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240409]/90 border border-[#D4AF37]/55 text-[11px] shadow-sm">
                    <div className="flex -space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#FFE59E] text-[#180306] font-serif font-bold text-[8px] flex items-center justify-center border border-[#180306]">
                        P
                      </span>
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#180306] font-serif font-bold text-[8px] flex items-center justify-center border border-[#180306]">
                        M
                      </span>
                      <span className="w-4 h-4 rounded-full bg-[#FFF5CC] text-[#180306] font-serif font-bold text-[8px] flex items-center justify-center border border-[#180306]">
                        D
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#FFE59E]">
                      <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                      <span className="font-serif font-bold">4.9/5</span>
                    </div>
                    <span className="text-[#EADBC0] text-[10px]">2.4k+ Happy Brides</span>
                  </div>
                </div>

                {/* Monumental Dual-Typography Headline with 24K Gold Foil Glow */}
                <div className="space-y-2">
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-bold leading-[1.04] tracking-tight text-[#FFFDF9] drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)]">
                    {slide.title.includes(' ') ? (
                      <>
                        <span className="inline lg:block mr-2 lg:mr-0">{slide.title.split(' ')[0]}</span>
                        <span className="inline lg:block font-script text-4xl sm:text-6xl lg:text-[70px] xl:text-[80px] font-normal italic lg:mt-1 bg-gradient-to-r from-[#FFF8DC] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_4px_22px_rgba(212,175,55,0.35)]">
                          {slide.title.split(' ').slice(1).join(' ')}
                        </span>
                      </>
                    ) : (
                      slide.title
                    )}
                  </h1>

                  {/* Gold Filigree Accent Line & Subtitle */}
                  <div className="flex items-center justify-center lg:justify-start gap-2.5 pt-0.5">
                    <span className="hidden sm:block h-[1.5px] w-12 bg-gradient-to-r from-[#FFE59E] via-[#D4AF37] to-transparent" />
                    <LotusIcon className="w-4 h-4 text-[#FFE59E] shrink-0" />
                    <span className="text-xs sm:text-sm lg:text-[16px] font-serif italic font-semibold tracking-wide text-[#FFE59E]">
                      {slide.subtitle}
                    </span>
                  </div>
                </div>

                {/* Gold-Bordered Editorial Manifesto Description */}
                <div className="lg:border-l-2 lg:border-[#D4AF37]/80 lg:pl-4 max-w-xl mx-auto lg:mx-0">
                  <p className="text-xs sm:text-sm lg:text-[15px] leading-relaxed text-[#F7EFE4]/95 font-normal line-clamp-2 sm:line-clamp-none">
                    {slide.description}
                  </p>
                </div>

                {/* Jewellery-Grade Couture Feature Medallion Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
                  {(slide.highlights || ['Pure Zari Weave', 'Handpicked Silk', 'Pan-India Express']).map(
                    (feat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#2D060D] to-[#1D0308] border border-[#D4AF37]/65 text-[10px] sm:text-[11px] font-serif font-semibold text-[#FFE59E] shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#FFE59E]" />
                        {feat}
                      </span>
                    )
                  )}
                </div>

                {/* Luxury 3D Gold Foil Primary CTA + Royal Velvet Secondary CTA */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1.5 max-w-md sm:max-w-none mx-auto lg:mx-0">
                  <Link
                    href={slide.primaryLink}
                    className="inline-flex items-center justify-center gap-2.5 sm:gap-3 pl-4 pr-3 sm:pl-7 sm:pr-4 py-2.5 sm:py-3 rounded-full text-[10.5px] sm:text-xs lg:text-sm font-serif font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] hover:from-[#FFFDF9] hover:to-[#E5C158] text-[#180306] border-2 border-[#FFFDF9] shadow-[0_12px_32px_rgba(212,175,55,0.42)] transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer whitespace-nowrap"
                  >
                    <span>{slide.primaryText}</span>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#180306] text-[#FFE59E] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                  </Link>

                  <Link
                    href={slide.secondaryLink}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 rounded-full text-[10.5px] sm:text-xs lg:text-sm font-serif font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase bg-[#26040A]/90 hover:bg-[#FFE59E] text-[#FFE59E] hover:text-[#180306] border-2 border-[#D4AF37]/85 transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    <span>{slide.secondaryText}</span>
                  </Link>
                </div>

                {/* MOBILE BOTTOM BAR: Clean Inline Rating + Numbered Slide Pills */}
                <div className="flex sm:hidden items-center justify-between gap-2 pt-2.5 mt-1 border-t border-[#D4AF37]/25 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-1.5 text-[11px]">
                    <div className="flex items-center gap-0.5 text-[#D4AF37]">
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                    </div>
                    <span className="font-serif font-bold text-[#FFE59E]">4.9/5</span>
                    <span className="text-[10px] text-[#E8D5B0]">(2.4k+)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {HERO_SLIDES.map((item, idx) => {
                      const isActive = currentHeroSlide === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentHeroSlide(idx)}
                          className={`inline-flex items-center gap-1.5 p-1 pr-2.5 rounded-full font-serif font-bold text-[10px] tracking-wider transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#FFE59E] to-[#D4AF37] text-[#180306] shadow-[0_4px_14px_rgba(212,175,55,0.4)] scale-105'
                              : 'bg-[#26040A] text-[#FFE59E]/80 border border-[#D4AF37]/45'
                          }`}
                        >
                          <span className="relative w-5 h-5 rounded-full overflow-hidden border border-[#180306]/40 shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover object-top" />
                          </span>
                          <span>0{idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TABLET & DESKTOP: Interactive 3-Slide Couture Lookbook Switcher Dock */}
                <div className="hidden sm:block pt-2">
                  <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
                    {HERO_SLIDES.map((item, idx) => {
                      const isActive = currentHeroSlide === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentHeroSlide(idx)}
                          className={`group relative flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-[#3D0812] via-[#2B050B] to-[#1E0308] border-2 border-[#FFE59E] shadow-[0_10px_28px_rgba(212,175,55,0.28)] scale-[1.02]'
                              : 'bg-[#1D0308]/80 hover:bg-[#2B050B]/90 border border-[#D4AF37]/35 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37] shrink-0">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] font-serif font-bold tracking-[0.18em] uppercase text-[#FFE59E]">
                                Edition 0{idx + 1}
                              </span>
                              <span className="text-[8.5px] font-serif text-[#D4AF37] font-semibold">
                                {item.startingPrice}
                              </span>
                            </div>
                            <span className="block font-serif text-xs font-bold text-[#FFFDF9] truncate mt-0.5">
                              {item.title}
                            </span>
                          </div>
                          {isActive && (
                            <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#FFF6D6] via-[#D4AF37] to-[#FFF6D6]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Left / Right Royal Arrows */}
          <button
            onClick={prevHeroSlide}
            className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#180306]/90 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#180306] items-center justify-center transition-all duration-300 border-2 border-[#D4AF37] shadow-lg hover:scale-110 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#180306]/90 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#180306] items-center justify-center transition-all duration-300 border-2 border-[#D4AF37] shadow-lg hover:scale-110 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 03. TRUST BADGES / VALUE PROPOSITIONS BAR (Royal Couture Bar)  */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 -mt-6 sm:-mt-7 relative z-20">
        <div className="relative bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E6] to-[#FFFDF9] rounded-2xl sm:rounded-3xl border-2 border-[#C8A251] shadow-[0_18px_48px_rgba(24,3,6,0.16)] p-4 sm:p-5 overflow-hidden">
          {/* Inner hairline gold border */}
          <div className="absolute inset-1.5 border border-[#D4AF37]/45 rounded-xl sm:rounded-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/40">
            {/* 1. Carefully Packed (2 Lines Only) */}
            <div className="p-2 sm:px-4 flex items-center gap-3 sm:gap-3.5 group min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#3D0811] to-[#180306] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] group-hover:scale-110 transition-transform shadow-md shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="font-serif text-xs sm:text-[15px] font-bold text-[#180306] leading-tight truncate">
                  Carefully Packed
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A4235] font-serif italic font-medium leading-tight truncate">
                  with Love &amp; Care
                </p>
              </div>
            </div>

            {/* 2. Premium Quality (2 Lines Only) */}
            <div className="p-2 sm:px-4 flex items-center gap-3 sm:gap-3.5 group min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#3D0811] to-[#180306] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] group-hover:scale-110 transition-transform shadow-md shrink-0">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="font-serif text-xs sm:text-[15px] font-bold text-[#180306] leading-tight truncate">
                  Premium Quality
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A4235] font-serif italic font-medium leading-tight truncate">
                  Handpicked Fabrics
                </p>
              </div>
            </div>

            {/* 3. Easy Returns (2 Lines Only) */}
            <div className="p-2 sm:px-4 flex items-center gap-3 sm:gap-3.5 group pt-3 sm:pt-3 md:pt-2 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#3D0811] to-[#180306] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] group-hover:scale-110 transition-transform shadow-md shrink-0">
                <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="font-serif text-xs sm:text-[15px] font-bold text-[#180306] leading-tight truncate">
                  Easy Returns
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5A4235] font-serif italic font-medium leading-tight truncate">
                  &amp; Quick Exchanges
                </p>
              </div>
            </div>

            {/* 4. WhatsApp Support (2 Lines Only) */}
            <div className="p-2 sm:px-4 flex items-center gap-3 sm:gap-3.5 group pt-3 sm:pt-3 md:pt-2 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#3D0811] to-[#180306] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFE59E] group-hover:scale-110 transition-transform shadow-md shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="font-serif text-xs sm:text-[15px] font-bold text-[#180306] leading-tight truncate">
                  WhatsApp Support
                </h4>
                <p className="text-[11px] sm:text-xs text-[#180306] font-bold leading-tight truncate">
                  6383163609  |  7871207631
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 04. SHOP BY CATEGORY (Imperial Royal Medallion Edition)        */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-5 sm:py-7">
        {/* Top Subtle 24K Gold Filigree Hairline */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent mb-5 sm:mb-6" />

        {/* ========================================================================= */}
        {/* DESKTOP VIEW: Clean Seamless Royal Medallion Carousel (hidden md:block)   */}
        {/* ========================================================================= */}
        <div
          className="hidden md:block relative w-full select-none group/sec"
          onMouseEnter={() => setIsCategoryPaused(true)}
          onMouseLeave={() => setIsCategoryPaused(false)}
        >
          <div className="relative z-20 flex flex-col gap-5 px-2 lg:px-6">
            {/* Top Editorial Header */}
            <div className="relative flex flex-col items-center text-center">
              {/* Imperial Royal Wine & Gold Micro-Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180306] border border-[#D4AF37]/80 shadow-[0_4px_14px_rgba(24,3,6,0.16)] mb-1.5">
                <LotusIcon className="w-3 h-3 text-[#FFE59E]" />
                <span className="text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.26em] text-[#FFE59E]">
                  Curated Atelier Collections
                </span>
                <LotusIcon className="w-3 h-3 text-[#FFE59E]" />
              </div>

              {/* Title & View All CTA Row */}
              <div className="relative w-full flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <span className="hidden lg:block h-[1px] w-14 bg-gradient-to-r from-transparent to-[#C8A251]" />
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] font-bold text-[#180306] tracking-tight leading-none">
                    Shop by{' '}
                    <span className="font-script text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#6B0D1A] italic ml-1 drop-shadow-2xs">
                      Category
                    </span>
                  </h2>
                  <span className="hidden lg:block h-[1px] w-14 bg-gradient-to-l from-transparent to-[#C8A251]" />
                </div>

                {/* Top Right "Explore All →" Royal Wine & Gold Pill Button */}
                <Link
                  href="/shop"
                  title="Explore All Categories"
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-[#180306] hover:bg-[#3A0810] border border-[#D4AF37] text-[11px] font-serif font-bold uppercase tracking-[0.16em] text-[#FFE59E] transition-all duration-300 shadow-[0_6px_18px_rgba(24,3,6,0.2)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Explore All</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C158] transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <p className="text-xs font-serif italic text-[#5C4A32] tracking-wider mt-0.5">
                Handpicked heritage weaves &amp; celebration silhouettes for every occasion
              </p>
            </div>

            {/* Center Carousel Track with 5 Royal Halo Medallion Cards */}
            <div className="relative w-full px-11 lg:px-14 py-1">
              {/* Left Royal Wine & Gold Carousel Arrow (<) */}
              <button
                onClick={handlePrevCategory}
                className="absolute left-0 top-[42%] -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-[#D4AF37] bg-[#180306] text-[#FFE59E] shadow-[0_8px_22px_rgba(24,3,6,0.28)] hover:bg-[#D4AF37] hover:text-[#180306] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Previous Category"
                title="Previous Category"
              >
                <ChevronLeft className="w-5 h-5 text-current" />
              </button>

              {/* Right Royal Wine & Gold Carousel Arrow (>) */}
              <button
                onClick={handleNextCategory}
                className="absolute right-0 top-[42%] -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-[#D4AF37] bg-[#180306] text-[#FFE59E] shadow-[0_8px_22px_rgba(24,3,6,0.28)] hover:bg-[#D4AF37] hover:text-[#180306] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Next Category"
                title="Next Category"
              >
                <ChevronRight className="w-5 h-5 text-current" />
              </button>

              {/* 5-Card Grid Track (Live API Categories) */}
              {categories.length === 0 ? (
                <div className="grid grid-cols-5 gap-4 lg:gap-6 items-start justify-center py-2">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="flex flex-col items-center animate-pulse">
                      <div className="w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full bg-gradient-to-b from-[#FAF3E6] to-[#E8D7B8] border-2 border-[#D4AF37]/50 shadow-md" />
                      <div className="w-36 h-10 mt-3 rounded-xl bg-[#FAF3E6] border border-[#D4AF37]/40" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`grid gap-4 lg:gap-6 items-start justify-center ${
                    categories.length === 1
                      ? 'grid-cols-1 max-w-xs mx-auto'
                      : categories.length === 2
                      ? 'grid-cols-2 max-w-xl mx-auto'
                      : categories.length === 3
                      ? 'grid-cols-3 max-w-3xl mx-auto'
                      : categories.length === 4
                      ? 'grid-cols-4 max-w-4xl mx-auto'
                      : 'grid-cols-5'
                  }`}
                >
                  {Array.from({ length: Math.min(5, categories.length) }, (_, i) => i).map((offset) => {
                    const total = categories.length;
                    const catIdx = (activeCategoryIndex + offset) % total;
                    const cat = categories[catIdx];
                    if (!cat) return null;
                    const subtitle = (cat as { subtitle?: string }).subtitle || 'Royal Heritage Collection';

                    return (
                      <Link
                        key={`${cat.id || cat.slug}-${offset}`}
                        href={cat.link || `/shop?category=${cat.slug}`}
                        title={`Explore ${cat.title || cat.name}`}
                        className="group flex flex-col items-center transition-all duration-500 transform hover:-translate-y-1.5 cursor-pointer"
                      >
                        {/* Multi-Ring 24K Gold Royal Halo Medallion */}
                        <div className="relative p-2 flex items-center justify-center">
                          {/* Outer Filigree Dashed Gold Halo Ring */}
                          <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A251]/65 group-hover:border-[#D4AF37] group-hover:rotate-45 transition-all duration-700 pointer-events-none" />

                          {/* Top 12-o'clock Crown Diamond Jewel Stud */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#B8860B] border border-[#180306] shadow-2xs group-hover:scale-125 transition-transform" />

                          {/* Metallic Gold & Pearl Cushion Bezel */}
                          <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#F7EFE0] to-[#E5D1A7] border-2 border-[#C8A251] group-hover:border-[#B8860B] shadow-[0_12px_28px_rgba(24,3,6,0.15)] group-hover:shadow-[0_18px_38px_rgba(212,175,55,0.42)] transition-all duration-500">
                            {/* Portrait Circle */}
                            <div className="relative w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden bg-[#180306] ring-1 ring-[#C8A251]/50">
                              <Image
                                src={cat.image || '/images/categories/sarees.jpg'}
                                alt={cat.title || cat.name}
                                fill
                                unoptimized
                                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 select-none"
                              />
                              {/* Subtle Royal Vignette & Hover Shimmer */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#180306]/55 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                              <div className="absolute inset-x-0 bottom-5 flex justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#180306]/90 border border-[#D4AF37] text-[9px] font-serif font-bold uppercase tracking-[0.18em] text-[#FFE59E]">
                                  Explore
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Imperial Garnet & 24K Gold Medallion Icon Badge */}
                        <div className="relative z-20 -mt-5 lg:-mt-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(24,3,6,0.3)]">
                          <RoyalMedallionBadge slug={cat.slug} className="w-9 h-9 lg:w-10 lg:h-10" />
                        </div>

                        {/* Haute Couture Dual-State Royal Cartouche Plaque */}
                        <div className="relative w-full max-w-[155px] lg:max-w-[180px] mt-1.5 rounded-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF4E8] to-[#F3E9D2] group-hover:from-[#26050A] group-hover:via-[#180306] group-hover:to-[#120204] border border-[#C8A251]/85 group-hover:border-[#D4AF37] shadow-[0_6px_18px_rgba(180,140,60,0.16)] group-hover:shadow-[0_10px_25px_rgba(24,3,6,0.32)] py-2 px-2.5 text-center transition-all duration-300">
                          {/* Inner Gold Hairline Frame */}
                          <div className="absolute inset-1 rounded-lg border border-[#C8A251]/35 group-hover:border-[#D4AF37]/40 pointer-events-none" />

                          {/* Left & Right Jewel Studs */}
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 bg-[#C8A251] group-hover:bg-[#FFE59E]" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 rotate-45 bg-[#C8A251] group-hover:bg-[#FFE59E]" />

                          <span className="relative z-10 block font-serif font-bold text-xs lg:text-[14px] text-[#180306] group-hover:text-[#FFE59E] tracking-wide truncate transition-colors">
                            {cat.title || cat.name}
                          </span>
                          <span className="relative z-10 block text-[9px] lg:text-[10px] font-serif uppercase tracking-[0.16em] text-[#8C6D2D] group-hover:text-[#E5C158] truncate mt-0.5 transition-colors">
                            {subtitle}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Royal Jewel Pagination Bar */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#C8A251]/60" />
              <div className="flex items-center gap-1.5">
                {categories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategoryIndex(idx)}
                    title={`Go to ${categories[idx]?.title || 'Category'} ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeCategoryIndex === idx
                        ? 'w-6 h-2 bg-[#180306] border border-[#D4AF37] shadow-2xs'
                        : 'w-2 h-2 bg-[#D8C7AA] hover:bg-[#C8A251]'
                    }`}
                    aria-label={`Category slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#C8A251]/60" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW: Clean Compact Royal Medallion Carousel (md:hidden)           */}
        {/* ========================================================================= */}
        <div
          className="md:hidden relative w-full select-none overflow-hidden py-1"
          onTouchStart={(e) => {
            setIsCategoryPaused(true);
            touchStartXRef.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            setIsCategoryPaused(false);
            if (touchStartXRef.current !== null) {
              const diff = touchStartXRef.current - e.changedTouches[0].clientX;
              if (diff > 40) handleNextCategory();
              else if (diff < -40) handlePrevCategory();
              touchStartXRef.current = null;
            }
          }}
        >
          <div className="relative z-20 flex flex-col gap-3.5 px-2">
            {/* Top Royal Header */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#180306] border border-[#D4AF37]/80 mb-1">
                <LotusIcon className="w-2.5 h-2.5 text-[#FFE59E]" />
                <span className="text-[8px] font-serif font-bold uppercase tracking-[0.22em] text-[#FFE59E]">
                  Curated Atelier Collections
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#180306] tracking-tight leading-tight">
                Shop by{' '}
                <span className="font-script text-4xl text-[#6B0D1A] italic font-normal ml-1">
                  Category
                </span>
              </h2>

              <p className="text-[11px] font-serif italic text-[#5C4A32] mt-0.5">
                Handpicked heritage weaves for every occasion
              </p>
            </div>

            {/* 3-Card Stage with Prominent Center Active Category (Live API Categories) */}
            {categories.length === 0 ? (
              <div className="py-8 text-center text-xs font-serif text-[#5C4A32]">
                {isLoadingApi ? 'Loading collections...' : 'No collections available.'}
              </div>
            ) : (
              <div className="relative flex items-center justify-center py-1">
                {/* Left Preview Card */}
                {categories.length > 1 && (() => {
                  const total = categories.length;
                  const prevIdx = (activeCategoryIndex - 1 + total) % total;
                  const prevCat = categories[prevIdx];
                  if (!prevCat) return null;
                  return (
                    <button
                      type="button"
                      onClick={handlePrevCategory}
                      className="absolute left-[-14px] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center opacity-40 scale-75 transform hover:opacity-75 transition-all duration-500 cursor-pointer pointer-events-auto"
                      aria-label="Previous Category"
                    >
                      <div className="relative w-28 h-28 rounded-full border-2 border-[#C8A251] ring-2 ring-[#FAF5ED] shadow-md overflow-hidden bg-white">
                        <Image
                          src={prevCat.image || '/images/categories/sarees.jpg'}
                          alt={prevCat.title || prevCat.name || ''}
                          fill
                          unoptimized
                          className="object-cover object-center select-none"
                        />
                      </div>
                    </button>
                  );
                })()}

                {/* Left Royal Wine Arrow (<) */}
                <button
                  onClick={handlePrevCategory}
                  className="absolute left-1 top-[42%] -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-[#D4AF37] bg-[#180306] text-[#FFE59E] shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Previous Category"
                  title="Previous Category"
                >
                  <ChevronLeft className="w-5 h-5 text-current" />
                </button>

                {/* Center Active Category Card */}
                {(() => {
                  const currentCat = categories[activeCategoryIndex % categories.length];
                  if (!currentCat) return null;
                  const subtitle = (currentCat as { subtitle?: string }).subtitle || 'Royal Heritage Collection';

                  return (
                    <Link
                      href={currentCat.link || `/shop?category=${currentCat.slug}`}
                      title={`Explore ${currentCat.title || currentCat.name}`}
                      className="relative z-20 flex flex-col items-center transform transition-all duration-500 cursor-pointer group"
                    >
                      {/* Multi-Ring Gold Halo Medallion */}
                      <div className="relative p-2 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#C8A251]/70 pointer-events-none" />
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#B8860B] border border-[#180306]" />
                        <div className="relative p-1.5 rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#F7EFE0] to-[#E5D1A7] border-2 border-[#C8A251] shadow-[0_12px_28px_rgba(24,3,6,0.18)]">
                          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#180306]">
                            <Image
                              src={currentCat.image || '/images/categories/sarees.jpg'}
                              alt={currentCat.title || currentCat.name}
                              fill
                              unoptimized
                              priority
                              className="object-cover object-center select-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Imperial Garnet & Gold Medallion Icon Badge */}
                      <div className="relative z-30 -mt-5 group-active:scale-110 transition-transform duration-200">
                        <RoyalMedallionBadge slug={currentCat.slug} className="w-10 h-10" />
                      </div>

                      {/* Royal Cartouche Plaque */}
                      <div className="relative w-52 mt-1.5 rounded-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF4E8] to-[#F3E9D2] border border-[#C8A251] shadow-[0_6px_16px_rgba(180,140,60,0.2)] py-2 px-3 text-center">
                        <div className="absolute inset-1 rounded-lg border border-[#C8A251]/35 pointer-events-none" />
                        <span className="relative z-10 block font-serif font-bold text-sm text-[#180306] tracking-wide truncate">
                          {currentCat.title || currentCat.name}
                        </span>
                        <span className="relative z-10 block text-[9px] font-serif uppercase tracking-[0.16em] text-[#8C6D2D] truncate mt-0.5">
                          {subtitle}
                        </span>
                      </div>
                    </Link>
                  );
                })()}

                {/* Right Royal Wine Arrow (>) */}
                <button
                  onClick={handleNextCategory}
                  className="absolute right-1 top-[42%] -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-[#D4AF37] bg-[#180306] text-[#FFE59E] shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Next Category"
                  title="Next Category"
                >
                  <ChevronRight className="w-5 h-5 text-current" />
                </button>

                {/* Right Preview Card */}
                {categories.length > 1 && (() => {
                  const total = categories.length;
                  const nextIdx = (activeCategoryIndex + 1) % total;
                  const nextCat = categories[nextIdx];
                  if (!nextCat) return null;
                  return (
                    <button
                      type="button"
                      onClick={handleNextCategory}
                      className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center opacity-40 scale-75 transform hover:opacity-75 transition-all duration-500 cursor-pointer pointer-events-auto"
                      aria-label="Next Category"
                    >
                      <div className="relative w-28 h-28 rounded-full border-2 border-[#C8A251] ring-2 ring-[#FAF5ED] shadow-md overflow-hidden bg-white">
                        <Image
                          src={nextCat.image || '/images/categories/sarees.jpg'}
                          alt={nextCat.title || nextCat.name || ''}
                          fill
                          unoptimized
                          className="object-cover object-center select-none"
                        />
                      </div>
                    </button>
                  );
                })()}
              </div>
            )}

            {/* Bottom Jewel Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {categories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIndex(idx)}
                  title={`Go to ${categories[idx]?.title || 'Category'} ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'w-5 h-1.5 bg-[#180306] border border-[#D4AF37]'
                      : 'w-1.5 h-1.5 bg-[#D8C7AA] hover:bg-[#C8A251]'
                  }`}
                  aria-label={`Category slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Subtle 24K Gold Filigree Hairline */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent mt-5 sm:mt-6" />
      </section>

      {/* ============================================================== */}
      {/* 05. FESTIVE COLLECTION (Ultra-HD Royal Couture Edition)        */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 relative">
        {/* Subtle royal background atmosphere */}
        <div className="absolute left-1 top-2 pointer-events-none opacity-25 select-none hidden lg:block">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute right-1 bottom-2 pointer-events-none opacity-25 select-none hidden lg:block rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        {/* Desktop View: 3-Layer 24K Gold Bezel Panoramic Royal Banner */}
        <div className="hidden md:block relative w-full rounded-[28px] lg:rounded-[34px] p-[3px] bg-gradient-to-r from-[#B8860B] via-[#FFE59E] to-[#B8860B] shadow-[0_28px_70px_rgba(24,3,6,0.32)] group transition-all duration-500 hover:shadow-[0_32px_80px_rgba(24,3,6,0.45)] select-none">
          {/* Top-Center Floating Royal Archive Crest */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 px-5 py-1 rounded-full bg-gradient-to-r from-[#2B050B] via-[#180306] to-[#2B050B] border-2 border-[#FFE59E] shadow-[0_8px_22px_rgba(0,0,0,0.65)]">
            <Crown className="w-3.5 h-3.5 text-[#FFE59E]" />
            <span className="font-serif font-bold text-[9px] lg:text-[10px] tracking-[0.26em] uppercase text-[#FFE59E]">
              The Royal Muhurtham &amp; Festive Archive
            </span>
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          </div>

          <div className="relative w-full aspect-[1024/375] rounded-[25px] lg:rounded-[31px] overflow-hidden bg-[#170206]">
            {/* Inner Double Hairline Gold Frame */}
            <div className="absolute inset-2.5 lg:inset-3.5 border border-[#FFE59E]/45 rounded-[20px] lg:rounded-[24px] pointer-events-none z-30" />

            {/* Ornate 24K Gold Corner Brackets */}
            <div className="absolute top-4 lg:top-5 left-4 lg:left-5 w-5 h-5 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none z-30" />
            <div className="absolute top-4 lg:top-5 right-4 lg:right-5 w-5 h-5 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none z-30" />
            <div className="absolute bottom-4 lg:bottom-5 left-4 lg:left-5 w-5 h-5 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none z-30" />
            <div className="absolute bottom-4 lg:bottom-5 right-4 lg:right-5 w-5 h-5 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none z-30" />

            {/* Background High-Definition Photographic Canvas (Unobstructed Saree, Diyas & Bride) */}
            <Image
              src="/images/nalmara/festive_panoramic_hd.jpg"
              alt="NALMARA Festive Collection"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-1000 select-none z-0"
            />

            {/* Confined Left Velvet Gradient (Leaves Center Folded Saree & Right Bride 100% Crystal Clear) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#160205] via-[#210308]/92 via-35% to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.18),transparent_45%)] pointer-events-none z-10" />

            {/* Subtle Bottom Vignette for Floating Badges */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120204]/80 via-[#120204]/25 to-transparent pointer-events-none z-10" />

            {/* Corner Floral Flourish in bottom-left */}
            <div className="absolute left-3 bottom-3 pointer-events-none opacity-35 z-20 hidden lg:block">
              <BotanicalBranch className="w-24 h-24 text-[#FFE59E]" />
            </div>

            {/* Left Master Editorial Content */}
            <div className="relative z-20 h-full w-[52%] lg:w-[48%] xl:w-[45%] flex flex-col justify-center items-start text-left pl-7 sm:pl-10 lg:pl-14 py-6">
              {/* Top Brand Monogram Crest & Royal Kicker */}
              <div className="flex items-center gap-3.5 mb-2.5 lg:mb-3.5">
                {/* 3D Gold Double-Rim Circular Monogram Crest */}
                <div className="relative w-12 h-12 lg:w-15 lg:h-15 rounded-full p-[2px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C6518] shadow-[0_6px_20px_rgba(0,0,0,0.7)] shrink-0">
                  <div className="w-full h-full rounded-full border border-[#FFE59E]/50 flex flex-col items-center justify-center bg-gradient-to-b from-[#33060E] via-[#1A0207] to-[#0E0103]">
                    <Crown className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-[#FFE59E] -mb-0.5" />
                    <span className="font-serif font-black text-xs lg:text-sm tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#FFE59E] to-[#D4AF37] leading-none">
                      NM
                    </span>
                    <span className="text-[5px] lg:text-[5.5px] font-serif uppercase tracking-[0.2em] text-[#FFE59E] font-bold leading-none mt-0.5">
                      NALMARA
                    </span>
                  </div>
                </div>

                {/* Brand Name + Gold Kicker Pill */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2B050B]/95 border border-[#D4AF37]/80">
                    <Crown className="w-2.5 h-2.5 text-[#FFE59E]" />
                    <span className="text-[8.5px] lg:text-[9.5px] font-serif font-bold tracking-[0.22em] text-[#FFE59E] uppercase">
                      Traditional Elegance
                    </span>
                  </div>
                  <p className="tracking-[0.24em] text-[8px] lg:text-[9px] text-[#EADBC0] uppercase font-semibold pl-0.5">
                    NALMARA FASHION • YOUR TRADITION. YOUR ELEGANCE.
                  </p>
                </div>
              </div>

              {/* Monumental Headline: Festive Collection */}
              <h2 className="font-serif text-3xl lg:text-5xl xl:text-[54px] text-[#FFFDF9] font-bold tracking-tight leading-[1.05] mb-1.5 lg:mb-2 drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Festive{' '}
                <span className="font-script text-4xl lg:text-6xl xl:text-[66px] font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DC] via-[#FFE59E] to-[#D4AF37] italic ml-1 drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)]">
                  Collection
                </span>
              </h2>

              {/* Gold Filigree Tagline */}
              <div className="flex items-center gap-2 mb-3 lg:mb-4 border-l-2 border-[#D4AF37] pl-3">
                <p className="text-[9.5px] lg:text-[11px] font-serif uppercase tracking-[0.22em] text-[#FFE59E] font-semibold">
                  CELEBRATE TRADITION &nbsp;✦&nbsp; EMBRACE ELEGANCE
                </p>
              </div>

              {/* 4 Jewellery-Grade Feature Pills (Clean 2x2 Grid — Never Blocks the Bride!) */}
              <div className="grid grid-cols-2 gap-1.5 lg:gap-2 mb-4 lg:mb-5 max-w-md">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#26040A]/90 border border-[#D4AF37]/55 text-[#FFE59E]">
                  <LotusIcon className="w-3 h-3 text-[#FFE59E] shrink-0" />
                  <span className="text-[9px] lg:text-[10px] font-serif font-semibold tracking-wide truncate">
                    Premium Silk Sarees
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#26040A]/90 border border-[#D4AF37]/55 text-[#FFE59E]">
                  <Gem className="w-3 h-3 text-[#FFE59E] shrink-0" />
                  <span className="text-[9px] lg:text-[10px] font-serif font-semibold tracking-wide truncate">
                    Authentic Craftsmanship
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#26040A]/90 border border-[#D4AF37]/55 text-[#FFE59E]">
                  <Package className="w-3 h-3 text-[#FFE59E] shrink-0" />
                  <span className="text-[9px] lg:text-[10px] font-serif font-semibold tracking-wide truncate">
                    Insured Pan-India Ship
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#26040A]/90 border border-[#D4AF37]/55 text-[#FFE59E]">
                  <Heart className="w-3 h-3 text-[#FFE59E] shrink-0" />
                  <span className="text-[9px] lg:text-[10px] font-serif font-semibold tracking-wide truncate">
                    6.3m + Blouse Piece
                  </span>
                </div>
              </div>

              {/* 3D Liquid 24K Gold Foil CTA Button + Live Price Tag */}
              <div className="flex items-center gap-3">
                <Link
                  href="/shop?category=festive"
                  title="Explore Festive Collection"
                  className="inline-flex items-center gap-2.5 pl-6 pr-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] hover:from-[#FFFDF9] hover:to-[#E5C158] text-[#180306] border-2 border-[#FFFDF9] transition-all duration-300 text-xs lg:text-[13px] font-serif font-bold uppercase tracking-[0.16em] group/btn shadow-[0_10px_28px_rgba(212,175,55,0.42)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <span className="w-6 h-6 rounded-full bg-[#180306] text-[#FFE59E] flex items-center justify-center transition-transform duration-300 group-hover/btn:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <div className="hidden xl:flex flex-col text-left pl-2 border-l border-[#D4AF37]/40">
                  <span className="text-[8.5px] font-serif uppercase tracking-[0.18em] text-[#D4AF37] font-bold">
                    Festive Edit Starting At
                  </span>
                  <span className="font-serif text-sm font-bold text-[#FFFDF9]">
                    ₹1,999 <span className="text-[10px] text-[#FFE59E] font-normal">• Silk Mark Assured</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Couture Plaque (Tucked Neatly Without Slicing the Bride) */}
            <Link
              href="/shop?category=sarees"
              className="absolute right-6 bottom-5 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#180306]/90 backdrop-blur-md border border-[#D4AF37] hover:border-[#FFE59E] shadow-[0_12px_30px_rgba(0,0,0,0.75)] transition-all group/card"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFF6D6] to-[#D4AF37] text-[#180306] flex items-center justify-center shrink-0 shadow-sm">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-serif font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
                    Bridal &amp; Festive Silk
                  </span>
                </div>
                <p className="font-serif text-xs font-bold text-[#FFFDF9]">
                  Pure Kanchipuram Zari Weaves
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFE59E] group-hover/card:translate-x-1 transition-transform ml-1" />
            </Link>
          </div>
        </div>

        {/* Mobile View: 3-Layer 24K Gold Bezel Royal Festive Showcase */}
        <div className="md:hidden relative w-full rounded-[28px] p-[2.5px] bg-gradient-to-b from-[#FFF6D6] via-[#D4AF37] to-[#8C6518] shadow-[0_20px_50px_rgba(24,3,6,0.3)] select-none">
          <div className="relative w-full rounded-[25px] overflow-hidden bg-[#170206] p-5 text-white flex flex-col justify-between">
            {/* Background image & gradient */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/nalmara/festive_panoramic_hd.jpg"
                alt="NALMARA Festive Collection"
                fill
                priority
                unoptimized
                className="object-cover object-[75%_center] select-none opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#170206]/95 via-[#1E0308]/88 to-[#170206]/98" />
            </div>

            {/* Inner hairline gold border */}
            <div className="absolute inset-2.5 border border-[#FFE59E]/40 rounded-2xl pointer-events-none z-20" />

            {/* Top Brand Logo & Typography */}
            <div className="relative z-10 flex flex-col items-center text-center pt-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2B050B] border border-[#D4AF37] mb-2.5">
                <Crown className="w-3 h-3 text-[#FFE59E]" />
                <span className="text-[8.5px] font-serif font-bold tracking-[0.22em] text-[#FFE59E] uppercase">
                  Traditional Elegance
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl font-bold text-white tracking-tight leading-none my-1">
                Festive{' '}
                <span className="font-script text-4xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DC] via-[#FFE59E] to-[#D4AF37] italic ml-1">
                  Collection
                </span>
              </h2>

              {/* Tagline */}
              <p className="text-[9px] font-serif uppercase tracking-[0.2em] text-[#FFE59E]/90 font-medium mt-1 mb-3">
                CELEBRATE TRADITION &nbsp;✦&nbsp; EMBRACE ELEGANCE
              </p>
            </div>

            {/* Center HD Showcase Card */}
            <div className="relative z-10 my-2 w-full aspect-[16/10] rounded-2xl p-[1.5px] bg-gradient-to-b from-[#FFE59E] to-[#8C6518] shadow-xl">
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#180306]">
                <Image
                  src="/images/nalmara/festive_panoramic_hd.jpg"
                  alt="Festive Silk Saree"
                  fill
                  unoptimized
                  className="object-cover object-[60%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120204]/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10.5px] font-serif font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Pure Zari Kanchipuram
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#180306]/90 border border-[#D4AF37] text-[#FFE59E] text-[9px]">
                    From ₹1,999
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Bottom Trust Badges (2x2 Grid) */}
            <div className="relative z-10 grid grid-cols-2 gap-2 my-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#26040A]/90 border border-[#D4AF37]/50">
                <LotusIcon className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
                <span className="text-[9.5px] font-serif text-[#FFE59E] leading-tight font-semibold truncate">
                  Premium Silk Sarees
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#26040A]/90 border border-[#D4AF37]/50">
                <Gem className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
                <span className="text-[9.5px] font-serif text-[#FFE59E] leading-tight font-semibold truncate">
                  Pure Zari Craft
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#26040A]/90 border border-[#D4AF37]/50">
                <Package className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
                <span className="text-[9.5px] font-serif text-[#FFE59E] leading-tight font-semibold truncate">
                  Insured Delivery
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#26040A]/90 border border-[#D4AF37]/50">
                <Heart className="w-3.5 h-3.5 text-[#FFE59E] shrink-0" />
                <span className="text-[9.5px] font-serif text-[#FFE59E] leading-tight font-semibold truncate">
                  6.3m + Blouse
                </span>
              </div>
            </div>

            {/* 3D Liquid Gold CTA Button */}
            <div className="relative z-10 flex justify-center pb-1">
              <Link
                href="/shop?category=festive"
                title="Explore Festive Collection"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#180306] border border-[#FFFDF9] text-xs font-serif font-bold uppercase tracking-[0.16em] shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Explore Festive Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 06. NEW ARRIVALS (Trending Luxury E-Commerce Edition)          */}
      {/* ============================================================== */}
      <section className="relative max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        {/* Ambient Botanical Flourish */}
        <div className="absolute right-0 top-4 pointer-events-none opacity-15 select-none hidden xl:block">
          <BotanicalBranch className="w-32 h-32 text-[#C5A059]" />
        </div>

        {/* Luxury Editorial Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9 pb-4 border-b border-[#D4AF37]/35">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D0811]/8 border border-[#D4AF37]/50 mb-2">
              <Sparkles className="w-3 h-3 text-[#B88E28]" />
              <span className="text-[10px] sm:text-[11px] font-serif font-bold tracking-[0.24em] uppercase text-[#5C0612]">
                Fresh From The Loom &bull; Just Landed
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#180306] tracking-tight leading-none">
              New{' '}
              <span className="font-script text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#5C0612] italic ml-1">
                Arrivals
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#6B5324] mt-1">
              Fresh styles. Trendy picks. Handpicked just for you.
            </p>
          </div>

          <Link
            href="/shop?filter=new-arrivals"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#180306] via-[#4A0812] to-[#180306] hover:from-[#4A0812] hover:to-[#630B19] text-[#FFE59E] hover:text-white text-xs font-serif font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_6px_18px_rgba(24,3,6,0.25)] hover:scale-105 active:scale-95 shrink-0 self-start sm:self-auto group/nabtn"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E5C158] transition-transform group-hover/nabtn:translate-x-1" />
          </Link>
        </div>

        {/* 5 Trending Luxury Product Cards Grid (Live API Products) */}
        {newArrivals.length === 0 ? (
          isLoadingApi ? (
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E8] rounded-2xl border border-[#D4AF37]/45 p-3 space-y-3 animate-pulse shadow-sm"
                >
                  <div className="aspect-[3/4] w-full rounded-xl bg-[#EFE4CE]/70" />
                  <div className="h-3.5 w-3/4 rounded bg-[#E6D5B8]" />
                  <div className="h-4 w-1/2 rounded bg-[#E6D5B8]" />
                  <div className="h-8 w-full rounded-full bg-[#180306]/15" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 py-12 text-center text-xs font-serif text-[#5C4A32] bg-[#FFFDF9] border border-[#D4AF37]/40 rounded-2xl">
              No new arrival products found in catalog.
            </div>
          )
        ) : (
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {newArrivals.slice(0, 5).map((prod) => {
              const prodId = prod._id || prod.id;
              const inWish = isInWishlist(prodId);
              const prodImg =
                prod.images?.find((img: any) => img.isMain)?.url ||
                prod.images?.[0]?.url ||
                prod.image ||
                '/images/bestsellers/traditional_silk_saree.jpg';
              const priceText = prod.priceDisplay || (prod.price ? formatCurrency(prod.price) : '₹0');
              const ratingVal = prod.rating || 4.9;
              const reviewsCount = prod.reviewsCount ?? prod.reviewCount ?? 24;
              const discountPct =
                prod.compareAtPrice && prod.price && prod.compareAtPrice > prod.price
                  ? Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)
                  : null;

              return (
                <div
                  key={prodId}
                  className="group relative bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E8] rounded-2xl border-2 border-[#D4AF37]/60 hover:border-[#180306] overflow-hidden shadow-[0_10px_28px_rgba(24,3,6,0.08)] hover:shadow-[0_20px_45px_rgba(24,3,6,0.18)] transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  {/* Image Container with Badges, Wishlist & Quick-Shop Hover Bar */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#180306]/5">
                    {/* Inner 24K Gold Hairline Frame */}
                    <div className="absolute inset-1.5 rounded-xl border border-[#FFE59E]/40 pointer-events-none z-10" />

                    <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                      <Image
                        src={prodImg}
                        alt={prod.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                    </Link>

                    {/* Top-Left Trending Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#180306]/95 border border-[#D4AF37] text-[#FFE59E] text-[9px] font-serif font-bold uppercase tracking-widest shadow-sm backdrop-blur-xs">
                        <Sparkles className="w-2.5 h-2.5 text-[#E5C158]" />
                        New Arrival
                      </span>
                      {discountPct && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-800/95 border border-emerald-400/60 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                          {discountPct}% Off
                        </span>
                      )}
                    </div>

                    {/* Top-Right Wishlist Medallion */}
                    <button
                      onClick={(e) => handleWishlistToggle(prod, e)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#FFFDF9]/95 hover:bg-[#180306] border border-[#D4AF37]/75 text-[#180306] hover:text-[#FFE59E] flex items-center justify-center transition-all shadow-md z-10 cursor-pointer hover:scale-110 active:scale-95"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          inWish ? 'fill-rose-600 text-rose-600' : 'text-current'
                        }`}
                      />
                    </button>

                    {/* Bottom Hover Glassmorphic Assurance Strip */}
                    <div className="absolute inset-x-2 bottom-2 z-10 px-2.5 py-1.5 rounded-xl bg-[#180306]/90 border border-[#D4AF37]/70 backdrop-blur-xs text-[#FFE59E] text-[9px] font-serif tracking-wider uppercase flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <span className="inline-flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                        100% Quality Checked
                      </span>
                      <Crown className="w-3 h-3 text-[#E5C158]" />
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="p-3.5 sm:p-4 space-y-2.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6]">
                    <div>
                      {/* Rating & Micro-Tag Row */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-serif uppercase tracking-[0.16em] text-[#8C6D2D] font-bold truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          {prod.categoryName || 'Authentic Weave'}
                        </span>
                        <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FAF3E3] border border-[#D4AF37]/50 text-[10px]">
                          <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="font-bold text-[#180306]">{ratingVal}</span>
                          <span className="text-[#6B5324]">({reviewsCount})</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <Link href={`/product/${prod.slug}`}>
                        <h3 className="font-serif font-bold text-xs sm:text-[14px] text-[#180306] line-clamp-1 leading-snug group-hover:text-[#5C0612] transition-colors">
                          {prod.name}
                        </h3>
                      </Link>

                      {/* Price & Swatches Row */}
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-sm sm:text-base text-[#180306]">
                            {priceText}
                          </span>
                          {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                            <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                              {formatCurrency(prod.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Color Swatches */}
                        {Array.isArray(prod.colors) && prod.colors.length > 0 && (
                          <div className="flex items-center gap-1">
                            {prod.colors.map((c: any, i: number) => {
                              const hexColor = typeof c === 'string' ? c : c.hex || '#4A0E17';
                              return (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5 rounded-full border border-[#D4AF37]/70 ring-1 ring-black/5 shadow-2xs"
                                  style={{ backgroundColor: hexColor }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Luxury Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(prod, e)}
                      className="w-full mt-2 py-2 px-3 rounded-full bg-gradient-to-r from-[#180306] via-[#3D0811] to-[#180306] hover:from-[#FFE59E] hover:to-[#D4AF37] border border-[#D4AF37] text-[#FFE59E] hover:text-[#180306] text-[11px] sm:text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 07. BESTSELLERS & TRENDING NOW (Exact Reference Mockup Look)   */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-14 relative">
        {/* Subtle background ambient sketches */}
        <div className="absolute left-1 top-2 pointer-events-none opacity-20 select-none hidden lg:block">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute right-1 bottom-2 pointer-events-none opacity-20 select-none hidden lg:block rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        {/* Master Container with user background */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 bg-[#160205]">
          {/* Background Image: the exact clean background provided by user */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/nalmara/bestsellers_trending_bg.png"
              alt="Bestsellers & Trending Now Background"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center select-none"
            />
            {/* Deep Wine / Mahogany gradient overlay for crystal-clear readability & royal depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#180306]/92 via-[#220409]/82 to-[#180306]/95 pointer-events-none" />
          </div>

          {/* Inner hairline gold border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl pointer-events-none z-20" />

          {/* Gold corner accents */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-4 h-4 border-t-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-4 h-4 border-t-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-4 h-4 border-b-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-4 h-4 border-b-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />

          {/* Content Wrapper */}
          <div className="relative z-10 p-5 sm:p-7 lg:p-9 xl:p-10 flex flex-col justify-between">
            {/* ================= HEADER BAR ================= */}
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 text-center md:text-left">
              {/* Left Brand Identity */}
              <div className="hidden lg:flex items-center gap-2.5">
                <LotusIcon className="w-8 h-8 text-[#E5C158] drop-shadow-[0_2px_8px_rgba(229,193,88,0.5)]" />
                <div className="flex flex-col text-left">
                  <span className="font-serif tracking-[0.28em] text-[13px] font-semibold text-white/95 uppercase leading-tight">
                    NALMARA
                  </span>
                  <span className="tracking-[0.38em] text-[9px] text-[#E5C158] uppercase font-medium">
                    FASHION
                  </span>
                </div>
              </div>

              {/* Center Title & Subtitle */}
              <div className="flex flex-col items-center text-center">
                {/* Overline with divider lines */}
                <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                  <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="text-[10px] sm:text-xs font-serif font-medium tracking-[0.28em] text-[#E5C158] uppercase">
                    OUR MOST LOVED STYLES
                  </span>
                  <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>

                {/* Main Heading */}
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white font-normal tracking-tight leading-tight">
                  Bestsellers &amp;{' '}
                  <span className="font-script text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFE59E] via-[#F3D079] to-[#C99E3A] italic drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                    Trending Now
                  </span>
                </h2>

                {/* Subtitle with gold accent lines */}
                <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
                  <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
                  <p className="text-[11px] sm:text-xs lg:text-sm font-light text-amber-100/80 tracking-wide">
                    Handpicked styles. Loved by you. Always in trend.
                  </p>
                  <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
                </div>
              </div>

              {/* Right View All CTA */}
              <div className="flex items-center">
                <Link
                  href="/shop?filter=best-sellers"
                  className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#D4AF37] bg-black/40 hover:bg-[#D4AF37] text-white hover:text-[#180306] transition-all duration-300 text-xs font-medium tracking-wider group shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xs"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* ================= 6 PRODUCT CARDS CAROUSEL ================= */}
            <div className="relative w-full">
              {/* Left Carousel Arrow */}
              <button
                onClick={() => scrollBestsellers('left')}
                className="absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D4AF37]/70 bg-[#280409]/90 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#180306] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-xs hover:scale-110 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Right Carousel Arrow */}
              <button
                onClick={() => scrollBestsellers('right')}
                className="absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D4AF37]/70 bg-[#280409]/90 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#180306] flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-xs hover:scale-110 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Cards Track: 6-column on large screens (Live API Products) */}
              {bestsellers.length === 0 ? (
                isLoadingApi ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className="bg-[#FFFDF9]/95 rounded-2xl border border-[#D4AF37]/50 p-2.5 space-y-2.5 animate-pulse"
                      >
                        <div className="aspect-[3/4] w-full rounded-xl bg-[#EFE4CE]" />
                        <div className="h-3.5 w-3/4 rounded bg-[#E5D3B3]" />
                        <div className="h-4 w-1/2 rounded bg-[#E5D3B3]" />
                        <div className="h-7 w-full rounded-full bg-[#180306]/20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs font-serif text-[#FFE59E]/80">
                    No bestseller styles available right now.
                  </div>
                )
              ) : (
                <div
                  ref={bestsellersContainerRef}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
                >
                  {bestsellers.slice(0, 6).map((prod) => {
                    const prodId = prod._id || prod.id;
                    const inWish = isInWishlist(prodId);
                    const prodImg =
                      prod.images?.find((img: any) => img.isMain)?.url ||
                      prod.images?.[0]?.url ||
                      prod.image ||
                      '/images/bestsellers/traditional_silk_saree.jpg';
                    const priceText = prod.priceDisplay || (prod.price ? formatCurrency(prod.price) : '₹0');
                    const discountPct =
                      prod.compareAtPrice && prod.price && prod.compareAtPrice > prod.price
                        ? Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)
                        : null;

                    return (
                      <div
                        key={prodId}
                        className="group bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] rounded-2xl border-2 border-[#D4AF37]/65 hover:border-[#FFE59E] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_40px_rgba(212,175,55,0.28)] transition-all duration-400 flex flex-col justify-between hover:-translate-y-1.5"
                      >
                        {/* Image Area (Royal 3:4 Portrait Aspect) */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#180306]">
                          <div className="absolute inset-1.5 rounded-xl border border-[#FFE59E]/35 pointer-events-none z-10" />
                          <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                            <Image
                              src={prodImg}
                              alt={prod.name}
                              fill
                              unoptimized
                              className="object-cover object-top group-hover:scale-108 transition-transform duration-700"
                            />
                          </Link>

                          {/* Top-Left Badge Pill (Wine with gold icon & gold text) */}
                          <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
                            <div className="px-2 py-0.5 rounded-full bg-[#180306]/95 border border-[#D4AF37] text-[#FFE59E] text-[8px] sm:text-[8.5px] font-serif font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-xs">
                              <Crown className="w-2.5 h-2.5 text-[#FFE59E]" />
                              <span>{prod.badge || 'BESTSELLER'}</span>
                            </div>
                            {discountPct && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-800/95 border border-emerald-400/50 text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                                {discountPct}% Off
                              </span>
                            )}
                          </div>

                          {/* Top-Right Wishlist Button */}
                          <button
                            onClick={(e) => handleWishlistToggle(prod, e)}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#FFFDF9]/95 border border-[#D4AF37]/75 hover:bg-[#180306] text-[#180306] hover:text-[#FFE59E] flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-110 active:scale-95"
                            aria-label="Save to wishlist"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                inWish ? 'fill-rose-600 text-rose-600' : 'text-current'
                              }`}
                            />
                          </button>

                          {/* Bottom Hover Verified Quality Seal */}
                          <div className="absolute inset-x-2 bottom-2 z-10 px-2 py-1 rounded-lg bg-[#180306]/90 border border-[#D4AF37]/60 text-[8.5px] font-serif text-[#FFE59E] uppercase tracking-wider flex items-center justify-between opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                            <span className="inline-flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                              Verified Weave
                            </span>
                            <Sparkles className="w-2.5 h-2.5 text-[#FFE59E]" />
                          </div>
                        </div>

                        {/* Card Info: Royal Cream Footer */}
                        <div className="p-3 bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[8.5px] font-serif uppercase tracking-[0.16em] text-[#8C6D2D] font-bold truncate">
                                {prod.categoryName || 'Most Loved'}
                              </span>
                              <div className="inline-flex items-center gap-0.5 text-[9.5px] text-[#180306] font-bold">
                                <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                                <span>{prod.rating || 4.9}</span>
                              </div>
                            </div>

                            <Link href={`/product/${prod.slug}`}>
                              <h3 className="font-serif font-bold text-xs sm:text-[13px] text-[#180306] truncate group-hover:text-[#5C0612] transition-colors">
                                {prod.name}
                              </h3>
                            </Link>

                            {/* Price & Strike-Through */}
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="font-serif font-bold text-xs sm:text-sm text-[#180306]">
                                {priceText}
                              </span>
                              {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                  {formatCurrency(prod.compareAtPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(prod, e)}
                            className="w-full mt-2.5 py-1.5 px-2.5 rounded-full bg-gradient-to-r from-[#180306] via-[#3D0811] to-[#180306] hover:from-[#FFE59E] hover:to-[#D4AF37] border border-[#D4AF37] text-[#FFE59E] hover:text-[#180306] text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ================= BOTTOM INSIDE FOOTER BAR ================= */}
            <div className="mt-6 sm:mt-8 pt-4 border-t border-[#D4AF37]/30 flex flex-col items-center gap-2">
              <LotusIcon className="w-6 h-6 text-[#E5C158] opacity-80" />
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[11px] font-serif tracking-[0.25em] text-[#E5C158] uppercase text-center">
                <span>TRADITIONAL ELEGANCE</span>
                <span className="opacity-50">|</span>
                <span>TIMELESS COLLECTIONS</span>
                <span className="opacity-50">|</span>
                <span>MADE WITH LOVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 08. DUAL PROMO BANNER (Imperial Haute Couture Editorial Edition) */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ============================================================ */}
          {/* CARD 1: WEDDING SPECIAL (#180306 Deep Royal Wine & 24K Gold) */}
          {/* ============================================================ */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_22px_55px_rgba(24,3,6,0.32)] border-2 border-[#D4AF37]/80 bg-gradient-to-br from-[#2B060C] via-[#180306] to-[#110204] group transition-all duration-500 hover:shadow-[0_28px_65px_rgba(24,3,6,0.48)] hover:-translate-y-1 p-4 sm:p-6 lg:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Ambient 24K Gold Radial Glow & Lotus Watermark */}
            <div className="absolute -left-12 -top-12 w-60 h-60 rounded-full bg-[#D4AF37]/12 blur-3xl pointer-events-none" />
            <div className="absolute left-[38%] -bottom-10 opacity-[0.06] pointer-events-none select-none">
              <LotusIcon className="w-56 h-56 text-[#FFE59E]" />
            </div>

            {/* Inner 24K Gold Hairline Frame & 4 Royal Corner Brackets */}
            <div className="absolute inset-2.5 border border-[#D4AF37]/35 rounded-2xl pointer-events-none z-20" />
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#FFE59E]/80 pointer-events-none z-20" />

            {/* Left Editorial Content Column */}
            <div className="relative z-10 w-full sm:w-[56%] pl-1 sm:pl-2 flex flex-col justify-center items-start text-left text-white">
              {/* Top Pill Row: Wedding Special + Starting Price */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D0811] border border-[#D4AF37]/80 shadow-xs">
                  <Crown className="w-3 h-3 text-[#FFE59E]" />
                  <span className="text-[9px] sm:text-[10px] font-serif font-bold tracking-[0.22em] text-[#FFE59E] uppercase">
                    Wedding Special
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[9px] font-serif font-semibold tracking-wider text-[#E8D5B0] uppercase">
                  Bridal Edit &bull; From ₹1,299
                </span>
              </div>

              {/* Headline */}
              <h3 className="font-serif text-2xl sm:text-[26px] lg:text-[30px] font-bold text-white leading-[1.18] mb-2">
                Timeless Looks for{' '}
                <span className="block font-script text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#FFE59E] italic mt-0.5">
                  Your Special Day
                </span>
              </h3>

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-[#E8D5B0]/90 leading-relaxed mb-3.5 line-clamp-2">
                Handpicked bridal lehengas, pure Kanchipuram silk sarees &amp; royal Muhurtham ensembles crafted for unforgettable moments.
              </p>

              {/* Curated Micro-Highlights */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-serif text-[#FFE59E]/90 mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
                  Pure Zari Weaves
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
                  Bridal Lehengas
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />
                  Custom Fit
                </span>
              </div>

              {/* Luxury Gold CTA Button */}
              <Link
                href="/shop?category=sarees"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-[#FFE59E] bg-gradient-to-r from-[#FFE59E] via-[#D4AF37] to-[#B88E28] hover:from-[#FFF3C4] hover:to-[#D4AF37] text-[#180306] transition-all duration-300 text-[11px] sm:text-xs font-serif font-bold tracking-[0.15em] uppercase shadow-[0_8px_24px_rgba(212,175,55,0.35)] group-hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Wedding Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Framed Royal Portrait Window (100% Vivid, Un-Fogged) */}
            <div className="relative z-10 w-full sm:w-[44%] shrink-0">
              <div className="relative w-full h-52 sm:h-60 lg:h-64 rounded-2xl p-1 bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#9E782F] shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
                <div className="relative w-full h-full rounded-[13px] overflow-hidden bg-[#180306]">
                  <Image
                    src="/images/bestsellers/bridal_lehenga.jpg"
                    alt="Wedding Special Bridal Collection"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700 select-none"
                  />
                  {/* Subtle bottom vignette only for badge legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#180306]/80 to-transparent pointer-events-none" />

                  {/* Floating Royal Seal inside Portrait */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1 rounded-lg bg-[#180306]/90 backdrop-blur-xs border border-[#D4AF37]/70">
                    <span className="text-[9px] font-serif font-bold uppercase tracking-[0.18em] text-[#FFE59E]">
                      Royal Muhurtham Edit
                    </span>
                    <Sparkles className="w-3 h-3 text-[#FFE59E]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CARD 2: KIDS COLLECTION (Royal Pearl Ivory, Wine & 24K Gold) */}
          {/* ============================================================ */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_22px_55px_rgba(184,142,40,0.22)] border-2 border-[#D4AF37]/80 bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E4] to-[#EFE1C6] group transition-all duration-500 hover:shadow-[0_28px_65px_rgba(24,3,6,0.2)] hover:-translate-y-1 p-4 sm:p-6 lg:p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Ambient Gold Glow & Lotus Watermark */}
            <div className="absolute -left-12 -top-12 w-60 h-60 rounded-full bg-[#D4AF37]/18 blur-3xl pointer-events-none" />
            <div className="absolute left-[38%] -bottom-10 opacity-[0.07] pointer-events-none select-none">
              <LotusIcon className="w-56 h-56 text-[#8C6D2D]" />
            </div>

            {/* Inner 24K Gold Hairline Frame & 4 Royal Corner Brackets */}
            <div className="absolute inset-2.5 border border-[#C8A251]/45 rounded-2xl pointer-events-none z-20" />
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />

            {/* Left Editorial Content Column */}
            <div className="relative z-10 w-full sm:w-[56%] pl-1 sm:pl-2 flex flex-col justify-center items-start text-left">
              {/* Top Pill Row: Kids Collection + Starting Price */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180306] border border-[#D4AF37]/80 shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#FFE59E]" />
                  <span className="text-[9px] sm:text-[10px] font-serif font-bold tracking-[0.22em] text-[#FFE59E] uppercase">
                    Kids Collection
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#180306]/8 border border-[#C8A251]/60 text-[9px] font-serif font-bold tracking-wider text-[#5C0612] uppercase">
                  Festive Edit &bull; From ₹699
                </span>
              </div>

              {/* Headline */}
              <h3 className="font-serif text-2xl sm:text-[26px] lg:text-[30px] font-bold text-[#180306] leading-[1.18] mb-2">
                Little Styles,{' '}
                <span className="block font-script text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#6B0D1A] italic mt-0.5">
                  Big Smiles
                </span>
              </h3>

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-[#4A382B] leading-relaxed mb-3.5 line-clamp-2">
                Playful pattu pavadas, designer butterfly gowns &amp; festive traditional sets crafted with love and feather-soft comfort.
              </p>

              {/* Curated Micro-Highlights */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-serif font-semibold text-[#5C0612] mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#B8860B]" />
                  Pattu Pavadai
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#B8860B]" />
                  Butterfly Gowns
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rotate-45 bg-[#B8860B]" />
                  Soft Cotton Lining
                </span>
              </div>

              {/* Luxury Royal Wine & Gold CTA Button */}
              <Link
                href="/shop?category=kids-wear"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#180306] via-[#3D0811] to-[#180306] hover:from-[#3D0811] hover:to-[#5C0612] text-[#FFE59E] transition-all duration-300 text-[11px] sm:text-xs font-serif font-bold tracking-[0.15em] uppercase shadow-[0_8px_24px_rgba(24,3,6,0.25)] group-hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Kidswear</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE59E] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Framed Royal Portrait Window (100% Vivid, Un-Fogged) */}
            <div className="relative z-10 w-full sm:w-[44%] shrink-0">
              <div className="relative w-full h-52 sm:h-60 lg:h-64 rounded-2xl p-1 bg-gradient-to-b from-[#D4AF37] via-[#C8A251] to-[#8C6D2D] shadow-[0_14px_35px_rgba(24,3,6,0.2)]">
                <div className="relative w-full h-full rounded-[13px] overflow-hidden bg-[#FFFDF9]">
                  <Image
                    src="/images/nalmara/kidswear_butterfly_gown.jpg"
                    alt="Kids Festive Collection"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700 select-none"
                  />
                  {/* Subtle bottom vignette only for badge legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#180306]/75 to-transparent pointer-events-none" />

                  {/* Floating Royal Seal inside Portrait */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1 rounded-lg bg-[#180306]/90 backdrop-blur-xs border border-[#D4AF37]/70">
                    <span className="text-[9px] font-serif font-bold uppercase tracking-[0.18em] text-[#FFE59E]">
                      Feather-Soft Couture
                    </span>
                    <Sparkles className="w-3 h-3 text-[#FFE59E]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 09. WHY CHOOSE NALMARA FASHION? (Royal Heritage Pillars)        */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-12">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_55px_rgba(24,3,6,0.1)] border-2 border-[#D4AF37]/65 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F2E4CC] p-6 sm:p-8 lg:p-11 select-none">
          {/* Subtle silk backdrop texture */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
            <Image
              src="/images/nalmara/category_pearl_silk_desktop_bg.jpg"
              alt="Silk Texture"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Inner hairline border & corner brackets */}
          <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none z-10" />
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />

          {/* Header */}
          <div className="relative z-10 flex flex-col items-center text-center mb-7 sm:mb-9">
            <div className="flex items-center justify-center gap-2.5 mb-1.5 text-[#B88E28]">
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <LotusIcon className="w-7 h-7 text-[#B88E28] drop-shadow-xs" />
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#180306] tracking-tight">
              Why Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C0612] via-[#8A1123] to-[#9E782F]">
                NALMARA FASHION?
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#6B5324] tracking-wide mt-1">
              Traditional Elegance &nbsp;|&nbsp; Timeless Collections &nbsp;|&nbsp; Made with Love
            </p>
          </div>

          {/* 4 Sculpted Royal Pillar Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              {
                num: '01',
                tag: 'Curated Selection',
                title: 'Handpicked Styles',
                subtitle: 'Trendy & Traditional',
                proof: '5-Stage Quality Checked',
                Icon: Sparkles,
              },
              {
                num: '02',
                tag: '100% Honesty',
                title: 'Transparent Details',
                subtitle: 'Fabric | Length | Blouse | Care',
                proof: 'Full 6.3m + Blouse Piece',
                Icon: FileCheck2,
              },
              {
                num: '03',
                tag: 'Direct Stylist',
                title: 'Personal Support',
                subtitle: "We're here to help",
                proof: 'Live WhatsApp Video Drape',
                Icon: HeartHandshake,
              },
              {
                num: '04',
                tag: 'Heartfelt Craft',
                title: 'Small Business',
                subtitle: 'With a Big Dream',
                proof: '2,400+ Happy Families',
                Icon: Sprout,
              },
            ].map(({ num, tag, title, subtitle, proof, Icon }) => (
              <div
                key={num}
                className="group relative bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF4E8] rounded-2xl border border-[#D4AF37]/70 hover:border-[#180306] p-6 flex flex-col items-center text-center shadow-[0_8px_24px_rgba(180,140,60,0.12)] hover:shadow-[0_18px_38px_rgba(24,3,6,0.16)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Inner hairline gold border */}
                <div className="absolute inset-1.5 rounded-xl border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 pointer-events-none transition-colors" />

                {/* Top Corner Numeral Watermark */}
                <span className="absolute right-4 top-2 font-serif font-bold text-3xl text-[#D4AF37]/15 select-none pointer-events-none">
                  {num}
                </span>

                {/* Double-Ring Royal Wine & Gold Medallion */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[#5C0612] via-[#3D0811] to-[#180306] border-2 border-[#D4AF37] ring-4 ring-[#FAF3E3] shadow-lg flex items-center justify-center text-[#FFE59E] mb-3.5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-[#FFE59E]" />
                </div>

                <span className="text-[9.5px] font-serif font-bold uppercase tracking-[0.22em] text-[#8C6D2D] mb-1">
                  {tag}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#180306] group-hover:text-[#5C0612] transition-colors tracking-wide">
                  {title}
                </h3>
                <p className="text-xs text-[#5A4638] font-medium mt-1">
                  {subtitle}
                </p>

                {/* Verified Proof Pill */}
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180306] border border-[#D4AF37]/80 text-[9.5px] font-serif font-bold text-[#FFE59E] tracking-wider uppercase shadow-2xs">
                  <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                  <span>{proof}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Official Buyer Protection & Trust Guarantee Ribbon */}
          <div className="relative z-10 mt-6 pt-5 border-t border-[#D4AF37]/35 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10.5px] sm:text-xs font-serif font-bold text-[#180306]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              100% Secure UPI &amp; Card Payments
            </span>
            <span className="hidden sm:inline text-[#D4AF37]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              Tamper-Proof Royal Gift Box
            </span>
            <span className="hidden sm:inline text-[#D4AF37]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              24–48 Hr Insured Pan-India Dispatch
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. STYLE INSPIRATION (@nalmarafashion Recent 6 Instagram Posts) */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 my-8 sm:my-14">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_55px_rgba(24,3,6,0.1)] border-2 border-[#D4AF37]/65 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F2E4CC] p-6 sm:p-8 lg:p-11 select-none">
          {/* Subtle silk backdrop texture */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
            <Image
              src="/images/nalmara/category_pearl_silk_desktop_bg.jpg"
              alt="Silk Texture"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Inner hairline border & corner brackets */}
          <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none z-10" />
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />

          {/* Header */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-7 sm:mb-9 pb-4 border-b border-[#D4AF37]/35 text-center md:text-left">
            <div>
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180306] border border-[#D4AF37]/80 text-[10px] sm:text-[11px] font-serif font-bold tracking-[0.2em] uppercase text-[#FFE59E] hover:bg-[#3D0811] transition-colors mb-2 cursor-pointer shadow-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-[#FFE59E]" />
                <span>@nalmarafashion &bull; Recent 6 Posts</span>
              </a>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#180306] tracking-tight leading-none">
                Style{' '}
                <span className="font-script text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#5C0612] italic ml-1">
                  Inspiration
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-[#6B5324] mt-1">
                Follow our latest reels, saree drapes &amp; festive launches on Instagram{' '}
                <a
                  href="https://www.instagram.com/nalmarafashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#5C0612] underline hover:text-[#180306]"
                >
                  @nalmarafashion
                </a>
              </p>
            </div>

            {/* Instagram CTA */}
            <a
              href="https://www.instagram.com/nalmarafashion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#180306] via-[#4A0812] to-[#180306] hover:from-[#4A0812] hover:to-[#630B19] text-[#FFE59E] hover:text-white text-xs font-serif font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_6px_18px_rgba(24,3,6,0.25)] hover:scale-105 active:scale-95 cursor-pointer group/igbtn"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Follow @nalmarafashion</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E5C158] transition-transform group-hover/igbtn:translate-x-1" />
            </a>
          </div>

          {/* Recent 6 Instagram Posts Grid from @nalmarafashion */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {instagramPosts.slice(0, 6).map((post, idx) => (
              <a
                key={post.id || idx}
                href={post.permalink || 'https://www.instagram.com/nalmarafashion'}
                target="_blank"
                rel="noopener noreferrer"
                title={`@nalmarafashion — ${post.title}`}
                className="group relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/65 hover:border-[#180306] shadow-md hover:shadow-[0_18px_40px_rgba(24,3,6,0.28)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col aspect-[3/4.1] bg-[#180306] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image || '/images/nalmara/card_kanchivaram.jpg'}
                  alt={post.title || '@nalmarafashion post'}
                  loading="lazy"
                  onError={(e) => {
                    const fallbackImg = INSTAGRAM_POSTS_DATA[idx % INSTAGRAM_POSTS_DATA.length]?.image;
                    if (fallbackImg && e.currentTarget.src !== window.location.origin + fallbackImg) {
                      e.currentTarget.src = fallbackImg;
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                {/* Inner gold bevel */}
                <div className="absolute inset-1.5 border border-[#FFE59E]/35 rounded-xl pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180306]/95 via-[#180306]/25 to-black/25 group-hover:via-[#180306]/65 transition-colors duration-300" />

                {/* Top Bar: @nalmarafashion Handle Pill + Reel/Post Icon Badge */}
                <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#180306]/85 border border-[#D4AF37]/60 backdrop-blur-xs text-[8.5px] font-serif font-bold tracking-wider text-[#FFE59E] truncate">
                    @nalmarafashion
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#180306]/85 border border-[#D4AF37]/75 backdrop-blur-xs text-[#FFE59E] group-hover:bg-[#D4AF37] group-hover:text-[#180306] flex items-center justify-center transition-all shadow-sm shrink-0">
                    {post.isReel ? (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    ) : (
                      <Instagram className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Center Hover Instagram Likes & Caption Preview */}
                <div className="relative z-20 my-auto px-3 text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#180306]/90 border border-[#D4AF37] text-[10px] font-serif font-bold text-[#FFE59E] mb-1.5 shadow-sm">
                    <Heart className="w-3 h-3 fill-[#E11D48] text-[#E11D48]" />
                    <span>{post.likes || '1.2k'}</span>
                  </div>
                  {post.caption && (
                    <p className="text-[10px] text-[#FFFDF9] font-serif line-clamp-3 leading-snug drop-shadow-xs">
                      {post.caption}
                    </p>
                  )}
                </div>

                {/* Bottom Post Details Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-left z-20">
                  <span className="inline-block text-[8.5px] font-serif font-bold uppercase tracking-[0.18em] text-[#E5C158] mb-0.5">
                    {post.postedAgo || 'Instagram Post'}
                  </span>
                  <span className="block font-serif font-bold text-xs sm:text-sm text-white drop-shadow-sm group-hover:text-[#FFE59E] transition-colors truncate">
                    {post.title}
                  </span>
                  <span className="block text-[10px] text-amber-200/90 font-serif italic truncate">
                    {post.subtitle}
                  </span>
                  <div className="inline-flex items-center gap-1 text-[9px] font-serif font-bold uppercase tracking-wider text-[#FFE59E] mt-1.5 px-2.5 py-0.5 rounded-full bg-[#3D0811]/95 border border-[#D4AF37]/70 group-hover:bg-[#D4AF37] group-hover:text-[#180306] transition-colors">
                    <Instagram className="w-2.5 h-2.5" />
                    <span>View Post</span>
                    <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. ROYAL STYLING CONCIERGE & ATELIER PRIVILEGES (#180306 Royal Edition) */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-full overflow-hidden bg-[#180306] text-white py-10 sm:py-14 border-y-2 border-[#D4AF37]/65">
        {/* Top & Bottom Hairline Gold Shimmer */}
        <div className="absolute top-1.5 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#FFE59E]/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-1.5 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#FFE59E]/50 to-transparent pointer-events-none" />

        {/* Ambient Radial Gold & Garnet Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-64 rounded-full bg-[#D4AF37]/14 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-64 rounded-full bg-[#5C0612]/40 blur-3xl pointer-events-none" />

        {/* Center Watermark Lotus Mandala */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.04] select-none">
          <LotusIcon className="w-96 h-96 text-[#FFE59E]" />
        </div>

        {/* Corner Botanical Flourishes */}
        <div className="absolute -top-6 -left-6 pointer-events-none opacity-20 select-none">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-20 select-none transform rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: The Nalmara Royal Circle & Atelier Privileges (No Subscribe Form) */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B060C] border border-[#D4AF37]/75 shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
                <Crown className="w-3.5 h-3.5 text-[#FFE59E]" />
                <span className="text-[10px] font-serif font-bold tracking-[0.24em] uppercase text-[#FFE59E]">
                  The Nalmara Royal Concierge
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight text-white">
                Be the First to Discover{' '}
                <span className="font-script text-4xl sm:text-5xl lg:text-[54px] font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFE59E] via-[#F3D079] to-[#C99E3A] italic ml-1">
                  Something Beautiful
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-[#E8D5B0]/90 font-normal max-w-xl leading-relaxed">
                Experience personalized saree draping guidance, live fabric previews, and priority assistance for bridal, festive, and bulk family celebrations.
              </p>

              {/* 3 Sculpted Royal Privilege Badges (Replaces Email Subscribe Box) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    Icon: Sparkles,
                    title: 'Live Fabric Preview',
                    desc: 'Drape & Zari Check on WhatsApp',
                  },
                  {
                    Icon: Gem,
                    title: '100% Quality Assured',
                    desc: 'Hand-Checked Before Dispatch',
                  },
                  {
                    Icon: Package,
                    title: 'Express Pan-India',
                    desc: 'Fast Insured Doorstep Delivery',
                  },
                ].map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="relative rounded-xl bg-gradient-to-b from-[#2B060C] to-[#140205] border border-[#D4AF37]/45 hover:border-[#FFE59E]/80 p-3.5 flex items-start gap-3 transition-all duration-300 shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#3D0811] border border-[#D4AF37]/70 flex items-center justify-center text-[#FFE59E] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-xs sm:text-[13px] font-bold text-[#FFE59E] leading-tight truncate">
                        {title}
                      </h4>
                      <p className="text-[10px] text-[#E8D5B0]/80 mt-0.5 truncate">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upgraded Imperial WhatsApp Styling Concierge Salon Plaque (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#2E060D] via-[#1B0307] to-[#110204] border-2 border-[#D4AF37]/80 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden group">
                {/* Inner 24K Gold Hairline & Corner Brackets */}
                <div className="absolute inset-2.5 border border-[#D4AF37]/35 rounded-2xl pointer-events-none" />
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* Top Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-serif font-bold uppercase tracking-[0.22em] text-[#FFE59E]">
                      <Sparkles className="w-3 h-3 text-[#E5C158]" />
                      Need Styling Help?
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/50 text-[9px] font-serif font-bold uppercase tracking-wider text-[#6EE7B7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      Stylists Online
                    </span>
                  </div>

                  {/* Center Icon + Title + Dual Numbers */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20would%20like%20assistance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-15 h-15 rounded-full bg-gradient-to-b from-[#25D366] to-[#1DA851] border-2 border-[#FFE59E] text-white flex items-center justify-center shadow-[0_0_28px_rgba(37,211,102,0.5)] transition-transform duration-300 group-hover:scale-108 shrink-0"
                      aria-label="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-7 h-7 fill-white" />
                    </a>

                    <div className="min-w-0">
                      <h4 className="font-serif text-lg sm:text-2xl font-bold text-white leading-tight">
                        Chat with us on WhatsApp
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <a
                          href="tel:+916383163609"
                          className="px-2.5 py-0.5 rounded-md bg-[#180306] border border-[#D4AF37]/60 text-xs sm:text-sm font-serif font-bold text-[#FFE59E] hover:bg-[#D4AF37] hover:text-[#180306] transition-colors tracking-wider"
                        >
                          6383163609
                        </a>
                        <span className="text-[#D4AF37] font-serif">|</span>
                        <a
                          href="tel:+917871207631"
                          className="px-2.5 py-0.5 rounded-md bg-[#180306] border border-[#D4AF37]/60 text-xs sm:text-sm font-serif font-bold text-[#FFE59E] hover:bg-[#D4AF37] hover:text-[#180306] transition-colors tracking-wider"
                        >
                          7871207631
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Full-Width Gold CTA Button */}
                  <div className="pt-1">
                    <a
                      href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20would%20like%20assistance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-5 rounded-full bg-gradient-to-r from-[#FFE59E] via-[#D4AF37] to-[#B88E28] hover:from-[#FFF3C4] hover:to-[#D4AF37] text-[#180306] text-xs font-serif font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(212,175,55,0.32)] transition-all duration-300 hover:scale-[1.02]"
                    >
                      <span>Start Instant WhatsApp Chat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. BRAND STORY & WHAT OUR CUSTOMERS SAY (Haute Couture Edition) */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-12 sm:pt-16 pb-8 sm:pb-12">
        {/* Ambient Royal Botanical Filigree Watermarks */}
        <div className="absolute left-0 top-8 pointer-events-none opacity-20 select-none hidden xl:block">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute right-0 bottom-8 pointer-events-none opacity-20 select-none hidden xl:block rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
          {/* ============================================================ */}
          {/* LEFT COLUMN (7 cols): OUR BRAND STORY — Royal Heritage Card  */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 relative rounded-3xl border-2 border-[#D4AF37]/70 bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E6] to-[#F2E4CC] overflow-hidden shadow-[0_20px_55px_rgba(43,5,12,0.12)] p-6 sm:p-8 lg:p-10 flex flex-col justify-between group transition-all duration-500 hover:shadow-[0_25px_65px_rgba(61,8,17,0.18)]">
            {/* Pearlescent Silk Backdrop Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
              <Image
                src="/images/nalmara/category_pearl_silk_desktop_bg.jpg"
                alt="Silk Texture"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Warm Radial Gold Aura */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#5C0612]/10 blur-3xl pointer-events-none z-0" />

            {/* Double Hairline 24K Gold Inner Frame */}
            <div className="absolute inset-2.5 sm:inset-3.5 border border-[#D4AF37]/45 rounded-2xl pointer-events-none z-10" />

            {/* Sculpted 24K Gold Corner Filigree Brackets */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />

            <div className="relative z-20 grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-center my-auto">
              {/* Left Unboxing Photo Frame (5 cols) */}
              <div className="sm:col-span-5 relative">
                {/* Decorative Gold Offset Backplate */}
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/45 via-[#FFE59E]/20 to-[#5C0612]/30 blur-[2px] pointer-events-none" />

                <div className="relative aspect-[4/3.4] sm:aspect-[4/4.3] rounded-2xl overflow-hidden bg-[#24040A] border-2 border-[#D4AF37] shadow-[0_16px_38px_rgba(36,4,10,0.28)]">
                  <Image
                    src="/images/nalmara/brand_story_box.jpg"
                    alt="Our Brand Story - NALMARA FASHION Signature Gift Box"
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  {/* Inner gold bevel frame */}
                  <div className="absolute inset-2 border border-[#FFE59E]/45 rounded-xl pointer-events-none z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160205]/80 via-[#160205]/15 to-transparent pointer-events-none" />

                  {/* Top-Left Floating Royal Monogram Seal */}
                  <div className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-gradient-to-b from-[#3D0811] to-[#1A0206] border border-[#D4AF37] shadow-lg flex flex-col items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-[#FFE59E] -mb-0.5" />
                    <span className="font-serif font-bold text-[10px] text-[#FFE59E] tracking-tighter leading-none">
                      NM
                    </span>
                  </div>

                  {/* Bottom Royal Glassmorphic Caption Bar */}
                  <div className="absolute bottom-3 inset-x-3 z-20 px-3 py-2 rounded-xl bg-[#1F0308]/90 border border-[#D4AF37]/60 backdrop-blur-md flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-1.5">
                      <LotusIcon className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span className="text-[9.5px] font-serif uppercase tracking-[0.18em] text-[#FFE59E] font-semibold">
                        Royal Gift Packaging
                      </span>
                    </div>
                    <Sparkles className="w-3 h-3 text-[#E5C158]" />
                  </div>
                </div>
              </div>

              {/* Right Story Content (7 cols) */}
              <div className="sm:col-span-7 space-y-3.5 text-left">
                {/* Overline Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#3D0811] to-[#5C0612] border border-[#D4AF37]/80 shadow-xs">
                  <LotusIcon className="w-3.5 h-3.5 text-[#FFE59E]" />
                  <span className="text-[10px] sm:text-[11px] font-serif font-bold tracking-[0.25em] uppercase text-[#FFE59E]">
                    Our Brand Story
                  </span>
                </div>

                {/* Stately Two-Line Headline */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1A080B] leading-[1.15] tracking-tight">
                  A Dream. A Brand. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C0612] via-[#8F1124] to-[#B08227] italic font-serif">
                    A Beautiful Beginning.
                  </span>
                </h3>

                {/* Gold Filigree Divider */}
                <div className="flex items-center gap-2">
                  <span className="h-[1.5px] w-14 bg-gradient-to-r from-[#D4AF37] to-transparent" />
                  <LotusIcon className="w-3 h-3 text-[#B88E28]" />
                  <span className="text-[10px] font-serif italic text-[#8C6D2D] tracking-wide">
                    Crafted with Heritage &amp; Grace
                  </span>
                </div>

                {/* Story Paragraph */}
                <p className="text-xs sm:text-[13.5px] text-[#3F2E26] leading-relaxed font-normal">
                  <strong className="font-serif font-bold text-[#4A0812]">NALMARA FASHION</strong> is born from a love for traditional fashion and a dream to make beautiful ethnic styles accessible to every woman and child.
                </p>

                {/* 3 Heritage Promise Pills */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-white/85 border border-[#D4AF37]/45 rounded-xl px-2.5 py-2 text-center shadow-2xs">
                    <span className="block font-serif font-bold text-xs sm:text-sm text-[#4A0812]">100%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-[#6B5324] font-medium">Authentic Weaves</span>
                  </div>
                  <div className="bg-white/85 border border-[#D4AF37]/45 rounded-xl px-2.5 py-2 text-center shadow-2xs">
                    <span className="block font-serif font-bold text-xs sm:text-sm text-[#4A0812]">Curated</span>
                    <span className="block text-[9px] uppercase tracking-wider text-[#6B5324] font-medium">Luxury Box</span>
                  </div>
                  <div className="bg-white/85 border border-[#D4AF37]/45 rounded-xl px-2.5 py-2 text-center shadow-2xs">
                    <span className="block font-serif font-bold text-xs sm:text-sm text-[#4A0812]">Pan-India</span>
                    <span className="block text-[9px] uppercase tracking-wider text-[#6B5324] font-medium">Insured Delivery</span>
                  </div>
                </div>

                {/* CTA Button: DISCOVER OUR STORY → */}
                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-gradient-to-r from-[#240409] via-[#4A0812] to-[#240409] hover:from-[#4A0812] hover:to-[#630B19] border border-[#D4AF37] text-[#FFE59E] hover:text-white text-xs font-serif font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_8px_24px_rgba(36,4,9,0.35)] hover:shadow-[0_10px_28px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 group/btn"
                  >
                    <span>Discover Our Story</span>
                    <ArrowRight className="w-4 h-4 text-[#E5C158] transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (5 cols): WHAT OUR CUSTOMERS SAY — Royal Panel  */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 relative rounded-3xl border-2 border-[#D4AF37]/70 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F2E4CC] overflow-hidden shadow-[0_20px_55px_rgba(43,5,12,0.12)] p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
            {/* Pearlescent Silk Backdrop Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
              <Image
                src="/images/nalmara/category_pearl_silk_desktop_bg.jpg"
                alt="Silk Texture"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Inner Hairline Gold Frame */}
            <div className="absolute inset-2.5 sm:inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none z-10" />

            {/* Sculpted 24K Gold Corner Filigree Brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#B88E28] pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#B88E28] pointer-events-none z-20" />

            {/* Top Header Row */}
            <div className="relative z-20 flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-[#D4AF37]/35">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3D0811]/10 border border-[#D4AF37]/50 mb-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
                  </div>
                  <span className="text-[9.5px] font-serif font-bold tracking-[0.18em] text-[#5C0612] uppercase">
                    4.9 / 5 Rating
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-[#1A080B] leading-tight tracking-tight">
                  What Our Customers Say
                </h3>
                <p className="text-xs text-[#6B5324] font-serif italic mt-0.5">
                  Real people. Real stories.
                </p>
              </div>

              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D4AF37] bg-white/95 hover:bg-[#3D0811] text-[#3D0811] hover:text-[#FFE59E] text-[11px] font-serif font-bold tracking-wider uppercase transition-all duration-300 shadow-xs hover:shadow-md shrink-0 mt-1 group/revlink"
              >
                <span>View All Reviews</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover/revlink:translate-x-0.5" />
              </Link>
            </div>

            {/* 3 Stacked Royal Testimonial Plaques */}
            <div className="relative z-20 space-y-3 flex-1 flex flex-col justify-center">
              {CUSTOMER_REVIEWS_DATA.map((rev) => (
                <div
                  key={rev.id}
                  className="group/rev relative bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF4E8] rounded-2xl border border-[#D4AF37]/60 hover:border-[#B88E28] p-3.5 sm:px-4 sm:py-3.5 shadow-[0_4px_16px_rgba(180,140,60,0.1)] hover:shadow-[0_10px_25px_rgba(61,8,17,0.12)] transition-all duration-300 flex items-center justify-between gap-3 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Left 24K Gold Accent Bar */}
                  <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-b from-[#D4AF37] via-[#5C0612] to-[#D4AF37]" />

                  {/* Subtle Decorative Quote Watermark */}
                  <span
                    aria-hidden="true"
                    className="absolute right-24 -bottom-4 font-serif text-6xl text-[#D4AF37]/12 select-none pointer-events-none leading-none"
                  >
                    &rdquo;
                  </span>

                  {/* Left Avatar Medallion + Quote & Author */}
                  <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                    {/* Royal Monogram Medallion */}
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-[#5C0612] via-[#3D0811] to-[#1F0308] border-2 border-[#D4AF37] text-[#FFE59E] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-sm group-hover/rev:scale-105 transition-transform">
                      {rev.name.charAt(0)}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white flex items-center justify-center">
                        <Check className="w-2 h-2 text-white stroke-[3]" />
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <p className="text-xs sm:text-[13.5px] text-[#24130D] italic font-serif leading-snug line-clamp-2">
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif font-bold text-xs text-[#3D0811]">
                          — {rev.name}
                        </span>
                        {rev.tag && (
                          <span className="text-[9.5px] font-serif text-[#8C6D2D] bg-[#FAF3E3] border border-[#D4AF37]/40 px-2 py-0.2 rounded-full">
                            {rev.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Gold Stars Plaque */}
                  <div className="flex flex-col items-end shrink-0 relative z-10">
                    <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FAF3E3] to-[#F3E4C2] border border-[#D4AF37]/60 shadow-2xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#D4AF37] text-[#B88E28]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ORNATE ROYAL LOTUS FILIGREE SECTION DIVIDER                    */}
      {/* ============================================================== */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3 flex items-center justify-center gap-4">
        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-[#B88E28]" />
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/60 bg-[#FFFDF9] shadow-[0_4px_14px_rgba(184,142,40,0.15)]">
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
          <LotusIcon className="w-4 h-4 text-[#8C6D2D]" />
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
        </div>
        <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/60 to-[#B88E28]" />
      </div>

      {/* ============================================================== */}
      {/* 13. FREQUENTLY ASKED QUESTIONS (Split Royal Editorial Edition) */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16 sm:pb-22 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
          {/* ============================================================ */}
          {/* LEFT COLUMN (5 cols): #180306 Royal Concierge Editorial Card */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2B060C] via-[#180306] to-[#100204] border-2 border-[#D4AF37]/80 shadow-[0_22px_55px_rgba(24,3,6,0.28)] p-6 sm:p-8 lg:p-9 flex flex-col justify-between text-white">
            {/* Ambient Radial Gold Glow & Watermark Lotus */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 opacity-[0.06] pointer-events-none select-none">
              <LotusIcon className="w-72 h-72 text-[#FFE59E]" />
            </div>

            {/* Inner 24K Gold Hairline Frame & 4 Royal Corner Brackets */}
            <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-2xl pointer-events-none z-10" />
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#FFE59E]/80 pointer-events-none z-20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#FFE59E]/80 pointer-events-none z-20" />

            {/* Top Editorial Header */}
            <div className="relative z-20 space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3D0811] border border-[#D4AF37]/75 shadow-xs">
                <LotusIcon className="w-3.5 h-3.5 text-[#FFE59E]" />
                <span className="text-[9.5px] sm:text-[10px] font-serif font-bold tracking-[0.24em] uppercase text-[#FFE59E]">
                  Royal Concierge &amp; Care Guide
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.12]">
                Frequently Asked{' '}
                <span className="block font-script text-4xl sm:text-5xl lg:text-[52px] font-normal text-[#FFE59E] italic mt-0.5">
                  Questions
                </span>
              </h2>

              <p className="text-xs sm:text-[13px] text-[#E8D5B0]/90 leading-relaxed">
                Quick, transparent answers on saree dimensions, unstitched blouse pieces, insured dispatch timelines, and heirloom silk care.
              </p>

              {/* 3 Quick Atelier Spec Pills */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {[
                  { label: 'Standard Saree Length', val: '6.3m Total (with 0.8m Blouse)' },
                  { label: 'Order Dispatch Window', val: '24–48 Hours Express Shipping' },
                  { label: 'Complimentary Delivery', val: 'Free Pan-India Above ₹1,999' },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#240409]/90 border border-[#D4AF37]/40 text-xs"
                  >
                    <span className="font-serif text-[#E8D5B0]/85">{spec.label}</span>
                    <span className="font-serif font-bold text-[#FFE59E]">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: View All FAQs + WhatsApp Stylist Help */}
            <div className="relative z-20 pt-6 mt-6 border-t border-[#D4AF37]/30 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/faq"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FFE59E] via-[#D4AF37] to-[#B88E28] hover:from-[#FFF3C4] hover:to-[#D4AF37] text-[#180306] text-xs font-serif font-bold tracking-[0.16em] uppercase shadow-[0_8px_22px_rgba(212,175,55,0.3)] transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>View All FAQs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20have%20a%20query"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] border border-[#25D366]/70 text-[#FFE59E] hover:text-white text-xs font-serif font-bold tracking-wider transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white" />
                  <span>Ask Stylist</span>
                </a>
              </div>

              <p className="text-[11px] font-serif text-[#E8D5B0]/80 text-center tracking-wider">
                Direct WhatsApp Support: <strong className="text-[#FFE59E]">6383163609 &nbsp;|&nbsp; 7871207631</strong>
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (7 cols): Stacked Horizontal Couture Accordions */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`group relative rounded-2xl transition-all duration-400 overflow-hidden ${
                    isOpen
                      ? 'bg-gradient-to-r from-[#FFFDF9] via-[#FAF4E8] to-[#F5EBD6] border-2 border-[#180306] shadow-[0_16px_40px_rgba(24,3,6,0.14)]'
                      : 'bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF4E8] border border-[#D4AF37]/75 hover:border-[#180306]/70 shadow-[0_6px_20px_rgba(180,140,60,0.1)] hover:shadow-[0_12px_28px_rgba(24,3,6,0.1)]'
                  }`}
                >
                  {/* Left Active Gold Accent Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                      isOpen
                        ? 'bg-gradient-to-b from-[#180306] via-[#D4AF37] to-[#180306]'
                        : 'bg-[#D4AF37]/40 group-hover:bg-[#D4AF37]'
                    }`}
                  />

                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="relative z-10 w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    {/* Left: Royal Numbered Medallion + Question & Category Tag */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {/* Sculpted Royal Wine & 24K Gold Numeral Medallion */}
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 transition-all duration-300 shadow-xs ${
                          isOpen
                            ? 'bg-[#180306] border-[#D4AF37] text-[#FFE59E] scale-105'
                            : 'bg-[#FAF3E3] border-[#D4AF37]/80 text-[#180306] group-hover:bg-[#180306] group-hover:text-[#FFE59E] group-hover:border-[#D4AF37]'
                        }`}
                      >
                        <span className="text-[9px] font-serif font-bold tracking-widest opacity-80 leading-none">
                          0{idx + 1}
                        </span>
                        <div className="mt-0.5">
                          {idx === 0 && <Sparkles className="w-3.5 h-3.5" />}
                          {idx === 1 && <Package className="w-3.5 h-3.5" />}
                          {idx === 2 && <Gem className="w-3.5 h-3.5" />}
                          {idx === 3 && <Heart className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="min-w-0 space-y-1">
                        {/* Category & Summary Pill Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#180306]/8 border border-[#D4AF37]/50 text-[9.5px] font-serif font-bold uppercase tracking-[0.18em] text-[#5C0612]">
                            {faq.category}
                          </span>
                          <span className="text-[11px] font-serif italic text-[#8C6D2D] hidden sm:inline">
                            &bull; {faq.summary}
                          </span>
                        </div>

                        {/* Question Headline */}
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#180306] group-hover:text-[#5C0612] transition-colors leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Right Circular 24K Gold Plus/Minus Toggle Medallion */}
                    <span
                      className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#180306] border-[#D4AF37] text-[#FFE59E] rotate-180 shadow-md'
                          : 'bg-[#FFFDF9] border-[#D4AF37]/80 text-[#180306] group-hover:bg-[#180306] group-hover:text-[#FFE59E] group-hover:border-[#D4AF37]'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {/* Smooth Expandable Horizontal Answer Drawer */}
                  {isOpen && (
                    <div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-[#3F2E26] leading-relaxed border-t border-[#D4AF37]/35 animate-in fade-in duration-200">
                      <div className="sm:pl-16 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="font-normal text-[#2D1D16] leading-relaxed max-w-xl">
                          {faq.answer}
                        </p>
                        {faq.highlight && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180306] border border-[#D4AF37] text-[10px] font-serif font-bold text-[#FFE59E] tracking-wider uppercase shrink-0 self-start sm:self-center shadow-xs">
                            <Check className="w-3 h-3 text-[#FFE59E]" />
                            <span>{faq.highlight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
