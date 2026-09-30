// server/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/inquiryController');

// Public route to submit an inquiry
router.post('/', submitInquiry);

module.exports = router;
