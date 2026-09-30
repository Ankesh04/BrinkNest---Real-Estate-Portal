// client/src/pages/AdminDashboard.jsx
// Overview dashboard for portal administrators.
// Shows real-time statistics (total listings, registered users, customer leads)
// and provides quick action links to manage properties and inspect inquiries.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import api from '../api/api';
import AmbientBackground from '../components/AmbientBackground';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, inquiriesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/inquiries'),
        ]);

        setStats(statsRes.data);
        setRecentInquiries(inquiriesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-20 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Admin Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#13293D] text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D]">
              Platform Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitor listings performance, incoming buyer inquiries, and portal traffic.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/properties"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#13293D] text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-[#C89B3C]" />
              <span>Manage Properties</span>
            </Link>

            <Link
              to="/admin/inquiries"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:border-slate-400 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-[#C89B3C]" />
              <span>View Inquiries</span>
            </Link>
          </div>
        </div>

        {/* 1. Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          
          {/* Card: Properties */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</p>
              <p className="font-serif text-3xl font-bold text-[#13293D] mt-1">
                {loading ? '...' : stats?.totalProperties || 0}
              </p>
              <Link to="/admin/properties" className="text-[11px] font-semibold text-[#C89B3C] hover:underline mt-2 inline-block">
                View all properties &rarr;
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Registered Users */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</p>
              <p className="font-serif text-3xl font-bold text-[#13293D] mt-1">
                {loading ? '...' : stats?.totalUsers || 0}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 inline-block">
                Buyers, tenants & agents
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Inquiries */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</p>
              <p className="font-serif text-3xl font-bold text-[#13293D] mt-1">
                {loading ? '...' : stats?.totalInquiries || 0}
              </p>
              <Link to="/admin/inquiries" className="text-[11px] font-semibold text-[#C89B3C] hover:underline mt-2 inline-block">
                Review lead queue &rarr;
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Featured Properties */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Homes</p>
              <p className="font-serif text-3xl font-bold text-[#13293D] mt-1">
                {loading ? '...' : stats?.featuredProperties || 0}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 inline-block">
                Hero showcase items
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* 2. Recent Inquiries Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#13293D]">
                Recent Buyer & Tenant Leads
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest submissions from property detail contact forms
              </p>
            </div>

            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-[#C89B3C] hover:underline flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table wrapper with horizontal overflow handling for mobile */}
          <div className="overflow-x-auto mt-4">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading inquiries...</div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No inquiries recorded yet. When users submit the Contact Owner form, leads will appear here.
              </div>
            ) : (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Sender</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Property</th>
                    <th className="py-3 px-3">Message Snippet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentInquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {inq.name}
                      </td>
                      <td className="py-3.5 px-3">
                        <div>{inq.email}</div>
                        <div className="text-[10px] text-slate-400">{inq.phone}</div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#13293D] max-w-[200px] truncate">
                        {inq.property?.title || 'Unknown Property'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-[260px] truncate">
                        "{inq.message}"
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
