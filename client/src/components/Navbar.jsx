// client/src/components/Navbar.jsx
// Main navigation header for BrickNest.
// Features scroll-responsive background fading (transparent over hero -> solid navy backdrop blur),
// responsive mobile navigation sheet, active route highlights, and user/admin controls.

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  KeyRound,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout, favoriteIds } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Listen to window scroll to smoothly transition navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case the page loaded mid-scroll
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // On the home page at the very top, navbar starts transparent; otherwise solid navy
  const navBackgroundClass = !isHomePage || isScrolled
    ? 'bg-[#13293D]/95 backdrop-blur-md shadow-lg border-b border-white/10 text-white py-3.5'
    : 'bg-transparent text-white py-5';

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${navBackgroundClass}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#C89B3C] flex items-center justify-center text-[#13293D] shadow-md group-hover:bg-amber-400 transition-colors">
              {/* Minimalist house & key icon */}
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center">
                BrickNest
                <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] ml-1 inline-block" />
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-300 -mt-1 font-medium">
                Architectural Living
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-[#C89B3C] ${
                  isActive ? 'text-[#C89B3C] font-semibold' : 'text-slate-200'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/listings"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-[#C89B3C] ${
                  isActive ? 'text-[#C89B3C] font-semibold' : 'text-slate-200'
                }`
              }
            >
              Explore Listings
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors duration-200 hover:text-[#C89B3C] ${
                  isActive ? 'text-[#C89B3C] font-semibold' : 'text-slate-200'
                }`
              }
            >
              <Heart className={`w-4 h-4 ${favoriteIds.length > 0 ? 'fill-[#C89B3C] text-[#C89B3C]' : ''}`} />
              <span>Saved</span>
              {favoriteIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#C89B3C] text-[#13293D] rounded-full">
                  {favoriteIds.length}
                </span>
              )}
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#C89B3C] text-[#13293D]'
                      : 'bg-white/10 text-amber-300 hover:bg-white/20'
                  }`
                }
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Menu: User Account or Login/Register */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-white/15">
                  <div className="w-8 h-8 rounded-full bg-slate-700/80 border border-white/20 flex items-center justify-center text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-slate-300 capitalize">{user.role}</p>
                  </div>
                </div>

                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#13293D] bg-[#C89B3C] hover:bg-[#b0852e] rounded-lg shadow-sm transition-colors"
                  >
                    Join BrickNest
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            {favoriteIds.length > 0 && (
              <Link to="/favorites" className="p-2 text-[#C89B3C]">
                <Heart className="w-5 h-5 fill-current" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (with Framer Motion animation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-[#13293D] border-b border-white/10 px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/"
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                to="/listings"
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/10"
              >
                Explore Listings
              </Link>
              <Link
                to="/favorites"
                className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-white/10 flex items-center justify-between"
              >
                <span>Saved Favorites</span>
                {favoriteIds.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#C89B3C] text-[#13293D] rounded-full">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-amber-300 bg-white/10 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-950/40 hover:bg-red-900/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/login"
                    className="text-center py-2.5 text-sm font-medium text-slate-200 border border-white/20 rounded-lg hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-2.5 text-sm font-semibold text-[#13293D] bg-[#C89B3C] hover:bg-[#b0852e] rounded-lg shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
