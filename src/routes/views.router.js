const { Router } = require('express');
const productManager = require('../managers/productManager');
const cartManager = require('../managers/cartManager');

const router = Router();

// 👉 Redirección de "/" a "/home"
router.get('/', (req, res) => {
    res.redirect('/home');
});

// 👉 Vista Home (lista de productos, sin tiempo real)
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { 
            layout: 'main', 
            title: 'Productos', 
            style: 'home.css', // 👈 mismo estilo que realtimeproducts
            products 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});


// 👉 Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { 
            layout: 'main', 
            title: 'Productos en Tiempo Real', 
            style: 'realtime.css', // aplica los estilos de los formularios
            products // pasa la lista al template
        });
    } catch (error) {
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});


// 👉 Vista de carritos en tiempo real
router.get('/realtimecarts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.render('realTimeCarts', { 
            layout: 'main', 
            title: 'Carritos en Tiempo Real', 
            style: 'carts.css', 
            carts 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los carritos en tiempo real.');
    }
});

module.exports = router;
