const { readJson, writeJson } = require("../utils/fileManager");
class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }
  async getProducts() {
    return await readJson(this.path);
  }
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => String(product.id) === String(id));
  }
  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: crypto.randomUUID(), // Genera un ID único para el producto
      ...productData, // Copia el resto de los datos del producto
      status: true
    };
    products.push(newProduct);
    await writeJson(this.path, products);
    return newProduct;
  }
}

module.exports = ProductManager;