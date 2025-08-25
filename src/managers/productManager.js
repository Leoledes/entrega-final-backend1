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
}

module.exports = ProductManager;