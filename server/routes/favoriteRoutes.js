// server/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// All favorite routes require authentication
router.use(protect);

router.get('/', getMyFavorites);
router.post('/:propertyId', addFavorite);
router.delete('/:propertyId', removeFavorite);

module.exports = router;
