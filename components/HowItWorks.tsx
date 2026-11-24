'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function HowItWorks() {
  const { setIsListItemOpen } = useApp();

  return (
    <section className="bg-[linear-gradient(110deg,#e3eddf,#f0f5ed_60%,#f5e9e9)] py-16 md:py-24 px-[5%]" id="how-it-works">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Editorial Photo */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1100&auto=format&fit=crop&q=85"
            alt="Fashionable friends browsing clothing together in Milan"
            loading="lazy"
            className="w-full h-[380px] md:h-[570px] object-cover rounded-2xl shadow-lg border border-[#c8d5c4]"
          />
        </div>

        {/* Editorial Content */}
        <div>
          <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-[var(--fuchsia)]">
            Fashion, with a second life
          </div>

          <h2 className="font-serif font-medium tracking-[-0.045em] leading-[0.91] text-[clamp(48px,6vw,95px)] my-4 md:my-6 text-[var(--fuchsia)]">
            Out with the old.<br />
            <em className="font-normal italic">In with the you.</em>
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-[var(--ink)] max-w-[480px]">
            Your unworn clothes could be someone else&apos;s favorite. Exchange pieces, collect credits, and refresh your wardrobe without refreshing your spending habits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="border-t border-[#c8d5c4] pt-4">
              <span className="font-serif text-4xl md:text-5xl font-medium text-[var(--deep)] block">01</span>
              <h3 className="font-serif text-2xl font-bold text-[var(--fuchsia)] mt-2 mb-1">List it.</h3>
              <p className="text-xs text-[var(--ink)] leading-relaxed">
                Give your unworn pieces a new chance with instant credit estimates.
              </p>
            </div>

            <div className="border-t border-[#c8d5c4] pt-4">
              <span className="font-serif text-4xl md:text-5xl font-medium text-[var(--deep)] block">02</span>
              <h3 className="font-serif text-2xl font-bold text-[var(--fuchsia)] mt-2 mb-1">Earn it.</h3>
              <p className="text-xs text-[var(--ink)] leading-relaxed">
                Get credits when someone claims your pieces. No price haggling.
              </p>
            </div>

            <div className="border-t border-[#c8d5c4] pt-4">
              <span className="font-serif text-4xl md:text-5xl font-medium text-[var(--deep)] block">03</span>
              <h3 className="font-serif text-2xl font-bold text-[var(--fuchsia)] mt-2 mb-1">Love it.</h3>
              <p className="text-xs text-[var(--ink)] leading-relaxed">
                Use your credits to discover your next fit across Italy completely cash-free.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsListItemOpen(true)}
              className="inline-flex items-center justify-center bg-[var(--fuchsia)] text-white rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[var(--deep)]"
            >
              Start Swapping Now (+10 cr)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
