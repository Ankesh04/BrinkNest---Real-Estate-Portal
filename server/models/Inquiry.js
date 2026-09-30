// server/models/Inquiry.js
// This schema records "Contact Owner" form submissions from prospective buyers or renters.
// Leads are persisted here so portal admins can view and manage client contacts.

const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    // The specific property the visitor is asking about
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property reference is required'],
    },
    // Sender's full name
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    // Sender's contact email address
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
    },
    // Sender's phone number
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    // The message or inquiry question submitted by the user
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
