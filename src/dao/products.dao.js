const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dataFolderPath = path.resolve(__dirname, '../../data');

const readJson = async (fileName) => {
    const filePath = path.join(dataFolderPath, fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]');
            return [];
        }
        throw new Error(`Error al leer el archivo ${fileName}: ${err.message}`);
    }
};

const writeJson = async (fileName, data) => {
    const filePath = path.join(dataFolderPath, fileName);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        throw new Error(`Error al escribir en el archivo ${fileName}: ${err.message}`);
    }
};

class ProductManager {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async getProducts() {
        return readJson(this.fileName);
    }

    async updateProducts(products) {
        await writeJson(this.fileName, products);
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        return products.find(p => String(p.id) === String(pid)); 
    }

    async addProduct(newProductData) {
        const products = await this.getProducts();
        const newProduct = {
            id: crypto.randomUUID(),
            status: true,
            ...newProductData
        };
        products.push(newProduct);
        await this.updateProducts(products);
        return newProduct;
    }

    async updateProduct(pid, updateData) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => String(p.id) === String(pid));
        if (productIndex === -1) {
            return null;
        }
        const updatedProduct = { ...products[productIndex], ...updateData, id: products[productIndex].id };
        products[productIndex] = updatedProduct;
        await this.updateProducts(products);
        return updatedProduct;
    }

    async deleteProduct(pid) {
        const products = await this.getProducts();
        const initialLength = products.length;
        const filteredProducts = products.filter(p => String(p.id) !== String(pid));
        if (filteredProducts.length === initialLength) {
            return false;
        }
        await this.updateProducts(filteredProducts);
        return true;
    }
}

const productManager = new ProductManager("products.json");

module.exports = {
    productManager
};