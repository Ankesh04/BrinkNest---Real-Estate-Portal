// client/src/pages/AdminInquiries.jsx
// Platform admin page to inspect all incoming contact leads submitted by buyers/tenants.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, ExternalLink, Calendar, Search, Building } from 'lucide-react';
import api from '../api/api';
import AmbientBackground from '../components/AmbientBackground';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data || []);
    } catch (err) {
      console.error('Error fetching admin inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchFilter.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.property?.title?.toLowerCase().includes(q) ||
      inq.property?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-24 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
              Lead Inflow
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] mt-1">
              Customer Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage prospective buyer messages and viewing requests.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search sender or property..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
            />
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading inquiries...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No inquiries found.
              </div>
            ) : (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Prospective Lead</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Referenced Residence</th>
                    <th className="py-3 px-4">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {inq.name}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <a href={`tel:${inq.phone}`} className="hover:underline">
                            {inq.phone}
                          </a>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {inq.property ? (
                          <div>
                            <Link
                              to={`/properties/${inq.property._id}`}
                              className="font-medium text-[#13293D] hover:text-[#C89B3C] truncate block flex items-center gap-1"
                              target="_blank"
                            >
                              <span className="truncate">{inq.property.title}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </Link>
                            <span className="text-[10px] text-slate-400">
                              {inq.property.city} • ${Number(inq.property.price).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Property Deleted</span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 max-w-[320px] whitespace-normal">
                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                          "{inq.message}"
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
