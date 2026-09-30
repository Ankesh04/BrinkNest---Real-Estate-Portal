// server/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public listing & detail routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Admin-only management routes (must be logged in AND have admin role)
router.post('/', protect, adminOnly, createProperty);
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);

module.exports = router;
