from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, SaleViewSet, ExpenseViewSet, export_sales_csv, export_expenses_csv

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'expenses', ExpenseViewSet)

urlpatterns = [
    # Las rutas de exportación SIEMPRE deben ir antes del include(router.urls)
    path('export/sales/', export_sales_csv, name='export_sales_csv'),
    path('export/expenses/', export_expenses_csv, name='export_expenses_csv'),
    
    path('', include(router.urls)),
]