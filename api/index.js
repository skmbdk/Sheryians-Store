const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Ensure DB connection for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error:', err);
  }
  next();
});

// Middleware setup
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Support both /api/auth and /auth routes for Vercel rewrite compatibility
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;