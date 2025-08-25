const { readJson, writeJson } = require("../utils/fileManager");
const crypto = require("crypto");
class CartManager {
   constructor(filePath) {
    this.path = filePath;
  }
  async getCarts() {
    return await readJson(this.path);
  }
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: crypto.randomUUID(),
      products: [] 
    };
    carts.push(newCart);
    await writeJson(this.path, carts);
    return newCart;
  }
  async getProductsFromCart(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) {
      return null;
    }
    return cart.products;
  }
  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => String(c.id) === String(cartId));

    if (!cart) {
      return null;
    }

    const existingProductIndex = cart.products.findIndex(p => String(p.product) === String(productId));

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }

    await writeJson(this.path, carts);
    return cart;
  }
}

module.exports = CartManager;
