const { Router } = require('express');
const productManager = require('../managers/productManager');

const router = Router();

// Home → muestra productos (sin tiempo real)
router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { 
            layout: 'main', 
            title: 'Productos', 
            style: 'home.css', 
            products 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { 
            layout: 'main', 
            title: 'Productos en Tiempo Real', 
            style: 'realtime.css', 
            products 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});


router.get('/realtimecarts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts(); // método que devuelve todos los carritos
        res.render('realTimeCarts', { 
            layout: 'main', 
            title: 'Carritos en Tiempo Real', 
            style: 'carts.css', 
            carts 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los carritos.');
    }
});


module.exports = router;
