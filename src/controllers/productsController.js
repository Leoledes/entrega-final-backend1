const productDAO = require('../dao/product.dao');

const getProducts = async (req, res) => {
  try {
    // Validación y conversión de query params
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const { query, sort } = req.query;

    // Obtener productos paginados desde DAO
    const { products, totalDocs, totalPages, page: currentPage } =
      await productDAO.getProductsPaginated({ limit, page, query, sort });

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    const prevPage = hasPrevPage ? currentPage - 1 : null;
    const nextPage = hasNextPage ? currentPage + 1 : null;

    // Construir links prev/next
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

const getProductById = async (req, res) => {
  try {
    const product = await productDAO.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productDAO.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productDAO.updateProductById(req.params.pid, req.body);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
