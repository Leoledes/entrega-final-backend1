const productDAO = require('../dao/product.dao');

// Obtener lista de productos con paginación
const getProducts = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const { query, sort } = req.query;

    const { products, totalDocs, totalPages, page: currentPage } =
      await productDAO.getProductsPaginated({ limit, page, query, sort });

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const nextPage = hasNextPage ? currentPage + 1 : null;

    const buildLink = (newPage) => {
      const params = { ...req.query, page: newPage };
      const q = new URLSearchParams(params).toString();
      return `${req.protocol}://${req.get("host")}${req.baseUrl}?${q}`;
    };

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(prevPage) : null,
      nextLink: hasNextPage ? buildLink(nextPage) : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener detalle de un producto (ahora renderiza HBS)
const getProductById = async (req, res) => {
  try {
    const product = await productDAO.getProductById(req.params.pid);
    if (!product) return res.status(404).render('404', { message: "Producto no encontrado" });

    res.render('productdetail', { 
      product, 
      cartId: req.session?.cartId || '' // Para usar en addToCart
    });
  } catch (err) {
    res.status(500).render('500', { error: err.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const product = await productDAO.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar producto por ID
const updateProduct = async (req, res) => {
  try {
    const product = await productDAO.updateProductById(req.params.pid, req.body);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar producto por ID
const deleteProduct = async (req, res) => {
  try {
    const deleted = await productDAO.deleteProductById(req.params.pid);
    if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
