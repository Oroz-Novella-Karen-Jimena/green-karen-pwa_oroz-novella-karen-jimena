// carrito.js — Carrito de compras con almacenamiento en localStorage y sincronización
// Green Karen — Comida saludable y ensaladas

const CLAVE_CARRITO = "green-karen-carrito";

// Lee el carrito guardado en localStorage (si no hay nada, regresa un array vacío)
function leerCarrito() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
}

// Guarda el array del carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Agrega un producto al carrito (o le sube la cantidad si ya estaba)
function agregarAlCarrito(producto) {
    const carrito = leerCarrito();
    const existente = carrito.find((item) => item.id === producto.id);

    if (existente) {
        // Validar que no supere el stock si está definido
        if (producto.stock && existente.cantidad >= producto.stock) {
            mostrarToastFeedback(`¡Has alcanzado el límite de stock de ${producto.nombre}!`, "warning");
            return;
        }
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen || "",
            stock: producto.stock || 99,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    pintarCarrito();
    mostrarToastFeedback(`✓ ${producto.nombre} agregado al carrito`);
}

// Sube o baja la cantidad de un producto ya en el carrito con los botones +/-;
// si la cantidad llega a 0, el producto se quita solo.
function cambiarCantidad(id, delta) {
    const carrito = leerCarrito();
    const item = carrito.find((item) => item.id === id);
    if (!item) return;

    if (delta > 0 && item.stock && item.cantidad >= item.stock) {
        mostrarToastFeedback(`Límite de stock alcanzado (${item.stock} piezas)`, "warning");
        return;
    }

    item.cantidad += delta;
    const actualizado = item.cantidad <= 0 ? carrito.filter((item) => item.id !== id) : carrito;

    guardarCarrito(actualizado);
    pintarCarrito();
}

// Quita un producto del carrito sin importar su cantidad
function quitarDelCarrito(id) {
    const carrito = leerCarrito().filter((item) => item.id !== id);
    guardarCarrito(carrito);
    pintarCarrito();
    mostrarToastFeedback("Producto eliminado del carrito");
}

// Vacía todo el carrito
function vaciarCarrito() {
    guardarCarrito([]);
    pintarCarrito();
}

// Dibuja el carrito en pantalla a partir de lo que hay en localStorage
function pintarCarrito() {
    const carrito = leerCarrito();
    const lista = document.getElementById("carrito-lista");
    const total = document.getElementById("carrito-total");
    const vacioMsg = document.getElementById("carrito-vacio-msg");
    const divider = document.querySelector(".carrito-divider");
    const footerRow = document.querySelector(".carrito-footer-row");

    if (!lista || !total) return;

    lista.innerHTML = "";
    let suma = 0;

    if (carrito.length === 0) {
        if (vacioMsg) vacioMsg.style.display = "flex";
        if (divider) divider.style.display = "none";
        total.textContent = "0";
        return;
    }

    if (vacioMsg) vacioMsg.style.display = "none";
    if (divider) divider.style.display = "block";

    carrito.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        suma += subtotal;

        const li = document.createElement("li");
        li.className = "carrito-item";
        li.innerHTML = `
            <div class="carrito-item-info">
                ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}" class="carrito-thumb">` : ''}
                <div class="carrito-item-detalles">
                    <span class="carrito-nombre">${item.nombre}</span>
                    <span class="carrito-unitario">$${item.precio} c/u</span>
                </div>
            </div>
            <div class="carrito-controles">
                <div class="carrito-cantidad">
                    <button type="button" class="btn-qty" data-accion="restar" data-id="${item.id}" aria-label="Quitar una unidad de ${item.nombre}">−</button>
                    <span class="carrito-cantidad__valor">${item.cantidad}</span>
                    <button type="button" class="btn-qty" data-accion="sumar" data-id="${item.id}" aria-label="Agregar una unidad de ${item.nombre}">+</button>
                </div>
                <span class="carrito-subtotal">$${subtotal}</span>
                <button type="button" class="carrito-quitar" data-accion="quitar" data-id="${item.id}" title="Eliminar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
        `;
        lista.appendChild(li);
    });

    total.textContent = suma;
    if (window.lucide) { lucide.createIcons(); }
}

// Delegación de eventos para los botones del carrito (+, -, quitar)
function manejarClicCarrito(evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
    if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
    if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
}

// Sincronizar: simula el patrón offline -> online
function sincronizarCarrito() {
    const mensaje = document.getElementById("carrito-mensaje");
    if (!mensaje) return;

    mensaje.className = "mensaje visible";

    if (!navigator.onLine) {
        mensaje.textContent = "Sin conexión: el carrito se sincronizará cuando vuelva el internet.";
        mensaje.style.color = "#dc2626";
        return;
    }

    // Animación de sincronización
    mensaje.textContent = "Sincronizando con el servidor...";
    mensaje.style.color = "#16a34a";

    setTimeout(() => {
        mensaje.textContent = "✓ Carrito sincronizado con el servidor (simulado).";
        mensaje.style.color = "#16a34a";
        setTimeout(() => {
            mensaje.classList.remove("visible");
        }, 4000);
    }, 600);
}

// Notificación flotante (toast feedback) para animar la experiencia
function mostrarToastFeedback(texto, tipo = "success") {
    let toast = document.getElementById("toast-feedback");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-feedback";
        document.body.appendChild(toast);
    }
    toast.className = `toast-feedback ${tipo} show`;
    toast.textContent = texto;

    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Exponer agregarAlCarrito de forma global para que csr.js lo use
window.agregarAlCarrito = agregarAlCarrito;
window.leerCarrito = leerCarrito;

document.addEventListener("DOMContentLoaded", () => {
    pintarCarrito();

    const lista = document.getElementById("carrito-lista");
    if (lista) lista.addEventListener("click", manejarClicCarrito);

    const btnSync = document.getElementById("btn-sincronizar");
    if (btnSync) btnSync.addEventListener("click", sincronizarCarrito);

    window.addEventListener("online", sincronizarCarrito);
    window.addEventListener("offline", () => {
        const mensaje = document.getElementById("carrito-mensaje");
        if (mensaje) {
            mensaje.className = "mensaje visible";
            mensaje.textContent = "Se perdió la conexión a internet.";
            mensaje.style.color = "#dc2626";
        }
    });
});
