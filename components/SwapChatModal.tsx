'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function SwapChatModal() {
  const {
    isChatOpen,
    setIsChatOpen,
    activeConversation,
    conversations,
    setActiveConversation,
    currentUser,
    sendChatMessage
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the message thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (!isChatOpen) return null;

  const currentConv = activeConversation || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;
    sendChatMessage(currentConv.id, inputText);
    setInputText('');
  };

  const handleQuickAction = (text: string) => {
    if (!currentConv) return;
    sendChatMessage(currentConv.id, text);
  };

  const otherParticipantName =
    currentUser.id === currentConv?.lenderId ? currentConv?.claimerName : currentConv?.lenderName;
  const otherParticipantAvatar =
    currentUser.id === currentConv?.lenderId
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      : currentConv?.lenderAvatar;
  const otherParticipantLocation = currentConv?.lenderLocation;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsChatOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[var(--sage)] h-full shadow-2xl flex flex-col justify-between border-l border-[#c8d5c4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#e2ebd9] p-4 border-b border-[#c8d5c4]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--fuchsia)] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#c8d5c4]">
                Swap Channel
              </span>
              <span className="text-xs text-[var(--ink)]">
                {currentConv?.status || 'Coordinating Meetup'}
              </span>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="text-[var(--ink)] hover:text-[var(--fuchsia)] font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          {/* Garment & Swapper Info Capsule */}
          <div className="bg-white/90 p-3 rounded-xl border border-[#c8d5c4] flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={otherParticipantAvatar}
                alt={otherParticipantName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--fuchsia)] shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-[var(--deep)] truncate">
                  {otherParticipantName}
                </h3>
                <p className="text-[10px] text-[var(--ink)] truncate">
                  {otherParticipantLocation} · Swapper
                </p>
              </div>
            </div>

            {/* Garment Thumbnail Context */}
            {currentConv && (
              <div className="flex items-center gap-2 bg-[#f0f5ed] px-2.5 py-1.5 rounded-lg border border-[#c8d5c4] shrink-0 max-w-[170px]">
                <img
                  src={currentConv.itemImage}
                  alt={currentConv.itemName}
                  className="w-7 h-9 object-cover rounded bg-[var(--pink)] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-[var(--deep)] block truncate">
                    {currentConv.itemName}
                  </span>
                  <span className="text-[9px] text-[var(--fuchsia)] font-bold">
                    {currentConv.itemCredits} cr
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Multi-conversation switcher tabs if multiple swaps exist */}
          {conversations.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pt-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversation(c)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap transition ${
                    currentConv?.id === c.id
                      ? 'bg-[var(--fuchsia)] text-white'
                      : 'bg-white border border-[#c8d5c4] text-[var(--deep)] hover:bg-[#f0f5ed]'
                  }`}
                >
                  {c.lenderName.split(' ')[0]} ({c.itemName.split(' ')[0]})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Meetup / Courier Coordination Chips */}
        <div className="px-4 py-2 bg-[#f0f5ed] border-b border-[#c8d5c4] flex gap-2 overflow-x-auto no-scrollbar text-[10px]">
          <span className="text-gray-500 font-bold self-center whitespace-nowrap text-[9px] uppercase">
            Suggest:
          </span>
          <button
            type="button"
            onClick={() => handleQuickAction('Can we meet in Brera at Piazza del Carmine?')}
            className="bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap"
          >
            📍 Brera Meetup
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('Can we do handoff at Navigli - Darsena?')}
            className="bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap"
          >
            📍 Navigli Meetup
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('Could you drop it off at an InPost locker?')}
            className="bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap"
          >
            📦 InPost Locker
          </button>
          <button
            type="button"
            onClick={() => handleQuickAction('Tomorrow around 18:00 works perfectly for me.')}
            className="bg-white border border-[#c8d5c4] hover:border-[var(--fuchsia)] px-2.5 py-1 rounded-full text-[var(--deep)] whitespace-nowrap"
          >
            ⏰ Tomorrow 18:00
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--sage2)]">
          {currentConv?.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover border border-[#c8d5c4] shrink-0 mb-1"
                  />
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? 'bg-[var(--fuchsia)] text-white rounded-br-xs'
                      : 'bg-white text-[var(--deep)] border border-[#c8d5c4] rounded-bl-xs'
                  }`}
                >
                  <div
                    className={`text-[9px] font-bold mb-1 opacity-75 ${
                      isMe ? 'text-white' : 'text-[var(--fuchsia)]'
                    }`}
                  >
                    {isMe ? 'You' : msg.senderName} · {msg.timestamp}
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#c8d5c4] flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${otherParticipantName?.split(' ')[0]} to coordinate handoff...`}
            className="flex-1 bg-[#f0f5ed] border border-[#c8d5c4] rounded-full px-4 py-2.5 text-xs text-[var(--deep)] outline-none focus:border-[var(--fuchsia)]"
          />
          <button
            type="submit"
            className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition shadow-xs"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
