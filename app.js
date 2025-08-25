const express = require("express");
const app = express();
import fs from "fs/promises";
import crypto from "crypto";



app.use(express.json());
const PORT = 8080;

const DATA_DIR = "./db";
const PLANTS_FILE = `${DATA_DIR}/plants.json`;
const initializeFiles = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PLANTS_FILE).catch(async () => {
      await fs.writeFile(PLANTS_FILE, "[]", "utf-8");
      console.log("Archivo plants.json creado para almacenar las plantas.");
    });
  } catch (error) {
    console.error("Error al inicializar los archivos:", error);
  }
};

const fs = require("fs/promises");

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