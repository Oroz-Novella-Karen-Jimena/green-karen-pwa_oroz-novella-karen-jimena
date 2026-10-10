document.addEventListener("DOMContentLoaded", () => {
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
                catHeader.innerHTML = `<h2><i data-lucide="leaf" class="icon-leaf"></i> ${catName} <i data-lucide="leaf" class="icon-leaf"></i></h2>`;
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
            if (window.lucide) { lucide.createIcons(); }
        })
        .catch(error => console.error("Error cargando catálogo:", error));
});