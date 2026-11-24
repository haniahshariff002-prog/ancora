'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProfileModal() {
  const {
    isProfileOpen,
    setIsProfileOpen,
    currentUser,
    users,
    switchUser,
    items,
    swaps,
    creditHistory,
    reviews,
    setIsListItemOpen,
    setIsAdminOpen,
    openChatForSwap,
    setIsChatOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'credits' | 'closet' | 'swaps' | 'reviews'>('credits');

  if (!isProfileOpen) return null;

  const userListings = items.filter((i) => i.lenderId === currentUser.id);
  const userSwaps = swaps.filter((s) => s.userId === currentUser.id);
  const userTxs = creditHistory.filter((t) => t.userId === currentUser.id);
  const userReviews = reviews[currentUser.id] || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsProfileOpen(false)}
    >
      <div
        className="relative bg-[var(--sage)] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#c8d5c4] my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#e2ebd9] p-6 border-b border-[#c8d5c4] flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[var(--fuchsia)] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[var(--fuchsia)]">
                  {currentUser.name}
                </h2>
                <span className="bg-[var(--fuchsia)] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[var(--ink)]">
                {currentUser.handle} · {currentUser.location}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-[var(--deep)]">
                <span>{currentUser.rating} ★ Rating</span>
                <span>•</span>
                <span>{currentUser.swapsCompleted} Swaps Completed</span>
                <span>•</span>
                <span>Member since {currentUser.joinedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--fuchsia)] font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Demo Actor Switcher Capsule */}
        <div className="bg-white/90 px-6 py-2.5 border-b border-[#c8d5c4] flex items-center justify-between text-xs overflow-x-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink)] whitespace-nowrap mr-3">
            Switch Demo Actor:
          </span>
          <div className="flex gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide transition whitespace-nowrap ${
                  currentUser.id === u.id
                    ? 'bg-[var(--fuchsia)] text-white'
                    : 'bg-[#f0f5ed] text-[var(--deep)] hover:bg-[#e3eddf]'
                }`}
              >
                {u.name.split(' ')[0]} ({u.credits} cr)
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#c8d5c4] bg-[#f0f5ed] px-6 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
          <button
            onClick={() => setActiveTab('credits')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'credits'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Credit Ledger ({currentUser.credits} cr)
          </button>
          <button
            onClick={() => setActiveTab('closet')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'closet'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            My Closet ({userListings.length})
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'swaps'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Swaps ({userSwaps.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Reviews ({userReviews.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: CREDITS */}
          {activeTab === 'credits' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-[#c8d5c4] flex justify-between items-center shadow-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold block">
                    Available Balance
                  </span>
                  <div className="font-serif text-4xl font-bold text-[var(--fuchsia)]">
                    {currentUser.credits} <span className="text-base font-sans font-medium text-[var(--deep)]">credits</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink)] mt-1">
                    1 credit = 1 swap value unit. No euro spending required.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsListItemOpen(true);
                  }}
                  className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-[11px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-full transition"
                >
                  + Earn Credits
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--deep)] mb-3">
                  Transaction Audit History
                </h4>
                <div className="space-y-2">
                  {userTxs.length === 0 ? (
                    <p className="text-xs text-[var(--ink)] py-4 text-center">No transactions recorded yet.</p>
                  ) : (
                    userTxs.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-white/70 p-3 rounded-lg border border-[#c8d5c4] flex justify-between items-center text-xs"
                      >
                        <div>
                          <p className="font-bold text-[var(--deep)]">{tx.description}</p>
                          <span className="text-[10px] text-[var(--ink)]">{tx.date}</span>
                        </div>
                        <span
                          className={`font-bold font-sans ${
                            tx.type === 'earned' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} cr
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY CLOSET */}
          {activeTab === 'closet' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--deep)]">
                  Your Listed Pieces
                </span>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsListItemOpen(true);
                  }}
                  className="text-xs underline font-bold text-[var(--fuchsia)]"
                >
                  + Add another piece
                </button>
              </div>

              {userListings.length === 0 ? (
                <div className="text-center py-8 bg-white/50 rounded-xl border border-[#c8d5c4]">
                  <p className="text-xs text-[var(--ink)] mb-3">You haven&apos;t listed any garments yet.</p>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsListItemOpen(true);
                    }}
                    className="bg-[var(--fuchsia)] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full"
                  >
                    List First Piece (+10 cr)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {userListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-xl border border-[#c8d5c4] flex gap-3 items-center"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-lg bg-[var(--pink)] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-bold text-[var(--fuchsia)] block">
                          {item.category}
                        </span>
                        <h5 className="font-bold text-xs text-[var(--deep)] truncate">
                          {item.name}
                        </h5>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-bold text-[var(--deep)]">
                            {item.credits} cr
                          </span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold ${
                              item.status === 'available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SWAPS */}
          {activeTab === 'swaps' && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--deep)] block">
                Active & Completed Swaps
              </span>
              {userSwaps.length === 0 ? (
                <p className="text-xs text-[var(--ink)] py-8 text-center bg-white/50 rounded-xl">
                  No swaps recorded yet. Check out pieces in the closet!
                </p>
              ) : (
                userSwaps.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white p-4 rounded-xl border border-[#c8d5c4] space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-[var(--deep)]">Order {s.id}</span>
                        <span className="text-[10px] text-[var(--ink)] block">{s.date}</span>
                      </div>
                      <span className="bg-[var(--sage2)] border border-[var(--fuchsia)] text-[var(--fuchsia)] font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                        {s.status}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--ink)]">
                      <span>Delivery: </span>
                      <strong className="text-[var(--deep)]">{s.deliveryAddress}</strong>
                      {s.trackingNumber && (
                        <span className="block text-[10px] text-gray-500 font-mono mt-0.5">
                          Tracking: {s.trackingNumber}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <span className="text-[11px] text-[var(--ink)]">
                        {s.items.map((i) => i.name).join(', ')}
                      </span>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <strong className="text-[var(--fuchsia)] whitespace-nowrap">
                          {s.totalCredits} credits
                        </strong>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            if (s.items[0]) {
                              openChatForSwap(s.items[0], s.id);
                            } else {
                              setIsChatOpen(true);
                            }
                          }}
                          className="bg-[var(--deep)] hover:bg-[var(--fuchsia)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition shadow-xs"
                        >
                          💬 Chat / Meetup
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--deep)] block">
                Community Feedback ({currentUser.rating} ★ Average)
              </span>
              {userReviews.length === 0 ? (
                <p className="text-xs text-[var(--ink)] py-8 text-center bg-white/50 rounded-xl">
                  No reviews received yet. Complete a swap to build your reputation!
                </p>
              ) : (
                userReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-3.5 rounded-xl border border-[#c8d5c4] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <strong className="text-[var(--deep)] block">{rev.reviewerName}</strong>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                      </div>
                      <span className="text-amber-600 font-bold text-xs">
                        {'★'.repeat(Math.round(rev.rating))}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--ink)] italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span className="text-[10px] text-[var(--fuchsia)] font-bold block">
                      Swapped: {rev.itemSwapped}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Admin Portal Link if Admin */}
        {currentUser.role === 'admin' && (
          <div className="p-4 bg-[var(--fuchsia)] text-white text-center text-xs">
            <span>You have administrator permissions. </span>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                setIsAdminOpen(true);
              }}
              className="underline font-bold ml-1"
            >
              Open Admin Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
