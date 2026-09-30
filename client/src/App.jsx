// client/src/App.jsx
// Root application component.
// Configures route hierarchy, protected authentication barriers,
// top Navbar, bottom Footer, and Framer Motion animated page transitions.

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Global Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminInquiries from './pages/AdminInquiries';
import NotFound from './pages/NotFound';

// Wrapper for per-page fade and slide transitions
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#2E2E2E]">
      <ScrollToTop />
      
      {/* Sticky/Fixed Navigation Header */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* Public Consumer Routes */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />

            <Route
              path="/listings"
              element={
                <PageTransition>
                  <Listings />
                </PageTransition>
              }
            />

            <Route
              path="/properties/:id"
              element={
                <PageTransition>
                  <PropertyDetail />
                </PageTransition>
              }
            />

            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />

            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />

            {/* Buyer/Tenant Protected Routes */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Favorites />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Administrator Only Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/properties"
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminProperties />
                  </PageTransition>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/inquiries"
              element={
                <AdminRoute>
                  <PageTransition>
                    <AdminInquiries />
                  </PageTransition>
                </AdminRoute>
              }
            />

            {/* 404 Not Found Catch-All */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />

          </Routes>
        </AnimatePresence>
      </div>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
