import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';

export const metadata: Metadata = {
  title: 'ancora. — Wear. Swap. Repeat.',
  description: 'Swap your unworn favorites for verified fits across Milan and Italy with zero cash required.',
  openGraph: {
    title: 'ancora. — Wear. Swap. Repeat.',
    description: 'Exchange unworn pieces for credits, and refresh your wardrobe with verified fits across Milan—without spending a single euro.',
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=85']
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%239c315f'>a.</text></svg>"
        />
      </head>
      <body className="antialiased selection:bg-[var(--fuchsia)] selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
