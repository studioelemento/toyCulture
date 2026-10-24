// src/routes/adminProduct.routes.js
// Admin‑only product routes – same controller as public but guarded by adminAuth

const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const productController = require('../controllers/product.controller');

const router = express.Router();

// All admin routes require adminAuth
router.use(adminAuth);

router.route('/')
  .post(asyncHandler(productController.createProduct))
  .put(asyncHandler(productController.updateProduct))
  .delete(asyncHandler(productController.deleteProduct));

router.route('/:id')
  .get(asyncHandler(productController.getProductById))
  .put(asyncHandler(productController.updateProduct))
  .delete(asyncHandler(productController.deleteProduct));

module.exports = router;
