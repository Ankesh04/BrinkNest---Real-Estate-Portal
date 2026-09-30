// server/config/db.js
// This file handles our connection to the MongoDB database using Mongoose.
// Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string stored in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the connected host name to the console
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    // If the connection fails, log the error message and terminate the server process
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // 1 indicates exit with failure
  }
};

module.exports = connectDB;
