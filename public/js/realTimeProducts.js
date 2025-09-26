const socket = io();

const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');
const productsList = document.getElementById('productsList');

addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const product = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value
  };
  socket.emit('newProduct', product);
  addProductForm.reset();
});

deleteProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('productIdToDelete').value;
  socket.emit('deleteProduct', id);
  deleteProductForm.reset();
});

socket.on('productsUpdated', (products) => {
  productsList.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <h3>${p.name} (ID: ${p.id})</h3>
      <p>${p.description}</p>
      <p>Precio: $${p.price}</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.category}</p>
    `;
    productsList.appendChild(div);
  });
});
