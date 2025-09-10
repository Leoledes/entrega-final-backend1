const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products.routes');
const { productManager } = require('./src/dao/products.dao');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});


app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

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

app.use('/api/products', productsRouter);

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

module.exports = app;
