// geolocalizacion.js — Acceso al GPS y mapa interactivo con Leaflet
// Green Karen — Comida saludable y ensaladas

// Coordenadas de la sucursal de Green Karen (Plaza Central, Local 12)
const SUCURSAL = {
    nombre: "Green Karen — Plaza Central",
    direccion: "Plaza Central, Local 12 · Hermosillo, Sonora",
    lat: 29.0833,
    lon: -110.9667
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
        "?overview=full&geometry=geojson";

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

let mapa;

// Dibuja el mapa con Leaflet y traza los puntos y la línea de ruta
function dibujarMapa(origenLat, origenLon, coordsRuta) {
    const contenedor = document.getElementById("mapa-ruta");
    if (!contenedor) return;
    contenedor.hidden = false;

    if (!mapa) {
        mapa = L.map(contenedor);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; Colaboradores de OpenStreetMap",
            maxZoom: 19
        }).addTo(mapa);
    } else {
        mapa.eachLayer((capa) => {
            if (capa instanceof L.Marker || capa instanceof L.Polyline) mapa.removeLayer(capa);
        });
    }

    const puntoUsuario = [origenLat, origenLon];
    const puntoSucursal = [SUCURSAL.lat, SUCURSAL.lon];

    L.marker(puntoUsuario).addTo(mapa).bindPopup("<strong>Tu ubicación actual</strong>").openPopup();
    L.marker(puntoSucursal).addTo(mapa).bindPopup(`<strong>${SUCURSAL.nombre}</strong><br><small>${SUCURSAL.direccion}</small>`);

    const hayRuta = Array.isArray(coordsRuta) && coordsRuta.length > 0;
    const linea = hayRuta ? coordsRuta : [puntoUsuario, puntoSucursal];
    const estiloLinea = hayRuta
        ? { color: "#16A34A", weight: 5 }
        : { color: "#FACC15", weight: 4, dashArray: "6 6" };

    L.polyline(linea, estiloLinea).addTo(mapa);
    mapa.fitBounds(L.latLngBounds([puntoUsuario, puntoSucursal]), { padding: [35, 35] });

    setTimeout(() => mapa.invalidateSize(), 150);
}

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-ubicacion");
    const mensaje = document.getElementById("ubicacion-mensaje");
    if (!boton || !mensaje) return;

    boton.addEventListener("click", () => {
        if (!("geolocation" in navigator)) {
            mensaje.textContent = "Este dispositivo o navegador no soporta geolocalización.";
            mensaje.className = "mensaje visible error";
            return;
        }

        mensaje.textContent = "Obteniendo tu ubicación actual...";
        mensaje.className = "mensaje visible info";

        navigator.geolocation.getCurrentPosition(
            async (posicion) => {
                const { latitude, longitude } = posicion.coords;
                const mapaUrl = `https://www.openstreetmap.org/directions?from=${latitude}%2C${longitude}&to=${SUCURSAL.lat}%2C${SUCURSAL.lon}`;

                mensaje.textContent = "Calculando la ruta más rápida a Green Karen...";
                mensaje.className = "mensaje visible info";

                const ruta = await obtenerRuta(latitude, longitude);
                dibujarMapa(latitude, longitude, ruta ? ruta.coords : null);

                if (ruta) {
                    mensaje.innerHTML =
                        `Ruta a ${SUCURSAL.nombre}: <strong>${ruta.distanciaKm.toFixed(1)} km</strong> · ` +
                        `~<strong>${Math.round(ruta.duracionMin)} min</strong> en auto. ` +
                        `<a href="${mapaUrl}" target="_blank" rel="noopener" class="link-mapa">Abrir mapa exterior ↗</a>`;
                    mensaje.className = "mensaje visible exito";
                } else {
                    const distanciaKm = calcularDistanciaKm(latitude, longitude, SUCURSAL.lat, SUCURSAL.lon);
                    mensaje.innerHTML =
                        `Distancia en línea recta: <strong>${distanciaKm.toFixed(1)} km</strong> hasta ${SUCURSAL.nombre}. ` +
                        `<a href="${mapaUrl}" target="_blank" rel="noopener" class="link-mapa">Ver en OpenStreetMap ↗</a>`;
                    mensaje.className = "mensaje visible aviso";
                }
            },
            (error) => {
                mensaje.textContent = "No se pudo obtener tu ubicación: " + error.message;
                mensaje.className = "mensaje visible error";
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
});
