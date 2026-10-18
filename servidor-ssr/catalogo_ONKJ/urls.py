from django.urls import path
from . import views

urlpatterns = [
    # Rutas para ver el catálogo SSR
    path('catalogo/', views.vista_ssr, name='catalogo_ssr'),
    path('catalogo_ONKJ/', views.vista_ssr, name='catalogo_ssr_onkj'),
    path('', views.vista_ssr, name='catalogo_root'),
]
