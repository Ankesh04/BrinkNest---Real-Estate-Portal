// client/src/pages/Login.jsx
// User login portal supporting standard email/password authentication
// and one-click quick demo buttons for testing both admin and buyer roles.

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AmbientBackground from '../components/AmbientBackground';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Destination after login (e.g., if redirected from favorites or admin route)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  // Helper to autofill demo credentials
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 pt-24 pb-16 relative">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200/90 shadow-lg relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#13293D] text-[#C89B3C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13293D]">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your shortlisted residences and inquiries
          </p>
        </div>

        {/* Demo Credentials Helper Pill Box */}
        <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C89B3C]">
            Quick Demo Auto-Fill:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('admin@bricknest.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-slate-700 hover:border-[#C89B3C] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Admin Account</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('user@bricknest.com', 'user123')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-slate-700 hover:border-[#C89B3C] font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Buyer Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 px-4 bg-[#13293D] hover:bg-[#1d3b56] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#C89B3C]" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-[#13293D] hover:text-[#C89B3C] underline">
              Create an account
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
