document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productsList = document.getElementById('productsList');

    // --- FUNCION PARA RENDERIZAR LOS PRODUCTOS ---
    function renderProducts(products) {
        productsList.innerHTML = '';

        if (!products || products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No hay productos cargados.</p>';
            return;
        }

        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.dataset.id = p.id;

            div.innerHTML = `
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <span class="price-tag">
                    $ ${p.price} <span>Stock: ${p.stock}</span>
                </span>
                <p>Categoría: ${p.category}</p>
            `;

            productsList.appendChild(div);
        });
    }

    // --- SOCKET: PRODUCTOS ACTUALIZADOS ---
    socket.on('productsUpdated', (productsFromServer) => {
        const products = productsFromServer.map(p => ({
            id: p._id || p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category,
            status: p.status
        }));

        console.log("📦 Productos recibidos:", products);
        renderProducts(products);
    });

    // --- FORMULARIO: AGREGAR PRODUCTO ---
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
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
    }

    // --- FORMULARIO: ELIMINAR PRODUCTO ---
    const deleteForm = document.getElementById('deleteProductForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const productId = deleteForm.productIdToDelete.value;
            socket.emit('deleteProduct', productId);
            deleteForm.reset();
        });
    }
});
