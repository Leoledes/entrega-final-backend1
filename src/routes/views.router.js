const { Router } = require('express');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const router = Router();

router.get('/', (req, res) => res.redirect('/home'));

router.get('/home', async (req, res) => {
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

        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id.toString();
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

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        const { products: productsFromDB, totalPages, page: currentPage } =
            await productDAO.getProductsPaginated({ limit, page, query, sort });

        const products = productsFromDB.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.stock,
            status: p.status
        }));

        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;
        const buildLink = (newPage) => {
            const params = { ...req.query, page: newPage };
            return `${req.path}?${Object.entries(params).map(([k,v])=>`${k}=${v}`).join("&")}`;
        };

        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id.toString();
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
            prevLink: hasPrevPage ? buildLink(currentPage - 1) : null,
            nextLink: hasNextPage ? buildLink(currentPage + 1) : null,
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products:", error.message);
        res.status(500).send('Error al obtener productos paginados.');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productDAO.getProductById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');

        if (!req.session.cartId) {
            const cart = await cartDAO.createCart();
            req.session.cartId = cart._id.toString();
        }

        res.render('pages/productDetail', {
            layout: 'main',
            name: product.name,
            style: 'productDetail.css',
            product: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                status: product.status
            },
            cartId: req.session.cartId
        });
    } catch (error) {
        console.error("Error en /products/:pid:", error.message);
        res.status(500).send('Error al obtener detalle del producto.');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartDAO.getCartById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('pages/cartDetail', {
            layout: 'main',
            title: 'Carrito',
            style: 'cartDetail.css',
            cart: {
                id: cart._id,
                products: cart.products.map(p => ({
                    id: p.product._id,
                    name: p.product.name,
                    price: p.product.price,
                    quantity: p.quantity
                }))
            },
            cartId: req.params.cid
        });
    } catch (error) {
        console.error("Error en /carts/:cid:", error.message);
        res.status(500).send('Error al obtener el carrito.');
    }
});

router.get('/realtimeproducts', async (req, res) => {
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
        res.status(500).send('Error al obtener los productos en tiempo real.');
    }
});

router.get('/realtimecarts', async (req, res) => {
    try {
        const cartsFromDB = await cartDAO.getAllCarts();
        const carts = cartsFromDB.map(c => ({
            id: c._id,
            products: c.products.map(p => ({
                id: p.product._id,
                name: p.product.name,
                price: p.product.price,
                quantity: p.quantity
            }))
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
