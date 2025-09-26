const { productManager } = require('../dao/products.dao');

const getAllProducts = async () => {
    return productManager.getProducts();
};

const getProductById = async (pid) => {
    return productManager.getProductById(pid);
};

const addNewProduct = async (productData) => {
    console.log("📥 Datos recibidos en service:", productData);
    
    if (productData.name && !productData.title) {
        productData.title = productData.name;
    }
    
    if (typeof productData.status !== 'boolean') {
        productData.status = true;
    }
    
    if (!productData.thumbnails) {
        productData.thumbnails = [];
    }
    
    if (!productData.code) {
        productData.code = 'PROD-' + Date.now();
    }

    const requiredFields = ['title', 'description', 'price', 'stock', 'category'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }
    
    const result = await productManager.addProduct(productData);
    console.log("📤 Producto creado en service:", result);
    
    return result;
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