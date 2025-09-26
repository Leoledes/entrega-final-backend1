const { Router } = require('express');
const cartManager = require('../managers/cartManager');

const router = Router();

// 📌 Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({ status: 'success', payload: carts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los carritos', error: err.message });
  }
});

// 📌 Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: err.message });
  }
});

// 📌 Crear un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al crear el carrito', error: err.message });
  }
});

// 📌 Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartManager.addProductToCart(cid, { id: pid, quantity: quantity || 1 });
    if (!updatedCart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito', error: err.message });
  }
});

// 📌 Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado o producto inexistente' });
    }
    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito', error: err.message });
  }
});

// 📌 Eliminar un carrito
router.delete('/:cid', async (req, res) => {
  try {
    const deleted = await cartManager.deleteCart(req.params.cid);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', message: 'Carrito eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar carrito', error: err.message });
  }
});

module.exports = router;
