const express = require("express");
const app = express();

const fs = require("fs/promises");

const PORT = 8080;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.get("/api/products", (req, res) => {
  const data = fs.readFileSync("./db/products.json", "utf-8");
  const products = JSON.parse(data || "[]");
  res.json(products);
});