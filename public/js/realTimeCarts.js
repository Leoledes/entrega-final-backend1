document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const createCartBtn = document.getElementById('createCartBtn');
    const addProductForm = document.getElementById('addProductToCartForm');
    const cartsList = document.getElementById('cartsList');

    // ---------------------------
    // CREAR NUEVO CARRITO
    // ---------------------------
    createCartBtn.addEventListener('click', () => {
        socket.emit('newCart');
    });

    // ---------------------------
    // AGREGAR PRODUCTO A CARRITO
    // ---------------------------
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cartId = document.getElementById('cartId').value.trim();
        const productId = document.getElementById('productId').value.trim();
        const quantity = parseInt(document.getElementById('quantity').value) || 1;

        if (!cartId || !productId) return;

        socket.emit('addProductToCart', { cartId, productId, quantity });
        addProductForm.reset();
    });

    // ---------------------------
    // FUNCIONES DE ACCIÓN
    // ---------------------------
    window.removeProduct = (cartId, productId) => {
        socket.emit('removeProductFromCart', { cartId, productId });
    };

    window.emptyCart = (cartId) => {
        socket.emit('emptyCart', cartId);
    };

    window.deleteCart = (cartId) => {
        socket.emit('deleteCart', cartId);
    };

    // ---------------------------
    // RENDER DE CARRITOS
    // ---------------------------
    function renderCarts(carts) {
        cartsList.innerHTML = '';
        if (!carts || carts.length === 0) {
            cartsList.innerHTML = '<p class="no-products">No hay carritos cargados.</p>';
            return;
        }

        carts.forEach(cart => {
            const div = document.createElement('div');
            div.className = 'product-card cart-card';
            div.dataset.id = cart.id;

            let productsHTML = '';
            if (cart.products.length > 0) {
                productsHTML = '<ul>';
                cart.products.forEach(p => {
                    productsHTML += `<li>
                        ${p.name} (ID: ${p.id}) - Cantidad: ${p.quantity}
                        <button onclick="removeProduct('${cart.id}', '${p.id}')">Eliminar Producto</button>
                    </li>`;
                });
                productsHTML += '</ul>';
            } else {
                productsHTML = '<p>No hay productos en este carrito.</p>';
            }

            div.innerHTML = `
                <h3>Carrito ID: ${cart.id}</h3>
                ${productsHTML}
                <div class="actions-container">
                    <button onclick="emptyCart('${cart.id}')">Vaciar Carrito</button>
                    <button onclick="deleteCart('${cart.id}')">Eliminar Carrito 🗑️</button>
                </div>
            `;

            cartsList.appendChild(div);
        });
    }

    // ---------------------------
    // SOCKET.IO LISTENERS
    // ---------------------------
    socket.on('cartsUpdated', (updatedCarts) => {
        renderCarts(updatedCarts);
    });
});
