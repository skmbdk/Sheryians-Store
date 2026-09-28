const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../backend/config/db');

const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Wrap request with DB connection catch
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database Connection Failed:', err);
    res.status(500).json({ error: 'Database Connection Error', details: err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Global Error Handler for Vercel
app.use((err, req, res, next) => {
  console.error('Vercel Serverless Error:', err);
  res.status(500).json({ error: 'Serverless Error', message: err.message, stack: err.stack });
});

module.exports = app;
