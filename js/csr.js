// csr.js — Renderizado en el Cliente (CSR) con filtros y stock
// Green Karen — Comida saludable y ensaladas

document.addEventListener("DOMContentLoaded", () => {
    let catalogoData = [];

    fetch("catalogo.json")
        .then(response => response.json())
        .then(data => {
            catalogoData = data;
            inicializarCatalogo(data);
        })
        .catch(error => {
            const catalogo = document.getElementById("catalogo");
            if (catalogo) {
                catalogo.innerHTML = `<p class="error-msg">No se pudo cargar el catálogo. Inténtalo más tarde.</p>`;
            }
            console.error("Error cargando catálogo:", error);
        });

    function inicializarCatalogo(productos) {
        const catalogo = document.getElementById("catalogo");
        if (!catalogo) return;

        // Renderizar barra de filtros interactiva
        const filtrosContainer = document.getElementById("filtros-container");
        if (filtrosContainer) {
            filtrosContainer.innerHTML = `
                <div class="filtros-wrapper">
                    <button class="btn-filtro active" data-categoria="todas">
                        <i data-lucide="utensils" class="icon-btn"></i> Todos
                    </button>
                    <button class="btn-filtro" data-categoria="Bowls">
                        <i data-lucide="soup" class="icon-btn"></i> Bowls
                    </button>
                    <button class="btn-filtro" data-categoria="Ensaladas">
                        <i data-lucide="salad" class="icon-btn"></i> Ensaladas
                    </button>
                    <button class="btn-filtro" data-categoria="Bebidas">
                        <i data-lucide="cup-soda" class="icon-btn"></i> Bebidas
                    </button>
                </div>
            `;

            // Event listener para los botones de filtro
            filtrosContainer.querySelectorAll(".btn-filtro").forEach(btn => {
                btn.addEventListener("click", () => {
                    filtrosContainer.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    const catSeleccionada = btn.dataset.categoria;
                    renderizarProductos(catSeleccionada === "todas" ? catalogoData : catalogoData.filter(p => p.categoria === catSeleccionada));
                });
            });
        }

        renderizarProductos(productos);
    }

    function renderizarProductos(productos) {
        const catalogo = document.getElementById("catalogo");
        if (!catalogo) return;

        catalogo.innerHTML = '';

        // Agrupar por categoría
        const categorias = {};
        productos.forEach(prod => {
            if (!categorias[prod.categoria]) categorias[prod.categoria] = [];
            categorias[prod.categoria].push(prod);
        });

        for (const [catName, prods] of Object.entries(categorias)) {
            // Título de categoría decorado
            const catHeader = document.createElement("div");
            catHeader.className = "category-header";
            catHeader.innerHTML = `
                <h2>
                    <i data-lucide="leaf" class="icon-leaf"></i>
                    ${catName}
                    <i data-lucide="leaf" class="icon-leaf"></i>
                </h2>
            `;
            catalogo.appendChild(catHeader);

            // Grid de productos
            const grid = document.createElement("div");
            grid.className = "catalogo-grid";

            prods.forEach(producto => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="img-wrapper">
                        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                        <div class="badge-price">$${producto.precio}</div>
                    </div>
                    <!-- Stock debajo de la foto -->
                    <div class="stock-bar">
                        <span class="stock-pill">
                            <i data-lucide="package" class="icon-stock"></i>
                            Stock: <strong>${producto.stock}</strong> piezas
                        </span>
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${producto.nombre}</h3>
                        <button class="btn-agregar" type="button" data-id="${producto.id}">
                            <i data-lucide="plus-circle" class="icon-btn"></i>
                            Agregar al carrito
                        </button>
                    </div>
                `;

                // Event listener para agregar al carrito
                const btnAgregar = card.querySelector(".btn-agregar");
                btnAgregar.addEventListener("click", () => {
                    if (window.agregarAlCarrito) {
                        window.agregarAlCarrito(producto);
                    }
                });

                grid.appendChild(card);
            });

            catalogo.appendChild(grid);
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }
});