const { Router } = require('express');
const {
  createCart,
  getCart,
  addProductToCart,
  updateCartProducts,
  updateProductQuantity,
  deleteProductFromCart,
  emptyCart
} = require('../controllers/cartController');

const router = Router();

router.post('/', createCart);

router.get('/:cid', getCart);

router.post('/:cid/products/:pid', addProductToCart);

router.put('/:cid', updateCartProducts);

router.put('/:cid/products/:pid', updateProductQuantity);

router.delete('/:cid/products/:pid', deleteProductFromCart);

router.delete('/:cid', emptyCart);

module.exports = router;
