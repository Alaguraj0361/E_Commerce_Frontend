'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { NalmaraEmblem } from '@/components/ui/BrandLogo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Silk Sarees & Soft Silk',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-backend-4c4d.onrender.com/api';
      const res = await fetch(`${apiUrl}/contact/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit message');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiryType: 'Silk Sarees & Soft Silk',
        message: '',
      });
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Enquiry Error:', errorObj);
      setError(errorObj.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B]">
      {/* 1. ROYAL ATELIER SPLIT HERO BANNER — CONTACT US */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E6] to-[#F4E3C3] border-b-2 border-[#D4AF37]/60 py-10 sm:py-14">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 24%, rgba(212,175,55,0.16) 0%, transparent 45%), radial-gradient(circle at 78% 50%, rgba(91,14,61,0.08) 0%, transparent 48%)',
          }}
        />

        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* Left Column: Exact Page Name Headline ("CONTACT US"), Concierge Details & Direct Links */}
          <div className="w-full lg:w-[54%] flex flex-col items-center text-center lg:items-start lg:text-left animate-hero-text-up">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] shadow-sm">
                <NalmaraEmblem className="w-4 h-4 shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
                  CONTACT US • THOOTHUKUDI BOUTIQUE
                </span>
                <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 text-[10.5px] sm:text-[11px] font-semibold text-[#5C3D1E]">
                <Link href="/" className="hover:text-[#380725]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#9E1946] font-bold">Contact Us</span>
              </div>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] uppercase tracking-[-0.01em] text-[#220915] leading-[1.08]">
              <span className="block">CONTACT US</span>
              <span className="block mt-1 italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#4A0B32] via-[#9E1946] to-[#B88228]">
                ROYAL BOUTIQUE &amp; CONCIERGE
              </span>
            </h1>

            <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-3 mb-3">
              <span className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] border border-[#FFFDF9] shrink-0" />
              <span className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-[#D4AF37] via-[#B88228] to-transparent" />
              <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C5818]">
                6383163609 • 7871207631
              </span>
            </div>

            <p className="text-xs sm:text-[14px] text-[#4E3629] leading-[1.68] max-w-xl font-medium">
              Need live saree photos, custom blouse stitching guidance, bulk wedding return gift quotes, or order tracking? Connect directly with our Thoothukudi team via WhatsApp, phone, or the form below.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {['Live Video Saree Selection', 'Custom Stitching Support', 'Fast Response on WhatsApp'].map(
                (pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9]/90 border border-[#D4AF37]/60 text-[10px] sm:text-[10.5px] font-bold text-[#280619] shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#9E1946] shrink-0" />
                    <span>{pill}</span>
                  </span>
                )
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
              <a
                href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] text-[#FFE59E] border-[1.5px] border-[#D4AF37] font-serif font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#FFE59E] shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+916383163609"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-[#FFFDF9]/90 hover:bg-[#380725] text-[#280619] hover:text-[#FFE59E] border-[1.5px] border-[#D4AF37]/80 font-serif font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#B88228] shrink-0" />
                <span>Call +91 63831 63609</span>
              </a>
            </div>
          </div>

          {/* Right Column: Double-Bezel 24K Gold Portrait Showcase */}
          <div className="w-full lg:w-[44%] flex items-center justify-center pt-2 lg:pt-0">
            <div className="relative w-[250px] h-[250px] sm:w-[340px] sm:h-[340px] lg:w-[380px] lg:h-[380px] rounded-full bg-gradient-to-tr from-[#F2E2BE] via-[#FAF1DC] to-[#EFE6CE] border border-[#D4AF37]/45 shadow-[inset_0_0_50px_rgba(212,175,55,0.22)] flex items-center justify-center">
              <div className="relative z-10 h-[265px] sm:h-[355px] lg:h-[395px] aspect-[3/4] rounded-[22px] sm:rounded-[24px] p-[3px] bg-gradient-to-b from-[#FFF4C2] via-[#D4AF37] to-[#8C5818] shadow-[0_24px_50px_rgba(40,6,25,0.26)] animate-hero-rise-in">
                <div className="relative w-full h-full rounded-[19px] sm:rounded-[21px] overflow-hidden bg-[#280619]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/nalmara/hd/stitching_blouse_hd.jpg"
                    alt="Contact Nalmara Fashion"
                    className="w-full h-full object-cover object-top animate-hero-inner-settle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & ENQUIRY FORM */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1560px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#8C5818]">
                ✦ CUSTOMER SUPPORT
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#280619]">
                Happy to Help{' '}
                <span className="font-script italic font-normal text-3xl sm:text-4xl text-[#5B0E3D]">
                  You
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5C3D1E] leading-relaxed font-normal">
                Message us on WhatsApp to see live saree photos/videos, check stock, or place an order directly with our Thoothukudi shop.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3.5 pt-2">
              {/* Phone / WhatsApp */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 rounded-2xl border-2 border-[#D4AF37]/75 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Phone className="w-4 h-4 text-[#FFE59E]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C5818] font-extrabold">
                    Phone &amp; WhatsApp Order Numbers
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-sm font-serif font-extrabold text-[#280619]">
                    <a
                      href="tel:+916383163609"
                      className="hover:text-[#5B0E3D] transition-colors"
                    >
                      6383163609
                    </a>
                    <span className="text-[#D4AF37] font-normal px-1">|</span>
                    <a
                      href="tel:+917871207631"
                      className="hover:text-[#5B0E3D] transition-colors"
                    >
                      7871207631
                    </a>
                  </div>
                  <a
                    href="https://wa.me/916383163609?text=Hello%20NALMARA%20FASHION,%20I%20would%20like%20to%20see%20your%20saree%20collections."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold hover:underline pt-0.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp Now</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 rounded-2xl border-2 border-[#D4AF37]/75 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Mail className="w-4 h-4 text-[#FFE59E]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C5818] font-extrabold">
                    Email &amp; Instagram
                  </p>
                  <a
                    href="mailto:support@nalmarafashion.com"
                    className="text-sm font-bold text-[#280619] hover:text-[#5B0E3D] transition-colors block"
                  >
                    support@nalmarafashion.com
                  </a>
                  <a
                    href="https://www.instagram.com/nalmarafashion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#5B0E3D] font-bold hover:underline pt-0.5"
                  >
                    <span>Instagram: @nalmarafashion</span>
                  </a>
                </div>
              </div>

              {/* Shop Location */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 rounded-2xl border-2 border-[#D4AF37]/75 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4 text-[#FFE59E]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C5818] font-extrabold">
                    Our Shop Location
                  </p>
                  <p className="text-xs text-[#280619] leading-relaxed font-semibold">
                    NALMARA FASHION, Thoothukudi (Tuticorin), Tamil Nadu — 628001
                  </p>
                  <p className="text-[11px] text-[#5C3D1E]">
                    Fast 1–3 Day Delivery across all districts in Tamil Nadu &amp; India
                  </p>
                </div>
              </div>

              {/* Shop Hours */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] p-5 rounded-2xl border-2 border-[#D4AF37]/75 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#380725] to-[#280619] border border-[#D4AF37] text-[#FFE59E] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Clock className="w-4 h-4 text-[#FFE59E]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C5818] font-extrabold">
                    Store &amp; WhatsApp Timing
                  </p>
                  <p className="text-xs text-[#280619] font-bold">
                    Monday – Sunday: 9:30 AM – 9:00 PM IST
                  </p>
                  <p className="text-[11px] text-[#5C3D1E]">
                    Live WhatsApp Video Call Saree Selection Available Daily
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Simple Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl border-2 border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(56,7,37,0.12)] p-6 sm:p-10 overflow-hidden">
              <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />

              <div className="relative z-10 space-y-2 pb-6 border-b border-[#D4AF37]/40">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#8C5818] uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Send Us a Message</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#280619]">
                  Quick Enquiry Form
                </h3>
                <p className="text-xs text-[#5C3D1E]">
                  Enter your name and mobile number below, and our team in Thoothukudi will call or WhatsApp you shortly.
                </p>
              </div>

              {submitted ? (
                <div className="relative z-10 py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border-2 border-[#D4AF37] text-[#FFE59E] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#FFE59E]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-bold text-[#280619]">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-xs text-[#5C3D1E] max-w-md mx-auto leading-relaxed">
                      Thank you for contacting NALMARA FASHION, Thoothukudi. Our team will contact you on WhatsApp or phone soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] text-[#FFE59E] text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                  >
                    <span>Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 pt-6 space-y-5">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#280619]">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Lakshmi S."
                        className="w-full text-xs px-4 py-3 rounded-xl border border-[#D4AF37]/65 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFFDF9] text-[#280619]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#280619]">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. lakshmi@example.com"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-[#D4AF37]/65 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFFDF9] text-[#280619]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#280619]">
                        Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-[#D4AF37]/65 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFFDF9] text-[#280619]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-[#280619]">
                        What Are You Looking For? <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full text-xs px-4 py-3 rounded-xl border border-[#D4AF37]/65 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFFDF9] text-[#280619] font-semibold"
                      >
                        <option value="Silk Sarees & Soft Silk">Silk Sarees &amp; Soft Silk</option>
                        <option value="Wedding & Function Bulk Order">Wedding &amp; Function Bulk Order</option>
                        <option value="Cotton & Daily Wear Sarees">Cotton &amp; Daily Wear Sarees</option>
                        <option value="Salwar Suits & Kurtis">Salwar Suits &amp; Kurtis</option>
                        <option value="Kids Pattu Pavadai & Gowns">Kids Pattu Pavadai &amp; Gowns</option>
                        <option value="Order Tracking & Delivery Help">Order Tracking &amp; Delivery Help</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#280619]">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us the saree colour, budget, or order question you need help with..."
                      className="w-full text-xs p-4 rounded-xl border border-[#D4AF37]/65 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FFFDF9] text-[#280619]"
                    />
                  </div>

                  {/* Submit Button (3D Liquid 24K Gold Foil) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] text-xs font-extrabold uppercase tracking-[0.2em] shadow-[0_12px_28px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#280619]/30 border-t-[#280619] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5 text-[#280619]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
