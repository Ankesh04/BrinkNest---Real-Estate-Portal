// server/controllers/inquiryController.js
// Handles prospective buyer inquiries sent via the "Contact Owner" form on property detail pages.

const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Submit a "Contact Owner" inquiry form
// @route   POST /api/inquiries
// @access  Public
const submitInquiry = async (req, res) => {
  try {
    const { property, name, email, phone, message } = req.body;

    // Validate fields
    if (!property || !name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Persist inquiry to MongoDB database
    const inquiry = await Inquiry.create({
      property,
      name,
      email,
      phone,
      message,
    });

    // NOTE: REAL-WORLD EMAIL DISPATCH INTEGRATION
    // In a production app, here is where you would plug in Nodemailer, Resend, or SendGrid:
    // e.g.:
    // await sendEmail({
    //   to: propertyExists.ownerEmail,
    //   subject: `New BrickNest Lead for ${propertyExists.title}`,
    //   text: `${name} (${email}, ${phone}) inquired: "${message}"`
    // });
    // In this beginner project, leads are securely stored in MongoDB and accessible via the Admin Dashboard.

    res.status(201).json({
      message: 'Inquiry submitted successfully! The property representative will contact you soon.',
      inquiry,
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error.message);
    res.status(500).json({ message: 'Failed to submit inquiry. Please try again later.' });
  }
};

// @desc    Get all inquiries (for Admin portal)
// @route   GET /api/admin/inquiries
// @access  Private/Admin
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title price city address ownerName ownerEmail images')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching admin inquiries:', error.message);
    res.status(500).json({ message: 'Server error retrieving inquiries' });
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
};
