// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import database connection and routes
const connectDB = require('./config/db');
const examsRoutes = require('./routes/exams');
const authRoutes = require('./routes/auth'); // Import the consolidated auth router

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
// Mount the consolidated auth router at /api/auth
app.use('/api/auth', authRoutes); 
app.use('/api/mock-exam', examsRoutes);

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