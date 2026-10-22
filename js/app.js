// app.js — Estado de conexión (online / offline)
// Green Karen — Comida saludable y ensaladas

function actualizarPildoraConexion() {
    const pildora = document.getElementById("estado-conexion");
    if (!pildora) return;

    if (navigator.onLine) {
        pildora.innerHTML = '<i data-lucide="wifi" class="icon-status"></i> Conectado';
        pildora.className = "pill-conexion conectado";
    } else {
        pildora.innerHTML = '<i data-lucide="wifi-off" class="icon-status"></i> Sin conexión';
        pildora.className = "pill-conexion sin-conexion";
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

document.addEventListener("DOMContentLoaded", actualizarPildoraConexion);
window.addEventListener("online", actualizarPildoraConexion);
window.addEventListener("offline", actualizarPildoraConexion);
