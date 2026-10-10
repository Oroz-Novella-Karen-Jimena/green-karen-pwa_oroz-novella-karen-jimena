import os

base_dir = r"C:\Users\DELL\Desktop\green-karen-pwa_oroz-novella-karen-jimena"

html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Green Karen - PWA</title>
    <link rel="stylesheet" href="css/estilos.css">
    <!-- <link rel="manifest" href="manifest.json"> -->
    <!-- <link rel="icon" href="icons/icon.svg"> -->
    <!-- <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" /> -->
</head>
<body>
    <header>
        <img src="icons/logo.jpg" alt="Logo Green Karen">
        <h1>Green Karen</h1>
        <p class="subtitle">Comida saludable y ensaladas</p>
    </header>
    <main id="catalogo">
        <!-- El JS inyectará el grid aquí -->
    </main>
    <footer>
        <p>📍 Plaza Central, Local 12 &nbsp;|&nbsp; 📱 WhatsApp: 555-012-3456</p>
        <p>&copy; 2026 Green Karen. Todos los derechos reservados.</p>
    </footer>
    <script src="js/csr.js"></script>
    <!-- <script src="js/carrito.js"></script> -->
    <!-- <script src="js/notificaciones.js"></script> -->
    <!-- <script src="js/geolocalizacion.js"></script> -->
    <!-- <script src="js/app.js"></script> -->
    <!--
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
    </script>
    -->
</body>
</html>"""
with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)

css = """@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;600&display=swap');

:root {
    --green: #16A34A;
    --dark-green: #14532D;
    --light-green: #F0FDF4;
    --yellow: #FACC15;
    --dark: #1F2937;
    --bg-color: #FAFAF9;
}

body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background-color: var(--bg-color);
    color: var(--dark);
    position: relative;
    overflow-x: hidden;
}

/* Background blobs */
body::before, body::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    z-index: -1;
    filter: blur(80px);
    opacity: 0.3;
}
body::before { width: 500px; height: 500px; background: var(--green); top: -200px; left: -200px; }
body::after { width: 400px; height: 400px; background: var(--yellow); bottom: -100px; right: -150px; }

header {
    background: linear-gradient(135deg, var(--dark-green) 0%, var(--green) 100%);
    color: white;
    padding: 50px 20px 40px;
    text-align: center;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    box-shadow: 0 15px 30px rgba(22, 163, 74, 0.2);
    position: relative;
    margin-bottom: 40px;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='rgba(255,255,255,0.07)' fill-rule='evenodd'/%3E%3C/svg%3E");
}

header img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin-bottom: 15px;
    border: 6px solid var(--yellow);
    object-fit: cover;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    background: white;
}

header h1 {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    letter-spacing: 1px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

header p { margin-top: 5px; font-weight: 300; font-size: 16px; opacity: 0.9; }

main {
    padding: 0 20px 60px;
    max-width: 1100px;
    margin: 0 auto;
}

/* Category Headers */
.category-header {
    text-align: center;
    margin: 60px 0 30px;
    position: relative;
}
.category-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: var(--dark-green);
    background: white;
    display: inline-block;
    padding: 10px 40px;
    border-radius: 40px;
    box-shadow: 0 8px 20px rgba(22, 163, 74, 0.1);
    margin: 0;
    border: 3px solid var(--light-green);
    position: relative;
    z-index: 1;
}
.category-header .leaf { color: var(--green); }
.category-header::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    z-index: 0;
    opacity: 0.3;
}

/* Grid */
.catalogo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
}
@media (min-width: 650px) { .catalogo-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 950px) { .catalogo-grid { grid-template-columns: repeat(3, 1fr); } }

/* Cards */
.card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(22, 163, 74, 0.05);
    position: relative;
}
.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(22, 163, 74, 0.15);
}

.img-wrapper {
    position: relative;
    height: 240px;
    overflow: hidden;
}
.img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}
.card:hover .img-wrapper img { transform: scale(1.08); }

.badge-price {
    position: absolute;
    bottom: -15px;
    right: 20px;
    background: var(--yellow);
    color: var(--dark-green);
    font-weight: 700;
    font-size: 20px;
    padding: 8px 20px;
    border-radius: 30px;
    box-shadow: 0 4px 15px rgba(250, 204, 21, 0.5);
    z-index: 2;
}

.card-body {
    padding: 35px 25px 25px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    text-align: center;
}

.card-title {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 20px 0;
    color: var(--dark-green);
}

.btn-agregar {
    background-color: var(--green);
    color: white;
    border: none;
    padding: 14px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);
}
.btn-agregar:hover { 
    background-color: var(--dark-green); 
    box-shadow: 0 6px 15px rgba(20, 83, 45, 0.4);
    transform: scale(1.02);
}

footer {
    background: var(--dark-green);
    color: white;
    text-align: center;
    padding: 50px 20px;
    margin-top: 60px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
}
footer p { margin: 8px 0; opacity: 0.9; font-size: 15px; }
"""
with open(os.path.join(base_dir, "css", "estilos.css"), "w", encoding="utf-8") as f:
    f.write(css)

js = """document.addEventListener("DOMContentLoaded", () => {
    fetch("catalogo.json")
        .then(response => response.json())
        .then(data => {
            const catalogo = document.getElementById("catalogo");
            catalogo.innerHTML = '';
            
            // Agrupar por categoría
            const categorias = {};
            data.forEach(prod => {
                if (!categorias[prod.categoria]) categorias[prod.categoria] = [];
                categorias[prod.categoria].push(prod);
            });
            
            for (const [catName, productos] of Object.entries(categorias)) {
                // Título de categoría
                const catHeader = document.createElement("div");
                catHeader.className = "category-header";
                catHeader.innerHTML = `<h2><span class="leaf">🌿</span> ${catName} <span class="leaf">🌿</span></h2>`;
                catalogo.appendChild(catHeader);
                
                // Grid de productos
                const grid = document.createElement("div");
                grid.className = "catalogo-grid";
                
                productos.forEach(producto => {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.innerHTML = `
                        <div class="img-wrapper">
                            <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                            <div class="badge-price">$${producto.precio}</div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${producto.nombre}</h3>
                            <button class="btn-agregar">
                                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
                                Agregar
                            </button>
                        </div>
                    `;
                    grid.appendChild(card);
                });
                
                catalogo.appendChild(grid);
            }
        })
        .catch(error => console.error("Error cargando catálogo:", error));
});"""
with open(os.path.join(base_dir, "js", "csr.js"), "w", encoding="utf-8") as f:
    f.write(js)
