// client/src/pages/Favorites.jsx
// Displays all shortlisted residences saved by the logged-in user.
// Fetches records from GET /api/favorites.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Compass, Building, ArrowRight } from 'lucide-react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import AmbientBackground from '../components/AmbientBackground';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { favoriteIds } = useAuth();
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch whenever the user's favoriteIds changes
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await api.get('/favorites');
        // Extract the populated property objects
        const items = res.data
          .map((fav) => fav.property)
          .filter(Boolean);
        setFavoriteListings(items);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-24 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-8 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Personal Shortlist</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D]">
            Saved Residences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of your shortlisted properties, compare architectural features, and revisit before inquiring.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : favoriteListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#13293D]">
                Your Shortlist is Empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Click the heart icon on any residence to bookmark it here for quick comparison and easy follow-up.
              </p>
              <div className="pt-2">
                <Link
                  to="/listings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#13293D] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#C89B3C]" />
                  <span>Browse Available Listings</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteListings.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
