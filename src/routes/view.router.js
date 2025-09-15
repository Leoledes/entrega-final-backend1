// src/routes/views.router.js

const express = require('express');
const router = express.Router();
const { productManager } = require('../dao/products.dao');

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products, style: 'home.css' }); // Agregamos un estilo opcional
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

// Nueva ruta para la vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products, style: 'realtime.css' }); // Pasamos los productos iniciales y un estilo
    } catch (error) {
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});

module.exports = router;