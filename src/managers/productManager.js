const { readJson, writeJson } = require("../utils/fileManager");
const crypto = require('crypto'); 

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
      id: crypto.randomUUID(),
      ...productData,
      status: true
    };
    products.push(newProduct);
    await writeJson(this.path, products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) {
      return null;
    }
    const updatedProduct = { ...products[index], ...updateData };
    products[index] = updatedProduct;
    await writeJson(this.path, products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter(p => String(p.id) !== String(id));
    
    if (newProducts.length === products.length) {
      return false;
    }
    await writeJson(this.path, newProducts);
    return true;
  }
}

module.exports = ProductManager;