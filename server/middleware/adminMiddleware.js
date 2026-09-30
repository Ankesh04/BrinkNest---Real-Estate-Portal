// server/middleware/adminMiddleware.js
// Middleware function to restrict access to administrator-only operations.
// Note: This middleware must be run AFTER the `protect` middleware so `req.user` is already populated.

const adminOnly = (req, res, next) => {
  // Check if user is present and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next(); // Authorized, proceed to route handler
  } else {
    // 403 Forbidden: client does not have permission to access the requested resource
    res.status(403).json({ message: 'Access denied: Administrator privileges required' });
  }
};

module.exports = { adminOnly };
