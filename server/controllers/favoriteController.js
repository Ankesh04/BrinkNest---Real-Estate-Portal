// server/controllers/favoriteController.js
// Handles user shortlisting / saving favorite properties.

const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Add a property to user favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ user: userId, property: propertyId });
    if (existing) {
      return res.status(400).json({ message: 'Property is already in favorites' });
    }

    const favorite = await Favorite.create({
      user: userId,
      property: propertyId,
    });

    res.status(201).json({
      message: 'Property added to favorites',
      favorite,
    });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({ message: 'Failed to add to favorites' });
  }
};

// @desc    Remove a property from user favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const result = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Property removed from favorites', propertyId });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ message: 'Failed to remove from favorites' });
  }
};

// @desc    Get all favorites of the current logged-in user
// @route   GET /api/favorites
// @access  Private
const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate property details so the frontend can render PropertyCards directly
    const favorites = await Favorite.find({ user: userId })
      .populate('property')
      .sort({ createdAt: -1 });

    // Filter out any entries where the referenced property may have been deleted
    const validFavorites = favorites.filter((fav) => fav.property !== null);

    res.json(validFavorites);
  } catch (error) {
    console.error('Error retrieving favorites:', error.message);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
