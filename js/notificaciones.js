// notificaciones.js — Notification API para ofertas y pedidos
// Green Karen — Comida saludable y ensaladas

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-notificar");
    const mensaje = document.getElementById("notificaciones-mensaje");
    if (!boton || !mensaje) return;

    // Si el usuario ya había otorgado permiso previamente
    if ("Notification" in window && Notification.permission === "granted") {
        boton.innerHTML = '<i data-lucide="check" class="icon-btn"></i> Notificaciones activadas';
        boton.classList.add("btn-activa");
        mensaje.textContent = "✓ Las notificaciones están activadas.";
        mensaje.className = "mensaje visible exito";
    }

    boton.addEventListener("click", () => {
        if (!("Notification" in window)) {
            mensaje.textContent = "Este navegador no soporta notificaciones.";
            mensaje.className = "mensaje visible error";
            return;
        }

        Notification.requestPermission().then((permiso) => {
            mensaje.className = "mensaje visible";
            if (permiso === "granted") {
                // Notificación visual útil de bienvenida / promociones
                new Notification("Green Karen 🌱", {
                    body: "¡Bienvenida/o! Te avisaremos de nuestras promociones saludables y el estado de tu pedido.",
                    icon: "icons/logo.jpg",
                });
                mensaje.textContent = "✓ Notificaciones activadas. Recibirás avisos de ofertas y pedidos.";
                mensaje.className = "mensaje visible exito";
                boton.innerHTML = '<i data-lucide="check" class="icon-btn"></i> Notificaciones activadas';
                boton.classList.add("btn-activa");
            } else if (permiso === "denied") {
                mensaje.textContent = "Permiso denegado. Puedes activarlo desde la configuración del navegador.";
                mensaje.className = "mensaje visible error";
            } else {
                mensaje.textContent = "Permiso no confirmado.";
                mensaje.className = "mensaje visible aviso";
            }

            if (window.lucide) {
                lucide.createIcons();
            }
        });
    });
});
