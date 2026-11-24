'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function Hero() {
  const { setIsListItemOpen } = useApp();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_0%_40%,#f5e9e9_0%,transparent_23%),radial-gradient(ellipse_at_100%_55%,#f5e9e9_0%,transparent_22%),var(--sage)] py-12 md:py-20 px-[5%]">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center">
        {/* Left Column Text */}
        <div>
          <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-[var(--fuchsia)]">
            Milan-born style exchange · live beta
          </div>

          <h1 className="font-serif font-medium tracking-[-0.045em] leading-[0.91] text-[clamp(65px,9.5vw,140px)] my-5 md:my-7 text-[var(--fuchsia)]">
            Wear. Swap.<br />
            <em className="font-normal italic">Repeat.</em>
          </h1>

          <p className="max-w-[420px] text-sm md:text-base leading-[1.75] text-[var(--ink)] font-normal">
            Your rent is expensive enough. Your style doesn&apos;t have to be. Turn unworn closet favorites into credits for verified luxury and contemporary fits across Italy.
          </p>

          <div className="flex gap-3 items-center flex-wrap mt-8">
            <a
              href="#explore"
              className="inline-flex items-center justify-center bg-[var(--fuchsia)] text-white border border-[var(--fuchsia)] rounded-full px-6 py-3.5 text-[11px] font-bold tracking-[0.12em] uppercase transition hover:bg-[var(--deep)] hover:-translate-y-0.5"
            >
              Explore 100+ Pieces
            </a>
            <button
              onClick={() => setIsListItemOpen(true)}
              className="inline-flex items-center justify-center bg-transparent text-[var(--fuchsia)] border border-[var(--fuchsia)] rounded-full px-6 py-3.5 text-[11px] font-bold tracking-[0.12em] uppercase transition hover:bg-[var(--fuchsia)] hover:text-white"
            >
              List a Piece (+10 cr)
            </button>
          </div>

          {/* Social Proof metrics */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#c8d5c4]/60 text-xs">
            <div>
              <span className="block font-serif text-2xl font-bold text-[var(--deep)]">100+</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]">Curated fits</span>
            </div>
            <div className="h-8 w-px bg-[#c8d5c4]"></div>
            <div>
              <span className="block font-serif text-2xl font-bold text-[var(--deep)]">€0</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]">Cash required</span>
            </div>
            <div className="h-8 w-px bg-[#c8d5c4]"></div>
            <div>
              <span className="block font-serif text-2xl font-bold text-[var(--deep)]">4.9 ★</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]">Milan community</span>
            </div>
          </div>
        </div>

        {/* Right Column Arched Editorial Imagery */}
        <div>
          <div className="grid grid-cols-2 gap-3.5 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=85"
                alt="Milan street style model"
                className="w-full h-[320px] md:h-[500px] object-cover rounded-[140px_140px_12px_12px] md:rounded-[180px_180px_12px_12px] shadow-md"
              />
              <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full text-[var(--deep)] font-bold">
                Via Brera
              </span>
            </div>
            <div className="relative mt-8 md:mt-20">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=85"
                alt="Contemporary editorial outfit"
                className="w-full h-[260px] md:h-[400px] object-cover rounded-[12px_12px_140px_140px] md:rounded-[12px_12px_180px_180px] shadow-md"
              />
              <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full text-[var(--deep)] font-bold">
                Navigli Edit
              </span>
            </div>
          </div>
          <div className="font-serif italic text-lg md:text-xl text-right mt-4 text-[var(--fuchsia)]">
            Good clothes deserve another story.
          </div>
        </div>
      </div>
    </section>
  );
}
