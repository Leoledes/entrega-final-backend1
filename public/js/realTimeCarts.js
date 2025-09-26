const socket = io();

const createCartBtn = document.getElementById('createCart');
const addProductBtn = document.getElementById('addProduct');
const removeProductBtn = document.getElementById('removeProduct');

const currentCartSpan = document.getElementById('currentCart');
const cartsList = document.getElementById('cartsList');

let currentCartId = null;

// Crear carrito
createCartBtn.addEventListener('click', () => {
  socket.emit('newCart');
});

// Cuando el servidor confirma que se creó el carrito
socket.on('cartCreated', (cart) => {
  currentCartId = cart.id;
  currentCartSpan.innerText = `Carrito actual: ${cart.id}`;
});

// Agregar producto al carrito actual
addProductBtn.addEventListener('click', () => {
  if (!currentCartId) {
    return alert('Primero crea un carrito');
  }
  const productId = document.getElementById('productId').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value, 10) || 1;

  if (!productId) return alert('Ingresa un ID de producto');

  socket.emit('addProductToCart', {
    cartId: currentCartId,
    product: { id: productId, quantity }
  });
});

// Eliminar producto del carrito actual
removeProductBtn.addEventListener('click', () => {
  if (!currentCartId) {
    return alert('Primero crea un carrito');
  }
  const productId = document.getElementById('removeProductId').value.trim();
  if (!productId) return alert('Ingresa un ID de producto');

  socket.emit('removeProductFromCart', {
    cartId: currentCartId,
    productId
  });
});

// Cuando se actualizan los carritos en el servidor
socket.on('cartsUpdated', (carts) => {
  cartsList.innerHTML = '';
  carts.forEach(c => {
    const div = document.createElement('div');
    div.classList.add('cart-card');
    div.innerHTML = `
      <h3>Carrito ${c.id}</h3>
      <ul>
        ${c.products.map(p => `<li>Producto: ${p.id} - Cantidad: ${p.quantity}</li>`).join('')}
      </ul>
    `;
    cartsList.appendChild(div);
  });
});
