const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Vercel Serverless Function Working!', timestamp: new Date() });
});

try {
  const connectDB = require('./config/db');
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');

  app.use(async (req, res, next) => {
    try {
      await connectDB();
    } catch (err) {
      console.error('DB connect error:', err);
    }
    next();
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
} catch (err) {
  console.error('Module load error:', err);
  app.use('/api/*', (req, res) => {
    res.status(500).json({ error: 'Module Load Error', message: err.message, stack: err.stack });
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;