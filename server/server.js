// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import database connection and routes
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/users');
const mockExamRoutes = require('./routes/exams'); // <-- Full mock exam routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
connectDB();

// --- API Routes ---
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mock-exam', mockExamRoutes); // <-- Mount mock exam routes

// --- Root Route (optional) ---
app.get('/', (req, res) => {
  res.send('✅ Server is up and running.');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening at http://localhost:${PORT}`);
});
