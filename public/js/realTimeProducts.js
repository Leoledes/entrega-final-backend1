document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const productsList = document.getElementById('productsList');

  // --- Función para renderizar productos ---
  function renderProducts(products) {
    productsList.innerHTML = '';

    if (!products || products.length === 0) {
      productsList.innerHTML = '<p class="no-products">No hay productos cargados.</p>';
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.dataset.id = p.id;

      // Imagen principal o placeholder
      const thumbnail = (p.thumbnails && p.thumbnails.length > 0)
        ? p.thumbnails[0]
        : 'https://via.placeholder.com/200x200?text=Sin+Imagen';

      div.innerHTML = `
        <img src="${thumbnail}" alt="${p.name}" class="product-img">
        <h3>${p.name}</h3>
        <p>ID: <span class="product-id">${p.id}</span></p>
        <p>${p.description || "Sin descripción"}</p>
        <span class="price-tag">$ ${p.price} <span>Stock: ${p.stock}</span></span>
        <p>Categoría: ${p.category}</p>
        <div class="actions-container">
          <button class="delete-btn" data-id="${p.id}">Eliminar</button>
        </div>
      `;

      productsList.appendChild(div);
    });

    // --- Botones de eliminar dinámicos ---
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        if (productId) {
          socket.emit('deleteProduct', productId);
        }
      });
    });
  }

  // --- Socket: productos actualizados ---
  socket.on('productsUpdated', products => {
    console.log("📦 Productos recibidos:", products);
    renderProducts(products);
  });

  socket.on('error', data => {
    alert(data.message || 'Ocurrió un error en tiempo real.');
  });

  // --- Formulario agregar producto ---
  const addForm = document.getElementById('addProductForm');
  addForm?.addEventListener('submit', e => {
    e.preventDefault();

    const thumbnails = addForm.thumbnail.value
      ? [addForm.thumbnail.value.trim()]
      : [];

    const product = {
      name: addForm.name.value,
      description: addForm.description.value,
      price: parseFloat(addForm.price.value),
      stock: parseInt(addForm.stock.value),
      category: addForm.category.value,
      thumbnails
    };

    socket.emit('newProduct', product);
    addForm.reset();
  });

  // --- Formulario eliminar producto ---
  const deleteForm = document.getElementById('deleteProductForm');
  deleteForm?.addEventListener('submit', e => {
    e.preventDefault();
    const productId = deleteForm.productIdToDelete.value;
    socket.emit('deleteProduct', productId);
    deleteForm.reset();
  });
});
