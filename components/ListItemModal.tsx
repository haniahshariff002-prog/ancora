'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ListItemModal() {
  const { isListItemOpen, setIsListItemOpen, addNewItem, currentUser } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Women' | 'Men' | 'Children' | 'Accessories' | 'Books' | 'Household'>('Women');
  const [subCategory, setSubCategory] = useState('Outerwear');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState('Like new');
  const [credits, setCredits] = useState(40);
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80');
  const [submitted, setSubmitted] = useState(false);

  if (!isListItemOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewItem({
      name,
      category,
      subCategory,
      brand: brand || 'Contemporary Vintage',
      size,
      condition,
      credits: Number(credits) || 35,
      description: description || 'Beautifully cared for wardrobe piece, ready for its next owner.',
      img
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsListItemOpen(false);
      setName('');
      setDescription('');
    }, 1800);
  };

  const sampleImages = [
    { label: 'Blazer', url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Dress', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Knitwear', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80' },
    { label: 'Men Jacket', url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80' },
    { label: 'Leather Bag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsListItemOpen(false)}
    >
      <div
        className="relative bg-[var(--sage)] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-[#c8d5c4] my-6 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsListItemOpen(false)}
          className="absolute top-4 right-4 text-[var(--ink)] hover:text-[var(--fuchsia)] font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              ✓
            </div>
            <h3 className="font-serif text-3xl font-bold text-[var(--fuchsia)] mb-2">
              Piece Listed Successfully!
            </h3>
            <p className="text-xs text-[var(--ink)] max-w-xs mx-auto">
              Your item is now live in the Milan closet. You just earned <strong>+10 bonus credits</strong>!
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--fuchsia)]">
                Lender Studio · List A Wardrobe Piece
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                Give your unworn clothes currency.
              </h2>
              <p className="text-xs text-[var(--ink)] mt-1">
                Lister: <strong>{currentUser.name}</strong> ({currentUser.location})
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vintage Double-Breasted Wool Blazer"
                  className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none focus:border-[var(--fuchsia)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Children">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Books">Books</option>
                    <option value="Household">Home</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                    Brand / Label
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Max Mara, COS, Vintage"
                    className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. M, IT 42"
                    className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none"
                  >
                    <option value="Mint condition">Mint condition</option>
                    <option value="Like new">Like new</option>
                    <option value="Gently loved">Gently loved</option>
                    <option value="Vintage">Vintage archive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                    Credit Value (cr)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none font-bold text-[var(--fuchsia)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none"
                />
                <div className="flex gap-2 items-center mt-1.5 overflow-x-auto">
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">Presets:</span>
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setImg(s.url)}
                      className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full hover:border-[var(--fuchsia)] whitespace-nowrap"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                  Editorial Story / Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell its story: fabric quality, fit, care instructions..."
                  className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none focus:border-[var(--fuchsia)]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white py-3.5 rounded-full font-bold uppercase tracking-widest text-xs transition shadow-md"
                >
                  Publish Piece to Ancora (+10 cr Bonus)
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
