'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Scissors,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Ruler,
  Clock,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  STITCHING_SERVICES_CONFIG,
  getStitchingServiceBySlug,
} from '../../../data/stitchingServicesData';

export default function IndividualStitchingServicePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : '';

  const serviceConfig =
    getStitchingServiceBySlug(rawSlug) || STITCHING_SERVICES_CONFIG[0];

  // Hero 4-Slide Lookbook State (for this specific service)
  const slides = serviceConfig.lookbookSlides;
  const [slideIdx, setSlideIdx] = useState(0);
  const [prevSlideIdx, setPrevSlideIdx] = useState<number | null>(null);
  const [animTick, setAnimTick] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // Reset form & hero slide whenever user navigates to a different service page
  const [step1Value, setStep1Value] = useState(serviceConfig.step1Options[0]);
  const [step2Value, setStep2Value] = useState(serviceConfig.step2Options[0]);
  const [step3Value, setStep3Value] = useState(serviceConfig.step3Options[0]);
  const [step4Choice, setStep4Choice] = useState(serviceConfig.step4Choices[0]);
  const [customInfoValues, setCustomInfoValues] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    serviceConfig.addons.slice(0, 2)
  );
  const [measurementMode, setMeasurementMode] = useState<'online' | 'whatsapp'>('online');
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    pickupCity: 'Thoothukudi',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSlideIdx(0);
    setPrevSlideIdx(null);
    setStep1Value(serviceConfig.step1Options[0]);
    setStep2Value(serviceConfig.step2Options[0]);
    setStep3Value(serviceConfig.step3Options[0]);
    setStep4Choice(serviceConfig.step4Choices[0]);

    const initialInfo: Record<string, string> = {};
    serviceConfig.customInfoFields.forEach((f) => {
      initialInfo[f.key] = f.options && f.options.length > 0 ? f.options[0] : '';
    });
    setCustomInfoValues(initialInfo);

    setSelectedAddons(serviceConfig.addons.slice(0, 2));

    const initialMeas: Record<string, string> = {};
    serviceConfig.measurementFields.forEach((m) => {
      initialMeas[m.key] = '';
    });
    setMeasurements(initialMeas);
  }, [serviceConfig]);

  // Clear outgoing 3D arc-out slide after animation
  useEffect(() => {
    if (prevSlideIdx === null) return;
    const t = setTimeout(() => setPrevSlideIdx(null), 1080);
    return () => clearTimeout(t);
  }, [prevSlideIdx, animTick]);

  // Auto-advance the 4 lookbook slides for this service
  useEffect(() => {
    if (isHeroHovered || slides.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIdx((curr) => {
        const next = (curr + 1) % slides.length;
        setPrevSlideIdx(curr);
        setAnimTick((tk) => tk + 1);
        return next;
      });
    }, 5600);
    return () => clearInterval(interval);
  }, [isHeroHovered, slides.length]);

  const goToLookbookSlide = (targetIdx: number) => {
    const normalized = ((targetIdx % slides.length) + slides.length) % slides.length;
    if (normalized !== slideIdx) {
      setPrevSlideIdx(slideIdx);
      setSlideIdx(normalized);
      setAnimTick((tk) => tk + 1);
    }
  };

  const activeSlide = slides[slideIdx] || slides[0];
  const outgoingSlide = prevSlideIdx !== null ? slides[prevSlideIdx] : null;

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const formatCustomInfoSummary = () => {
    return serviceConfig.customInfoFields
      .map((field) => {
        const val = customInfoValues[field.key]?.trim();
        return val ? `${field.label}: ${val}` : null;
      })
      .filter(Boolean)
      .join(' | ');
  };

  const formatMeasurementsSummary = () => {
    if (measurementMode === 'whatsapp') {
      return 'Will share measurements on WhatsApp / Sample Garment Pickup';
    }
    const filled = serviceConfig.measurementFields
      .map((m) => {
        const val = measurements[m.key]?.trim();
        return val ? `${m.label}: ${val}"` : null;
      })
      .filter(Boolean);
    return filled.length > 0
      ? filled.join(', ')
      : 'Measurements to be confirmed with Master Tailor';
  };

  const handleBookViaWhatsApp = () => {
    const customInfoStr = formatCustomInfoSummary();
    const measStr = formatMeasurementsSummary();

    const message = [
      `Hello NALMARA FASHION, I would like to book *${serviceConfig.name}*:`,
      `• Selected Lookbook Style: ${activeSlide.name}`,
      `• ${serviceConfig.step1Label.replace(/^\d+\.\s*/, '')}: ${step1Value}`,
      `• ${serviceConfig.step2Label.replace(/^\d+\.\s*/, '')}: ${step2Value}`,
      `• ${serviceConfig.step3Label.replace(/^\d+\.\s*/, '')}: ${step3Value}`,
      `• ${serviceConfig.step4ChoiceLabel}: ${step4Choice}`,
      customInfoStr ? `• Collection Info: ${customInfoStr}` : '',
      `• Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'Standard Finishing'}`,
      `• Measurements: ${measStr}`,
      customerInfo.name
        ? `• Customer: ${customerInfo.name} (${customerInfo.phone}) — ${customerInfo.pickupCity}`
        : '',
      customerInfo.notes ? `• Special Notes: ${customerInfo.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/916383163609?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleOnlineBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name.trim() || !customerInfo.phone.trim()) {
      toast.error('Please enter your name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://e-commerce-backend-4c4d.onrender.com/api';
      await fetch(`${apiUrl}/contact/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: 'stitching@nalmarafashion.com',
          enquiryType: serviceConfig.name,
          message: [
            `Service: ${serviceConfig.name}`,
            `Style: ${activeSlide.name}`,
            `Step 1: ${step1Value}`,
            `Step 2: ${step2Value}`,
            `Step 3: ${step3Value}`,
            `${serviceConfig.step4ChoiceLabel}: ${step4Choice}`,
            `Collection Details: ${formatCustomInfoSummary()}`,
            `Add-ons: ${selectedAddons.join(', ')}`,
            `Measurements: ${formatMeasurementsSummary()}`,
            `City: ${customerInfo.pickupCity}`,
            `Notes: ${customerInfo.notes}`,
          ].join(' | '),
        }),
      });
      toast.success(
        `Your ${serviceConfig.name} booking & measurement details have been submitted!`
      );
      setCustomerInfo((prev) => ({ ...prev, name: '', phone: '', notes: '' }));
    } catch {
      toast.success('Opening WhatsApp Master Tailor Concierge with your details...');
      handleBookViaWhatsApp();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B] overflow-x-hidden select-none">
      {/* =================================================================== */}
      {/* 00. DEDICATED STITCHING SERVICE ROUTE BAR (SEPARATE PAGE LINKS)     */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-[#280619] via-[#3E0829] to-[#280619] border-b border-[#D4AF37]/50 py-2.5 px-4 sm:px-8">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#FFE59E]/90">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#D4AF37]/60">/</span>
            <Link
              href="/stitching-services"
              className="hover:text-white transition-colors"
            >
              Stitching Services
            </Link>
            <span className="text-[#D4AF37]/60">/</span>
            <span className="font-bold text-[#FFF4C2]">{serviceConfig.name}</span>
          </div>

          {/* Separate Page Quick Links */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {STITCHING_SERVICES_CONFIG.map((item) => {
              const isCurrentPage = item.slug === serviceConfig.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/stitching-services/${item.slug}`}
                  className={`px-3 py-1 rounded-full text-[10.5px] font-serif font-bold whitespace-nowrap transition-all border ${
                    isCurrentPage
                      ? 'bg-gradient-to-r from-[#FFF4C2] via-[#FFE59E] to-[#D4AF37] text-[#280619] border-[#FFFDF9] shadow-sm'
                      : 'bg-[#380725]/80 text-[#FFE59E]/85 border-[#D4AF37]/40 hover:border-[#FFE59E] hover:text-white'
                  }`}
                >
                  {item.shortName}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 01. ROYAL ATELIER SPLIT HERO BANNER FOR THIS SPECIFIC SERVICE       */}
      {/* =================================================================== */}
      <section
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        className="relative w-full min-h-[calc(100vh-144px)] overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E6] to-[#F4E3C3] border-b-2 border-[#D4AF37]/60 flex items-center py-6 sm:py-10 lg:py-8 xl:py-10"
      >
        {/* Ambient Radial Glows */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 24%, rgba(212,175,55,0.16) 0%, transparent 45%), radial-gradient(circle at 76% 50%, rgba(91,14,61,0.08) 0%, transparent 48%)',
          }}
        />

        {/* Inner 24K Gold Architectural Hairline Border */}
        <div className="hidden xl:block absolute inset-3.5 border border-[#D4AF37]/30 rounded-3xl pointer-events-none z-10">
          <span className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#B88228] rounded-tl-lg" />
          <span className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#B88228] rounded-tr-lg" />
          <span className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#B88228] rounded-bl-lg" />
          <span className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#B88228] rounded-br-lg" />
        </div>

        <div className="relative z-10 w-full max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col lg:flex-row items-center justify-between gap-7 sm:gap-9 lg:gap-8">
          {/* LEFT COLUMN: Exact Service Headline, Active Slide Lookbook Info & 4-Style Switcher */}
          <div className="w-full lg:w-[48%] xl:w-[47%] flex flex-col items-center text-center lg:items-start lg:text-left justify-center z-20">
            <div
              key={`${serviceConfig.slug}-slide-${animTick}`}
              className="w-full flex flex-col items-center lg:items-start"
            >
              {/* Top Kicker Pill + Turnaround Badge */}
              <div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3 animate-hero-text-up"
                style={{ animationDelay: '0ms' }}
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] shadow-[0_6px_18px_rgba(56,7,37,0.2)]">
                  <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE59E] shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#FFE59E]">
                    {serviceConfig.shortTag}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 shadow-2xs">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8C5818] shrink-0" />
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#280619]">
                    Dispatch: {serviceConfig.turnaround}
                  </span>
                </div>
              </div>

              {/* Exact Service Page 2-Line Headline */}
              <div className="animate-hero-text-up max-w-full" style={{ animationDelay: '65ms' }}>
                <h1 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-[40px] xl:text-[48px] uppercase tracking-[-0.01em] text-[#220915] leading-[1.08] break-words">
                  <span className="block">{serviceConfig.titleLine1}</span>
                  <span className="block mt-1 italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#4A0B32] via-[#9E1946] to-[#B88228]">
                    {serviceConfig.titleLine2}
                  </span>
                </h1>
              </div>

              {/* Active Slide Style Subtitle */}
              <div
                className="flex items-center justify-center lg:justify-start gap-2.5 mt-2.5 sm:mt-3 mb-2.5 animate-hero-text-up"
                style={{ animationDelay: '110ms' }}
              >
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] shrink-0" />
                <span className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-r from-[#D4AF37] via-[#B88228] to-transparent" />
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#8C5818]">
                  {activeSlide.tag}: {activeSlide.name}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-xs sm:text-[13.5px] text-[#4E3629] leading-[1.65] max-w-[470px] font-medium animate-hero-text-up"
                style={{ animationDelay: '145ms' }}
              >
                {activeSlide.description}
              </p>

              {/* Active Slide Specs Pills */}
              <div
                className="mt-3.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 animate-hero-text-up"
                style={{ animationDelay: '190ms' }}
              >
                {activeSlide.specs.map((sp) => (
                  <span
                    key={sp}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 text-[10px] sm:text-[10.5px] font-bold text-[#280619] shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#9E1946] shrink-0" />
                    <span>{sp}</span>
                  </span>
                ))}
              </div>

              {/* Dual Action Buttons */}
              <div
                className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 animate-hero-text-up"
                style={{ animationDelay: '235ms' }}
              >
                <a
                  href="#custom-stitching-booking"
                  className="group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] hover:from-[#4E0B34] hover:to-[#280619] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-xs sm:text-sm tracking-wide shadow-[0_10px_26px_rgba(56,7,37,0.28)] transition-all duration-300 hover:scale-105"
                >
                  <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE59E]" />
                  <span>Customize {serviceConfig.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE59E] group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={handleBookViaWhatsApp}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#FFFDF9]/90 hover:bg-[#380725] text-[#280619] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37]/80 font-serif font-bold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>WhatsApp Master Tailor</span>
                </button>
              </div>
            </div>

            {/* Bottom Glassmorphic 4-Slide Style Lookbook Dock */}
            <div className="mt-5 sm:mt-6 w-full max-w-[460px] rounded-2xl bg-[#FFFDF9]/80 backdrop-blur-md border border-[#D4AF37]/55 p-2 sm:p-2.5 shadow-[0_14px_32px_rgba(40,6,25,0.1)] flex items-center gap-2 sm:gap-3">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 flex-1">
                {slides.map((sl, idx) => {
                  const isActive = slideIdx === idx;
                  return (
                    <button
                      key={sl.id}
                      type="button"
                      onClick={() => goToLookbookSlide(idx)}
                      className={`group relative aspect-[3/4] w-full rounded-xl p-[2px] cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_8px_20px_rgba(40,6,25,0.24)] -translate-y-0.5 scale-[1.02]'
                          : 'bg-[#D4AF37]/35 opacity-80 hover:opacity-100 hover:-translate-y-0.5 hover:bg-[#D4AF37]'
                      }`}
                    >
                      <div className="relative w-full h-full rounded-[9px] overflow-hidden bg-[#F3E3C6]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sl.image}
                          alt={sl.name}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#220414]/85 to-transparent flex items-end justify-between px-1.5 pb-0.5">
                          <span className="text-[8px] font-bold text-[#FFE59E] truncate">
                            0{idx + 1}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => goToLookbookSlide(slideIdx + 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-[#4E0B34] to-[#280619] hover:from-[#FFF4C2] hover:to-[#D4AF37] text-[#FFE59E] hover:text-[#280619] border-[1.5px] border-[#D4AF37] shadow-md flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next style slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToLookbookSlide(slideIdx - 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-[#380725] text-[#280619] hover:text-[#FFE59E] border border-[#D4AF37]/75 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous style slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Orbital Portrait Showcase + Docked 360° Seal + 01/04 Counter */}
          <div className="relative w-full lg:w-[50%] flex items-center justify-center py-2 sm:py-4 lg:py-0">
            <div className="relative w-[260px] h-[260px] sm:w-[370px] sm:h-[370px] lg:w-[420px] lg:h-[420px] xl:w-[470px] xl:h-[470px] rounded-full bg-gradient-to-tr from-[#F2E2BE] via-[#FAF1DC] to-[#EFE6CE] border border-[#D4AF37]/45 shadow-[inset_0_0_60px_rgba(212,175,55,0.22)] flex items-center justify-center">
              {/* Docked 360° Rotating Couture Seal (Top-Left of Halo) */}
              <a
                href="#custom-stitching-booking"
                className="group absolute -top-4 -left-4 sm:-top-5 sm:-left-8 lg:-left-12 z-30 w-20 h-20 sm:w-26 sm:h-26 flex items-center justify-center transition-transform duration-300 hover:scale-108"
              >
                <span className="absolute inset-1.5 rounded-full bg-[#CE374A]/20 blur-md pointer-events-none" />
                <svg
                  viewBox="0 0 140 140"
                  className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
                >
                  <defs>
                    <path
                      id="indivStitchCirclePath"
                      d="M 70, 70 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
                    />
                  </defs>
                  <circle
                    cx="70"
                    cy="70"
                    r="64"
                    fill="#FFFDF9"
                    fillOpacity="0.9"
                    stroke="#D4AF37"
                    strokeWidth="1.4"
                  />
                  <text fill="#380725" fontSize="8.2" fontWeight="800" letterSpacing="2.4px">
                    <textPath href="#indivStitchCirclePath" startOffset="0%">
                      • BESPOKE TAILORING • PERFECT ROYAL FIT
                    </textPath>
                  </text>
                </svg>
                <div className="relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D6304C] via-[#9E1946] to-[#380725] flex flex-col items-center justify-center text-white">
                    <Scissors className="w-3.5 h-3.5 text-[#FFE59E]" />
                    <span className="font-sans font-extrabold text-[7px] sm:text-[8px] uppercase tracking-[0.14em] text-[#FFFDF9]">
                      BOOK FIT
                    </span>
                  </div>
                </div>
              </a>

              {/* 3D Half-Circle Exit & Bottom-Rise Portrait Stage */}
              <div className="relative z-10 h-[290px] sm:h-[390px] lg:h-[440px] xl:h-[490px] aspect-[3/4] flex items-center justify-center">
                {outgoingSlide && prevSlideIdx !== null && (
                  <div
                    key={`out-${serviceConfig.slug}-${animTick}-${prevSlideIdx}`}
                    className="absolute inset-0 w-full h-full rounded-[24px] p-[3px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-2xl pointer-events-none z-20 animate-hero-arc-out"
                  >
                    <div className="relative w-full h-full rounded-[21px] overflow-hidden bg-[#280619]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={outgoingSlide.image}
                        alt={outgoingSlide.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                )}

                <div
                  key={`in-${serviceConfig.slug}-${animTick}-${slideIdx}`}
                  className="relative z-10 w-full h-full rounded-[24px] p-[3px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_55px_rgba(40,6,25,0.28)] animate-hero-rise-in"
                >
                  <div className="relative w-full h-full rounded-[21px] overflow-hidden bg-[#280619]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeSlide.image}
                      alt={activeSlide.name}
                      className="w-full h-full object-cover object-top animate-hero-inner-settle"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1A020E]/85 via-[#1A020E]/35 to-transparent flex items-end justify-between px-4 pb-3">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
                          {activeSlide.tag}
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-bold text-white">
                          {activeSlide.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Far-Right Counter (01 / 04) */}
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 absolute right-1 sm:right-2 lg:right-0 top-1/2 -translate-y-1/2 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border border-[#D4AF37]/65 rounded-full py-2.5 sm:py-4 px-2 sm:px-2.5 shadow-md">
              <span className="font-serif text-base sm:text-2xl font-bold text-[#280619] leading-none">
                {String(slideIdx + 1).padStart(2, '0')}
              </span>
              <div className="relative w-[2px] h-10 sm:h-16 bg-[#E6D5B8] rounded-full overflow-hidden">
                <div
                  className="w-full bg-gradient-to-b from-[#380725] via-[#9E1946] to-[#D4AF37] transition-all duration-700"
                  style={{
                    height: `${((slideIdx + 1) / slides.length) * 100}%`,
                  }}
                />
              </div>
              <span className="font-serif text-[10px] sm:text-xs font-bold text-[#7A542E]">
                {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 02. COLLECTION SIGNATURE STYLES FOR THIS SPECIFIC SERVICE           */}
      {/* =================================================================== */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>{serviceConfig.name.toUpperCase()} COLLECTION</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#280619]">
            Signature {serviceConfig.shortName} Styles
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D1E] mt-1.5">
            Click any signature design below to load its specifications into the bespoke tailoring form
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {slides.map((sl, idx) => {
            const isSelected = idx === slideIdx;
            return (
              <div
                key={sl.id}
                onClick={() => {
                  goToLookbookSlide(idx);
                  if (serviceConfig.step1Options[idx]) {
                    setStep1Value(serviceConfig.step1Options[idx]);
                  }
                  const el = document.getElementById('custom-stitching-booking');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group rounded-2xl p-[2.5px] cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_18px_40px_rgba(56,7,37,0.22)] -translate-y-1.5'
                    : 'bg-gradient-to-b from-[#FFE59E]/70 via-[#D4AF37]/60 to-[#8C5818]/60 hover:-translate-y-1 shadow-md'
                }`}
              >
                <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="relative h-52 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37]/50 mb-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sl.image}
                        alt={sl.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#380725]/90 border border-[#FFE59E]/80 text-[9px] font-bold uppercase tracking-wider text-[#FFE59E]">
                        {sl.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#280619] leading-snug">
                      {sl.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#9E1946] mt-0.5">
                      {sl.subtitle}
                    </p>
                    <p className="text-xs text-[#5C3D1E] mt-1.5 leading-relaxed line-clamp-2">
                      {sl.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-[#D4AF37]/30 flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#8C5818]">
                      {serviceConfig.turnaround}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-serif font-bold text-[#380725] group-hover:translate-x-1 transition-transform">
                      <span>Select &amp; Customize</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 03. COLLECTION-SPECIFIC BESPOKE TAILORING & MEASUREMENT FORM        */}
      {/* =================================================================== */}
      <section
        id="custom-stitching-booking"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24"
      >
        <div className="rounded-3xl p-[3px] bg-gradient-to-r from-[#B88228] via-[#FFF2B8] to-[#B88228] shadow-[0_22px_55px_rgba(40,6,25,0.18)]">
          <div className="rounded-[22px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 sm:p-9 lg:p-12">
            {/* Form Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/45 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#380725] text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Layers className="w-3 h-3" />
                  <span>COLLECTION-SPECIFIC TAILORING FORM</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#280619]">
                  {serviceConfig.name} — Custom Specification &amp; Fit Form
                </h2>
                <p className="text-xs sm:text-sm text-[#5C3D1E] mt-1">
                  All style choices, fabric specifications, and measurement fields below are tailored specifically for{' '}
                  <strong className="text-[#380725]">{serviceConfig.name}</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#380725] bg-[#FFFDF9] px-4 py-2.5 rounded-full border border-[#D4AF37] shrink-0 self-start lg:self-center">
                <ShieldCheck className="w-4 h-4 text-[#B88228] shrink-0" />
                <span>Free Alteration Guarantee • Thoothukudi Atelier</span>
              </div>
            </div>

            <form
              onSubmit={handleOnlineBookingSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT 7 COLS: Collection-Specific Steps 1 to 6 */}
              <div className="lg:col-span-7 space-y-7">
                {/* STEP 1: Silhouette / Cut / Craft */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {serviceConfig.step1Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {serviceConfig.step1Options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStep1Value(opt)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer border ${
                          step1Value === opt
                            ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#380725]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 2: Neckline / Yoke / Skirt / Bottom Style */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {serviceConfig.step2Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {serviceConfig.step2Options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStep2Value(opt)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer border ${
                          step2Value === opt
                            ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#380725]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 3: Sleeve / Dupatta / Neck Detailing */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {serviceConfig.step3Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {serviceConfig.step3Options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStep3Value(opt)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer border ${
                          step3Value === opt
                            ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#380725]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STEP 4: COLLECTION-RELATED INFORMATION FIELDS */}
                <div className="rounded-2xl bg-[#FFFDF9]/90 border border-[#D4AF37]/65 p-4 sm:p-5 space-y-4 shadow-xs">
                  <div className="border-b border-[#D4AF37]/30 pb-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#380725]">
                      {serviceConfig.step4SectionTitle}
                    </span>
                  </div>

                  {/* Choice Pills for Step 4 */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C3D1E] mb-2">
                      {serviceConfig.step4ChoiceLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceConfig.step4Choices.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setStep4Choice(ch)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            step4Choice === ch
                              ? 'bg-[#380725] text-[#FFE59E] border-[#D4AF37] shadow-xs'
                              : 'bg-[#FAF0DD]/70 text-[#280619] border-[#D4AF37]/50 hover:border-[#380725]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collection-Specific Information Inputs (Selects / Dates / Text) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    {serviceConfig.customInfoFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-bold text-[#280619] mb-1">
                          {field.label}
                        </label>
                        {field.type === 'select' && field.options ? (
                          <select
                            value={customInfoValues[field.key] || ''}
                            onChange={(e) =>
                              setCustomInfoValues({
                                ...customInfoValues,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] focus:outline-none focus:border-[#380725]"
                          >
                            {field.options.map((op) => (
                              <option key={op} value={op}>
                                {op}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type === 'date' ? 'date' : 'text'}
                            placeholder={field.placeholder}
                            value={customInfoValues[field.key] || ''}
                            onChange={(e) =>
                              setCustomInfoValues({
                                ...customInfoValues,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] placeholder:text-[#8C5818]/55 focus:outline-none focus:border-[#380725]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* STEP 5: Service-Specific Add-ons */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {serviceConfig.step5Label}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {serviceConfig.addons.map((addon) => {
                      const active = selectedAddons.includes(addon);
                      return (
                        <button
                          key={addon}
                          type="button"
                          onClick={() => toggleAddon(addon)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            active
                              ? 'bg-[#380725] text-[#FFE59E] border-[#D4AF37] shadow-xs'
                              : 'bg-[#FFFDF9] text-[#4E3629] border-[#D4AF37]/50 hover:border-[#380725]'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-[#FFE59E]' : 'text-[#D4AF37]'
                            }`}
                          />
                          <span>{addon}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 6: COLLECTION-SPECIFIC MEASUREMENT FIELDS */}
                <div className="rounded-2xl bg-[#FFFDF9]/95 border border-[#D4AF37]/70 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619]">
                        {serviceConfig.measurementTitle}
                      </label>
                      <p className="text-[11px] text-[#5C3D1E] mt-0.5">
                        {serviceConfig.measurementSubtitle}
                      </p>
                    </div>
                    <div className="inline-flex rounded-full p-0.5 bg-[#EFE0C2] border border-[#D4AF37]/60">
                      <button
                        type="button"
                        onClick={() => setMeasurementMode('online')}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          measurementMode === 'online'
                            ? 'bg-[#380725] text-[#FFE59E]'
                            : 'text-[#4E3629]'
                        }`}
                      >
                        Enter Measurements (in)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMeasurementMode('whatsapp')}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                          measurementMode === 'whatsapp'
                            ? 'bg-[#380725] text-[#FFE59E]'
                            : 'text-[#4E3629]'
                        }`}
                      >
                        WhatsApp Call / Sample Pickup
                      </button>
                    </div>
                  </div>

                  {measurementMode === 'online' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {serviceConfig.measurementFields.map((field) => (
                        <div
                          key={field.key}
                          className="bg-[#FAF0DD]/55 rounded-xl p-2.5 border border-[#D4AF37]/45"
                        >
                          <span className="block text-[10.5px] font-bold text-[#280619] leading-tight">
                            {field.label}
                          </span>
                          <span className="block text-[9.5px] text-[#7A542E] mb-1.5">
                            {field.hint}
                          </span>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={measurements[field.key] || ''}
                            onChange={(e) =>
                              setMeasurements({
                                ...measurements,
                                [field.key]: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D4AF37]/70 text-xs font-bold text-[#280619] focus:outline-none focus:border-[#380725]"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#FAF0DD]/70 border border-[#D4AF37]/60 p-4 text-xs text-[#4E3629] flex items-start gap-3">
                      <HeartHandshake className="w-5 h-5 text-[#9E1946] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#280619]">
                          Guided Master Tailor Measurement Support
                        </p>
                        <p className="mt-1 leading-relaxed">
                          Once you submit your booking, our Master Tailor will connect with you on WhatsApp to guide you through taking measurements at home or arrange a sample garment pickup from your doorstep.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT 5 COLS: Live Collection Summary & Customer Booking Card */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 rounded-2xl bg-gradient-to-b from-[#280619] via-[#380725] to-[#240415] text-[#FAF0DD] p-6 sm:p-7 border-2 border-[#D4AF37] shadow-xl space-y-4">
                  <div className="border-b border-[#D4AF37]/35 pb-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E]">
                      BESPOKE SPECIFICATION SUMMARY
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#FFFDF9] mt-0.5">
                      {serviceConfig.name}
                    </h3>
                    <div className="mt-2.5 space-y-1 text-[11px] text-[#FFE59E]/90">
                      <p>
                        <span className="text-[#D4AF37] font-bold">Style:</span> {step1Value}
                      </p>
                      <p>
                        <span className="text-[#D4AF37] font-bold">Design:</span> {step2Value}
                      </p>
                      <p>
                        <span className="text-[#D4AF37] font-bold">Detail:</span> {step3Value}
                      </p>
                      <p>
                        <span className="text-[#D4AF37] font-bold">Option:</span> {step4Choice}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] text-[#280619] text-xs font-semibold border border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                          WhatsApp / Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, phone: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] text-[#280619] text-xs font-semibold border border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                          City / Location
                        </label>
                        <input
                          type="text"
                          placeholder="Thoothukudi / Chennai..."
                          value={customerInfo.pickupCity}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              pickupCity: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] text-[#280619] text-xs font-semibold border border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                        Additional Design / Reference Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Mention contrast border shade, custom neck dip, or delivery date..."
                        value={customerInfo.notes}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, notes: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] text-[#280619] text-xs font-semibold border border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFF4C2] via-[#FFE59E] to-[#D4AF37] text-[#280619] font-serif font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? 'Submitting Request...'
                          : `Book ${serviceConfig.shortName} Stitching`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBookViaWhatsApp}
                      className="w-full py-3 rounded-full bg-[#15803D] hover:bg-[#166534] text-white font-serif font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#FFE59E]/50 shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Specifications on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 04. EXPLORE OTHER DEDICATED STITCHING SERVICE PAGES                 */}
      {/* =================================================================== */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
        <div className="border-t border-[#D4AF37]/45 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C5818]">
                EXPLORE SEPARATE TAILORING PAGES
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#280619]">
                Other Bespoke Stitching Services
              </h3>
            </div>
            <Link
              href="/stitching-services"
              className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#380725] hover:text-[#9E1946]"
            >
              <span>View All Stitching Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STITCHING_SERVICES_CONFIG.filter((s) => s.slug !== serviceConfig.slug).map(
              (other) => (
                <Link
                  key={other.slug}
                  href={`/stitching-services/${other.slug}`}
                  className="group rounded-2xl p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#D4AF37] to-[#8C5818] shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="h-full rounded-[14px] bg-[#FFFDF9] p-3 flex flex-col justify-between">
                    <div>
                      <div className="h-32 rounded-xl overflow-hidden bg-[#280619] mb-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={other.image}
                          alt={other.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#280619] group-hover:text-[#9E1946] transition-colors">
                        {other.name}
                      </h4>
                      <p className="text-[10px] text-[#7A542E] mt-0.5">
                        {other.turnaround}
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#380725]">
                      <span>Open Page</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

