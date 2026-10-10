import os

base_dir = r"C:\Users\DELL\Desktop\green-karen-pwa_oroz-novella-karen-jimena"

# 1. Update index.html
with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace(
    '<link rel="stylesheet" href="css/estilos.css">',
    '<link rel="stylesheet" href="css/estilos.css">\n    <script src="https://unpkg.com/lucide@latest"></script>'
)
html = html.replace(
    '<p>📍 Plaza Central, Local 12 &nbsp;|&nbsp; 📱 WhatsApp: 555-012-3456</p>',
    '<p><i data-lucide="map-pin" class="icon-footer"></i> Plaza Central, Local 12 &nbsp;|&nbsp; <i data-lucide="smartphone" class="icon-footer"></i> WhatsApp: 555-012-3456</p>'
)
html = html.replace(
    '<script src="js/csr.js"></script>',
    '<script src="js/csr.js"></script>\n    <script>lucide.createIcons();</script>'
)
with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)

# 2. Update csr.js
with open(os.path.join(base_dir, "js", "csr.js"), "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace(
    '<h2><span class="leaf">🌿</span> ${catName} <span class="leaf">🌿</span></h2>',
    '<h2><i data-lucide="leaf" class="icon-leaf"></i> ${catName} <i data-lucide="leaf" class="icon-leaf"></i></h2>'
)
js = js.replace(
    'catalogo.appendChild(grid);\n            }',
    'catalogo.appendChild(grid);\n            }\n            if (window.lucide) { lucide.createIcons(); }'
)
with open(os.path.join(base_dir, "js", "csr.js"), "w", encoding="utf-8") as f:
    f.write(js)

# 3. Update estilos.css
with open(os.path.join(base_dir, "css", "estilos.css"), "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace(
    '.category-header .leaf { color: var(--green); }',
    '.icon-leaf { width: 28px; height: 28px; vertical-align: -5px; color: var(--green); margin: 0 4px; }\n.icon-footer { width: 18px; height: 18px; vertical-align: text-bottom; color: var(--yellow); margin-right: 5px; }'
)
with open(os.path.join(base_dir, "css", "estilos.css"), "w", encoding="utf-8") as f:
    f.write(css)

print("Icons updated successfully!")
