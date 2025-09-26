require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');

const productsRouter = require('./src/routes/products.routes');
const viewsRouter = require('./src/routes/views.router');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  const { productManager } = require('./src/dao/products.dao');

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

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = { app, io };
