"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCcw, MessageCircle } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[82vh] bg-[#FAF7F2] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.14),transparent_65%)]" />

      <div className="max-w-lg w-full relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6]/90 to-[#F5E9D3]/80 rounded-2xl p-8 md:p-12 border-2 border-[#D4AF37]/70 shadow-[0_24px_60px_-15px_rgba(14,11,9,0.2)] text-center space-y-7 z-10">
        <div className="pointer-events-none absolute inset-[5px] rounded-[12px] border border-[#D4AF37]/25" />
        <span className="pointer-events-none absolute top-2.5 left-2.5 h-4 w-4 border-t-2 border-l-2 border-[#D4AF37]" />
        <span className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 border-t-2 border-r-2 border-[#D4AF37]" />
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-4 w-4 border-b-2 border-l-2 border-[#D4AF37]" />
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-4 w-4 border-b-2 border-r-2 border-[#D4AF37]" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0B09] border border-[#D4AF37]/65 text-[#FFE59E] shadow-md">
            <NalmaraEmblem className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold">
              Nalmara Fashion • Thoothukudi
            </span>
          </div>

          <div className="w-20 h-20 bg-gradient-to-b from-[#0E0B09] to-[#1F1811] border-2 border-[#D4AF37] rounded-full flex items-center justify-center mx-auto text-[#FFE59E] shadow-[0_12px_30px_rgba(14,11,9,0.25)]">
            <XCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>

          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#0E0B09] tracking-tight">
              Payment{" "}
              <span className="font-script italic font-normal text-[#8C6518] text-4xl sm:text-5xl">
                Not Completed
              </span>
            </h1>
            <p className="text-[#4A3B2C] font-medium leading-relaxed text-sm">
              Your payment was not completed and no money was deducted. Your selected sarees and outfits are still safely saved in your shopping bag.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/checkout"
              className="w-full py-4 px-8 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#0E0B09] border border-[#FFFDF9] font-extrabold rounded-full flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-[0_12px_30px_rgba(212,175,55,0.35)] text-xs uppercase tracking-[0.22em]"
            >
              <RefreshCcw className="w-4 h-4" /> Try Checkout Again
            </Link>
            <Link
              href="/cart"
              className="w-full py-4 px-8 bg-gradient-to-r from-[#0E0B09] via-[#1F1811] to-[#0E0B09] border border-[#D4AF37] text-[#FFE59E] font-bold rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all text-xs uppercase tracking-[0.22em]"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" /> Back to Shopping Bag
            </Link>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-center gap-2 text-xs text-[#6B5A47]">
            <MessageCircle className="w-3.5 h-3.5 text-[#8C6518]" />
            <span>Need help? WhatsApp Support: </span>
            <a
              href="https://wa.me/916383163609"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#0E0B09] underline hover:text-[#8C6518]"
            >
              6383163609
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
