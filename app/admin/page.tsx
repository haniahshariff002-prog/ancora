'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import AdminDashboard from '../../components/AdminDashboard';
import Link from 'next/link';

export default function AdminPage() {
  const { setIsAdminOpen } = useApp();

  useEffect(() => {
    setIsAdminOpen(true);
  }, [setIsAdminOpen]);

  return (
    <div className="min-h-screen bg-[var(--sage)] p-6">
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="font-serif text-4xl font-bold text-[var(--fuchsia)] mb-4">
          Ancora Admin Studio
        </h1>
        <p className="text-sm text-[var(--ink)] mb-6">
          The operations dashboard is active. You can manage inventory, credits, members, and swaps.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--fuchsia)] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[var(--deep)] transition"
        >
          ← Return to Storefront
        </Link>
      </div>

      <AdminDashboard />
    </div>
  );
}
