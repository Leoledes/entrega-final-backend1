const productManager = require('../managers/productManager');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: 'success', payload: products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const ok = await productManager.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
