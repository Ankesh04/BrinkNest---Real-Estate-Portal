// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { getAllInquiries } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes here require valid JWT AND admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/inquiries', getAllInquiries);

module.exports = router;
