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
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Ruler,
  Heart,
  Instagram,
  Scissors,
} from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { SizeChartModal } from '../components/product/SizeChartModal';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
          setNewArrivals(collectionsRes.data.data.newArrivals || []);
          setBestSellers(collectionsRes.data.data.bestSellers || []);
          setFeaturedProducts(collectionsRes.data.data.featured || []);
        }
      } catch (error) {
        console.error('Failed to load homepage content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const faqs = [
    {
      q: 'How do I choose my correct size?',
      a: 'We offer an extensive size range from XXXS to 5XL. Each garment includes a 2-inch inner margin for easy adjustments. Refer to our interactive Size Chart modal for exact bust, waist, and length measurements in both inches and centimeters.',
    },
    {
      q: 'Can I customize the height and neck design?',
      a: 'Yes! On every product page, you can choose your exact height (from 4\'10" to 5\'8"+) and select from our signature neckline styles including Sweet Heart, Round Square, U-Round, Boat Neck, and Square Neck.',
    },
    {
      q: 'What are the add-on options like Can Can and Feeding Zip?',
      a: 'We provide specialized tailoring add-ons: Can Can layers for voluminous festive flare (+₹650), concealed Feeding Zips for nursing mothers (+₹250), and tailored Blouse Padding (+₹200).',
    },
    {
      q: 'What is the delivery timeline for orders?',
      a: 'Standard orders dispatch within 24–48 hours and arrive in 3–8 business days across India. Custom made-to-measure orders typically take 7–10 business days. For express or international shipping, you can directly WhatsApp our styling team at +91-9361923406.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes, we ship worldwide! We have satisfied clients across the USA, UK, Canada, Australia, Singapore, Malaysia, and the Middle East. Simply select your country at checkout or WhatsApp us for express DHL/FedEx rates.',
    },
    {
      q: 'What is your exchange and alteration policy?',
      a: 'We offer a 7-day hassle-free size exchange policy. If an outfit requires any minor tailoring adjustment, our team provides full alteration support.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-zinc-950 text-white px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Ambient High-Fashion Image with Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=90"
            alt="EFFIDOO Couture Ethnic Elegance"
            fill
            priority
            className="object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-16 pb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bespoke Ethnic Couture & Ready to Ship</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            More than Just <span className="text-amber-400 font-normal italic">Looks.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore clothes that blend fashion with purpose and quality. Handcrafted lehengas, pure zari half sarees, and breathable mulmul maxis tailored to celebrate you.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              EXPLORE PRODUCT <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop?bestSeller=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
            >
              BEST SELLERS
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VISUAL CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Discover our artisanal creations crafted with pure handlooms and bespoke tailoring.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center space-y-3"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:border-amber-400">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-zinc-400 font-medium">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS (Curated Block with "Explore More" Button) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Fresh Off The Loom
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              ✨ New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?newArrival=true"
            className="group text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            Explore More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL STORY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white min-h-[420px] flex items-center shadow-2xl">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=85"
              alt="Artisanal Indian Weaves"
              fill
              className="object-cover object-right opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-5">
            <span className="inline-block text-amber-400 text-xs font-bold uppercase tracking-widest">
              Bespoke Tailoring & Heritage Weaves
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              Trending Collections with Premium Quality
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Every outfit is thoughtfully designed, hand-finished, and customizable to celebrate your individuality. From custom necklines to matching can-can flare, experience couture crafted just for you.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:scale-105"
              >
                Explore Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-400" /> View Size Chart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Most Loved Pieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              🔥 Best Sellers
            </h2>
          </div>
          <Link
            href="/shop?bestSeller=true"
            className="group text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 hover:text-amber-600 transition-colors"
          >
            Explore More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. KEY METRICS COUNTER */}
      <section className="bg-zinc-50 dark:bg-zinc-900/60 py-12 border-y border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-600 dark:text-amber-400">
                47K+
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Happy Customers
              </p>
              <p className="text-[11px] text-zinc-400">Across India & 20+ Countries</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-600 dark:text-amber-400">
                53K+
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Products Crafted
              </p>
              <p className="text-[11px] text-zinc-400">Handloom & Tailored Sets</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-3xl sm:text-5xl font-serif font-extrabold text-amber-600 dark:text-amber-400">
                <span>4.8</span>
                <Star className="w-6 h-6 fill-current text-amber-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Client Rating
              </p>
              <p className="text-[11px] text-zinc-400">Based on Verified Reviews</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-600 dark:text-amber-400">
                10+
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Years of Craft
              </p>
              <p className="text-[11px] text-zinc-400">Design & Atelier Heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            Most Popular Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Everything you need to know about our custom sizing, fabrics, shipping, and exchanges.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. INSTAGRAM SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            #EffidooWomen
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            Styled by You on Instagram
          </h2>
          <p className="text-xs text-zinc-500">
            Tag @effidoo.couture on your celebratory moments to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
          ].map((src, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-zinc-100 dark:bg-zinc-800"
            >
              <Image
                src={src}
                alt="Instagram Styled Client"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER / VIP CLUB */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            Join the Effidoo Atelier Club
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Enjoy 10% off your first handcrafted outfit with code{' '}
            <strong className="text-amber-600 dark:text-amber-400">WELCOME10</strong>. Be the first to preview new loom arrivals and festive drops.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-full text-xs border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => alert('Thank you for subscribing! Use code WELCOME10 at checkout.')}
              className="px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}
