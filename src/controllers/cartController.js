const cartManager = require('../managers/cartManager');

// Crear carrito
const createCart = async (req, res, next) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (err) {
    next(err);
  }
};

// Obtener carrito por ID
const getCart = async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

// Agregar producto al carrito
const addProductToCart = async (req, res, next) => {
  try {
    const { pid, quantity } = req.body;
    if (!pid) return res.status(400).json({ status: 'error', error: 'Product ID required' });

    const product = { id: pid, quantity: quantity || 1 };
    const updatedCart = await cartManager.addProductToCart(req.params.cid, product);
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    next(err);
  }
};

// Reemplazar todo el contenido del carrito
const updateCartProducts = async (req, res, next) => {
  try {
    const products = req.body.products;
    if (!Array.isArray(products)) return res.status(400).json({ status: 'error', error: 'Products array required' });

    const updatedCart = await cartManager.updateCartProducts(req.params.cid, products);
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    next(err);
  }
};

// Actualizar cantidad de un producto específico
const updateProductQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity == null) return res.status(400).json({ status: 'error', error: 'Quantity required' });

    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    next(err);
  }
};

// Eliminar producto del carrito
const deleteProductFromCart = async (req, res, next) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    next(err);
  }
};

// Vaciar carrito
const emptyCart = async (req, res, next) => {
  try {
    const updatedCart = await cartManager.emptyCart(req.params.cid);
    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCart,
  getCart,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart,
  emptyCart
};
