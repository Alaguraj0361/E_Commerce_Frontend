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
import { InnerPageBanner } from '../../../components/layout/InnerPageBanner';

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

      const res = await fetch(`${apiUrl}/stitching/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name.trim(),
          customerPhone: customerInfo.phone.trim(),
          customerEmail: 'stitching@nalmarafashion.com',
          customerCity: customerInfo.pickupCity,
          customerAddress: customerInfo.pickupCity,
          categorySlug: serviceConfig.slug,
          categoryName: serviceConfig.name,
          styleName: activeSlide.name,
          step1Value,
          step2Value,
          step3Value,
          step4Choice,
          customInfoSummary: formatCustomInfoSummary(),
          addons: selectedAddons,
          measurementMode,
          measurements,
          specialInstructions: [
            formatCustomInfoSummary(),
            selectedAddons.length > 0 ? `Add-ons: ${selectedAddons.join(', ')}` : '',
            customerInfo.notes,
          ]
            .filter(Boolean)
            .join(' | '),
          fitPreference: 'Comfort Fit',
          unit: 'inches',
          stitchingCharge: 450,
          notes: customerInfo.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        const orderNum = data?.data?.order?.stitchingOrderNumber || 'Order Confirmed';
        toast.success(
          `Bespoke Order ${orderNum} Booked! Details received in Atelier Console.`
        );
      } else {
        toast.success(
          `Your ${serviceConfig.name} booking & measurement details have been submitted!`
        );
      }
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
                      : 'bg-[#760159]/80 text-[#FFE59E]/85 border-[#D4AF37]/40 hover:border-[#FFE59E] hover:text-white'
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
      {/* 01. ROYAL 450PX HERO BANNER */}
      <InnerPageBanner
        title={serviceConfig.titleLine1}
        titleHighlight={serviceConfig.titleLine2}
        badge={`STITCHING SERVICES • ${serviceConfig.shortTag}`}
        image="/images/nalmara/ref/stitching_banner_full.jpg"
        subtitle={serviceConfig.description}
        breadcrumb={[
          { label: 'Stitching Services', href: '/stitching-services' },
          { label: serviceConfig.name },
        ]}
      />

      {/* =================================================================== */}
      {/* 02. COLLECTION SIGNATURE STYLES FOR THIS SPECIFIC SERVICE           */}
      {/* =================================================================== */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#760159] via-[#5B0E3D] to-[#760159] border border-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E] mb-2.5">
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
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#760159]/90 border border-[#FFE59E]/80 text-[9px] font-bold uppercase tracking-wider text-[#FFE59E]">
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
                    <span className="inline-flex items-center gap-1 text-xs font-serif font-bold text-[#760159] group-hover:translate-x-1 transition-transform">
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#760159] text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Layers className="w-3 h-3" />
                  <span>COLLECTION-SPECIFIC TAILORING FORM</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#280619]">
                  {serviceConfig.name} — Custom Specification &amp; Fit Form
                </h2>
                <p className="text-xs sm:text-sm text-[#5C3D1E] mt-1">
                  All style choices, fabric specifications, and measurement fields below are tailored specifically for{' '}
                  <strong className="text-[#760159]">{serviceConfig.name}</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#760159] bg-[#FFFDF9] px-4 py-2.5 rounded-full border border-[#D4AF37] shrink-0 self-start lg:self-center">
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
                            ? 'bg-gradient-to-r from-[#760159] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#760159]'
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
                            ? 'bg-gradient-to-r from-[#760159] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#760159]'
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
                            ? 'bg-gradient-to-r from-[#760159] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                            : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/50 hover:border-[#760159]'
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
                    <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#760159]">
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
                              ? 'bg-[#760159] text-[#FFE59E] border-[#D4AF37] shadow-xs'
                              : 'bg-[#FAF0DD]/70 text-[#280619] border-[#D4AF37]/50 hover:border-[#760159]'
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
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] focus:outline-none focus:border-[#760159]"
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
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] placeholder:text-[#8C5818]/55 focus:outline-none focus:border-[#760159]"
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
                              ? 'bg-[#760159] text-[#FFE59E] border-[#D4AF37] shadow-xs'
                              : 'bg-[#FFFDF9] text-[#4E3629] border-[#D4AF37]/50 hover:border-[#760159]'
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
                            ? 'bg-[#760159] text-[#FFE59E]'
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
                            ? 'bg-[#760159] text-[#FFE59E]'
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
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D4AF37]/70 text-xs font-bold text-[#280619] focus:outline-none focus:border-[#760159]"
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
                <div className="sticky top-28 rounded-2xl bg-gradient-to-b from-[#280619] via-[#760159] to-[#240415] text-[#FAF0DD] p-6 sm:p-7 border-2 border-[#D4AF37] shadow-xl space-y-4">
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
              className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#760159] hover:text-[#9E1946]"
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
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#760159]">
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

