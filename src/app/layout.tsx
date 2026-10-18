import type { Metadata } from 'next';
import { Jost, Playfair_Display, Alex_Brush } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ToastProvider } from '../components/ui/ToastProvider';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';
import { BottomNav } from '../components/layout/BottomNav';

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
  title: 'NALMARA FASHION • Tradition Woven in Elegance | Luxury Sarees & Ethnic Couture',
  description:
    'Discover beautiful sarees and timeless ethnic styles for every special moment. Curated collections of Kanchivaram silks, cotton sarees, festive wear, and bespoke party ensembles.',
  keywords: [
    'nalmara fashion',
    'sarees',
    'kanchivaram silk saree',
    'semi kanchivaram',
    'cotton sarees',
    'festive collection',
    'party wear saree',
    'kidswear ethnic',
  ],
  openGraph: {
    title: 'NALMARA FASHION • Tradition Woven in Elegance',
    description: 'Discover beautiful sarees and timeless ethnic styles for every special moment.',
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
      <body className="font-sans min-h-screen flex flex-col bg-[#FAF7F2] text-zinc-900 selection:bg-[#4A0E17] selection:text-white w-full max-w-full overflow-x-hidden relative">
        <ToastProvider />
        <Navbar />
        <CartDrawer />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        <WhatsAppButton />
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}

