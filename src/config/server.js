require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const connectDB = require("./database"); // Conexión a MongoDB

// Routers y DAOs
const productsRouter = require('../routes/products.routes');
const cartsRouter = require('../routes/carts.routes');
const viewsRouter = require('../routes/views.router');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

// Middleware de sesión
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
});

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aplicación de sesión a Express y Socket.IO
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

// Routers
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// ================= MAPEO DE CARROS =================
const mapCartProducts = (cartsFromDB) => {
    return cartsFromDB.map(c => ({
        id: c._id,
        products: c.products
            .filter(p => p.product)
            .map(p => ({
                id: p.product?._id,
                name: p.product?.name,
                price: p.product?.price,
                quantity: p.quantity
            }))
    }));
};

// ================= SOCKET.IO =================
io.on('connection', async (socket) => {
    console.log('Cliente conectado:', socket.id);

    try {
        // Envío inicial de productos
        const productsFromDB = await productDAO.getAllProducts();
        socket.emit('productsUpdated', productsFromDB);

        // Envío inicial de carritos
        const cartsFromDB = await cartDAO.getAllCarts();
        socket.emit('cartsUpdated', mapCartProducts(cartsFromDB));

    } catch (error) {
        console.error('⚠️ Error inicializando Socket.IO:', error.message);
        socket.emit('error', { message: 'Fallo al cargar datos iniciales.' });
    }

    // --- Productos ---
    socket.on('newProduct', async (data) => {
        try {
            await productDAO.createProduct(data);
            const updatedProducts = await productDAO.getAllProducts();
            io.emit('productsUpdated', updatedProducts);
        } catch (err) {
            console.error('Error agregando producto:', err.message);
            socket.emit('error', { message: 'No se pudo agregar el producto.' });
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productDAO.deleteProductById(productId);
            const updatedProducts = await productDAO.getAllProducts();
            io.emit('productsUpdated', updatedProducts);
        } catch (err) {
            console.error('Error eliminando producto:', err.message);
            socket.emit('error', { message: 'No se pudo eliminar el producto.' });
        }
    });

    // --- Carritos ---
    socket.on('newCart', async () => {
        try {
            const newCart = await cartDAO.createCart();
            const updatedCarts = await cartDAO.getAllCarts();
            io.emit('cartsUpdated', mapCartProducts(updatedCarts));
        } catch (err) {
            console.error('Error creando carrito:', err.message);
            socket.emit('error', { message: 'No se pudo crear el carrito.' });
        }
    });

    socket.on('addProductToCart', async ({ cartId, productId, quantity }) => {
        try {
            await cartDAO.addProductToCart(cartId, productId, quantity || 1);
            const updatedCarts = await cartDAO.getAllCarts();
            io.emit('cartsUpdated', mapCartProducts(updatedCarts));
        } catch (err) {
            console.error('Error agregando producto al carrito:', err.message);
            socket.emit('error', { message: 'No se pudo agregar el producto al carrito.' });
        }
    });

    socket.on('emptyCart', async (cartId) => {
        try {
            await cartDAO.emptyCart(cartId);
            const updatedCarts = await cartDAO.getAllCarts();
            io.emit('cartsUpdated', mapCartProducts(updatedCarts));
        } catch (err) {
            console.error('Error vaciando carrito:', err.message);
            socket.emit('error', { message: 'No se pudo vaciar el carrito.' });
        }
    });

    socket.on('deleteCart', async (cartId) => {
        try {
            await cartDAO.deleteCartById(cartId);
            const updatedCarts = await cartDAO.getAllCarts();
            io.emit('cartsUpdated', mapCartProducts(updatedCarts));
        } catch (err) {
            console.error('Error eliminando carrito:', err.message);
            socket.emit('error', { message: 'No se pudo eliminar el carrito.' });
        }
    });

    socket.on('disconnect', () => console.log('Cliente desconectado:', socket.id));
});

// 404
app.use((req, res) => res.status(404).json({ status: 'error', message: 'Ruta no encontrada' }));

// Servidor
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

module.exports = { app, io };
