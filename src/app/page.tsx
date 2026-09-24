'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  Crown,
  Scissors,
} from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';
import { LotusIcon } from '../components/ui/BrandLogo';

// Hero slide data
const HERO_SLIDES = [
  {
    tag: 'PREMIUM ETHNIC WEAR',
    title: 'Timeless Elegance',
    highlight: 'Redefined',
    description:
      'Discover handcrafted ethnic wear, designed for your most special moments. From traditional sarees to modern fusion styles, celebrate you.',
    image: '/images/hero_banner.jpg',
    link: '/shop',
  },
  {
    tag: 'BRIDAL HERITAGE',
    title: 'Royal Handlooms',
    highlight: 'Pure Zari',
    description:
      'Intricate bridal lehengas, pure silk weaves, and bespoke silhouettes crafted with timeless Indian artistry.',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=85',
    link: '/shop?category=lehengas',
  },
  {
    tag: 'FESTIVE EDIT 2026',
    title: 'Regal Celebrations',
    highlight: 'Bespoke Fit',
    description:
      'From intimate family gatherings to grand festivities, explore our opulent collection of curated ethnic glamour.',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=85',
    link: '/shop?category=salwar-suits',
  },
];

// Exact 7 Categories in exact order from the Mockup
const EXACT_CATEGORIES = [
  {
    name: 'Sarees',
    slug: 'sarees',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Salwar Suits',
    slug: 'salwar-suits',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kurtis',
    slug: 'kurtis',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Anarkali',
    slug: 'anarkali',
    image:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: "Men's Wear",
    slug: 'mens-wear',
    image:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: "Kid's Wear",
    slug: 'kids-wear',
    image:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
  },
];

// Exact 4 Best Sellers from Mockup
const EXACT_BEST_SELLERS = [
  {
    _id: 'bs-1',
    name: 'Traditional Silk Saree',
    slug: 'traditional-silk-saree',
    price: 2999,
    compareAtPrice: 4999,
    rating: 4.8,
    reviewCount: 124,
    badge: 'Best Seller',
    badgeType: 'amber',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'bs-2',
    name: 'Bridal Lehenga',
    slug: 'bridal-lehenga',
    price: 8999,
    compareAtPrice: 11999,
    rating: 4.9,
    reviewCount: 96,
    badge: 'New',
    badgeType: 'emerald',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'bs-3',
    name: 'Embroidered Salwar Suit',
    slug: 'embroidered-salwar-suit',
    price: 3499,
    compareAtPrice: 5999,
    rating: 4.7,
    reviewCount: 76,
    badge: 'Hot',
    badgeType: 'rose',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'bs-4',
    name: 'Anarkali Dress',
    slug: 'anarkali-dress',
    price: 4999,
    compareAtPrice: 7999,
    rating: 4.8,
    reviewCount: 112,
    badge: 'New',
    badgeType: 'emerald',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
  },
];

// Exact 5 New Arrivals from Mockup
const EXACT_NEW_ARRIVALS = [
  {
    _id: 'na-1',
    name: 'Designer Silk Saree',
    slug: 'designer-silk-saree',
    price: 3499,
    compareAtPrice: 5999,
    rating: 4.8,
    reviewCount: 95,
    badge: 'New',
    badgeType: 'emerald',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'na-2',
    name: 'Straight Kurti Set',
    slug: 'straight-kurti-set',
    price: 2199,
    compareAtPrice: 3499,
    rating: 4.7,
    reviewCount: 52,
    badge: 'Hot',
    badgeType: 'rose',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'na-3',
    name: 'Lehenga Choli',
    slug: 'lehenga-choli',
    price: 7999,
    compareAtPrice: 10999,
    rating: 4.9,
    reviewCount: 87,
    badge: 'New',
    badgeType: 'emerald',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'na-4',
    name: "Men's Kurta",
    slug: 'mens-kurta',
    price: 1999,
    compareAtPrice: 2999,
    rating: 4.6,
    reviewCount: 63,
    badge: 'Trend',
    badgeType: 'teal',
    image:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'na-5',
    name: 'Kids Festive Wear',
    slug: 'kids-festive-wear',
    price: 1499,
    compareAtPrice: 2499,
    rating: 4.8,
    reviewCount: 72,
    badge: 'New',
    badgeType: 'emerald',
    image:
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
  },
];

