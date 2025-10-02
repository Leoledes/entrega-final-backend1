const socket = io();

// ===================== FUNCIONES DE CARRITO =====================

async function emptyCart(cartId) {
    if (!cartId) return alert("No se encontró el carrito");
    await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
    alert("Carrito vaciado");
    socket.emit("cartDeleted", cartId);
}

// ===================== ELIMINAR CARRITO =====================
document.querySelectorAll(".btn-delete-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const cartId = e.target.dataset.cartId;
        if (!cartId) return alert("No se encontró el carrito");

        await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
        alert("Carrito eliminado");
        socket.emit("cartDeleted", cartId);
    });
});

// ===================== AGREGAR PRODUCTO =====================
document.querySelectorAll(".add-product-form").forEach(form => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cartId = form.querySelector("input[name='cartId']").value;
        const productId = form.querySelector("input[name='productId']").value;
        const quantity = parseInt(form.querySelector("input[name='quantity']").value) || 1;

        if (!cartId || !productId) return alert("Faltan datos");

        try {
            await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity })
            });

            alert("Producto agregado al carrito");
            socket.emit("productAdded", { cartId, productId, quantity });

            // limpiar campos
            form.querySelector("input[name='productId']").value = "";
            form.querySelector("input[name='quantity']").value = 1;
        } catch (err) {
            console.error(err);
            alert("Error al agregar producto");
        }
    });
});

// ===================== SOCKET.IO =====================
socket.on("cartsUpdated", carts => {
    // Puedes implementar render dinámico o recargar la página
    console.log("Carritos actualizados:", carts);
});
