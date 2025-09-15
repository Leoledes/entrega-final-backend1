const express = require('express');
const router = express.Router();
const { productManager } = require('../dao/products.dao');

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products, style: 'home.css' });
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products, style: 'realtime.css' });
    } catch (error) {
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});

module.exports = router;