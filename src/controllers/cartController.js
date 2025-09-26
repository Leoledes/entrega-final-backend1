const cartManager = require('../managers/cartManager');

const createCart = async (req, res, next) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

const updateCartProducts = async (req, res, next) => {
  try {
    const cart = await cartManager.updateCartProducts(req.params.cid, req.body.products);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

const updateProductQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

const deleteProductFromCart = async (req, res, next) => {
  try {
    const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    next(err);
  }
};

