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

  // ✅ Enviar productos iniciales desde MongoDB
  const productsFromDB = await productDAO.getAllProducts();
  const products = productsFromDB.map(p => {
      const obj = p.toObject();
      obj.id = obj._id; // para compatibilidad con Handlebars y JS frontend
      return obj;
  });
  socket.emit('productsUpdated', products);

  // Agregar nuevo producto
  socket.on('newProduct', async (data) => {
      try {
          await productDAO.createProduct(data);
          const updatedProducts = await productDAO.getAllProducts();
          const productsToSend = updatedProducts.map(p => {
              const obj = p.toObject();
              obj.id = obj._id;
              return obj;
          });
          io.emit('productsUpdated', productsToSend);
      } catch (error) {
          console.error("Error creando producto:", error.message);
      }
  });

  // Eliminar producto
  socket.on('deleteProduct', async (productId) => {
      try {
          await productDAO.deleteProductById(productId);
          const updatedProducts = await productDAO.getAllProducts();
          const productsToSend = updatedProducts.map(p => {
              const obj = p.toObject();
              obj.id = obj._id;
              return obj;
          });
          io.emit('productsUpdated', productsToSend);
      } catch (error) {
          console.error("Error eliminando producto:", error.message);
      }
  });

  socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
  });
});

// --- EVENTOS CARRITOS ---
socket.on('addProductToCart', async ({ cartId, productId, quantity }) => {
    try {
        await cartDAO.addProductToCart(cartId, productId, quantity); // ⚡ aquí usamos el método correcto
        const updatedCarts = await cartDAO.getAllCarts();
        const cartsToSend = updatedCarts.map(c => {
            const cartObj = c.toObject();
            cartObj.id = cartObj._id;
            cartObj.products = cartObj.products.map(p => ({ 
                ...p, 
                id: p.product._id || p.product.id,
                name: p.product.name,
                price: p.product.price,
                quantity: p.quantity
            }));
            return cartObj;
        });
        io.emit('cartsUpdated', cartsToSend);
    } catch (err) {
        console.error('Error agregando producto al carrito:', err.message);
    }
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
