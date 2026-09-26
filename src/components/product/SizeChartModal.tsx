'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'necklines' | 'guide'>('chart');
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const sizeData = [
    { size: 'XXXS', bust: 28, waist: 22, hip: 32, armhole: 13, length: 52 },
    { size: 'XXS', bust: 30, waist: 24, hip: 34, armhole: 13.5, length: 53 },
    { size: 'XS', bust: 32, waist: 26, hip: 36, armhole: 14, length: 54 },
    { size: 'S', bust: 34, waist: 28, hip: 38, armhole: 15, length: 54 },
    { size: 'M', bust: 36, waist: 30, hip: 40, armhole: 16, length: 55 },
    { size: 'L', bust: 38, waist: 32, hip: 42, armhole: 17, length: 55 },
    { size: 'XL', bust: 40, waist: 34, hip: 44, armhole: 18, length: 56 },
    { size: '2XL', bust: 42, waist: 36, hip: 46, armhole: 19, length: 56 },
    { size: '3XL', bust: 44, waist: 38, hip: 48, armhole: 20, length: 56 },
    { size: '4XL', bust: 46, waist: 40, hip: 50, armhole: 21, length: 56 },
    { size: '5XL', bust: 48, waist: 42, hip: 52, armhole: 22, length: 56 },
  ];

  const necklines = [
    {
      name: 'Sweet Heart',
      desc: 'Romance-inspired sweetheart curve accentuating collarbones and necklace sets.',
      tag: 'Most Popular',
    },
    {
      name: 'Round Square',
      desc: 'Modern blend of classic round curve with soft structured square shoulders.',
      tag: 'Classic',
    },
    {
      name: 'U-Round',
      desc: 'Graceful deep U curve flattering traditional ethnic drapes and sarees.',
      tag: 'Traditional',
    },
    {
      name: 'Boat Neck',
      desc: 'Wide, modest bateau line drawing attention to delicate ear jewelry and shoulder posture.',
      tag: 'Regal',
    },
    {
      name: 'Square Neck',
      desc: 'Sharp, architectural square cutout for contemporary festive and party styling.',
      tag: 'Contemporary',
    },
  ];

  const formatVal = (inchesVal: number) => {
    if (unit === 'inches') return `${inchesVal}"`;
    return `${Math.round(inchesVal * 2.54)} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Size & Tailoring Guide
              </h3>
              <p className="text-xs text-zinc-500">
                EFFIDOO Couture • Standard Sizes & Custom Tailoring Options
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('chart')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'chart'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Standard Size Chart
              {activeTab === 'chart' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('necklines')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'necklines'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Neckline Guide
              {activeTab === 'necklines' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'guide'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              How to Measure
              {activeTab === 'guide' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'chart' && (
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 text-xs font-semibold mb-2">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'inches'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-all ${
                  unit === 'cm'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                CM
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-bold uppercase border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Bust / Chest</th>
                      <th className="py-3 px-4">Waist</th>
                      <th className="py-3 px-4">Hips</th>
                      <th className="py-3 px-4">Armhole</th>
                      <th className="py-3 px-4">Outfit Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium text-zinc-800 dark:text-zinc-200">
                    {sizeData.map((row) => (
                      <tr
                        key={row.size}
                        className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                          {row.size}
                        </td>
                        <td className="py-3 px-4">{formatVal(row.bust)}</td>
                        <td className="py-3 px-4">{formatVal(row.waist)}</td>
                        <td className="py-3 px-4">{formatVal(row.hip)}</td>
                        <td className="py-3 px-4">{formatVal(row.armhole)}</td>
                        <td className="py-3 px-4">{formatVal(row.length)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-zinc-500 italic">
                * Note: All our outfits include a 2-inch inner margin for easy home alteration. Need a custom fit? Select &ldquo;Custom&rdquo; size on the product page and enter your exact measurements.
              </p>
            </div>
          )}

          {activeTab === 'necklines' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {necklines.map((neck) => (
                <div
                  key={neck.name}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2 hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {neck.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full">
                      {neck.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {neck.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold">✨ Pro Measuring Tip:</p>
                <p>
                  Always keep the measuring tape comfortably snug, not tight. Measure wearing the same innerwear you plan to style with the outfit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 1. Bust / Chest
                  </span>
                  <p>Measure horizontally around the fullest part of your bust.</p>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 2. Waist
                  </span>
                  <p>Measure around your natural waistline, usually 1 inch above the navel.</p>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 3. Hips
                  </span>
                  <p>Stand with feet together and measure around the fullest curve of your hips.</p>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> 4. Outfit Length
                  </span>
                  <p>Measure vertically from the highest point of your shoulder down to your desired hem.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Need personal sizing advice?</span>
          <a
            href="https://wa.me/917871207631?text=Hi%2C%20I%20need%20help%20with%20sizing%20and%20measurements"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-600 hover:text-emerald-500 underline"
          >
            Chat with Stylist on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
