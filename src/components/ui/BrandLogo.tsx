import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const LotusIcon = ({ className = 'w-10 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Center tall petal */}
    <path
      d="M60 4 C58 22 52 48 60 70 C68 48 62 22 60 4 Z"
      fill="url(#goldGradient)"
    />
    <path
      d="M60 12 C59 26 55 45 60 62 C65 45 61 26 60 12 Z"
      fill="#FFF3C4"
      opacity="0.3"
    />

    {/* Inner left petal */}
    <path
      d="M60 18 C46 26 36 44 44 67 C53 62 57 44 60 18 Z"
      fill="url(#goldGradient)"
    />
    {/* Inner right petal */}
    <path
      d="M60 18 C74 26 84 44 76 67 C67 62 63 44 60 18 Z"
      fill="url(#goldGradient)"
    />

    {/* Middle left petal */}
    <path
      d="M52 35 C34 42 20 54 26 73 C38 73 47 62 52 52 Z"
      fill="url(#goldGradient)"
      opacity="0.95"
    />
    {/* Middle right petal */}
    <path
      d="M68 35 C86 42 100 54 94 73 C82 73 73 62 68 52 Z"
      fill="url(#goldGradient)"
      opacity="0.95"
    />

    {/* Outer far left wing */}
    <path
      d="M38 53 C18 55 6 67 9 78 C24 79 34 71 41 62 Z"
      fill="url(#goldGradient)"
      opacity="0.88"
    />
    {/* Outer far right wing */}
    <path
      d="M82 53 C102 55 114 67 111 78 C96 79 86 71 79 62 Z"
      fill="url(#goldGradient)"
      opacity="0.88"
    />

    {/* Base pod / stem cup */}
    <path
      d="M40 73 C48 78 72 78 80 73 C75 83 45 83 40 73 Z"
      fill="url(#goldGradientDark)"
    />

    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="35%" stopColor="#E5C07B" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#9E782F" />
      </linearGradient>
      <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7A5618" />
      </linearGradient>
    </defs>
  </svg>
);

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
}

export const BrandLogo = ({
  size = 'md',
  theme = 'dark',
  className = '',
  priority = false,
}: BrandLogoProps) => {
  // Height configurations optimized for mobile, tablet, and desktop:
  // sm: mobile drawer / compact header (height: 28px - 34px)
  // md: main navbar header (mobile: 32px-36px, tablet: 40px, desktop: 46px)
  // lg: footer / hero (mobile: 42px, desktop: 52px)
  const sizeClasses = {
    sm: 'h-7 sm:h-8 w-auto max-h-[34px]',
    md: 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[155px] sm:max-w-[185px] md:max-w-none',
    lg: 'h-10 sm:h-12 md:h-13 w-auto',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none focus:outline-none ${className}`}
      aria-label="NALMARA FASHION Home"
    >
      <Image
        src="/images/nalmara_gold_logo.png"
        alt="NALMARA FASHION"
        width={350}
        height={102}
        priority={priority || size === 'md'}
        className={`${sizeClasses[size]} object-contain object-left transition-transform duration-300 group-hover:scale-105 ${
          theme === 'light' ? 'brightness-0' : ''
        }`}
      />
    </Link>
  );
};
