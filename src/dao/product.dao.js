const Product = require("../models/product.model");
const mongoose = require("mongoose");

class ProductManager {
  async createProduct(data) {
    try {
      if (!data) throw new Error("Datos de producto no proporcionados");
      const newProduct = new Product(data);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error creando producto:", error);
      throw new Error("Error al crear producto");
    }
  }

  // ===== CORRECCIÓN: ahora incluye 'thumbnails' =====
  async getAllProducts() {
    try {
      const products = await Product.find({}, "_id name description price category stock status thumbnails").lean();
      return products.map(p => ({
        id: p._id.toString(),
        ...p
      }));
    } catch (error) {
      console.error("Error al buscar producto:", error);
      throw new Error("Error al obtener productos");
    }
  }

  async getProductById(_id) {
    try {
      if (!_id) throw new Error("ID no proporcionado");
      const product = await Product.findById(_id).lean();
      return product;
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      return null;
    }
  }

  async updateProductById(_id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error("ID no válido");
      const updatedProduct = await Product.findByIdAndUpdate(_id, data, { new: true }).lean();
      return updatedProduct;
    } catch (error) {
      console.error("Error actualizando:", error);
      throw new Error("Error al actualizar");
    }
  }

  async deleteProductById(_id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error("ID no válido");
      const deletedProduct = await Product.findByIdAndDelete(_id).lean();
      return deletedProduct;
    } catch (error) {
      console.error("Error eliminando:", error.message);
      return null;
    }
  }

  async getProductsPaginated(options = {}) {
    const limit = parseInt(options.limit) || 10;
    let page = parseInt(options.page) || 1;
    const rawQuery = options.query;
    const sort = options.sort;

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
        if (rawQuery === 'true' || rawQuery === 'false') filter.status = rawQuery === 'true';
        else filter.category = rawQuery;
      }
    }

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
      .lean();

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    let prevLink = null, nextLink = null;
    if (options.req) {
      const buildLink = (newPage) => {
        const params = { ...options.req.query, page: newPage };
        const q = Object.keys(params)
          .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
          .join("&");
        return `${options.req.protocol}://${options.req.get('host')}${options.req.baseUrl}${options.req.path}?${q}`;
      };
      prevLink = hasPrevPage ? buildLink(prevPage) : null;
      nextLink = hasNextPage ? buildLink(nextPage) : null;
    }

    return {
      products,
      totalDocs,
      totalPages,
      page,
      limit,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink
    };
  }
}

module.exports = new ProductManager();
