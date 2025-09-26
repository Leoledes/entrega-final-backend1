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
    socket.emit('addProductToCart', { cartId, productId });
});

socket.on('cartsUpdated', (updatedCarts) => {
    cartsList.innerHTML = '';
    updatedCarts.forEach(cart => {
        const div = document.createElement('div');
        div.className = 'cart-card';
        div.dataset.id = cart.id;
        let productsHTML = '<ul>';
        cart.products.forEach(p => {
            productsHTML += `<li>Producto ID: ${p.id}, Cantidad: ${p.quantity}</li>`;
        });
        productsHTML += '</ul>';
        div.innerHTML = `<h3>Carrito ID: ${cart.id}</h3>${productsHTML}`;
        cartsList.appendChild(div);
    });
});
