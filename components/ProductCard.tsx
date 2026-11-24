'use client';

import React from 'react';
import { FashionItem } from '../data/items';
import { useApp } from '../context/AppContext';

export default function ProductCard({ item }: { item: FashionItem }) {
  const { setSelectedItem, addToBag, bag } = useApp();
  const isInBag = bag.some((b) => b.id === item.id);
  const isSwapped = item.status === 'swapped';

  return (
    <article
      onClick={() => setSelectedItem(item)}
      className="group cursor-pointer flex flex-col justify-between transition-all"
    >
      <div className="relative aspect-[3/4] bg-[var(--pink)] rounded-lg overflow-hidden border border-[#c8d5c4]/40 shadow-sm">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSwapped ? 'grayscale opacity-60' : ''
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="bg-white/95 backdrop-blur-sm text-[var(--fuchsia)] font-bold text-[9px] md:text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs">
            {item.category}
          </span>
          {item.brand && (
            <span className="bg-[var(--deep)]/90 backdrop-blur-sm text-white text-[9px] font-medium tracking-wide px-2 py-0.5 rounded-full">
              {item.brand}
            </span>
          )}
        </div>

        {/* Condition Tag */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full">
            {item.condition} · {item.size}
          </span>
        </div>

        {/* Swapped Overlay if not available */}
        {isSwapped && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[var(--deep)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Swapped
            </span>
          </div>
        )}

        {/* Quick Add Button on Hover */}
        {!isSwapped && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToBag(item);
            }}
            className={`absolute bottom-2.5 right-2.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md transition-all ${
              isInBag
                ? 'bg-white text-[var(--fuchsia)] border border-[var(--fuchsia)]'
                : 'bg-[var(--fuchsia)] text-white hover:bg-[var(--deep)]'
            }`}
          >
            {isInBag ? 'In Bag ✓' : '+ Swap'}
          </button>
        )}
      </div>

      {/* Info Details */}
      <div className="pt-2.5 pb-1 flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-sans font-bold text-xs md:text-sm text-[var(--fuchsia)] truncate group-hover:underline">
            {item.name}
          </h3>
          <p className="text-[11px] text-[var(--ink)] truncate mt-0.5">
            Lender: {item.lenderName} · {item.lenderLocation.split(',')[0]}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="font-sans font-bold text-xs md:text-sm text-[var(--deep)]">
            {item.credits} cr*
          </span>
        </div>
      </div>
    </article>
  );
}
