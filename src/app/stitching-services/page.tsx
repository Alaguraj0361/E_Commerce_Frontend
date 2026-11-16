'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { STITCHING_SERVICES_CONFIG } from '../../data/stitchingServicesData';
import { InnerPageBanner } from '../../components/layout/InnerPageBanner';

function StitchingServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = searchParams.get('service') || '';

  // Redirect legacy ?service=... query links directly to their dedicated separate page
  useEffect(() => {
    if (serviceParam) {
      const match = STITCHING_SERVICES_CONFIG.find((s) => s.slug === serviceParam);
      if (match) {
        router.replace(`/stitching-services/${match.slug}`);
      }
    }
  }, [serviceParam, router]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    if (prevIndex === null) return;
    const timer = setTimeout(() => setPrevIndex(null), 1080);
    return () => clearTimeout(timer);
  }, [prevIndex, animTick]);

  const selectServiceSlide = (idx: number) => {
    const normalized =
      ((idx % STITCHING_SERVICES_CONFIG.length) + STITCHING_SERVICES_CONFIG.length) %
      STITCHING_SERVICES_CONFIG.length;
    if (normalized !== currentIndex) {
      setPrevIndex(currentIndex);
      setCurrentIndex(normalized);
      setAnimTick((t) => t + 1);
    }
  };

  const activeService =
    STITCHING_SERVICES_CONFIG[currentIndex] || STITCHING_SERVICES_CONFIG[0];
  const outgoingService =
    prevIndex !== null ? STITCHING_SERVICES_CONFIG[prevIndex] : null;

  // Dynamic Collection-Based Form State
  const [step1Value, setStep1Value] = useState(activeService.step1Options[0]);
  const [step2Value, setStep2Value] = useState(activeService.step2Options[0]);
  const [step3Value, setStep3Value] = useState(activeService.step3Options[0]);
  const [step4Choice, setStep4Choice] = useState(activeService.step4Choices[0]);
  const [customInfoValues, setCustomInfoValues] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    activeService.addons.slice(0, 2)
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

  // Sync collection-specific form fields when activeService changes
  useEffect(() => {
    setStep1Value(activeService.step1Options[0]);
    setStep2Value(activeService.step2Options[0]);
    setStep3Value(activeService.step3Options[0]);
    setStep4Choice(activeService.step4Choices[0]);

    const initialInfo: Record<string, string> = {};
    activeService.customInfoFields.forEach((f) => {
      initialInfo[f.key] = f.options && f.options.length > 0 ? f.options[0] : '';
    });
    setCustomInfoValues(initialInfo);

    setSelectedAddons(activeService.addons.slice(0, 2));

    const initialMeas: Record<string, string> = {};
    activeService.measurementFields.forEach((m) => {
      initialMeas[m.key] = '';
    });
    setMeasurements(initialMeas);
  }, [activeService]);

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const formatCustomInfoSummary = () => {
    return activeService.customInfoFields
      .map((field) => {
        const val = customInfoValues[field.key]?.trim();
        return val ? `${field.label}: ${val}` : null;
      })
      .filter(Boolean)
      .join(' | ');
  };

  const formatMeasurementsSummary = () => {
    if (measurementMode === 'whatsapp') {
      return 'Will share reference measurements / sample garment on WhatsApp';
    }
    const filled = activeService.measurementFields
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
      `Hello NALMARA FASHION, I would like to book *${activeService.name}*:`,
      `• ${activeService.step1Label.replace(/^\d+\.\s*/, '')}: ${step1Value}`,
      `• ${activeService.step2Label.replace(/^\d+\.\s*/, '')}: ${step2Value}`,
      `• ${activeService.step3Label.replace(/^\d+\.\s*/, '')}: ${step3Value}`,
      `• ${activeService.step4ChoiceLabel}: ${step4Choice}`,
      customInfoStr ? `• Collection Info: ${customInfoStr}` : '',
      `• Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'Standard Finishing'}`,
      `• Measurements: ${measStr}`,
      customerInfo.name
        ? `• Customer: ${customerInfo.name} (${customerInfo.phone}) — ${customerInfo.pickupCity}`
        : '',
      customerInfo.notes ? `• Notes: ${customerInfo.notes}` : '',
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
      toast.error('Please enter your name and phone number.');
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
          enquiryType: activeService.name,
          message: [
            `Service: ${activeService.name}`,
            `Step 1: ${step1Value}`,
            `Step 2: ${step2Value}`,
            `Step 3: ${step3Value}`,
            `${activeService.step4ChoiceLabel}: ${step4Choice}`,
            `Collection Info: ${formatCustomInfoSummary()}`,
            `Add-ons: ${selectedAddons.join(', ')}`,
            `Measurements: ${formatMeasurementsSummary()}`,
            `City: ${customerInfo.pickupCity}`,
            `Notes: ${customerInfo.notes}`,
          ].join(' | '),
        }),
      });
      toast.success(`Your ${activeService.name} booking request has been received!`);
      setCustomerInfo((prev) => ({ ...prev, name: '', phone: '', notes: '' }));
    } catch {
      toast.success('Redirecting to WhatsApp Master Tailor Concierge...');
      handleBookViaWhatsApp();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B] overflow-x-hidden select-none">
      {/* =================================================================== */}
      {/* 00. DIRECT LINKS TO ALL 6 SEPARATE STITCHING SERVICE PAGES          */}
      {/* =================================================================== */}
      <div className="bg-gradient-to-r from-[#280619] via-[#3E0829] to-[#280619] border-b border-[#D4AF37]/50 py-2.5 px-4 sm:px-8">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
            Dedicated Stitching Pages:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {STITCHING_SERVICES_CONFIG.map((item) => (
              <Link
                key={item.slug}
                href={`/stitching-services/${item.slug}`}
                className="px-3 py-1 rounded-full text-[10.5px] font-serif font-bold whitespace-nowrap transition-all bg-[#380725]/85 text-[#FFE59E] border border-[#D4AF37]/55 hover:bg-gradient-to-r hover:from-[#FFF4C2] hover:to-[#D4AF37] hover:text-[#280619]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 01. ROYAL 450PX HERO BANNER */}
      <InnerPageBanner
        title="Custom Atelier"
        titleHighlight="Stitching"
        badge="BESPOKE TAILORING ATELIER • THOOTHUKUDI"
        image="/images/nalmara/ref/stitching_banner_full.jpg"
        subtitle="Master tailors crafting custom bridal Aari blouses, princess-cut blouses, kids pattu pavadai, and couture lehengas with perfect custom fit."
        breadcrumb={[{ label: 'Stitching Services' }]}
      />

      {/* =================================================================== */}
      {/* 02. ALL 6 STITCHING SERVICES CARDS (LINKS TO SEPARATE PAGES)        */}
      {/* =================================================================== */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFE59E] mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>6 DEDICATED TAILORING PAGES</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#280619]">
            Bespoke Tailoring Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D1E] mt-1.5">
            Select any service below to open its dedicated page with collection-specific form fields and measurements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STITCHING_SERVICES_CONFIG.map((srv, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <Link
                key={srv.slug}
                href={`/stitching-services/${srv.slug}`}
                className={`group rounded-2xl p-[2.5px] cursor-pointer transition-all duration-300 block ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_18px_40px_rgba(56,7,37,0.22)] -translate-y-1.5'
                    : 'bg-gradient-to-b from-[#FFE59E]/70 via-[#D4AF37]/60 to-[#8C5818]/60 hover:-translate-y-1 shadow-md'
                }`}
              >
                <div className="h-full rounded-[14px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative h-56 rounded-xl overflow-hidden bg-[#280619] border border-[#D4AF37]/50 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#380725]/90 border border-[#FFE59E]/80 text-[9.5px] font-bold uppercase tracking-wider text-[#FFE59E]">
                        {srv.turnaround}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#280619] group-hover:text-[#9E1946] transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-[#5C3D1E] mt-1.5 leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {srv.popularStyles.map((st) => (
                        <span
                          key={st}
                          className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/50 text-[10px] font-semibold text-[#4E3629]"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C5818]">
                      Dedicated Form &amp; Fit
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-serif font-bold text-[#380725] group-hover:translate-x-1 transition-transform">
                      <span>Open {srv.shortName} Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 03. DYNAMIC COLLECTION-BASED STITCHING & MEASUREMENT CONFIGURATOR   */}
      {/* =================================================================== */}
      <section
        id="custom-stitching-booking"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24"
      >
        <div className="rounded-3xl p-[3px] bg-gradient-to-r from-[#B88228] via-[#FFF2B8] to-[#B88228] shadow-[0_22px_55px_rgba(40,6,25,0.18)]">
          <div className="rounded-[22px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 sm:p-9 lg:p-12">
            {/* Service Switcher Tabs inside Form */}
            <div className="mb-6 pb-5 border-b border-[#D4AF37]/40">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#8C5818] mb-2.5">
                SELECT COLLECTION TO LOAD ITS DEDICATED FORM FIELDS:
              </span>
              <div className="flex flex-wrap gap-2">
                {STITCHING_SERVICES_CONFIG.map((srv, idx) => {
                  const active = idx === currentIndex;
                  return (
                    <button
                      key={srv.slug}
                      type="button"
                      onClick={() => selectServiceSlide(idx)}
                      className={`px-3.5 py-2 rounded-full text-xs font-serif font-bold transition-all cursor-pointer border ${
                        active
                          ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border-[#D4AF37] shadow-md'
                          : 'bg-[#FFFDF9] text-[#280619] border-[#D4AF37]/60 hover:border-[#380725]'
                      }`}
                    >
                      {srv.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/45 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#380725] text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  <Layers className="w-3 h-3" />
                  <span>COLLECTION-SPECIFIC TAILORING FORM</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#280619]">
                  Customize: {activeService.name}
                </h2>
              </div>
              <Link
                href={`/stitching-services/${activeService.slug}`}
                className="inline-flex items-center gap-2 text-xs font-serif font-bold text-[#380725] bg-[#FFFDF9] hover:bg-[#380725] hover:text-[#FFE59E] px-4 py-2.5 rounded-full border border-[#D4AF37] transition-colors self-start lg:self-center"
              >
                <span>Go to Full {activeService.name} Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <form
              onSubmit={handleOnlineBookingSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left 7 Cols: Dynamic Collection-Specific Fields */}
              <div className="lg:col-span-7 space-y-6">
                {/* Step 1 */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {activeService.step1Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeService.step1Options.map((opt) => (
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

                {/* Step 2 */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {activeService.step2Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeService.step2Options.map((opt) => (
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

                {/* Step 3 */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {activeService.step3Label}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeService.step3Options.map((opt) => (
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

                {/* Step 4: Collection-Related Info Fields */}
                <div className="rounded-2xl bg-[#FFFDF9]/90 border border-[#D4AF37]/65 p-4 sm:p-5 space-y-4">
                  <span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#380725]">
                    {activeService.step4SectionTitle}
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5C3D1E] mb-2">
                      {activeService.step4ChoiceLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeService.step4Choices.map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setStep4Choice(ch)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            step4Choice === ch
                              ? 'bg-[#380725] text-[#FFE59E] border-[#D4AF37]'
                              : 'bg-[#FAF0DD]/70 text-[#280619] border-[#D4AF37]/50'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {activeService.customInfoFields.map((field) => (
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
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] focus:outline-none"
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
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37]/75 text-xs font-semibold text-[#280619] focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 5: Add-ons */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619] mb-2.5">
                    {activeService.step5Label}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {activeService.addons.map((addon) => {
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
                            className={`w-3.5 h-3.5 ${
                              active ? 'text-[#FFE59E]' : 'text-[#D4AF37]'
                            }`}
                          />
                          <span>{addon}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 6: Collection-Specific Measurements */}
                <div className="rounded-2xl bg-[#FFFDF9]/95 border border-[#D4AF37]/70 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-[0.16em] text-[#280619]">
                        {activeService.measurementTitle}
                      </label>
                      <p className="text-[11px] text-[#5C3D1E] mt-0.5">
                        {activeService.measurementSubtitle}
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
                        Share on WhatsApp / Sample Pickup
                      </button>
                    </div>
                  </div>

                  {measurementMode === 'online' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {activeService.measurementFields.map((field) => (
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
                      <span>
                        Our Master Tailor will guide you step-by-step on WhatsApp video/voice call or arrange a sample garment pickup from your address.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right 5 Cols: Customer Details & Instant Booking Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 rounded-2xl bg-gradient-to-b from-[#280619] via-[#380725] to-[#240415] text-[#FAF0DD] p-6 sm:p-7 border-2 border-[#D4AF37] shadow-xl space-y-4">
                  <div className="border-b border-[#D4AF37]/35 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE59E]">
                      YOUR TAILORING SUMMARY
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#FFFDF9] mt-0.5">
                      {activeService.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-[11px] text-[#FFE59E]/90">
                      <p>• {step1Value}</p>
                      <p>• {step2Value}</p>
                      <p>• {step3Value}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                        Your Name *
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

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#FFE59E] mb-1">
                        WhatsApp / Mobile Number *
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
                        Special Design Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Piping color, saree contrast shade, or delivery date..."
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
                        {isSubmitting ? 'Submitting Request...' : 'Submit Stitching Booking'}
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
    </div>
  );
}

export default function StitchingServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#380725] border-t-transparent animate-spin" />
        </div>
      }
    >
      <StitchingServicesContent />
    </Suspense>
  );
}
