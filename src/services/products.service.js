const { productManager } = require('../dao/products.dao');

const getAllProducts = async () => {
    return productManager.getProducts();
};

const getProductById = async (pid) => {
    return productManager.getProductById(pid);
};

const addNewProduct = async (productData) => {
    if (!productData.title || !productData.description || !productData.code || !productData.price || typeof productData.status !== 'boolean' || !productData.stock || !productData.category || !productData.thumbnails) {
        throw new Error("Faltan campos obligatorios o el formato es incorrecto");
    }
    return productManager.addProduct(productData);
};

const updateProduct = async (pid, updateData) => {
    return productManager.updateProduct(pid, updateData);
};

const deleteProduct = async (pid) => {
    return productManager.deleteProduct(pid);
};

module.exports = {
    getAllProducts,
    getProductById,
    addNewProduct,
    updateProduct,
    deleteProduct
};