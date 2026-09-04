from django.contrib import admin
from .models import Category, Product, Sale, Expense

# Esto le dice a Django que muestre estas tablas en el panel visual
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Sale)
admin.site.register(Expense)