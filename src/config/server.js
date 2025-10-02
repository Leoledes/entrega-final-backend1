// EN src/config/server.js (Versión estable sin el middleware)

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const session = require('express-session');
const connectDB = require("./database");

// <<<<<<< ¡IMPORTACIÓN DE cartInitializer ELIMINADA! >>>>>>>

const productsRouter = require('../routes/products.routes');
const cartsRouter = require('../routes/carts.routes');
const viewsRouter = require('../routes/views.router');

const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

// 1. CREACIÓN DEL MIDDLEWARE DE SESIÓN
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

// 2. APLICACIÓN DEL MIDDLEWARE A EXPRESS Y SOCKET.IO
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware); // Permite a Socket.IO acceder a req.session

// <<<<<<< ¡APLICACIÓN DE cartInitializer ELIMINADA DE AQUÍ! >>>>>>>

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// =========================================================================
// FUNCIÓN CENTRALIZADA Y CORREGIDA PARA MAPEAR CARROS (SE MANTIENE)
// =========================================================================

const mapCartProducts = (cartsFromDB) => {
    return cartsFromDB.map(c => ({
        id: c._id,
        products: c.products
            // Mantiene la robustez contra referencias nulas
            .filter(p => p.product) 
            .map(p => ({
                id: p.product?._id, 
                name: p.product?.name, 
                price: p.product?.price, 
                quantity: p.quantity
            }))
    }));
};

// ... (El resto de la lógica de Socket.IO io.on('connection', ...) permanece igual, 
//      ya que esta lógica es estable y necesaria para las vistas de tiempo real)

io.on('connection', async (socket) => {
    // ... (Mantener todo el código de conexión, try/catch y listeners de IO)
    // ...
    // ...
});

app.use((req, res) => res.status(404).json({ status: 'error', message: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

module.exports = { app, io };