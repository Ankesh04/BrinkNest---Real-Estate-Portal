// client/src/pages/AdminProperties.jsx
// Management page for platform administrators to create, update, and delete property listings.
// Includes responsive data table with horizontal scrolling, search filter, and full modal form.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  Sparkles,
  MapPin,
  Search
} from 'lucide-react';
import api from '../api/api';
import AmbientBackground from '../components/AmbientBackground';

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  listingType: 'sale',
  propertyType: 'house',
  bedrooms: '3',
  bathrooms: '2',
  areaSqft: '2400',
  address: '',
  city: 'Austin',
  state: 'TX',
  images: '',
  amenities: 'Parking, Swimming Pool, High-Speed Internet, Garden',
  ownerName: 'BrickNest Advisory',
  ownerEmail: 'advisory@bricknest.com',
  ownerPhone: '+1 (512) 555-0100',
  isFeatured: false,
};

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch all properties for admin table
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error('Error fetching admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Open modal in Create mode
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEdit = (prop) => {
    setEditingId(prop._id);
    setFormData({
      title: prop.title || '',
      description: prop.description || '',
      price: prop.price?.toString() || '',
      listingType: prop.listingType || 'sale',
      propertyType: prop.propertyType || 'house',
      bedrooms: prop.bedrooms?.toString() || '0',
      bathrooms: prop.bathrooms?.toString() || '0',
      areaSqft: prop.areaSqft?.toString() || '',
      address: prop.address || '',
      city: prop.city || '',
      state: prop.state || '',
      images: Array.isArray(prop.images) ? prop.images.join(', ') : '',
      amenities: Array.isArray(prop.amenities) ? prop.amenities.join(', ') : '',
      ownerName: prop.ownerName || '',
      ownerEmail: prop.ownerEmail || '',
      ownerPhone: prop.ownerPhone || '',
      isFeatured: Boolean(prop.isFeatured),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit (POST for Create, PUT for Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingId) {
        // Edit existing listing
        await api.put(`/properties/${editingId}`, formData);
        setStatusMessage('Listing updated successfully!');
      } else {
        // Create new listing
        await api.post('/properties', formData);
        setStatusMessage('New property added to catalog!');
      }

      setIsModalOpen(false);
      fetchProperties();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Save property error:', err);
      setFormError(err.response?.data?.message || 'Failed to save property. Please check inputs.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties((prev) => prev.filter((p) => p._id !== id));
        setStatusMessage('Property deleted successfully.');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (err) {
        console.error('Delete error:', err);
        alert('Could not delete property.');
      }
    }
  };

  // Filter listings by search input
  const filteredProperties = properties.filter((p) => {
    const q = searchFilter.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.propertyType?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] pt-28 pb-24 relative">
      <AmbientBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C89B3C]">
              Inventory Controls
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13293D] mt-1">
              Manage Residences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add new listings, update pricing & descriptions, or remove off-market homes.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#13293D] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C89B3C]" />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* Search Bar for Table */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, city, or address..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredProperties.length} listings
          </span>
        </div>

        {/* Table Container with Horizontal Scroll Wrapper */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading catalog...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No properties match your filter.
              </div>
            ) : (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Specs</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProperties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Image + Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80'}
                            alt={prop.title}
                            className="w-12 h-10 object-cover rounded-md bg-slate-100"
                          />
                          <div className="max-w-[220px]">
                            <a
                              href={`/properties/${prop._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-slate-900 hover:text-[#C89B3C] truncate block"
                            >
                              {prop.title}
                            </a>
                            <span className="text-[10px] text-slate-400">
                              Lister: {prop.ownerName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Intent */}
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-slate-800">{prop.propertyType}</span>
                        <span className="text-[10px] text-slate-400 uppercase block">
                          For {prop.listingType}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        ${Number(prop.price).toLocaleString()}
                        {prop.listingType === 'rent' && <span className="text-[10px] font-normal text-slate-400">/mo</span>}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <span>{prop.city}, {prop.state}</span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[150px]">
                          {prop.address}
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-4 text-slate-500">
                        {prop.bedrooms}b / {prop.bathrooms}ba / {prop.areaSqft} sqft
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        {prop.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                            <Sparkles className="w-3 h-3 text-[#C89B3C]" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Standard</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prop)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-[#13293D] hover:bg-slate-100 transition-colors"
                            title="Edit listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prop._id, prop.title)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* CREATE / EDIT MODAL POPUP */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-serif text-2xl font-bold text-[#13293D]">
                  {editingId ? 'Edit Residence Listing' : 'Add New Property Listing'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Modern Hillside Villa with Panoramic Canyon Views"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Architectural Narrative / Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the build materials, layouts, light, and orientation..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* Pricing & Intent */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 1850000"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Listing Intent *
                    </label>
                    <select
                      value={formData.listingType}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Category *
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="plot">Plot</option>
                    </select>
                  </div>
                </div>

                {/* Specs: Bed, Bath, Sqft */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Area (Sqft) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.areaSqft}
                      onChange={(e) => setFormData({ ...formData, areaSqft: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                {/* Address, City, State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Austin"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="TX"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                {/* Images (comma separated URLs) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image URLs (Comma separated Unsplash links)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tip: Paste one or more image URLs separated by commas.
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amenities (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="Infinity Pool, Smart Home, Wine Cellar, 2-Car Garage"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                  />
                </div>

                {/* Owner Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lister / Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lister Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lister Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#C89B3C]"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#13293D] rounded border-slate-300 focus:ring-[#C89B3C]"
                    />
                    <span>Highlight as Featured Property on Homepage</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 text-xs font-semibold bg-[#13293D] hover:bg-slate-800 text-white rounded-lg shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    {formLoading ? 'Saving...' : editingId ? 'Update Listing' : 'Publish Listing'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
