const { Router } = require('express');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao'); // Se mantiene por si es necesario en otras rutas

const router = Router();

router.get('/', (req, res) => res.redirect('/home'));

router.get('/home', async (req, res) => {
    try {
        // La lógica asíncrona de creación de carrito se ha ELIMINADO de aquí.
        // La página carga rápidamente al solo ejecutar la consulta de productos.
        
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.stock,
            status: p.status
        }));

        res.render('home', {
            layout: 'main',
            title: 'Productos',
            style: 'home.css',
            products,
            // Si el cartId existe en la sesión, se pasa. Si no, es 'undefined', lo cual no bloquea.
            cartId: req.session.cartId 
        });
    } catch (error) {
        console.error("Error en /home:", error.message);
        res.status(500).send('Error al obtener los productos.');
    }
});

// =========================================================
// Rutas de Vistas Adicionales (Ejemplos)
// =========================================================

router.get('/products', async (req, res) => {
    // Si tienes lógica de paginación o filtrado aquí, debe estar.
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.stock,
            status: p.status
        }));

        res.render('pages/products', {
            layout: 'main',
            title: 'Listado de Productos',
            style: 'home.css', // O el CSS que uses para esta vista
            products,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products:", error.message);
        res.status(500).send('Error al obtener el listado de productos.');
    }
});

router.get('/products/:pid', async (req, res) => {
    // Tu lógica para la vista de detalle de producto
});

router.get('/carts/:cid', async (req, res) => {
    // Tu lógica para la vista de detalle de carrito
});

router.get('/realtimeproducts', async (req, res) => {
    // Ruta que carga la vista de Socket.IO
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.stock,
            status: p.status
        }));

        res.render('realTimeProducts', {
            layout: 'main',
            title: 'Productos en Tiempo Real',
            style: 'realtime.css',
            products
        });
    } catch (error) {
        console.error("Error en /realtimeproducts:", error.message);
        res.status(500).send('Error al cargar la vista de tiempo real.');
    }
});

router.get('/realtimecarts', async (req, res) => {
    try {
        const cartsFromDB = await cartDAO.getAllCarts();
        const carts = cartsFromDB.map(c => ({
            id: c._id,
            products: c.products
                .filter(p => p.product)
                .map(p => ({
                    id: p.product._id,
                    name: p.product.name,
                    quantity: p.quantity
                }))
        }));

        res.render('realTimeCarts', {
            layout: 'main',
            title: 'Carritos en Tiempo Real',
            style: 'realtime.css',
            carts
        });
    } catch (error) {
        console.error("Error en /realtimecarts:", error.message);
        res.status(500).send('Error al cargar la vista de carritos en tiempo real.');
    }
});

module.exports = router;