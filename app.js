const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const { readJson, writeJson } = require("./src/utils/fileManager");
const ProductManager = require("./src/managers/productManager");
const CartManager = require("./src/managers/cartManager");

const productManager = new ProductManager("products.json");
const cartManager = new CartManager("carts.json");

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
        name: "Planta de prueba",
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

app.post("/api/products", async (req, res) => {
  try {
    const newProductData = req.body;
    if (!newProductData.name || !newProductData.price) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const newProduct = await productManager.addProduct(newProductData);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const success = await productManager.deleteProduct(pid);
    if (!success) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await cartManager.getProductsFromCart(cid);
    if (!products) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
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




