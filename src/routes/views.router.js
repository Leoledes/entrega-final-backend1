// src/routes/views.routes.js
const { Router } = require('express');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const router = Router();

// 👉 Redirección de "/" a "/home"
router.get('/', (req, res) => {
    res.redirect('/home');
});

// 👉 Vista Home (lista de productos sin paginación)
router.get('/home', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({ ...p.toObject(), id: p._id }));

        // Guardar o recuperar cartId de sesión
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

// 👉 Vista productos paginados
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;

        const { products, totalDocs, totalPages, page: currentPage } =
            await productDAO.getProductsPaginated({ limit, page, query, sort });

        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;
        const prevPage = hasPrevPage ? currentPage - 1 : null;
        const nextPage = hasNextPage ? currentPage + 1 : null;

        const buildLink = (newPage) => {
            const params = { ...req.query, page: newPage };
            const q = Object.keys(params)
                .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                .join("&");
            return `${req.path}?${q}`;
        };

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
            prevPage,
            nextPage,
            prevLink: hasPrevPage ? buildLink(prevPage) : null,
            nextLink: hasNextPage ? buildLink(nextPage) : null,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products:", error.message);
        res.status(500).send('Error al obtener productos paginados.');
    }
});

// 👉 Vista detalle de producto
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
            product: product.toObject(),
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products/:pid:", error.message);
        res.status(500).send('Error al obtener detalle del producto.');
    }
});

// 👉 Vista carrito con productos poblados
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartDAO.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('pages/cartDetail', {
            layout: 'main',
            title: 'Carrito',
            style: 'cartDetail.css',
            cart: cart.toObject(),
            cartId: req.params.cid
        });
    } catch (error) {
        console.error("Error en /carts/:cid:", error.message);
        res.status(500).send('Error al obtener el carrito.');
    }
});

// 👉 Vistas tiempo real (opcionales)
router.get('/realtimeproducts', async (req, res) => {
    try {
        const productsFromDB = await productDAO.getAllProducts();
        const products = productsFromDB.map(p => ({ ...p.toObject(), id: p._id }));
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
        const carts = cartsFromDB.map(c => {
            const cartObj = c.toObject();
            cartObj.id = cartObj._id;
            cartObj.products = cartObj.products.map(p => ({ ...p, id: p._id || p.id }));
            return cartObj;
        });

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
