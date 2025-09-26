const { Router } = require('express');
const {
  createCart,
  getCart,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart
} = require('../controllers/cartController');

const router = Router();

router.post('/', createCart);

router.get('/:cid', getCart);

router.post('/:cid/product/:pid', addProductToCart);

router.put('/:cid', updateCartProducts);

router.put('/:cid/product/:pid', updateProductQuantity);

router.delete('/:cid/product/:pid', deleteProductFromCart);

module.exports = router;
