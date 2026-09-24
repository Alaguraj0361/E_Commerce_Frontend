import type { Metadata } from 'next';
import { Jost, Playfair_Display, Alex_Brush } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ToastProvider } from '../components/ui/ToastProvider';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EFFIDOO • Luxury Ethnic Wear & Couture | Tradition Meets You',
  description:
    'Discover handcrafted ethnic wear, designed for your most special moments. From traditional sarees, lehengas, and salwar suits to modern fusion styles, celebrate you with EFFIDOO.',
  keywords: [
    'effidoo',
    'traditional silk saree',
    'bridal lehenga',
    'salwar suit',
    'kurtis',
    'anarkali',
    'ethnic wear',
    'indian bridal couture',
  ],
  openGraph: {
    title: 'EFFIDOO • Tradition Meets You',
    description: 'Impeccably tailored ethnic ensembles designed to celebrate individuality.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${playfair.variable} ${alexBrush.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#FAF8F5] text-zinc-900 selection:bg-amber-100 selection:text-amber-900 dark:bg-zinc-950 dark:text-zinc-50">
        <ToastProvider />
        <Navbar />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
