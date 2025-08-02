// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import database connection and routes
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/users'); // Import the new user routes

// Load environment variables from a .env file into process.env
dotenv.config();

// Initialize the Express application
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
connectDB();

// --- API Routes ---
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes); // Mount the user routes

// --- Server Port Definition ---
const PORT = process.env.PORT || 5000;

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`   Access it at: http://localhost:${PORT}`);
});
