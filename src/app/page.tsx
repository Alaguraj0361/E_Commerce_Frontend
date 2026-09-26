'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
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
    link: '/shop?category=sarees',
  },
  {
    tag: 'BRIDAL HERITAGE',
    title: 'Royal Handlooms',
    highlight: 'Pure Zari',
    description:
      'Intricate bridal lehengas, pure silk weaves, and bespoke silhouettes crafted with timeless Indian artistry.',
    image: '/images/hero_banner_2.jpg',
    link: '/shop?category=lehengas',
  },
  {
    tag: 'FESTIVE EDIT 2026',
    title: 'Regal Celebrations',
    highlight: 'Bespoke Fit',
    description:
      'From intimate family gatherings to grand festivities, explore our opulent collection of curated ethnic glamour.',
    image: '/images/hero_banner_3.jpg',
    link: '/shop?category=salwar-suits',
  },
];

// Exact 7 Categories in exact order from the Mockup
const EXACT_CATEGORIES = [
  {
    name: 'Sarees',
    slug: 'sarees',
    image: '/images/categories/sarees.jpg',
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    image: '/images/categories/lehengas.jpg',
  },
  {
    name: 'Salwar Suits',
    slug: 'salwar-suits',
    image: '/images/categories/salwar-suits.jpg',
  },
  {
    name: 'Kurtis',
    slug: 'kurtis',
    image: '/images/categories/kurtis.jpg',
  },
  {
    name: 'Anarkali',
    slug: 'anarkali',
    image: '/images/categories/anarkali.jpg',
  },
  {
    name: "Men's Wear",
    slug: 'mens-wear',
    image: '/images/categories/mens-wear.jpg',
  },
  {
    name: "Kid's Wear",
    slug: 'kids-wear',
    image: '/images/categories/kids-wear.jpg',
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
    badge: 'Bestseller',
    badgeType: 'bestseller',
    image: '/images/bestsellers/traditional_silk_saree.jpg',
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
    image: '/images/bestsellers/bridal_lehenga.jpg',
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
    image: '/images/bestsellers/embroidered_salwar_suit.jpg',
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
    image: '/images/bestsellers/anarkali_dress.jpg',
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
    reviewCount: 65,
    badge: 'New',
    badgeType: 'emerald',
    image: '/images/new_arrivals/designer_silk_saree.jpg',
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
    image: '/images/new_arrivals/straight_kurti_set.jpg',
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
    image: '/images/new_arrivals/lehenga_choli.jpg',
  },
  {
    _id: 'na-4',
    name: "Men's Kurta",
    slug: 'mens-kurta',
    price: 1999,
    compareAtPrice: 2999,
    rating: 4.6,
    reviewCount: 43,
    badge: 'Trend',
    badgeType: 'teal',
    image: '/images/new_arrivals/mens_kurta.jpg',
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
    image: '/images/new_arrivals/kids_festive_wear.jpg',
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

// Custom Icons & Botanical Decorations matching mockup
const WheatSproutIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 28 28"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 23C9 20 15 15 18 10C21 5 23 2.5 24 1.5C23 3 22 7 18 11C15 15 10 20 5 23Z"
      fill="currentColor"
    />
    <path d="M23.5 1.5C21 3.5 21 6.5 23 8C25 6.5 25.5 3.5 23.5 1.5Z" fill="currentColor" />
    <path d="M17 5.5C14.5 6 13.5 8.5 15 10.5C17 10.5 18.5 8.5 17 5.5Z" fill="currentColor" />
    <path d="M20 7.5C21.5 9.5 23.5 10 24.5 8.5C24.5 6.5 22.5 5.5 20 7.5Z" fill="currentColor" />
    <path d="M12.5 10C10.5 11 9.5 13.5 11 15C13 15 14.5 13 12.5 10Z" fill="currentColor" />
    <path d="M16 12C17.5 14 19.5 14.5 20.5 13C20.5 11 18.5 10 16 12Z" fill="currentColor" />
    <path d="M8.5 14.5C6.5 15.5 5.5 18 7 19.5C9 19.5 10.5 17.5 8.5 14.5Z" fill="currentColor" />
    <path d="M12 16.5C13.5 18.5 15.5 19 16.5 17.5C16.5 15.5 14.5 14.5 12 16.5Z" fill="currentColor" />
  </svg>
);

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>(EXACT_CATEGORIES);
  const [bestSellers, setBestSellers] = useState<any[]>(EXACT_BEST_SELLERS);
  const [newArrivals, setNewArrivals] = useState<any[]>(EXACT_NEW_ARRIVALS);
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
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

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentHeroSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  // Auto advance hero slider every 7 seconds, resetting timer on manual change
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [currentHeroSlide]);

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
              onClick={prevSlide}
              className="w-8 h-8 rounded-full border border-zinc-700 bg-black/60 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-zinc-950 flex items-center justify-center transition-all text-[#E5C07B]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 rounded-full border border-zinc-700 bg-black/60 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-zinc-950 flex items-center justify-center transition-all text-[#E5C07B]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TRUST BADGES STRIP (3 Gold Trust Badges on Ivory)         */}
      {/* ============================================================== */}
      <section className="bg-[#FAF5EB] border-y border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8DFC8] py-4 lg:py-5">
          {/* 1. Premium Quality */}
          <div className="flex items-center justify-center gap-3.5 px-4 sm:px-6 py-3">
            <WheatSproutIcon className="w-8 h-8 text-[#B38646] shrink-0" />
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-zinc-900 tracking-tight leading-snug">
                Premium Quality
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-normal leading-snug">
                Finest Fabrics
              </p>
            </div>
          </div>

          {/* 2. Free Shipping */}
          <div className="flex items-center justify-center gap-3.5 px-4 sm:px-6 py-3">
            <Truck className="w-8 h-8 text-[#B38646] shrink-0" strokeWidth={1.8} />
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-zinc-900 tracking-tight leading-snug">
                Free Shipping
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-normal leading-snug">
                On Orders Above ₹1,499
              </p>
            </div>
          </div>

          {/* 3. Secure Payments */}
          <div className="flex items-center justify-center gap-3.5 px-4 sm:px-6 py-3">
            <ShieldCheck className="w-8 h-8 text-[#B38646] shrink-0" strokeWidth={1.8} />
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-zinc-900 tracking-tight leading-snug">
                Secure Payments
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-normal leading-snug">
                100% Safe & Secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SHOP BY CATEGORY - EXPLORE OUR COLLECTIONS                 */}
      {/* ============================================================== */}
      <section
        className="relative bg-[#FAF5EB] bg-cover bg-center bg-no-repeat border-b border-[#E8DFC8] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
        style={{ backgroundImage: "url('/images/explore_collection_bg.png')" }}
      >

        <div className="max-w-[1560px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8 xl:gap-10 relative z-10">
          {/* Left Title & Call to Action */}
          <div className="lg:w-[280px] xl:w-[320px] shrink-0 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B38646] mb-3">
              SHOP BY CATEGORY
            </p>
            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] text-zinc-900 font-semibold tracking-tight mb-4"
              style={{ lineHeight: '3.5rem' }}
            >
              Explore Our<br /> Collections
            </h2>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-normal leading-relaxed max-w-[270px] mb-7">
              Find your perfect style from our wide range of ethnic wear.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#051C14] hover:bg-[#092B20] text-white text-xs font-semibold tracking-wider transition-all shadow-md hover:shadow-lg group"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right 7 Circular Avatars Grid in Single Row (Order: Sarees, Lehengas, Salwar Suits, Kurtis, Anarkali, Men's Wear, Kids Wear) */}
          <div className="flex-1 w-full overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            <div className="grid grid-flow-col auto-cols-[130px] sm:auto-cols-[145px] lg:grid-flow-row lg:grid-cols-7 gap-5 sm:gap-6 lg:gap-4 xl:gap-6 2xl:gap-8 justify-items-center items-start">
              {categories.slice(0, 7).map((cat) => {
                const categoryImg =
                  EXACT_CATEGORIES.find((c) => c.slug === cat.slug)?.image ||
                  `/images/categories/${cat.slug}.jpg` ||
                  cat.image;

                return (
                  <Link
                    key={cat.slug || cat.name}
                    href={`/shop?category=${cat.slug}`}
                    className="flex flex-col items-center text-center group cursor-pointer w-full"
                  >
                    {/* Golden Bordered Large Circle Avatar */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-32 md:h-32 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 rounded-full p-[3.5px] border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-[#B8860B]">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-100">
                        <Image
                          src={categoryImg}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 130px, 160px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
                          priority
                        />
                      </div>
                    </div>

                    {/* Category Title */}
                    <h3 className="mt-3 text-[13px] sm:text-sm font-serif font-bold text-zinc-900 group-hover:text-[#B38646] transition-colors whitespace-nowrap tracking-tight">
                      {cat.name}
                    </h3>

                    {/* Explore Link */}
                    <span className="mt-1 text-xs text-[#A87C38] font-medium inline-flex items-center gap-1 group-hover:text-zinc-950 transition-colors">
                      Explore <span className="text-[13px] ml-0.5 leading-none">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 4. FEATURED COLLECTION - OUR BEST SELLERS                      */}
      {/* ============================================================== */}
      <section
        className="relative bg-[#FAF5EB] bg-cover bg-center bg-no-repeat border-b border-[#E8DFC8] py-10 lg:py-14 overflow-hidden"
        style={{ backgroundImage: "url('/images/bestsellers_bg.png')" }}
      >
        {/* Left Side Title Background Image (Emerald Saree Model with Candlelit Palace Ambiance) */}
        <div className="absolute left-0 top-0 h-[260px] lg:h-full w-full lg:w-[48%] xl:w-[42%] 2xl:w-[38%] pointer-events-none z-0 overflow-hidden">
          <Image
            src="/images/bestsellers/left_title_bg.png"
            alt="Best Sellers"
            fill
            priority
            className="object-cover object-[left_center]"
          />
          {/* Subtle darkening overlay behind text area for maximum contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/45 to-transparent" />
          {/* Smooth blend on mobile to bottom and desktop to right */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#FAF5EB] to-transparent lg:hidden" />
          <div className="absolute inset-y-0 right-0 w-28 sm:w-44 bg-gradient-to-r from-transparent to-[#FAF5EB] hidden lg:block" />
        </div>

        {/* Content Container */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-10 relative z-10">
          {/* Left Title & Call to Action (Padded on left so text is positioned gracefully to the right of the model) */}
          <div className="w-full lg:w-[380px] xl:w-[430px] 2xl:w-[460px] lg:pl-[130px] xl:pl-[160px] 2xl:pl-[180px] shrink-0 text-center lg:text-left flex flex-col items-center lg:items-start text-white py-4 lg:py-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5C07B] mb-2.5 drop-shadow">
              FEATURED COLLECTION
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] text-white font-normal leading-[1.15] tracking-tight mb-3 drop-shadow-md">
              Our Best Sellers
            </h2>
            <p className="text-xs sm:text-[13px] text-zinc-200/90 leading-relaxed font-light max-w-[270px] mb-6 drop-shadow">
              Loved by many, our best-selling collection combines tradition, comfort and style.
            </p>
            <Link
              href="/shop?bestSeller=true"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#F7D47A] via-[#E8B854] to-[#D59837] hover:brightness-105 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl transform hover:scale-105 group/btn"
            >
              <span>Shop Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>

          {/* Right 4 Product Cards (2 per row on mobile, 4 per row on desktop) */}
          <div className="flex-1 w-full flex items-center gap-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 xl:gap-4 w-full">
              {bestSellers.slice(0, 4).map((product, idx) => {
                const isLiked = isInWishlist(product._id);
                const fallbackData =
                  EXACT_BEST_SELLERS.find((c) => c.slug === product.slug) ||
                  EXACT_BEST_SELLERS[idx] ||
                  EXACT_BEST_SELLERS[0];
                const img = fallbackData.image || product.images?.[0]?.url || product.image;
                const badge = fallbackData.badge || product.badge;
                const badgeType = fallbackData.badgeType || product.badgeType;

                return (
                  <div
                    key={product._id || product.slug || idx}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8DFC8]/70 flex flex-col group transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                  >
                    {/* Top Image Flush to Card Edges */}
                    <div className="relative aspect-[1.18/1] w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Top Left Badge */}
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10">
                        {badgeType === 'bestseller' ? (
                          <span className="font-serif italic text-[9px] sm:text-[11px] font-bold text-[#F5D07A] bg-black/90 px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                            Bestseller
                          </span>
                        ) : badgeType === 'rose' ? (
                          <span className="text-[9px] sm:text-[11px] font-bold text-white bg-[#DC2626] px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm">
                            Hot
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[11px] font-bold text-white bg-[#0D5C3A] px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm">
                            New
                          </span>
                        )}
                      </div>

                      {/* Top Right Floating White Heart Outline */}
                      <button
                        onClick={(e) => handleLike(product, e)}
                        className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2.5 z-10 text-white drop-shadow hover:scale-110 transition-transform"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <Link href={`/product/${product.slug || product._id}`}>
                          <h4 className="text-[11px] sm:text-[13px] font-medium text-zinc-700 group-hover:text-[#B38646] transition-colors line-clamp-1 mb-0.5 sm:mb-1 tracking-tight">
                            {product.name}
                          </h4>
                        </Link>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-[11px] sm:text-xs font-semibold text-zinc-800">
                            {product.rating ? product.rating.toFixed(1) : fallbackData.rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-zinc-400">
                            ({product.reviewCount || fallbackData.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                          <span className="text-xs sm:text-sm md:text-base font-bold text-zinc-950">
                            {formatCurrency(product.price || fallbackData.price)}
                          </span>
                          {(product.compareAtPrice || fallbackData.compareAtPrice) && (
                            <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                              {formatCurrency(product.compareAtPrice || fallbackData.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Pill Button (Dark Forest Green with Shopping Cart) */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-full bg-[#051C14] hover:bg-[#0A2E22] text-white text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-sm active:scale-95 group/cart"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white transition-transform group-hover/cart:scale-110" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next / Prev Carousel Buttons on Far Right */}
            <div className="hidden xl:flex items-center gap-1.5 shrink-0 pl-1">
              <button
                className="w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#E8DFC8] hover:border-zinc-400 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                className="w-7 h-7 rounded-full bg-white/95 shadow-md border border-[#E8DFC8] hover:border-zinc-400 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SPECIAL OFFER BANNER ("FLAT 20% OFF")                       */}
      {/* ============================================================== */}
      <section
        id="special-offer-section"
        className="relative w-full overflow-hidden bg-[#240614] border-y border-[#D4AF37]/35 text-white scroll-mt-20 lg:scroll-mt-24 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      >
        {/* Full-width Royal Wine Silk Background with ambient illumination */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#200411] via-[#2A0818] to-[#1E0310] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,_var(--tw-gradient-stops))] from-[#4A132C]/60 via-transparent to-transparent pointer-events-none" />

        {/* Far Left: Botanical Leaf Linework Vector */}
        <div className="absolute left-0 bottom-0 top-0 w-32 sm:w-48 lg:w-64 pointer-events-none opacity-40 z-0">
          <Image
            src="/images/offers/botanical_leaves.svg"
            alt="Gold Botanical Motifs"
            fill
            className="object-contain object-left-bottom"
          />
        </div>

        {/* Right Side: Ultra High Clarity 4K Photorealistic Ethnic Fabrics */}
        <div className="absolute right-0 top-0 bottom-0 w-[48%] sm:w-[48%] md:w-[46%] lg:w-[44%] xl:w-[42%] h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/offers/ethnic_fabrics_clarity.jpg"
            alt="Luxury Ethnic Fabrics with Jasmine Garland"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 50vw, 42vw"
          />
          {/* Feathered gradient to dissolve fabrics seamlessly into the burgundy background on the left */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-36 lg:w-48 bg-gradient-to-r from-[#240614] via-[#240614]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#200411]/40 via-transparent to-[#200411]/30" />
        </div>

        {/* Full-width Responsive Content Grid */}
        <div className="w-full relative z-10 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 flex flex-row items-center justify-between">
          {/* Left Column: Crisp High-End Typography & CTA */}
          <div className="max-w-xl flex flex-col items-start space-y-2 sm:space-y-3 lg:space-y-3.5 z-10">
            {/* Limited Time Offer */}
            <span className="text-[#DEB371] font-serif tracking-[0.22em] text-[11px] sm:text-xs md:text-sm font-medium uppercase drop-shadow">
              Limited Time Offer
            </span>

            {/* FLAT 20% OFF */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#F5D48D] to-[#CF9F42] leading-[1.05] drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              FLAT 20% OFF
            </h2>

            {/* On All Ethnic Wear */}
            <p className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-[#EBD9C2] font-light tracking-wide drop-shadow">
              On All Ethnic Wear
            </p>

            {/* Shop Now Button */}
            <div className="pt-2 sm:pt-3">
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#E5BD7B] via-[#DEB371] to-[#D5A558] hover:brightness-110 text-[#240614] font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] transform hover:scale-105 group/btn"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Center Badge: Precision Vector SVG Royal Arch with 20% OFF */}
          <div className="flex shrink-0 items-center justify-center mr-auto ml-4 sm:ml-8 md:ml-10 lg:ml-16 xl:ml-24 z-10">
            <div className="relative w-24 h-20 sm:w-32 sm:h-28 md:w-40 md:h-36 lg:w-48 lg:h-44 xl:w-52 xl:h-48 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/offers/arch_badge.svg"
                alt="20% OFF Royal Arch Badge"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Spacer to accommodate the right fabrics drape */}
          <div className="hidden lg:block w-[32%] xl:w-[35%] shrink-0 pointer-events-none" />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. NEW ARRIVALS - FRESH STYLES, JUST IN                         */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden py-14 sm:py-18 lg:py-20 border-y border-[#EAE1D1]">
        {/* Full-width Botanical Cream Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/new_arrivals_bg.png"
            alt="New Arrivals Botanical Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          {/* Header with Centered Title & Right-Aligned View All */}
          <div className="relative mb-8 sm:mb-10 lg:mb-12">
            <div className="text-center max-w-2xl mx-auto px-4 sm:px-8">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B] mb-1 sm:mb-1.5">
                NEW ARRIVALS
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] text-[#1A1A1A] font-medium tracking-tight leading-tight">
                Fresh Styles, Just In
              </h2>
              <p className="text-xs sm:text-[13.5px] text-zinc-600 mt-1 sm:mt-2 font-normal">
                Explore the latest trends and add a touch of elegance to your wardrobe.
              </p>
            </div>

            {/* View All positioned on the right */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:bottom-0.5 flex justify-center sm:justify-end">
              <Link
                href="/shop?newArrival=true"
                className="text-xs sm:text-[13px] font-semibold text-zinc-900 hover:text-[#B8860B] transition-colors inline-flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Cards & Carousel Navigation */}
          <div className="relative flex items-center">
            {/* 5 Cards Row (Exact 5 items matching Mockup, 2 cards per row on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4 xl:gap-5 flex-1">
              {EXACT_NEW_ARRIVALS.map((fallbackData, idx) => {
                const actualIdx = (idx + newArrivalsIndex) % EXACT_NEW_ARRIVALS.length;
                const cardData = EXACT_NEW_ARRIVALS[actualIdx];
                const product = newArrivals.find((p) => p.slug === cardData.slug) || cardData;

                const isLiked = isInWishlist(cardData._id || product._id);
                const img = cardData.image || product.images?.[0]?.url || product.image;
                const badge = cardData.badge;
                const badgeType = cardData.badgeType;
                const rating = cardData.rating;
                const reviewCount = cardData.reviewCount;
                const price = cardData.price;
                const compareAtPrice = cardData.compareAtPrice;
                const name = cardData.name;

                return (
                  <div
                    key={cardData._id || cardData.slug || idx}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#EAE1D1]/80 flex flex-col group transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                  >
                    {/* Top Image Flush to Card Edges */}
                    <div className="relative aspect-[1.12/1] w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={img}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Top Left Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        {badgeType === 'rose' || badge === 'Hot' ? (
                          <span className="text-[9.5px] sm:text-[10px] font-semibold text-white bg-[#E11D48] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                            {badge}
                          </span>
                        ) : badgeType === 'teal' || badge === 'Trend' ? (
                          <span className="text-[9.5px] sm:text-[10px] font-semibold text-white bg-[#064E3B] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                            {badge}
                          </span>
                        ) : (
                          <span className="text-[9.5px] sm:text-[10px] font-semibold text-white bg-[#0B3B2B] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                            {badge}
                          </span>
                        )}
                      </div>

                      {/* Top Right Floating White Heart Outline */}
                      <button
                        onClick={(e) => handleLike({ ...cardData, ...product, image: img }, e)}
                        className="absolute top-2 right-2 z-10 text-white drop-shadow hover:scale-110 transition-transform"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
                            isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <Link href={`/product/${cardData.slug}`}>
                          <h4 className="text-[12px] sm:text-[13.5px] font-semibold text-zinc-900 group-hover:text-[#B8860B] transition-colors line-clamp-1 tracking-tight">
                            {name}
                          </h4>
                        </Link>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-[11px] sm:text-xs font-semibold text-zinc-800">
                            {rating.toFixed(1)}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-zinc-400">
                            ({reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="flex items-center justify-between mt-2 pt-0.5">
                        <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
                          <span className="text-xs sm:text-[14px] md:text-[15px] font-bold text-zinc-950">
                            {formatCurrency(price)}
                          </span>
                          {compareAtPrice && (
                            <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-normal">
                              {formatCurrency(compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Circular Black Action Button with White Right Arrow */}
                        <button
                          onClick={(e) => handleQuickAdd({ ...cardData, ...product, image: img }, e)}
                          title="Add to Cart"
                          aria-label="Add to Cart"
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-950 hover:bg-[#B8860B] text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 shrink-0 ml-1.5 group/arrow cursor-pointer"
                        >
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] transition-transform group-hover/arrow:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Carousel Controls next to 5th Card */}
            <div className="hidden xl:flex items-center gap-1.5 pl-3 xl:pl-4 shrink-0">
              <button
                onClick={() => {
                  setNewArrivalsIndex(
                    (prev) => (prev - 1 + EXACT_NEW_ARRIVALS.length) % EXACT_NEW_ARRIVALS.length
                  );
                }}
                aria-label="Previous arrival"
                className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-zinc-200/80 hover:border-zinc-400 flex items-center justify-center text-zinc-700 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                onClick={() => {
                  setNewArrivalsIndex(
                    (prev) => (prev + 1) % EXACT_NEW_ARRIVALS.length
                  );
                }}
                aria-label="Next arrival"
                className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-zinc-200/80 hover:border-zinc-400 flex items-center justify-center text-zinc-700 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
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
