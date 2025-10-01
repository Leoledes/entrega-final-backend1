// public/js/cart.js
async function addToCart(cartId, productId) {
  if (!cartId) return alert("No se encontró el carrito");
  await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: 1 })
  });
  alert("Producto agregado al carrito");
}

async function removeFromCart(cartId, productId) {
  await fetch(`/api/carts/${cartId}/products/${productId}`, { method: "DELETE" });
  location.reload();
}

async function emptyCart(cartId) {
  await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
  location.reload();
}
