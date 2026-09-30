// client/src/components/FilterSidebar.jsx
// Controls property filtering (price, city, property type, bedrooms, listing type).
// Syncs every filter directly with browser URL query parameters (?city=Austin&minPrice=200000)
// Supports desktop sticky sidebar and mobile animated slide-over panel.

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw, Building, DollarSign, Bed, Home, MapPin } from 'lucide-react';

const CITIES = [
  'Austin',
  'New York',
  'Miami',
  'Denver',
  'Seattle',
  'Chicago',
  'Scottsdale',
  'Nashville',
  'San Francisco',
];

const PROPERTY_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Plot / Land', value: 'plot' },
];

export default function FilterSidebar({ mobileOpen, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from the active URL query parameters
  const currentCity = searchParams.get('city') || '';
  const currentListingType = searchParams.get('listingType') || 'all';
  const currentPropertyType = searchParams.get('propertyType') || 'all';
  const currentBedrooms = searchParams.get('bedrooms') || 'all';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  // Generic helper to update a query param in the URL
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Reset all filters back to defaults
  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    currentCity ||
    currentListingType !== 'all' ||
    currentPropertyType !== 'all' ||
    currentBedrooms !== 'all' ||
    currentMinPrice ||
    currentMaxPrice;

  // The inner content of the filter panel (shared between desktop & mobile)
  const FilterContent = (
    <div className="space-y-6">
      
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-[#13293D] font-serif font-bold text-lg">
          <Filter className="w-5 h-5 text-[#C89B3C]" />
          <span>Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Listing Type Toggle (All / Sale / Rent) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Listing Intent
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
          {[
            { label: 'All', value: 'all' },
            { label: 'Buy', value: 'sale' },
            { label: 'Rent', value: 'rent' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateFilter('listingType', tab.value)}
              className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                currentListingType === tab.value
                  ? 'bg-white text-[#13293D] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. City Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span>Metropolitan City</span>
        </label>
        <select
          value={currentCity}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#C89B3C] transition-colors"
        >
          <option value="">All Cities</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Property Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span>Property Type</span>
        </label>
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map((type) => (
            <label
              key={type.value}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                currentPropertyType === type.value
                  ? 'bg-[#13293D] text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{type.label}</span>
              <input
                type="radio"
                name="propertyType"
                value={type.value}
                checked={currentPropertyType === type.value}
                onChange={() => updateFilter('propertyType', type.value)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 4. Minimum Bedrooms */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span>Bedrooms</span>
        </label>
        <div className="grid grid-cols-6 gap-1">
          {['all', '1', '2', '3', '4', '5'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updateFilter('bedrooms', num)}
              className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                currentBedrooms === num
                  ? 'bg-[#C89B3C] border-[#C89B3C] text-[#13293D] font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {num === 'all' ? 'Any' : `${num}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Price Range Inputs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#C89B3C]" />
          <span>Price Range ($)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={currentMinPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C89B3C]"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price"
              value={currentMaxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C89B3C]"
            />
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed/Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Slide-over Drawer with Framer Motion Animation */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto p-6"
            >
              {/* Close Button Top Right */}
              <div className="flex justify-end pb-2">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {FilterContent}

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-[#13293D] text-white rounded-lg font-semibold text-sm shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
