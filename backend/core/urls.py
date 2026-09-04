from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import ClientViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# 1. Creamos el enrutador automático
router = DefaultRouter()
# 2. Registramos la vista de clientes
router.register(r'clients', ClientViewSet, basename='clients')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Tus rutas de productos, ventas y gastos quedan intactas
    path('api/finance/', include('finance.urls')),
    
    # 3. Agregamos las nuevas rutas de usuarios/clientes generadas por el router
    path('api/users/', include(router.urls)),
    
    # Rutas para el Login (Autenticación JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]