'use client';

import React, { useState } from 'react';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setMsg({ text: 'Please enter a valid university or personal email.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setMsg(null);

    setTimeout(() => {
      setMsg({
        text: '✓ You’re on the VIP early access list! Check your inbox for your 50 credit welcome grant.',
        isError: false
      });
      setIsSubmitting(false);
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-20 md:py-28 px-[5%] text-center bg-[radial-gradient(ellipse_at_left,#f5e9e9,transparent_25%),radial-gradient(ellipse_at_right,#f5e9e9,transparent_25%),var(--sage)]" id="signup">
      <div className="max-w-3xl mx-auto">
        <div className="uppercase tracking-[0.25em] text-[11px] font-bold text-[var(--fuchsia)]">
          A new way to get dressed
        </div>

        <h2 className="font-serif font-medium tracking-[-0.045em] leading-[0.91] text-[clamp(48px,7vw,100px)] my-4 text-[var(--fuchsia)]">
          New fits.<br />
          <em className="font-normal italic">Same bank balance.</em>
        </h2>

        <p className="text-sm md:text-base text-[var(--ink)] max-w-md mx-auto mb-8">
          Join 2,400+ style enthusiasts across Milan, Rome, and Florence reserving early access.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your university or work email..."
            className="flex-1 bg-white border border-[#c8d5c4] rounded-full px-5 py-3.5 text-xs text-[var(--deep)] outline-none focus:ring-2 focus:ring-[var(--fuchsia)]/40"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--fuchsia)] hover:bg-[var(--deep)] text-white font-bold text-[11px] tracking-widest uppercase px-7 py-3.5 rounded-full transition shadow-md whitespace-nowrap"
          >
            {isSubmitting ? 'Joining...' : 'Get Early Access'}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-xs font-bold ${
              msg.isError ? 'text-rose-700' : 'text-emerald-800'
            }`}
          >
            {msg.text}
          </p>
        )}

        <p className="text-[11px] text-[var(--ink)] mt-4">
          No spam. Just your closet invite and 50 welcome credits upon launch.
        </p>
      </div>
    </section>
  );
}
