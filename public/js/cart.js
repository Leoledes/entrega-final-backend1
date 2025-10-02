const socket = io();

async function addToCart(productId) {
  const cartId = window.cartId;
  if (!cartId || !productId) return alert("No hay carrito disponible");

  try {
    await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 })
    });

    alert("Producto agregado al carrito ✅");
    socket.emit("addProductToCart", { cartId, productId, quantity: 1 });
  } catch (err) {
    console.error(err);
    alert("Error al agregar producto");
  }
}

async function removeFromCart(cartId, productId) {
  await fetch(`/api/carts/${cartId}/products/${productId}`, { method: "DELETE" });
  location.reload();
}

async function emptyCart(cartId) {
  await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
  location.reload();
}
