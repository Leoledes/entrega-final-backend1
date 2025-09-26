const productService = require('../services/products.service');

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const newProductData = req.body;
        const newProduct = await productService.addNewProduct(newProductData);
        res.status(201).json(newProduct);
    } catch (err) {
            if (err.message.includes("Faltan campos")) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        const updatedProduct = await productService.updateProduct(pid, updateData);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const success = await productService.deleteProduct(pid);
        if (!success) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};