const { Router } = require('express');
const productDAO = require('../dao/product.dao');
//const cartDAO = require('../dao/cart.dao'); // si ya migraste carritos a MongoDB

const router = Router();

// 👉 Redirección de "/" a "/home"
router.get('/', (req, res) => {
    res.redirect('/home');
});

// 👉 Vista Home (lista de productos, sin tiempo real)
router.get('/home', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        // Convertir documentos Mongoose a objetos planos y agregar 'id'
        const products = productsFromDB.map(p => {
            const obj = p.toObject();
            obj.id = obj._id;
            return obj;
        });

        res.render('home', { 
            layout: 'main', 
            title: 'Productos', 
            style: 'home.css',
            products
        });
    } catch (error) {
        console.error("Error en /home:", error.message);
        res.status(500).send('Error al obtener los productos.');
    }
});

// 👉 Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => {
            const obj = p.toObject();
            obj.id = obj._id;
            return obj;
        });

        res.render('realTimeProducts', { 
            layout: 'main', 
            title: 'Productos en Tiempo Real', 
            style: 'realtime.css',
            products
        });
    } catch (error) {
        console.error("Error en /realtimeproducts:", error.message);
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});

// 👉 Vista de carritos en tiempo real
// router.get('/realtimecarts', async (req, res) => {
//     try {
//         const cartsFromDB = await cartDAO.getAllCarts();
//         const carts = cartsFromDB.map(c => {
//             const cartObj = c.toObject();
//             cartObj.id = cartObj._id;
//             // Convertir los productos del carrito
//             cartObj.products = cartObj.products.map(p => {
//                 p.id = p._id || p.id; // mantener compatibilidad
//                 return p;
//             });
//             return cartObj;
//         });

//         res.render('realTimeCarts', { 
//             layout: 'main', 
//             title: 'Carritos en Tiempo Real', 
//             style: 'carts.css', 
//             carts
//         });
//     } catch (error) {
//         console.error("Error en /realtimecarts:", error.message);
//         res.status(500).send('Error al obtener los carritos en tiempo real.');
//     }
// });

module.exports = router;
