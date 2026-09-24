import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ToastProvider } from '../components/ui/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EFFIDOO | Modern Luxury Ecommerce & Curated Living',
  description:
    'Discover impeccably crafted apparel, audiophile acoustics, full-grain leather goods, and architectural home artifacts designed for everyday living.',
  keywords: ['luxury ecommerce', 'menswear', 'womenswear', 'electronics', 'minimalist style'],
  openGraph: {
    title: 'EFFIDOO | Modern Luxury Ecommerce',
    description: 'Impeccably crafted essentials for everyday living.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:text-zinc-50">
        <ToastProvider />
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
