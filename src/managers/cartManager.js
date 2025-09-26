const { readJson, writeJson } = require('../utils/fileManager');
const crypto = require('crypto');

class CartManager {
  constructor(fileName = 'carts.json') {
    this.fileName = fileName;
  }

  async getCarts() {
    return await readJson(this.fileName);
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(c => String(c.id) === String(cartId)) || null;
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };
    carts.push(newCart);
    await writeJson(this.fileName, carts);
    return newCart;
  }

  async getProductsFromCart(cartId) {
    const cart = await this.getCartById(cartId);
    if (!cart) return null;
    return cart.products;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) return null;

    const cart = carts[idx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(productId));

    if (prodIdx !== -1) {
      cart.products[prodIdx].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[idx] = cart;
    await writeJson(this.fileName, carts);
    return cart;
  }

  async updateCartProducts(cartId, productsArray) {
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) return null;
    carts[idx].products = productsArray;
    await writeJson(this.fileName, carts);
    return carts[idx];
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) return null;

    const cart = carts[idx];
    const pIdx = cart.products.findIndex(p => String(p.product) === String(productId));
    if (pIdx === -1) return null;

    cart.products[pIdx].quantity = Number(quantity);
    carts[idx] = cart;
    await writeJson(this.fileName, carts);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) return null;

    const cart = carts[idx];
    cart.products = cart.products.filter(p => String(p.product) !== String(productId));
    carts[idx] = cart;
    await writeJson(this.fileName, carts);
    return cart;
  }

  async clearCart(cartId) {
    const carts = await this.getCarts();
    const idx = carts.findIndex(c => String(c.id) === String(cartId));
    if (idx === -1) return null;
    carts[idx].products = [];
    await writeJson(this.fileName, carts);
    return carts[idx];
  }
}

module.exports = new CartManager();
