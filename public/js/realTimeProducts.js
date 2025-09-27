const socket = io();
const productsList = document.getElementById('productsList');
const createCartBtn = document.getElementById('createCartBtn');
const cartsList = document.getElementById('cartsList');
let currentCartId = null;

// Renderizar productos en la lista
function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
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

// Renderizar carritos
function renderCarts(carts) {
    if (!cartsList) return;
    cartsList.innerHTML = '';
    carts.forEach(c => {
        const div = document.createElement('div');
        div.className = 'cart-card';
        div.innerHTML = `
            <h3>Carrito ID: ${c.id}</h3>
            <ul>
                ${c.products.map(p => `<li>Producto ID: ${p.id}, Cantidad: ${p.quantity}</li>`).join('')}
            </ul>
        `;
        cartsList.appendChild(div);
    });
}

// Crear carrito
if (createCartBtn) {
    createCartBtn.addEventListener('click', () => {
        socket.emit('newCart');
    });
}

// Escuchar eventos del servidor
socket.on('productsUpdated', renderProducts);
socket.on('cartsUpdated', renderCarts);

socket.on('cartCreated', (cart) => {
    currentCartId = cart.id;
    alert(`Carrito creado con ID: ${cart.id}`);
});

// Agregar producto al carrito
function addProduct(pid, quantity = 1) {
    if (!currentCartId) {
        alert('Primero crea un carrito');
        return;
    }
    socket.emit('addProductToCart', { cartId: currentCartId, product: { id: pid, quantity } });
}

// Eliminar producto del carrito
function removeProduct(pid) {
    if (!currentCartId) {
        alert('Primero crea un carrito');
        return;
    }
    socket.emit('removeProductFromCart', { cartId: currentCartId, productId: pid });
}
