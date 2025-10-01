const socket = io();

const createCartBtn = document.getElementById('createCartBtn');
const addProductForm = document.getElementById('addProductToCartForm');
const cartsList = document.getElementById('cartsList');

createCartBtn.addEventListener('click', () => {
    socket.emit('newCart');
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cartId = document.getElementById('cartId').value;
    const productId = document.getElementById('productId').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    socket.emit('addProductToCart', { cartId, productId, quantity });
    addProductForm.reset();
});

function removeProduct(cartId, productId) {
    socket.emit('removeProductFromCart', { cartId, productId });
}

function emptyCart(cartId) {
    socket.emit('emptyCart', cartId);
}

function renderCarts(updatedCarts) {
    cartsList.innerHTML = '';
    updatedCarts.forEach(cart => {
        const div = document.createElement('div');
        div.className = 'cart-card';
        div.dataset.id = cart._id;

        let productsHTML = '<ul>';
        cart.products.forEach(p => {
            productsHTML += `<li>
                ${p.product?.name || p.product} (ID: ${p.product?._id || p.product}) - Cantidad: ${p.quantity}
                <button onclick="removeProduct('${cart._id}', '${p.product?._id || p.product}')">Eliminar</button>
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

socket.on('cartsUpdated', (updatedCarts) => {
    renderCarts(updatedCarts);
});
