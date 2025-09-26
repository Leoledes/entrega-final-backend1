const socket = io();

const productsList = document.getElementById('productsList');

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.setAttribute('data-id', product.id);
        div.innerHTML = `
            <h3>${product.name} (ID: ${product.id})</h3>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
        `;
        productsList.appendChild(div);
    });
}

socket.on('updateProducts', (products) => {
    renderProducts(products);
});

socket.on('newProduct', (product) => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.setAttribute('data-id', product.id);
    div.innerHTML = `
        <h3>${product.name} (ID: ${product.id})</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Categoría: ${product.category}</p>
    `;
    productsList.appendChild(div);
});

socket.on('deleteProduct', (productId) => {
    const productDiv = document.querySelector(`.product-card[data-id='${productId}']`);
    if (productDiv) productDiv.remove();
});

const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value
    };
    socket.emit('addProduct', newProduct);
    addProductForm.reset();
});

const deleteProductForm = document.getElementById('deleteProductForm');
deleteProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('productIdToDelete').value;
    socket.emit('deleteProduct', productId);
    deleteProductForm.reset();
});
