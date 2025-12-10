from django.shortcuts import render

def main_page(request):
    return render(request, 'main_page/main_page.html')


def contacts(request):
    return render(request, 'main_page/contacts.html')