from django.shortcuts import render
from .models import Products

def catalog(request):
    products = Products.objects.all()
    return render(request, 'catalog/catalog.html', {'products': products})