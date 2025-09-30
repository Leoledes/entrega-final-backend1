const Cart = require("../models/cart.model");

class CartManager {
  async createCart() {
    const newCart = new Cart();
    await newCart.save();
    return newCart;
  }

  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(
      p => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const prod = cart.products.find(p => p.product.toString() === productId);
    if (!prod) throw new Error("Producto no encontrado en carrito");

    prod.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async emptyCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return cart;
  }

  async getAllCarts() {
    return await Cart.find().populate("products.product");
  }
}

module.exports = new CartManager();
