const express = require('express');
const router = express.Router();
const { productManager } = require('../dao/products.dao');

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

module.exports = router;