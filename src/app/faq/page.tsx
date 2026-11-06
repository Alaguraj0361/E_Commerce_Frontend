'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Mail,
  ShoppingBag,
  Scissors,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { LotusIcon, NalmaraEmblem } from '@/components/ui/BrandLogo';

const FAQ_DATA = [
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'How do I place an order and track my delivery?',
    answer:
      'Choose your favourite saree or dress, click Add to Cart or Buy Now, and enter your delivery address. Once your order is packed at our Thoothukudi store, we send your courier tracking link on WhatsApp and SMS. You can also track it anytime on our Track Order page.',
  },
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'Can I order directly on WhatsApp or see the saree on video call?',
    answer:
      'Yes! You can message us on WhatsApp at 6383163609 or 7871207631. Our Thoothukudi store team will happily show you the saree in natural light on video call and help you place your order.',
  },
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'Do I need an account to buy?',
    answer:
      'No, you can buy directly as a guest. Creating a free account helps you save your address and check your past orders easily.',
  },
  {
    category: 'Saree Length & Stitching',
    icon: Scissors,
    question: 'Does the saree include a blouse piece?',
    answer:
      'Yes! All our sarees come in full 6.3 meters length (5.5 meters saree + 0.8 meters matching unstitched blouse piece) unless mentioned otherwise in the product description.',
  },
  {
    category: 'Saree Length & Stitching',
    icon: Scissors,
    question: 'Do you provide blouse stitching and fall/pico finishing?',
    answer:
      'Yes, on eligible products you can select your size, neck design, sleeve length, and fall/pico options. Our tailors will also confirm your measurements on WhatsApp before stitching.',
  },
  {
    category: 'Payments',
    icon: CreditCard,
    question: 'What payment options are available?',
    answer:
      'We accept Google Pay (GPay), PhonePe, Paytm, all UPI apps, Debit/Credit Cards (Visa, RuPay, Mastercard), Net Banking, and Cash on Delivery (COD) across eligible Tamil Nadu & Indian pincodes.',
  },
  {
    category: 'Payments',
    icon: CreditCard,
    question: 'Are there any extra GST or hidden charges?',
    answer:
      'No hidden charges! The price shown on the product page includes GST. Orders above ₹1,499 get Free Shipping across Tamil Nadu and India.',
  },
  {
    category: 'Delivery Time',
    icon: Truck,
    question: 'How many days will delivery take in Tamil Nadu?',
    answer:
      'We dispatch from our Thoothukudi shop within 24 hours. Delivery takes 1–2 days for Thoothukudi, Tirunelveli, Madurai, Nagercoil & South Tamil Nadu, and 2–3 days for Chennai, Coimbatore, Trichy, Salem, and all other districts in Tamil Nadu.',
  },
  {
    category: 'Delivery Time',
    icon: Truck,
    question: 'Do you deliver outside Tamil Nadu?',
    answer:
      'Yes! We deliver across Bengaluru, Kerala, Hyderabad, Mumbai, Delhi, and all states in India within 3–5 working days.',
  },
  {
    category: 'Returns & Exchange',
    icon: RotateCcw,
    question: 'What is your return and exchange policy?',
    answer:
      'We offer an easy 7-Day Return & Exchange policy for unused sarees and dresses with original tags intact. Please take a short parcel opening video when unboxing so we can help you immediately in case of any issue.',
  },
  {
    category: 'Saree Care',
    icon: Sparkle,
    question: 'How should I wash my silk and cotton sarees?',
    answer:
      'For Kanchipuram silk, soft silk, and grand zari sarees, we recommend dry cleaning to keep the zari shining like new. Cotton sarees and daily wear kurtis can be gently hand-washed in cold water.',
  },
];

const CATEGORIES = [
  'All',
  'Orders & Tracking',
  'Saree Length & Stitching',
  'Payments',
  'Delivery Time',
  'Returns & Exchange',
  'Saree Care',
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. ROYAL HERO SECTION (Obsidian #0E0B09 & 24K Gold matching Home Page) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]/80">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/35 bg-[#120E0A]/60 p-8 sm:p-12 text-center space-y-4">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]/80 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]/80 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/75 text-[#FFE59E] text-[10px] font-bold tracking-[0.22em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Customer Help Center • Thoothukudi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Frequently Asked{' '}
            <span className="font-script italic font-normal text-4xl sm:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE3D2]/85 font-light max-w-2xl mx-auto leading-relaxed">
            Simple, clear answers about saree length, blouse pieces, Tamil Nadu delivery time, and WhatsApp ordering from our Thoothukudi store.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C6518] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. delivery, blouse, return)..."
                className="w-full bg-[#FFFDF9] text-[#0E0B09] placeholder:text-[#7A6651] text-xs px-4 py-3 pl-11 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border-2 border-[#D4AF37]/70 shadow-lg"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#EDE3D2]/70">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">FAQ</span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all shadow-md cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0E0B09] text-[#FFE59E] border-2 border-[#D4AF37]'
                  : 'bg-[#FFFDF9] text-[#2C2117] hover:border-[#D4AF37] border border-[#D4AF37]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. ACCORDION LIST */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] rounded-3xl border-2 border-[#D4AF37]/60 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-[#8C6518] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#0E0B09]">
              No matching questions found
            </h3>
            <p className="text-xs text-[#5C4934]">
              Try another search word or message our Thoothukudi support team on WhatsApp.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-extrabold text-[#8C6518] underline"
            >
              Show All Questions
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] rounded-2xl border-2 border-[#D4AF37]/55 shadow-sm overflow-hidden transition-all duration-200 hover:border-[#D4AF37]"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0E0B09] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shrink-0">
                      <Icon className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="font-serif text-sm sm:text-base font-bold text-[#0E0B09]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C6518] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#0E0B09]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 text-xs sm:text-sm text-[#3F3122] font-normal leading-relaxed border-t border-[#D4AF37]/30 bg-[#FFFDF9] animate-fade-in pl-16">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* 4. HELP DESK FOOTER CARD (Obsidian #0E0B09 & 24K Gold) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-white border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <LotusIcon className="w-64 h-64 text-[#D4AF37]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] px-3 py-1 rounded-full bg-[#0E0B09] border border-[#D4AF37]">
                Thoothukudi Customer Support
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#FFFDF9]">
                Still Have a Question?
              </h3>
              <p className="text-xs text-[#EDE3D2]/85 font-normal leading-relaxed">
                Call or WhatsApp our shop team directly at{' '}
                <span className="text-[#FFE59E] font-bold">6383163609 &nbsp;|&nbsp; 7871207631</span> for quick help.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
              <a
                href="https://wa.me/916383163609"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-wider shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border border-[#D4AF37] text-[#FFE59E] hover:bg-[#1F1811] text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                <Mail className="w-4 h-4" />
                Contact Our Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
