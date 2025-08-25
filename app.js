const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const { readJson, writeJson } = require("./src/utils/fileManager");

// Importar la clase ProductManager
const ProductManager = require("./src/managers/productManager");

// Instanciar la clase. Le pasamos el nombre del archivo con el que va a trabajar.
const productManager = new ProductManager("products.json");

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
    let products = await readJson("products.json");
    if (products.length === 0) {
      products.push({
        id: 1,
        name: "Planta de prueba 🌱",
        price: 100
      });
      await writeJson("products.json", products);
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




