'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp, SwapConversation, P2POrderStatus } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import ProductModal from '../../components/ProductModal';
import SwapBagDrawer from '../../components/SwapBagDrawer';
import ProfileModal from '../../components/ProfileModal';
import ListItemModal from '../../components/ListItemModal';
import AdminDashboard from '../../components/AdminDashboard';
import Footer from '../../components/Footer';

type InboxFolder =
  | 'active'
  | 'unread'
  | 'coordinating'
  | 'courier'
  | 'completed'
  | 'shortlisted'
  | 'declined'
  | 'archived'
  | 'all';

const ORDER_STEPS: { key: P2POrderStatus; label: string; actor: 'swapper' | 'swapee'; desc: string }[] = [
  { key: 'Requested', label: 'Requested', actor: 'swapee', desc: 'Piece requested with swap credits' },
  { key: 'Approved', label: 'Approved', actor: 'swapper', desc: 'Swapper verified fit & accepted request' },
  { key: 'Dispatched', label: 'Dispatched', actor: 'swapper', desc: 'Packed & scheduled for courier/locker' },
  { key: 'Shipped', label: 'Shipped', actor: 'swapper', desc: 'In transit across Milan' },
  { key: 'Delivered', label: 'Delivered', actor: 'swapee', desc: 'Arrived at destination/locker' },
  { key: 'Loved', label: 'Loved ♡', actor: 'swapee', desc: 'Swapee tried fit & released credits' }
];

