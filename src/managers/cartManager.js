//Este era mi cartManager antes de migrar a MongoDB.

// const { readJson, writeJson } = require('../utils/fileManager');
// const crypto = require('crypto');
// const path = require('path');

// class CartManager {
//   constructor(fileName = 'carts.json') {
//     this.fileName = path.join(__dirname, '..', 'data', fileName);
//   }

//   async getCarts() {
//     return await readJson(this.fileName);
//   }

//   async getCartById(id) {
//     const carts = await this.getCarts();
//     return carts.find(c => String(c.id) === String(id)) || null;
//   }

//   async createCart() {
//     const carts = await this.getCarts();
//     const newCart = {
//       id: crypto.randomUUID(),
//       products: []
//     };
//     carts.push(newCart);
//     await writeJson(this.fileName, carts);
//     return newCart;
//   }

//   async addProductToCart(cartId, product) {
//     const carts = await this.getCarts();
//     const cartIndex = carts.findIndex(c => String(c.id) === String(cartId));
//     if (cartIndex === -1) return null;

//     const cart = carts[cartIndex];
//     const productIndex = cart.products.findIndex(p => String(p.id) === String(product.id));

//     if (productIndex !== -1) {
//       cart.products[productIndex].quantity += product.quantity || 1;
//     } else {
//       cart.products.push({ id: product.id, quantity: product.quantity || 1 });
//     }

//     carts[cartIndex] = cart;
//     await writeJson(this.fileName, carts);
//     return cart;
//   }

//   async removeProductFromCart(cartId, productId) {
//     const carts = await this.getCarts();
//     const cartIndex = carts.findIndex(c => String(c.id) === String(cartId));
//     if (cartIndex === -1) return null;

//     const cart = carts[cartIndex];
//     cart.products = cart.products.filter(p => String(p.id) !== String(productId));

//     carts[cartIndex] = cart;
//     await writeJson(this.fileName, carts);
//     return cart;
//   }

//   async deleteCart(cartId) {
//     const carts = await this.getCarts();
//     const newCarts = carts.filter(c => String(c.id) !== String(cartId));
//     if (newCarts.length === carts.length) return false;
//     await writeJson(this.fileName, newCarts);
//     return true;
//   }
// }

// module.exports = new CartManager();
