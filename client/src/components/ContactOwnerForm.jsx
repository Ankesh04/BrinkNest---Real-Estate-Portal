// client/src/components/ContactOwnerForm.jsx
// Form enabling prospective buyers or renters to send direct inquiries to the property owner or lister.
// Submits payload to POST /api/inquiries and confirms successful transmission.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, User } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function ContactOwnerForm({ propertyId, propertyTitle, ownerName }) {
  const { user } = useAuth();

  // Pre-populate user name and email if logged in
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: `Hello, I am interested in "${propertyTitle}". Could you please provide additional details or schedule a viewing?`,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error once user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST to backend inquiries endpoint
      // NOTE: In production with Nodemailer or Sendgrid configured, this endpoint can
      // automatically dispatch an email alert directly to the owner's inbox!
      await api.post('/inquiries', {
        property: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      setSuccess(true);
      // Reset form fields
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        message: '',
      });
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to submit inquiry. Please ensure all fields are filled correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="font-serif text-xl font-bold text-[#13293D] mb-1">
        Inquire About This Residence
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Direct inquiry for <span className="font-medium text-slate-700">{ownerName}</span>. All communications are private and verified.
      </p>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-2"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-semibold text-emerald-900 text-sm">
            Inquiry Successfully Transmitted!
          </h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Your message has been delivered to the property representative. You should receive a response within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-3 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
          >
            Send another inquiry
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alexandra Bennett"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alexandra@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Message TextArea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C] focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Error Message Display */}
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
            className="w-full py-3 px-4 bg-[#13293D] hover:bg-[#1d3b56] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 text-[#C89B3C]" />
                <span>Submit Inquiry</span>
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
}
