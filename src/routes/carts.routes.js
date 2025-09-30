const { Router } = require("express");
const cartDAO = require("../dao/cart.dao");

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cartDAO.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartDAO.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity) || 1;
    const cart = await cartDAO.addProductToCart(req.params.cid, req.params.pid, quantity);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cantidad de producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity);
    const cart = await cartDAO.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartDAO.removeProductFromCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await cartDAO.emptyCart(req.params.cid);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
