from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=200) # Ej: "Mchose v9 PRO" o "KZ ZSN Pro X"
    description = models.TextField(blank=True, null=True)
    
    # Precios y stock
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Costo al que lo compran")
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio de venta al público")
    stock = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - Stock: {self.stock}"

class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='sales')
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True) 
    
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total cobrado en esta venta")
    date = models.DateTimeField(default=timezone.now)
    payment_method = models.CharField(max_length=50, default="Efectivo/Transferencia")
    
    def save(self, *args, **kwargs):
        # Magia de Django: Si es una venta nueva, descuenta el stock
        if not self.pk: 
            self.product.stock -= self.quantity
            self.product.save()
        super().save(*args, **kwargs)

    # --- AGREGÁ ESTE BLOQUE NUEVO ---
    def delete(self, *args, **kwargs):
        # Magia de Django 2: Al borrar la venta, devolvemos el stock al producto
        self.product.stock += self.quantity
        self.product.save()
        super().delete(*args, **kwargs)
    # -------------------------------

    def __str__(self):
        return f"Venta: {self.quantity}x {self.product.name} - {self.date.strftime('%d/%m/%Y')}"
class Expense(models.Model):
    description = models.CharField(max_length=200) # Ej: "Publicidad en Instagram", "Envío Andreani"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"Gasto: {self.description} - ${self.amount}"