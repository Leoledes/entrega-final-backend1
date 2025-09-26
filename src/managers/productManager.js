const { readJson, writeJson } = require('../utils/fileManager');
const crypto = require('crypto');

class ProductManager {
  constructor(fileName = 'products.json') {
    this.fileName = fileName;
  }

  async getProducts() {
    return await readJson(this.fileName);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      ...productData
    };
    products.push(newProduct);
    await writeJson(this.fileName, products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    const updated = { ...products[idx], ...updateData, id: products[idx].id };
    products[idx] = updated;
    await writeJson(this.fileName, products);
    return updated;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter(p => String(p.id) !== String(id));
    if (newProducts.length === products.length) return false;
    await writeJson(this.fileName, newProducts);
    return true;
  }
}

module.exports = new ProductManager();
