const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// -------------------------------------------------
// Product API routes – mounted under /api/v1/products
// -------------------------------------------------
const productRoutes = require('./routes/product.routes');
app.use('/api/v1/products', productRoutes);

// -------------------------------------------------
// Admin Product API routes – mounted under /api/v1/admin/products
// -------------------------------------------------
const adminProductRoutes = require('./routes/adminProduct.routes');
app.use('/api/v1/admin/products', adminProductRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server is running successfully! ✅');
});

// 404 handler for unknown routes
const ApiError = require('./utils/apiError');
app.use((req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;

