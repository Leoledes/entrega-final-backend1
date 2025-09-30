// src/config/server.js
require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const connectDB = require("./database");

const productsRouter = require('../routes/products.routes');
const cartsRouter = require('../routes/carts.routes');
const viewsRouter = require('../routes/views.router');

const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Conectar a MongoDB
connectDB();

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// SOCKET.IO
io.on('connection', async (socket) => {
  console.log('Cliente conectado:', socket.id);

  // ---------------- Productos ----------------
  const productsFromDB = await productDAO.getAllProducts();
  socket.emit('productsUpdated', productsFromDB.map(p => ({ ...p.toObject(), id: p._id })));

  // Crear producto
  socket.on('newProduct', async (data) => {
    try {
      await productDAO.createProduct(data);
      const updatedProducts = await productDAO.getAllProducts();
      io.emit('productsUpdated', updatedProducts.map(p => ({ ...p.toObject(), id: p._id })));
    } catch (error) {
      console.error("Error creando producto:", error.message);
    }
  });

  // Eliminar producto
  socket.on('deleteProduct', async (productId) => {
    try {
      await productDAO.deleteProductById(productId);
      const updatedProducts = await productDAO.getAllProducts();
      io.emit('productsUpdated', updatedProducts.map(p => ({ ...p.toObject(), id: p._id })));
    } catch (error) {
      console.error("Error eliminando producto:", error.message);
    }
  });

  // ---------------- Carritos ----------------
  const cartsFromDB = await cartDAO.getAllCarts();
  socket.emit('cartsUpdated', cartsFromDB);

  // Crear carrito
  socket.on('newCart', async () => {
    await cartDAO.createCart();
    const updatedCarts = await cartDAO.getAllCarts();
    io.emit('cartsUpdated', updatedCarts);
  });

  // Agregar producto al carrito
  socket.on('addProductToCart', async ({ cartId, productId, quantity }) => {
    try {
      await cartDAO.addProductToCart(cartId, productId, quantity);
      const updatedCarts = await cartDAO.getAllCarts();
      io.emit('cartsUpdated', updatedCarts);
    } catch (err) {
      console.error('Error agregando producto al carrito:', err.message);
    }
  });

  // Eliminar producto de carrito
  socket.on('removeProductFromCart', async ({ cartId, productId }) => {
    await cartDAO.removeProductFromCart(cartId, productId);
    const updatedCarts = await cartDAO.getAllCarts();
    io.emit('cartsUpdated', updatedCarts);
  });

  // Vaciar carrito
  socket.on('emptyCart', async (cartId) => {
    await cartDAO.emptyCart(cartId);
    const updatedCarts = await cartDAO.getAllCarts();
    io.emit('cartsUpdated', updatedCarts);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

// Puerto
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = { app, io };
