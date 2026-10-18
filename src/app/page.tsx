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
    tag: 'Most Loved',
    rating: 5,
    reviewsCount: 135,
    colors: ['#881337', '#D4AF37'],
    image: '/images/bestsellers/traditional_silk_saree.jpg',
    slug: 'kanchivaram-saree',
  },
  {
    _id: 'bs-2',
    name: 'Semi Tissue Saree',
    price: 1150,
    compareAtPrice: 1750,
    priceDisplay: '₹1,150',
    tag: 'Trending',
    rating: 5,
    reviewsCount: 96,
    colors: ['#F59E0B', '#EC4899'],
    image: '/images/nalmara/category_semi_kanchivaram.jpg',
    slug: 'semi-tissue-saree',
  },
  {
    _id: 'bs-3',
    name: 'Chettinadu Cotton',
    price: 798,
    compareAtPrice: 1199,
    priceDisplay: '₹798',
    tag: 'Trending',
    rating: 5,
    reviewsCount: 118,
    colors: ['#10B981', '#3B82F6'],
    image: '/images/nalmara/cotton_saree_stack.jpg',
    slug: 'chettinadu-cotton',
  },
  {
    _id: 'bs-4',
    name: 'Designer Saree',
    price: 1200,
    compareAtPrice: 1850,
    priceDisplay: '₹1,200',
    tag: 'Trending',
    rating: 5,
    reviewsCount: 82,
    colors: ['#881337', '#14B8A6'],
    image: '/images/categories/sarees.jpg',
    slug: 'designer-saree',
  },
  {
    _id: 'bs-5',
    name: 'Fancy Saree',
    price: 749,
    compareAtPrice: 1299,
    priceDisplay: '₹749',
    tag: 'Trending',
    rating: 5,
    reviewsCount: 55,
    colors: ['#EC4899', '#8B5CF6'],
    image: '/images/nalmara/category_party_wear.jpg',
    slug: 'fancy-saree',
  },
];

