'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  ShoppingBag,
  Scissors,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

const FAQ_DATA = [
  // Orders & Tracking
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'How do I place and track my NALMARA order?',
    answer:
      'Browse our curated collections, select your desired size or bespoke tailoring options, and proceed through our secure checkout. Once placed, you will receive an immediate SMS and email with your Order ID and tracking link. You can track your shipment anytime via our dedicated Track Order page.',
  },
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'Can I cancel or modify my order after placing it?',
    answer:
      'Yes, orders can be modified or cancelled within 4 hours of placement before our dispatch team prepares your package. Contact our WhatsApp concierge or email support@nalmarafashion.com with your Order ID for immediate assistance.',
  },
  {
    category: 'Orders & Tracking',
    icon: ShoppingBag,
    question: 'Do I need an account to place an order?',
    answer:
      'No, you can check out as a guest. However, creating a complimentary NALMARA client account allows you to save delivery addresses, access order histories, and receive invitations to private previews.',
  },

  // Custom Tailoring & Sizing
  {
    category: 'Tailoring & Sizing',
    icon: Scissors,
    question: 'How does Bespoke Tailoring & Custom Blouse Stitching work?',
    answer:
      'On product pages offering bespoke tailoring, you can customize body height (5\'0" to 5\'10"+), neck patterns (Sweetheart, Royal High Neck, Round, V-Neck), sleeve designs, feeding zips, can-can layers, and padded blouses. Our master tailors hand-stitch each garment to your exact measurements.',
  },
  {
    category: 'Tailoring & Sizing',
    icon: Scissors,
    question: 'How do I submit my custom measurements?',
    answer:
      'You can enter your measurements directly in the Custom Notes box during product selection, or complete our interactive Size Chart guide. Additionally, our tailoring concierge will contact you via WhatsApp after order placement to confirm measurements before cutting fabric.',
  },
  {
    category: 'Tailoring & Sizing',
    icon: Scissors,
    question: 'Are sarees delivered with fall and pico stitched?',
    answer:
      'Yes! All sarees purchased with our Fall & Pico add-on include cotton fall hand-stitching, precision edge pico work, and matching finished tassels on the pallu.',
  },

  // Payments & Security
  {
    category: 'Payments',
    icon: CreditCard,
    question: 'What payment methods do you support?',
    answer:
      'We accept all major Indian & International Credit/Debit cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible domestic pin codes.',
  },
  {
    category: 'Payments',
    icon: CreditCard,
    question: 'Is online payment secure on NALMARA FASHION?',
    answer:
      'Absolutely. All transactions are protected by 256-bit SSL encryption and processed via certified PCI-DSS compliant gateways (Razorpay & Stripe). We never store your full card details or CVV.',
  },
  {
    category: 'Payments',
    icon: CreditCard,
    question: 'Are there any hidden taxes or charges?',
    answer:
      'No. All prices listed on our site are inclusive of GST. Orders above ₹1,499 qualify for complimentary domestic express shipping with zero surcharge.',
  },

  // Shipping & Delivery
  {
    category: 'Shipping',
    icon: Truck,
    question: 'What are the delivery timelines?',
    answer:
      'Standard ready-to-ship garments reach metro cities within 2–4 business days and other regions in 4–6 business days. Bespoke tailored orders require an extra 3–5 business days for precision stitching before dispatch.',
  },
  {
    category: 'Shipping',
    icon: Truck,
    question: 'Do you offer International Shipping?',
    answer:
      'Yes, we ship globally to over 60 countries including the USA, UK, Canada, UAE, Singapore, and Australia via DHL and FedEx Express. International transit takes approximately 6–10 business days.',
  },

  // Returns & Refunds
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    question: 'What is your return policy?',
    answer:
      'We offer a 7-Day Easy Return & Exchange policy for unworn, unwashed garments with tags intact. We arrange free doorstep pickup across India and issue full refunds to your original payment mode or UPI.',
  },
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    question: 'Can customized or stitched items be returned?',
    answer:
      'Garments stitched to personalized custom body measurements or modified with bespoke neck/sleeve requests are made specifically for you and cannot be returned. However, our concierge provides free alteration assistance if the fit requires refinement.',
  },

  // Fabric & Pure Silk Care
  {
    category: 'Fabric & Care',
    icon: Sparkle,
    question: 'How should I care for pure silk sarees and zari lehengas?',
    answer:
      'We recommend professional Dry Clean only for handloom silks, zardozi embroidery, and pure gold zari garments. Store silks wrapped in pure muslin cloth in a dry wardrobe, avoiding direct contact with perfumes or sprays.',
  },
  {
    category: 'Fabric & Care',
    icon: Sparkle,
    question: 'Are your silks certified handloom?',
    answer:
      'Yes. Our heritage sarees and handloom weaves are sourced directly from registered artisan weaver societies across Kanchipuram, Varanasi, Chanderi, and Maheshwar, accompanied by authentic silk mark verification.',
  },
];

const CATEGORIES = [
  'All',
  'Orders & Tracking',
  'Tailoring & Sizing',
  'Payments',
  'Shipping',
  'Returns & Refunds',
  'Fabric & Care',
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
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Client Assistance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our luxury handloom weaves, bespoke tailoring services, international logistics, and client care.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. tailoring, shipping, return)..."
                className="w-full bg-[#FAF8F5] text-zinc-900 placeholder:text-zinc-500 text-xs px-4 py-3 pl-11 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-zinc-200 shadow-md"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">FAQ</span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#0E3324] text-[#E5C07B] border border-[#D4AF37]'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200'
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
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-zinc-800">
              No matching questions found
            </h3>
            <p className="text-xs text-zinc-500">
              Try adjusting your search terms or connect directly with our styling team.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-[#B8860B] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#D4AF37]/25 shadow-sm overflow-hidden transition-all duration-200 hover:border-[#D4AF37]/60"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-sm sm:text-base font-bold text-[#061811]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#061811]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed border-t border-zinc-100 bg-[#FAF8F5]/60 animate-fade-in pl-16">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* 4. CONCIERGE HELP DESK FOOTER CARD */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 rounded-3xl bg-[#061811] text-white border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <LotusIcon className="w-64 h-64 text-[#D4AF37]" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
                24/7 Client Care
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Have an Unanswered Question?
              </h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Our bespoke styling concierges and master artisans are available via WhatsApp or telephone to guide your selection.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-[#20ba59] transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border border-[#D4AF37] text-[#E5C07B] hover:bg-[#0E3324] text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Mail className="w-4 h-4" />
                Email Atelier Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
