from django.shortcuts import render

# Catálogo oficial de Green Karen: Comida saludable y ensaladas
# En SSR, estos productos se insertan en el HTML en el servidor antes de viajar al navegador.
PRODUCTOS = [
    {"id": 1, "nombre": "Poke de salmón", "categoria": "Bowls", "precio": 165, "stock": 10},
    {"id": 2, "nombre": "Pollo teriyaki", "categoria": "Bowls", "precio": 145, "stock": 15},
    {"id": 3, "nombre": "Buddha vegano", "categoria": "Bowls", "precio": 135, "stock": 12},
    {"id": 4, "nombre": "Bowl mexicano", "categoria": "Bowls", "precio": 140, "stock": 20},
    {"id": 5, "nombre": "Açaí bowl", "categoria": "Bowls", "precio": 120, "stock": 18},
    {"id": 6, "nombre": "César con pollo", "categoria": "Ensaladas", "precio": 125, "stock": 25},
    {"id": 7, "nombre": "Ensalada griega", "categoria": "Ensaladas", "precio": 115, "stock": 14},
    {"id": 8, "nombre": "Wrap de pavo", "categoria": "Ensaladas", "precio": 110, "stock": 30},
    {"id": 9, "nombre": "Wrap de falafel", "categoria": "Ensaladas", "precio": 115, "stock": 22},
    {"id": 10, "nombre": "Toast aguacate", "categoria": "Ensaladas", "precio": 95, "stock": 40},
    {"id": 11, "nombre": "Jugo verde", "categoria": "Bebidas", "precio": 55, "stock": 50},
    {"id": 12, "nombre": "Smoothie proteico", "categoria": "Bebidas", "precio": 80, "stock": 35},
    {"id": 13, "nombre": "Agua de pepino", "categoria": "Bebidas", "precio": 35, "stock": 60},
    {"id": 14, "nombre": "Kombucha", "categoria": "Bebidas", "precio": 60, "stock": 25},
    {"id": 15, "nombre": "Té matcha", "categoria": "Bebidas", "precio": 65, "stock": 45},
]

def vista_ssr(request):
    """
    Vista con Renderizado en Servidor (SSR).
    Toma la plantilla 'catalogo/catalogo_ssr.html', le inyecta la lista
    de 15 productos y devuelve el HTML ya con los datos incrustados.
    """
    contexto = {
        "negocio": "Green Karen",
        "giro": "Comida saludable y ensaladas",
        "productos": PRODUCTOS
    }
    return render(request, 'catalogo/catalogo_ssr.html', contexto)
