// app.js
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');

const productsRouter = require('./routes/products.routes');
const viewsRouter = require('./routes/views.router');
const cartsRouter = require('./routes/carts.routes'); // si lo usás

const app = express();

// ------------------- HANDLEBARS -------------------
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// ------------------- MIDDLEWARE -------------------
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- SESSION -------------------
app.use(session({
    secret: 'mi_secreto_seguro', // cambiá por algo fuerte
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// ------------------- MIDDLEWARE DE CARRO EN SESIÓN -------------------
app.use(async (req, res, next) => {
    const cartDAO = require('./dao/cart.dao'); // require aquí para no romper imports
    try {
        if (!req.session.cartId) {
            const newCart = await cartDAO.createCart();
            req.session.cartId = newCart._id.toString();
        }
        next();
    } catch (error) {
        console.error('Error al crear carrito en sesión:', error.message);
        next(error);
    }
});

// ------------------- ROUTERS -------------------
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// ------------------- CORS / OPTIONS -------------------
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// ------------------- RAÍZ -------------------
app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// ------------------- 404 -------------------
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

module.exports = app;
