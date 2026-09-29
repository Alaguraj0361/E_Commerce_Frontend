'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Instagram,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
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


// Curated Occasions with High-Definition Luxury Ethnic Imagery
const OCCASIONS = [
  {
    title: 'Weddings',
    subtitle: 'Bridal Couture & Lehengas',
    tag: 'Grand Royale',
    image: '/images/categories/lehengas.jpg',
    link: '/shop?category=lehengas',
  },
  {
    title: 'Festive',
    subtitle: 'Kanjivaram & Pure Silks',
    tag: 'Heritage Drapes',
    image: '/images/categories/sarees.jpg',
    link: '/shop?category=sarees',
  },
  {
    title: 'Casual',
    subtitle: 'Handcrafted Chikankari',
    tag: 'Daily Grace',
    image: '/images/categories/kurtis.jpg',
    link: '/shop?category=kurtis',
  },
  {
    title: 'Party Wear',
    subtitle: 'Opulent Anarkalis & Gowns',
    tag: 'Evening Glamour',
    image: '/images/categories/anarkali.jpg',
    link: '/shop?category=anarkali',
  },
];

// Verified Google Reviews Data
const GOOGLE_REVIEWS = [
  {
    id: 1,
    author: 'Ananya Sharma',
    city: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 days ago',
    verified: true,
    review:
      'NALMARA FASHION’s Kanchipuram silk saree made my reception truly unforgettable. The pure gold zari craftsmanship and weight of the silk are peerless. The luxury packaging felt like receiving an heirloom royal gift!',
    product: 'Royal Kanchipuram Pure Silk Saree',
  },
  {
    id: 2,
    author: 'Priya Venkatesh',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 week ago',
    verified: true,
    review:
      'I ordered a bridal velvet lehenga with custom blouse tailoring. The fitting was immaculate, and the zardozi embroidery sparkles gracefully under banquet chandeliers. Truly bespoke royal craftsmanship!',
    product: 'Heritage Zardozi Velvet Bridal Lehenga',
  },
  {
    id: 3,
    author: 'Meera Rajput',
    city: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    review:
      'Exquisite Chanderi weaves and authentic handlooms. The styling concierge even arranged a video consultation to help match my wedding jewelry. Outstanding luxury customer service!',
    product: 'Handwoven Chanderi Kurti & Dupatta Set',
  },
  {
    id: 4,
    author: 'Sneha Kulkarni',
    city: 'Pune',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 weeks ago',
    verified: true,
    review:
      'Fast express delivery and genuine handloom silk certificates included. NALMARA FASHION has rightfully earned its place as our family’s premier choice for all celebratory occasions.',
    product: 'Paithani Heritage Zari Silk Saree',
  },
];

// Curated Instagram Recent Posts
const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    likes: '3.4k',
    comments: 142,
    caption: 'Royal ivory lehengas crafted for modern brides. ✨ #NalmaraFashionBridal',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    likes: '4.8k',
    comments: 215,
    caption: 'Drapes of majesty in regal jewel tones. 💜 #NalmaraFashionHeritage',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    likes: '2.9k',
    comments: 98,
    caption: 'Effortless fusion charm for sunlit garden celebrations. ☀️ #NalmaraFashionStyle',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80',
    likes: '5.2k',
    comments: 310,
    caption: 'Dusty rose sequins and sheer elegance under chandelier lights. 💫 #NalmaraFashionCouture',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    likes: '3.1k',
    comments: 124,
    caption: 'Intricate zardozi needlework by our master kaarigars. 🧵 #NalmaraFashionArtisans',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    likes: '4.1k',
    comments: 189,
    caption: 'The art of the perfect pallu drape. Unmistakably NALMARA FASHION. 👑 #NalmaraFashionMoments',
    link: 'https://www.instagram.com/nalmarafashion_official',
  },
];

