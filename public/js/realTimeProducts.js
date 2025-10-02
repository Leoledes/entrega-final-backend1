document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const productsContainer = document.getElementById('productsContainer');
  const addProductForm = document.querySelector('.add-product-form');

  // ===================== RENDERIZAR PRODUCTOS =====================
  function renderProducts(products) {
    productsContainer.innerHTML = '';

    if (!products || products.length === 0) {
      productsContainer.innerHTML = '<p class="no-products">No hay productos disponibles.</p>';
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.dataset.id = p.id;

      div.innerHTML = `
        <img src="${p.thumbnails?.[0] || '/img/default-product.png'}" alt="${p.name}" class="product-img">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>ID: ${p.id}</p>
          <p>${p.description || ''}</p>
          <p class="price-tag">$${p.price?.toFixed(2) || '0.00'}</p>
        </div>
        <div class="actions-container">
          <button class="btn-add" data-product-id="${p.id}">Agregar al carrito</button>
          <a href="/products/${p.id}" class="btn-detail">Ver detalle</a>
        </div>
      `;
      productsContainer.appendChild(div);
    });

    // Eventos para agregar productos a carrito
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', async () => {
        const productId = btn.dataset.productId;
        const cartId = prompt('Ingresa el ID del carrito donde agregar:');
        const quantity = parseInt(prompt('Cantidad:', '1')) || 1;

        if (!cartId || !productId) return alert('ID de carrito o producto inválido');

        try {
          await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
          });

          socket.emit("addProductToCart", { cartId, productId, quantity });
          alert(`Producto agregado al carrito ${cartId}`);
        } catch (err) {
          console.error(err);
          alert('Error al agregar producto al carrito');
        }
      });
    });
  }

  // ===================== EVENTOS SOCKET.IO =====================
  socket.on('productsUpdated', products => {
    renderProducts(products);
  });

  socket.on('error', data => {
    alert(data.message || 'Ocurrió un error en tiempo real.');
  });

  // ===================== CREAR NUEVO PRODUCTO =====================
  addProductForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addProductForm);

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock')) || 0,
      thumbnails: formData.getAll('thumbnails[]')
    };

    // Solo emitimos al servidor para que lo guarde y actualice todos los clientes
    socket.emit('newProduct', productData);
    addProductForm.reset();
    alert('Producto creado correctamente');
  });
});
