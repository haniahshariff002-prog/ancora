'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SwapBagDrawer() {
  const {
    bag,
    isBagOpen,
    setIsBagOpen,
    removeFromBag,
    clearBag,
    currentUser,
    checkoutSwap,
    setIsListItemOpen,
    setIsChatOpen
  } = useApp();

  const [address, setAddress] = useState(currentUser.location + ' - Hub Drop');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBagOpen) return null;

  const totalCredits = bag.reduce((sum, item) => sum + item.credits, 0);
  const hasEnoughCredits = currentUser.credits >= totalCredits;
  const remainingCredits = currentUser.credits - totalCredits;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const res = checkoutSwap(address);
      if (res.success) {
        setFeedback({ message: res.message, isError: false });
        setTimeout(() => {
          setIsBagOpen(false);
          setFeedback(null);
        }, 2200);
      } else {
        setFeedback({ message: res.message, isError: true });
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={() => setIsBagOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[var(--sage)] h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden border-l border-[#c8d5c4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-[#c8d5c4]">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[var(--fuchsia)]">
                Swap Bag
              </h2>
              <span className="bg-[var(--fuchsia)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {bag.length} {bag.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            <button
              onClick={() => setIsBagOpen(false)}
              className="text-[var(--ink)] hover:text-[var(--fuchsia)] font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          {/* Account Balance Summary Capsule */}
          <div className="bg-white/80 rounded-xl p-3 my-4 border border-[#c8d5c4] flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] block">
                Active Member
              </span>
              <span className="font-bold text-[var(--deep)]">{currentUser.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] block">
                Your Balance
              </span>
              <span className="font-bold text-[var(--fuchsia)] text-sm">
                {currentUser.credits} cr
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium my-2 ${
              feedback.isError
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <p>{feedback.message}</p>
            {!feedback.isError && (
              <button
                type="button"
                onClick={() => {
                  setIsBagOpen(false);
                  setIsChatOpen(true);
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 bg-[var(--deep)] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-[var(--fuchsia)] transition shadow-xs"
              >
                💬 Open Chat to Arrange Meetup →
              </button>
            )}
          </div>
        )}

        {/* Bag Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3 pr-1">
          {bag.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--ink)]">
              <div className="w-16 h-16 rounded-full bg-[#f5e9e9] flex items-center justify-center text-2xl mb-3 border border-[#c8d5c4]">
                👜
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--fuchsia)] mb-1">
                Your closet is waiting.
              </h3>
              <p className="text-xs leading-relaxed max-w-[240px] mb-4">
                Explore the wardrobe edit and add the fits you want to claim using your credits.
              </p>
              <button
                onClick={() => setIsBagOpen(false)}
                className="bg-[var(--fuchsia)] text-white text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-[var(--deep)] transition"
              >
                Browse Closet
              </button>
            </div>
          ) : (
            bag.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-white/70 p-3 rounded-xl border border-[#c8d5c4] items-center"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg bg-[var(--pink)] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--fuchsia)] block">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--deep)] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[var(--ink)]">
                    Size: {item.size} · Lender: {item.lenderName.split(' ')[0]}
                  </p>
                  <span className="font-bold text-xs text-[var(--deep)] block mt-1">
                    {item.credits} cr
                  </span>
                </div>
                <button
                  onClick={() => removeFromBag(item.id)}
                  className="text-xs text-gray-400 hover:text-rose-600 p-2"
                  title="Remove from bag"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Actions */}
        {bag.length > 0 && (
          <div className="pt-4 border-t border-[#c8d5c4] space-y-3">
            {/* Delivery destination */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] block mb-1">
                Handoff / Delivery Point
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter locker location or Milan street address..."
                className="w-full bg-white border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs text-[var(--deep)] outline-none focus:border-[var(--fuchsia)]"
              />
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[var(--ink)]">
                <span>Total Swap Value:</span>
                <span className="font-bold">{totalCredits} credits</span>
              </div>
              <div className="flex justify-between text-[var(--ink)]">
                <span>Shipping / Service Fee:</span>
                <span className="text-emerald-700 font-bold">€0 (Free for Beta)</span>
              </div>
              <div className="flex justify-between font-bold text-[var(--deep)] pt-1 border-t border-[#c8d5c4]/60">
                <span>Remaining Balance:</span>
                <span className={remainingCredits < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {remainingCredits} credits
                </span>
              </div>
            </div>

            {/* Warning if insufficient credits */}
            {!hasEnoughCredits && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] text-rose-700">
                You need <strong>{Math.abs(remainingCredits)} more credits</strong> to claim this swap.
                <button
                  onClick={() => {
                    setIsBagOpen(false);
                    setIsListItemOpen(true);
                  }}
                  className="block mt-1 underline font-bold"
                >
                  List a piece to earn credits now (+10 cr bonus) →
                </button>
              </div>
            )}

            {/* Checkout / Claim Button */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !hasEnoughCredits}
              className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-md ${
                hasEnoughCredits
                  ? 'bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Confirming Swap...' : `Confirm Swap (${totalCredits} cr)`}
            </button>

            <button
              onClick={clearBag}
              className="w-full text-center text-[10px] uppercase tracking-wider text-[var(--ink)] hover:text-[var(--fuchsia)]"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
