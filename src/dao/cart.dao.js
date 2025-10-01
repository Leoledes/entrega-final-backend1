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

  // Obtener carrito por id (poblado)
  async getCartById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Cart ID inválido');
    return await Cart.findById(id).populate('products.product');
  }

  // Agregar producto al carrito (incrementa si ya existe)
  async addProductToCart(cartId, productId, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error('Product ID inválido');

    // verificar existencia del producto
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) throw new Error('Producto no existe');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const existing = cart.products.find(p => String(p.product) === String(productId));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + Number(quantity || 1);
    } else {
      cart.products.push({ product: productId, quantity: Number(quantity || 1) });
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  // Actualizar cantidad de un producto en el carrito
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

  // --- NUEVO: reemplazar TODO el array de products del carrito ---
  // productsArray: [ { product: "<productId>" OR id OR _id, quantity: <n> }, ... ]
  async replaceProducts(cartId, productsArray) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new Error('Cart ID inválido');
    if (!Array.isArray(productsArray)) throw new Error('Products debe ser un array');

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    // Normalizar y fusionar entradas duplicadas
    const normalized = productsArray.map(item => {
      const pid = item.product || item.id || item._id;
      if (!pid) throw new Error('Cada producto debe tener product/id/_id');
      return { product: String(pid), quantity: Number(item.quantity) || 1 };
    });

    // Fusionar duplicados: sumar cantidades por productId
    const map = new Map();
    normalized.forEach(({ product, quantity }) => {
      if (!mongoose.Types.ObjectId.isValid(product)) {
        throw new Error(`Product ID inválido: ${product}`);
      }
      const prev = map.get(product) || 0;
      map.set(product, prev + Number(quantity));
    });
    const finalProducts = Array.from(map.entries()).map(([product, quantity]) => ({ product, quantity }));

    // Validar que todos los productIds existen en la colección Products
    const ids = finalProducts.map(p => p.product);
    const existing = await Product.find({ _id: { $in: ids } }).select('_id').lean();
    const existingIds = new Set(existing.map(e => String(e._id)));
    const missing = ids.filter(id => !existingIds.has(String(id)));
    if (missing.length > 0) {
      throw new Error(`Algunos productos no existen: ${missing.join(', ')}`);
    }

    // Reemplazar y guardar
    cart.products = finalProducts;
    await cart.save();

    // Devolver carrito poblado
    return await cart.populate('products.product');
  }

  // Alias por compatibilidad con managers antiguos
  async updateCartProducts(cartId, productsArray) {
    return this.replaceProducts(cartId, productsArray);
  }
}

module.exports = new CartManager();
