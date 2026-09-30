// client/src/pages/PropertyDetail.jsx
// Detailed property presentation page.
// Displays image gallery with thumbnail preview, architectural specifications,
// amenities grid, favorite saving button, and the direct ContactOwnerForm inquiry widget.

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  Share2, 
  Check, 
  Building, 
  Calendar, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import ContactOwnerForm from '../components/ContactOwnerForm';
import AmbientBackground from '../components/AmbientBackground';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch property details from backend
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error('Error fetching property detail:', err);
        setError('Property not found or may have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#13293D]">Listing Unavailable</h2>
          <p className="text-sm text-slate-500">{error || 'Unable to retrieve listing.'}</p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#13293D] text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    _id,
    title,
    description,
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
    amenities = [],
    ownerName,
    ownerEmail,
    ownerPhone,
    isFeatured,
    createdAt,
  } = property;

  const favorited = isFavorite(_id);

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  const handleFavoriteClick = async () => {
    const res = await toggleFavorite(_id);
    if (res?.requireAuth) {
      navigate('/login');
    }
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-24 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between pb-6 text-xs text-slate-500">
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#C89B3C] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Listings</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Share button */}
            <button
              onClick={handleShareClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {/* Favorite button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                favorited
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{favorited ? 'Saved to Favorites' : 'Save Residence'}</span>
            </motion.button>
          </div>
        </div>

        {/* 1. IMAGE GALLERY */}
        <div className="space-y-4 mb-10">
          {/* Main Hero Photo Display */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={images[activeImageIndex] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}
                alt={`${title} - View ${activeImageIndex + 1}`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#13293D]/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider">
                For {listingType}
              </span>
              <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs capitalize font-medium">
                {propertyType}
              </span>
              {isFeatured && (
                <span className="px-3 py-1 rounded-md bg-[#C89B3C] text-[#13293D] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>

            {/* Photo Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-medium">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C89B3C] shadow-md scale-102'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAIN CONTENT TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Residence Specs, Narrative, Amenities (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title & Price Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#13293D] tracking-tight">
                    {title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0" />
                    <span>{address}, {city}, {state}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] tracking-tight flex items-baseline sm:justify-end gap-1">
                    <span>{formattedPrice}</span>
                    {listingType === 'rent' && (
                      <span className="text-sm font-sans font-normal text-slate-500">/month</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Est. Mortgage / Lease Terms Available
                  </span>
                </div>
              </div>

              {/* Core Feature Specs Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-6 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-[#13293D] font-bold text-lg">
                    <Bed className="w-5 h-5 text-[#C89B3C]" />
                    <span>{bedrooms}</span>
                  </div>
                  <span className="text-xs text-slate-500">Bedrooms</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-[#13293D] font-bold text-lg">
                    <Bath className="w-5 h-5 text-[#C89B3C]" />
                    <span>{bathrooms}</span>
                  </div>
                  <span className="text-xs text-slate-500">Bathrooms</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-[#13293D] font-bold text-lg">
                    <Square className="w-5 h-5 text-[#C89B3C]" />
                    <span>{areaSqft.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-slate-500">Living Sqft</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-3 sm:col-span-1">
                  <div className="flex items-center justify-center gap-1 text-[#13293D] font-bold text-lg capitalize">
                    <Building className="w-5 h-5 text-[#C89B3C]" />
                    <span>{propertyType}</span>
                  </div>
                  <span className="text-xs text-slate-500">Classification</span>
                </div>
              </div>
            </div>

            {/* Architectural Narrative / Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#13293D]">
                Architectural Narrative
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Verified Amenities Grid */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#13293D]">
                    Curated Amenities & Finishes
                  </h3>
                  <span className="text-xs font-semibold text-[#C89B3C] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified In-Person
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 font-medium"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Contact Owner Widget & Representative Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Representative Details Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C89B3C]">
                Listing Representative
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#13293D] text-[#C89B3C] font-bold text-lg flex items-center justify-center shadow-xs">
                  {ownerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">
                    {ownerName}
                  </h4>
                  <p className="text-xs text-slate-500">Verified Property Custodian</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ownerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ownerEmail}</span>
                </div>
              </div>
            </div>

            {/* Direct Inquiry Contact Form */}
            <ContactOwnerForm
              propertyId={_id}
              propertyTitle={title}
              ownerName={ownerName}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
