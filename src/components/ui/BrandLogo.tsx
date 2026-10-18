import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const LotusIcon = ({ className = 'w-6 h-6 text-[#C5A059]' }: { className?: string }) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center tall petal */}
    <path
      d="M60 4 C58 22 52 48 60 70 C68 48 62 22 60 4 Z"
      fill="url(#goldGradLotus)"
    />
    <path
      d="M60 12 C59 26 55 45 60 62 C65 45 61 26 60 12 Z"
      fill="#FFF3C4"
      opacity="0.35"
    />
    {/* Inner left petal */}
    <path
      d="M60 18 C46 26 36 44 44 67 C53 62 57 44 60 18 Z"
      fill="url(#goldGradLotus)"
    />
    {/* Inner right petal */}
    <path
      d="M60 18 C74 26 84 44 76 67 C67 62 63 44 60 18 Z"
      fill="url(#goldGradLotus)"
    />
    {/* Middle left petal */}
    <path
      d="M52 35 C34 42 20 54 26 73 C38 73 47 62 52 52 Z"
      fill="url(#goldGradLotus)"
      opacity="0.95"
    />
    {/* Middle right petal */}
    <path
      d="M68 35 C86 42 100 54 94 73 C82 73 73 62 68 52 Z"
      fill="url(#goldGradLotus)"
      opacity="0.95"
    />
    {/* Outer wings */}
    <path
      d="M38 53 C18 55 6 67 9 78 C24 79 34 71 41 62 Z"
      fill="url(#goldGradLotus)"
      opacity="0.9"
    />
    <path
      d="M82 53 C102 55 114 67 111 78 C96 79 86 71 79 62 Z"
      fill="url(#goldGradLotus)"
      opacity="0.9"
    />
    {/* Base cup */}
    <path
      d="M40 73 C48 78 72 78 80 73 C75 83 45 83 40 73 Z"
      fill="url(#goldGradDarkLotus)"
    />
    <defs>
      <linearGradient id="goldGradLotus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5D77F" />
        <stop offset="40%" stopColor="#D4AF37" />
        <stop offset="85%" stopColor="#B38928" />
        <stop offset="100%" stopColor="#8C6514" />
      </linearGradient>
      <linearGradient id="goldGradDarkLotus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#755010" />
      </linearGradient>
    </defs>
  </svg>
);

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'maroon';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo = ({
  size = 'md',
  theme = 'light',
  className = '',
  showTagline = false,
}: BrandLogoProps) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#4A0E17]';
  const subColor = isDark ? 'text-amber-200/80' : 'text-[#8C6D2D]';

  const sizeConfigs = {
    sm: {
      motif: 'w-4 h-3.5',
      mainText: 'text-sm sm:text-base tracking-[0.18em]',
      subText: 'text-[7px] tracking-[0.28em]',
      gap: 'gap-0.5',
    },
    md: {
      motif: 'w-6 h-5',
      mainText: 'text-lg sm:text-xl lg:text-2xl tracking-[0.2em]',
      subText: 'text-[8px] sm:text-[9px] tracking-[0.32em]',
      gap: 'gap-0.5 sm:gap-1',
    },
    lg: {
      motif: 'w-8 h-6',
      mainText: 'text-2xl sm:text-3xl tracking-[0.22em]',
      subText: 'text-[10px] sm:text-[11px] tracking-[0.36em]',
      gap: 'gap-1',
    },
  };

  const cfg = sizeConfigs[size];

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center select-none group text-center focus:outline-none ${className}`}
      aria-label="NALMARA FASHION Home"
    >
      <div className={`flex flex-col items-center ${cfg.gap}`}>
        <LotusIcon className={`${cfg.motif} transition-transform duration-300 group-hover:scale-110`} />
        <div className="flex flex-col items-center">
          <span
            className={`font-serif font-bold uppercase leading-none ${textColor} ${cfg.mainText} transition-colors`}
          >
            NALMARA
          </span>
          <span
            className={`font-serif font-semibold uppercase leading-none mt-1 ${subColor} ${cfg.subText}`}
          >
            FASHION
          </span>
        </div>
      </div>
      {showTagline && (
        <span className="hidden md:inline-block text-[10px] sm:text-xs text-zinc-500 font-serif italic mt-1.5 tracking-wide text-center max-w-full">
          Traditional Elegance • Timeless Collections • Made with Love
        </span>
      )}
    </Link>
  );
};

