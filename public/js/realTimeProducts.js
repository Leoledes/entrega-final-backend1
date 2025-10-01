const socket = io();
const productsList = document.getElementById('productsList');

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.dataset.id = p.id;
        div.innerHTML = `
            <h3>${p.name} (ID: ${p.id})</h3>
            <p>${p.description}</p>
            <p>Precio: $${p.price}</p>
            <p>Stock: ${p.stock}</p>
            <p>Categoría: ${p.category}</p>
        `;
        productsList.appendChild(div);
    });
}

socket.on('productsUpdated', (products) => {
    renderProducts(products);
});

const addForm = document.getElementById('addProductForm');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: addForm.name.value,
        description: addForm.description.value,
        price: parseFloat(addForm.price.value),
        stock: parseInt(addForm.stock.value),
        category: addForm.category.value
    };
    socket.emit('newProduct', product);
    addForm.reset();
});

const deleteForm = document.getElementById('deleteProductForm');
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = deleteForm.productIdToDelete.value;
    socket.emit('deleteProduct', productId);
    deleteForm.reset();
});
