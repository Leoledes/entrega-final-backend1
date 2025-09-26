const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
require('dotenv').config();

const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/api/carts.routes');
const viewsRouter = require('./routes/views.router');


const { productManager } = require('./dao/products.dao');

const app = express();


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get("/test-products", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    if (products.length === 0) {
      products.push({
        id: 1,
        name: "Planta de prueba",
        price: 100
      });
      await productManager.updateProducts(products);
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: err.message });
});

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
