// server/server.js
// Main entry point for the BrickNest Express backend server.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file into process.env
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Standard middleware
// cors() enables Cross-Origin Resource Sharing so our React frontend (running on e.g. port 5173)
// is allowed to make HTTP requests to this backend server.
app.use(cors());

// express.json() parses incoming HTTP request bodies that are formatted as JSON
app.use(express.json());

// express.urlencoded() parses URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Welcome / health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BrickNest Real Estate API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      favorites: '/api/favorites',
      inquiries: '/api/inquiries',
      admin: '/api/admin',
    },
  });
});

// Mount modular API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 Not Found handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Express error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Define the port to listen on (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 BrickNest server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
