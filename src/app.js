const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');

const productsRouter = require('./routes/products.routes');
const viewsRouter = require('./routes/views.router');

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);

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

app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

module.exports = app;
