document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const productsContainer = document.getElementById('productsContainer');

  let activeCartId = null; // <-- Carrito activo

  // --- Función para setear carrito activo ---
  function setActiveCart(cartId) {
    activeCartId = cartId;
  }

  // --- Función para renderizar productos ---
  function renderProducts(products) {
    productsContainer.innerHTML = '';

    if (!products || products.length === 0) {
      productsContainer.innerHTML = '<p class="no-products">No hay productos disponibles.</p>';
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';

      div.innerHTML = `
        <img src="${p.thumbnails?.[0] || '/img/default-product.png'}" alt="${p.name}" class="product-img">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>ID: ${p.id}</p>
          <p>${p.description || ''}</p>
          <p class="price-tag">$${p.price || '0.00'}</p>
        </div>
        <div class="actions-container">
          <button class="btn-add" data-product-id="${p.id}">Agregar</button>
          <a href="/products/${p.id}" class="btn-detail">Ver detalle</a>
        </div>
      `;

      productsContainer.appendChild(div);
    });

    // --- Eventos botón Agregar ---
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!activeCartId) return alert('No hay carrito activo para agregar el producto.');

        const productId = btn.dataset.productId;
        const quantity = 1; // Por defecto 1, podés cambiar o agregar input si querés

        try {
          const res = await fetch(`/api/carts/${activeCartId}/products/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
          });

          if (!res.ok) throw new Error('Error agregando producto');

          alert('Producto agregado correctamente');
          socket.emit('addProductToCart', { cartId: activeCartId, productId, quantity });
        } catch (err) {
          console.error(err);
          alert('No se pudo agregar el producto');
        }
      });
    });
  }

  // --- Socket: actualización de productos ---
  socket.on('productsUpdated', products => {
    renderProducts(products);
  });

  // --- Socket: actualización de carritos para setear carrito activo automáticamente ---
  socket.on('cartsUpdated', carts => {
    if (!activeCartId && carts.length > 0) {
      setActiveCart(carts[0].id); // Toma el primer carrito existente como activo
    }
  });

  socket.on('error', data => {
    alert(data.message || 'Ocurrió un error en tiempo real.');
  });
});
