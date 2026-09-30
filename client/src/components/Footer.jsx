// client/src/components/Footer.jsx
// Site footer with brand narrative, quick links, city directory, and newsletter signup.

import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowUpRight, Mail, Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#13293D] text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#C89B3C] flex items-center justify-center text-[#13293D] shadow-sm">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                BrickNest<span className="text-[#C89B3C]">.</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-300/80 leading-relaxed max-w-sm">
              BrickNest curates exceptional architectural homes, hill-country retreats, urban cast-iron lofts, and waterfront sanctuaries. Grounded in transparent listings, verified specs, and direct lister connections.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-amber-300/90">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Verified Listings
              </span>
              <span className="flex items-center gap-1.5 text-amber-300/90">
                <Shield className="w-3.5 h-3.5" /> Direct Owner Inquiries
              </span>
            </div>
          </div>

          {/* Col 3: Explore Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C89B3C]">
              Explore Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings?listingType=sale" className="hover:text-white transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/listings?listingType=rent" className="hover:text-white transition-colors">
                  Residences for Rent
                </Link>
              </li>
              <li>
                <Link to="/listings?propertyType=villa" className="hover:text-white transition-colors">
                  Architectural Villas
                </Link>
              </li>
              <li>
                <Link to="/listings?propertyType=apartment" className="hover:text-white transition-colors">
                  Urban Lofts & Penthouses
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">
                  Saved Shortlists
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Metropolitan Markets */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C89B3C]">
              Featured Cities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings?city=Austin" className="hover:text-white transition-colors">
                  Austin, TX
                </Link>
              </li>
              <li>
                <Link to="/listings?city=New York" className="hover:text-white transition-colors">
                  New York, NY
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Miami" className="hover:text-white transition-colors">
                  Miami, FL
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Denver" className="hover:text-white transition-colors">
                  Denver, CO
                </Link>
              </li>
              <li>
                <Link to="/listings?city=Chicago" className="hover:text-white transition-colors">
                  Chicago, IL
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Private Editorial / Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C89B3C]">
              Architectural Dispatch
            </h4>
            <p className="text-xs text-slate-400">
              Receive private previews of off-market residences and quarterly architectural market insights.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to the BrickNest Dispatch!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/10 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-lg border border-white/15 focus:outline-none focus:border-[#C89B3C]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-[#C89B3C] text-[#13293D] font-semibold text-xs rounded hover:bg-amber-400 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BrickNest Real Estate Portal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Fair Housing Pledge</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
