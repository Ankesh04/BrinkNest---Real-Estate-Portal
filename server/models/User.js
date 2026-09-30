// server/models/User.js
// This Mongoose schema defines the structure of user documents in our MongoDB database.
// It stores both regular buyers/renters ('user') and portal administrators ('admin').

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // The user's full name (e.g., "John Doe")
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    // The user's email address (used as the unique login credential)
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true, // Prevents duplicate registrations with the same email
      lowercase: true, // Converts email to lowercase before saving
      trim: true,
    },
    // The bcrypt-hashed password (never store plain passwords in databases!)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    // Role of the user: regular 'user' can browse/favorite; 'admin' can manage listings and view leads
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // timestamps automatically adds createdAt and updatedAt Date fields to every document
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
