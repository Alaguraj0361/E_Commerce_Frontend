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
// 02. HERO SLIDES DATA (Mockup exact design)
// ==============================================================
const HERO_SLIDES = [
  {
    tag: 'Premium Ethnic Wear',
    title: 'Traditional Elegance',
    description: 'Timeless Sarees | Modern Styles\nFor Every Special Moment',
    image: '/images/nalmara/hero_fullwidth_traditional_elegance.jpg',
    fullWidthImage: '/images/nalmara/hero_fullwidth_traditional_elegance.jpg',
    primaryLink: '/shop?category=sarees',
    primaryText: 'Shop Now',
    secondaryLink: '/shop?filter=new-arrivals',
    secondaryText: 'Explore New Arrivals',
  },
  {
    tag: 'Handcrafted Heritage',
    title: 'Royal Handlooms',
    description: 'Intricate Bridal Weaves | Pure Zari\nCrafted with Timeless Indian Artistry',
    image: '/images/nalmara/hero_maroon_saree.jpg',
    fullWidthImage: '/images/nalmara/hero_maroon_saree.jpg',
    primaryLink: '/shop?category=sarees',
    primaryText: 'Shop Now',
    secondaryLink: '/shop?filter=new-arrivals',
    secondaryText: 'Explore New Arrivals',
  },
  {
    tag: 'Auspicious Celebrations',
    title: 'Festive Splendor',
    description: 'Grandeur for Every Milestone\nAuthentic Handcrafted Silk Heirlooms',
    image: '/images/nalmara/festive_panoramic_composite.jpg',
    fullWidthImage: '/images/nalmara/festive_panoramic_composite.jpg',
    primaryLink: '/shop?category=festive',
    primaryText: 'Shop Now',
    secondaryLink: '/shop?filter=new-arrivals',
    secondaryText: 'Explore New Arrivals',
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
    image: '/images/nalmara/card_kanchivaram.jpg',
    link: '/shop?category=sarees',
    slug: 'sarees',
  },
  {
    id: 'semi-kanchivaram',
    title: 'Semi Kanchipuram',
    image: '/images/nalmara/category_semi_kanchivaram.jpg',
    link: '/shop?category=semi-kanchipuram',
    slug: 'semi-kanchivaram',
  },
  {
    id: 'cotton-sarees',
    title: 'Cotton Sarees',
    image: '/images/nalmara/cotton_saree_stack.jpg',
    link: '/shop?category=cotton-sarees',
    slug: 'cotton-sarees',
  },
  {
    id: 'party-wear',
    title: 'Party Wear',
    image: '/images/nalmara/category_party_wear.jpg',
    link: '/shop?category=party-wear',
    slug: 'party-wear',
  },
  {
    id: 'kids-wear',
    title: 'Kids',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    link: '/shop?category=kids-wear',
    slug: 'kids-wear',
  },
  {
    id: 'lehengas',
    title: 'Lehengas',
    image: '/images/categories/lehengas.jpg',
    link: '/shop?category=lehengas',
    slug: 'lehengas',
  },
  {
    id: 'anarkali',
    title: 'Anarkali',
    image: '/images/categories/anarkali.jpg',
    link: '/shop?category=anarkali',
    slug: 'anarkali',
  },
  {
    id: 'kurtis',
    title: 'Kurtis',
    image: '/images/categories/kurtis.jpg',
    link: '/shop?category=kurtis',
    slug: 'kurtis',
  },
  {
    id: 'salwar-suits',
    title: 'Salwar Suits',
    image: '/images/categories/salwar-suits.jpg',
    link: '/shop?category=salwar-suits',
    slug: 'salwar-suits',
  },
  {
    id: 'mens-wear',
    title: "Men's Wear",
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
    id: 1,
    title: 'Sarees',
    subtitle: 'Grace in Every Drape',
    image: '/images/nalmara/card_kanchivaram.jpg',
    cardImage: '/images/nalmara/style_inspire_card_1_clean.png',
    href: '/shop?category=sarees',
    left: '4.68%',
    width: '14.06%',
  },
  {
    id: 2,
    title: 'Traditional Wear',
    subtitle: 'Timeless Heritage',
    image: '/images/nalmara/hero_maroon_saree.jpg',
    cardImage: '/images/nalmara/style_inspire_card_2_clean.png',
    href: '/shop?category=traditional',
    left: '20.23%',
    width: '14.06%',
  },
  {
    id: 3,
    title: 'Kids Collection',
    subtitle: 'Little Smiles, Big Joy',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    cardImage: '/images/nalmara/style_inspire_card_3_clean.png',
    href: '/shop?category=kids-wear',
    left: '35.78%',
    width: '14.06%',
  },
  {
    id: 4,
    title: 'Premium Collections',
    subtitle: 'Luxury in Every Thread',
    image: '/images/nalmara/brand_story_box.jpg',
    cardImage: '/images/nalmara/style_inspire_card_4_clean.png',
    href: '/shop?category=silk-sarees',
    left: '51.33%',
    width: '14.06%',
  },
  {
    id: 5,
    title: 'Behind the Scenes',
    subtitle: 'Real Moments, Real Us',
    image: '/images/nalmara/category_party_wear.jpg',
    cardImage: '/images/nalmara/style_inspire_card_5_clean.png',
    href: 'https://instagram.com/nalmarafashion_official',
    left: '66.88%',
    width: '14.06%',
  },
  {
    id: 6,
    title: 'Festive Vibes',
    subtitle: 'Celebrate in Style',
    image: '/images/nalmara/festive_diwali_diyas.jpg',
    cardImage: '/images/nalmara/style_inspire_card_6_clean.png',
    href: '/shop?category=festive',
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
    quote: 'Product quality was superb. Loved entire packaging!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    verified: true,
  },
  {
    id: 2,
    name: 'Meena K.',
    quote: 'Beautiful collection! Exactly happy!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    verified: true,
  },
  {
    id: 3,
    name: 'Divya R.',
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
    question: 'What is the fabric and saree length?',
    answer:
      'All our sarees are 6.3 meters in total length including an unstitched 0.8 meter blouse piece. We use authentic semi-kanchivaram silk, pure cotton, art silk, and tissue weaves.',
  },
  {
    id: 2,
    question: 'How can I track my order?',
    answer:
      'Once your order is dispatched, you will receive an SMS and WhatsApp message with your tracking ID and courier link. You can also track from your account dashboard.',
  },
  {
    id: 3,
    question: 'What are the shipping charges?',
    answer:
      'We offer Free Shipping across India on all orders above ₹1,999. For orders below ₹1,999, a nominal flat delivery fee of ₹79 is applied at checkout.',
  },
  {
    id: 4,
    question: 'How should I wash my saree?',
    answer:
      'For silk, semi-kanchivaram, and tissue sarees, we strictly recommend dry cleaning. Pure cotton sarees can be gently hand-washed in cold water with mild detergent.',
  },
];

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live dynamic API state
  const [categories, setCategories] = useState<any[]>(CATEGORIES_DATA);

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

  const [newArrivals, setNewArrivals] = useState<any[]>(NEW_ARRIVALS_DATA);
  const [bestsellers, setBestsellers] = useState<any[]>(BESTSELLERS_DATA);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  const bestsellersContainerRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Fetch live Categories and Products directly from the API
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setIsLoadingApi(true);

        // 1. Fetch live categories from backend API and prioritize the 5 featured mockup categories
        const catRes = await api.get('/categories');
        if (catRes.data?.success && Array.isArray(catRes.data.data) && catRes.data.data.length > 0) {
          const featuredSlugs = ['sarees', 'semi-kanchivaram', 'cotton-sarees', 'party-wear', 'kids-wear'];
          const catImgMap: Record<string, string> = {
            'sarees': '/images/nalmara/category_sarees_stack.jpg',
            'semi-kanchivaram': '/images/nalmara/category_semi_kanchivaram.jpg',
            'cotton-sarees': '/images/nalmara/cotton_saree_stack.jpg',
            'party-wear': '/images/nalmara/category_party_wear.jpg',
            'kids-wear': '/images/nalmara/kidswear_butterfly_gown.jpg',
          };
          const liveCats = catRes.data.data.map((c: any) => ({
            id: c._id || c.slug,
            title: c.name,
            image: catImgMap[c.slug] || c.image || '/images/categories/sarees.jpg',
            link: `/shop?category=${c.slug}`,
            slug: c.slug,
          }));

          // Sort with the 5 featured categories first in the exact reference order
          liveCats.sort((a: any, b: any) => {
            const idxA = featuredSlugs.indexOf(a.slug);
            const idxB = featuredSlugs.indexOf(b.slug);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return 0;
          });
          setCategories(liveCats);
        }

        // 2. Fetch live products from backend API to sync IDs, prices, and stock
        const prodRes = await api.get('/products?limit=50&isActive=true');
        let liveList: any[] = [];
        if (prodRes.data?.success && Array.isArray(prodRes.data.data)) {
          liveList = prodRes.data.data;
        }

        // Enrich the 5 authentic New Arrivals with live database IDs & prices
        const enrichedNewArrivals = NEW_ARRIVALS_DATA.map((item) => {
          const found = liveList.find((p: any) => p.slug === item.slug);
          if (found) {
            return {
              ...item,
              _id: found._id,
              price: found.price || item.price,
              compareAtPrice: found.compareAtPrice || item.compareAtPrice,
              priceDisplay: formatCurrency(found.price || item.price),
              rating: found.rating || item.rating,
              reviewsCount: found.reviewCount || item.reviewsCount,
            };
          }
          return item;
        });
        setNewArrivals(enrichedNewArrivals);

        // Enrich the 5 authentic Bestsellers with live database IDs & prices
        const enrichedBestsellers = BESTSELLERS_DATA.map((item) => {
          const found = liveList.find((p: any) => p.slug === item.slug);
          if (found) {
            return {
              ...item,
              _id: found._id,
              price: found.price || item.price,
              compareAtPrice: found.compareAtPrice || item.compareAtPrice,
              priceDisplay: formatCurrency(found.price || item.price),
              rating: found.rating || item.rating,
              reviewsCount: found.reviewCount || item.reviewsCount,
            };
          }
          return item;
        });
        setBestsellers(enrichedBestsellers);
      } catch (err) {
        console.warn('API sync fallback active:', err);
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
    <div className="bg-[#FAF7F2] text-zinc-900 selection:bg-[#132E27] selection:text-white w-full max-w-full overflow-x-hidden font-sans">
      {/* ============================================================== */}
      {/* 02. HERO BANNER SECTION (Warm Ivory / Traditional Elegance)     */}
      {/* ============================================================== */}
      <section
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        className="relative w-full max-w-full overflow-hidden border-b border-[#E8E2D5]/60 bg-[#FAF7F2]"
      >
        <div className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] flex items-center">
          {/* Full-bleed background image spanning 100% of viewport width */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.fullWidthImage || slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover object-[75%_center] sm:object-[center_right] lg:object-center select-none"
            />
            {/* Soft gradient mask for pristine text contrast on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/80 sm:via-[#FAF7F2]/60 to-transparent w-full md:w-[70%] lg:w-[55%] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Top-Left Botanical Watermark */}
          <div className="absolute top-2 sm:top-6 left-2 sm:left-6 pointer-events-none opacity-40 select-none z-10">
            <BotanicalBranch className="w-28 h-28 sm:w-44 sm:h-44 text-[#C5A059]" />
          </div>

          {/* Top-Right NALMARA FASHION Gold Watermark */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-10 pointer-events-none select-none hidden sm:flex flex-col items-center">
            <LotusIcon className="w-7 h-5 sm:w-8 sm:h-6 text-[#D4AF37] drop-shadow-sm" />
            <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.22em] text-[#D4AF37] uppercase drop-shadow-sm mt-0.5">
              NALMARA
            </span>
            <span className="font-serif font-semibold text-[6px] sm:text-[7px] tracking-[0.34em] text-[#D4AF37]/90 uppercase drop-shadow-sm">
              FASHION
            </span>
          </div>

          {/* Content container */}
          <div className="relative z-10 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20">
            <div className="max-w-xl space-y-4 sm:space-y-6 text-left">
              {/* Kicker - exact elegant italic serif matching mockup */}
              <p className="font-serif italic text-[#8C6D2D] text-sm sm:text-base lg:text-lg tracking-normal font-normal">
                {slide.tag}
              </p>

              {/* Stately Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A]">
                {slide.title.includes(' ') ? (
                  <>
                    <span className="block">{slide.title.split(' ')[0]}</span>
                    <span className="block">{slide.title.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-light whitespace-pre-line max-w-md">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Link
                  href={slide.primaryLink}
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 rounded-full bg-[#18181B] hover:bg-[#2A060C] text-white text-xs sm:text-sm font-medium tracking-wider uppercase transition-all shadow-md hover:shadow-lg group cursor-pointer"
                >
                  <span>{slide.primaryText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={slide.secondaryLink}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white/80 hover:bg-white text-zinc-900 border border-[#D5C7B0] hover:border-[#8C6D2D] text-xs sm:text-sm font-medium tracking-wider uppercase transition-all shadow-2xs backdrop-blur-xs cursor-pointer"
                >
                  <span>{slide.secondaryText}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/60 shadow-xs">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentHeroSlide === idx
                    ? 'w-7 h-2 bg-[#18181B]'
                    : 'w-2 h-2 bg-zinc-400 hover:bg-zinc-700'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Carousel Left / Right Arrows */}
          <button
            onClick={prevHeroSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center transition-all border border-[#E8E2D5] shadow-sm hover:shadow-md hover:scale-105 cursor-pointer backdrop-blur-xs"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center transition-all border border-[#E8E2D5] shadow-sm hover:shadow-md hover:scale-105 cursor-pointer backdrop-blur-xs"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 03. TRUST BADGES / VALUE PROPOSITIONS BAR                      */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 -mt-5 sm:-mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-[#E8E2D5] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-3 sm:p-5 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5]">
            {/* 1. Carefully Packed */}
            <div className="p-2 sm:p-3 flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all shadow-2xs shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight truncate">
                  Carefully Packed
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-light truncate">
                  with Love
                </p>
              </div>
            </div>

            {/* 2. Premium Quality */}
            <div className="p-2 sm:p-3 flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all shadow-2xs shrink-0">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight truncate">
                  Premium Quality
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-light truncate">
                  Fabrics
                </p>
              </div>
            </div>

            {/* 3. Easy Returns */}
            <div className="p-2 sm:p-3 flex items-center gap-2.5 sm:gap-3 group pt-2 sm:pt-3 md:pt-2 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all shadow-2xs shrink-0">
                <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight truncate">
                  Easy Returns
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-light truncate">
                  &amp; Exchanges
                </p>
              </div>
            </div>

            {/* 4. WhatsApp Support */}
            <div className="p-2 sm:p-3 flex items-center gap-2.5 sm:gap-3 group pt-2 sm:pt-3 md:pt-2 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all shadow-2xs shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight truncate">
                  WhatsApp Support
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 font-light truncate">
                  6380163909 | 7871207651
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 04. SHOP BY CATEGORY (Haute Couture Luxury Pearl Edition)      */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 my-6 sm:my-8">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: Luminous Pearl Silk Canvas with Auto-Slide (hidden md:block) */}
        {/* ========================================================================= */}
        <div
          className="hidden md:block relative w-full aspect-[2048/820] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(184,142,40,0.22)] border-2 border-[#D4AF37]/50 bg-[#FAF7F2] select-none group/sec"
          onMouseEnter={() => setIsCategoryPaused(true)}
          onMouseLeave={() => setIsCategoryPaused(false)}
        >
          {/* Authentic High-Resolution Pearlescent Ivory Silk Fabric Background */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/images/nalmara/category_pearl_silk_desktop_bg.jpg"
              alt="Pearlescent Silk Background"
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Inner Hairline 24K Gold Border with Corner Accents */}
          <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-2xl pointer-events-none z-10" />
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none z-10" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none z-10" />

          {/* Master Content Layer */}
          <div className="relative z-20 h-full flex flex-col justify-between py-5 px-8 lg:py-6 lg:px-12">
            {/* Top Royal Header */}
            <div className="flex flex-col items-center text-center">
              {/* Crown Lotus Crest with Gold Rays */}
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="h-[1px] w-12 lg:w-20 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <LotusIcon className="w-7 h-7 text-[#B88E28] drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
                <span className="h-[1px] w-12 lg:w-20 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              {/* Title & View All CTA Row */}
              <div className="relative w-full flex items-center justify-center">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1A0E08] tracking-tight drop-shadow-xs">
                  Shop by{' '}
                  <span className="font-script text-5xl sm:text-6xl lg:text-7xl font-normal text-[#5A0A17] italic ml-1.5 drop-shadow-xs">
                    Category
                  </span>
                </h2>

                {/* Top Right "View All →" Luxury Button */}
                <Link
                  href="/shop"
                  title="Explore All Categories"
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full border border-[#B38728]/80 bg-[#FAF4EB]/80 hover:bg-[#5C0612] text-xs font-serif font-semibold tracking-wider text-[#3B0A11] hover:text-[#FFE59E] transition-all duration-300 shadow-[0_3px_12px_rgba(184,142,40,0.18)] flex items-center gap-2 cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Lotus Filigree & Subtitle */}
              <div className="flex items-center justify-center gap-2 mt-1 text-[#B88E28]">
                <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <LotusIcon className="w-2.5 h-2.5 text-[#C5A059]" />
                <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>
              <p className="text-xs lg:text-[13px] font-serif italic text-[#5C4A32] tracking-wider mt-0.5">
                Explore our handpicked collections for every occasion
              </p>
            </div>

            {/* Center Carousel Track with 5 Visible Grand Cards */}
            <div className="relative w-full my-auto px-8 lg:px-12">
              {/* Left Carousel Arrow (<) */}
              <button
                onClick={handlePrevCategory}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-[#C5A059] bg-[#FFFDF9]/95 shadow-[0_4px_16px_rgba(184,142,40,0.2)] hover:bg-[#5C0612] text-[#4A0A10] hover:text-[#FFE59E] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Previous Category"
                title="Previous Category"
              >
                <ChevronLeft className="w-5 h-5 text-current" />
              </button>

              {/* Right Carousel Arrow (>) */}
              <button
                onClick={handleNextCategory}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-[#C5A059] bg-[#FFFDF9]/95 shadow-[0_4px_16px_rgba(184,142,40,0.2)] hover:bg-[#5C0612] text-[#4A0A10] hover:text-[#FFE59E] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
                aria-label="Next Category"
                title="Next Category"
              >
                <ChevronRight className="w-5 h-5 text-current" />
              </button>

              {/* 5-Card Grid Track */}
              <div className="grid grid-cols-5 gap-3 lg:gap-5 items-end justify-center">
                {[0, 1, 2, 3, 4].map((offset) => {
                  const total = categories && categories.length > 0 ? categories.length : CATEGORIES_DATA.length;
                  const catIdx = (activeCategoryIndex + offset) % total;
                  const cat = (categories && categories[catIdx]) || CATEGORIES_DATA[catIdx % CATEGORIES_DATA.length];
                  if (!cat) return null;

                  return (
                    <Link
                      key={cat.id || cat.slug || offset}
                      href={cat.link || `/shop?category=${cat.slug}`}
                      title={`Explore ${cat.title || cat.name}`}
                      className="group flex flex-col items-center transition-all duration-500 transform hover:-translate-y-1.5 cursor-pointer"
                    >
                      {/* Sculpted 24K Gold Circular Photo Frame */}
                      <div className="relative w-32 h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full border-[2.5px] border-[#C8A251] ring-2 ring-[#FAF5ED] ring-offset-2 ring-offset-[#C8A251]/30 shadow-[0_12px_28px_rgba(180,140,60,0.22)] group-hover:shadow-[0_18px_38px_rgba(212,175,55,0.4)] overflow-hidden bg-white transition-all duration-500 group-hover:scale-105">
                        <Image
                          src={cat.image || '/images/categories/sarees.jpg'}
                          alt={cat.title || cat.name}
                          fill
                          unoptimized
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 select-none"
                        />
                      </div>

                      {/* Imperial Garnet & 24K Gold Medallion Icon Badge */}
                      <div className="relative z-20 -mt-5 lg:-mt-6 group-hover:scale-110 transition-transform duration-300">
                        <RoyalMedallionBadge slug={cat.slug} className="w-10 h-10 lg:w-11 lg:h-11" />
                      </div>

                      {/* Scalloped Ivory Cartouche Plaque */}
                      <div className="relative w-full max-w-[155px] lg:max-w-[185px] mt-1.5 group-hover:scale-105 transition-all duration-300">
                        <svg viewBox="0 0 200 58" className="absolute inset-0 w-full h-full filter drop-shadow-[0_6px_16px_rgba(180,140,60,0.18)]" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`ivoryCardGrad-${offset}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#FFFDF9" />
                              <stop offset="50%" stopColor="#FAF5EC" />
                              <stop offset="100%" stopColor="#F5ECE0" />
                            </linearGradient>
                          </defs>
                          {/* Outer smooth bracketed cartouche */}
                          <path
                            d="M 18 2 L 182 2 C 192 2 198 8 198 18 L 198 40 C 198 50 192 56 182 56 L 18 56 C 8 56 2 50 2 40 L 2 18 C 2 8 8 2 18 2 Z"
                            fill={`url(#ivoryCardGrad-${offset})`}
                            stroke="#C8A251"
                            strokeWidth="1.2"
                          />
                          {/* Inner hairline accent */}
                          <path
                            d="M 20 5 L 180 5 C 188 5 194 10 194 18 L 194 40 C 194 48 188 53 180 53 L 20 53 C 12 53 6 48 6 40 L 6 18 C 6 10 12 5 20 5 Z"
                            fill="none"
                            stroke="#C8A251"
                            strokeWidth="0.6"
                            strokeOpacity="0.55"
                          />
                        </svg>
                        <div className="relative z-10 py-2 px-2.5 lg:py-2.5 text-center">
                          <span className="block font-serif font-bold text-xs lg:text-[14px] text-[#3B0710] tracking-wide truncate group-hover:text-[#6B0D1A] transition-colors">
                            {cat.title || cat.name}
                          </span>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[#B88E28]">
                            <span className="h-[1px] w-4 lg:w-5 bg-gradient-to-r from-transparent to-[#C8A251]" />
                            <LotusIcon className="w-2.5 h-2.5 text-[#C8A251]" />
                            <span className="h-[1px] w-4 lg:w-5 bg-gradient-to-l from-transparent to-[#C8A251]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Jewel Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pb-1">
              {categories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIndex(idx)}
                  title={`Go to ${categories[idx]?.title || 'Category'} ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'w-6 h-2 bg-[#4A0A10] border border-[#C8A251]/60 shadow-xs'
                      : 'w-2 h-2 bg-[#D8C7AA] hover:bg-[#C8A251]'
                  }`}
                  aria-label={`Category slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW: Portrait Pearl Silk Canvas with Auto-Slide (md:hidden)       */}
        {/* ========================================================================= */}
        <div
          className="md:hidden relative w-full aspect-[1364/2048] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(184,142,40,0.25)] border-2 border-[#D4AF37]/50 bg-[#FAF7F2] select-none"
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
          {/* Authentic High-Resolution Vertical Pearlescent Ivory Silk Background */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none">
            <Image
              src="/images/nalmara/category_pearl_silk_mobile_bg.jpg"
              alt="Pearlescent Silk Mobile Background"
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Inner Hairline 24K Gold Border */}
          <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-2xl pointer-events-none z-10" />

          {/* Mobile Master Content Layer */}
          <div className="relative z-20 h-full flex flex-col justify-between py-6 px-4">
            {/* Top Royal Header */}
            <div className="flex flex-col items-center text-center pt-2">
              {/* Crown Lotus Crest with Gold Rays */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <LotusIcon className="w-8 h-8 text-[#B88E28] drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              <h2 className="font-serif text-3xl font-bold text-[#1A0E08] tracking-tight leading-tight drop-shadow-xs">
                Shop by
              </h2>
              <div className="font-script text-5xl text-[#5A0A17] italic font-normal -mt-1 mb-1 drop-shadow-xs">
                Category
              </div>

              {/* Lotus divider */}
              <div className="flex items-center justify-center gap-2 text-[#B88E28] my-1">
                <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <LotusIcon className="w-3 h-3 text-[#C5A059]" />
                <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              <p className="text-xs font-serif italic text-[#5C4A32] max-w-[260px] mx-auto leading-relaxed mt-0.5">
                Explore our handpicked collections<br />for every occasion
              </p>
            </div>

            {/* 3-Card Stage with Prominent Center Active Category */}
            <div className="relative flex items-center justify-center py-2 my-auto">
              {/* Left Preview Card */}
              {(() => {
                const total = categories && categories.length > 0 ? categories.length : CATEGORIES_DATA.length;
                const prevIdx = (activeCategoryIndex - 1 + total) % total;
                const prevCat = (categories && categories[prevIdx]) || CATEGORIES_DATA[prevIdx % CATEGORIES_DATA.length];
                return (
                  <button
                    type="button"
                    onClick={handlePrevCategory}
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center opacity-45 scale-75 transform hover:opacity-75 transition-all duration-500 cursor-pointer pointer-events-auto"
                    aria-label="Previous Category"
                  >
                    <div className="relative w-36 h-36 rounded-full border-2 border-[#C8A251] ring-2 ring-[#FAF5ED] shadow-md overflow-hidden bg-white">
                      <Image
                        src={prevCat?.image || '/images/categories/sarees.jpg'}
                        alt={prevCat?.title || ''}
                        fill
                        unoptimized
                        className="object-cover object-center select-none"
                      />
                    </div>
                  </button>
                );
              })()}

              {/* Left Circular Arrow (<) */}
              <button
                onClick={handlePrevCategory}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-[#C5A059] bg-[#FFFDF9]/95 shadow-[0_4px_14px_rgba(184,142,40,0.25)] hover:bg-[#5C0612] text-[#4A0A10] hover:text-[#FFE59E] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Previous Category"
                title="Previous Category"
              >
                <ChevronLeft className="w-6 h-6 text-current" />
              </button>

              {/* Center Active Category Card (Prominent Royal Gem) */}
              {(() => {
                const total = categories && categories.length > 0 ? categories.length : CATEGORIES_DATA.length;
                const currentCat = (categories && categories[activeCategoryIndex]) || CATEGORIES_DATA[activeCategoryIndex % CATEGORIES_DATA.length];
                if (!currentCat) return null;

                return (
                  <Link
                    href={currentCat.link || `/shop?category=${currentCat.slug}`}
                    title={`Explore ${currentCat.title || currentCat.name}`}
                    className="relative z-20 flex flex-col items-center transform transition-all duration-500 cursor-pointer group"
                  >
                    {/* Large Center Circle with 24K Gold Rim */}
                    <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full border-[3px] border-[#C8A251] ring-3 ring-[#FAF5ED] ring-offset-2 ring-offset-[#C8A251]/30 shadow-[0_16px_38px_rgba(180,140,60,0.35)] overflow-hidden bg-white group-active:scale-95 transition-transform duration-300">
                      <Image
                        src={currentCat.image || '/images/categories/sarees.jpg'}
                        alt={currentCat.title || currentCat.name}
                        fill
                        unoptimized
                        priority
                        className="object-cover object-center select-none"
                      />
                    </div>

                    {/* Imperial Garnet & Gold Medallion Icon Badge */}
                    <div className="relative z-30 -mt-6 group-active:scale-110 transition-transform duration-200">
                      <RoyalMedallionBadge slug={currentCat.slug} className="w-12 h-12" />
                    </div>

                    {/* Scalloped Ivory Cartouche Plaque */}
                    <div className="relative w-56 mt-2 group-active:scale-95 transition-transform duration-200">
                      <svg viewBox="0 0 220 60" className="absolute inset-0 w-full h-full filter drop-shadow-[0_8px_18px_rgba(180,140,60,0.2)]" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="ivoryCardGradMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFDF9" />
                            <stop offset="50%" stopColor="#FAF5EC" />
                            <stop offset="100%" stopColor="#F5ECE0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 20 2 L 200 2 C 210 2 218 8 218 18 L 218 42 C 218 52 210 58 200 58 L 20 58 C 10 58 2 52 2 42 L 2 18 C 2 8 10 2 20 2 Z"
                          fill="url(#ivoryCardGradMobile)"
                          stroke="#C8A251"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M 22 5 L 198 5 C 206 5 214 10 214 18 L 214 42 C 214 50 206 55 198 55 L 22 55 C 14 55 6 50 6 42 L 6 18 C 6 10 14 5 22 5 Z"
                          fill="none"
                          stroke="#C8A251"
                          strokeWidth="0.65"
                          strokeOpacity="0.55"
                        />
                      </svg>
                      <div className="relative z-10 py-2.5 px-4 text-center">
                        <span className="block font-serif font-bold text-base text-[#3B0710] tracking-wide truncate">
                          {currentCat.title || currentCat.name}
                        </span>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 text-[#B88E28]">
                          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C8A251]" />
                          <LotusIcon className="w-3 h-3 text-[#C8A251]" />
                          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C8A251]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              {/* Right Circular Arrow (>) */}
              <button
                onClick={handleNextCategory}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-[#C5A059] bg-[#FFFDF9]/95 shadow-[0_4px_14px_rgba(184,142,40,0.25)] hover:bg-[#5C0612] text-[#4A0A10] hover:text-[#FFE59E] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                aria-label="Next Category"
                title="Next Category"
              >
                <ChevronRight className="w-6 h-6 text-current" />
              </button>

              {/* Right Preview Card */}
              {(() => {
                const total = categories && categories.length > 0 ? categories.length : CATEGORIES_DATA.length;
                const nextIdx = (activeCategoryIndex + 1) % total;
                const nextCat = (categories && categories[nextIdx]) || CATEGORIES_DATA[nextIdx % CATEGORIES_DATA.length];
                return (
                  <button
                    type="button"
                    onClick={handleNextCategory}
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center opacity-45 scale-75 transform hover:opacity-75 transition-all duration-500 cursor-pointer pointer-events-auto"
                    aria-label="Next Category"
                  >
                    <div className="relative w-36 h-36 rounded-full border-2 border-[#C8A251] ring-2 ring-[#FAF5ED] shadow-md overflow-hidden bg-white">
                      <Image
                        src={nextCat?.image || '/images/categories/sarees.jpg'}
                        alt={nextCat?.title || ''}
                        fill
                        unoptimized
                        className="object-cover object-center select-none"
                      />
                    </div>
                  </button>
                );
              })()}
            </div>

            {/* Bottom Jewel Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pb-2">
              {categories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIndex(idx)}
                  title={`Go to ${categories[idx]?.title || 'Category'} ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'w-6 h-2 bg-[#4A0A10] border border-[#C8A251]/60 shadow-xs'
                      : 'w-2 h-2 bg-[#D8C7AA] hover:bg-[#C8A251]'
                  }`}
                  aria-label={`Category slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 05. FESTIVE COLLECTION (Ultra-HD Premium Luxury Edition)       */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 relative">
        {/* Subtle royal background atmosphere */}
        <div className="absolute left-1 top-2 pointer-events-none opacity-20 select-none hidden lg:block">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute right-1 bottom-2 pointer-events-none opacity-20 select-none hidden lg:block rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        {/* Desktop View: 100% Coded Luxury Master Festive Banner */}
        <div className="hidden md:block relative w-full aspect-[1024/364] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(46,6,13,0.45)] bg-[#170206] select-none">
          {/* Inner hairline gold border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl pointer-events-none z-30" />

          {/* Delicate 24K gold corner accents */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-4 h-4 border-t-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-4 h-4 border-t-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-4 h-4 border-b-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-4 h-4 border-b-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />

          {/* Background High-Definition Photographic Canvas (saree, thali, diya lamps, model) */}
          <Image
            src="/images/nalmara/festive_panoramic_hd.jpg"
            alt="NALMARA Festive Collection"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 select-none z-0"
          />

          {/* Seamless Deep Wine Gradient Overlays for High-Contrast Typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#170206] via-[#170206]/90 via-38% to-transparent pointer-events-none z-10" />

          {/* Corner Floral Flourish in bottom-left */}
          <div className="absolute left-2 bottom-2 pointer-events-none opacity-40 z-20 hidden lg:block">
            <BotanicalBranch className="w-24 h-24 text-[#C5A059]" />
          </div>

          {/* Left Master Content: 100% Coded Luxury Typography & Branding */}
          <div className="relative z-20 h-full w-[45%] lg:w-[40%] xl:w-[37%] flex flex-col justify-center items-start text-left pl-7 sm:pl-10 lg:pl-12 py-6">
            {/* Top Brand Logo & Monogram Crest */}
            <div className="flex items-center gap-3 sm:gap-3.5 mb-2.5 sm:mb-3 lg:mb-4">
              {/* Ornate Double-Rim Circular Monogram Crest */}
              <div className="relative w-13 h-13 sm:w-15 sm:h-15 lg:w-16 lg:h-16 rounded-full border border-[#D4AF37]/80 p-[2.5px] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.6)] shrink-0">
                <div className="w-full h-full rounded-full border border-[#FFE59E]/50 flex flex-col items-center justify-center bg-gradient-to-b from-[#2E050D] via-[#1A0207] to-black relative">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5C158] drop-shadow-[0_1px_4px_rgba(229,193,88,0.7)] -mb-0.5" />
                  <span className="font-serif font-black text-xs sm:text-sm tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#FFE59E] to-[#D4AF37] leading-none">
                    NM
                  </span>
                  <span className="text-[5px] sm:text-[6px] font-serif uppercase tracking-[0.2em] text-[#E5C158] font-bold leading-none mt-0.5">
                    NALMARA
                  </span>
                  <span className="text-[4px] sm:text-[5px] tracking-[0.28em] text-[#D4AF37]/90 uppercase font-semibold leading-none">
                    FASHION
                  </span>
                </div>
              </div>

              {/* Brand Typography Stack */}
              <div className="flex flex-col justify-center">
                <span className="font-serif tracking-[0.3em] text-xs sm:text-sm lg:text-base font-bold text-white uppercase leading-none drop-shadow-sm">
                  NALMARA
                </span>
                <span className="tracking-[0.45em] text-[8px] sm:text-[9px] lg:text-[10px] text-[#E5C158] uppercase font-semibold leading-none mt-1">
                  FASHION
                </span>
                <span className="tracking-[0.22em] text-[6.5px] sm:text-[7.5px] lg:text-[8.5px] text-[#D8C28A] uppercase font-medium leading-none mt-1.5">
                  YOUR TRADITION. YOUR ELEGANCE.
                </span>
              </div>
            </div>

            {/* Subheading: TRADITIONAL ELEGANCE */}
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Crown className="w-2.5 h-2.5 text-[#E5C158]" />
              <span className="text-[9px] sm:text-[10.5px] lg:text-[11.5px] font-semibold tracking-[0.26em] text-[#E5C158] uppercase">
                TRADITIONAL ELEGANCE
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Main Headline: Festive Collection */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white font-bold tracking-tight leading-none mb-1.5 sm:mb-2 drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
              Festive{' '}
              <span className="font-script text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFE8AA] via-[#F4D27F] to-[#C99E3A] italic ml-1 drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                Collection
              </span>
            </h2>

            {/* Tagline */}
            <p className="text-[9px] sm:text-[10.5px] lg:text-xs font-serif uppercase tracking-[0.24em] text-[#E8D6B0]/95 font-medium mb-3 sm:mb-4 lg:mb-5">
              CELEBRATE TRADITION &nbsp;|&nbsp; EMBRACE ELEGANCE
            </p>

            {/* CTA Button: Explore Collection → */}
            <Link
              href="/shop?category=festive"
              title="Explore Festive Collection"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full border border-[#D4AF37] bg-black/55 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#170206] transition-all duration-300 text-[11px] sm:text-xs font-serif font-semibold tracking-wider group shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_22px_rgba(212,175,55,0.5)] backdrop-blur-xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Miniature Lotus Accent below button */}
            <div className="flex items-center gap-1.5 mt-2.5 sm:mt-3 text-[#D4AF37]">
              <span className="h-[1px] w-5 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <LotusIcon className="w-3 h-3 text-[#E5C158]" />
              <span className="h-[1px] w-5 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
          </div>

          {/* Right Arched Trust Badges Panel (100% Coded Luxury Icons) */}
          <div className="absolute right-0 inset-y-0 z-20 flex flex-col justify-around py-4 sm:py-5 lg:py-6 px-3 sm:px-4 lg:px-5 w-28 sm:w-32 lg:w-36 rounded-l-3xl border-l border-[#D4AF37]/35 bg-gradient-to-l from-[#170206]/80 via-[#170206]/60 to-transparent backdrop-blur-[2px]">
            {/* Badge 1: Premium Silk Sarees */}
            <div className="flex flex-col items-center text-center group/badge cursor-default">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] mb-1 transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#FFE59E] group-hover/badge:shadow-[0_0_14px_rgba(229,193,88,0.5)] bg-black/50">
                <LotusIcon className="w-4 h-4 text-[#E5C158]" />
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-serif text-[#F2E7D5] leading-tight font-medium tracking-wide">
                Premium<br />Silk Sarees
              </span>
            </div>

            {/* Badge 2: Authentic Craftsmanship */}
            <div className="flex flex-col items-center text-center group/badge cursor-default">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] mb-1 transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#FFE59E] group-hover/badge:shadow-[0_0_14px_rgba(229,193,88,0.5)] bg-black/50">
                <Gem className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-serif text-[#F2E7D5] leading-tight font-medium tracking-wide">
                Authentic<br />Craftsmanship
              </span>
            </div>

            {/* Badge 3: Secure Delivery */}
            <div className="flex flex-col items-center text-center group/badge cursor-default">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] mb-1 transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#FFE59E] group-hover/badge:shadow-[0_0_14px_rgba(229,193,88,0.5)] bg-black/50">
                <Package className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-serif text-[#F2E7D5] leading-tight font-medium tracking-wide">
                Secure<br />Delivery
              </span>
            </div>

            {/* Badge 4: Made with Love */}
            <div className="flex flex-col items-center text-center group/badge cursor-default">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] mb-1 transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#FFE59E] group-hover/badge:shadow-[0_0_14px_rgba(229,193,88,0.5)] bg-black/50">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-serif text-[#F2E7D5] leading-tight font-medium tracking-wide">
                Made with<br />Love
              </span>
            </div>
          </div>
        </div>

        {/* Mobile View: 100% Coded Luxury Master Festive Banner */}
        <div className="md:hidden relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 bg-[#170206] select-none p-5 text-white flex flex-col justify-between min-h-[640px]">
          {/* Background image & gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/nalmara/festive_panoramic_hd.jpg"
              alt="NALMARA Festive Collection"
              fill
              priority
              unoptimized
              className="object-cover object-[75%_center] select-none opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#170206] via-[#170206]/85 to-[#170206]/95" />
          </div>

          {/* Inner hairline gold border */}
          <div className="absolute inset-2.5 border border-[#D4AF37]/35 rounded-2xl pointer-events-none z-20" />

          {/* Top Brand Logo & Typography */}
          <div className="relative z-10 flex flex-col items-center text-center pt-2">
            {/* Crest Logo */}
            <div className="relative w-14 h-14 rounded-full border border-[#D4AF37]/80 p-[2px] flex items-center justify-center shadow-md mb-2">
              <div className="w-full h-full rounded-full border border-[#FFE59E]/50 flex flex-col items-center justify-center bg-gradient-to-b from-[#2E050D] via-[#1A0207] to-black">
                <Crown className="w-3 h-3 text-[#E5C158] -mb-0.5" />
                <span className="font-serif font-black text-xs tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF9] via-[#FFE59E] to-[#D4AF37] leading-none">
                  NM
                </span>
                <span className="text-[5px] font-serif uppercase tracking-[0.2em] text-[#E5C158] font-bold leading-none mt-0.5">
                  NALMARA
                </span>
              </div>
            </div>

            <span className="font-serif tracking-[0.28em] text-xs font-bold text-white uppercase leading-none">
              NALMARA FASHION
            </span>
            <span className="tracking-[0.2em] text-[7.5px] text-[#D8C28A] uppercase font-medium mt-1">
              YOUR TRADITION. YOUR ELEGANCE.
            </span>

            {/* Subheading: TRADITIONAL ELEGANCE */}
            <div className="flex items-center gap-2 mt-3 mb-1">
              <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Crown className="w-2.5 h-2.5 text-[#E5C158]" />
              <span className="text-[9.5px] font-semibold tracking-[0.25em] text-[#E5C158] uppercase">
                TRADITIONAL ELEGANCE
              </span>
              <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight leading-none my-1">
              Festive{' '}
              <span className="font-script text-4xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFE8AA] via-[#F4D27F] to-[#C99E3A] italic ml-1">
                Collection
              </span>
            </h2>

            {/* Tagline */}
            <p className="text-[9.5px] font-serif uppercase tracking-[0.22em] text-[#E8D6B0]/90 font-medium mb-3">
              CELEBRATE TRADITION &nbsp;|&nbsp; EMBRACE ELEGANCE
            </p>

            {/* CTA Button */}
            <Link
              href="/shop?category=festive"
              title="Explore Festive Collection"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37] bg-black/60 active:bg-[#D4AF37] text-[#FFE59E] active:text-[#170206] transition-all text-xs font-serif font-semibold tracking-wider shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Center Showcase Card */}
          <div className="relative z-10 my-4 w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-lg">
            <Image
              src="/images/nalmara/festive_panoramic_hd.jpg"
              alt="Festive Silk Saree"
              fill
              unoptimized
              className="object-cover object-[50%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-serif">
              <span>Pure Zari Kanchipuram</span>
              <span className="text-[#FFE59E]">Special Edition</span>
            </div>
          </div>

          {/* 4 Bottom Trust Badges (2x2 Grid) */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40">
              <div className="w-7 h-7 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] bg-black/50 shrink-0">
                <LotusIcon className="w-3.5 h-3.5 text-[#E5C158]" />
              </div>
              <span className="text-[9px] font-serif text-[#F2E7D5] leading-tight font-medium">
                Premium Silk Sarees
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40">
              <div className="w-7 h-7 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] bg-black/50 shrink-0">
                <Gem className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-serif text-[#F2E7D5] leading-tight font-medium">
                Authentic Craftsmanship
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40">
              <div className="w-7 h-7 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] bg-black/50 shrink-0">
                <Package className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-serif text-[#F2E7D5] leading-tight font-medium">
                Secure Delivery
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40">
              <div className="w-7 h-7 rounded-full border border-[#D4AF37]/70 flex items-center justify-center text-[#E5C158] bg-black/50 shrink-0">
                <Heart className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-serif text-[#F2E7D5] leading-tight font-medium">
                Made with Love
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 06. NEW ARRIVALS                                               */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">
              Fresh styles. Trendy picks. Just for you.
            </p>
          </div>
          <Link
            href="/shop?filter=new-arrivals"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#132E27] transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5 Product Cards Grid (Desktop: 5 cols, Mobile: 2 cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {(newArrivals && newArrivals.length > 0 ? newArrivals.slice(0, 5) : NEW_ARRIVALS_DATA).map((prod) => {
            const prodId = prod._id || prod.id;
            const inWish = isInWishlist(prodId);
            const prodImg = prod.images?.[0]?.url || prod.image || '/images/bestsellers/traditional_silk_saree.jpg';
            const priceText = prod.priceDisplay || (prod.price ? formatCurrency(prod.price) : '₹799');
            const ratingVal = prod.rating || 4.8;
            const reviewsCount = prod.reviewsCount || prod.numReviews || 89;

            return (
              <div
                key={prodId}
                className="group bg-white rounded-2xl border border-[#E8E2D5] hover:border-[#D4AF37] overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Wishlist Button */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                  <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                    <Image
                      src={prodImg}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                  </Link>
                  <button
                    onClick={(e) => handleWishlistToggle(prod, e)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center transition-all shadow-sm z-10 cursor-pointer hover:scale-110"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        inWish ? 'fill-rose-600 text-rose-600' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${prod.slug}`}>
                      <h3 className="font-serif font-bold text-xs sm:text-sm text-zinc-900 line-clamp-1 leading-snug group-hover:text-[#132E27] transition-colors">
                        {prod.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-xs sm:text-sm text-zinc-900">
                        {priceText}
                      </span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                          {formatCurrency(prod.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[#D4AF37] text-[10px] sm:text-xs mt-1">
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <span className="font-semibold text-zinc-800">{ratingVal}</span>
                      <span className="text-zinc-400 font-light">({reviewsCount})</span>
                    </div>

                    {/* Color Swatches */}
                    {Array.isArray(prod.colors) && prod.colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {prod.colors.map((c: any, i: number) => {
                          const hexColor = typeof c === 'string' ? c : c.hex || '#4A0E17';
                          return (
                            <span
                              key={i}
                              className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: hexColor }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(prod, e)}
                    className="w-full mt-2 py-1.5 sm:py-2 px-3 rounded-full bg-[#18181B] hover:bg-[#132E27] text-white text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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

              {/* Cards Track: 6-column on large screens */}
              <div
                ref={bestsellersContainerRef}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
              >
                {BESTSELLERS_DATA.map((prod) => {
                  const prodId = prod._id;
                  const inWish = isInWishlist(prodId);

                  return (
                    <div
                      key={prodId}
                      className="group bg-[#FFFDF9] rounded-xl sm:rounded-2xl border border-[#D4AF37]/45 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-[1/1] w-full overflow-hidden bg-zinc-100">
                        <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            unoptimized
                            className="object-cover object-top group-hover:scale-106 transition-transform duration-700"
                          />
                        </Link>

                        {/* Top-Left Badge Pill (Wine with gold icon & gold text) */}
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#42060E]/95 border border-[#D4AF37]/50 text-[#F5D57F] text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-xs">
                          {prod.badgeType === 'crown' && <Crown className="w-2.5 h-2.5 text-[#F5D57F]" />}
                          {prod.badgeType === 'flame' && <Flame className="w-2.5 h-2.5 text-[#F5D57F]" />}
                          {prod.badgeType === 'star' && <Star className="w-2.5 h-2.5 fill-[#F5D57F] text-[#F5D57F]" />}
                          <span>{prod.badge}</span>
                        </div>

                        {/* Top-Right Wishlist Button */}
                        <button
                          onClick={(e) => handleWishlistToggle(prod, e)}
                          className="absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#180306]/80 border border-[#D4AF37]/60 hover:bg-[#D4AF37] text-white hover:text-[#180306] flex items-center justify-center transition-all shadow-sm cursor-pointer hover:scale-110 active:scale-95"
                          aria-label="Save to wishlist"
                        >
                          <Heart
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                              inWish ? 'fill-rose-500 text-rose-500' : 'text-white'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Info: Cream Footer */}
                      <div className="p-2.5 sm:p-3 bg-[#FFFDF9] flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/product/${prod.slug}`}>
                            <h3 className="font-serif font-bold text-xs sm:text-[13px] text-zinc-900 truncate group-hover:text-[#4A0E17] transition-colors">
                              {prod.name}
                            </h3>
                          </Link>
                          {/* Price & Rating */}
                          <div className="flex items-center justify-between mt-1 gap-1">
                            <span className="font-bold text-xs sm:text-[13px] text-zinc-900">
                              {prod.priceDisplay}
                            </span>
                            <div className="flex items-center gap-0.5 text-[10px] text-zinc-600 font-medium">
                              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                              <span>{prod.rating}</span>
                              <span className="text-zinc-400">({prod.reviewsCount})</span>
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(prod, e)}
                          className="w-full mt-2.5 py-1.5 px-2.5 rounded-full bg-[#35070E] hover:bg-[#D4AF37] text-white hover:text-[#180306] text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
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
      {/* 08. DUAL PROMO BANNER (100% Coded Luxury Component)            */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Wedding Special */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#2B050C] via-[#1D0308] to-[#120205] group transition-all duration-500 hover:shadow-[0_20px_45px_rgba(43,5,12,0.4)] min-h-[220px] sm:min-h-[260px] flex items-center">
            {/* Background Model Photo on Right */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] z-0">
              <Image
                src="/images/bestsellers/bridal_lehenga.jpg"
                alt="Wedding Special"
                fill
                priority
                unoptimized
                className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B050C] via-[#2B050C]/80 via-30% to-transparent pointer-events-none" />
            </div>

            {/* Inner hairline border */}
            <div className="absolute inset-2.5 border border-[#D4AF37]/30 rounded-xl sm:rounded-2xl pointer-events-none z-20" />

            {/* Left Content */}
            <div className="relative z-10 w-[60%] sm:w-[55%] p-5 sm:p-7 lg:p-8 flex flex-col justify-center items-start text-left text-white">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Crown className="w-3 h-3 text-[#E5C158]" />
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-[#E5C158] uppercase">
                  WEDDING SPECIAL
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-1.5 drop-shadow-sm">
                Timeless Looks for Your Special Day
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed mb-4 line-clamp-2">
                Handpicked bridal lehengas, pure silk sarees & royal wedding ensembles.
              </p>
              <Link
                href="/shop?category=weddings"
                className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#D4AF37] bg-[#D4AF37] hover:bg-transparent text-[#170206] hover:text-[#FFE59E] transition-all duration-300 text-xs font-serif font-bold tracking-wider shadow-md group-hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Wedding Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Kids Collection */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#FFFDF9] via-[#FAF4E8] to-[#F2E7D2] group transition-all duration-500 hover:shadow-[0_20px_45px_rgba(212,175,55,0.25)] min-h-[220px] sm:min-h-[260px] flex items-center">
            {/* Background Kids Photo on Right */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] z-0">
              <Image
                src="/images/nalmara/kidswear_butterfly_gown.jpg"
                alt="Kids Collection"
                fill
                priority
                unoptimized
                className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/85 via-30% to-transparent pointer-events-none" />
            </div>

            {/* Inner hairline border */}
            <div className="absolute inset-2.5 border border-[#D4AF37]/30 rounded-xl sm:rounded-2xl pointer-events-none z-20" />

            {/* Left Content */}
            <div className="relative z-10 w-[60%] sm:w-[55%] p-5 sm:p-7 lg:p-8 flex flex-col justify-center items-start text-left text-zinc-900">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#B88E28]" />
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-[#8C6D2D] uppercase">
                  KIDS COLLECTION
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#2A060C] leading-tight mb-1.5 drop-shadow-xs">
                Little Styles, Big Smiles
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-2">
                Playful pattu pavadas, party frocks & festive sets crafted with love and soft comfort.
              </p>
              <Link
                href="/shop?category=kids-wear"
                className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#3D0811] hover:bg-[#5C0612] text-[#FFE59E] hover:text-white transition-all duration-300 text-xs font-serif font-bold tracking-wider shadow-md group-hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Kidswear</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 09. WHY CHOOSE NALMARA FASHION? (100% Coded Luxury Component)   */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5ECE0] p-6 sm:p-8 lg:p-10 select-none">
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

          {/* Inner hairline border */}
          <div className="absolute inset-2.5 sm:inset-3 border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl pointer-events-none z-10" />

          {/* Header */}
          <div className="relative z-10 flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-1 text-[#B88E28]">
              <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <LotusIcon className="w-6 h-6 text-[#B88E28] drop-shadow-xs" />
              <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A0E08] tracking-tight">
              Why Choose <span className="text-[#8C6D2D]">NALMARA FASHION?</span>
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#6B5324] tracking-wide mt-1">
              Traditional Elegance &nbsp;|&nbsp; Timeless Collections &nbsp;|&nbsp; Made with Love
            </p>
          </div>

          {/* 4 Coded Pillar Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {/* Pillar 1 */}
            <div className="group bg-[#FFFDF9]/95 hover:bg-white rounded-2xl border border-[#D4AF37]/60 p-5 sm:p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#6A0C1A] to-[#3B050D] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#FFE59E] mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#FFE59E]" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B0710] tracking-wide">
                Handpicked Styles
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-1">
                Trendy &amp; Traditional
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-[#FFFDF9]/95 hover:bg-white rounded-2xl border border-[#D4AF37]/60 p-5 sm:p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#6A0C1A] to-[#3B050D] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#FFE59E] mb-3 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-5 h-5 text-[#FFE59E]" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B0710] tracking-wide">
                Transparent Details
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-1">
                Fabric | Length | Blouse | Care
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-[#FFFDF9]/95 hover:bg-white rounded-2xl border border-[#D4AF37]/60 p-5 sm:p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#6A0C1A] to-[#3B050D] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#FFE59E] mb-3 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-5 h-5 text-[#FFE59E]" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B0710] tracking-wide">
                Personal Support
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-1">
                We&apos;re here to help
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="group bg-[#FFFDF9]/95 hover:bg-white rounded-2xl border border-[#D4AF37]/60 p-5 sm:p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#6A0C1A] to-[#3B050D] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#FFE59E] mb-3 group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5 text-[#FFE59E]" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#3B0710] tracking-wide">
                Small Business
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-1">
                With a Big Dream
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. STYLE INSPIRATION (100% Coded Luxury Component)            */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 my-8 sm:my-14">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F5ECE0] p-6 sm:p-8 lg:p-10 select-none">
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

          {/* Inner hairline border */}
          <div className="absolute inset-2.5 sm:inset-3 border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl pointer-events-none z-10" />

          {/* Header */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 text-center md:text-left">
            <div>
              <a
                href="https://instagram.com/nalmarafashion_official"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D2D] hover:text-[#5C0612] transition-colors mb-1 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Follow us on Instagram @nalmara.fashion</span>
              </a>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A0E08] tracking-tight">
                Style{' '}
                <span className="font-script text-4xl sm:text-5xl text-[#5A0A17] italic ml-1">
                  Inspiration
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-serif italic text-[#6B5324] mt-0.5">
                Traditional • Festive • Everyday Elegance
              </p>
            </div>

            {/* Instagram CTA */}
            <a
              href="https://instagram.com/nalmarafashion_official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#D4AF37] bg-white/90 hover:bg-[#5C0612] hover:text-[#FFE59E] text-xs font-serif font-semibold text-[#3B0710] transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>View More on Instagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 6 Coded Style Cards Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {[
              {
                id: 'sarees',
                title: 'Sarees',
                subtitle: 'Pure Silk Drape',
                image: '/images/categories/sarees.jpg',
                link: '/shop?category=sarees',
              },
              {
                id: 'lehengas',
                title: 'Lehengas',
                subtitle: 'Bridal Grandeur',
                image: '/images/categories/lehengas.jpg',
                link: '/shop?category=lehengas',
              },
              {
                id: 'salwar-suits',
                title: 'Salwar Suits',
                subtitle: 'Anarkali Flare',
                image: '/images/categories/salwar-suits.jpg',
                link: '/shop?category=salwar-suits',
              },
              {
                id: 'kurtis',
                title: 'Kurtis',
                subtitle: 'Chikankari Grace',
                image: '/images/categories/kurtis.jpg',
                link: '/shop?category=kurtis',
              },
              {
                id: 'kids-wear',
                title: 'Kids Wear',
                subtitle: 'Festive Gowns',
                image: '/images/nalmara/kidswear_butterfly_gown.jpg',
                link: '/shop?category=kids-wear',
              },
              {
                id: 'mens-wear',
                title: "Men's Wear",
                subtitle: 'Royal Kurta',
                image: '/images/categories/mens-wear.jpg',
                link: '/shop?category=mens-wear',
              },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.link}
                title={`${item.title} — ${item.subtitle}`}
                className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col aspect-[3/4] bg-white cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <span className="block font-serif font-bold text-sm text-white drop-shadow-sm group-hover:text-[#FFE59E] transition-colors">
                    {item.title}
                  </span>
                  <span className="block text-[10px] text-amber-200/90 font-serif italic truncate">
                    {item.subtitle}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-[#FFE59E] font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Shop Look</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Top Corner Instagram Tag */}
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-xs text-white/90 group-hover:text-[#FFE59E] group-hover:bg-black/60 transition-all">
                  <Instagram className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. NEWSLETTER & QUICK WHATSAPP SUPPORT BANNER                 */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-full overflow-hidden bg-[#132E27] text-white py-10 sm:py-14 border-t border-[#0D201B]">
        {/* Corner Botanical Flourishes */}
        <div className="absolute -top-6 -left-6 pointer-events-none opacity-20 select-none">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>
        <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-20 select-none transform rotate-180">
          <BotanicalBranch className="w-36 h-36 text-[#C5A059]" />
        </div>

        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Newsletter (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-white">
                Be the First to Discover Something Beautiful
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-lg leading-relaxed">
                Get new arrivals, exclusive offers and styling inspiration.
              </p>

              {/* Form */}
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 max-w-md w-full"
              >
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 w-full bg-white text-zinc-900 placeholder:text-zinc-400 text-xs px-5 py-3 rounded-full border border-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] min-w-0"
                />
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-[#C5A059] hover:bg-[#b08b47] text-zinc-950 text-xs font-bold tracking-wider uppercase transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800" /> Subscribed
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </form>
            </div>

            {/* Right: WhatsApp Help (lg:col-span-5) */}
            <div className="lg:col-span-5 lg:border-l lg:border-white/15 lg:pl-10 flex items-center gap-4">
              <a
                href="https://wa.me/916380163909?text=Hello%20NALMARA%20FASHION,%20I%20would%20like%20assistance"
                target="_blank"
                rel="noopener noreferrer"
                className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-108 shrink-0"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-7 h-7 fill-white" />
              </a>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-300">
                  Need Help?
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                  Chat with us on WhatsApp
                </h4>
                <p className="text-xs text-zinc-300 font-light">
                  6380163909 | 7871207651
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. BRAND STORY & WHAT OUR CUSTOMERS SAY (Side by Side)        */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (~55% width, 7 cols): Our Brand Story */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-xs p-6 sm:p-8 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Unboxing Photo (5 cols) */}
              <div className="sm:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-[#E8E2D5]">
                <Image
                  src="/images/nalmara/brand_story_box.jpg"
                  alt="Our Brand Story - NALMARA FASHION Gift Box"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Story Details (7 cols) */}
              <div className="sm:col-span-7 space-y-2.5">
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#8C6D2D]">
                  Our Brand Story
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
                  A Dream. A Brand. <br />
                  A Beautiful Beginning.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                  NALMARA FASHION is born from a love for traditional fashion and a dream to make beautiful ethnic styles accessible to every woman and child.
                </p>
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#18181B] hover:bg-[#132E27] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs"
                  >
                    <span>Discover Our Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (~45% width, 5 cols): What Our Customers Say */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
                  What Our Customers Say
                </h3>
                <p className="text-xs text-zinc-500 font-light mt-0.5">
                  Real people. Real stories.
                </p>
              </div>
              <Link
                href="/reviews"
                className="text-xs text-zinc-600 hover:text-[#132E27] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View All Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3 Review Cards */}
            <div className="space-y-3 flex-1">
              {CUSTOMER_REVIEWS_DATA.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-[#E8E2D5] p-3.5 sm:p-4 shadow-2xs hover:border-[#D4AF37] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-zinc-700 italic font-light line-clamp-2">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-900">
                        — {rev.name}
                      </span>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex text-[#D4AF37] shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 13. FREQUENTLY ASKED QUESTIONS (FAQ)                           */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14 border-t border-[#E8E2D5]/70">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">
              Quick answers to your queries.
            </p>
          </div>
          <Link
            href="/faqs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#132E27] transition-colors shrink-0"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Interactive Accordions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs hover:border-[#D4AF37] transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                    {faq.question}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-zinc-700 shrink-0 text-xs">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 font-light leading-relaxed border-t border-[#E8E2D5]/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
