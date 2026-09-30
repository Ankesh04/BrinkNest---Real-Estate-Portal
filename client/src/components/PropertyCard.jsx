// client/src/components/PropertyCard.jsx
// Core visual component for rendering real estate listing cards across the portal.
// Includes photo with hover zoom, price tag, address, bed/bath/sqft metadata row,
// and animated heart shortlisting toggle.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Square, MapPin, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PropertyCard({ property }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  if (!property) return null;

  const {
    _id,
    title,
    price,
    listingType,
    propertyType,
    bedrooms,
    bathrooms,
    areaSqft,
    address,
    city,
    state,
    images = [],
    isFeatured,
  } = property;

  const favorited = isFavorite(_id);
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  // Format currency with commas (e.g. $2,450,000 or $4,200/mo)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleFavorite(_id);
    if (result?.requireAuth) {
      // Prompt unauthenticated visitor to log in
      navigate('/login');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
    >
      {/* Top Image Container with zoom-on-hover effect */}
      <Link to={`/properties/${_id}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        <motion.img
          src={primaryImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient dark scrim for bottom/top overlay contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Prominent Price Tag Overlaid Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <div className="px-3 py-1.5 rounded-lg bg-[#13293D]/90 backdrop-blur-md text-white font-semibold text-base tracking-tight shadow-md flex items-baseline gap-1">
            <span>{formattedPrice}</span>
            {listingType === 'rent' && (
              <span className="text-xs text-slate-300 font-normal">/mo</span>
            )}
          </div>

          {/* Featured Badge if applicable */}
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C89B3C] text-[#13293D] font-bold text-[10px] tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* Favorite Heart Button Overlaid Top-Right */}
        <motion.button
          type="button"
          onClick={handleFavoriteClick}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-md flex items-center justify-center transition-colors text-slate-700 hover:text-red-500"
          title={favorited ? 'Remove from saved' : 'Save property'}
          aria-label="Save property"
        >
          <motion.div
            animate={favorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorited
                  ? 'fill-red-500 text-red-500'
                  : 'text-slate-600 hover:text-red-500'
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Property Type & Listing Type Chip Bottom-Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs capitalize font-medium">
            {propertyType}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#13293D] text-[11px] font-semibold uppercase tracking-wider">
            {listingType === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </Link>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Title */}
          <Link to={`/properties/${_id}`}>
            <h3 className="font-serif font-semibold text-lg text-[#13293D] group-hover:text-[#C89B3C] transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Address & City */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-[#C89B3C] shrink-0" />
            <span>{address}, {city}, {state}</span>
          </div>
        </div>

        {/* Bed / Bath / Sqft Spec Row (The hallmark real-estate card row) */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{bedrooms}</span>
            </div>
            <span className="text-[10px] text-slate-600">Beds</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{bathrooms}</span>
            </div>
            <span className="text-[10px] text-slate-600">Baths</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Square className="w-3.5 h-3.5 text-slate-400" />
              <span>{areaSqft.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-slate-600">Sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
