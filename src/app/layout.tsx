import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'EFFIDOO • Sculpted Couture & Atelier | Contemporary Ethnic Elegance',
  description:
    'Explore handcrafted Lehengas, pure zari Half Sarees, breathable Maxi Cotton gowns, and festive couture. Custom tailoring, bespoke heights, and worldwide shipping.',
  keywords: [
    'sculpted couture',
    'lehenga half saree',
    'pure silk sarees',
    'maxi cotton dress',
    'ethnic wear',
    'indian bridal couture',
  ],
  openGraph: {
    title: 'EFFIDOO • Sculpted Couture & Atelier',
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
    <html lang="en" className={jost.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-amber-100 selection:text-amber-900 dark:bg-zinc-950 dark:text-zinc-50">
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
