'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ListItemModal() {
  const { isListItemOpen, setIsListItemOpen, addNewItem, currentUser } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Women' | 'Men' | 'Children' | 'Accessories' | 'Books' | 'Household'>('Women');
  const [subCategory, setSubCategory] = useState('Outerwear');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState('Like new');

  // Valuation model inputs (€1 = 1 CR breakdown: 35% Retail + 45% Resale + 10% Proposed)
  const [retailPrice, setRetailPrice] = useState<number>(120);
  const [resalePrice, setResalePrice] = useState<number>(55);
  const [sellerPrice, setSellerPrice] = useState<number>(45);
  const [credits, setCredits] = useState<number>(42);

  const [img, setImg] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate credits using the 35% / 45% / 10% valuation breakdown
  useEffect(() => {
    const retailWeight = (retailPrice || 0) * 0.35;
    const resaleWeight = (resalePrice || 0) * 0.45;
    const sellerWeight = (sellerPrice || 0) * 0.10;
    const calculatedCredits = Math.max(5, Math.round(retailWeight + resaleWeight + sellerWeight));
    setCredits(calculatedCredits);
  }, [retailPrice, resalePrice, sellerPrice]);

  if (!isListItemOpen) return null;

  // Process and optimize image directly on client side (like an e-commerce platform)
  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / image.width);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setImg(compressedDataUrl);
        } else {
          setImg(result);
        }
        setIsProcessing(false);
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalImage =
      img ||
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80';

    addNewItem({
      name,
      category,
      subCategory,
      brand: brand || 'Contemporary Milan',
      size,
      condition,
      credits: Number(credits) || 35,
      description: `${brand || 'Contemporary'} ${name} in ${condition.toLowerCase()}. Size ${size}. Cleaned and ready for swap. Valued via Ancora 35/45/10 index.`,
      img: finalImage
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsListItemOpen(false);
      setName('');
      setImg('');
      setFileName('');
    }, 1800);
  };

  const retailVal = ((retailPrice || 0) * 0.35).toFixed(1);
  const resaleVal = ((resalePrice || 0) * 0.45).toFixed(1);
  const sellerVal = ((sellerPrice || 0) * 0.10).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsListItemOpen(false)}
    >
      <div
        className="relative bg-[var(--sage)] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-[#c8d5c4] my-6 p-6 md:p-8 max-h-[92vh] overflow-y-auto"
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
                Post a piece to the exchange.
              </h2>
              <p className="text-xs text-[var(--ink)] mt-1">
                Lister: <strong>{currentUser.name}</strong> ({currentUser.location})
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Photo Direct File Upload Zone */}
              <div>
                <label className="block font-bold text-[var(--deep)] uppercase tracking-wider text-[10px] mb-1">
                  Product Photo *
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {img ? (
                  <div className="relative bg-white rounded-xl p-3 border border-[#c8d5c4] flex items-center gap-4">
                    <img
                      src={img}
                      alt="Uploaded preview"
                      className="w-20 h-24 object-cover rounded-lg bg-[var(--pink)] border border-[#c8d5c4]/60"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-0.5">
                        <span>✓</span> Photo processed & ready
                      </div>
                      <p className="text-[11px] text-[var(--ink)] truncate">
                        {fileName || 'product-image.jpg'}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-[10px] uppercase tracking-wider font-bold text-[var(--fuchsia)] hover:underline"
                      >
                        Replace Photo
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImg('');
                        setFileName('');
                      }}
                      className="text-gray-400 hover:text-rose-600 p-2 text-sm"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                      isDragOver
                        ? 'border-[var(--fuchsia)] bg-[#f5e9e9]/50'
                        : 'border-[#c8d5c4] bg-white/70 hover:bg-white hover:border-[var(--fuchsia)]'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="py-2">
                        <div className="inline-block animate-spin text-xl mb-1">⏳</div>
                        <p className="text-xs font-bold text-[var(--deep)]">
                          Processing & optimizing photo...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#f5e9e9] text-[var(--fuchsia)] flex items-center justify-center mx-auto mb-2 text-lg">
                          📷
                        </div>
                        <p className="text-xs font-bold text-[var(--deep)]">
                          Drop your garment photo here, or <span className="text-[var(--fuchsia)] underline">browse</span>
                        </p>
                        <p className="text-[10px] text-[var(--ink)] mt-1">
                          PNG, JPG, or WEBP up to 10MB · Automatically optimized
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Item Title */}
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

              {/* Category & Brand */}
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

              {/* Size & Condition */}
              <div className="grid grid-cols-2 gap-3">
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
              </div>

              {/* Credit Valuation Formula Engine (€1 = 1 CR: 35% Retail + 45% Resale + 10% Proposed) */}
              <div className="bg-white/80 p-4 rounded-xl border border-[#c8d5c4] space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[var(--deep)] uppercase tracking-wider text-[10px]">
                    Credit Valuation Index (€1 = 1 CR)
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">35% / 45% / 10% Breakdown</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      1. Retail Price (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(Number(e.target.value))}
                      placeholder="120"
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs text-[var(--deep)] font-bold outline-none"
                    />
                    <span className="text-[9px] text-gray-500 block mt-0.5">Weight: 35%</span>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      2. Resale Market (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={resalePrice}
                      onChange={(e) => setResalePrice(Number(e.target.value))}
                      placeholder="55"
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs text-[var(--deep)] font-bold outline-none"
                    />
                    <span className="text-[9px] text-gray-500 block mt-0.5">Weight: 45%</span>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      3. Your Ask (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={sellerPrice}
                      onChange={(e) => setSellerPrice(Number(e.target.value))}
                      placeholder="45"
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs text-[var(--deep)] font-bold outline-none"
                    />
                    <span className="text-[9px] text-gray-500 block mt-0.5">Weight: 10%</span>
                  </div>
                </div>

                {/* Live Allotment Result Card */}
                <div className="bg-[#f5e9e9] p-3 rounded-lg border border-[#c8d5c4] flex justify-between items-center text-xs">
                  <div>
                    <div className="text-[10px] text-[var(--ink)] font-mono space-x-2">
                      <span>Retail: +{retailVal} cr</span>
                      <span>·</span>
                      <span>Resale: +{resaleVal} cr</span>
                      <span>·</span>
                      <span>Ask: +{sellerVal} cr</span>
                    </div>
                    <span className="text-[10px] text-[var(--deep)] font-medium block mt-0.5">
                      Fair market credit proposal
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[var(--fuchsia)]">
                      {credits} <span className="text-xs font-sans text-[var(--deep)]">credits</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
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
