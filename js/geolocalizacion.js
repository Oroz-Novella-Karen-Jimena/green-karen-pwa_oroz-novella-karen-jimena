// geolocalizacion.js — Acceso al GPS y mapa interactivo con Leaflet
// Green Karen — Comida saludable y ensaladas

// Coordenadas de la sucursal de Green Karen (Plaza Central, Local 12)
const SUCURSAL = {
    nombre: "Green Karen — Plaza Central",
    direccion: "Plaza Central, Local 12 · Hermosillo, Sonora",
    lat: 29.0833,
    lon: -110.9667,
    apertura: 8,
    cierre: 21
};

// Fórmula de Haversine: cálculo de distancia en línea recta en km
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const radioTierraKm = 6371;
    const aRadianes = (grados) => (grados * Math.PI) / 180;

    const dLat = aRadianes(lat2 - lat1);
    const dLon = aRadianes(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radioTierraKm * c;
}

// Consulta a OSRM para obtener la ruta real por calles
async function obtenerRuta(origenLat, origenLon) {
    const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        `${origenLon},${origenLat};${SUCURSAL.lon},${SUCURSAL.lat}` +
        "?overview=full&geometries=geojson";

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        if (datos.code !== "Ok") return null;

        const ruta = datos.routes[0];
        return {
            coords: ruta.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
            distanciaKm: ruta.distance / 1000,
            duracionMin: ruta.duration / 60
        };
    } catch (error) {
        console.error("No se pudo calcular la ruta por calles:", error);
        return null;
    }
}

let mapa = null;
let capasRuta = [];

// Íconos personalizados elegantes (sin emojis, usando vectores limpios)
function iconoSucursal() {
    return L.divIcon({
        className: "marcador-gk",
        html:
            '<div class="pin-sucursal">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>' +
            '<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>' +
            '</svg></div>',
        iconSize: [42, 50],
        iconAnchor: [21, 50],
        popupAnchor: [0, -48]
    });
}

function iconoUsuario() {
    return L.divIcon({
        className: "marcador-gk",
        html: '<div class="pin-usuario"><span></span></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
}

// Inicializa el mapa mostrando de inmediato la sucursal
function iniciarMapa() {
    const contenedor = document.getElementById("mapa-ruta");
    if (!contenedor || typeof L === "undefined") return;

    if (mapa) {
        mapa.invalidateSize();
        return;
    }

    mapa = L.map(contenedor, {
        scrollWheelZoom: false,
        zoomControl: true
    }).setView([SUCURSAL.lat, SUCURSAL.lon], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(mapa);

    L.marker([SUCURSAL.lat, SUCURSAL.lon], { icon: iconoSucursal(), title: SUCURSAL.nombre })
        .addTo(mapa)
        .bindPopup(`<strong>${SUCURSAL.nombre}</strong><br><small>${SUCURSAL.direccion}</small>`);

    // Permitir zoom con scroll solo al interactuar
    mapa.on("focus click", () => mapa.scrollWheelZoom.enable());
    mapa.on("blur mouseout", () => mapa.scrollWheelZoom.disable());

    // Refrescar tamaño para asegurar despliegue perfecto
    setTimeout(() => mapa.invalidateSize(), 100);
    setTimeout(() => mapa.invalidateSize(), 500);
    window.addEventListener("resize", () => {
        if (mapa) mapa.invalidateSize();
    });
}

// Dibuja la ubicación del usuario y la ruta hacia la sucursal
function dibujarRuta(origenLat, origenLon, coordsRuta) {
    if (!mapa) return;

    capasRuta.forEach((capa) => mapa.removeLayer(capa));
    capasRuta = [];

    const puntoUsuario = [origenLat, origenLon];
    const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];

    const marcadorUsuario = L.marker(puntoUsuario, { icon: iconoUsuario() })
        .addTo(mapa)
        .bindPopup("<strong>Tu ubicación actual</strong>");
    capasRuta.push(marcadorUsuario);

    const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
    const linea = hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal];

    // Contorno exterior blanco + línea verde brillante principal
    capasRuta.push(L.polyline(linea, { color: "#FFFFFF", weight: 9, opacity: 0.95 }).addTo(mapa));
    capasRuta.push(
        L.polyline(
            linea,
            hayRuta
                ? { color: "#16A34A", weight: 5, className: "ruta-animada" }
                : { color: "#EAB308", weight: 4, dashArray: "8 8" }
        ).addTo(mapa)
    );

    mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [45, 45] });
    setTimeout(() => mapa.invalidateSize(), 150);
}

// Muestra si la sucursal está abierta según la hora actual
function mostrarEstadoSucursal() {
    const etiqueta = document.getElementById("estado-sucursal");
    if (!etiqueta) return;

    const hora = new Date().getHours();
    const abierto = hora >= SUCURSAL.apertura && hora < SUCURSAL.cierre;
    etiqueta.textContent = abierto ? "Abierto ahora · Cierra 9:00 PM" : "Cerrado ahora · Abre 8:00 AM";
    etiqueta.classList.toggle("abierto", abierto);
    etiqueta.classList.toggle("cerrado", !abierto);
}

function formatearTiempo(minutos) {
    if (minutos < 60) return `${Math.max(1, Math.round(minutos))} min`;
    const horas = Math.floor(minutos / 60);
    const resto = Math.round(minutos % 60);
    return `${horas} h ${resto} min`;
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarEstadoSucursal();
    iniciarMapa();

    const boton = document.getElementById("btn-ubicacion");
    const mensaje = document.getElementById("ubicacion-mensaje");
    const statDistancia = document.getElementById("stat-distancia");
    const statTiempo = document.getElementById("stat-tiempo");
    const enlaceExterno = document.getElementById("link-mapa-externo");
    if (!boton || !mensaje) return;

    boton.addEventListener("click", () => {
        if (!("geolocation" in navigator)) {
            mensaje.textContent = "Este dispositivo o navegador no soporta geolocalización.";
            mensaje.className = "mensaje visible error";
            return;
        }

        mensaje.textContent = "Obteniendo tu ubicación actual...";
        mensaje.className = "mensaje visible info";
        boton.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async (posicion) => {
                const { latitude, longitude } = posicion.coords;
                const mapaUrl = `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

                mensaje.textContent = "Calculando la ruta más rápida a Green Karen...";
                mensaje.className = "mensaje visible info";

                const ruta = await obtenerRuta(latitude, longitude);
                dibujarRuta(latitude, longitude, ruta ? ruta.coords : null);

                if (enlaceExterno) {
                    enlaceExterno.href = mapaUrl;
                }

                if (ruta) {
                    statDistancia.textContent = `${ruta.distanciaKm.toFixed(1)} km`;
                    statTiempo.textContent = formatearTiempo(ruta.duracionMin);
                    mensaje.textContent = "Ruta trazada hacia Green Karen.";
                    mensaje.className = "mensaje visible exito";
                } else {
                    const distanciaKm = calcularDistanciaKm(latitude, longitude, SUCURSAL.lat, SUCURSAL.lon);
                    statDistancia.textContent = `${distanciaKm.toFixed(1)} km`;
                    statTiempo.textContent = "--";
                    mensaje.textContent = "Distancia en línea recta calculada.";
                    mensaje.className = "mensaje visible aviso";
                }

                boton.disabled = false;
            },
            (error) => {
                mensaje.textContent = "No se pudo obtener tu ubicación: " + error.message;
                mensaje.className = "mensaje visible error";
                boton.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
});
