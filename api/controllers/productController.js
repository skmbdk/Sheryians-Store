const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category: category || 'General',
      createdBy: req.user._id
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ product });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    // Check if product exists first
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, stock, category } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category !== undefined) product.category = category;

    await product.save();

    return res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    // Check if product exists first
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting product' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
