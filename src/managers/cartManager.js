const { readJson, writeJson } = require('../utils/fileManager');
const crypto = require('crypto');
const path = require('path');

const cartsFile = path.resolve(__dirname, '../../data/carts.json');

class CartManager {
  async getCarts() {
    return await readJson(cartsFile);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };
    carts.push(newCart);
    await writeJson(cartsFile, carts);
    return newCart;
  }

  // Obtener carrito por ID
  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(c => String(c.id) === String(cartId)) || null;
  }

  // Agregar producto al carrito (o aumentar cantidad si ya existe)
  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    const existing = cart.products.find(p => String(p.product) === String(productId));
    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await writeJson(cartsFile, carts);
    return cart;
  }

  async updateCartProducts(cartId, productsArray) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    cart.products = productsArray.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));

    await writeJson(cartsFile, carts);
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    const product = cart.products.find(p => String(p.product) === String(productId));
    if (!product) return null;

    product.quantity = quantity;
    await writeJson(cartsFile, carts);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    cart.products = cart.products.filter(p => String(p.product) !== String(productId));
    await writeJson(cartsFile, carts);
    return cart;
  }

  async clearCart(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    cart.products = [];
    await writeJson(cartsFile, carts);
    return cart;
  }
}

module.exports = new CartManager();
