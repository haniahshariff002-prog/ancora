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

export default function CommunityPage() {
  const {
    users,
    currentUser,
    switchUser,
    items,
    setSelectedItem,
    addToBag,
    openChatForSwap
  } = useApp();

  const [memberSearch, setMemberSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');

  const districts = ['All', 'Brera', 'Navigli', 'Garibaldi', 'Isola', 'Porta Romana', 'Porta Venezia'];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !memberSearch ||
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.handle.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.bio.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.location.toLowerCase().includes(memberSearch.toLowerCase());

    const matchesDistrict =
      districtFilter === 'All' || u.location.toLowerCase().includes(districtFilter.toLowerCase());

    return matchesSearch && matchesDistrict;
  });

  return (
    <main className="min-h-screen bg-[var(--sage)] text-[var(--fuchsia)] font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#f5e9e9]/90 to-[var(--sage)] border-b border-[#c8d5c4]/60 pt-10 pb-12 px-[5%]">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink)] mb-6">
            <Link href="/" className="hover:underline hover:text-[var(--fuchsia)]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--fuchsia)] font-bold">Community Directory</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--fuchsia)]">
                The Milanese Collective
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[var(--fuchsia)] mt-1">
                Every Swapper &amp; Their Wardrobe
              </h1>
              <p className="text-xs md:text-sm text-[var(--ink)] mt-2 max-w-xl leading-relaxed">
                Explore the verified closets of Milan&apos;s circular fashion pioneers. Discover what each member has listed to swap, chat to coordinate meetups, or switch perspective to experience their view.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#c8d5c4] shadow-sm">
              <div className="text-center px-3 border-r border-[#c8d5c4]">
                <span className="block font-serif text-2xl font-bold text-[var(--deep)]">
                  {users.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Members
                </span>
              </div>
              <div className="text-center px-3 border-r border-[#c8d5c4]">
                <span className="block font-serif text-2xl font-bold text-emerald-700">
                  {items.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Pieces Listed
                </span>
              </div>
              <div className="text-center px-3">
                <span className="block font-serif text-2xl font-bold text-[var(--fuchsia)]">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)] font-bold">
                  Milan Local
                </span>
              </div>
            </div>
          </div>

          {/* Search & District Filter Controls */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member by name, district, style..."
                className="w-full bg-white border border-[#c8d5c4] rounded-full py-2.5 pl-4 pr-10 text-xs md:text-sm text-[var(--deep)] outline-none focus:ring-2 focus:ring-[#c98da7]/50"
              />
              {memberSearch && (
                <button
                  type="button"
                  onClick={() => setMemberSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--ink)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* District Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {districts.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDistrictFilter(d)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                    districtFilter === d
                      ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                      : 'bg-white/70 text-[var(--ink)] hover:text-[var(--fuchsia)] border border-[#c8d5c4]/60'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Directory List */}
      <section className="py-12 px-[5%] max-w-[1440px] mx-auto">
        <div className="space-y-12">
          {filteredUsers.map((member) => {
            // Find all items listed by this member
            const memberItems = items.filter(
              (i) => i.lenderId === member.id || i.lenderName.toLowerCase() === member.name.toLowerCase()
            );
            const isCurrent = member.id === currentUser.id;

            return (
              <div
                key={member.id}
                className={`bg-white rounded-3xl border ${
                  isCurrent ? 'border-[var(--fuchsia)] ring-2 ring-[var(--fuchsia)]/20' : 'border-[#c8d5c4]'
                } p-6 md:p-8 shadow-sm transition-all hover:shadow-md`}
              >
                {/* Member Header Card */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-[#c8d5c4]/60">
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[var(--fuchsia)] shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--deep)]">
                          {member.name}
                        </h2>
                        {isCurrent && (
                          <span className="bg-[var(--fuchsia)] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            You (Logged In)
                          </span>
                        )}
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {member.rating} ★ Verified
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink)] mt-0.5">
                        {member.handle} · 📍 {member.location} · {member.swapsCompleted} Swaps · Member since {member.memberSince}
                      </p>
                      <p className="text-xs text-[var(--ink)]/80 mt-1.5 italic max-w-xl">
                        &ldquo;{member.bio}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Member Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-[#f5e9e9] px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--deep)] border border-[#c8d5c4]">
                      {member.credits} CR Balance
                    </div>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => switchUser(member.id)}
                        className="bg-white hover:bg-gray-50 border border-[#c8d5c4] text-[var(--deep)] text-xs font-bold px-3.5 py-2 rounded-full transition shadow-xs"
                      >
                        Switch Perspective ⇄
                      </button>
                    )}

                    {memberItems.length > 0 && (
                      <Link
                        href="/inbox"
                        onClick={() => openChatForSwap(memberItems[0])}
                        className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition shadow-sm flex items-center gap-1.5"
                      >
                        <span>📬</span> Message {member.name.split(' ')[0]}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Member's Listed Pieces Section */}
                <div className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-[var(--fuchsia)]">
                      {member.name.split(' ')[0]}&apos;s Listed Wardrobe ({memberItems.length} pieces)
                    </h3>
                    <span className="text-[11px] text-[var(--ink)]">
                      All available for Milan pickup or locker courier
                    </span>
                  </div>

                  {memberItems.length === 0 ? (
                    <div className="bg-[#f5e9e9]/50 rounded-2xl p-6 text-center text-xs text-[var(--ink)] border border-dashed border-[#c8d5c4]">
                      No items currently listed by {member.name}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                      {memberItems.map((item) => {
                        const isSwapped = item.status === 'swapped';
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="group cursor-pointer bg-[var(--sage)]/40 rounded-xl overflow-hidden border border-[#c8d5c4]/70 hover:border-[var(--fuchsia)] transition-all flex flex-col justify-between"
                          >
                            <div className="relative aspect-[3/4] bg-[var(--pink)] overflow-hidden">
                              <img
                                src={item.img}
                                alt={item.name}
                                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                  isSwapped ? 'grayscale opacity-60' : ''
                                }`}
                              />
                              <span className="absolute top-2 left-2 bg-white/95 text-[var(--fuchsia)] text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shadow-xs">
                                {item.category}
                              </span>
                              <span className="absolute bottom-2 right-2 bg-white/95 text-[var(--deep)] text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                {item.credits} CR
                              </span>
                              {isSwapped && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <span className="bg-white text-[var(--deep)] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Swapped
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-2.5">
                              <h4 className="font-bold text-xs text-[var(--deep)] truncate group-hover:underline">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-[var(--ink)] truncate mt-0.5">
                                {item.brand} · {item.size}
                              </p>

                              {!isSwapped && !isCurrent && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToBag(item);
                                  }}
                                  className="w-full mt-2 bg-white hover:bg-[var(--fuchsia)] hover:text-white border border-[#c8d5c4] text-[var(--fuchsia)] text-[9px] uppercase font-bold py-1 rounded-full transition"
                                >
                                  + Swap Piece
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