// ==============================================================
// 10. STYLE INSPIRATION (Instagram 6 items)
// ==============================================================
const INSTAGRAM_POSTS_DATA = [
  {
    id: 1,
    image: '/images/nalmara/occasion_saree_banner.jpg',
    likes: '2.4k',
    isReel: false,
  },
  {
    id: 2,
    image: '/images/nalmara/hero_maroon_saree.jpg',
    likes: '3.8k',
    isReel: true,
  },
  {
    id: 3,
    image: '/images/nalmara/kidswear_butterfly_gown.jpg',
    likes: '1.9k',
    isReel: false,
  },
  {
    id: 4,
    image: '/images/nalmara/brand_story_box.jpg',
    likes: '4.2k',
    isReel: true,
  },
  {
    id: 5,
    image: '/images/nalmara/category_party_wear.jpg',
    likes: '3.1k',
    isReel: false,
  },
  {
    id: 6,
    image: '/images/nalmara/festive_diwali_diyas.jpg',
    likes: '1.5k',
    isReel: true,
  },
];

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
      {/* 05. FESTIVE COLLECTION BANNER (Crystal-Clear Luxury Layout)     */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/50 bg-[#26050B] group">
          {/* Desktop Multi-Zone Layout (md:grid) */}
          <div className="hidden md:grid md:grid-cols-12 items-stretch min-h-[220px] lg:min-h-[240px]">
            {/* Zone 1: Text & Explore Button (Col span 4 - ~33% width) */}
            <div className="col-span-4 bg-gradient-to-r from-[#220308] via-[#2F060D] to-[#27040A] p-6 lg:p-8 xl:p-10 flex flex-col justify-center items-start relative z-10">
              {/* Corner Traditional Gold Flourish */}
              <div className="absolute top-3 left-3 pointer-events-none opacity-40 select-none">
                <svg className="w-12 h-12 text-[#D4AF37]" viewBox="0 0 50 50" fill="none">
                  <path
                    d="M2 2C16 2 26 12 26 26M2 2C2 16 12 26 26 26M2 2L18 18M6 2C6 14 14 22 26 22"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] text-white font-normal tracking-wide leading-tight">
                Festive Collection
              </h2>
              <p className="text-xs sm:text-sm text-[#F5E6BE]/90 font-light mt-2 tracking-wide leading-relaxed">
                Celebrate Tradition &nbsp;|&nbsp; Embrace Elegance
              </p>

              <Link
                href="/shop?category=festive"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/40 hover:border-[#D4AF37] bg-white/10 hover:bg-white hover:text-[#220308] text-white text-xs font-medium tracking-wider transition-all duration-300 shadow-sm group/btn"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Zone 2: Folded Silk Saree with Gold Zari & Lotus Flowers (Col span 4 - ~33% width) */}
            <div className="col-span-4 relative overflow-hidden bg-[#180306]">
              <Image
                src="/images/nalmara/festive_folded_saree.jpg"
                alt="Festive Handwoven Pure Zari Silk Saree"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle edge blend gradients */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#27040A] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#180306] to-transparent pointer-events-none" />
            </div>

            {/* Zone 3: Model in Emerald Green Saree with Glowing Diyas (Col span 3 - ~25% width) */}
            <div className="col-span-3 relative overflow-hidden bg-[#180306]">
              <Image
                src="/images/nalmara/festive_green_saree_model.jpg"
                alt="Indian Model in Emerald Green Silk Saree with Glowing Diyas"
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle edge blend gradients */}
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#180306] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#1D0307] to-transparent pointer-events-none" />
            </div>

            {/* Zone 4: Occasion Tags (Col span 1 - ~9% width) */}
            <div className="col-span-1 bg-[#1D0307] border-l border-[#D4AF37]/25 p-3 flex flex-col justify-center items-center text-center z-10 space-y-2.5">
              <LotusIcon className="w-5 h-4 text-[#D4AF37] mb-1 opacity-90" />
              <Link
                href="/shop?category=festive&occasion=diwali"
                className="text-[11px] lg:text-xs text-[#F5E6BE] hover:text-white font-medium tracking-wider transition-all hover:translate-x-0.5 block py-0.5"
              >
                Diwali
              </Link>
              <Link
                href="/shop?category=weddings"
                className="text-[11px] lg:text-xs text-[#F5E6BE] hover:text-white font-medium tracking-wider transition-all hover:translate-x-0.5 block py-0.5"
              >
                Wedding
              </Link>
              <Link
                href="/shop?category=festive"
                className="text-[11px] lg:text-xs text-[#F5E6BE] hover:text-white font-medium tracking-wider transition-all hover:translate-x-0.5 block py-0.5"
              >
                Festive Wear
              </Link>
              <Link
                href="/shop?category=gifting"
                className="text-[11px] lg:text-xs text-[#F5E6BE] hover:text-white font-medium tracking-wider transition-all hover:translate-x-0.5 block py-0.5"
              >
                Gifting
              </Link>
            </div>
          </div>

          {/* Mobile View: High Clarity Responsive Card (md:hidden) */}
          <div className="md:hidden relative p-6 bg-gradient-to-br from-[#240409] via-[#32070E] to-[#1F0307] flex flex-col justify-between overflow-hidden">
            {/* Background Festive Saree Vignette on right */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] opacity-40 overflow-hidden pointer-events-none">
              <Image
                src="/images/nalmara/festive_folded_saree.jpg"
                alt="Festive Sarees"
                fill
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#240409] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 space-y-2 max-w-[70%]">
              <h3 className="font-serif text-2xl font-normal text-white leading-tight">
                Festive Collection
              </h3>
              <p className="text-[11px] text-[#F5E6BE]/90 font-light leading-snug">
                Celebrate Tradition &nbsp;|&nbsp; Embrace Elegance
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?category=festive"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white hover:text-[#240409] text-white text-[11px] font-medium tracking-wide transition-all shadow-xs"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Mobile Occasions Pills */}
            <div className="relative z-10 flex items-center gap-2 mt-4 pt-4 border-t border-[#D4AF37]/20 overflow-x-auto scrollbar-none">
              {[
                { name: 'Diwali', link: '/shop?category=festive&occasion=diwali' },
                { name: 'Wedding', link: '/shop?category=weddings' },
                { name: 'Festive Wear', link: '/shop?category=festive' },
                { name: 'Gifting', link: '/shop?category=gifting' },
              ].map((occ) => (
                <Link
                  key={occ.name}
                  href={occ.link}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#240409] border border-[#D4AF37]/30 text-[#F5E6BE] text-[10px] font-medium whitespace-nowrap transition-all shrink-0"
                >
                  ✦ {occ.name}
                </Link>
              ))}
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
      {/* 07. BESTSELLERS & TRENDING NOW (Rich Maroon Container)         */}
      {/* ============================================================== */}
      <section className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        <div className="bg-gradient-to-r from-[#2D070C] via-[#380B11] to-[#2D070C] rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-[#D4AF37]/50 relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 text-white">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white">
                Bestsellers &amp; Trending Now
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-light mt-1">
                Our most loved styles, handpicked for you.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/shop?filter=best-sellers"
                className="text-xs text-[#F5E6BE] hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {/* Carousel Arrows */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scrollBestsellers('left')}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollBestsellers('right')}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 5 Product Cards Horizontal Row */}
          <div
            ref={bestsellersContainerRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 overflow-x-auto pb-2 scrollbar-none"
          >
            {(bestsellers && bestsellers.length > 0 ? bestsellers.slice(0, 5) : BESTSELLERS_DATA).map((prod) => {
              const prodId = prod._id || prod.id;
              const inWish = isInWishlist(prodId);
              const prodImg = prod.images?.[0]?.url || prod.image || '/images/bestsellers/traditional_silk_saree.jpg';
              const priceText = prod.priceDisplay || (prod.price ? formatCurrency(prod.price) : '₹999');
              const badgeTag = prod.tag || (prod.bestSeller ? 'Most Loved' : 'Trending');

              return (
                <div
                  key={prodId}
                  className="group bg-white rounded-2xl border border-white/20 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image with Tag Pill & Wishlist */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
                    <Link href={`/product/${prod.slug}`} className="block w-full h-full">
                      <Image
                        src={prodImg}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                    </Link>

                    {/* Badge Tag Pill */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#18181B]/80 text-[#FAF8F5] text-[9px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                      {badgeTag}
                    </div>

                    <button
                      onClick={(e) => handleWishlistToggle(prod, e)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center transition-all shadow-sm z-10 cursor-pointer hover:scale-110"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          inWish ? 'fill-rose-600 text-rose-600' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${prod.slug}`}>
                        <h3 className="font-serif font-bold text-xs sm:text-sm text-zinc-900 line-clamp-1 group-hover:text-[#4A0E17] transition-colors">
                          {prod.name}
                        </h3>
                      </Link>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900 mt-1">
                        {priceText}
                      </p>
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
        </div>
      </section>

      {/* ============================================================== */}
      {/* 08. DUAL PROMO BANNER (Wedding Special & Kids Collection)      */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Banner (~58% width, 7 cols): Wedding Special */}
          <div className="lg:col-span-7 bg-[#2D070C] text-white rounded-3xl overflow-hidden relative min-h-[300px] sm:min-h-[360px] flex items-center shadow-xl border border-[#D4AF37]/50 group">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/nalmara/hero_maroon_saree.jpg"
                alt="Wedding Special • Timeless Looks for Your Special Day"
                fill
                className="object-cover object-[70%_center] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2D070C] via-[#380B11]/85 to-transparent w-full sm:w-[68%]" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 space-y-3 sm:space-y-4 max-w-md">
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#F5E6BE]">
                Wedding Special
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-white">
                Timeless Looks <br />
                for Your Special Day
              </h3>
              <div className="pt-2">
                <Link
                  href="/shop?category=weddings"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-[#132E27] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md group-hover:shadow-lg"
                >
                  <span>Shop Wedding Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner (~42% width, 5 cols): Kids Collection */}
          <div className="lg:col-span-5 bg-[#FAF7F2] text-zinc-900 rounded-3xl overflow-hidden relative min-h-[300px] sm:min-h-[360px] flex items-center shadow-lg border border-[#E8E2D5] group">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/nalmara/kidswear_butterfly_gown.jpg"
                alt="Kids Collection • Little Styles, Big Smiles"
                fill
                className="object-cover object-[75%_center] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full sm:w-[65%]" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 space-y-3 sm:space-y-4 max-w-xs">
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#8C6D2D]">
                Kids Collection
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-zinc-900">
                Little Styles <br />
                Big Smiles
              </h3>
              <div className="pt-2">
                <Link
                  href="/shop?category=kids-wear"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#18181B] hover:bg-[#132E27] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md group-hover:shadow-lg"
                >
                  <span>Shop Kidswear</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 09. WHY CHOOSE NALMARA FASHION?                                */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight text-center lg:text-left mb-8">
          Why Choose NALMARA FASHION?
        </h2>

        {/* 4 Line-Art Icon Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {/* 1. Handpicked Styles */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 shadow-2xs hover:border-[#D4AF37] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-zinc-900">
              Handpicked Styles
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-light">
              Trendy &amp; Traditional
            </p>
          </div>

          {/* 2. Transparent Details */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 shadow-2xs hover:border-[#D4AF37] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-zinc-900">
              Transparent Details
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-light">
              Fabric | Length | Blouse | Care
            </p>
          </div>

          {/* 3. Personal Support */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 shadow-2xs hover:border-[#D4AF37] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-zinc-900">
              Personal Support
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-light">
              We&apos;re here to help
            </p>
          </div>

          {/* 4. Small Business With a Big Dream */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-2.5 shadow-2xs hover:border-[#D4AF37] hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#132E27] group-hover:bg-[#132E27] group-hover:text-[#D4AF37] transition-all">
              <Sprout className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-zinc-900">
              Small Business
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-500 font-light">
              With a Big Dream
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. STYLE INSPIRATION (Instagram 6 items)                      */}
      {/* ============================================================== */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
              Style Inspiration
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">
              Follow us on instagram @nalmarafashion
            </p>
          </div>
          <a
            href="https://instagram.com/nalmarafashion_official"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-[#132E27] transition-colors shrink-0"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 6 Instagram Posts Grid (Desktop: 6, Mobile: 3 or 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS_DATA.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/nalmarafashion_official"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-200 border border-[#E8E2D5] hover:border-[#D4AF37] block shadow-2xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Image
                src={post.image}
                alt="Instagram style inspiration"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6 text-[#D4AF37]" />
              </div>
              {post.isReel && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
              )}
            </a>
          ))}
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
