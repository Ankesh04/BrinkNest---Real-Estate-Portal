// server/middleware/authMiddleware.js
// Middleware function to protect private routes.
// It verifies the JSON Web Token (JWT) sent in the HTTP request's Authorization header.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Standard format for JWT headers is: "Bearer <token_string>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Split "Bearer <token>" by space and take the second item (the token)
      token = req.headers.authorization.split(' ')[1];

      // jwt.verify checks if the token has been tampered with and hasn't expired.
      // It decodes the payload that was encoded during login (which holds the user ID).
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded ID.
      // .select('-password') ensures we do NOT attach the hashed password to the request object.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or account removed' });
      }

      // Proceed to the next middleware or controller
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  // If no token was found in the Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
