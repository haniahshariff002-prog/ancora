'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const {
    activeCat,
    setActiveCat,
    searchQuery,
    setSearchQuery,
    bag,
    setIsBagOpen,
    currentUser,
    setIsProfileOpen,
    setIsListItemOpen,
    isAdminOpen,
    setIsAdminOpen,
    setIsChatOpen,
    conversations,
    savedItemIds,
    items
  } = useApp();

  const chiaraListedCount = items.filter(
    (i) => i.lenderId === currentUser.id || i.lenderName.toLowerCase().includes('chiara')
  ).length;

  const categories = [
    { label: 'Discover all', value: 'All' },
    { label: 'Women', value: 'Women' },
    { label: 'Men', value: 'Men' },
    { label: 'Kids', value: 'Children' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Books', value: 'Books' },
    { label: 'Home', value: 'Household' }
  ];

  const navLinks = [
    { href: '/', label: 'Explore', badge: null },
    { href: '/closet', label: "Chiara's Closet", badge: chiaraListedCount },
    { href: '/community', label: 'Community', badge: null },
    { href: '/coordination', label: 'Interested & Chat', badge: savedItemIds.length }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[var(--fuchsia)] text-white text-center py-2 px-4 text-[11px] tracking-[0.14em] uppercase font-medium flex justify-between items-center">
        <span className="hidden md:inline text-[10px] tracking-widest text-[#f5e9e9]/80">MILAN-BORN FASHION EXCHANGE</span>
        <span className="mx-auto">Your next favorite fit is already out there. ♡</span>
        <button
          onClick={() => setIsAdminOpen(!isAdminOpen)}
          className="text-[10px] tracking-wider uppercase underline hover:text-[#f5e9e9] transition-colors"
        >
          {isAdminOpen ? '← Exit Admin' : 'Admin Portal ⚙'}
        </button>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#e2ebd9]/95 backdrop-blur-md border-b border-[#c21870]/20">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-7 px-[5%] py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="font-serif text-3xl md:text-5xl font-bold tracking-[-0.06em] text-[var(--fuchsia)] flex items-center">
            ancora<span className="text-[#c98da7]">.</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[420px] relative hidden lg:block">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 stroke-[var(--fuchsia)] fill-none stroke-2 pointer-events-none"
              viewBox="0 0 24 24"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ fits, blazers, denim, silk..."
              className="w-full bg-white border border-[#c8d5c4] rounded-full py-2 pl-11 pr-4 text-xs md:text-sm text-[var(--deep)] outline-none transition focus:ring-2 focus:ring-[#c98da7]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--ink)] hover:text-[var(--fuchsia)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 md:gap-3 text-xs font-bold">
            {/* List Item CTA */}
            <button
              onClick={() => setIsListItemOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 border border-[var(--fuchsia)] text-[var(--fuchsia)] hover:bg-[var(--fuchsia)] hover:text-white px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition"
            >
              <span>+</span> List Piece
            </button>

            {/* User Profile / Credit Capsule */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 bg-[#f5e9e9] border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1.5 rounded-full transition shadow-sm"
              title="Open User Profile & Credits"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-[var(--fuchsia)]"
              />
              <span className="hidden md:inline font-sans text-xs text-[var(--deep)] font-medium">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="bg-[var(--fuchsia)] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {currentUser.credits} cr
              </span>
            </button>

            {/* Swap Chat Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative bg-white hover:bg-[#f0f5ed] border border-[#c8d5c4] text-[var(--deep)] px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5"
              title="Open Swap Meetup & Courier Chat"
            >
              <span>💬</span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Chat</span>
              {conversations.length > 0 && (
                <span className="bg-[var(--fuchsia)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {conversations.length}
                </span>
              )}
            </button>

            {/* Swap Bag (Cart) Button */}
            <button
              onClick={() => setIsBagOpen(true)}
              className="relative bg-[var(--fuchsia)] text-white border border-[var(--fuchsia)] hover:bg-[var(--deep)] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase transition flex items-center gap-1.5"
            >
              <span>Bag</span>
              {bag.length > 0 && (
                <span className="bg-white text-[var(--fuchsia)] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {bag.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Streamlined Page Navigation Tabs */}
        <div className="border-t border-[#c21870]/15 bg-[#dbe6d1]/50 px-[5%] py-2">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--fuchsia)] text-white font-bold shadow-xs'
                        : 'text-[var(--deep)] hover:bg-white/70 font-medium'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge !== null && link.badge > 0 && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white text-[var(--fuchsia)]' : 'bg-[var(--fuchsia)] text-white'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Category pills shortcut when on home page */}
            {pathname === '/' && (
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <span className="text-[10px] uppercase tracking-widest text-[var(--ink)]/70">Category:</span>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setActiveCat(c.value);
                      const el = document.getElementById('explore');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`text-[10px] uppercase px-2 py-0.5 rounded-full transition ${
                      activeCat === c.value
                        ? 'bg-[var(--deep)] text-white font-bold'
                        : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
