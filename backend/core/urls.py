from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

# CORRECCIÓN: Importamos todo desde 'users.views'
from users.views import ClientViewSet, upload_avatar, export_clients_csv

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='clients')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas de finanzas
    path('api/finance/', include('finance.urls')),
    
    # Rutas manuales de usuarios (Deben ir antes del router)
    path('api/users/upload-avatar/', upload_avatar, name='upload_avatar'),
    path('api/users/export/clients/', export_clients_csv, name='export_clients_csv'),
    
    # Rutas automáticas de clientes generadas por el router
    path('api/users/', include(router.urls)),
    
    # Rutas para el Login (Autenticación JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)