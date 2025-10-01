const { Router } = require("express");
const {
  createCart,
  getCart,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart,
  emptyCart
} = require("../controllers/cartController");

const router = Router();

// Crear carrito
router.post("/", createCart);

// Obtener carrito por ID
router.get("/:cid", getCart);

// Agregar producto al carrito
router.post("/:cid/products/:pid", addProductToCart);

// Reemplazar todo el contenido del carrito
router.put("/:cid", updateCartProducts);

// Actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", updateProductQuantity);

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", deleteProductFromCart);

// Vaciar carrito
router.delete("/:cid", emptyCart);

module.exports = router;
