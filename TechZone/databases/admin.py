from django.contrib import admin
from .models import Products, Order, ContactMessage, OrderItem

admin.site.register(Products)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ContactMessage)