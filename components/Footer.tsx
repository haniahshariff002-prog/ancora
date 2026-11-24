'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setIsAdminOpen, setIsListItemOpen, setIsProfileOpen } = useApp();

  return (
    <footer className="bg-[#718b77] text-white py-10 px-[5%]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <a href="#top" className="font-serif text-3xl font-bold tracking-[-0.06em] text-white">
            ancora<span className="text-[#f5e9e9]">.</span>
          </a>
          <p className="text-[11px] text-[#f5e9e9]/90 mt-1">
            © {new Date().getFullYear()} Ancora Exchange. Made for wardrobes with stories.
          </p>
          <p className="text-[10px] text-[#f5e9e9]/70 mt-0.5">
            Milan · Roma · Firenze · Torino
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-wider text-[#f5e9e9]">
          <a href="#explore" className="hover:text-white transition">Explore (100+)</a>
          <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
          <button onClick={() => setIsListItemOpen(true)} className="hover:text-white transition uppercase">
            List a Piece
          </button>
          <button onClick={() => setIsProfileOpen(true)} className="hover:text-white transition uppercase">
            My Account
          </button>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-white transition uppercase text-[var(--pink)]"
          >
            Admin Portal ⚙
          </button>
        </nav>
      </div>
    </footer>
  );
}
