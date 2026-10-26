const mongoose = require('mongoose');

// Connects to MongoDB using the MONGO_URI from the .env file.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Check that MongoDB is running and MONGO_URI in backend/.env is correct.');
    process.exit(1);
  }
};

module.exports = connectDB;
