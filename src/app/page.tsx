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
const CATEGORIES_DATA = [
  {
    id: 'sarees',
    title: 'Sarees',
    image: '/images/nalmara/category_sarees_stack.jpg',
    link: '/shop?category=sarees',
    slug: 'sarees',
  },
  {
    id: 'semi-kanchivaram',
    title: 'Semi Kanchivaram',
    image: '/images/nalmara/category_semi_kanchivaram.jpg',
    link: '/shop?category=semi-kanchivaram',
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
    id: 'kidswear',
    title: 'Kidswear',
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    link: '/shop?category=kids-wear',
    slug: 'kids-wear',
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
      {/* 04. SHOP BY CATEGORY                                           */}
      {/* ============================================================== */}
      <section className="relative max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        {/* Decorative botanical branch on right side (Desktop) */}
        <div className="hidden lg:block absolute -right-4 top-8 pointer-events-none opacity-30 select-none">
          <BotanicalBranch className="w-40 h-40 text-[#C5A059]" />
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">
              Explore our handpicked collections for every occasion
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#132E27] transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View: 5 Circular Story Avatars (sm:hidden) */}
        <div className="flex sm:hidden items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
          {(categories && categories.length > 0 ? categories.slice(0, 5) : CATEGORIES_DATA).map((cat) => (
            <Link
              key={cat.id || cat.slug || cat.title}
              href={cat.link || `/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[#D4AF37] group-hover:border-[#132E27] transition-all overflow-hidden bg-white shadow-xs">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image || '/images/categories/sarees.jpg'}
                    alt={cat.title || cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-zinc-800 text-center tracking-tight truncate max-w-[70px]">
                {cat.title || cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop View: 5 Rectangular Cards (hidden sm:grid) */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {(categories && categories.length > 0 ? categories.slice(0, 5) : CATEGORIES_DATA).map((cat) => (
            <Link
              key={cat.id || cat.slug || cat.title}
              href={cat.link || `/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#E8E2D5] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={cat.image || '/images/categories/sarees.jpg'}
                  alt={cat.title || cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                />
              </div>
              <div className="p-3.5 flex items-center justify-between bg-white border-t border-[#E8E2D5]">
                <span className="font-serif font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-[#132E27] transition-colors tracking-wide">
                  {cat.title || cat.name}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-zinc-700 group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all text-xs">
                  →
                </span>
              </div>
            </Link>
          ))}
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

        {/* Desktop View: Panoramic Master Festive Banner */}
        <div className="hidden md:block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(46,6,13,0.45)] bg-[#170206]">
          {/* Inner hairline gold border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-xl sm:rounded-2xl pointer-events-none z-20" />

          {/* Delicate gold corner accents */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-4 h-4 border-t-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-4 h-4 border-t-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-4 h-4 border-b-2 border-l-2 border-[#E5C158] pointer-events-none z-30" />
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-4 h-4 border-b-2 border-r-2 border-[#E5C158] pointer-events-none z-30" />

          {/* Panoramic Container */}
          <div className="relative w-full min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] xl:min-h-[490px] flex items-center">
            {/* Background Ultra-HD Photographic Image */}
            <Image
              src="/images/nalmara/festive_panoramic_hd.jpg"
              alt="NALMARA Festive Collection - Traditional Elegance"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-1000 select-none"
            />

            {/* Gradient shadow overlays for razor-sharp typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#170206]/95 via-[#170206]/80 via-40% md:via-32% to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 inset-y-0 w-36 sm:w-44 bg-gradient-to-l from-[#170206]/90 via-[#170206]/60 to-transparent pointer-events-none z-10 hidden md:block" />

            {/* Left Content: Razor-sharp typography and branding */}
            <div className="relative z-20 w-full md:w-[48%] lg:w-[42%] xl:w-[37%] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center items-start text-left">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <LotusIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#E5C158] drop-shadow-[0_2px_8px_rgba(229,193,88,0.5)]" />
                <div className="flex flex-col">
                  <span className="font-serif tracking-[0.28em] text-xs sm:text-sm font-semibold text-white/95 uppercase leading-tight">
                    NALMARA
                  </span>
                  <span className="tracking-[0.38em] text-[8px] sm:text-[9px] text-[#E5C158] uppercase font-medium">
                    FASHION
                  </span>
                </div>
              </div>

              {/* Subheading with divider lines */}
              <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#D4AF37]/80" />
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-[#E5C158] uppercase">
                  TRADITIONAL ELEGANCE
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#D4AF37]/80" />
              </div>

              {/* Festive Collection Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-normal tracking-tight leading-[1.08] mb-2 sm:mb-3">
                Festive{' '}
                <span className="font-script text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFE59E] via-[#F3D079] to-[#C99E3A] italic drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                  Collection
                </span>
              </h2>

              {/* Tagline */}
              <p className="text-xs sm:text-sm lg:text-base font-serif italic text-amber-100/90 tracking-wide mb-5 sm:mb-6">
                Celebrate Tradition &nbsp;|&nbsp; Embrace Elegance
              </p>

              {/* CTA Button */}
              <Link
                href="/shop?category=festive"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-[#D4AF37] bg-black/40 hover:bg-[#D4AF37] text-[#FFE59E] hover:text-[#170206] transition-all duration-300 text-xs sm:text-sm font-medium tracking-wider group shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] backdrop-blur-sm"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Side Vertical Trust Badges Panel (matching reference screenshot) */}
            <div className="absolute right-0 inset-y-0 z-20 hidden md:flex flex-col justify-around py-6 px-4 lg:px-6 w-36 sm:w-40 lg:w-44 border-l border-[#D4AF37]/30 bg-[#170206]/50 backdrop-blur-[2px]">
              {/* Badge 1 */}
              <div className="flex flex-col items-center text-center group/badge">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#E5C158] mb-1.5 transition-transform duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#E5C158] bg-[#170206]/60">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-serif text-amber-100/90 leading-tight">
                  Premium<br />Silk Sarees
                </span>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center text-center group/badge">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#E5C158] mb-1.5 transition-transform duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#E5C158] bg-[#170206]/60">
                  <Gem className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-serif text-amber-100/90 leading-tight">
                  Authentic<br />Craftsmanship
                </span>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center text-center group/badge">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#E5C158] mb-1.5 transition-transform duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#E5C158] bg-[#170206]/60">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-serif text-amber-100/90 leading-tight">
                  Secure<br />Delivery
                </span>
              </div>

              {/* Badge 4 */}
              <div className="flex flex-col items-center text-center group/badge">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center text-[#E5C158] mb-1.5 transition-transform duration-300 group-hover/badge:scale-110 group-hover/badge:border-[#E5C158] bg-[#170206]/60">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-serif text-amber-100/90 leading-tight">
                  Made with<br />Love
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Exactly matching the uploaded user mobile mockup */}
        <div className="md:hidden relative w-full aspect-[1364/2048] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 bg-[#170206]">
          <Image
            src="/images/nalmara/festive_collection_mobile_exact_banner.png"
            alt="NALMARA Festive Collection - Traditional Elegance"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center select-none"
          />

          {/* "Explore Collection →" Button Hotspot */}
          <Link
            href="/shop?category=festive"
            title="Explore Festive Collection"
            className="absolute rounded-full border border-transparent active:border-[#D4AF37] active:ring-2 active:ring-[#D4AF37]/60 active:bg-[#D4AF37]/15 transition-all duration-200 cursor-pointer"
            style={{ left: '7.5%', top: '32.8%', width: '41.0%', height: '3.6%' }}
          >
            <span className="sr-only">Explore Festive Collection</span>
          </Link>

          {/* Center Saree Image Hotspot */}
          <Link
            href="/shop?category=festive"
            title="Explore Festive Sarees"
            className="absolute rounded-3xl border border-transparent active:ring-2 active:ring-[#D4AF37]/40 transition-all duration-200 cursor-pointer"
            style={{ left: '8%', top: '38%', width: '84%', height: '28%' }}
          >
            <span className="sr-only">Explore Festive Sarees</span>
          </Link>

          {/* 4 Bottom Trust Feature Hotspots */}
          <div
            className="absolute rounded-xl border border-transparent active:border-[#D4AF37]/60 active:bg-[#D4AF37]/10 transition-all duration-200 cursor-default"
            style={{ left: '5.0%', top: '71.5%', width: '43.0%', height: '11.0%' }}
            title="Premium Silk Sarees • Luxurious Feel, Lasting Beauty"
          />
          <div
            className="absolute rounded-xl border border-transparent active:border-[#D4AF37]/60 active:bg-[#D4AF37]/10 transition-all duration-200 cursor-default"
            style={{ left: '50.0%', top: '71.5%', width: '43.0%', height: '11.0%' }}
            title="Authentic Craftsmanship • Skilled Hands, Timeless Art"
          />
          <div
            className="absolute rounded-xl border border-transparent active:border-[#D4AF37]/60 active:bg-[#D4AF37]/10 transition-all duration-200 cursor-default"
            style={{ left: '5.0%', top: '83.5%', width: '43.0%', height: '11.0%' }}
            title="Secure Delivery • Safe & Reliable Packaging"
          />
          <div
            className="absolute rounded-xl border border-transparent active:border-[#D4AF37]/60 active:bg-[#D4AF37]/10 transition-all duration-200 cursor-default"
            style={{ left: '50.0%', top: '83.5%', width: '43.0%', height: '11.0%' }}
            title="Made with Love • Every Saree Tells a Story"
          />
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
      {/* 08. DUAL PROMO BANNER (Wedding Special & Kids Collection)      */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {/* Left Card (~52% width, 6 cols): Wedding Special */}
          <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-[#2D060D] group transition-all duration-500 hover:shadow-[0_20px_45px_rgba(45,6,13,0.35)]">
            <Link
              href="/shop?category=weddings"
              className="block relative w-full aspect-[486/216] min-h-[170px] sm:min-h-[220px]"
            >
              <Image
                src="/images/nalmara/wedding_banner_exact.png"
                alt="Wedding Special • Timeless Looks for Your Special Day"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 select-none"
              />

              {/* Interactive glow over the 'Shop Wedding Collection →' button area */}
              <div
                className="absolute left-[8%] bottom-[12%] hidden sm:block w-[185px] h-[36px] rounded-full border border-transparent group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/15 transition-all duration-300 pointer-events-none"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Right Card (~48% width, 6 cols): Kids Collection */}
          <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/50 bg-[#FAF7F2] group transition-all duration-500 hover:shadow-[0_20px_45px_rgba(212,175,55,0.25)]">
            <Link
              href="/shop?category=kids-wear"
              className="block relative w-full aspect-[442/216] min-h-[170px] sm:min-h-[220px]"
            >
              <Image
                src="/images/nalmara/kids_banner_exact.png"
                alt="Kids Collection • Little Styles Big Smiles"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 select-none"
              />

              {/* Interactive glow over the 'Shop Kidswear →' button area */}
              <div
                className="absolute left-[7%] bottom-[12%] hidden sm:block w-[140px] h-[36px] rounded-full border border-transparent group-hover:border-[#4A0E17] group-hover:bg-[#4A0E17]/10 transition-all duration-300 pointer-events-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 09. WHY CHOOSE NALMARA FASHION? (Exact Reference Look)         */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-12">
        {/* Desktop Showcase: The exact champagne silk banner composite */}
        <div className="hidden md:block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/45 bg-[#F8F3EA] group">
          <div className="relative w-full aspect-[2560/485] min-h-[240px]">
            <Image
              src="/images/nalmara/why_choose_banner_exact.png"
              alt="Why Choose NALMARA FASHION? - Traditional Elegance | Timeless Collections | Made with Love"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center select-none"
            />

            {/* Interactive hover hotspots over the 4 value cards */}
            <div className="absolute bottom-[8%] left-[7.5%] w-[19%] h-[68%] rounded-xl sm:rounded-2xl border border-transparent hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-default" title="Handpicked Styles • Trendy & Traditional" />
            <div className="absolute bottom-[8%] left-[29.5%] w-[19%] h-[68%] rounded-xl sm:rounded-2xl border border-transparent hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-default" title="Transparent Details • Fabric | Length | Blouse | Care" />
            <div className="absolute bottom-[8%] left-[51.5%] w-[19%] h-[68%] rounded-xl sm:rounded-2xl border border-transparent hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-default" title="Personal Support • We're here to help" />
            <div className="absolute bottom-[8%] left-[73.5%] w-[19%] h-[68%] rounded-xl sm:rounded-2xl border border-transparent hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-default" title="Small Business • With a Big Dream" />
          </div>
        </div>

        {/* Mobile View: Exactly matching the uploaded user mobile mockup */}
        <div className="md:hidden relative w-full aspect-[1364/2048] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/45 bg-[#F8F3EA]">
          <Image
            src="/images/nalmara/why_choose_mobile_exact_banner.png"
            alt="Why Choose NALMARA FASHION? - Traditional Elegance | Timeless Collections | Made with Love"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center select-none"
          />

          {/* Interactive touch/hover hotspots over the 4 value cards */}
          <div
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '7.99%', top: '42.04%', width: '39.88%', height: '26.17%' }}
            title="Handpicked Styles • Trendy & Traditional"
          />
          <div
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '52.27%', top: '42.04%', width: '39.88%', height: '26.17%' }}
            title="Transparent Details • Fabric | Length | Blouse | Care"
          />
          <div
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '7.99%', top: '71.14%', width: '39.88%', height: '26.17%' }}
            title="Personal Support • We're here to help"
          />
          <div
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '52.27%', top: '71.14%', width: '39.88%', height: '26.17%' }}
            title="Small Business • With a Big Dream"
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. STYLE INSPIRATION (Exact Reference Mockup Design)          */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 my-8 sm:my-14">
        {/* Desktop View: Exact Panoramic Mockup with Interactive Hotspots */}
        <div className="hidden lg:block relative w-full aspect-[2560/852] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/35 bg-[#FAF7F2]">
          <Image
            src="/images/nalmara/style_inspiration_exact_banner.png"
            alt="Style Inspiration - Traditional, Festive, Everyday Elegance"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover pointer-events-none select-none"
          />

          {/* Top Right "View More" Hotspot Button */}
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            title="View More on Instagram"
            className="absolute z-20 group flex items-center justify-center rounded-full transition-transform hover:scale-105"
            style={{
              top: '17%',
              right: '4.8%',
              width: '10%',
              height: '8%',
            }}
          >
            <span className="sr-only">View More Style Inspirations</span>
            <div className="w-full h-full rounded-full ring-2 ring-transparent group-hover:ring-[#D4AF37]/80 group-hover:bg-[#C5A059]/15 transition-all duration-300" />
          </a>

          {/* Instagram Handle Text Hotspot */}
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram @nalmara.fashion"
            className="absolute z-20 group rounded-md"
            style={{
              top: '22.5%',
              left: '35%',
              width: '30%',
              height: '5.5%',
            }}
          >
            <span className="sr-only">Follow us on Instagram @nalmara.fashion</span>
            <div className="w-full h-full rounded-md ring-1 ring-transparent group-hover:ring-[#D4AF37]/40 group-hover:bg-[#C5A059]/10 transition-all duration-300" />
          </a>

          {/* 6 Card Hotspots with Interactive Hover Rings & Glow */}
          {STYLE_INSPIRATION_ITEMS.map((item) => {
            const isExternal = item.href.startsWith('http');
            const CardWrapper = isExternal ? 'a' : Link;
            return (
              <CardWrapper
                key={item.id}
                href={item.href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                title={`${item.title} — ${item.subtitle}`}
                className="absolute z-20 group rounded-2xl block transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                style={{
                  top: '32.6%',
                  height: '51.6%',
                  left: item.left,
                  width: item.width,
                }}
              >
                <div className="w-full h-full rounded-2xl transition-all duration-300 ring-0 group-hover:ring-2 group-hover:ring-[#E5C158] group-hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)]" />
              </CardWrapper>
            );
          })}
        </div>

        {/* Mobile & Tablet View: Exactly matching the uploaded user mobile mockup */}
        <div className="lg:hidden relative w-full aspect-[1364/2048] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/45 bg-[#FAF7F2]">
          <Image
            src="/images/nalmara/style_inspiration_mobile_exact_banner.png"
            alt="Style Inspiration - Traditional, Festive, Everyday Elegance"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center select-none"
          />

          {/* Top "Follow us on Instagram @nalmara.fashion" Hotspot */}
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram @nalmara.fashion"
            className="absolute rounded-lg border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/15 transition-all duration-200 cursor-pointer"
            style={{ left: '23.0%', top: '18.6%', width: '53.0%', height: '3.5%' }}
          >
            <span className="sr-only">Follow us on Instagram @nalmara.fashion</span>
          </a>

          {/* Top Right "View More" Button Hotspot */}
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            title="View More on Instagram"
            className="absolute rounded-full border border-transparent active:border-[#D4AF37] active:ring-2 active:ring-[#D4AF37]/50 transition-all duration-200 cursor-pointer"
            style={{ left: '77.7%', top: '18.5%', width: '18.0%', height: '3.6%' }}
          >
            <span className="sr-only">View More</span>
          </a>

          {/* 6 Interactive Touch/Hover Hotspots for the 6 Cards */}
          {/* 1. Sarees */}
          <Link
            href="/shop?category=sarees"
            title="Sarees — Grace in Every Drape"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '4.0%', top: '24.4%', width: '44.7%', height: '22.8%' }}
          />

          {/* 2. Traditional Wear */}
          <Link
            href="/shop?category=traditional"
            title="Traditional Wear — Timeless Heritage"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '51.4%', top: '24.4%', width: '44.7%', height: '22.8%' }}
          />

          {/* 3. Kids Collection */}
          <Link
            href="/shop?category=kids-wear"
            title="Kids Collection — Little Smiles, Big Joy"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '4.0%', top: '49.0%', width: '44.7%', height: '21.5%' }}
          />

          {/* 4. Premium Collections */}
          <Link
            href="/shop?category=silk-sarees"
            title="Premium Collections — Luxury in Every Thread"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '51.4%', top: '49.0%', width: '44.7%', height: '21.5%' }}
          />

          {/* 5. Behind the Scenes */}
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            title="Behind the Scenes — Real Moments, Real Us"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '4.0%', top: '71.5%', width: '44.7%', height: '20.6%' }}
          />

          {/* 6. Festive Vibes */}
          <Link
            href="/shop?category=festive"
            title="Festive Vibes — Celebrate in Style"
            className="absolute rounded-2xl border border-transparent active:border-[#D4AF37] active:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer"
            style={{ left: '51.4%', top: '71.5%', width: '44.7%', height: '20.6%' }}
          />
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
