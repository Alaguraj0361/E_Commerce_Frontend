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
import { LotusIcon } from '@/components/ui/BrandLogo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Bridal Couture & Customization',
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/contact/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit enquiry');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiryType: 'Bridal Couture & Customization',
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
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Royal Concierge</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Connect With Our Atelier
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Whether you seek custom bridal couture, bespoke saree draping consultations, or order assistance, our dedicated stylists are at your service.
          </p>

          <div className="pt-1 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Contact Us</span>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & ENQUIRY FORM */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                GET IN TOUCH
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2518]">
                We Would Love to Assist You
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Reach out to our personal styling team for custom fit requests, fabric sampling, or styling guidance.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3.5 pt-2">
              {/* Phone / WhatsApp */}
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Concierge Helpline & WhatsApp
                  </p>
                  <a
                    href="tel:+917871207631"
                    className="text-sm font-bold text-[#0B2518] hover:text-[#B8860B] transition-colors block"
                  >
                    +91 78712 07631
                  </a>
                  <a
                    href="https://wa.me/917871207631?text=Hello%20EFFIDOO%20team,%20I%20have%20an%20enquiry%20regarding%20your%20luxury%20ethnic%20wear."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline pt-0.5"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Email Correspondence
                  </p>
                  <a
                    href="mailto:support@effidoo.com"
                    className="text-sm font-bold text-[#0B2518] hover:text-[#B8860B] transition-colors block"
                  >
                    support@effidoo.com
                  </a>
                  <p className="text-[11px] text-zinc-500">
                    Average response time: within 4 hours
                  </p>
                </div>
              </div>

              {/* Studio Location */}
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Flagship Studio & Atelier
                  </p>
                  <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                    EFFIDOO Royal Atelier, 42 Cathedral Road, T. Nagar, Chennai, Tamil Nadu — 600017
                  </p>
                </div>
              </div>

              {/* Studio Hours */}
              <div className="bg-white p-5 rounded-2xl border border-[#D4AF37]/30 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#061811] text-[#E5C07B] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Consultation Hours
                  </p>
                  <p className="text-xs text-zinc-800 font-medium">
                    Monday – Saturday: 10:00 AM – 8:00 PM IST
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Sunday: Private Bridal Appointments Only
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#D4AF37]/40 shadow-xl p-6 sm:p-10 relative overflow-hidden">
              <div className="space-y-2 pb-6 border-b border-zinc-100">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8860B] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send An Enquiry</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0B2518]">
                  Personal Couture Consultation Form
                </h3>
                <p className="text-xs text-zinc-500">
                  Fill in your details below and our senior styling concierge will contact you with personalized assistance.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-bold text-[#0B2518]">
                      Enquiry Submitted Successfully!
                    </h4>
                    <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out to EFFIDOO. A confirmation has been dispatched, and our styling concierge will contact you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#061811] text-white text-xs font-semibold hover:bg-[#0E3324] transition-colors"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="pt-6 space-y-5">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ananya Sundaram"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-[#FAF8F5]/60"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ananya@example.com"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-[#FAF8F5]/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-[#FAF8F5]/60"
                      />
                    </div>

                    {/* Enquiry Type Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Nature of Enquiry <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full text-xs px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-[#FAF8F5]/60 text-zinc-800"
                      >
                        <option value="Bridal Couture & Customization">Bridal Couture & Customization</option>
                        <option value="Pure Silk Saree Consultation">Pure Silk Saree Consultation</option>
                        <option value="Bulk Wedding Troussau Order">Bulk Wedding Troussau Order</option>
                        <option value="Size Chart & Blouse Stitching">Size Chart & Blouse Stitching</option>
                        <option value="Order Tracking & Shipping Query">Order Tracking & Shipping Query</option>
                        <option value="General Brand Inquiry">General Brand Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">
                      Your Message / Specifications <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details such as your event date, preferred colors, silhouette choices, or specific sizing questions..."
                      className="w-full text-xs p-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-[#FAF8F5]/60"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-full bg-[#061811] hover:bg-[#0E3324] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/50 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Royal Enquiry</span>
                        <Send className="w-3.5 h-3.5 text-[#E5C07B]" />
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
