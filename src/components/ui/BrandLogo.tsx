import React from 'react';
import Link from 'next/link';

export const LotusIcon = ({ className = 'w-9 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center petal */}
    <path d="M50 6 C48 22 43 45 50 62 C57 45 52 22 50 6 Z" fill="url(#lotusGold)" />
    {/* Inner left petal */}
    <path d="M50 18 C39 25 30 42 37 60 C43 55 48 38 50 18 Z" fill="url(#lotusGold)" opacity="0.95" />
    {/* Inner right petal */}
    <path d="M50 18 C61 25 70 42 63 60 C57 55 52 38 50 18 Z" fill="url(#lotusGold)" opacity="0.95" />
    {/* Outer left petal */}
    <path d="M43 32 C28 39 16 50 20 65 C30 66 38 56 43 46 Z" fill="url(#lotusGold)" opacity="0.9" />
    {/* Outer right petal */}
    <path d="M57 32 C72 39 84 50 80 65 C70 66 62 56 57 46 Z" fill="url(#lotusGold)" opacity="0.9" />
    {/* Far left wing */}
    <path d="M33 48 C16 51 6 62 8 70 C20 71 29 64 35 56 Z" fill="url(#lotusGold)" opacity="0.85" />
    {/* Far right wing */}
    <path d="M67 48 C84 51 94 62 92 70 C80 71 71 64 65 56 Z" fill="url(#lotusGold)" opacity="0.85" />
    {/* Base petal cup */}
    <path d="M35 66 C42 71 58 71 65 66 C60 74 40 74 35 66 Z" fill="url(#lotusGold)" />
    <defs>
      <linearGradient id="lotusGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="45%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
    </defs>
  </svg>
);

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export const BrandLogo = ({ size = 'md', theme = 'dark' }: BrandLogoProps) => {
  const iconSizes = {
    sm: 'w-7 h-6',
    md: 'w-9 h-8',
    lg: 'w-12 h-10',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.18em]',
    md: 'text-xl tracking-[0.22em]',
    lg: 'text-2xl tracking-[0.26em]',
  };

  const subtitleSizes = {
    sm: 'text-[6.5px] tracking-[0.22em]',
    md: 'text-[8px] tracking-[0.26em]',
    lg: 'text-[9.5px] tracking-[0.3em]',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      <LotusIcon className={`${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`} />
      <div className="flex flex-col text-left">
        <span
          className={`font-serif font-bold uppercase transition-colors ${
            titleSizes[size]
          } ${
            theme === 'dark'
              ? 'text-white group-hover:text-[#E5C07B]'
              : 'text-[#061811] group-hover:text-[#D4AF37]'
          }`}
          style={{ letterSpacing: '0.18em' }}
        >
          EFFIDOO
        </span>
        <span
          className={`font-sans font-medium uppercase -mt-0.5 ${
            subtitleSizes[size]
          } ${
            theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#8B6508]'
          }`}
          style={{ letterSpacing: '0.24em' }}
        >
          TRADITION MEETS YOU
        </span>
      </div>
    </Link>
  );
};
