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
      const products = await Product.find({}, "_id name description price category");
      return products;
    } catch (error) {
      console.error("Error al buscar producto:", error);
      throw new Error("Error al obtener producto");
    }
  }

  async getProductById(_id) {
    try {
      if (!_id) throw new Error("ID no proporcionado");
      const user = await Product.findById(_id);
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

  async updateProductById(_id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error("ID no válido");
      }
      const updateProduct = await Product.findByIdAndUpdate(_id, data, { new: true });
      return updateProduct
    } catch (error) {
      console.error("Error actualizando:", error);
      throw new Error("Error al actualizar");
    }
  }

  async deleteProductById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID no válido");
        }
        const productDelete = await Product.findByIdAndDelete(id);
        return productDelete;
    } catch (error) {
        console.error("Error eliminando:", error.message);
        return null;
    }
  }


  async getProductsPaginated(options = {}) {
    const limit = parseInt(options.limit) || 10;
    let page = parseInt(options.page) || 1;
    const rawQuery = options.query;
    const sort = options.sort; // 'asc' | 'desc'

    // Build filter
    const filter = {};
    if (rawQuery) {
      if (rawQuery.includes(':')) {
        const [k, v] = rawQuery.split(':');
        const key = k.trim().toLowerCase();
        const val = v.trim();
        if (key === 'category') filter.category = val;
        else if (key === 'status' || key === 'available') filter.status = val === 'true';
        else filter[key] = val;
      } else {
        // if rawQuery is 'true'/'false' treat as status, otherwise category
        if (rawQuery === 'true' || rawQuery === 'false') filter.status = rawQuery === 'true';
        else filter.category = rawQuery;
      }
    }

    // Sort
    let sortObj = {};
    if (sort === 'asc') sortObj = { price: 1 };
    else if (sort === 'desc') sortObj = { price: -1 };

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);

    if (page > totalPages) page = totalPages;

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // devuelve objetos planos, evita problemas con Handlebars

    return {
      products,
      totalDocs,
      totalPages,
      page,
      limit
    };
  }
}

module.exports = new ProductManager();
