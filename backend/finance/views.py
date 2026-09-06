import csv
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


from rest_framework import viewsets
from .models import Category, Product, Sale, Expense
from .serializers import CategorySerializer, ProductSerializer, SaleSerializer, ExpenseSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_sales_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="ventas.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Producto', 'Cantidad', 'Total Cobrado', 'Fecha', 'Metodo de Pago', 'Vendedor'])
    
    sales = Sale.objects.all().order_by('-date')
    
    for sale in sales:
        vendedor = sale.seller.username if sale.seller else 'Desconocido'
        producto = sale.product.name if sale.product else 'Producto Eliminado'
        writer.writerow([
            producto, 
            sale.quantity, 
            sale.total_price, 
            sale.date.strftime("%d/%m/%Y %H:%M"), 
            sale.payment_method, 
            vendedor
        ])
        
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_expenses_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="gastos.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Descripción', 'Monto', 'Fecha'])
    
    expenses = Expense.objects.all().order_by('-date')
    
    for exp in expenses:
        writer.writerow([
            exp.description, 
            exp.amount, 
            exp.date.strftime("%d/%m/%Y")
        ])
        
    return response