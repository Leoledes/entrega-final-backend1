const socket = io();


const productsList = document.getElementById('productsList');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

const renderProducts = (products) => {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.innerHTML = `
            <h3>${product.name} (ID: ${product.id})</h3>
            <p>${product.description || ''}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category || ''}</p>
        `;
        productsList.appendChild(productCard);
    });
};

socket.on('updateProducts', (products) => {
    renderProducts(products);
});


addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);
    const newProduct = {};
    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            newProduct[key] = parseFloat(value);
        } else {
            newProduct[key] = value;
        }
    });

    socket.emit('addProduct', newProduct);
    addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = document.getElementById('productIdToDelete').value;
    socket.emit('deleteProduct', productId);
    deleteProductForm.reset();
});