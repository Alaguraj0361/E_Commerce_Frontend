import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function getDiscountPercentage(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function truncateText(text: string, length: number = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getGuestId(): string {
  if (typeof window === 'undefined') return 'guest-session';
  let guestId = localStorage.getItem('ecommerce_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('ecommerce_guest_id', guestId);
  }
  return guestId;
}
