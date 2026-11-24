'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function ProductModal() {
  const { selectedItem, setSelectedItem, addToBag, bag, currentUser, reviews, openChatForSwap, isItemSaved, toggleSaveItem } = useApp();

  if (!selectedItem) return null;

  const isInBag = bag.some((b) => b.id === selectedItem.id);
  const isSwapped = selectedItem.status === 'swapped';
  const lenderReviews = reviews[selectedItem.lenderId] || [];
  const isSaved = isItemSaved(selectedItem.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedItem(null)}
    >
      <div
        className="relative bg-[var(--sage)] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#c8d5c4] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSaveItem(selectedItem.id)}
            title={isSaved ? 'Remove from saved' : 'Save for coordination'}
            className="bg-white/90 hover:bg-white text-[var(--deep)] w-8 h-8 rounded-full flex items-center justify-center shadow-md transition"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'text-[var(--fuchsia)] fill-[var(--fuchsia)]' : 'text-[var(--ink)] fill-transparent'
              }`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => setSelectedItem(null)}
            className="bg-white/90 hover:bg-white text-[var(--deep)] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image */}
          <div className="relative bg-[var(--pink)] min-h-[350px] md:min-h-full">
            <img
              src={selectedItem.img}
              alt={selectedItem.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-white/95 text-[var(--fuchsia)] font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                {selectedItem.category} · {selectedItem.subCategory}
              </span>
              <span className="bg-[var(--deep)] text-white text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-full">
                {selectedItem.brand}
              </span>
            </div>
            {isSwapped && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-[var(--deep)] text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                  Currently Swapped
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Details & Lender Profile */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex justify-between items-baseline gap-4 mb-2">
                <span className="text-xs uppercase tracking-widest text-[var(--ink)] font-bold">
                  {selectedItem.condition}
                </span>
                <span className="font-serif text-2xl font-bold text-[var(--deep)]">
                  {selectedItem.credits} credits
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--fuchsia)] leading-tight mb-3">
                {selectedItem.name}
              </h2>

              <p className="text-xs md:text-sm text-[var(--ink)] leading-relaxed mb-5">
                {selectedItem.description}
              </p>

              {/* Garment Specifications */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white/70 rounded-xl p-3 mb-6 border border-[#c8d5c4]">
                <div>
                  <span className="text-[10px] uppercase text-[var(--ink)]/70 block">Size / Fit</span>
                  <span className="font-bold text-[var(--deep)]">{selectedItem.size}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--ink)]/70 block">Origin</span>
                  <span className="font-bold text-[var(--deep)]">{selectedItem.lenderLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--ink)]/70 block">Cleanliness</span>
                  <span className="font-bold text-[var(--deep)]">Sanitized / Dry-Cleaned</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[var(--ink)]/70 block">Handoff</span>
                  <span className="font-bold text-[var(--deep)]">Locker or Courier</span>
                </div>
              </div>

              {/* Lender Card */}
              <div className="border-t border-[#c8d5c4] pt-4 mb-5">
                <div className="text-[10px] uppercase tracking-widest text-[var(--ink)] font-bold mb-2">
                  Lender Profile
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.lenderAvatar}
                    alt={selectedItem.lenderName}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--fuchsia)]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--deep)]">
                      {selectedItem.lenderName}
                    </h4>
                    <p className="text-[11px] text-[var(--ink)]">
                      {selectedItem.lenderLocation} · {selectedItem.lenderRating} ★ Verified Swapper
                    </p>
                  </div>
                </div>

                {/* Reviews excerpt */}
                {lenderReviews.length > 0 && (
                  <div className="mt-3 bg-[#f5e9e9]/60 rounded-lg p-2.5 text-[11px] text-[var(--ink)] italic border border-[#c8d5c4]/50">
                    &ldquo;{lenderReviews[0].comment}&rdquo;
                    <span className="block not-italic font-bold text-[10px] text-[var(--deep)] mt-1">
                      — {lenderReviews[0].reviewerName} ({lenderReviews[0].rating} ★)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#c8d5c4]">
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-[var(--ink)]">Your Credit Balance:</span>
                <span className="font-bold text-[var(--fuchsia)]">
                  {currentUser.credits} cr
                </span>
              </div>

              {!isSwapped ? (
                <div className="flex gap-2.5">
                  <Link
                    href="/inbox"
                    onClick={() => {
                      openChatForSwap(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="bg-white hover:bg-[#f0f5ed] border border-[#c8d5c4] text-[var(--deep)] px-4 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-xs whitespace-nowrap flex items-center gap-1.5"
                    title="Coordinate meetup or ask about fit in Inbox"
                  >
                    <span>📬</span> Inbox
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      addToBag(selectedItem);
                      setSelectedItem(null);
                    }}
                    className={`flex-1 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-md ${
                      isInBag
                        ? 'bg-white text-[var(--fuchsia)] border border-[var(--fuchsia)]'
                        : 'bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white'
                    }`}
                  >
                    {isInBag ? 'In Bag ✓' : `Add to Swap Bag (${selectedItem.credits} cr)`}
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest cursor-not-allowed"
                >
                  Piece Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
