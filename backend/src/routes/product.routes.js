const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.route('/')
    .get(asyncHandler(productController.getAllProducts))
    .post(asyncHandler(productController.createProduct));

router.route('/:id')
    .get(asyncHandler(productController.getProductById))
    .put(asyncHandler(productController.updateProduct))
    .delete(asyncHandler(productController.deleteProduct));

module.exports = router;