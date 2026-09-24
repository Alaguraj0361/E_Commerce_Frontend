'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '919361923406';
  const message = encodeURIComponent(
    'Hi Sculpted by Effidoo team! I would like to inquire about express shipping, sizing, and custom orders.'
  );

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip prompt */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800">
        Chat with Stylist on WhatsApp ✨
      </span>

      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 animate-bounce-subtle"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </aside>
  );
};
