'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import ProductModal from '../../components/ProductModal';
import SwapBagDrawer from '../../components/SwapBagDrawer';
import ProfileModal from '../../components/ProfileModal';
import ListItemModal from '../../components/ListItemModal';
import AdminDashboard from '../../components/AdminDashboard';
import SwapChatModal from '../../components/SwapChatModal';
import Footer from '../../components/Footer';

export default function CoordinationPage() {
  const {
    items,
    savedItemIds,
    toggleSaveItem,
    openChatForSwap,
    conversations,
    setActiveConversation,
    setIsChatOpen,
    addToBag,
    bag,
    setSelectedItem,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'interested' | 'chats'>('interested');

  // Filter items Chiara is interested in
  const interestedItems = items.filter((item) => savedItemIds.includes(item.id));

  return (
    <main className="min-h-screen bg-[var(--sage)] text-[var(--fuchsia)] font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#f5e9e9]/90 to-[var(--sage)] border-b border-[#c8d5c4]/60 pt-10 pb-12 px-[5%]">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink)] mb-6">
            <Link href="/" className="hover:underline hover:text-[var(--fuchsia)]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--fuchsia)] font-bold">Interests &amp; Coordination</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--fuchsia)]">
                Milan Handoff Hub
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[var(--fuchsia)] mt-1">
                Saved Fits &amp; Swap Coordination
              </h1>
              <p className="text-xs md:text-sm text-[var(--ink)] mt-2 max-w-xl leading-relaxed">
                Review pieces you have eyed across Milan. Directly message lenders to coordinate an in-person handoff (Brera, Navigli, Garibaldi) or arrange an InPost locker courier.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full border border-[#c8d5c4] shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('interested')}
                className={`text-xs md:text-sm px-5 py-2 rounded-full font-bold transition flex items-center gap-2 ${
                  activeTab === 'interested'
                    ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
                }`}
              >
                <span>♡ Interested Pieces</span>
                <span className="bg-white/30 text-current text-[10px] px-2 py-0.5 rounded-full">
                  {interestedItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chats')}
                className={`text-xs md:text-sm px-5 py-2 rounded-full font-bold transition flex items-center gap-2 ${
                  activeTab === 'chats'
                    ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                    : 'text-[var(--ink)] hover:text-[var(--fuchsia)]'
                }`}
              >
                <span>💬 Active Chats</span>
                <span className="bg-white/30 text-current text-[10px] px-2 py-0.5 rounded-full">
                  {conversations.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 px-[5%] max-w-[1440px] mx-auto">
        {activeTab === 'interested' ? (
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#c8d5c4]/60">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                  Pieces Chiara is Interested In ({interestedItems.length})
                </h2>
                <p className="text-xs text-[var(--ink)] mt-0.5">
                  Click &ldquo;Coordinate Meetup / Courier&rdquo; on any piece to open a direct chat channel with the lender.
                </p>
              </div>

              <Link
                href="/"
                className="text-xs font-bold text-[var(--fuchsia)] hover:underline flex items-center gap-1"
              >
                + Browse More Pieces →
              </Link>
            </div>

            {interestedItems.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-[#c8d5c4] rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-full bg-[var(--pink)] text-[var(--fuchsia)] flex items-center justify-center text-2xl mx-auto mb-4 font-serif">
                  ♡
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--deep)] mb-2">
                  No saved pieces yet
                </h3>
                <p className="text-xs text-[var(--ink)] mb-6 leading-relaxed">
                  Browse the catalog of 100+ Milanese items and click the heart icon on any piece you want to swap for or coordinate chats about.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interestedItems.map((item) => {
                  const isInBag = bag.some((b) => b.id === item.id);
                  const isSwapped = item.status === 'swapped';
                  const activeConv = conversations.find(
                    (c) => c.itemId === item.id && c.claimerId === currentUser.id
                  );

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#c8d5c4] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="p-4 sm:p-5 flex gap-4">
                        {/* Thumbnail */}
                        <div
                          onClick={() => setSelectedItem(item)}
                          className="relative w-28 h-36 shrink-0 rounded-xl overflow-hidden bg-[var(--pink)] cursor-pointer border border-[#c8d5c4]/60"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded-full">
                            {item.size}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--fuchsia)]">
                                {item.category}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleSaveItem(item.id)}
                                className="text-xs text-rose-500 hover:text-rose-700"
                                title="Remove from interested"
                              >
                                ♥ Saved
                              </button>
                            </div>

                            <h3
                              onClick={() => setSelectedItem(item)}
                              className="font-sans font-bold text-sm text-[var(--deep)] truncate cursor-pointer hover:underline mt-1"
                            >
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-[var(--ink)] truncate">
                              {item.brand} · {item.condition}
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="font-bold text-xs text-[var(--deep)]">
                                {item.credits} CR
                              </span>
                              <span className="text-[10px] text-[var(--ink)]/80">
                                Est. €{item.originalPrice}
                              </span>
                            </div>
                          </div>

                          {/* Lender Info */}
                          <div className="mt-3 pt-2 border-t border-[#c8d5c4]/40 flex items-center gap-2">
                            <img
                              src={item.lenderAvatar}
                              alt={item.lenderName}
                              className="w-6 h-6 rounded-full object-cover border border-[var(--fuchsia)]"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-[var(--deep)] truncate">
                                {item.lenderName}
                              </p>
                              <p className="text-[9px] text-[var(--ink)] truncate">
                                📍 {item.lenderLocation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat Status Pill */}
                      <div className="px-5 py-2.5 bg-[#f5e9e9]/50 border-t border-[#c8d5c4]/40 flex items-center justify-between text-[11px]">
                        <span className="text-[var(--ink)]">
                          {activeConv ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active Chat: {activeConv.status}
                            </span>
                          ) : (
                            'Ready to coordinate meetup'
                          )}
                        </span>

                        {activeConv && (
                          <span className="text-[10px] text-[var(--deep)] font-semibold">
                            {activeConv.messages.length} msgs
                          </span>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="p-4 bg-white border-t border-[#c8d5c4]/60 flex items-center gap-2">
                        {/* Main Chat Coordination Action */}
                        <button
                          type="button"
                          onClick={() => openChatForSwap(item)}
                          className="flex-1 bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-full transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>💬</span> Coordinate Chat
                        </button>

                        {/* Add to Swap Bag */}
                        {!isSwapped && (
                          <button
                            type="button"
                            onClick={() => addToBag(item)}
                            className={`text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-full transition border ${
                              isInBag
                                ? 'bg-white text-[var(--fuchsia)] border-[var(--fuchsia)]'
                                : 'bg-white hover:bg-gray-50 text-[var(--deep)] border-[#c8d5c4]'
                            }`}
                          >
                            {isInBag ? 'In Bag ✓' : '+ Bag'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Active Swap Chats Tab */
          <div>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#c8d5c4]/60">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                  Active Swap Conversations ({conversations.length})
                </h2>
                <p className="text-xs text-[var(--ink)] mt-0.5">
                  Direct channels with Milan lenders to confirm in-person handoffs or InPost locker drops.
                </p>
              </div>
            </div>

            {conversations.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-[#c8d5c4] rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 rounded-full bg-[var(--pink)] text-[var(--fuchsia)] flex items-center justify-center text-2xl mx-auto mb-4 font-serif">
                  💬
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--deep)] mb-2">
                  No active chat threads yet
                </h3>
                <p className="text-xs text-[var(--ink)] mb-6 leading-relaxed">
                  Start coordinating by selecting any piece from your interested list or the catalog and clicking &ldquo;Coordinate Chat&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {conversations.map((conv) => {
                  const lastMessage = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversation(conv);
                        setIsChatOpen(true);
                      }}
                      className="bg-white rounded-2xl border border-[#c8d5c4] p-5 shadow-sm hover:shadow-md hover:border-[var(--fuchsia)] cursor-pointer transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Lender Avatar & Piece Thumbnail */}
                        <div className="relative shrink-0">
                          <img
                            src={conv.lenderAvatar}
                            alt={conv.lenderName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-[var(--fuchsia)]"
                          />
                          <img
                            src={conv.itemImage}
                            alt={conv.itemName}
                            className="w-7 h-7 rounded-md object-cover absolute -bottom-1 -right-1 border border-white shadow"
                          />
                        </div>

                        {/* Text Thread Preview */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-sans font-bold text-sm text-[var(--deep)] truncate">
                              {conv.lenderName}
                            </h3>
                            <span className="text-[10px] text-[var(--ink)]">· {conv.lenderLocation}</span>
                          </div>

                          <p className="text-xs font-semibold text-[var(--fuchsia)] truncate mt-0.5">
                            Re: {conv.itemName} ({conv.itemCredits} CR)
                          </p>

                          {lastMessage && (
                            <p className="text-xs text-[var(--ink)]/90 truncate mt-1 max-w-md italic">
                              &ldquo;{lastMessage.text}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status & Open Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {conv.status}
                        </span>
                        <button
                          type="button"
                          className="bg-[var(--fuchsia)] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full hover:bg-[var(--deep)] transition"
                        >
                          Open Chat 💬
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Global Modals */}
      <ProductModal />
      <SwapBagDrawer />
      <ProfileModal />
      <ListItemModal />
      <AdminDashboard />
      <SwapChatModal />

      <Footer />
    </main>
  );
}
