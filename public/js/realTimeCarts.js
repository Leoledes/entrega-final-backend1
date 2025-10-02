document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const cartsList = document.getElementById('cartsList');
  const createCartBtn = document.getElementById('createCartBtn');
  const addProductForm = document.querySelector('.add-product-form');

  // --- Función para renderizar carritos ---
  function renderCarts(carts) {
    cartsList.innerHTML = '';

    if (!carts || carts.length === 0) {
      cartsList.innerHTML = '<p class="no-carts">No hay carritos creados.</p>';
      return;
    }

    carts.forEach(cart => {
      const div = document.createElement('div');
      div.className = 'product-card cart-card';
      div.dataset.id = cart.id;

      div.innerHTML = `
        <h3>Carrito ID: ${cart.id}</h3>
        ${cart.products.length > 0 ? `
          <ul>
            ${cart.products.map(p => `<li>${p.name} (ID: ${p.id}) - Cantidad: ${p.quantity}</li>`).join('')}
          </ul>
        ` : '<p>No hay productos en este carrito.</p>'}
        <div class="actions-container">
          <button class="btn-empty" data-cart-id="${cart.id}">Vaciar Carrito</button>
          <button class="btn-delete-cart" data-cart-id="${cart.id}">Eliminar Carrito 🗑️</button>
        </div>
      `;

      cartsList.appendChild(div);
    });

    // --- Eventos botones Vaciar y Eliminar ---
    document.querySelectorAll('.btn-empty').forEach(btn => {
      btn.addEventListener('click', () => {
        const cartId = btn.dataset.cartId;
        if (confirm('¿Deseas vaciar este carrito?')) emptyCart(cartId);
      });
    });

    document.querySelectorAll('.btn-delete-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const cartId = btn.dataset.cartId;
        if (confirm('¿Deseas eliminar este carrito?')) deleteCart(cartId);
      });
    });
  }

  // --- Crear nuevo carrito ---
  createCartBtn?.addEventListener('click', () => {
    socket.emit('newCart');
  });

  // --- Agregar producto desde formulario ---
  addProductForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cartId = addProductForm.cartId.value;
    const productId = addProductForm.productId.value;
    const quantity = parseInt(addProductForm.quantity.value) || 1;

    if (!cartId || !productId) return alert('Completa ambos campos');

    try {
      await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });

      socket.emit("addProductToCart", { cartId, productId, quantity });
      addProductForm.reset();
    } catch (err) {
      console.error(err);
      alert('Error al agregar producto');
    }
  });

  // --- Vaciar carrito ---
  async function emptyCart(cartId) {
    try {
      await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
      socket.emit("emptyCart", cartId);
    } catch (err) {
      console.error(err);
      alert('Error al vaciar carrito');
    }
  }

  // --- Eliminar carrito ---
  async function deleteCart(cartId) {
    try {
      await fetch(`/api/carts/${cartId}/delete`, { method: "DELETE" });
      socket.emit("deleteCart", cartId);
    } catch (err) {
      console.error(err);
      alert('Error al eliminar carrito');
    }
  }

  // --- Socket: actualización de carritos ---
  socket.on('cartsUpdated', carts => {
    console.log('Carritos actualizados:', carts);
    renderCarts(carts);
  });

  socket.on('error', data => {
    alert(data.message || 'Ocurrió un error en tiempo real.');
  });
});
