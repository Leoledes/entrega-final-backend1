const socket = io();

// ===================== RENDER DINÁMICO DE CARRITOS =====================
const cartsList = document.getElementById("cartsList");

function renderCarts(carts) {
    cartsList.innerHTML = "";

    if (!carts || carts.length === 0) {
        cartsList.innerHTML = "<p class='no-products'>No hay carritos disponibles.</p>";
        return;
    }

    carts.forEach(cart => {
        const div = document.createElement("div");
        div.className = "product-card cart-card";
        div.dataset.id = cart.id;

        let productsHTML = "<p>No hay productos en este carrito.</p>";
        if (cart.products.length > 0) {
            productsHTML = "<ul>" + cart.products.map(p => `
                <li>${p.name} (ID: ${p.id}) - Cantidad: ${p.quantity}</li>
            `).join("") + "</ul>";
        }

        div.innerHTML = `
            <h3>Carrito ID: ${cart.id}</h3>
            ${productsHTML}

            <!-- FORMULARIO AGREGAR PRODUCTO -->
            <form class="add-product-form">
                <label>ID del Producto:</label>
                <input type="text" name="productId" required>
                <label>Cantidad:</label>
                <input type="number" name="quantity" value="1" min="1">
                <button type="submit">Agregar Producto</button>
            </form>

            <div class="actions-container">
                <button class="btn-empty-cart" data-cart-id="${cart.id}">Vaciar Carrito</button>
                <button class="btn-delete-cart" data-cart-id="${cart.id}">Eliminar Carrito 🗑️</button>
            </div>
        `;

        cartsList.appendChild(div);
    });
}

// ===================== SOCKET.IO =====================
socket.on("cartsUpdated", carts => {
    console.log("📦 Carritos actualizados:", carts);
    renderCarts(carts);
});

socket.on("error", data => {
    alert(data.message || "Ocurrió un error en tiempo real.");
});

// ===================== CREAR NUEVO CARRITO =====================
document.getElementById("createCartBtn").addEventListener("click", () => {
    socket.emit("newCart");
});

// ===================== DELEGACIÓN DE EVENTOS PARA BOTONES Y FORMULARIOS =====================
cartsList.addEventListener("click", e => {
    const target = e.target;
    const cartId = target.dataset.cartId;

    if (!cartId) return;

    if (target.classList.contains("btn-empty-cart")) {
        socket.emit("emptyCart", cartId);
    }

    if (target.classList.contains("btn-delete-cart")) {
        socket.emit("deleteCart", cartId);
    }
});

cartsList.addEventListener("submit", e => {
    if (!e.target.classList.contains("add-product-form")) return;
    e.preventDefault();

    const form = e.target;
    const cartId = form.closest(".cart-card").dataset.id;
    const productId = form.querySelector("input[name='productId']").value;
    const quantity = parseInt(form.querySelector("input[name='quantity']").value) || 1;

    if (!cartId || !productId) return alert("Faltan datos");

    socket.emit("addProductToCart", { cartId, productId, quantity });

    form.querySelector("input[name='productId']").value = "";
    form.querySelector("input[name='quantity']").value = 1;
});
