const { Router } = require('express');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const router = Router();

// Redirección de "/" a "/home"
router.get('/', (req, res) => {
    res.redirect('/home');
});

// Vista Home (lista de productos sin paginación)
router.get('/home', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({ ...p, id: p._id }));

        // Crear carrito en sesión si no existe
        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id;
        }

        res.render('home', {
            layout: 'main',
            title: 'Productos',
            style: 'home.css',
            products,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /home:", error.message);
        res.status(500).send('Error al obtener los productos.');
    }
});

// Vista productos paginados
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;

        const { products, totalDocs, totalPages, page: currentPage } =
            await productDAO.getProductsPaginated({ limit, page, query, sort, req });

        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;

        // Crear carrito en sesión si no existe
        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id;
        }

        res.render('pages/products', {
            layout: 'main',
            title: 'Productos',
            style: 'products.css',
            products,
            totalPages,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? req.originalUrl.replace(`page=${currentPage}`, `page=${currentPage - 1}`) : null,
            nextLink: hasNextPage ? req.originalUrl.replace(`page=${currentPage}`, `page=${currentPage + 1}`) : null,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products:", error.message);
        res.status(500).send('Error al obtener productos paginados.');
    }
});

// Vista detalle de producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productDAO.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');

        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id;
        }

        res.render('pages/productDetail', {
            layout: 'main',
            title: product.title,
            style: 'productDetail.css',
            product,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products/:pid:", error.message);
        res.status(500).send('Error al obtener detalle del producto.');
    }
});

// Vista carrito con productos poblados
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartDAO.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('pages/cartDetail', {
            layout: 'main',
            title: 'Carrito',
            style: 'cartDetail.css',
            cart,
            cartId: req.params.cid
        });
    } catch (error) {
        console.error("Error en /carts/:cid:", error.message);
        res.status(500).send('Error al obtener el carrito.');
    }
});

// Vistas tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({ ...p, id: p._id }));

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

router.get('/realtimecarts', async (req, res) => {
    try {
        const cartsFromDB = await cartDAO.getAllCarts();
        const carts = cartsFromDB.map(c => ({
            ...c,
            id: c._id,
            products: c.products.map(p => ({ ...p, id: p._id || p.id }))
        }));

        res.render('realtimecarts', {
            layout: 'main',
            title: 'Carritos en Tiempo Real',
            style: 'carts.css',
            carts
        });
    } catch (error) {
        console.error("Error en /realtimecarts:", error.message);
        res.status(500).send('Error al obtener los carritos en tiempo real.');
    }
});

module.exports = router;
