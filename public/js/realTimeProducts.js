const socket = io();

const productsList = document.getElementById('productsList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

const renderProducts = (products) => {
    productsList.innerHTML = '';
    
    if (!products || products.length === 0) {
        productsList.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.innerHTML = `
            <h3>${product.title || product.name || 'Sin nombre'} (ID: ${product.id || 'Sin ID'})</h3>
            <p><strong>Descripción:</strong> ${product.description || 'Sin descripción'}</p>
            <p><strong>Precio:</strong> $${product.price || 0}</p>
            <p><strong>Stock:</strong> ${product.stock || 0}</p>
            <p><strong>Categoría:</strong> ${product.category || 'Sin categoría'}</p>
            <p><strong>Código:</strong> ${product.code || 'Sin código'}</p>
            <p><strong>Estado:</strong> ${product.status ? 'Activo' : 'Inactivo'}</p>
        `;
        productsList.appendChild(productCard);
    });
};

socket.on('updateProducts', (products) => {
    console.log('📦 Productos recibidos:', products);
    renderProducts(products);
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);
    const newProduct = {
        status: true,
        thumbnails: []
    };
    
    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            newProduct[key] = parseFloat(value) || 0;
        } else if (key === 'name') {
            newProduct['name'] = value;
            newProduct['title'] = value;
        } else {
            newProduct[key] = value;
        }
    });

    if (!newProduct.code) {
        newProduct.code = 'PROD-' + Date.now();
    }

    console.log('🚀 Enviando producto:', newProduct);
    socket.emit('addProduct', newProduct);
    addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.getElementById('productIdToDelete').value;
    
    if (!productId) {
        alert('Por favor ingresa un ID de producto válido');
        return;
    }
    
    console.log('🗑️ Eliminando producto ID:', productId);
    socket.emit('deleteProduct', productId); 
    deleteProductForm.reset();
});

socket.on('productError', (data) => {
    console.error('❌ Error de producto:', data);
    alert(`Error: ${data.message}`);
});

socket.on('connect', () => {
    console.log('✅ Conectado al servidor');
});

socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor');
});