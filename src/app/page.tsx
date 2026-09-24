'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, collectionsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/collections/home'),
        ]);

        if (catRes.data?.success) {
          setCategories(catRes.data.data || []);
        }

        if (collectionsRes.data?.success && collectionsRes.data.data) {
          setFeaturedProducts(collectionsRes.data.data.featured || []);
          setTrendingProducts(collectionsRes.data.data.trending || []);
          setNewArrivals(collectionsRes.data.data.newArrivals || []);
          setBestSellers(collectionsRes.data.data.bestSellers || []);
        }
      } catch (error) {
        console.error('Failed to load homepage content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 text-white px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Ambient Image with Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=90"
            alt="Editorial Fashion Lifestyle"
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-zinc-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>

          {/* Strong Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans max-w-4xl mx-auto leading-[1.1]">
            Curated For Everyday <span className="text-zinc-400 font-light italic">Elegance.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
            Impeccably tailored apparel, audiophile acoustics, full-grain leather goods, and architectural home artifacts designed for purposeful modern living.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-zinc-950 px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-zinc-200 transition-all shadow-xl hover:scale-105"
            >
              SHOP NEW COLLECTION <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?hasDiscount=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all"
            >
              EXPLORE OFFERS
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Department Store
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              Curated Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="group text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:opacity-75"
          >
            Browse all categories{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-800"
            >
              <Image
                src={
                  cat.image ||
                  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80'
                }
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-3 bottom-3 text-center">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4" /> Popular Now
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Trending Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="group text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:opacity-75"
          >
            View all trending{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL SALE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-zinc-800 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Limited Time Event
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              UP TO 50% OFF <br />
              <span className="text-zinc-400 font-light">ARCHIVE COLLECTION</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              Explore timeless outerwear, genuine leather travel goods, and studio acoustics before inventory concludes. Apply coupon code <strong className="text-white font-mono font-bold">SUMMER50</strong> at checkout for an instant $50 reduction on orders over $200.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?hasDiscount=true"
                className="inline-flex items-center gap-2 bg-white text-zinc-950 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-transform hover:scale-105"
              >
                SHOP THE SALE <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full md:w-96 aspect-square rounded-2xl overflow-hidden border border-zinc-800 flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85"
              alt="Promotion archive luggage"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
              <Zap className="w-4 h-4 text-amber-500" /> Just Dropped
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?newArrival=true"
            className="group text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:opacity-75"
          >
            Explore all new drops{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
              <Award className="w-4 h-4 text-amber-500" /> Most Desired
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?bestSeller=true"
            className="group text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:opacity-75"
          >
            Explore all best sellers{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16 border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Testimonials
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              Praised by Discerning Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Julian Vance',
                role: 'Architect & Creative Director',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                review:
                  'The Minimalist Wool Overcoat is cut with razor-sharp precision. The fabric density and weight rivals bespoke Savile Row tailoring at a fraction of the cost.',
                rating: 5,
              },
              {
                name: 'Elena Rostova',
                role: 'Industrial Designer',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                review:
                  'EFFIDOO delivers that rare balance between sculptural minimalism and enduring utilitarian function. The checkout and international delivery was seamless.',
                rating: 5,
              },
              {
                name: 'Marcus Sterling',
                role: 'Sound Engineer',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                review:
                  'The Studio Wireless ANC headphones blew away my high expectations. Acoustic clarity, clean low-end punch, and lambskin ear cushions you can wear for 10 hours straight.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {t.name}
                    </h4>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
