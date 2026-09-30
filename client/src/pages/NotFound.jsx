// client/src/pages/NotFound.jsx
// Branded 404 error page.

import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Compass, ArrowLeft } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 pt-24 pb-16 relative">
      <AmbientBackground />

      <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-10 border border-slate-200/80 shadow-lg space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C89B3C] flex items-center justify-center mx-auto shadow-xs">
          <Building2 className="w-8 h-8 stroke-[1.8]" />
        </div>

        <h1 className="font-serif text-5xl font-bold text-[#13293D]">
          404
        </h1>
        <h2 className="font-serif text-xl font-bold text-slate-800">
          Residence Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The property or page you are seeking does not exist or may have been archived.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#13293D] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C89B3C]" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Compass className="w-4 h-4 text-[#C89B3C]" />
            <span>Browse Listings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
