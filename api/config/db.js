const mongoose = require('mongoose');

let isConnected = false;

// Connect to MongoDB database with serverless connection caching and fallback URI
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://lovebabbar3:sheriyan22@cluster0.y0vnbsd.mongodb.net/sheryians_assignment?retryWrites=true&w=majority';

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;
