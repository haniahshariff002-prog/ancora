'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import ProductModal from '../../components/ProductModal';
import SwapBagDrawer from '../../components/SwapBagDrawer';
import ProfileModal from '../../components/ProfileModal';
import ListItemModal from '../../components/ListItemModal';
import AdminDashboard from '../../components/AdminDashboard';
import SwapChatModal from '../../components/SwapChatModal';
import Footer from '../../components/Footer';

export default function ChiaraClosetPage() {
  const {
    currentUser,
    items,
    setSelectedItem,
    setIsListItemOpen,
    openChatForSwap,
    adminUpdateItemStatus
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'swapped'>('all');

  // Filter items belonging to Chiara (or currently active user)
  const chiaraItems = items.filter(
    (item) => item.lenderId === currentUser.id || item.lenderName.toLowerCase().includes('chiara')
  );

  const availableItems = chiaraItems.filter((item) => item.status === 'available');
  const swappedItems = chiaraItems.filter((item) => item.status === 'swapped');

  const displayedItems = chiaraItems.filter((item) => {
    if (statusFilter === 'available') return item.status === 'available';
    if (statusFilter === 'swapped') return item.status === 'swapped';
    return true;
  });

  const totalCreditsPotential = chiaraItems.reduce((acc, curr) => acc + curr.credits, 0);

  return (
    <main className="min-h-screen bg-[var(--sage)] text-[var(--fuchsia)] font-sans">
      <Navbar />

      {/* Hero / Profile Banner */}
      <section className="bg-gradient-to-b from-[#f5e9e9]/90 to-[var(--sage)] border-b border-[#c8d5c4]/60 pt-10 pb-12 px-[5%]">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink)] mb-6">
            <Link href="/" className="hover:underline hover:text-[var(--fuchsia)]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--fuchsia)] font-bold">Chiara&apos;s Closet</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* User Identity */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow">
                  Active
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[var(--fuchsia)]">
                    {currentUser.name}
                  </h1>
                  <span className="bg-[var(--deep)] text-white text-[10px] tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full">
                    Verified Lender
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[var(--ink)] mt-1">
                  {currentUser.handle} · {currentUser.location} · {currentUser.rating} ★ ({currentUser.swapsCompleted} swaps completed)
                </p>
                <p className="text-xs text-[var(--ink)]/80 mt-2 max-w-lg italic">
                  &ldquo;{currentUser.bio}&rdquo;
                </p>
              </div>
            </div>

            {/* Wardrobe Quick Stats */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#c8d5c4] shadow-sm">
              <div className="text-center px-3 border-r border-[#c8d5c4]">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                  {chiaraItems.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Total Listed
                </span>
              </div>

              <div className="text-center px-3 border-r border-[#c8d5c4]">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-emerald-700">
                  {availableItems.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Available Fits
                </span>
              </div>

              <div className="text-center px-3 border-r border-[#c8d5c4]">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-[var(--fuchsia)]">
                  {swappedItems.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Re-Homed
                </span>
              </div>

              <div className="text-center px-3">
                <span className="block font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                  {currentUser.credits} <span className="text-xs font-sans font-bold">CR</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Your Balance
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsListItemOpen(true)}
                className="w-full sm:w-auto mt-2 sm:mt-0 bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>+</span> List New Fit (+10 CR)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Wardrobe Management & Inventory */}
      <section className="py-12 px-[5%] max-w-[1440px] mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-[#c8d5c4]/60">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--fuchsia)]">
              Wardrobe Portfolio
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--deep)]">
              Chiara&apos;s Listed Pieces ({displayedItems.length})
            </h2>
            <p className="text-xs text-[var(--ink)] mt-1">
              Pieces you have offered for swap to Milan fashion enthusiasts. Potential yield: {totalCreditsPotential} credits.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-full border border-[#c8d5c4] shadow-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                  : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
              }`}
            >
              All ({chiaraItems.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition ${
                statusFilter === 'available'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
              }`}
            >
              Available ({availableItems.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('swapped')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition ${
                statusFilter === 'swapped'
                  ? 'bg-[var(--deep)] text-white shadow-xs'
                  : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
              }`}
            >
              Swapped ({swappedItems.length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {displayedItems.length === 0 ? (
          <div className="bg-white/60 border border-dashed border-[#c8d5c4] rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[var(--pink)] text-[var(--fuchsia)] flex items-center justify-center text-2xl mx-auto mb-4 font-serif">
              ✦
            </div>
            <h3 className="font-serif text-2xl font-bold text-[var(--deep)] mb-2">
              No garments found in this view
            </h3>
            <p className="text-xs text-[var(--ink)] mb-6 leading-relaxed">
              Upload unworn coats, silk blouses, accessories, or footwear from your wardrobe to earn instant credits and swap them with members across Milan.
            </p>
            <button
              type="button"
              onClick={() => setIsListItemOpen(true)}
              className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
            >
              + Upload a Piece Now
            </button>
          </div>
        ) : (
          /* Grid of Chiara's Pieces */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedItems.map((item) => {
              const isSwapped = item.status === 'swapped';
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#c8d5c4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[3/4] bg-[var(--pink)] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        isSwapped ? 'grayscale opacity-75' : ''
                      }`}
                    />

                    {/* Category & Brand Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      <span className="bg-white/95 backdrop-blur-sm text-[var(--fuchsia)] font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {item.category}
                      </span>
                      {item.brand && (
                        <span className="bg-[var(--deep)] text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
                          {item.brand}
                        </span>
                      )}
                    </div>

                    {/* Status Ribbon */}
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                          isSwapped
                            ? 'bg-[var(--deep)] text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isSwapped ? 'Swapped' : 'Available'}
                      </span>
                    </div>

                    {/* Size and Condition */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full">
                        {item.condition} · {item.size}
                      </span>
                    </div>

                    {/* Credit Value Capsule */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[var(--deep)] font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
                      {item.credits} CR
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-bold text-sm text-[var(--deep)] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-[var(--ink)] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-2 text-[10px] text-[var(--ink)]/80 flex items-center justify-between">
                        <span>Original: €{item.originalPrice}</span>
                        <span>Resale: €{item.resaleValue}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-[#c8d5c4]/60 mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-[#f5e9e9] hover:bg-[#ebdada] text-[var(--deep)] text-xs font-bold py-2 rounded-full transition text-center"
                      >
                        View Piece
                      </button>

                      {/* Inbox swap coordination button */}
                      <Link
                        href="/inbox"
                        onClick={() => openChatForSwap(item)}
                        title="Open swap coordination in Inbox"
                        className="bg-white hover:bg-[var(--pink)] border border-[#c8d5c4] text-[var(--deep)] px-3 py-2 rounded-full text-xs font-bold transition flex items-center gap-1"
                      >
                        <span>📬</span>
                      </Link>

                      {/* Toggle status */}
                      <button
                        type="button"
                        onClick={() =>
                          adminUpdateItemStatus(item.id, isSwapped ? 'available' : 'swapped')
                        }
                        title={isSwapped ? 'Mark as available' : 'Mark as swapped'}
                        className={`text-[10px] font-bold px-2.5 py-2 rounded-full border transition ${
                          isSwapped
                            ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                            : 'border-[#c8d5c4] text-[var(--ink)] hover:bg-gray-100'
                        }`}
                      >
                        {isSwapped ? 'Relist' : 'Mark Swapped'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Global Modals */}
      <ProductModal />
      <SwapBagDrawer />
      <ProfileModal />
      <ListItemModal />
      <AdminDashboard />
      <SwapChatModal />

      <Footer />
    </main>
  );
}
