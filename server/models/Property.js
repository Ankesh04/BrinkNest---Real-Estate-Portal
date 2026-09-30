// server/models/Property.js
// This Mongoose schema models a real estate property listing.
// It stores all listing details, location, pricing, media URLs, and lister contact info.

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    // Catchy headline for the listing (e.g. "Modern Sunset Villa with Infinity Pool")
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
    },
    // Comprehensive description detailing the property's condition, architecture, and perks
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
    },
    // Listing price in USD or local currency (e.g., 450000 for sale or 2500 for monthly rent)
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    // Determines if the property is for sale or for rent
    listingType: {
      type: String,
      required: [true, 'Please specify listing type (sale or rent)'],
      enum: ['sale', 'rent'],
    },
    // Category of the property
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['apartment', 'house', 'villa', 'plot', 'commercial'],
    },
    // Number of bedrooms (can be 0 for commercial/plots/studios)
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Number of bathrooms
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Total area in square feet
    areaSqft: {
      type: Number,
      required: [true, 'Please provide the area in sqft'],
      min: 0,
    },
    // Street address
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
    },
    // City location for searching and filtering (e.g., "Austin", "Denver")
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true,
    },
    // State or region
    state: {
      type: String,
      required: [true, 'Please provide a state'],
      trim: true,
    },
    // Array of image URLs (Unsplash architecture photos)
    // NOTE: If using file uploads (multer/Cloudinary), upload files to storage and push URLs here.
    images: {
      type: [String],
      default: [],
    },
    // Array of feature tags (e.g., ["Parking", "Gym", "Swimming Pool", "Balcony"])
    amenities: {
      type: [String],
      default: [],
    },
    // Contact information of the property seller / landlord / agent
    ownerName: {
      type: String,
      required: [true, 'Please provide the property owner or agent name'],
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Please provide the owner or agent email'],
      trim: true,
      lowercase: true,
    },
    ownerPhone: {
      type: String,
      required: [true, 'Please provide the owner or agent phone number'],
      trim: true,
    },
    // Flag to highlight this listing on the homepage hero or featured strip
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Reference to the admin user who created this listing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Auto-generates createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Add index on city and price for efficient search queries
propertySchema.index({ city: 1, price: 1, propertyType: 1, listingType: 1 });

module.exports = mongoose.model('Property', propertySchema);
