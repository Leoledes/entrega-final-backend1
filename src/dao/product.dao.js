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

module.exports = new ProductManager();
