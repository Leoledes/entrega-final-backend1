require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const connectDB = require("./database");

const productsRouter = require('../routes/products.routes');
const cartsRouter = require('../routes/carts.routes');
const viewsRouter = require('../routes/views.router');

const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);

    const productsFromDB = await productDAO.getAllProducts();
    socket.emit('productsUpdated', productsFromDB.map(p => ({ ...p, id: p._id })));

    const cartsFromDB = await cartDAO.getAllCarts();
    socket.emit('cartsUpdated', cartsFromDB);

    socket.on('newProduct', async (data) => {
        try {
            await productDAO.createProduct(data);
            const updatedProducts = await productDAO.getAllProducts();
            io.emit('productsUpdated', updatedProducts.map(p => ({ ...p, id: p._id })));
        } catch (error) {
            console.error("Error creando producto:", error.message);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productDAO.deleteProductById(productId);
            const updatedProducts = await productDAO.getAllProducts();
            io.emit('productsUpdated', updatedProducts.map(p => ({ ...p, id: p._id })));
        } catch (error) {
            console.error("Error eliminando producto:", error.message);
        }
    });

    socket.on('newCart', async () => {
        await cartDAO.createCart();
        const updatedCarts = await cartDAO.getAllCarts();
        io.emit('cartsUpdated', updatedCarts);
    });

    socket.on('addProductToCart', async ({ cartId, productId, quantity }) => {
        try {
            await cartDAO.addProductToCart(cartId, productId, quantity);
            const updatedCarts = await cartDAO.getAllCarts();
            io.emit('cartsUpdated', updatedCarts);
        } catch (err) {
            console.error('Error agregando producto al carrito:', err.message);
        }
    });

    socket.on('removeProductFromCart', async ({ cartId, productId }) => {
        await cartDAO.removeProductFromCart(cartId, productId);
        const updatedCarts = await cartDAO.getAllCarts();
        io.emit('cartsUpdated', updatedCarts);
    });

    socket.on('emptyCart', async (cartId) => {
        await cartDAO.emptyCart(cartId);
        const updatedCarts = await cartDAO.getAllCarts();
        io.emit('cartsUpdated', updatedCarts);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
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
