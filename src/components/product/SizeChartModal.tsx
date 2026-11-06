"use client";

import { X, Ruler, Sparkles, CheckCircle2 } from "lucide-react";
import { NalmaraEmblem } from "@/components/ui/BrandLogo";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const BLOUSE_KURTI_SIZES = [
  { size: "XS (32)", bust: '32"', waist: '26"', hip: '35"', shoulder: '13.5"' },
  { size: "S (34)", bust: '34"', waist: '28"', hip: '37"', shoulder: '14.0"' },
  { size: "M (36)", bust: '36"', waist: '30"', hip: '39"', shoulder: '14.5"' },
  { size: "L (38)", bust: '38"', waist: '32"', hip: '41"', shoulder: '15.0"' },
  { size: "XL (40)", bust: '40"', waist: '34"', hip: '43"', shoulder: '15.5"' },
  { size: "XXL (42)", bust: '42"', waist: '36"', hip: '45"', shoulder: '16.0"' },
];

export function SizeChartModal({
  isOpen,
  onClose,
}: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0B09]/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border-2 border-[#D4AF37] shadow-[0_28px_80px_rgba(0,0,0,0.65)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Royal Obsidian & 24K Gold Header */}
        <div className="relative bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-[#FFFDF9] px-6 py-5 flex items-center justify-between border-b-2 border-[#D4AF37]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#17120D] border border-[#D4AF37] flex items-center justify-center text-[#FFE59E] shadow-md">
              <NalmaraEmblem className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]">
                Nalmara Bespoke Atelier
              </p>
              <h3 className="text-lg font-serif font-normal text-[#FFFDF9] flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#FFE59E]" /> Standard Size & Drape Guide
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Size Guide"
            className="w-9 h-9 rounded-full bg-[#1F1811] border border-[#D4AF37]/50 hover:border-[#FFE59E] flex items-center justify-center text-[#FFE59E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Saree Standard Dimensions */}
          <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F5E9D3] border-2 border-[#D4AF37]/60 rounded-xl p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#8C6518] font-extrabold text-xs uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Handloom Saree Dimensions (Free Size)
            </div>
            <p className="text-xs text-[#4A3B2C] leading-relaxed font-medium">
              All Nalmara Kanchipuram, Banarasi, and Designer sarees are woven to royal full-length specifications:{" "}
              <strong className="text-[#0E0B09]">5.5 Meters</strong> drape length +{" "}
              <strong className="text-[#0E0B09]">0.8 Meters</strong> unstitched matching Zari blouse piece (Total 6.3 Meters, Width 44&quot;–45&quot;).
            </p>
          </div>

          {/* Blouse / Salwar / Kurti Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0E0B09]">
                Stitched Blouse, Salwar & Kurti Measurements (Inches)
              </h4>
              <span className="text-[11px] text-[#8C6518] font-bold">
                2&quot; Interior Margin Included
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-[#D4AF37]/60 bg-[#FFFDF9] shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#0E0B09] via-[#17120D] to-[#0E0B09] text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFE59E] border-b border-[#D4AF37]/50">
                    <th className="py-3.5 px-4">Size</th>
                    <th className="py-3.5 px-4">Bust</th>
                    <th className="py-3.5 px-4">Waist</th>
                    <th className="py-3.5 px-4">Hip</th>
                    <th className="py-3.5 px-4">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/25 text-xs">
                  {BLOUSE_KURTI_SIZES.map((row) => (
                    <tr
                      key={row.size}
                      className="hover:bg-[#FAF3E6]/70 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-[#0E0B09]">
                        {row.size}
                      </td>
                      <td className="py-3 px-4 text-[#4A3B2C] font-medium">
                        {row.bust}
                      </td>
                      <td className="py-3 px-4 text-[#4A3B2C] font-medium">
                        {row.waist}
                      </td>
                      <td className="py-3 px-4 text-[#4A3B2C] font-medium">
                        {row.hip}
                      </td>
                      <td className="py-3 px-4 text-[#4A3B2C] font-medium">
                        {row.shoulder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fitting Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/45">
              <CheckCircle2 className="w-4 h-4 text-[#8C6518] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#4A3B2C] leading-relaxed font-medium">
                <strong className="text-[#0E0B09]">Between Sizes?</strong> We recommend selecting the next size up for effortless movement during ceremonies.
              </p>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/45">
              <CheckCircle2 className="w-4 h-4 text-[#8C6518] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#4A3B2C] leading-relaxed font-medium">
                <strong className="text-[#0E0B09]">Bespoke Tailoring:</strong> Our master tailors contact you on WhatsApp after checkout to confirm custom blouse necklines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
