require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');

const productsRouter = require('./src/routes/products.routes');
const cartsRouter = require('./src/routes/carts.routes');
const viewsRouter = require('./src/routes/views.router');

const productManager = require('./src/managers/productManager');
const cartManager = require('./src/managers/cartManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// SOCKET.IO
io.on('connection', async (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar productos existentes al cliente que se conecta
  const existingProducts = await productManager.getProducts();
  socket.emit('productsUpdated', existingProducts);

  // Enviar carritos existentes al cliente que se conecta
  const existingCarts = await cartManager.getCarts();
  socket.emit('cartsUpdated', existingCarts);

  // Productos en tiempo real
  socket.on('newProduct', async (product) => {
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getProducts();
    io.emit('productsUpdated', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit('productsUpdated', updatedProducts);
  });

  // Carritos en tiempo real
  socket.on('newCart', async () => {
    const cart = await cartManager.createCart();
    const carts = await cartManager.getCarts();
    io.emit('cartsUpdated', carts);
    socket.emit('cartCreated', cart); // devolver al cliente su carrito nuevo
  });

  socket.on('addProductToCart', async ({ cartId, product }) => {
    await cartManager.addProductToCart(cartId, product);
    const carts = await cartManager.getCarts();
    io.emit('cartsUpdated', carts);
  });

  socket.on('removeProductFromCart', async ({ cartId, productId }) => {
    await cartManager.removeProductFromCart(cartId, productId);
    const carts = await cartManager.getCarts();
    io.emit('cartsUpdated', carts);
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
