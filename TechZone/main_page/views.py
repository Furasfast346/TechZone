from django.shortcuts import render
from databases.models import Products

def main_page(request):
    products = Products.objects.all()
    hot_deals = Products.objects.all().order_by('-discount')[:4]
    new_arrivals = Products.objects.all().order_by('-created_at')[:4]
    bestsellers = Products.objects.all().order_by('quantity')[:4]
    return render(request, 'main_page/main_page.html', {'products' : products, 'hot_deals' : hot_deals, 'bestsellers' : bestsellers, 'new_arrivals' : new_arrivals})


def contacts(request):
    return render(request, 'main_page/contacts.html')