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
        div.className = 'product-card cart-card';
        // Correcto: Usar cart.id
        div.dataset.id = cart.id; 

        let productsHTML = '<ul>';

        cart.products.forEach(p => {
            // ==========================================================
            // CORRECCIÓN CLAVE: Acceder directamente a p.name, p.id, p.price
            // ya que el servidor envía la información 'aplanada' y poblada.
            // ==========================================================
            productsHTML += `<li>
                ${p.name} (ID: ${p.id}) - Precio: $${p.price} - Cantidad: ${p.quantity}
                <button onclick="removeProduct('${cart.id}', '${p.id}')">Eliminar Producto</button>
            </li>`;
        });
        productsHTML += '</ul>';

        div.innerHTML = `
            <h3>Carrito ID: ${cart.id}</h3>
            ${productsHTML} 
            
            <button onclick="emptyCart('${cart.id}')">Vaciar Carrito</button>
            
            <button class="btn-delete-cart" data-cart-id="${cart.id}"> 
                Eliminar Carrito 🗑️
            </button> 
        `;

        cartsList.appendChild(div);
    });
}

socket.on('cartsUpdated', (updatedCarts) => {
    renderCarts(updatedCarts);
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-cart')) {

        const cartId = e.target.getAttribute('data-cart-id');
        
        // Se mantiene la validación para evitar errores
        if (cartId && cartId.trim() !== '') { 
            socket.emit('deleteCart', cartId);
            console.log(`Solicitando eliminación del Carrito: ${cartId}`);
        } else {
             console.error("Error: Intentando eliminar un carrito con ID vacío o nulo.");
        }
    }
});