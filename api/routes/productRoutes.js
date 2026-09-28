const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const {
  productIdValidation,
  createProductValidation,
  updateProductValidation
} = require('../validators/productValidator');

const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', productIdValidation, validate, getProductById);

// Protected routes
router.post('/', authenticate, createProductValidation, validate, createProduct);
router.put('/:id', authenticate, updateProductValidation, validate, updateProduct);
router.delete('/:id', authenticate, productIdValidation, validate, deleteProduct);

module.exports = router;
