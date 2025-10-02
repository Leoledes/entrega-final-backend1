document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  window.addToCart = async (cartId, productId) => {
    if (!cartId || !productId) return alert("Faltan datos para agregar al carrito");

    try {
      await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }) // cantidad por defecto
      });

      alert("Producto agregado al carrito ✅");
      socket.emit("addProductToCart", { cartId, productId, quantity: 1 });
    } catch (err) {
      console.error(err);
      alert("Error al agregar producto");
    }
  };
});