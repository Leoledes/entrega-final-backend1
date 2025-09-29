const Product = require("../models/product.model");
const mongoose = require("mongoose");

class ProductManager {
  async createProduct(data) {
    try{
      if (!data) throw new Error("Datos de producto no proporcionados");
      const newProduct = new Product(data);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error creando producto:", error);
      throw new Error("Error al crear producto");
    }
    }

  async getAllProducts() {
    try{
      const products = await Product.find({}, "id name description price category");
      return products;
    } catch (error) {
      console.error("Error al buscar producto:", error);
      throw new Error("Error al obtener producto");
    }
  }

  async getProductById(id) {
    try {
      if (!id) throw new Error("ID no proporcionado");
      const user = await Product.findById(id);
      return user;
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      return null;
    }
  }

  async getProductByName(name) {
    try {
      const user = await Product.findOne({ name });
      if (!user) throw new Error("Producto no encontrado");
      return user;
    } catch (error) {
      console.error("Error buscando por Nombre:", error);
      return null;
    }
  }

  async updateProductById(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID no válido");
      }
      const updateProduct = await User.findByIdAndUpdate(id, data, { new: true });
      return updateProduct
    } catch (error) {
      console.error("Error actualizando:", error);
      throw new Error("Error al actualizar");
    }
  }

  async deleteProductById(id) {
    try {
      const productDelete = await Product.findByIdAndDelete(id);
      return productDelete
    } catch (error) {
      console.error("Error eliminando:", error.message);
      return null;
    }
  }
}


// const { readJson, writeJson } = require('../utils/fileManager');
// const crypto = require('crypto');

// //class ProductManager {
//   constructor(fileName = 'products.json') {
//     this.fileName = fileName;
//   }

//   async getProducts() {
//     return await readJson(this.fileName);
//   }

//   async getProductById(id) {
//     const products = await this.getProducts();
//     return products.find(p => String(p.id) === String(id)) || null;
//   }

//   async addProduct(productData) {
//     const products = await this.getProducts();
//     const newProduct = {
//       id: crypto.randomUUID(),
//       status: true,
//       ...productData
//     };
//     products.push(newProduct);
//     await writeJson(this.fileName, products);
//     return newProduct;
//   }

//   async updateProduct(id, updateData) {
//     const products = await this.getProducts();
//     const idx = products.findIndex(p => String(p.id) === String(id));
//     if (idx === -1) return null;
//     const updated = { ...products[idx], ...updateData, id: products[idx].id };
//     products[idx] = updated;
//     await writeJson(this.fileName, products);
//     return updated;
//   }

//   async deleteProduct(id) {
//     const products = await this.getProducts();
//     const newProducts = products.filter(p => String(p.id) !== String(id));
//     if (newProducts.length === products.length) return false;
//     await writeJson(this.fileName, newProducts);
//     return true;
//   }
// }//

module.exports = new ProductManager();
