// views.router.js
const { Router } = require('express');
const productDAO = require('../dao/product.dao');
const cartDAO = require('../dao/cart.dao');

const router = Router();

// ===================== MIDDLEWARE DE CARRO EN SESIÓN =====================
router.use(async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      const newCart = await cartDAO.createCart();
      req.session.cartId = newCart._id.toString();
    }
    next();
  } catch (error) {
    console.error('Error al crear carrito en sesión:', error.message);
    next(error);
  }
});

// ===================== REDIRECCIÓN RAÍZ =====================
router.get('/', (req, res) => res.redirect('/home'));

// ===================== HOME =====================
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
      status: p.status,
      thumbnails: p.thumbnails
    }));

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

// ===================== LISTADO DE PRODUCTOS =====================
router.get('/products', async (req, res) => {
  try {
    const productsFromDB = await productDAO.getAllProducts();
    const products = productsFromDB.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      status: p.status,
      thumbnails: p.thumbnails
    }));

    res.render('pages/products', {
      layout: 'main',
      title: 'Listado de Productos',
      style: 'home.css',
      products,
      cartId: req.session.cartId
    });
  } catch (error) {
    console.error("Error en /products:", error.message);
    res.status(500).send('Error al obtener el listado de productos.');
  }
});

// ===================== DETALLE DE PRODUCTO =====================
router.get('/products/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const productFromDB = await productDAO.getProductById(pid);

    if (!productFromDB) return res.status(404).send('Producto no encontrado');

    const product = {
      id: productFromDB._id,
      name: productFromDB.name,
      description: productFromDB.description,
      price: productFromDB.price,
      category: productFromDB.category,
      stock: productFromDB.stock,
      status: productFromDB.status,
      thumbnails: productFromDB.thumbnails
    };

    res.render('pages/productDetail', {
      layout: 'main',
      title: product.name,
      style: 'productDetail.css',
      product,
      cartId: req.session.cartId
    });
  } catch (error) {
    console.error('Error en /products/:pid:', error.message);
    res.status(500).send('Error al obtener el producto');
  }
});

// ===================== DETALLE DE CARRITO =====================
router.get('/carts/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartFromDB = await cartDAO.getCartById(cid);

    if (!cartFromDB) return res.status(404).send('Carrito no encontrado');

    const cart = {
      id: cartFromDB._id,
      products: cartFromDB.products.map(p => ({
        id: p.product?._id,
        name: p.product?.name,
        price: p.product?.price,
        quantity: p.quantity,
        thumbnails: p.product?.thumbnails
      }))
    };

    res.render('pages/cartDetail', {
      layout: 'main',
      title: `Carrito ${cart.id}`,
      style: 'home.css',
      cart
    });
  } catch (error) {
    console.error('Error en /carts/:cid:', error.message);
    res.status(500).send('Error al obtener el carrito');
  }
});

// ===================== REALTIME PRODUCTS =====================
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
      status: p.status,
      thumbnails: p.thumbnails
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

// ===================== REALTIME CARTS =====================
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
          quantity: p.quantity,
          thumbnails: p.product.thumbnails
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

// ===================== AGREGAR PRODUCTO AL CARRITO =====================
router.post('/api/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;

    if (!pid) return res.status(400).json({ status: 'error', error: 'Product ID required' });

    const updatedCart = await cartDAO.addProductToCart(cid, pid, quantity);

    if (!updatedCart) return res.status(404).json({ status: 'error', error: 'Cart or product not found' });

    res.redirect('back'); // vuelve a la misma página
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error.message);
    res.status(500).json({ status: 'error', error: 'No se pudo agregar el producto al carrito' });
  }
});

module.exports = router;
