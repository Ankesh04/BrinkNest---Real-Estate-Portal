// client/src/pages/Home.jsx
// Main landing page with full-bleed parallax hero, search bar routing to /listings,
// featured properties strip, scroll-triggered reveals, and animated stat counters.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home as HomeIcon, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Building,
  Key,
  Compass
} from 'lucide-react';
import api from '../api/api';
import PropertyCard from '../components/PropertyCard';
import StatCounter from '../components/StatCounter';
import AmbientBackground from '../components/AmbientBackground';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Search Bar State
  const [searchCity, setSearchCity] = useState('');
  const [listingType, setListingType] = useState('sale');
  const [propertyType, setPropertyType] = useState('all');

  // Parallax Scroll Link for Hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Background image gently moves slower than scroll (parallax effect)
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  // Fetch featured properties on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties?isFeatured=true');
        setFeaturedProperties(res.data.properties || []);
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity.trim()) params.append('city', searchCity.trim());
    if (listingType && listingType !== 'all') params.append('listingType', listingType);
    if (propertyType && propertyType !== 'all') params.append('propertyType', propertyType);

    navigate(`/listings?${params.toString()}`);
  };

  // Animation Variants for Staggered Scroll Reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full relative overflow-hidden">
      
      {/* 1. HERO SECTION: Full-width, full-viewport-height with Parallax */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#13293D]"
      >
        {/* Parallax Background Photo with Dark Overlay */}
        <motion.div
          style={{ y: heroParallaxY }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Architectural Estate"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle multi-stop gradient scrim to maintain strong contrast for text & search bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#13293D]/80 via-[#13293D]/65 to-[#13293D]/95" />
        </motion.div>

        {/* Hero Content Container */}
        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16"
        >
          {/* Brand Tagline Chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C89B3C] text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architectural Real Estate Portal</span>
          </motion.div>

          {/* Headline in Serif Display Font */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Find Residences Built for <br className="hidden sm:block" />
            <span className="italic font-normal text-amber-200">Timeless</span> Living.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            A refined collection of architectural villas, urban penthouses, and hillside sanctuaries. Explore verified listings and connect directly with listers.
          </p>

          {/* Search Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/20 text-left max-w-4xl mx-auto"
          >
            {/* Listing Type Switch (Buy vs Rent) */}
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setListingType('sale')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  listingType === 'sale'
                    ? 'bg-[#13293D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => setListingType('rent')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  listingType === 'rent'
                    ? 'bg-[#13293D] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                For Rent
              </button>
            </div>

            {/* Search Input Controls */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* City Input */}
              <div className="sm:col-span-5 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#C89B3C] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Try 'Austin', 'Miami', or 'Denver'..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className="sm:col-span-4 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Property Category
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#C89B3C] absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment / Loft</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot / Acreage</option>
                  </select>
                </div>
              </div>

              {/* Search Submit Button */}
              <div className="sm:col-span-3 pt-2 sm:pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 px-4 bg-[#C89B3C] hover:bg-[#b0852e] text-[#13293D] font-bold text-sm rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Homes</span>
                </motion.button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      </section>


      {/* 2. FEATURED RESIDENCES SECTION */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <AmbientBackground />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
              Handpicked Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] mt-1">
              Featured Residences
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Carefully vetted architectural properties noted for exceptional build quality, prime locations, and design integrity.
            </p>
          </div>

          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#13293D] hover:text-[#C89B3C] transition-colors group"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Grid with Scroll-Triggered Reveal */}
        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl h-96 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.slice(0, 3).map((property) => (
              <motion.div key={property._id} variants={itemVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>


      {/* 3. FULL-BLEED "WHY BRIKNEST" TRUST & METRICS SECTION */}
      <section className="w-full bg-[#13293D] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
              The BrickNest Distinction
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mt-2 mb-4">
              A Portal Built on Proven Trust & Accuracy
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike legacy aggregate sites cluttered with outdated listings and duplicate agent claims, BrickNest ensures authentic listings and verified contact channels.
            </p>
          </div>

          {/* Animated Stat Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 text-center">
            
            <div className="p-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                <StatCounter endValue={1250} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Curated Properties</p>
            </div>

            <div className="p-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                <StatCounter endValue={8500} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Verified Buyers & Tenants</p>
            </div>

            <div className="p-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                <StatCounter endValue={42} suffix=" Cities" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Metropolitan Coverage</p>
            </div>

            <div className="p-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C89B3C] mb-2">
                <StatCounter endValue={99} suffix=".4%" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Listing Verification Rate</p>
            </div>

          </div>

          {/* Three Core Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#C89B3C]/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Strict Quality Standards
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every residence passes architecture and title verification before being listed. No duplicates, no bait-and-switch pricing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#C89B3C]/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center mb-5">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Direct Owner Inquiry Channel
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Inquiries pass directly to the property representative without high-pressure call-center intermediaries or marketing spam.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#C89B3C]/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Tailored Architectural Discovery
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Filter by genuine architectural categories — from Mid-Century and Nordic Lofts to Rammed-Earth Desert sanctuaries.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 4. CURATED DESTINATIONS (CITIES) SECTION */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
            Prime Markets
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] mt-1">
            Explore Top Architectural Hubs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              city: 'Austin',
              state: 'TX',
              subtitle: 'Hill Country Villas & Tech Studios',
              image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80',
            },
            {
              city: 'New York',
              state: 'NY',
              subtitle: 'Historic Cast-Iron Lofts & Penthouses',
              image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
            },
            {
              city: 'Miami',
              state: 'FL',
              subtitle: 'Bayfront Estates & Oceanfront Terraces',
              image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=600&q=80',
            },
            {
              city: 'Denver',
              state: 'CO',
              subtitle: 'Alpine Timber Homes & Urban Brownstones',
              image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
            },
          ].map((item) => (
            <Link
              key={item.city}
              to={`/listings?city=${encodeURIComponent(item.city)}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] block shadow-md"
            >
              <img
                src={item.image}
                alt={item.city}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-wider text-[#C89B3C] font-semibold">
                  {item.state}
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  {item.city}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
