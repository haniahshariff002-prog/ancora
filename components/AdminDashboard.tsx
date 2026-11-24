'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    items,
    users,
    swaps,
    creditHistory,
    adminAdjustCredits,
    adminUpdateItemStatus,
    adminDeleteItem,
    adminUpdateSwapStatus
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'credits' | 'swaps' | 'users'>('inventory');
  const [invSearch, setInvSearch] = useState('');
  const [invCatFilter, setInvCatFilter] = useState('All');

  // Credit adjustment form state
  const [adjUser, setAdjUser] = useState(users[0]?.id || '');
  const [adjAmount, setAdjAmount] = useState(25);
  const [adjReason, setAdjReason] = useState('Beta Community Bonus');
  const [adjFeedback, setAdjFeedback] = useState('');

  if (!isAdminOpen) return null;

  // Filtered inventory items
  const filteredItems = items.filter((item) => {
    const matchesCat = invCatFilter === 'All' || item.category === invCatFilter;
    const matchesSearch =
      !invSearch ||
      item.name.toLowerCase().includes(invSearch.toLowerCase()) ||
      item.brand.toLowerCase().includes(invSearch.toLowerCase()) ||
      item.lenderName.toLowerCase().includes(invSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCreditsInCirculation = users.reduce((sum, u) => sum + u.credits, 0);
  const availableItemsCount = items.filter((i) => i.status === 'available').length;
  const swappedItemsCount = items.filter((i) => i.status === 'swapped').length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminAdjustCredits(adjUser, adjAmount, adjReason);
    setAdjFeedback(`Successfully adjusted ${adjAmount >= 0 ? '+' : ''}${adjAmount} credits!`);
    setTimeout(() => setAdjFeedback(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="relative bg-[var(--sage)] w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--deep)] my-4 flex flex-col max-h-[94vh]">
        {/* Top Admin Header */}
        <div className="bg-[var(--deep)] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="bg-[var(--fuchsia)] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              Operations
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              Ancora HQ Studio · Admin Management
            </h1>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="text-white hover:text-[#f5e9e9] font-bold text-xl w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition"
          >
            ✕
          </button>
        </div>

        {/* Global KPI Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-[#e2ebd9] border-b border-[#c8d5c4] text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#c8d5c4]">
            <span className="text-[10px] uppercase font-bold text-[var(--ink)] block">Total Inventory</span>
            <span className="font-serif text-2xl font-bold text-[var(--deep)]">{items.length}</span>
            <span className="text-[10px] text-gray-500 block">Mixed seeded fits</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#c8d5c4]">
            <span className="text-[10px] uppercase font-bold text-[var(--ink)] block">Available Fits</span>
            <span className="font-serif text-2xl font-bold text-emerald-700">{availableItemsCount}</span>
            <span className="text-[10px] text-gray-500 block">Active listings</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#c8d5c4]">
            <span className="text-[10px] uppercase font-bold text-[var(--ink)] block">Circulating Credits</span>
            <span className="font-serif text-2xl font-bold text-[var(--fuchsia)]">{totalCreditsInCirculation}</span>
            <span className="text-[10px] text-gray-500 block">Platform liquidity</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#c8d5c4]">
            <span className="text-[10px] uppercase font-bold text-[var(--ink)] block">Active Swaps</span>
            <span className="font-serif text-2xl font-bold text-amber-700">{swaps.length}</span>
            <span className="text-[10px] text-gray-500 block">Handoffs in pipeline</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#c8d5c4]">
            <span className="text-[10px] uppercase font-bold text-[var(--ink)] block">Completed Claims</span>
            <span className="font-serif text-2xl font-bold text-[var(--deep)]">{swappedItemsCount}</span>
            <span className="text-[10px] text-gray-500 block">Successful exchanges</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#c8d5c4] bg-[#f0f5ed] px-6 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeAdminTab === 'inventory'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Inventory Management ({items.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('credits')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeAdminTab === 'credits'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Credit System & Ledger
          </button>
          <button
            onClick={() => setActiveAdminTab('swaps')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeAdminTab === 'swaps'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Swap Orders Pipeline ({swaps.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`py-3.5 px-4 border-b-2 transition ${
              activeAdminTab === 'users'
                ? 'border-[var(--fuchsia)] text-[var(--fuchsia)]'
                : 'border-transparent hover:text-[var(--fuchsia)]'
            }`}
          >
            Members & Reviews ({users.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[var(--sage2)]">
          {/* ================= TAB 1: INVENTORY MANAGEMENT ================= */}
          {activeAdminTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3 items-center bg-white p-3 rounded-xl border border-[#c8d5c4]">
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="search"
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    placeholder="Search 100+ inventory pieces by name, brand, lender..."
                    className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--fuchsia)]"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto text-xs">
                  {['All', 'Women', 'Men', 'Children', 'Accessories', 'Books', 'Household'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInvCatFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                        invCatFilter === cat
                          ? 'bg-[var(--fuchsia)] text-white'
                          : 'bg-white border border-[#c8d5c4] text-[var(--ink)] hover:border-[var(--fuchsia)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl border border-[#c8d5c4] overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#f0f5ed] text-[10px] uppercase font-bold text-[var(--deep)] tracking-wider sticky top-0 border-b border-[#c8d5c4]">
                      <tr>
                        <th className="p-3">Piece</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3">Credits</th>
                        <th className="p-3">Lender</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c8d5c4]/40">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-[#f5e9e9]/30 transition">
                          <td className="p-3 flex items-center gap-2.5">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-9 h-11 object-cover rounded bg-[var(--pink)] shrink-0"
                            />
                            <div className="min-w-0 max-w-[200px]">
                              <span className="font-bold text-[var(--deep)] block truncate">{item.name}</span>
                              <span className="text-[10px] text-gray-400">ID: {item.id}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-[var(--ink)]">{item.category}</td>
                          <td className="p-3 text-[var(--deep)]">{item.brand}</td>
                          <td className="p-3 text-gray-600">{item.condition}</td>
                          <td className="p-3 font-bold text-[var(--fuchsia)]">{item.credits} cr</td>
                          <td className="p-3 text-[var(--ink)]">{item.lenderName.split(' ')[0]}</td>
                          <td className="p-3">
                            <span
                              className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                item.status === 'available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'reserved'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() =>
                                adminUpdateItemStatus(
                                  item.id,
                                  item.status === 'available' ? 'swapped' : 'available'
                                )
                              }
                              className="text-[10px] uppercase font-bold text-[var(--deep)] hover:underline px-1.5 py-0.5 rounded bg-gray-100"
                            >
                              {item.status === 'available' ? 'Mark Swapped' : 'Set Available'}
                            </button>
                            <button
                              onClick={() => adminDeleteItem(item.id)}
                              className="text-[10px] uppercase font-bold text-rose-600 hover:underline px-1.5 py-0.5 rounded bg-rose-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CREDIT SYSTEM & LEDGER ================= */}
          {activeAdminTab === 'credits' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Credit Adjustment Tool */}
              <div className="bg-white p-5 rounded-xl border border-[#c8d5c4] space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--deep)]">
                    Direct Credit Adjustment
                  </h3>
                  <p className="text-[11px] text-[var(--ink)] mt-0.5">
                    Grant promotional credits, issue dispute compensation, or slash penalties.
                  </p>
                </div>

                {adjFeedback && (
                  <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-lg text-xs font-bold">
                    {adjFeedback}
                  </div>
                )}

                <form onSubmit={handleAdjustSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      Target Member
                    </label>
                    <select
                      value={adjUser}
                      onChange={(e) => setAdjUser(e.target.value)}
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs text-[var(--deep)] outline-none"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.handle}) — Current: {u.credits} cr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      Amount (Positive to Grant, Negative to Deduct)
                    </label>
                    <input
                      type="number"
                      required
                      value={adjAmount}
                      onChange={(e) => setAdjAmount(Number(e.target.value))}
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs font-bold text-[var(--fuchsia)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--ink)] mb-1">
                      Reason / Audit Note
                    </label>
                    <input
                      type="text"
                      required
                      value={adjReason}
                      onChange={(e) => setAdjReason(e.target.value)}
                      placeholder="e.g. Milan Influencer Onboarding Grant"
                      className="w-full bg-[#f0f5ed] border border-[#c8d5c4] rounded-lg p-2 text-xs text-[var(--deep)] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white font-bold uppercase tracking-wider py-2.5 rounded-full text-xs transition"
                  >
                    Execute Credit Adjustment
                  </button>
                </form>
              </div>

              {/* Right Column: Member Balances & Platform Transaction Ledger */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-[#c8d5c4]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--deep)] mb-3">
                    Platform Member Balances
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {users.map((u) => (
                      <div key={u.id} className="bg-[#f0f5ed] p-2.5 rounded-lg border border-[#c8d5c4]">
                        <span className="text-[10px] font-bold text-[var(--deep)] block truncate">{u.name}</span>
                        <span className="font-serif text-lg font-bold text-[var(--fuchsia)]">{u.credits} cr</span>
                        <span className="text-[9px] text-gray-500 block">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#c8d5c4]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--deep)] mb-3">
                    System Audit Transaction Ledger ({creditHistory.length} events)
                  </h4>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {creditHistory.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center p-2.5 bg-[#f0f5ed] rounded-lg text-xs"
                      >
                        <div>
                          <strong className="text-[var(--deep)] block">{tx.description}</strong>
                          <span className="text-[10px] text-gray-500">
                            User ID: {tx.userId} · Date: {tx.date}
                          </span>
                        </div>
                        <span
                          className={`font-bold font-sans ${
                            tx.type === 'earned' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} cr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SWAP ORDERS PIPELINE ================= */}
          {activeAdminTab === 'swaps' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#c8d5c4]">
                <h3 className="font-serif text-xl font-bold text-[var(--deep)] mb-1">
                  Active Swap Fulfillment Pipeline
                </h3>
                <p className="text-xs text-[var(--ink)]">
                  Verify piece handoffs, attach tracking numbers, and advance orders across status stages.
                </p>
              </div>

              <div className="space-y-3">
                {swaps.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-xl border border-[#c8d5c4] flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[var(--deep)]">Order {order.id}</span>
                        <span className="bg-[var(--sage2)] border border-[var(--fuchsia)] text-[var(--fuchsia)] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink)]">
                        Recipient: <strong>{order.userName}</strong> ({order.userEmail})
                      </p>
                      <p className="text-xs text-[var(--ink)]">
                        Handoff: <strong>{order.deliveryAddress}</strong>
                      </p>
                      <div className="text-[11px] text-[var(--deep)] font-medium mt-1">
                        Items: {order.items.map((i) => i.name).join(', ')} ({order.totalCredits} credits)
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Update Status:
                      </span>
                      {(['Requested', 'Approved', 'Dispatched', 'Delivered', 'Completed'] as const).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => adminUpdateSwapStatus(order.id, status)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition ${
                              order.status === status
                                ? 'bg-[var(--deep)] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: USERS & REVIEWS ================= */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white p-4 rounded-xl border border-[#c8d5c4] flex gap-4 items-start"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-14 h-14 rounded-full object-cover border border-[var(--fuchsia)] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-[var(--deep)]">{u.name}</h4>
                          <span className="text-[11px] text-[var(--ink)]">{u.handle} · {u.location}</span>
                        </div>
                        <span className="bg-[var(--fuchsia)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {u.credits} cr
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{u.bio}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mt-3 pt-2 border-t border-gray-100">
                        <span>{u.rating} ★ Rating</span>
                        <span>{u.swapsCompleted} Swaps</span>
                        <span>Joined {u.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
