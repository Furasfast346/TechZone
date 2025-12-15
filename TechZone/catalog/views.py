from django.shortcuts import render
from databases.models import Products

def catalog(request):
    products = Products.objects.all()
    return render(request, 'catalog/catalog.html', {'products': products})

def mobile(request):
    products = Products.objects.filter(category='Смартфоны')
    return render(request, 'catalog/catalog.html', {'products': products})

def notebook(request):
    products = Products.objects.filter(category='Ноутбуки')
    return render(request, 'catalog/catalog.html', {'products': products})

def TV(request):
    products = Products.objects.filter(category='Телевизоры')
    return render(request, 'catalog/catalog.html', {'products': products})

def games(request):
    products = Products.objects.filter(category='Игры')
    return render(request, 'catalog/catalog.html', {'products': products})

def headphones(request):
    products = Products.objects.filter(category='Наушники')
    return render(request, 'catalog/catalog.html', {'products': products})

def photography(request):
    products = Products.objects.filter(category='Фото')
    return render(request, 'catalog/catalog.html', {'products': products})

def apple(request):
    products = Products.objects.filter(brand='Apple')
    return render(request, 'catalog/catalog.html', {'products': products})

def samsung(request):
    products = Products.objects.filter(brand='Samsung')
    return render(request, 'catalog/catalog.html', {'products': products})

def sony(request):
    products = Products.objects.filter(brand='Sony')
    return render(request, 'catalog/catalog.html', {'products': products})

def xiaomi(request):
    products = Products.objects.filter(brand='Xiaomi')
    return render(request, 'catalog/catalog.html', {'products': products})

def asus(request):
    products = Products.objects.filter(brand='Asus')
    return render(request, 'catalog/catalog.html', {'products': products})

def lg(request):
    products = Products.objects.filter(brand='LG')
    return render(request, 'catalog/catalog.html', {'products': products})