// In-memory module cache for instantaneous client-side navigation
let cachedCategoriesMemory: any[] | null = null;
let cachedCollectionsMemory: { bestSellers: any[]; newArrivals: any[] } | null = null;

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>(() => cachedCategoriesMemory || []);
  const [bestSellers, setBestSellers] = useState<any[]>(() => cachedCollectionsMemory?.bestSellers || []);
  const [newArrivals, setNewArrivals] = useState<any[]>(() => cachedCollectionsMemory?.newArrivals || []);
  const [isLoadingCategories, setIsLoadingCategories] = useState(!cachedCategoriesMemory);
  const [isLoadingProducts, setIsLoadingProducts] = useState(
    !cachedCollectionsMemory ||
      (cachedCollectionsMemory.bestSellers.length === 0 &&
        cachedCollectionsMemory.newArrivals.length === 0)
  );
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    // 1. Instant cache hydration from sessionStorage if memory cache was empty
    try {
      if (!cachedCategoriesMemory) {
        const storedCats = sessionStorage.getItem('cached_categories');
        if (storedCats) {
          const parsed = JSON.parse(storedCats);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedCategoriesMemory = parsed;
            setCategories(parsed);
            setIsLoadingCategories(false);
          }
        }
      }

      if (!cachedCollectionsMemory) {
        const storedColls = sessionStorage.getItem('cached_home_collections');
        if (storedColls) {
          const parsed = JSON.parse(storedColls);
          if (parsed?.bestSellers?.length > 0 || parsed?.newArrivals?.length > 0) {
            cachedCollectionsMemory = parsed;
            if (parsed.bestSellers?.length > 0) setBestSellers(parsed.bestSellers);
            if (parsed.newArrivals?.length > 0) setNewArrivals(parsed.newArrivals);
            setIsLoadingProducts(false);
          }
        }
      }
    } catch {
      // Storage access error or invalid JSON
    }

    // 2. Fetch categories independently - display IMMEDIATELY as soon as response arrives
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          cachedCategoriesMemory = res.data.data;
          setCategories(res.data.data);
          try {
            sessionStorage.setItem('cached_categories', JSON.stringify(res.data.data));
          } catch {}
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    // 3. Fetch products independently - display IMMEDIATELY without waiting for other calls
    const fetchProducts = async () => {
      try {
        const collectionsRes = await api.get('/products/collections/home');
        let dynamicBest: any[] = [];
        let dynamicNew: any[] = [];

        if (collectionsRes.data?.success && collectionsRes.data.data) {
          const { bestSellers: apiBest, newArrivals: apiNew } = collectionsRes.data.data;
          if (Array.isArray(apiBest) && apiBest.length > 0) {
            dynamicBest = apiBest;
          }
          if (Array.isArray(apiNew) && apiNew.length > 0) {
            dynamicNew = apiNew;
          }
        }

        // Only fallback if collections endpoint returned empty
        if (dynamicBest.length === 0 || dynamicNew.length === 0) {
          try {
            const fallbackRes = await api.get('/products?limit=12&isActive=true');
            if (fallbackRes.data?.success && Array.isArray(fallbackRes.data.data)) {
              const allProds = fallbackRes.data.data;
              if (dynamicBest.length === 0) {
                const bestList = allProds.filter((p: any) => p.bestSeller);
                dynamicBest = bestList.length > 0 ? bestList : allProds;
              }
              if (dynamicNew.length === 0) {
                const newList = allProds.filter((p: any) => p.newArrival);
                dynamicNew = newList.length > 0 ? newList : allProds;
              }
            }
          } catch (e) {
            console.warn('Fallback products query failed:', e);
          }
        }

        cachedCollectionsMemory = { bestSellers: dynamicBest, newArrivals: dynamicNew };
        setBestSellers(dynamicBest);
        setNewArrivals(dynamicNew);
        try {
          sessionStorage.setItem(
            'cached_home_collections',
            JSON.stringify({ bestSellers: dynamicBest, newArrivals: dynamicNew })
          );
        } catch {}
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    // Trigger both queries concurrently without blocking each other
    fetchCategories();
    fetchProducts();
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

  const newArrivalsSliderRef = useRef<HTMLDivElement>(null);

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    if (!newArrivalsSliderRef.current) return;
    const container = newArrivalsSliderRef.current;
    const card = container.querySelector('.arrival-card') as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 20 : 300;

    if (direction === 'right') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const bestSellersSliderRef = useRef<HTMLDivElement>(null);

  const scrollBestSellers = (direction: 'left' | 'right') => {
    if (!bestSellersSliderRef.current) return;
    const container = bestSellersSliderRef.current;
    const card = container.querySelector('.bestseller-card') as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 16 : 280;

    if (direction === 'right') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft <= 10) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product._id,
      name: product.name,
      image:
        product.images?.[0]?.url ||
        product.image ||
        '/images/new_arrivals/designer_silk_saree.jpg',
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
            '/images/new_arrivals/designer_silk_saree.jpg',
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

  const currentSlide = HERO_SLIDES[currentHeroSlide];

  return (
    <div className="bg-[#FAF8F5] text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 1. HERO BANNER SECTION (Regal Candlelit Palace + Elegance)    */}
      {/* ============================================================== */}
      <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] w-full bg-[#061811] text-white flex items-center overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-14 sm:py-16 lg:py-24">
          <div className="max-w-xl space-y-3.5 sm:space-y-4">
            {/* Tagline Badge */}
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5C07B]">
              {currentSlide.tag}
            </p>

            {/* Headline */}
            <div className="space-y-0">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-wide leading-tight">
                {currentSlide.title}
              </h1>
              <span className="font-script text-4xl sm:text-6xl lg:text-7xl text-[#E5C07B] block font-normal tracking-wide -mt-1 sm:-mt-3">
                {currentSlide.highlight}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md font-light pt-1">
              {currentSlide.description}
            </p>

            {/* Shop Now CTA Button */}
            <div className="pt-2 sm:pt-3">
              <Link
                href={currentSlide.link}
                className="inline-flex items-center gap-2 px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#E5C07B] to-[#D4AF37] hover:opacity-95 text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-105 shadow-xl group"
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
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 lg:right-12 z-10 flex flex-col items-end gap-2.5 sm:gap-3 text-white">
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
      {/* 3. SHOP BY CATEGORY - EXPLORE OUR COLLECTIONS                 */}
      {/* ============================================================== */}
      <section
        className="relative bg-[#FAF5EB] bg-cover bg-center bg-no-repeat border-b border-[#E8DFC8] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
        style={{ backgroundImage: "url('/images/explore_collection_bg.png')" }}
      >

        <div className="max-w-[1560px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8 xl:gap-10 relative z-10">
          {/* Left Title & Call to Action */}
          <div className="lg:w-[280px] xl:w-[320px] shrink-0 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B38646] mb-2 sm:mb-3">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[40px] xl:text-[44px] text-zinc-900 font-semibold tracking-tight mb-3 sm:mb-4 leading-tight sm:leading-tight lg:leading-[1.12]">
              Explore Our<br className="hidden sm:inline" /> Collections
            </h2>
            <p className="text-xs sm:text-[13px] text-zinc-600 font-normal leading-relaxed max-w-[270px] mb-6 sm:mb-7">
              Find your perfect style from our wide range of ethnic wear.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#051C14] hover:bg-[#092B20] text-white text-xs font-semibold tracking-wider transition-all shadow-md hover:shadow-lg group"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Circular Avatars in dynamic layout with Skeleton Loading */}
          <div className="flex-1 w-full overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
            {isLoadingCategories ? (
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none justify-start px-1 sm:px-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col items-center text-center animate-pulse shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full p-[3px] border-2 border-[#D4AF37]/30 bg-white shadow-sm flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#EAE1D1]/60" />
                    </div>
                    <div className="h-4 w-20 bg-[#EAE1D1]/70 rounded-full mt-3" />
                    <div className="h-3 w-12 bg-[#EAE1D1]/40 rounded-full mt-1.5" />
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none justify-start px-1 sm:px-0">
                {categories.map((cat) => {
                  const categoryImg =
                    cat.image ||
                    `/images/categories/${cat.slug}.jpg` ||
                    '/images/categories/sarees.jpg';

                  return (
                    <Link
                      key={cat._id || cat.slug || cat.name}
                      href={`/shop?category=${cat.slug}`}
                      className="flex flex-col items-center text-center group cursor-pointer shrink-0"
                    >
                      {/* Golden Bordered Large Circle Avatar */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 rounded-full p-[3.5px] border-2 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-[#B8860B]">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-100">
                          <Image
                            src={categoryImg}
                            alt={cat.name}
                            fill
                            sizes="(max-width: 640px) 110px, 160px"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
                            priority
                            unoptimized={typeof categoryImg === 'string' && categoryImg.startsWith('data:')}
                          />
                        </div>
                      </div>

                      {/* Category Title */}
                      <h3 className="mt-2.5 sm:mt-3 text-[12px] sm:text-sm font-serif font-bold text-zinc-900 group-hover:text-[#B38646] transition-colors whitespace-nowrap tracking-tight">
                        {cat.name}
                      </h3>

                      {/* Explore Link */}
                      <span className="mt-1 text-[11px] sm:text-xs text-[#A87C38] font-medium inline-flex items-center gap-1 group-hover:text-zinc-950 transition-colors">
                        Explore <span className="text-[12px] sm:text-[13px] ml-0.5 leading-none">→</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 4. FEATURED COLLECTION - OUR BEST SELLERS                      */}
      {/* ============================================================== */}
      <section
        className="relative bg-[#FAF5EB] bg-cover bg-center bg-no-repeat border-b border-[#E8DFC8] py-10 lg:py-14 overflow-hidden"
        style={{ backgroundImage: "url('/images/bestsellers_bg.png')" }}
      >
        {/* Left Side Title Background Image (Emerald Saree Model with Candlelit Palace Ambiance) */}
        <div className="absolute left-0 top-0 h-[300px] sm:h-[320px] lg:h-full w-full lg:w-[48%] xl:w-[42%] 2xl:w-[38%] pointer-events-none z-0 overflow-hidden">
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
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E5C07B] mb-2 sm:mb-2.5 drop-shadow">
              FEATURED COLLECTION
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] text-white font-normal leading-tight tracking-tight mb-2 sm:mb-3 drop-shadow-md">
              Our Best Sellers
            </h2>
            <p className="text-xs sm:text-[13px] text-zinc-200/90 leading-relaxed font-light max-w-[270px] mb-5 sm:mb-6 drop-shadow">
              Loved by many, our best-selling collection combines tradition, comfort and style.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/shop?bestSeller=true"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#F7D47A] via-[#E8B854] to-[#D59837] hover:brightness-105 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-xl transform hover:scale-105 group/btn"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>

              {bestSellers.length > 3 && (
                <div className="hidden sm:flex items-center gap-1.5 pl-1">
                  <button
                    onClick={() => scrollBestSellers('left')}
                    aria-label="Previous best sellers"
                    className="w-8 h-8 rounded-full bg-white/90 shadow-md border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-white flex items-center justify-center text-zinc-800 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    onClick={() => scrollBestSellers('right')}
                    aria-label="Next best sellers"
                    className="w-8 h-8 rounded-full bg-white/90 shadow-md border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-white flex items-center justify-center text-zinc-800 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Product Cards with Skeleton Loading and 3-Card Slider */}
          <div className="flex-1 w-full relative group/bestseller-slider overflow-hidden">
            {/* Left Floating Chevron Button (Desktop) */}
            {bestSellers.length > 3 && (
              <button
                onClick={() => scrollBestSellers('left')}
                aria-label="Previous best sellers"
                className="hidden lg:flex absolute left-1 xl:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:border-[#B8860B] hover:bg-white text-zinc-800 hover:text-[#B8860B] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Right Floating Chevron Button (Desktop) */}
            {bestSellers.length > 3 && (
              <button
                onClick={() => scrollBestSellers('right')}
                aria-label="Next best sellers"
                className="hidden lg:flex absolute right-1 xl:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:border-[#B8860B] hover:bg-white text-zinc-800 hover:text-[#B8860B] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Skeleton Loading State (3 Cards Visible) */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 xl:gap-4 w-full">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-[#E8DFC8]/70 flex flex-col animate-pulse"
                  >
                    <div className="relative aspect-[1.18/1] w-full bg-[#EAE1D1]/60" />
                    <div className="p-3.5 space-y-2.5 bg-white">
                      <div className="h-3.5 bg-[#EAE1D1]/70 rounded w-3/4" />
                      <div className="h-3 bg-[#EAE1D1]/50 rounded w-1/2" />
                      <div className="h-4 bg-[#EAE1D1]/70 rounded w-1/3" />
                      <div className="h-8 bg-[#FAF5EB] border border-[#EAE1D1] rounded-full w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
              <div
                ref={bestSellersSliderRef}
                className="flex items-stretch gap-3 sm:gap-3.5 xl:gap-4 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory py-2 -mx-1 px-1 w-full"
              >
                {bestSellers.map((product, idx) => {
                  const isLiked = isInWishlist(product._id);
                  const img =
                    product.images?.[0]?.url ||
                    product.image ||
                    '/images/hero_banner.jpg';
                  const badge = product.bestSeller
                    ? 'Bestseller'
                    : product.newArrival
                    ? 'New'
                    : 'Bestseller';
                  const badgeType = product.bestSeller ? 'bestseller' : 'rose';

                  return (
                    <div
                      key={product._id || product.slug || idx}
                      className="bestseller-card shrink-0 w-[calc(50%-6px)] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] snap-start bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8DFC8]/70 flex flex-col group transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                    >
                      {/* Top Image Flush to Card Edges */}
                      <div className="relative aspect-[1.18/1] w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                          unoptimized={typeof img === 'string' && img.startsWith('data:')}
                        />

                        {/* Top Left Badge */}
                        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 z-10">
                          {badgeType === 'bestseller' ? (
                            <span className="font-serif italic text-[9px] sm:text-[11px] font-bold text-[#F5D07A] bg-black/90 px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                              Bestseller
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[11px] font-bold text-white bg-[#DC2626] px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm">
                              Hot
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
                            <h4 className="text-[11px] sm:text-[13px] font-medium text-zinc-800 group-hover:text-[#B38646] transition-colors line-clamp-1 mb-0.5 sm:mb-1 tracking-tight">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                            <span className="text-[11px] sm:text-xs font-semibold text-zinc-800">
                              {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-zinc-400">
                              ({product.reviewCount ?? 0})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                            <span className="text-xs sm:text-sm md:text-base font-bold text-zinc-950">
                              {formatCurrency(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                                {formatCurrency(product.compareAtPrice)}
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
            ) : null}

            {/* Mobile Prev / Next Controls */}
            {bestSellers.length > 2 && (
              <div className="flex sm:hidden items-center justify-center gap-2 pt-3">
                <button
                  onClick={() => scrollBestSellers('left')}
                  aria-label="Previous best seller"
                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 flex items-center justify-center text-zinc-700 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  onClick={() => scrollBestSellers('right')}
                  aria-label="Next best seller"
                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 flex items-center justify-center text-zinc-700 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SPECIAL OFFER BANNER ("FLAT 20% OFF")                       */}
      {/* ============================================================== */}
      <section
        id="special-offer-section"
        className="relative w-full overflow-hidden bg-[#1E0312] border-y border-[#D4AF37]/35 text-white scroll-mt-20 lg:scroll-mt-24 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      >
        {/* Full-width Royal Wine Velvet Silk Background with radial ambient illumination */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0210] via-[#260517] to-[#18010E] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_32%_50%,rgba(78,20,48,0.7)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_50%,rgba(229,186,114,0.08)_0%,transparent_60%)] pointer-events-none" />

        {/* Top and Bottom Gold Hairline Trims */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5BA72]/60 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5BA72]/60 to-transparent z-20 pointer-events-none" />

        {/* Far Left: Botanical Leaf Linework Vector */}
        <div className="absolute left-0 bottom-0 top-0 w-28 sm:w-44 lg:w-56 pointer-events-none opacity-30 z-0">
          <Image
            src="/images/offers/botanical_leaves.svg"
            alt="Gold Botanical Motifs"
            fill
            className="object-contain object-left-bottom"
          />
        </div>

        {/* Right Side: Ultra High Clarity 4K Photorealistic Ethnic Fabrics with Seamless Alpha Mask (Zero Hard Line) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] md:w-[46%] lg:w-[44%] xl:w-[42%] h-full z-0 overflow-hidden pointer-events-none"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0.7) 35%, black 60%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0.7) 35%, black 60%)',
          }}
        >
          <Image
            src="/images/offers/ethnic_fabrics_clarity.jpg"
            alt="Luxury Ethnic Fabrics with Jasmine Garland"
            fill
            priority
            className="object-cover object-right"
            sizes="(max-width: 1024px) 55vw, 42vw"
          />
        </div>

        {/* Mobile Backdrop Overlay for 100% Crisp Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0210]/95 via-[#1A0210]/75 to-transparent md:hidden z-0 pointer-events-none" />

        {/* Centered Luxury Content Stage */}
        <div className="max-w-[1480px] mx-auto relative z-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-14 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 lg:gap-10">
          {/* Left Column: Crisp High-End Typography & CTA */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-lg lg:max-w-xl z-10 space-y-2 sm:space-y-3 lg:space-y-3.5">
            {/* Limited Time Offer Eyebrow with gold accent lines */}
            <div className="inline-flex items-center gap-2.5 text-[#DEB371] tracking-[0.22em] text-[10.5px] sm:text-xs font-semibold uppercase">
              <span className="w-5 sm:w-7 h-[1px] bg-gradient-to-r from-transparent to-[#DEB371]" />
              <span>Limited Time Offer</span>
              <span className="w-5 sm:w-7 h-[1px] bg-gradient-to-l from-transparent to-[#DEB371]" />
            </div>

            {/* FLAT 20% OFF Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-bold tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8DA93] to-[#CF9F42] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
              FLAT 20% OFF
            </h2>

            {/* On All Ethnic Wear Subtitle */}
            <p className="font-serif italic text-sm sm:text-base md:text-lg lg:text-xl text-[#F3E7D5] font-normal tracking-wide drop-shadow">
              On All Ethnic Wear
            </p>

            {/* Shop Now CTA Button */}
            <div className="pt-2 sm:pt-3">
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#F0CF85] via-[#E2B768] to-[#D19B45] hover:from-[#FCE4A6] hover:to-[#DEAA50] text-[#1E0312] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_18px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_25px_rgba(226,183,104,0.45)] transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Center Badge: Precision Vector SVG Royal Arch with 20% OFF */}
          <div className="relative shrink-0 flex items-center justify-center z-10 order-first md:order-none md:mr-auto md:ml-4 lg:ml-8 xl:ml-12 my-1 md:my-0">
            {/* Soft gold ambient backlight glow */}
            <div className="absolute inset-0 bg-[#E5BA72]/15 blur-2xl rounded-full scale-125 pointer-events-none" />
            <div className="relative w-20 h-16 sm:w-28 sm:h-24 md:w-36 md:h-32 lg:w-44 lg:h-40 xl:w-48 xl:h-44 drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300">
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
          <div className="hidden lg:block w-[30%] xl:w-[34%] shrink-0 pointer-events-none" />
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

            {/* View All & Header Slider Controls */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:bottom-0.5 flex items-center justify-center sm:justify-end gap-3">
              <Link
                href="/shop?newArrival=true"
                className="text-xs sm:text-[13px] font-semibold text-zinc-900 hover:text-[#B8860B] transition-colors inline-flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Prev / Next Header Slider Controls for Tablet & Desktop */}
              {newArrivals.length > 4 && (
                <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-zinc-300/80">
                  <button
                    onClick={() => scrollNewArrivals('left')}
                    aria-label="Previous arrival"
                    className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#FAF5EB] flex items-center justify-center text-zinc-700 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    onClick={() => scrollNewArrivals('right')}
                    aria-label="Next arrival"
                    className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#FAF5EB] flex items-center justify-center text-zinc-700 hover:text-black transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards 4-Card Slider with Floating Chevron Navigation */}
          <div className="relative group/slider">
            {/* Left Floating Chevron Button (Desktop) */}
            {newArrivals.length > 4 && (
              <button
                onClick={() => scrollNewArrivals('left')}
                aria-label="Previous arrivals"
                className="hidden lg:flex absolute -left-4 xl:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:border-[#B8860B] hover:bg-white text-zinc-800 hover:text-[#B8860B] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              </button>
            )}

            {/* Right Floating Chevron Button (Desktop) */}
            {newArrivals.length > 4 && (
              <button
                onClick={() => scrollNewArrivals('right')}
                aria-label="Next arrivals"
                className="hidden lg:flex absolute -right-4 xl:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:border-[#B8860B] hover:bg-white text-zinc-800 hover:text-[#B8860B] items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
              </button>
            )}

            {/* Skeleton Loading State (4 Cards Visible) */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-[#EAE1D1]/80 flex flex-col animate-pulse"
                  >
                    <div className="relative aspect-[1.12/1] w-full bg-[#EAE1D1]/60" />
                    <div className="p-3.5 space-y-2.5 bg-white">
                      <div className="h-3.5 bg-[#EAE1D1]/70 rounded w-3/4" />
                      <div className="h-3 bg-[#EAE1D1]/50 rounded w-1/2" />
                      <div className="h-4 bg-[#EAE1D1]/70 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : newArrivals.length > 0 ? (
              /* Slidable 4-Card Track (Snap-Scrollable with Smooth Animation) */
              <div
                ref={newArrivalsSliderRef}
                className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory py-2 -mx-1 px-1"
              >
                {newArrivals.map((product, idx) => {
                  const isLiked = isInWishlist(product._id);
                  const img =
                    product.images?.[0]?.url ||
                    product.image ||
                    '/images/new_arrivals/designer_silk_saree.jpg';
                  const badge = product.badge || (product.bestSeller ? 'Bestseller' : 'New');
                  const badgeType = product.badgeType || (product.bestSeller ? 'rose' : 'teal');
                  const rating = product.rating ? Number(product.rating) : 5.0;
                  const reviewCount = typeof product.reviewCount === 'number' ? product.reviewCount : 0;
                  const price = product.price;
                  const compareAtPrice = product.compareAtPrice;
                  const name = product.name;

                  return (
                    <div
                      key={product._id || product.slug || idx}
                      className="arrival-card shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-15px)] snap-start bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#EAE1D1]/80 flex flex-col group transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                    >
                      {/* Top Image Flush to Card Edges */}
                      <div className="relative aspect-[1.12/1] w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={img}
                          alt={name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                          unoptimized={typeof img === 'string' && img.startsWith('data:')}
                        />

                        {/* Top Left Badge */}
                        <div className="absolute top-2 left-2 z-10">
                          {badgeType === 'rose' || badge === 'Hot' ? (
                            <span className="text-[9.5px] sm:text-[10px] font-semibold text-white bg-[#E11D48] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                              {badge}
                            </span>
                          ) : (
                            <span className="text-[9.5px] sm:text-[10px] font-semibold text-white bg-[#064E3B] px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                              {badge}
                            </span>
                          )}
                        </div>

                        {/* Top Right Floating White Heart Outline */}
                        <button
                          onClick={(e) => handleLike(product, e)}
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
                          <Link href={`/product/${product.slug || product._id}`}>
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
                            {compareAtPrice && compareAtPrice > price && (
                              <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-normal">
                                {formatCurrency(compareAtPrice)}
                              </span>
                            )}
                          </div>

                          {/* Circular Black Action Button with White Right Arrow */}
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
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
            ) : null}

            {/* Mobile Prev / Next Controls */}
            {newArrivals.length > 2 && (
              <div className="flex sm:hidden items-center justify-center gap-2 pt-3">
                <button
                  onClick={() => scrollNewArrivals('left')}
                  aria-label="Previous arrival"
                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 flex items-center justify-center text-zinc-700 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  onClick={() => scrollNewArrivals('right')}
                  aria-label="Next arrival"
                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-[#D4AF37]/50 flex items-center justify-center text-zinc-700 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 7. TRADITIONAL MEETS MODERN - CRAFTED FOR EVERY OCCASION       */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#120516] border-y border-[#D4AF37]/25 py-14 sm:py-18 lg:py-22">
        {/* Full-width Ambient Luxury Background with Gold Lace & Subtle Warm Glow */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/images/occasions/occasions_bg_2x.png')` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(102,28,80,0.3)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120516] via-[#1A0820]/95 to-[#120516] pointer-events-none" />

        {/* Top & Bottom Golden Hairline Accents */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5BA72]/60 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5BA72]/60 to-transparent z-20 pointer-events-none" />

        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-10 xl:gap-14">
            
            {/* ============================================================== */}
            {/* LEFT COLUMN: REAL CODED HTML TYPOGRAPHY & BUTTON             */}
            {/* ============================================================== */}
            <div className="w-full lg:w-[32%] xl:w-[28%] text-center lg:text-left space-y-4 sm:space-y-5 shrink-0">
              {/* Eyebrow with gold hairline */}
              <div className="inline-flex items-center gap-2 text-[#DEB371] tracking-[0.24em] text-[10.5px] sm:text-xs font-semibold uppercase">
                <span className="w-6 h-[1.5px] bg-gradient-to-r from-transparent to-[#DEB371]" />
                <span>Traditional Meets Modern</span>
                <span className="w-6 h-[1.5px] bg-gradient-to-l from-transparent to-[#DEB371] lg:hidden" />
              </div>

              {/* Luxury Serif Heading with Gold Gradient */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold leading-[1.12] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8DA93] to-[#CF9F42] drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
                Crafted for Every<br className="hidden lg:inline" /> Occasion
              </h2>

              {/* Brand Narrative */}
              <p className="text-xs sm:text-[13px] text-zinc-300 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                From sacred wedding rituals to celebratory festivities and effortless daily grace — explore handcrafted royal couture tailored for life’s most cherished milestones.
              </p>

              {/* Occasion category sub-links as refined gold pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                {OCCASIONS.map((occ) => (
                  <Link
                    key={occ.title}
                    href={occ.link}
                    className="px-3.5 py-1 rounded-full border border-[#D4AF37]/35 bg-white/5 hover:bg-[#D4AF37]/20 hover:border-[#E5BA72] text-[#E8DFC8] hover:text-[#FFF8E7] transition-all text-xs font-medium tracking-wide shadow-sm"
                  >
                    {occ.title}
                  </Link>
                ))}
              </div>

              {/* Explore Collections Button */}
              <div className="pt-2 sm:pt-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#F0CF85] via-[#E2B768] to-[#D19B45] hover:from-[#FCE4A6] hover:to-[#DEAA50] text-[#130717] font-bold text-xs tracking-widest uppercase transition-all shadow-[0_4px_18px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_25px_rgba(226,183,104,0.45)] transform hover:scale-105 active:scale-95 group"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                </Link>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: 4 HIGH-DEFINITION ROYAL OCCASION CARDS         */}
            {/* ============================================================== */}
            <div className="w-full lg:w-[68%] xl:w-[72%]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-3.5 xl:gap-4">
                {OCCASIONS.map((occ) => (
                  <Link
                    key={occ.title}
                    href={occ.link}
                    className="group relative flex flex-col aspect-[3/4.8] sm:aspect-[3/4.6] w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-[#D4AF37]/40 hover:border-[#F8DA93] shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_36px_rgba(212,175,55,0.25)] transition-all duration-500 hover:-translate-y-2 focus:outline-none"
                  >
                    {/* Full-bleed Model Image */}
                    <div className="absolute inset-0 bg-[#1A0820] overflow-hidden">
                      <Image
                        src={occ.image}
                        alt={occ.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                        priority
                      />
                    </div>

                    {/* Top Gold Hairline Accent */}
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5BA72]/70 to-transparent z-10" />

                    {/* Gradient Vignettes: subtle top + rich bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badge: Occasion Tag */}
                    <div className="relative z-10 p-3 sm:p-3.5">
                      <span className="inline-block text-[9px] sm:text-[9.5px] uppercase font-bold tracking-[0.2em] text-[#E5BA72] bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
                        {occ.tag}
                      </span>
                    </div>

                    {/* Bottom Card Content: Title and Illuminated Gold Arrow Button */}
                    <div className="relative z-10 mt-auto p-3.5 sm:p-4 lg:p-4.5 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[9.5px] tracking-[0.2em] uppercase text-[#DEB371] font-semibold block mb-0.5">
                          Occasion
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-white group-hover:text-[#F8DA93] transition-colors leading-tight drop-shadow-md truncate">
                          {occ.title}
                        </h3>
                      </div>
                      
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/60 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] text-white group-hover:text-zinc-950 flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. GOOGLE REVIEWS SECTION (Trust, 4.9 Rating, Verified Buyers) */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          
          {/* Header with Google Rating Trust Badge */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#D4AF37]/20 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <LotusIcon className="w-4 h-3.5 text-[#B8860B]" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                  Voices of Royal Patrons
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B2518] font-bold">
                Google Customer Reviews
              </h2>
            </div>

            {/* Official Google Reviews Badge & Header Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href="https://g.page/r/CTOKP0LCfhhDECE/review"
                target="_blank"
                rel="noopener noreferrer"
                title="View reviews on Google"
                className="bg-white hover:bg-zinc-50 border border-[#D4AF37]/35 hover:border-[#D4AF37]/70 rounded-2xl p-3.5 sm:p-5 shadow-md hover:shadow-lg flex items-center gap-3.5 sm:gap-4 transition-all duration-200 group"
              >
                {/* Google G Logo */}
                <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>

                <div className="space-y-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-zinc-900 leading-none">4.9</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Based on <strong>1,420+ Verified Reviews</strong> on Google
                  </p>
                </div>
              </a>

              {/* Write Review Button */}
              <a
                href="https://g.page/r/CTOKP0LCfhhDECE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-[#0B2518] hover:bg-[#133E29] text-[#FAF8F5] hover:text-white border border-[#D4AF37]/50 shadow-md hover:shadow-xl transition-all duration-300 font-medium text-xs tracking-wider group flex-shrink-0"
              >
                <span>Write a Review</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* 4 Customer Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {GOOGLE_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#D4AF37]/25 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  {/* Reviewer Header */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/40 flex-shrink-0">
                      <Image
                        src={rev.avatar}
                        alt={rev.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-zinc-900 truncate">
                          {rev.author}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">{rev.city} • {rev.date}</p>
                    </div>
                  </div>

                  {/* Rating Stars & Google Verified Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[9px] font-semibold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Buyer
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal italic">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                {/* Product Mention */}
                <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <span className="font-semibold text-[#B8860B]">Purchased:</span>
                  <span className="truncate">{rev.product}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Google Review Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://g.page/r/CTOKP0LCfhhDECE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#0B2518] hover:bg-[#133E29] text-white border border-[#D4AF37]/60 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group font-semibold text-xs sm:text-sm tracking-wider w-full sm:w-auto text-center"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <span>Write a Review on Google</span>
              <ExternalLink className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 9. INSTAGRAM RECENT POSTS SECTION (#NalmaraFashionElegance Gallery) */}
      {/* ==================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF6EE] border-b border-[#D4AF37]/25 relative overflow-hidden">
        {/* Subtle decorative royal gold ambiance */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08),transparent_65%)] pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-3.5 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/45 text-[#8C6B1B] text-[11px] font-bold tracking-[0.22em] uppercase shadow-xs">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                <Instagram className="w-2.5 h-2.5" />
              </div>
              <span>@nalmarafashion_official</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B2518] tracking-tight">
              Seen On You <span className="font-sans text-[#D4AF37] font-light mx-1 sm:mx-2">•</span> <span className="italic font-serif font-normal text-[#8C6B1B]">#NalmaraFashionElegance</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
              Tag <span className="text-[#8C6B1B] font-semibold underline decoration-[#D4AF37]/60 underline-offset-4">@nalmarafashion_official</span> on Instagram to be featured in our royal heritage gallery.
            </p>
          </div>

          {/* 6 Curated Instagram Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href={post.link || 'https://www.instagram.com/nalmarafashion_official'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white p-1 border border-[#D4AF37]/30 shadow-sm hover:shadow-2xl hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-500 block focus:outline-none"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Subtle Instagram frosted glass badge (visible in resting state) */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm transition-opacity duration-200 group-hover:opacity-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>

                  {/* Luxury Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2518]/95 via-[#0B2518]/65 to-black/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3.5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#F3E5AB] font-medium tracking-wide">
                        <Instagram className="w-3.5 h-3.5 text-[#F3E5AB]" />
                        <span>@nalmarafashion</span>
                      </div>
                      <span className="text-[9px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white/95 font-medium">
                        View
                      </span>
                    </div>

                    <p className="text-[10px] line-clamp-3 text-zinc-100 leading-snug font-normal">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#F3E5AB] font-semibold pt-1.5 border-t border-[#D4AF37]/30">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-[#F3E5AB]" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-zinc-200">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Instagram Follow Call To Action */}
          <div className="text-center space-y-2.5 pt-2">
            <a
              href="https://www.instagram.com/nalmarafashion_official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-[#0B2518] hover:bg-[#133E29] text-white border border-[#D4AF37]/70 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group max-w-full text-center"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
                <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider sm:tracking-widest uppercase truncate">
                Follow @nalmarafashion_official On Instagram
              </span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
            </a>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium tracking-wide">
              Join 45,000+ Royal Patrons &amp; Connoisseurs of Couture
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