export default function InboxPage() {
  const {
    currentUser,
    users,
    switchUser,
    conversations,
    sendChatMessage,
    toggleShortlistConversation,
    toggleArchiveConversation,
    markConversationRead,
    advanceP2PStatus,
    setSelectedItem,
    items
  } = useApp();

  const [activeFolder, setActiveFolder] = useState<InboxFolder>('active');
  const [keywordQuery, setKeywordQuery] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [customActionNote, setCustomActionNote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations relevant to the current active customer actor
  const actorConversations = useMemo(() => {
    return conversations.filter(
      (c) => c.claimerId === currentUser.id || c.lenderId === currentUser.id
    );
  }, [conversations, currentUser.id]);

  // Compute folder counts
  const folderCounts = useMemo(() => {
    return {
      active: actorConversations.filter((c) => !c.isArchived && c.status !== 'Declined').length,
      unread: actorConversations.filter((c) => !c.isArchived && c.isUnread).length,
      coordinating: actorConversations.filter((c) => !c.isArchived && (c.orderStatus === 'Requested' || c.orderStatus === 'Approved')).length,
      courier: actorConversations.filter((c) => !c.isArchived && (c.orderStatus === 'Dispatched' || c.orderStatus === 'Shipped')).length,
      completed: actorConversations.filter((c) => !c.isArchived && (c.orderStatus === 'Delivered' || c.orderStatus === 'Loved')).length,
      shortlisted: actorConversations.filter((c) => !c.isArchived && c.isShortlisted).length,
      declined: actorConversations.filter((c) => !c.isArchived && c.status === 'Declined').length,
      archived: actorConversations.filter((c) => c.isArchived).length,
      all: actorConversations.length
    };
  }, [actorConversations]);

  // Filter conversations by selected folder & keyword
  const filteredConversations = useMemo(() => {
    return actorConversations.filter((conv) => {
      // Folder filtering
      if (activeFolder === 'archived') {
        if (!conv.isArchived) return false;
      } else {
        if (conv.isArchived) return false;
        if (activeFolder === 'active' && conv.status === 'Declined') return false;
        if (activeFolder === 'unread' && !conv.isUnread) return false;
        if (activeFolder === 'coordinating' && conv.orderStatus !== 'Requested' && conv.orderStatus !== 'Approved') return false;
        if (activeFolder === 'courier' && conv.orderStatus !== 'Dispatched' && conv.orderStatus !== 'Shipped') return false;
        if (activeFolder === 'completed' && conv.orderStatus !== 'Delivered' && conv.orderStatus !== 'Loved') return false;
        if (activeFolder === 'shortlisted' && !conv.isShortlisted) return false;
        if (activeFolder === 'declined' && conv.status !== 'Declined') return false;
      }

      // Keyword query
      if (!keywordQuery.trim()) return true;
      const q = keywordQuery.toLowerCase();
      const lastMsg = conv.messages[conv.messages.length - 1]?.text.toLowerCase() || '';
      return (
        conv.itemName.toLowerCase().includes(q) ||
        conv.lenderName.toLowerCase().includes(q) ||
        conv.claimerName.toLowerCase().includes(q) ||
        conv.lenderLocation.toLowerCase().includes(q) ||
        conv.orderStatus.toLowerCase().includes(q) ||
        lastMsg.includes(q)
      );
    });
  }, [actorConversations, activeFolder, keywordQuery]);

  // Selected active conversation
  const selectedConversation = useMemo(() => {
    if (!selectedConvId) {
      return filteredConversations[0] || actorConversations[0] || null;
    }
    return actorConversations.find((c) => c.id === selectedConvId) || null;
  }, [selectedConvId, filteredConversations, actorConversations]);

  // Mark as read when selected
  useEffect(() => {
    if (selectedConversation && selectedConversation.isUnread) {
      markConversationRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversation) return;
    sendChatMessage(selectedConversation.id, replyText);
    setReplyText('');
  };

  const handleQuickChip = (text: string) => {
    if (!selectedConversation) return;
    sendChatMessage(selectedConversation.id, text);
  };

  // Determine role of currently logged in customer in this order
  const isSwapper = selectedConversation ? currentUser.id === selectedConversation.lenderId : false;
  const isSwapee = selectedConversation ? currentUser.id === selectedConversation.claimerId : false;

  const currentStepIndex = selectedConversation
    ? ORDER_STEPS.findIndex((s) => s.key === selectedConversation.orderStatus)
    : 0;

  return (
    <main className="min-h-screen bg-[#f3f6f1] text-[var(--fuchsia)] font-sans">
      <Navbar />

      {/* P2P Flow Guidance Banner */}
      <section className="bg-gradient-to-r from-[var(--fuchsia)] to-[var(--deep)] text-white py-2.5 px-[5%] text-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              P2P Exchange Workflow
            </span>
            <span className="font-medium text-white/95">
              Orders transition: <strong>Requested</strong> → <strong>Approved</strong> → <strong>Dispatched</strong> → <strong>Shipped</strong> → <strong>Delivered</strong> → <strong>Loved ♡</strong>
            </span>
          </div>
          <span className="text-[11px] text-white/80">
            Escrow protects credits until swapee confirms &ldquo;Loved&rdquo;
          </span>
        </div>
      </section>

      {/* Actor Switcher & Credits Top Bar */}
      <section className="bg-white border-b border-[#c8d5c4] py-3.5 px-[5%]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Customer Perspective Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[var(--ink)] font-bold">
              Active Customer Actor:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {users.slice(0, 4).map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setSelectedConvId(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      isSelected
                        ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                        : 'bg-[#f5e9e9] text-[var(--deep)] hover:bg-[#ebdada] border border-[#c8d5c4]/60'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{u.name.split(' ')[0]}</span>
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Embedded Customer Credit Portfolio */}
          <div className="flex items-center gap-4 flex-wrap bg-[#f5e9e9]/80 px-4 py-2 rounded-2xl border border-[#c8d5c4]">
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                Credit Balance
              </span>
              <span className="font-bold text-[var(--deep)] text-sm">
                {currentUser.credits} CR
              </span>
            </div>
            <div className="h-6 w-px bg-[#c8d5c4]"></div>
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                In Swap Escrow
              </span>
              <span className="font-bold text-amber-700 text-sm">
                45 CR (Pending)
              </span>
            </div>
            <div className="h-6 w-px bg-[#c8d5c4]"></div>
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                Exchange Formula
              </span>
              <span className="text-[11px] font-semibold text-[var(--deep)]">
                35% Retail + 45% Resale + 10% Ask
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Inbox Application Shell (Styled per reference) */}
      <section className="py-8 px-[5%] max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--fuchsia)]">
                Messages &amp; Swap Orders
              </h1>
              <span className="bg-[#eaf1e7] text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Live P2P Protocol
              </span>
            </div>
            <p className="text-xs text-[var(--ink)] mt-0.5">
              Review requests, coordinate meetups in Brera &amp; Navigli, manage InPost lockers, and advance swap stages for {currentUser.name}.
            </p>
          </div>

          {/* Search by Keywords (Exact match to reference top right search) */}
          <div className="relative w-full md:w-80">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 stroke-[var(--ink)] fill-none stroke-2 pointer-events-none"
              viewBox="0 0 24 24"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              type="text"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              placeholder="Search by keywords"
              className="w-full bg-white border border-[#c8d5c4] rounded-lg py-2 pl-10 pr-9 text-xs md:text-sm text-[var(--deep)] outline-none focus:ring-2 focus:ring-[var(--fuchsia)]/30"
            />
            {keywordQuery && (
              <button
                type="button"
                onClick={() => setKeywordQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ink)] hover:text-black"
              >
                ⊗
              </button>
            )}
          </div>
        </div>

        {/* Triple / Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Filter Navigation (Matches HousingAnywhere sidebar) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#c8d5c4] p-3 shadow-xs">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveFolder('active')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'active'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✉</span>
                  <span>Active</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.active}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('unread')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'unread'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✉</span>
                  <span>Unread</span>
                </div>
                {folderCounts.unread > 0 ? (
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {folderCounts.unread}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-gray-400">0</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('coordinating')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'coordinating'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">⏳</span>
                  <span>Requested / Approved</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.coordinating}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('courier')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'courier'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Dispatched / Shipped</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.courier}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('completed')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'completed'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">💖</span>
                  <span>Delivered &amp; Loved</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.completed}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('shortlisted')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'shortlisted'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">☆</span>
                  <span>Shortlisted</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.shortlisted}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('declined')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'declined'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🚫</span>
                  <span>Declined</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.declined}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('archived')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'archived'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🗄</span>
                  <span>Archived</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.archived}
                </span>
              </button>

              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveFolder('all')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeFolder === 'all'
                      ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                      : 'text-[var(--ink)] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">📑</span>
                    <span>All messages</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">
                    {folderCounts.all}
                  </span>
                </button>
              </div>
            </nav>
          </div>

          {/* Middle Conversation Cards List (Matches reference message list) */}
          <div className="lg:col-span-4 space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#c8d5c4] p-10 text-center text-xs text-[var(--ink)]">
                <span className="block text-2xl mb-2 font-serif">✉</span>
                No conversations in &ldquo;{activeFolder}&rdquo;.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConversation?.id === conv.id;
                const lastMessage = conv.messages[conv.messages.length - 1];
                const otherPartyName =
                  currentUser.id === conv.lenderId ? conv.claimerName : conv.lenderName;
                const otherPartyAvatar =
                  currentUser.id === conv.lenderId
                    ? conv.claimerAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    : conv.lenderAvatar;

                const isDeclined = conv.status === 'Declined';

                // Stepper color badge
                const stageColor =
                  conv.orderStatus === 'Loved'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : conv.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : conv.orderStatus === 'Shipped' || conv.orderStatus === 'Dispatched'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`bg-white rounded-2xl border transition-all p-4 cursor-pointer relative ${
                      isSelected
                        ? 'border-[var(--fuchsia)] ring-2 ring-[var(--fuchsia)]/20 shadow-md bg-[#fafdf9]'
                        : 'border-[#c8d5c4] hover:border-[#a3b99e] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <img
                        src={otherPartyAvatar}
                        alt={otherPartyName}
                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#c8d5c4]"
                      />

                      {/* Content Area */}
                      <div className="flex-1 min-w-0">
                        {/* Status Label (Matches crimson "Declined" in screenshot or stage pill) */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isDeclined ? 'bg-red-50 text-[#c22d4b] border-red-200' : stageColor
                            }`}
                          >
                            {isDeclined ? 'Declined' : `Stage: ${conv.orderStatus}`}
                          </span>

                          {/* Quick Actions (Shortlist, Archive) */}
                          <div
                            className="flex items-center gap-2.5 text-[11px] text-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => toggleShortlistConversation(conv.id)}
                              className={`flex items-center gap-1 hover:text-black transition ${
                                conv.isShortlisted ? 'text-amber-600 font-bold' : ''
                              }`}
                            >
                              <span>{conv.isShortlisted ? '★' : '☆'}</span>
                              <span className="hidden sm:inline">
                                {conv.isShortlisted ? 'Shortlisted' : 'Shortlist'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleArchiveConversation(conv.id)}
                              className="flex items-center gap-1 hover:text-black transition"
                            >
                              <span>🗄</span>
                              <span className="hidden sm:inline">
                                {conv.isArchived ? 'Unarchive' : 'Archive'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Participant Name & Role Tag */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <h3 className="font-sans font-bold text-sm text-gray-900 truncate">
                            {otherPartyName}
                          </h3>
                          <span className="text-[9px] text-[var(--ink)] bg-gray-100 px-1.5 py-0.2 rounded">
                            {currentUser.id === conv.lenderId ? 'Swapee' : 'Swapper'}
                          </span>
                        </div>

                        {/* Location Subline with Item & Date info */}
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {conv.lenderLocation} · {conv.lastUpdated || 'Recent'}
                        </p>

                        {/* Embedded Garment Capsule */}
                        <div className="mt-2.5 flex items-center gap-2.5 bg-[#f5e9e9]/60 p-2 rounded-xl border border-[#c8d5c4]/60">
                          <img
                            src={conv.itemImage}
                            alt={conv.itemName}
                            className="w-9 h-9 rounded-md object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold text-[var(--deep)] truncate">
                              {conv.itemName}
                            </h4>
                            <span className="text-[10px] text-[var(--ink)] block">
                              {conv.itemCredits} CR · {conv.itemBrand || 'Milan Archive'} · {conv.itemSize || 'M'}
                            </span>
                          </div>
                          <span className="text-[10px] bg-white text-[var(--fuchsia)] font-bold px-2 py-0.5 rounded-full border border-[#c8d5c4]/50 shrink-0">
                            €1 = 1 CR
                          </span>
                        </div>

                        {/* Message Preview snippet */}
                        <div className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {lastMessage ? (
                            <span>
                              <strong className="text-gray-900 font-medium">
                                {lastMessage.senderName.split(' ')[0]}:
                              </strong>{' '}
                              {lastMessage.text}
                            </span>
                          ) : (
                            <span className="italic">No messages yet</span>
                          )}
                        </div>

                        {/* Timestamp on right */}
                        <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400">
                          <span>Swap Ref: {conv.swapId || 'anc-01'}</span>
                          <span>{conv.lastUpdated || 'Today'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel: Interactive P2P Stepper, Conversation & Embedded Swap Logistics */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c8d5c4] shadow-xs flex flex-col h-[780px] overflow-hidden">
            {selectedConversation ? (
              <>
                {/* 1. INTERACTIVE P2P ORDER LIFECYCLE STEPPER HEADER */}
                <div className="bg-[#f7faf5] border-b border-[#c8d5c4] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--fuchsia)]">
                      Swap Lifecycle · P2P State
                    </span>
                    <span className="text-xs font-bold text-[var(--deep)] bg-white px-2.5 py-0.5 rounded-full border border-[#c8d5c4]">
                      Order #{selectedConversation.swapId || '901'}
                    </span>
                  </div>

                  {/* 6-Stage Visual Stepper */}
                  <div className="grid grid-cols-6 gap-1 my-3">
                    {ORDER_STEPS.map((step, idx) => {
                      const isPast = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${
                              isCurrent
                                ? 'bg-[var(--fuchsia)] text-white border-[var(--fuchsia)] ring-2 ring-[var(--fuchsia)]/30 scale-105'
                                : isPast
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                          >
                            {isPast ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] mt-1 font-semibold truncate max-w-full ${
                              isCurrent
                                ? 'text-[var(--fuchsia)] font-bold'
                                : isPast
                                ? 'text-emerald-700'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Controls based on Swapper vs Swapee */}
                  <div className="mt-3 bg-white p-3 rounded-xl border border-[#c8d5c4] shadow-xs">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[var(--ink)]">
                        Your Role:{' '}
                        <strong className="text-[var(--deep)]">
                          {isSwapper ? 'Swapper (Offering Piece)' : isSwapee ? 'Swapee (Receiving Fit)' : 'Observer'}
                        </strong>
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Current: <strong>{selectedConversation.orderStatus}</strong>
                      </span>
                    </div>

                    {/* CONTEXTUAL ACTION BUTTONS TO MOVE STAGES */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Swapper Action: Move from Requested -> Approved */}
                      {selectedConversation.orderStatus === 'Requested' && (
                        <button
                          type="button"
                          onClick={() => advanceP2PStatus(selectedConversation.id, 'Approved')}
                          className="w-full bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold py-2 rounded-full transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>✓</span> Swapper: Accept &amp; Approve Swap Request
                        </button>
                      )}

                      {/* Swapper Action: Move from Approved -> Dispatched */}
                      {selectedConversation.orderStatus === 'Approved' && (
                        <button
                          type="button"
                          onClick={() => advanceP2PStatus(selectedConversation.id, 'Dispatched')}
                          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold py-2 rounded-full transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>📦</span> Swapper: Pack &amp; Mark Dispatched
                        </button>
                      )}

                      {/* Swapper Action: Move from Dispatched -> Shipped */}
                      {selectedConversation.orderStatus === 'Dispatched' && (
                        <button
                          type="button"
                          onClick={() => advanceP2PStatus(selectedConversation.id, 'Shipped')}
                          className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded-full transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>🚚</span> Swapper/Courier: Drop in Locker (Mark Shipped)
                        </button>
                      )}

                      {/* Swapee Action: Move from Shipped -> Delivered */}
                      {selectedConversation.orderStatus === 'Shipped' && (
                        <button
                          type="button"
                          onClick={() => advanceP2PStatus(selectedConversation.id, 'Delivered')}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-full transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>📬</span> Swapee: Confirm Delivery from InPost Locker
                        </button>
                      )}

                      {/* Swapee Action: Move from Delivered -> Loved! */}
                      {selectedConversation.orderStatus === 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => advanceP2PStatus(selectedConversation.id, 'Loved')}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-full transition shadow-xs flex items-center justify-center gap-1.5 animate-pulse"
                        >
                          <span>💖</span> Swapee: Fit Received &amp; Loved! (Release {selectedConversation.itemCredits} CR)
                        </button>
                      )}

                      {/* Completed / Loved State */}
                      {selectedConversation.orderStatus === 'Loved' && (
                        <div className="w-full bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2 rounded-xl text-center font-bold">
                          🎉 Swap Completed &amp; Loved! {selectedConversation.itemCredits} CR released to swapper.
                        </div>
                      )}

                      {/* Quick stage selector to test any transition */}
                      <div className="w-full pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                        <span>Advance to stage:</span>
                        <div className="flex gap-1">
                          {ORDER_STEPS.map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => advanceP2PStatus(selectedConversation.id, s.key)}
                              className={`px-1.5 py-0.5 rounded border ${
                                selectedConversation.orderStatus === s.key
                                  ? 'bg-[var(--fuchsia)] text-white border-[var(--fuchsia)] font-bold'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {s.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Embedded Garment & Credit Breakdown Details */}
                <div className="bg-[#f0f5ed] p-3 border-b border-[#c8d5c4]">
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedConversation.itemImage}
                      alt={selectedConversation.itemName}
                      className="w-14 h-16 rounded-xl object-cover shrink-0 border border-[#c8d5c4] shadow-xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--fuchsia)]">
                          {selectedConversation.itemBrand || 'Verified Garment'}
                        </span>
                        <span className="bg-white text-[var(--deep)] font-bold text-xs px-2 py-0.5 rounded-full shadow-xs">
                          {selectedConversation.itemCredits} CR
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-[var(--deep)] truncate">
                        {selectedConversation.itemName}
                      </h3>
                      <p className="text-[10px] text-[var(--ink)]">
                        Condition: {selectedConversation.itemCondition || 'Like new'} · Size: {selectedConversation.itemSize || 'M'} · Origin: {selectedConversation.lenderLocation}
                      </p>

                      {/* 35 / 45 / 10 Credit Valuation Formula Breakdown */}
                      <div className="mt-1.5 bg-white/80 p-1.5 rounded-lg border border-[#c8d5c4]/60 text-[9px] text-[var(--ink)] flex justify-between items-center">
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-gray-500">Retail 35%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemOriginalPrice || 150}</span>
                        </div>
                        <span>+</span>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-gray-500">Resale 45%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemResalePrice || 70}</span>
                        </div>
                        <span>+</span>
                        <div>
                          <span className="block text-[8px] uppercase font-bold text-gray-500">Seller 10%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemSellerPrice || 55}</span>
                        </div>
                        <span>=</span>
                        <div className="text-right">
                          <span className="block text-[8px] uppercase font-bold text-[var(--fuchsia)]">Allotted</span>
                          <span className="font-black text-[var(--fuchsia)] text-[11px]">{selectedConversation.itemCredits} CR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Message Bubble Thread Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#fdfefc]">
                  {selectedConversation.messages.map((msg) => {
                    const isSystem = msg.senderId === 'system';
                    const isMe = msg.senderId === currentUser.id;

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="my-2 bg-[#f5e9e9] border border-[#c8d5c4] rounded-xl p-2 text-center text-[11px] text-[var(--deep)] font-medium">
                          {msg.text}
                          <span className="block text-[9px] text-gray-400 mt-0.5">{msg.timestamp}</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 max-w-[85%] ${
                          isMe ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-[#c8d5c4]"
                        />
                        <div>
                          <div
                            className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[var(--fuchsia)] text-white rounded-tr-none'
                                : 'bg-[#f0f5ed] text-[var(--deep)] rounded-tl-none border border-[#c8d5c4]/60'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span
                            className={`block text-[9px] text-gray-400 mt-1 ${
                              isMe ? 'text-right' : ''
                            }`}
                          >
                            {msg.senderName.split(' ')[0]} · {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* 4. Quick Reply Suggestions */}
                <div className="px-3 py-1.5 bg-gray-50 border-t border-[#c8d5c4] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Piazza del Carmine in Brera works perfectly for me tomorrow at 17:30!')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    📍 Meet at Brera (17:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Please drop it into the InPost locker #412 at Garibaldi station.')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    📦 InPost Locker Garibaldi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Received the piece in Milan! Quality is immaculate. Confirmed handoff.')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    🤝 Confirm Handoff
                  </button>
                </div>

                {/* 5. Text Message Composer */}
                <form
                  onSubmit={handleSendReply}
                  className="p-2.5 bg-white border-t border-[#c8d5c4] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Message ${
                      currentUser.id === selectedConversation.lenderId
                        ? selectedConversation.claimerName.split(' ')[0]
                        : selectedConversation.lenderName.split(' ')[0]
                    }...`}
                    className="flex-1 bg-gray-50 border border-[#c8d5c4] rounded-full py-2 px-4 text-xs text-[var(--deep)] outline-none focus:ring-2 focus:ring-[var(--fuchsia)]/30"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-xs"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center p-8 text-xs text-[var(--ink)]">
                Select a message thread on the left to review swap details and coordinate handoff.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global Modals */}
      <ProductModal />
      <SwapBagDrawer />
      <ProfileModal />
      <ListItemModal />
      <AdminDashboard />

      <Footer />
    </main>
  );
}


  return (
    <main className="min-h-screen bg-[#f3f6f1] text-[var(--fuchsia)] font-sans">
      <Navbar />

      {/* Actor Switcher & Credits Top Bar */}
      <section className="bg-white border-b border-[#c8d5c4] py-3.5 px-[5%]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Customer Perspective Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[var(--ink)] font-bold">
              Active Customer:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {users.slice(0, 4).map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUser(u.id);
                      setSelectedConvId(null);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      isSelected
                        ? 'bg-[var(--fuchsia)] text-white shadow-xs'
                        : 'bg-[#f5e9e9] text-[var(--deep)] hover:bg-[#ebdada] border border-[#c8d5c4]/60'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{u.name.split(' ')[0]}</span>
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Embedded Customer Credit Portfolio */}
          <div className="flex items-center gap-4 flex-wrap bg-[#f5e9e9]/80 px-4 py-2 rounded-2xl border border-[#c8d5c4]">
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                Credit Balance
              </span>
              <span className="font-bold text-[var(--deep)] text-sm">
                {currentUser.credits} CR
              </span>
            </div>
            <div className="h-6 w-px bg-[#c8d5c4]"></div>
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                In Swap Escrow
              </span>
              <span className="font-bold text-amber-700 text-sm">
                45 CR (Pending)
              </span>
            </div>
            <div className="h-6 w-px bg-[#c8d5c4]"></div>
            <div className="text-xs">
              <span className="text-[var(--ink)] block text-[10px] uppercase font-bold">
                Exchange Formula
              </span>
              <span className="text-[11px] font-semibold text-[var(--deep)]">
                35% Retail + 45% Resale + 10% Ask
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Inbox Application Shell (Styled per reference) */}
      <section className="py-8 px-[5%] max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--fuchsia)]">
              Messages
            </h1>
            <p className="text-xs text-[var(--ink)] mt-0.5">
              Coordinating Milanese peer-to-peer wardrobe handoffs, lockers, and swap deliveries for {currentUser.name}.
            </p>
          </div>

          {/* Search by Keywords (Exact match to reference top right search) */}
          <div className="relative w-full md:w-80">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 stroke-[var(--ink)] fill-none stroke-2 pointer-events-none"
              viewBox="0 0 24 24"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              type="text"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              placeholder="Search by keywords"
              className="w-full bg-white border border-[#c8d5c4] rounded-lg py-2 pl-10 pr-9 text-xs md:text-sm text-[var(--deep)] outline-none focus:ring-2 focus:ring-[var(--fuchsia)]/30"
            />
            {keywordQuery && (
              <button
                type="button"
                onClick={() => setKeywordQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ink)] hover:text-black"
              >
                ⊗
              </button>
            )}
          </div>
        </div>

        {/* Triple / Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Filter Navigation (Matches HousingAnywhere sidebar) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#c8d5c4] p-3 shadow-xs">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveFolder('active')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'active'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✉</span>
                  <span>Active</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.active}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('unread')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'unread'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✉</span>
                  <span>Unread</span>
                </div>
                {folderCounts.unread > 0 ? (
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {folderCounts.unread}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-gray-400">0</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('coordinating')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'coordinating'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">⏳</span>
                  <span>Pending / Coordinating</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.coordinating}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('courier')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'courier'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Courier / Locker</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.courier}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('completed')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'completed'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🤝</span>
                  <span>Swapped / Completed</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.completed}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('shortlisted')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'shortlisted'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">☆</span>
                  <span>Shortlisted</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.shortlisted}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('declined')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'declined'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🚫</span>
                  <span>Declined</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.declined}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFolder('archived')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeFolder === 'archived'
                    ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                    : 'text-[var(--ink)] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🗄</span>
                  <span>Archived</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  {folderCounts.archived}
                </span>
              </button>

              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveFolder('all')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeFolder === 'all'
                      ? 'bg-[#eaf1e7] text-[var(--deep)] font-bold'
                      : 'text-[var(--ink)] hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">📑</span>
                    <span>All messages</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">
                    {folderCounts.all}
                  </span>
                </button>
              </div>
            </nav>
          </div>

          {/* Middle Conversation Cards List (Matches reference message list) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredConversations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#c8d5c4] p-10 text-center text-xs text-[var(--ink)]">
                <span className="block text-2xl mb-2 font-serif">✉</span>
                No conversations in &ldquo;{activeFolder}&rdquo;.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConversation?.id === conv.id;
                const lastMessage = conv.messages[conv.messages.length - 1];
                const otherPartyName =
                  currentUser.id === conv.lenderId ? conv.claimerName : conv.lenderName;
                const otherPartyAvatar =
                  currentUser.id === conv.lenderId
                    ? conv.claimerAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    : conv.lenderAvatar;

                // Status tag styling
                const isDeclined = conv.status === 'Declined';
                const isCompleted = conv.status === 'Handoff Completed';
                const isCourier = conv.status === 'Courier Scheduled';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`bg-white rounded-2xl border transition-all p-4 cursor-pointer relative ${
                      isSelected
                        ? 'border-[var(--fuchsia)] ring-2 ring-[var(--fuchsia)]/20 shadow-md bg-[#fafdf9]'
                        : 'border-[#c8d5c4] hover:border-[#a3b99e] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <img
                        src={otherPartyAvatar}
                        alt={otherPartyName}
                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#c8d5c4]"
                      />

                      {/* Content Area */}
                      <div className="flex-1 min-w-0">
                        {/* Status Label (Matches crimson "Declined" in screenshot) */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-bold ${
                              isDeclined
                                ? 'text-[#c22d4b]'
                                : isCompleted
                                ? 'text-emerald-700'
                                : isCourier
                                ? 'text-indigo-700'
                                : 'text-[var(--deep)]'
                            }`}
                          >
                            {conv.status}
                          </span>

                          {/* Quick Actions (Shortlist, Archive) */}
                          <div
                            className="flex items-center gap-3 text-[11px] text-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => toggleShortlistConversation(conv.id)}
                              className={`flex items-center gap-1 hover:text-black transition ${
                                conv.isShortlisted ? 'text-amber-600 font-bold' : ''
                              }`}
                            >
                              <span>{conv.isShortlisted ? '★' : '☆'}</span>
                              <span className="hidden sm:inline">
                                {conv.isShortlisted ? 'Shortlisted' : 'Shortlist'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleArchiveConversation(conv.id)}
                              className="flex items-center gap-1 hover:text-black transition"
                            >
                              <span>🗄</span>
                              <span className="hidden sm:inline">
                                {conv.isArchived ? 'Unarchive' : 'Archive'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Participant Name */}
                        <h3 className="font-sans font-bold text-sm text-gray-900 mt-0.5">
                          {otherPartyName}
                        </h3>

                        {/* Location Subline with Item & Date info */}
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {conv.lenderLocation} · {conv.lastUpdated || 'Recent'}
                        </p>

                        {/* Embedded Garment Capsule */}
                        <div className="mt-2.5 flex items-center gap-2.5 bg-[#f5e9e9]/60 p-2 rounded-xl border border-[#c8d5c4]/60">
                          <img
                            src={conv.itemImage}
                            alt={conv.itemName}
                            className="w-9 h-9 rounded-md object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold text-[var(--deep)] truncate">
                              {conv.itemName}
                            </h4>
                            <span className="text-[10px] text-[var(--ink)] block">
                              {conv.itemCredits} CR · {conv.itemBrand || 'Milan Archive'} · {conv.itemSize || 'M'}
                            </span>
                          </div>
                          <span className="text-[10px] bg-white text-[var(--fuchsia)] font-bold px-2 py-0.5 rounded-full border border-[#c8d5c4]/50 shrink-0">
                            €1 = 1 CR
                          </span>
                        </div>

                        {/* Message Preview snippet */}
                        <div className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {lastMessage ? (
                            <span>
                              <strong className="text-gray-900 font-medium">
                                {lastMessage.senderName.split(' ')[0]}:
                              </strong>{' '}
                              {lastMessage.text}
                            </span>
                          ) : (
                            <span className="italic">No messages yet</span>
                          )}
                        </div>

                        {/* Timestamp on right */}
                        <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400">
                          <span>Swap Ref: {conv.swapId || 'anc-01'}</span>
                          <span>{conv.lastUpdated || 'Today'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel: Detailed Conversation & Embedded Swap Logistics */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#c8d5c4] shadow-xs flex flex-col h-[700px] overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Embedded Garment & Credit Breakdown Header */}
                <div className="bg-[#f0f5ed] p-4 border-b border-[#c8d5c4]">
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedConversation.itemImage}
                      alt={selectedConversation.itemName}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-[#c8d5c4] shadow-xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--fuchsia)]">
                          {selectedConversation.itemBrand || 'Verified Garment'}
                        </span>
                        <span className="bg-white text-[var(--deep)] font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                          {selectedConversation.itemCredits} CR
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[var(--deep)] truncate mt-0.5">
                        {selectedConversation.itemName}
                      </h3>
                      <p className="text-[11px] text-[var(--ink)]">
                        Condition: {selectedConversation.itemCondition || 'Like new'} · Size: {selectedConversation.itemSize || 'M'}
                      </p>

                      {/* 35 / 45 / 10 Credit Valuation Formula Breakdown */}
                      <div className="mt-2 bg-white/80 p-2 rounded-lg border border-[#c8d5c4]/60 text-[10px] text-[var(--ink)] flex justify-between items-center">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider font-bold text-gray-500">Retail 35%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemOriginalPrice || 150}</span>
                        </div>
                        <span>+</span>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider font-bold text-gray-500">Resale 45%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemResalePrice || 70}</span>
                        </div>
                        <span>+</span>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider font-bold text-gray-500">Seller 10%</span>
                          <span className="font-bold text-[var(--deep)]">€{selectedConversation.itemSellerPrice || 55}</span>
                        </div>
                        <span>=</span>
                        <div className="text-right">
                          <span className="block text-[8px] uppercase tracking-wider font-bold text-[var(--fuchsia)]">Allotted</span>
                          <span className="font-black text-[var(--fuchsia)] text-xs">{selectedConversation.itemCredits} CR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-3 pt-2.5 border-t border-[#c8d5c4]/60 flex items-center justify-between text-xs">
                    <span className="text-[var(--ink)] flex items-center gap-1.5">
                      <span>📍</span>
                      <strong className="text-[var(--deep)]">{selectedConversation.lenderLocation}</strong>
                    </span>
                    <span className="text-[10px] font-bold text-[var(--fuchsia)] bg-[#f5e9e9] px-2 py-0.5 rounded-full">
                      {selectedConversation.status}
                    </span>
                  </div>
                </div>

                {/* Message Bubble Thread Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfefc]">
                  {selectedConversation.messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 max-w-[85%] ${
                          isMe ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-[#c8d5c4]"
                        />
                        <div>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[var(--fuchsia)] text-white rounded-tr-none'
                                : 'bg-[#f0f5ed] text-[var(--deep)] rounded-tl-none border border-[#c8d5c4]/60'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span
                            className={`block text-[9px] text-gray-400 mt-1 ${
                              isMe ? 'text-right' : ''
                            }`}
                          >
                            {msg.senderName.split(' ')[0]} · {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Reply Suggestions */}
                <div className="px-3 py-2 bg-gray-50 border-t border-[#c8d5c4] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Piazza del Carmine in Brera works perfectly for me tomorrow at 17:30!')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    📍 Meet at Brera (17:30)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Please drop it into the InPost locker #412 at Garibaldi station.')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    📦 InPost Locker Garibaldi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickChip('Received the piece in Milan! Quality is immaculate. Confirmed handoff.')}
                    className="text-[10px] bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap transition"
                  >
                    🤝 Confirm Handoff
                  </button>
                </div>

                {/* Text Message Composer */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 bg-white border-t border-[#c8d5c4] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Message ${
                      currentUser.id === selectedConversation.lenderId
                        ? selectedConversation.claimerName.split(' ')[0]
                        : selectedConversation.lenderName.split(' ')[0]
                    }...`}
                    className="flex-1 bg-gray-50 border border-[#c8d5c4] rounded-full py-2 px-4 text-xs text-[var(--deep)] outline-none focus:ring-2 focus:ring-[var(--fuchsia)]/30"
                  />
                  <button
                    type="submit"
                    className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-xs"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center p-8 text-xs text-[var(--ink)]">
                Select a message thread on the left to review swap details and coordinate handoff.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global Modals */}
      <ProductModal />
      <SwapBagDrawer />
      <ProfileModal />
      <ListItemModal />
      <AdminDashboard />

      <Footer />
    </main>
  );
}