// Exact 4 Occasions matching Mockup
const OCCASIONS = [
  {
    title: 'Weddings',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    link: '/shop?category=lehengas',
  },
  {
    title: 'Festive',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    link: '/shop?category=sarees',
  },
  {
    title: 'Casual',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    link: '/shop?category=salwar-suits',
  },
  {
    title: 'Party Wear',
    image:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
    link: '/shop?category=mens-wear',
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>(EXACT_CATEGORIES);
  const [bestSellers, setBestSellers] = useState<any[]>(EXACT_BEST_SELLERS);
  const [newArrivals, setNewArrivals] = useState<any[]>(EXACT_NEW_ARRIVALS);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, collectionsRes] = await Promise.allSettled([
          api.get('/categories'),
          api.get('/products/collections/home'),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
          const apiCats = catRes.value.data.data;
          if (apiCats && apiCats.length >= 7) {
            // Sort to ensure the exact sequence: Sarees, Lehengas, Salwar Suits, Kurtis, Anarkali, Men's Wear, Kid's Wear
            const order = [
              'sarees',
              'lehengas',
              'salwar-suits',
              'kurtis',
              'anarkali',
              'mens-wear',
              'kids-wear',
            ];
            const sorted = [...apiCats].sort((a, b) => {
              const idxA = order.indexOf(a.slug);
              const idxB = order.indexOf(b.slug);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              return 0;
            });
            setCategories(sorted);
          }
        }

        if (
          collectionsRes.status === 'fulfilled' &&
          collectionsRes.value.data?.success &&
          collectionsRes.value.data.data
        ) {
          const { bestSellers: apiBest, newArrivals: apiNew } =
            collectionsRes.value.data.data;

          if (apiBest && apiBest.length >= 4) {
            // Match order from mockup
            const preferredBs = [
              'traditional-silk-saree',
              'bridal-lehenga',
              'embroidered-salwar-suit',
              'anarkali-dress',
            ];
            const sortedBs = [...apiBest].sort((a, b) => {
              const idxA = preferredBs.indexOf(a.slug);
              const idxB = preferredBs.indexOf(b.slug);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              return 0;
            });
            setBestSellers(sortedBs);
          }

          if (apiNew && apiNew.length >= 5) {
            // Match order from mockup
            const preferredNa = [
              'designer-silk-saree',
              'straight-kurti-set',
              'lehenga-choli',
              'mens-kurta',
              'kids-festive-wear',
            ];
            const sortedNa = [...apiNew].sort((a, b) => {
              const idxA = preferredNa.indexOf(a.slug);
              const idxB = preferredNa.indexOf(b.slug);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              return 0;
            });
            setNewArrivals(sortedNa);
          }
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      }
    };

    fetchData();
  }, []);

  // Auto advance hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product._id,
      name: product.name,
      image:
        product.images?.[0]?.url || product.image || EXACT_BEST_SELLERS[0].image,
      price: product.price,
      sku: product.sku || `SKU-${product._id}`,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart!`);
  };

  const handleLike = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formattedProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug || `product-${product._id}`,
      description: product.description || product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: [
        {
          url:
            product.images?.[0]?.url ||
            product.image ||
            EXACT_BEST_SELLERS[0].image,
          isMain: true,
        },
      ],
      rating: product.rating || 5,
      reviewCount: product.reviewCount || 0,
      sku: product.sku || `SKU-${product._id}`,
      stock: 100,
      isActive: true,
      category:
        typeof product.category === 'object' && product.category !== null
          ? product.category
          : typeof product.category === 'string'
          ? product.category
          : 'sarees',
      variants: [],
      tags: [],
      featured: false,
      bestSeller: false,
      newArrival: false,
    } as unknown as Product;

    toggleWishlist(formattedProduct);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to EFFIDOO!');
    setNewsletterEmail('');
  };

  const currentSlide = HERO_SLIDES[currentHeroSlide];

  return (
    <div className="bg-[#FAF8F5] text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
      {/* ============================================================== */}
      {/* 1. HERO BANNER SECTION (Regal Candlelit Palace + Elegance)    */}
      {/* ============================================================== */}
      <section className="relative min-h-[580px] lg:min-h-[660px] w-full bg-[#061811] text-white flex items-center overflow-hidden">
        {/* Ambient Palace Background Image with Rich Dark Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            className="object-cover object-center lg:object-[68%_center] transition-all duration-1000 transform scale-100 opacity-95"
          />
          {/* Radial & directional gradient vignette for crystal clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061811] via-[#061811]/75 to-transparent lg:w-[55%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061811] via-transparent to-[#061811]/30" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-16 lg:py-24">
          <div className="max-w-xl space-y-4">
            {/* Tagline Badge */}
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5C07B]">
              {currentSlide.tag}
            </p>

            {/* Headline */}
            <div className="space-y-0">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-wide leading-tight">
                {currentSlide.title}
              </h1>
              <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#E5C07B] block font-normal tracking-wide -mt-2 sm:-mt-3">
                {currentSlide.highlight}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md font-light pt-1">
              {currentSlide.description}
            </p>

            {/* Shop Now CTA Button */}
            <div className="pt-3">
              <Link
                href={currentSlide.link}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#E5C07B] to-[#D4AF37] hover:opacity-95 text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-xl group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Left Vertical Scroll Indicator matching Screenshot */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-[1px] h-12 bg-zinc-600/70" />
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium [writing-mode:vertical-lr] text-zinc-400 select-none">
            SCROLL
          </span>
          <div className="w-3.5 h-3.5 rounded-full border border-[#E5C07B] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#E5C07B]" />
          </div>
        </div>

        {/* Bottom Right Carousel Controls (01 / 03 + Vertically Stacked Circular Buttons) */}
        <div className="absolute bottom-8 right-8 lg:right-12 z-10 flex flex-col items-end gap-3 text-white">
          <span className="text-xs font-serif tracking-widest text-[#E5C07B]">
            0{currentHeroSlide + 1} <span className="text-zinc-500">/ 0{HERO_SLIDES.length}</span>
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() =>
                setCurrentHeroSlide(
                  (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                )
              }
              className="w-8 h-8 rounded-full border border-zinc-700 bg-black/60 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-zinc-950 flex items-center justify-center transition-all text-[#E5C07B]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
              }
              className="w-8 h-8 rounded-full border border-zinc-700 bg-black/60 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-zinc-950 flex items-center justify-center transition-all text-[#E5C07B]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TRUST BADGES STRIP (4 Gold Trust Badges on Ivory)         */}
      {/* ============================================================== */}
      <section className="bg-[#FAF8F5] border-y border-[#D4AF37]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* 1. Premium Quality */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] transition-transform group-hover:scale-110">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Premium Quality
              </h4>
              <p className="text-[11px] text-zinc-500 font-normal">Finest Fabrics</p>
            </div>
          </div>

          {/* 2. Free Shipping */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] transition-transform group-hover:scale-110">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Free Shipping
              </h4>
              <p className="text-[11px] text-zinc-500 font-normal">On Orders Above ₹999</p>
            </div>
          </div>

          {/* 3. Secure Payments */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] transition-transform group-hover:scale-110">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Secure Payments
              </h4>
              <p className="text-[11px] text-zinc-500 font-normal">100% Safe & Secure</p>
            </div>
          </div>

          {/* 4. Easy Returns */}
          <div className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] transition-transform group-hover:scale-110">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                Easy Returns
              </h4>
              <p className="text-[11px] text-zinc-500 font-normal">Hassle Free within 7 Days</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SHOP BY CATEGORY - EXPLORE OUR COLLECTIONS                 */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Title & Call to Action */}
          <div className="lg:w-1/4 text-center lg:text-left space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2518] font-bold leading-tight">
              Explore Our Collections
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Find your perfect style from our wide range of ethnic wear.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B2518] hover:bg-[#061811] text-white text-xs font-semibold tracking-wide transition-all shadow group"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right 7 Circular Avatars Grid (Order: Sarees, Lehengas, Salwar Suits, Kurtis, Anarkali, Men's Wear, Kid's Wear) */}
          <div className="lg:w-3/4 w-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5 justify-items-center">
              {categories.slice(0, 7).map((cat) => {
                const fallbackImg =
                  EXACT_CATEGORIES.find((c) => c.slug === cat.slug)?.image ||
                  cat.image ||
                  EXACT_CATEGORIES[0].image;

                return (
                  <Link
                    key={cat.slug || cat.name}
                    href={`/shop?category=${cat.slug}`}
                    className="flex flex-col items-center text-center group"
                  >
                    {/* Golden Bordered Circle Avatar */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={cat.image || fallbackImg}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Category Title */}
                    <h3 className="mt-2.5 text-xs font-bold text-zinc-900 group-hover:text-[#B8860B] transition-colors">
                      {cat.name}
                    </h3>

                    {/* Explore Link */}
                    <span className="text-[11px] text-[#B8860B] group-hover:text-zinc-950 font-medium inline-flex items-center gap-0.5 mt-0.5">
                      Explore <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED COLLECTION - OUR BEST SELLERS                      */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Hero Card (Emerald Green Saree Model) */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden min-h-[440px] lg:min-h-[500px] flex flex-col justify-end p-8 text-white shadow-xl group">
            <Image
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85"
              alt="EFFIDOO Best Sellers"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Rich gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061811] via-[#061811]/60 to-transparent" />

            <div className="relative z-10 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E5C07B]">
                FEATURED COLLECTION
              </p>
              <h3 className="font-serif text-3xl font-bold leading-tight text-white">
                Our Best Sellers
              </h3>
              <p className="text-xs text-zinc-200/90 leading-relaxed font-light">
                Loved by many, our best-selling collection combines tradition, comfort and style.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?bestSeller=true"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E5C07B] hover:bg-[#D4AF37] text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md group/btn"
                >
                  <span>Shop Best Sellers</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right 4 Product Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
              {bestSellers.slice(0, 4).map((product, idx) => {
                const isLiked = isInWishlist(product._id);
                const fallbackData = EXACT_BEST_SELLERS[idx] || EXACT_BEST_SELLERS[0];
                const img =
                  product.images?.[0]?.url ||
                  product.image ||
                  fallbackData.image;

                const badge = product.badge || fallbackData.badge;
                const badgeType = product.badgeType || fallbackData.badgeType;

                const badgeBg =
                  badgeType === 'rose'
                    ? 'bg-[#B91C1C]'
                    : badgeType === 'amber'
                    ? 'bg-[#9A621E]'
                    : 'bg-[#0D5C3A]';

                return (
                  <div
                    key={product._id || product.slug}
                    className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Product Image & Badges */}
                    <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Top Left Badge */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={`text-[9px] font-bold text-white uppercase px-2 py-0.5 rounded-full shadow-sm ${badgeBg}`}
                        >
                          {badge}
                        </span>
                      </div>

                      {/* Top Right Wishlist Heart */}
                      <button
                        onClick={(e) => handleLike(product, e)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-700 hover:text-rose-500 shadow-sm transition-colors z-10"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-3.5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <Link href={`/product/${product.slug || product._id}`}>
                          <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#B8860B] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                        </Link>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-bold text-zinc-900">
                            {product.rating ? product.rating.toFixed(1) : fallbackData.rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            ({product.reviewCount || fallbackData.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-sm font-bold text-zinc-950">
                            {formatCurrency(product.price || fallbackData.price)}
                          </span>
                          {(product.compareAtPrice || fallbackData.compareAtPrice) && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              {formatCurrency(product.compareAtPrice || fallbackData.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Pill Button (Dark Forest Green) */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-full py-2 px-3 rounded-full bg-[#0B2518] hover:bg-[#061811] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#E5C07B]" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SPECIAL OFFER BANNER ("FLAT 20% OFF")                       */}
      {/* ============================================================== */}
      <section className="bg-[#061811] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#D4AF37]/20 relative overflow-hidden">
        {/* Subtle background filigree */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Folded Silk Fabric Photo */}
          <div className="lg:col-span-4 relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85"
              alt="EFFIDOO Pure Silk Ethnic Weaves"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061811]/60 to-transparent" />
          </div>

          {/* Center: Offer Copy & CTA */}
          <div className="lg:col-span-4 text-center space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E5C07B]">
              SPECIAL OFFER
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              FLAT 20% OFF
            </h2>
            <p className="text-xs text-zinc-300 font-light max-w-xs mx-auto">
              On Selected Ethnic Wear Collection
            </p>
            <div className="pt-2">
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#E5C07B] hover:bg-[#D4AF37] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: 2x2 Circular Features Grid */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#081D14] border border-[#D4AF37]/20">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#E5C07B] flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Premium Fabrics</h5>
                <p className="text-[10px] text-zinc-400">Only the Finest Materials</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#081D14] border border-[#D4AF37]/20">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#E5C07B] flex-shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Handcrafted Details</h5>
                <p className="text-[10px] text-zinc-400">Made with love & care</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#081D14] border border-[#D4AF37]/20">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#E5C07B] flex-shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Timeless Designs</h5>
                <p className="text-[10px] text-zinc-400">Style for every occasion</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#081D14] border border-[#D4AF37]/20">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#E5C07B] flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Exclusive Collections</h5>
                <p className="text-[10px] text-zinc-400">Limited Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. NEW ARRIVALS - FRESH STYLES, JUST IN                         */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header with View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
              NEW ARRIVALS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2518] font-bold">
              Fresh Styles, Just In
            </h2>
            <p className="text-xs text-zinc-500">
              Explore the latest trends and add a touch of elegance to your wardrobe.
            </p>
          </div>

          <Link
            href="/shop?newArrival=true"
            className="text-xs font-bold text-[#0B2518] hover:text-[#B8860B] transition-colors inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5 Cards Row (Exact 5 items matching Mockup) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {newArrivals.slice(0, 5).map((product, idx) => {
            const isLiked = isInWishlist(product._id);
            const fallbackData = EXACT_NEW_ARRIVALS[idx] || EXACT_NEW_ARRIVALS[0];
            const img =
              product.images?.[0]?.url ||
              product.image ||
              fallbackData.image;

            const badge = product.badge || fallbackData.badge;
            const badgeType = product.badgeType || fallbackData.badgeType;

            const badgeBg =
              badgeType === 'rose'
                ? 'bg-[#B91C1C]'
                : badgeType === 'teal'
                ? 'bg-[#0E7490]'
                : 'bg-[#0D5C3A]';

            return (
              <div
                key={product._id || product.slug}
                className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className={`text-[9px] font-bold text-white uppercase px-2 py-0.5 rounded-full shadow-sm ${badgeBg}`}
                    >
                      {badge}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleLike(product, e)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-700 hover:text-rose-500 shadow-sm transition-colors z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col flex-1 justify-between space-y-2.5">
                  <div>
                    <Link href={`/product/${product.slug || product._id}`}>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#B8860B] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-zinc-900">
                        {product.rating ? product.rating.toFixed(1) : fallbackData.rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        ({product.reviewCount || fallbackData.reviewCount})
                      </span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-zinc-950">
                        {formatCurrency(product.price || fallbackData.price)}
                      </span>
                      {(product.compareAtPrice || fallbackData.compareAtPrice) && (
                        <span className="text-[10px] text-zinc-400 line-through">
                          {formatCurrency(product.compareAtPrice || fallbackData.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="w-full py-1.5 px-2 rounded-full bg-[#0B2518] hover:bg-[#061811] text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3 text-[#E5C07B]" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. TRADITIONAL MEETS MODERN - CRAFTED FOR EVERY OCCASION       */}
      {/* ============================================================== */}
      <section className="bg-[#061811] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#D4AF37]/20 relative overflow-hidden">
        {/* Subtle decorative gold floral outline */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
          {/* Left Column */}
          <div className="lg:w-1/3 text-center lg:text-left space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E5C07B]">
              TRADITIONAL MEETS MODERN
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-snug">
              Crafted for Every Occasion
            </h2>
            <p className="text-xs text-zinc-300 font-medium tracking-wide">
              Weddings &nbsp;|&nbsp; Festive &nbsp;|&nbsp; Casual &nbsp;|&nbsp; Party
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5C07B] hover:bg-[#D4AF37] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl group"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right 4 Occasion Cards */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {OCCASIONS.map((occ) => (
                <Link
                  key={occ.title}
                  href={occ.link}
                  className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#D4AF37]/30 group shadow-lg flex flex-col justify-end p-4"
                >
                  <Image
                    src={occ.image}
                    alt={occ.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061811] via-[#061811]/40 to-transparent" />

                  {/* Card Bottom Tag & Arrow */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-white group-hover:text-[#E5C07B] transition-colors">
                      {occ.title}
                    </span>
                    <div className="w-6 h-6 rounded-full border border-white/50 bg-black/30 flex items-center justify-center text-white group-hover:border-[#E5C07B] group-hover:text-[#E5C07B] transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. JOIN OUR NEWSLETTER SECTION (Ivory + Gold Lotus + Input)    */}
      {/* ============================================================== */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Text with Lotus */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <LotusIcon className="w-12 h-10 text-[#B8860B] flex-shrink-0" />
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2518]">
                Join Our Newsletter
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                Get the latest updates on new arrivals, offers and more.
              </p>
            </div>
          </div>

          {/* Right Email Form */}
          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto flex items-center max-w-md bg-white border border-[#D4AF37]/40 rounded-full p-1 shadow-sm focus-within:ring-2 focus-within:ring-[#D4AF37]"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent text-xs text-zinc-900 px-4 py-2 focus:outline-none placeholder:text-zinc-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#0B2518] hover:bg-[#061811] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors shadow"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
