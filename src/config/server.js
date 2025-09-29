require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');

const productsRouter = require('../routes/products.routes');
const cartsRouter = require('../routes/carts.routes');
const viewsRouter = require('../routes/views.router');

const productManager = require('../managers/productManager');
const cartManager = require('../managers/cartManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

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

  // Enviar lista inicial de productos
  const products = await productManager.getProducts();
  socket.emit('productsUpdated', products);

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
