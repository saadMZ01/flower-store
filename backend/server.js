const express = require('express');
const cors    = require('cors');
require('dotenv').config({ path: '../config/.env' });

const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Flower Store API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});