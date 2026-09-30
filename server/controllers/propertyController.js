// server/controllers/propertyController.js
// Handles listing, filtering, viewing, creating, updating, and deleting properties.

const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const Inquiry = require('../models/Inquiry');

// @desc    Get all properties with flexible filters & sorting
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      bedrooms,
      propertyType,
      listingType,
      isFeatured,
      sort,
      search,
    } = req.query;

    // Build MongoDB query filter object dynamically
    const query = {};

    // Filter by city (case-insensitive substring match)
    if (city && city.trim() !== '') {
      query.city = { $regex: city.trim(), $options: 'i' };
    }

    // Generic search across title, description, or address
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by listing type ('sale' or 'rent')
    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    // Filter by property category ('apartment', 'house', 'villa', etc.)
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Filter by minimum bedrooms
    if (bedrooms && bedrooms !== 'all') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by featured status (for homepage)
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // default to newest first
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    // Execute query in MongoDB
    const properties = await Property.find(query).sort(sortOptions);

    res.json({
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error.message);
    // If MongoDB ObjectId is malformed, handle it cleanly
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid property ID format' });
    }
    res.status(500).json({ message: 'Server error while retrieving property' });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      areaSqft,
      address,
      city,
      state,
      images,
      amenities,
      ownerName,
      ownerEmail,
      ownerPhone,
      isFeatured,
    } = req.body;

    // Note: Here you could plug in file upload handling (multer/Cloudinary).
    // In our beginner scope, we receive an array of image URLs (or a comma-separated string that gets parsed).
    let parsedImages = [];
    if (Array.isArray(images)) {
      parsedImages = images;
    } else if (typeof images === 'string') {
      parsedImages = images.split(',').map((img) => img.trim()).filter(Boolean);
    }

    let parsedAmenities = [];
    if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    } else if (typeof amenities === 'string') {
      parsedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    const newProperty = new Property({
      title,
      description,
      price: Number(price),
      listingType,
      propertyType,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      areaSqft: Number(areaSqft),
      address,
      city,
      state,
      images: parsedImages,
      amenities: parsedAmenities,
      ownerName,
      ownerEmail,
      ownerPhone,
      isFeatured: Boolean(isFeatured),
      createdBy: req.user._id, // Assign logged-in admin as creator
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error.message);
    res.status(400).json({ message: error.message || 'Failed to create property' });
  }
};

// @desc    Update an existing property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Process images and amenities if they were provided as strings
    const updateData = { ...req.body };
    if (typeof updateData.images === 'string') {
      updateData.images = updateData.images.split(',').map((img) => img.trim()).filter(Boolean);
    }
    if (typeof updateData.amenities === 'string') {
      updateData.amenities = updateData.amenities.split(',').map((a) => a.trim()).filter(Boolean);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Returns updated doc & runs schema validations
    );

    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error.message);
    res.status(400).json({ message: error.message || 'Failed to update property' });
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete property document
    await Property.findByIdAndDelete(req.params.id);

    // Clean up related favorites and inquiries
    await Favorite.deleteMany({ property: req.params.id });
    await Inquiry.deleteMany({ property: req.params.id });

    res.json({ message: 'Property and associated records deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    res.status(500).json({ message: 'Server error while deleting property' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
