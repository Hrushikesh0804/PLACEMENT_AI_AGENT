const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from your .env file
    // The deprecated options have been removed as they are no longer needed.
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
