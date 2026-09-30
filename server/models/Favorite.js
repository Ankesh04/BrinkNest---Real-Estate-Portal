// server/models/Favorite.js
// This schema manages shortlisting/saving properties by logged-in users.
// It creates a link between a User document and a Property document.

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    // The user who saved this property
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The property that was saved
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites: a user can only favorite any given property once
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
