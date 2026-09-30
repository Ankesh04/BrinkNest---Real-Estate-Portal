// client/src/pages/Listings.jsx
// Main property search and discovery page.
// Combines FilterSidebar with a responsive property grid (1 col mobile -> 2 tablet -> 3 desktop),
// sorting dropdown, active filter chips, and smooth Framer Motion staggered reveals.

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ArrowUpDown, 
  Home as HomeIcon, 
  SearchX, 
  X, 
  RotateCcw 
} from 'lucide-react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import AmbientBackground from '../components/AmbientBackground';

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read current sort option from URL params (defaults to 'newest')
  const currentSort = searchParams.get('sort') || 'newest';

  // Read active filters for chip displays
  const city = searchParams.get('city') || '';
  const listingType = searchParams.get('listingType') || '';
  const propertyType = searchParams.get('propertyType') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Fetch properties from Express backend whenever URL search params change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // searchParams.toString() converts all active filters into ?city=Austin&sort=price_asc etc.
        const queryString = searchParams.toString();
        const res = await api.get(`/properties?${queryString}`);
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error('Error fetching property listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  // Update sort query parameter
  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  // Remove individual filter chip
  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  // Clear all active filters
  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    city || listingType || propertyType || bedrooms || minPrice || maxPrice
  );

  // Stagger container variant for property cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-20 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-slate-200/80 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
              Directory
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] mt-1">
              Curated Residences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {properties.length} available architectural listings
            </p>
          </div>

          {/* Sort Selector & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs hover:border-[#C89B3C]"
            >
              <Filter className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#C89B3C]" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sortSelect" className="text-xs text-slate-500 font-medium hidden sm:inline">
                Sort:
              </label>
              <select
                id="sortSelect"
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-xs text-slate-400 font-medium">Active:</span>

            {city && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13293D] text-white text-xs">
                <span>City: {city}</span>
                <button onClick={() => removeFilter('city')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {listingType && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13293D] text-white text-xs capitalize">
                <span>Intent: For {listingType}</span>
                <button onClick={() => removeFilter('listingType')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {propertyType && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13293D] text-white text-xs capitalize">
                <span>Type: {propertyType}</span>
                <button onClick={() => removeFilter('propertyType')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {bedrooms && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13293D] text-white text-xs">
                <span>{bedrooms}+ Beds</span>
                <button onClick={() => removeFilter('bedrooms')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13293D] text-white text-xs">
                <span>
                  Price: {minPrice ? `$${Number(minPrice).toLocaleString()}` : '$0'} -{' '}
                  {maxPrice ? `$${Number(maxPrice).toLocaleString()}` : 'Any'}
                </span>
                <button
                  onClick={() => {
                    removeFilter('minPrice');
                    removeFilter('maxPrice');
                  }}
                  className="hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#C89B3C] hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Two-Column Layout: Sidebar + Listings Grid */}
        <div className="flex gap-8 mt-6 items-start">
          
          {/* Desktop Filter Sidebar & Mobile Drawer */}
          <FilterSidebar
            mobileOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* Properties Grid Area */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl h-96 animate-pulse border border-slate-200"
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C89B3C] flex items-center justify-center mx-auto">
                  <SearchX className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#13293D]">
                  No Matching Properties
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We could not find any residences matching your current filter criteria. Try expanding your price range or selecting another city.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#13293D] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={searchParams.toString()} // Re-run stagger animation when filters change
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {properties.map((property) => (
                  <motion.div key={property._id} variants={cardVariants}>
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
