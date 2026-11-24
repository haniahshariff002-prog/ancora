'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SwapBagDrawer from '../components/SwapBagDrawer';
import ProfileModal from '../components/ProfileModal';
import ListItemModal from '../components/ListItemModal';
import AdminDashboard from '../components/AdminDashboard';
import SwapChatModal from '../components/SwapChatModal';
import HowItWorks from '../components/HowItWorks';
import WaitlistSection from '../components/WaitlistSection';
import Footer from '../components/Footer';

export default function Home() {
  const { items, activeCat, searchQuery, setActiveCat, setSearchQuery } = useApp();

  // Filter items dynamically
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCat === 'All' || item.category === activeCat;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.subCategory.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <main id="top" className="min-h-screen bg-[var(--sage)] text-[var(--fuchsia)] font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Marquee Ticker */}
      <div className="bg-[var(--pink)] py-3 px-4 text-center text-xs tracking-[0.16em] uppercase flex justify-center gap-6 md:gap-10 flex-wrap text-[var(--fuchsia)] font-medium border-y border-[#c8d5c4]/50">
        <span>✳ Your closet has currency</span>
        <span>♡ New fits, same bank balance</span>
        <span>✳ Swap, don&apos;t shop</span>
        <span className="hidden sm:inline">♡ 100+ Verified Milan Wardrobes</span>
      </div>

      {/* Explore Collection (100+ Items) */}
      <section className="py-16 md:py-20 px-[5%] max-w-[1440px] mx-auto" id="explore">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-[var(--fuchsia)]">
              The wardrobe edit
            </div>
            <h2 className="font-serif font-medium tracking-[-0.045em] leading-[0.91] text-[clamp(44px,6vw,90px)] my-2 text-[var(--fuchsia)]">
              Find your next <em className="font-normal italic">obsession.</em>
            </h2>
          </div>

          <div className="text-right">
            <span className="bg-white/80 border border-[#c8d5c4] text-[var(--deep)] text-xs font-bold px-3 py-1.5 rounded-full inline-block">
              Showing {filteredItems.length} of {items.length} pieces
            </span>
            <p className="text-xs text-[var(--ink)] mt-1.5 max-w-[280px]">
              {activeCat === 'All' ? 'All categories' : activeCat} {searchQuery ? `· Matching "${searchQuery}"` : ''}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white/50 rounded-2xl border border-[#c8d5c4] my-6 p-6">
            <h3 className="font-serif text-2xl font-bold text-[var(--deep)] mb-2">
              No pieces match your search.
            </h3>
            <p className="text-xs text-[var(--ink)] mb-4">
              Try searching for &quot;blazer&quot;, &quot;silk&quot;, &quot;jacket&quot;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setActiveCat('All');
                setSearchQuery('');
              }}
              className="bg-[var(--fuchsia)] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[var(--deep)] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Disclaimer Footnote */}
        <p className="text-[11px] text-[var(--ink)] text-center mt-10">
          *Estimated credit valuation based on piece category, brand provenance, and condition. 1 credit = 1 swap unit within the Ancora network.
        </p>
      </section>

      {/* How it Works Section */}
      <HowItWorks />

      {/* Waitlist Early Access Section */}
      <WaitlistSection />

      {/* Footer */}
      <Footer />

      {/* Global Interactive Overlays */}
      <ProductModal />
      <SwapBagDrawer />
      <ProfileModal />
      <ListItemModal />
      <AdminDashboard />
      <SwapChatModal />
    </main>
  );
}
