const socket = io();

const createCartBtn = document.getElementById('createCartBtn');
const addProductForm = document.getElementById('addProductToCartForm');
const cartsList = document.getElementById('cartsList');

// Crear carrito nuevo
createCartBtn.addEventListener('click', () => {
    socket.emit('newCart');
});

// Agregar producto a carrito
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cartId = document.getElementById('cartId').value;
    const productId = document.getElementById('productId').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    socket.emit('addProductToCart', { cartId, productId, quantity });
    addProductForm.reset();
});

// Función para eliminar un producto de un carrito
function removeProduct(cartId, productId) {
    socket.emit('removeProductFromCart', { cartId, productId });
}

// Función para vaciar un carrito
function emptyCart(cartId) {
    socket.emit('emptyCart', cartId);
}

// Renderizar carritos
function renderCarts(updatedCarts) {
    cartsList.innerHTML = '';
    updatedCarts.forEach(cart => {
        const div = document.createElement('div');
        div.className = 'cart-card';
        div.dataset.id = cart._id;

        let productsHTML = '<ul>';
        cart.products.forEach(p => {
            productsHTML += `<li>
                Producto: ${p.product.name || p.product} | Cantidad: ${p.quantity}
                <button onclick="removeProduct('${cart._id}', '${p.product._id || p.product}')">Eliminar</button>
            </li>`;
        });
        productsHTML += '</ul>';

        div.innerHTML = `
            <h3>Carrito ID: ${cart._id}</h3>
            ${productsHTML}
            <button onclick="emptyCart('${cart._id}')">Vaciar Carrito</button>
        `;
        cartsList.appendChild(div);
    });
}

// Escuchar actualizaciones desde el servidor
socket.on('cartsUpdated', (updatedCarts) => {
    renderCarts(updatedCarts);
});
