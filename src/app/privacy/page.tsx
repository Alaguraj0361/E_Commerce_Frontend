import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Bell,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { LotusIcon } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'Privacy Policy | NALMARA FASHION • Client Confidentiality & Data Protection',
  description:
    'Read NALMARA FASHION’s Privacy Policy. We uphold the strictest standards of client confidentiality, PCI-DSS payment safety, and data security.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#061811] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E5C07B] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Client Confidentiality</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Your trust is our most cherished asset. Learn how NALMARA FASHION safeguards your personal information and preserves your online privacy.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#E5C07B]">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Privacy Policy</span>
          </div>
        </div>
      </section>

      {/* 2. THREE PILLARS OF PRIVACY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">256-Bit SSL Encryption</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              All checkout information and account credentials pass through military-grade encrypted channels.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">Never Sold or Rented</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              We never monetize, rent, or trade your personal email, telephone numbers, or styling preferences with third-party advertisers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#0E3324] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C07B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-[#061811]">PCI-DSS Gateway Compliance</h4>
            <p className="text-xs text-zinc-600 font-light leading-relaxed">
              Credit card transactions are executed strictly via certified Tier-1 gateways (Razorpay / Stripe).
            </p>
          </div>
        </div>
      </section>

      {/* 3. POLICY DETAILS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10 text-xs sm:text-sm text-zinc-700 leading-relaxed font-light">
        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            1. Information We Collect
          </h2>
          <p>
            When you visit NALMARA FASHION or purchase a couture ensemble, we collect the necessary particulars to fulfill your royal shopping experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li><strong>Contact Particulars:</strong> Your name, delivery address, billing address, phone number, and email address.</li>
            <li><strong>Tailoring Measurements:</strong> Custom blouse dimensions, bust/waist specifications, height parameters, and special tailoring requests submitted for bespoke ensembles.</li>
            <li><strong>Transaction Records:</strong> Order identification, transaction amounts, and payment method summaries. Note that full credit card numbers and CVV codes are never stored on our servers.</li>
            <li><strong>Technical & Browsing Data:</strong> IP address, browser type, device information, and site interaction cookies used solely to optimize loading performance.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            2. How We Utilize Your Data
          </h2>
          <p>
            We process your information strictly for legitimate commercial and customer service purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>To dispatch insured consignments and provide real-time WhatsApp & SMS tracking alerts.</li>
            <li>To facilitate bespoke blouse stitching, neck pattern customization, and fall/pico tailoring.</li>
            <li>To verify secure payments and protect against fraudulent card usage.</li>
            <li>To notify you of festive launches, seasonal royal couture catalogs, and VIP previews (you may opt out at any time).</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            3. Sharing With Trusted Service Providers
          </h2>
          <p>
            We share relevant data only with vetted partners essential for order completion:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li><strong>Logistics Partners:</strong> BlueDart, Delhivery, DTDC, and DHL Express receive your name, address, and mobile number solely to complete doorstep delivery.</li>
            <li><strong>Payment Gateways:</strong> Razorpay and Stripe receive encrypted transaction tokens for bank authorization.</li>
            <li><strong>Government & Legal Authorities:</strong> Disclosed only if compelled by law or valid judicial orders under the Information Technology Act of India.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            4. Cookies & Web Analytics
          </h2>
          <p>
            Our website uses session cookies to remember your shopping cart items, wishlist preferences, and login state across page navigations. You may disable cookies in your browser settings, though doing so may limit interactive cart and checkout functionality.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            5. Your Rights & Data Deletion
          </h2>
          <p>
            Under the Digital Personal Data Protection Act (DPDP), you retain full rights over your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
            <li>Right to access and review your stored account records.</li>
            <li>Right to update or rectify inaccurate profile information.</li>
            <li>Right to request complete account and data deletion from our databases by contacting our privacy officer.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#D4AF37]/25 shadow-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#061811]">
            6. Grievance Officer & Inquiries
          </h2>
          <p>
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our Grievance Officer are:
          </p>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200 text-xs space-y-1">
            <p><strong>Grievance Officer:</strong> NALMARA Legal & Compliance Cell</p>
            <p><strong>Email:</strong> legal@nalmarafashion.com</p>
            <p><strong>Atelier Address:</strong> NALMARA FASHION, High Fashion Avenue, Indiranagar, Bengaluru, Karnataka 560038, India</p>
            <p><strong>Response Time:</strong> Within 48 business hours</p>
          </div>
        </div>
      </section>
    </div>
  );
}
