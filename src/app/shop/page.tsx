'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  Scissors,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category, Brand } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { LotusIcon, NalmaraEmblem } from '../../components/ui/BrandLogo';

const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'https://e-commerce-backend-4c4d.onrender.com';

function resolveCategoryImageUrl(rawUrl?: string): string {
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

function getCategoryHeroDetails(slug: string, categories: Category[]) {
  const matchedCat = categories.find((c) => c.slug === slug);
  const key = `${slug} ${matchedCat?.name || ''}`.toLowerCase();

  if (!slug) {
    return {
      badge: 'SHOP ALL COLLECTIONS • THOOTHUKUDI',
      line1: 'SHOP ALL',
      line2: 'ROYAL COLLECTIONS',
      description:
        'Explore our complete catalog of handpicked Kanchipuram silk sarees, designer blouses, flared party gowns, lehengas, kurti sets, and traditional kids pattu wear.',
      pills: ['100% Quality Checked', 'Custom Stitching Available', 'Express TN Delivery'],
      image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
    };
  }

  if (key.includes('blouse') || key.includes('aari')) {
    return {
      badge: 'DESIGNER & BRIDAL BLOUSES',
      line1: matchedCat ? matchedCat.name.toUpperCase() : 'DESIGNER',
      line2: 'BLOUSE COLLECTION',
      description:
        matchedCat?.description ||
        'Handcrafted bridal Aari work blouses, zardozi embroidered silk blouses, and ready-to-stitch designer blouse pieces with custom tailoring options.',
      pills: ['Hand Aari & Zardozi', 'Pure Silk & Velvet', 'Custom Fit Tailoring'],
      image: resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_blouses_hd.jpg',
    };
  }

  if (key.includes('kid') || key.includes('pattu') || key.includes('frock')) {
    return {
      badge: 'KIDS TRADITIONAL & PARTY WEAR',
      line1: matchedCat ? matchedCat.name.toUpperCase() : 'KIDSWEAR &',
      line2: 'PATTU PAVADAI EDIT',
      description:
        matchedCat?.description ||
        'Authentic South Indian Pattu Pavadai Sattai, festive silk frocks, and birthday party gowns crafted with ultra-soft breathable cotton lining for kids.',
      pills: ['Soft Cotton Lining', 'Pattu Pavadai & Frocks', 'Custom Kids Sizing'],
      image: resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_kidswear_hd.jpg',
    };
  }

  if (key.includes('dress') || key.includes('gown') || key.includes('anarkali') || key.includes('party')) {
    return {
      badge: 'FESTIVE & PARTY WEAR COUTURE',
      line1: matchedCat ? matchedCat.name.toUpperCase() : 'DRESSES &',
      line2: 'PARTY WEAR GOWNS',
      description:
        matchedCat?.description ||
        'Floor-length flared Anarkali gowns, organza party dresses, and festive reception ensembles designed for effortless movement and royal grace.',
      pills: ['Flared Silhouette', 'Full Inner Lining', 'Custom Length Alteration'],
      image:
        resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_dresses_gowns_hd.jpg',
    };
  }

  if (key.includes('lehenga') || key.includes('choli') || key.includes('bridal')) {
    return {
      badge: 'BRIDAL & FESTIVE LEHENGAS',
      line1: matchedCat ? matchedCat.name.toUpperCase() : 'LEHENGAS &',
      line2: 'HALF SAREE COLLECTION',
      description:
        matchedCat?.description ||
        'Richly embroidered bridal lehenga cholis and traditional South Indian Half Saree / Dhavani sets with heavy zari borders and custom blouse stitching.',
      pills: ['Kalidar Bridal Flare', 'Matching Dupatta & Choli', 'Custom Tassel Finishing'],
      image: resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_lehengas_hd.jpg',
    };
  }

  if (key.includes('kurti') || key.includes('salwar') || key.includes('suit')) {
    return {
      badge: 'EVERYDAY & FESTIVE ETHNIC SETS',
      line1: matchedCat ? matchedCat.name.toUpperCase() : 'KURTI SETS &',
      line2: 'SALWAR SUITS',
      description:
        matchedCat?.description ||
        'Elegant silk blend kurti sets, straight-cut salwar suits, and festive coordinate sets tailored for everyday sophistication and celebratory comfort.',
      pills: ['Breathable Silk & Cotton', 'Palazzo & Pant Sets', 'Custom Kurti Stitching'],
      image:
        resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_kurti_sets_hd.jpg',
    };
  }

  return {
    badge: 'HANDPICKED SILK & ETHNIC WEAVES',
    line1: matchedCat ? matchedCat.name.toUpperCase() : slug.replace(/-/g, ' ').toUpperCase(),
    line2: 'ROYAL COLLECTION',
    description:
      matchedCat?.description ||
      'Authentic Kanchipuram silks, soft silk weaves, and festive drapes handpicked for vibrant zari luster, rich pallus, and heirloom durability.',
    pills: ['6.3m with Blouse Piece', 'Pure Zari Weave', 'Custom Blouse Stitching'],
    image: resolveCategoryImageUrl(matchedCat?.image) || '/images/nalmara/hd/cat_sarees_hd.jpg',
  };
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [hasDiscount, setHasDiscount] = useState(searchParams.get('hasDiscount') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Synchronize state whenever URL search parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSearchQuery(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setInStock(searchParams.get('inStock') === 'true');
    setHasDiscount(searchParams.get('hasDiscount') === 'true');
    setSort(searchParams.get('sort') || 'featured');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  // Load Categories & Brands from API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        if (catRes.data?.success && Array.isArray(catRes.data.data)) {
          setCategories(catRes.data.data);
        }
        if (brandRes.data?.success && Array.isArray(brandRes.data.data)) {
          setBrands(brandRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load categories/brands:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on live filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (rating) params.set('rating', rating);
        if (inStock) params.set('inStock', 'true');
        if (hasDiscount) params.set('hasDiscount', 'true');
        if (sort) params.set('sort', sort);
        if (searchQuery) params.set('search', searchQuery);
        if (searchParams.get('filter') === 'new-arrivals') params.set('newArrival', 'true');
        if (searchParams.get('filter') === 'best-sellers') params.set('bestSeller', 'true');
        if (searchParams.get('filter') === 'offers') params.set('hasDiscount', 'true');
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
          if (res.data.meta) {
            setTotalPages(res.data.meta.totalPages || 1);
            setTotalProducts(res.data.meta.total || res.data.data.length);
          } else {
            setTotalProducts(res.data.data.length);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    hasDiscount,
    sort,
    searchQuery,
    page,
    searchParams,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setInStock(false);
    setHasDiscount(false);
    setSearchQuery('');
    setSort('featured');
    setPage(1);
    router.push('/shop');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    hasDiscount,
    searchQuery,
  ].filter(Boolean).length;

  const heroProfile = getCategoryHeroDetails(selectedCategory, categories);

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B]">
      {/* 1. ROYAL ATELIER SPLIT HERO BANNER (Exact Same Look & Dynamic Category Content) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E6] to-[#F4E3C3] border-b-2 border-[#D4AF37]/60 py-8 sm:py-12">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 24%, rgba(212,175,55,0.16) 0%, transparent 45%), radial-gradient(circle at 78% 50%, rgba(91,14,61,0.08) 0%, transparent 48%)',
          }}
        />

        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* Left Column: Dynamic Page/Category Headline, Craft Pills & Interactive Category Switcher */}
          <div
            key={selectedCategory || 'all'}
            className="w-full lg:w-[54%] flex flex-col items-center text-center lg:items-start lg:text-left animate-hero-text-up"
          >
            {/* Breadcrumb & Kicker Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] shadow-sm">
                <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
                  {heroProfile.badge}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 text-[10.5px] sm:text-[11px] font-semibold text-[#5C3D1E]">
                <Link href="/" className="hover:text-[#380725]">
                  Home
                </Link>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('')}
                  className="hover:text-[#380725] font-bold text-[#280619] cursor-pointer"
                >
                  Shop
                </button>
                {selectedCategory && (
                  <>
                    <span>/</span>
                    <span className="text-[#9E1946] font-bold capitalize">
                      {selectedCategory.replace(/-/g, ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic 2-Line Headline Matching the Exact Selected Menu / Category Name */}
            <h1 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[48px] uppercase tracking-[-0.01em] text-[#220915] leading-[1.08]">
              <span className="block">{heroProfile.line1}</span>
              <span className="block mt-1 italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#4A0B32] via-[#9E1946] to-[#B88228]">
                {heroProfile.line2}
              </span>
            </h1>

            {/* 24K Gold Accent Line */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-3 mb-3">
              <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] shrink-0" />
              <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-[#D4AF37] via-[#B88228] to-transparent" />
              <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                {totalProducts} CURATED STYLES AVAILABLE
              </span>
            </div>

            {/* Category Description */}
            <p className="text-xs sm:text-[14px] text-[#4E3629] leading-[1.68] max-w-xl font-medium">
              {heroProfile.description}
            </p>

            {/* Category-Specific Feature Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {heroProfile.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 text-[10px] sm:text-[10.5px] font-bold text-[#280619] shadow-2xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#9E1946] shrink-0" />
                  <span>{pill}</span>
                </span>
              ))}
              <Link
                href="/stitching-services"
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] text-[10px] sm:text-[10.5px] font-bold shadow-xs hover:scale-105 transition-transform"
              >
                <Scissors className="w-3 h-3 shrink-0" />
                <span>Book Custom Stitching</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            </div>

            {/* Interactive Quick Category Switcher Bar */}
            {categories.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#D4AF37]/35 w-full flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => handleCategorySelect('')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-serif font-bold transition-all cursor-pointer border ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                      : 'bg-[#FFFDF9]/85 text-[#280619] border-[#D4AF37]/55 hover:border-[#380725]'
                  }`}
                >
                  All Collections
                </button>
                {categories.map((cat) => {
                  const active = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-serif font-bold transition-all cursor-pointer border ${
                        active
                          ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                          : 'bg-[#FFFDF9]/85 text-[#280619] border-[#D4AF37]/55 hover:border-[#380725]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Category Portrait in Double-Bezel 24K Gold Frame + Circular Halo */}
          <div className="w-full lg:w-[44%] flex items-center justify-center pt-2 lg:pt-0">
            <div className="relative w-[250px] h-[250px] sm:w-[340px] sm:h-[340px] lg:w-[380px] lg:h-[380px] rounded-full bg-gradient-to-tr from-[#F2E2BE] via-[#FAF1DC] to-[#EFE6CE] border border-[#D4AF37]/45 shadow-[inset_0_0_50px_rgba(212,175,55,0.22)] flex items-center justify-center">
              <div
                key={heroProfile.image}
                className="relative z-10 h-[265px] sm:h-[355px] lg:h-[395px] aspect-[3/4] rounded-[22px] sm:rounded-[24px] p-[3px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_50px_rgba(40,6,25,0.26)] animate-hero-rise-in"
              >
                <div className="relative w-full h-full rounded-[19px] sm:rounded-[21px] overflow-hidden bg-[#280619]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroProfile.image}
                    alt={heroProfile.line1}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/images/nalmara/hd/cat_sarees_hd.jpg';
                    }}
                    className="w-full h-full object-cover object-top animate-hero-inner-settle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN SHOP CONTENT */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10">
        {/* Results Count & Sort Controls Plaque */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF0DD] to-[#FFFDF9] border-2 border-[#D4AF37]/75 px-4 sm:px-6 py-3.5 shadow-[0_10px_28px_rgba(56,7,37,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFE59E] to-[#8C5818]" />
            <p className="text-xs sm:text-sm text-[#4A2C2A]">
              Showing <strong className="text-[#280619] font-bold">{products.length}</strong> of{' '}
              <strong className="text-[#280619] font-bold">{totalProducts}</strong> handcrafted couture ensembles
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] text-[#FFE59E] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFE59E]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial min-w-[165px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none bg-[#FFFDF9] border border-[#D4AF37]/75 rounded-full px-4 py-2 pr-8 text-xs font-bold text-[#280619] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-2xs cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C5818] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-[#FFFDF9] border border-[#D4AF37]/70 rounded-full p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] shadow-xs'
                    : 'text-[#6B5740] hover:text-[#280619]'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] shadow-xs'
                    : 'text-[#6B5740] hover:text-[#280619]'
                }`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-7">
          {/* Desktop Filters Sidebar (Royal Silk Cream & 24K Gold Card) */}
          <aside className="hidden lg:block space-y-6">
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-2xl border-2 border-[#D4AF37]/75 p-5 space-y-5 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
              <div className="absolute inset-[4px] rounded-[12px] border border-[#D4AF37]/30 pointer-events-none" />
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#D4AF37]/35">
                <h3 className="font-serif font-bold text-sm text-[#280619] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8C5818]" />
                  <span>Filter Collections</span>
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#5B0E3D] hover:text-[#280619] underline font-bold cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative z-10 space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C5818]">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border border-[#D4AF37] shadow-sm'
                        : 'text-[#2C1810] hover:bg-[#FFFDF9] border border-transparent hover:border-[#D4AF37]/50'
                    }`}
                  >
                    All Sarees & Attire
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCategorySelect(c.slug)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === c.slug
                          ? 'bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border border-[#D4AF37] shadow-sm'
                          : 'text-[#2C1810] hover:bg-[#FFFDF9] border border-transparent hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span>{c.name}</span>
                      {selectedCategory === c.slug && <span className="text-[#FFE59E] text-[10px]">✦</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Presets */}
              <div className="relative z-10 space-y-2.5 pt-3 border-t border-[#D4AF37]/35">
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C5818]">
                  Shop by Price
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handlePricePreset('', '799')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      maxPrice === '799' && !minPrice
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] font-bold shadow-xs'
                        : 'border-[#D4AF37]/50 bg-[#FFFDF9] text-[#2C1810] hover:border-[#D4AF37]'
                    }`}
                  >
                    Under ₹799
                  </button>
                  <button
                    onClick={() => handlePricePreset('800', '1499')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      minPrice === '800' && maxPrice === '1499'
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] font-bold shadow-xs'
                        : 'border-[#D4AF37]/50 bg-[#FFFDF9] text-[#2C1810] hover:border-[#D4AF37]'
                    }`}
                  >
                    ₹800 – ₹1,499
                  </button>
                  <button
                    onClick={() => handlePricePreset('1500', '2999')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      minPrice === '1500' && maxPrice === '2999'
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] font-bold shadow-xs'
                        : 'border-[#D4AF37]/50 bg-[#FFFDF9] text-[#2C1810] hover:border-[#D4AF37]'
                    }`}
                  >
                    ₹1,500 – ₹2,999
                  </button>
                  <button
                    onClick={() => handlePricePreset('3000', '')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      minPrice === '3000' && !maxPrice
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] font-bold shadow-xs'
                        : 'border-[#D4AF37]/50 bg-[#FFFDF9] text-[#2C1810] hover:border-[#D4AF37]'
                    }`}
                  >
                    ₹3,000+
                  </button>
                </div>
              </div>

              {/* Additional Options: In Stock & Discounts */}
              <div className="relative z-10 space-y-2.5 pt-3 border-t border-[#D4AF37]/35">
                <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C5818]">
                  Availability & Offers
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[#2C1810] font-medium">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-[#380725] focus:ring-[#D4AF37] w-4 h-4 accent-[#380725]"
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-[#2C1810] font-medium">
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="rounded text-[#380725] focus:ring-[#D4AF37] w-4 h-4 accent-[#380725]"
                    />
                    <span>Special Offers & Discounts</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid Column */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] rounded-2xl border-2 border-[#D4AF37]/40 p-3 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-[#EED9BA] rounded-xl" />
                    <div className="h-4 bg-[#EED9BA] rounded w-3/4" />
                    <div className="h-3 bg-[#EED9BA] rounded w-1/2" />
                    <div className="h-8 bg-[#EED9BA] rounded-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl border-2 border-[#D4AF37]/75 p-12 text-center space-y-4 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] flex items-center justify-center shadow-md">
                  <LotusIcon className="w-7 h-6 text-[#FFE59E]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#280619]">
                  No Couture Ensembles Found
                </h3>
                <p className="text-xs sm:text-sm text-[#5C3D1E] max-w-sm mx-auto font-normal">
                  We could not find any products matching your selected filters. Try clearing your filters or exploring our other collections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.18em] shadow-[0_8px_22px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 pt-10">
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setPage(pNum);
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', pNum.toString());
                        router.push(`/shop?${params.toString()}`);
                      }}
                      className={`w-9 h-9 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        page === pNum
                          ? 'bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border-2 border-[#D4AF37] shadow-md scale-105'
                          : 'bg-[#FFFDF9] border border-[#D4AF37]/50 text-[#2C1810] hover:border-[#D4AF37]'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#1A0310]/75 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FDF6EC] border-l-2 border-[#D4AF37] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/40">
                <div className="flex items-center gap-2">
                  <NalmaraEmblem className="w-6 h-6" />
                  <h3 className="font-serif font-bold text-base text-[#280619]">
                    Filter Collections
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-full bg-[#380725] text-[#FFE59E] border border-[#D4AF37]/75"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C5818]">
                  Categories
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      handleCategorySelect('');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] font-bold'
                        : 'text-[#2C1810] bg-[#FFFDF9] border border-[#D4AF37]/40'
                    }`}
                  >
                    All Sarees & Attire
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        handleCategorySelect(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === c.slug
                          ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] font-bold'
                          : 'text-[#2C1810] bg-[#FFFDF9] border border-[#D4AF37]/40'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Presets */}
              <div className="space-y-2 pt-4 border-t border-[#D4AF37]/40">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C5818]">
                  Price Range
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      handlePricePreset('', '799');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] text-[#280619] font-semibold text-center"
                  >
                    Under ₹799
                  </button>
                  <button
                    onClick={() => {
                      handlePricePreset('800', '1499');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] text-[#280619] font-semibold text-center"
                  >
                    ₹800 – ₹1,499
                  </button>
                  <button
                    onClick={() => {
                      handlePricePreset('1500', '2999');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] text-[#280619] font-semibold text-center"
                  >
                    ₹1,500 – ₹2,999
                  </button>
                  <button
                    onClick={() => {
                      handlePricePreset('3000', '');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] text-[#280619] font-semibold text-center"
                  >
                    ₹3,000+
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D4AF37]/40 flex gap-3">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full border border-[#D4AF37] bg-[#FFFDF9] text-[#280619]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
          <div className="text-center space-y-3">
            <LotusIcon className="w-10 h-8 mx-auto text-[#D4AF37] animate-pulse" />
            <p className="text-xs font-serif text-[#280619]">Loading Royal Collections...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
