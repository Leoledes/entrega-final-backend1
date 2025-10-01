// src/dao/cart.dao.js
const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartManager {
  // Crear carrito vacío
  async createCart() {
    const newCart = new Cart();
    await newCart.save();
    return await newCart.populate('products.product');
  }

  // Obtener carrito por ID con populate
  async getCartById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Cart ID inválido');
    const cart = await Cart.findById(id).populate('products.product');
    return cart;
  }

  // Agregar producto al carrito (incrementa si ya existe)
  async addProductToCart(cartId, productId, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error('Product ID inválido');

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) throw new Error('Producto no existe');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const existing = cart.products.find(p => String(p.product) === String(productId));
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.products.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  // Actualizar cantidad de un producto específico
  async updateProductQuantity(cartId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error('Product ID inválido');
    if (!Number.isFinite(Number(quantity)) || Number(quantity) < 0) throw new Error('Quantity inválida');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const prod = cart.products.find(p => String(p.product) === String(productId));
    if (!prod) throw new Error('Producto no encontrado en carrito');

    prod.quantity = Number(quantity);
    await cart.save();
    return await cart.populate('products.product');
  }

  // Eliminar producto del carrito
  async removeProductFromCart(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error('Product ID inválido');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(p => String(p.product) !== String(productId));
    await cart.save();
    return await cart.populate('products.product');
  }

  // Vaciar carrito completo
  async emptyCart(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    await cart.save();
    return cart;
  }

  // Traer todos los carritos (poblados)
  async getAllCarts() {
    return await Cart.find().populate('products.product');
  }

  // Reemplazar todo el array de productos del carrito
  async replaceProducts(cartId, productsArray) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!Array.isArray(productsArray)) throw new Error('Products debe ser un array');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    // Normalizar productos y fusionar duplicados
    const normalized = productsArray.map(item => {
      const pid = item.product || item.id || item._id;
      if (!pid) throw new Error('Cada producto debe tener product/id/_id');
      return { product: String(pid), quantity: Number(item.quantity) || 1 };
    });

    const map = new Map();
    normalized.forEach(({ product, quantity }) => {
      if (!mongoose.Types.ObjectId.isValid(product)) {
        throw new Error(`Product ID inválido: ${product}`);
      }
      map.set(product, (map.get(product) || 0) + Number(quantity));
    });
    const finalProducts = Array.from(map.entries()).map(([product, quantity]) => ({ product, quantity }));

    // Validar existencia de productos
    const ids = finalProducts.map(p => p.product);
    const existing = await Product.find({ _id: { $in: ids } }).select('_id').lean();
    const existingIds = new Set(existing.map(e => String(e._id)));
    const missing = ids.filter(id => !existingIds.has(id));
    if (missing.length > 0) throw new Error(`Algunos productos no existen: ${missing.join(', ')}`);

    cart.products = finalProducts;
    await cart.save();
    return await cart.populate('products.product');
  }

  // Alias por compatibilidad
  async updateCartProducts(cartId, productsArray) {
    return this.replaceProducts(cartId, productsArray);
  }
}

module.exports = new CartManager();
