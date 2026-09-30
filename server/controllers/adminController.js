// server/controllers/adminController.js
// Handles administrative management: user lists, user removal, and portal statistics.

const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Favorite = require('../models/Favorite');

// @desc    Get dashboard metrics & counters
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [totalProperties, totalUsers, totalInquiries, totalFavorites, featuredProperties] =
      await Promise.all([
        Property.countDocuments(),
        User.countDocuments(),
        Inquiry.countDocuments(),
        Favorite.countDocuments(),
        Property.countDocuments({ isFeatured: true }),
      ]);

    res.json({
      totalProperties,
      totalUsers,
      totalInquiries,
      totalFavorites,
      featuredProperties,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error.message);
    res.status(500).json({ message: 'Server error retrieving statistics' });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent the requesting admin from deleting their own account
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Remove their favorites as cleanup
    await Favorite.deleteMany({ user: req.params.id });

    res.json({ message: 'User account removed successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
};
