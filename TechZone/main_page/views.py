from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.db.models import Q
import json

from databases.models import Products, Order, OrderItem, ContactMessage


def home(request):
    """Главная страница"""
    context = {
        # Товары со скидкой (discount > 0)
        'deals': Products.objects.filter(discount__gt=0, quantity__gt=0)[:4],

        # Новинки (последние добавленные)
        'new_arrivals': Products.objects.filter(quantity__gt=0).order_by('-created_at')[:4],

        # Популярные (можно по количеству или добавить поле sales_count)
        'bestsellers': Products.objects.filter(quantity__gt=0).order_by('-quantity')[:4],

        # Категории (если есть отдельная модель)
        # 'categories': Category.objects.all(),
    }
    return render(request, 'home.html', context)


def catalog(request):
    """Каталог товаров"""
    products = Products.objects.all()

    # Фильтр по категории
    category = request.GET.get('category')
    if category:
        products = products.filter(category__iexact=category)

    # Фильтр по типу
    filter_type = request.GET.get('filter')
    if filter_type == 'sale':
        products = products.filter(discount__gt=0)
    elif filter_type == 'new':
        products = products.order_by('-created_at')
    elif filter_type == 'popular':
        products = products.order_by('-quantity')

    # Сортировка
    sort = request.GET.get('sort', 'default')
    if sort == 'price_asc':
        products = products.order_by('price')
    elif sort == 'price_desc':
        products = products.order_by('-price')
    elif sort == 'name':
        products = products.order_by('name')
    elif sort == 'new':
        products = products.order_by('-created_at')

    # Пагинация
    paginator = Paginator(products, 12)
    page = request.GET.get('page')
    products = paginator.get_page(page)

    context = {
        'products': products,
        'category': category,
        'filter': filter_type,
        'sort': sort,
    }
    return render(request, 'catalog.html', context)


def product_detail(request, pk):
    """Страница товара"""
    product = get_object_or_404(Products, pk=pk)

    # Похожие товары (та же категория)
    related_products = Products.objects.filter(
        category=product.category,
        quantity__gt=0
    ).exclude(pk=pk)[:4]

    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'product_detail.html', context)


def search(request):
    """Поиск"""
    query = request.GET.get('q', '').strip()
    products = []

    if query:
        products = Products.objects.filter(
            Q(name__icontains=query) |
            Q(brand__icontains=query) |
            Q(description__icontains=query) |
            Q(category__icontains=query)
        )

    context = {
        'products': products,
        'query': query,
    }
    return render(request, 'search.html', context)


def checkout(request):
    """Оформление заказа"""
    if request.method == 'POST':
        # Получаем данные корзины из формы
        cart_data = request.POST.get('cart_data', '[]')
        try:
            cart = json.loads(cart_data)
        except json.JSONDecodeError:
            cart = []

        if not cart:
            messages.error(request, 'Корзина пуста')
            return redirect('checkout')

        # Рассчитываем сумму
        delivery_price = 0 if request.POST.get('delivery') == 'pickup' else 300
        subtotal = sum(item['price'] * item['quantity'] for item in cart)
        total = subtotal + delivery_price

        # Создаём заказ
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            address=request.POST.get('address', ''),
            delivery=request.POST.get('delivery'),
            payment=request.POST.get('payment'),
            comment=request.POST.get('comment', ''),
            total=total,
        )

        # Добавляем товары в заказ
        for item in cart:
            product = Products.objects.filter(pk=item['id']).first()
            OrderItem.objects.create(
                order=order,
                product=product,
                name=item['name'],
                price=item['price'],
                quantity=item['quantity'],
            )

            # Уменьшаем количество на складе
            if product:
                product.quantity = max(0, product.quantity - item['quantity'])
                product.save()

        messages.success(request, f'Заказ #{order.id} успешно оформлен!')
        return redirect('home')

    return render(request, 'checkout.html')


def contacts(request):
    """Контакты"""
    if request.method == 'POST':
        ContactMessage.objects.create(
            name=request.POST.get('name'),
            email=request.POST.get('email'),
            subject=request.POST.get('subject', 'general'),
            message=request.POST.get('message'),
        )
        messages.success(request, 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
        return redirect('contacts')

    return render(request, 'contacts.html')


# ==================== АВТОРИЗАЦИЯ ====================

def login_view(request):
    """Вход"""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Добро пожаловать, {user.first_name or user.username}!')
            return redirect(request.GET.get('next', 'home'))
    else:
        form = AuthenticationForm()

    return render(request, 'login.html', {'form': form})


def register_view(request):
    """Регистрация"""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.first_name = request.POST.get('first_name', '')
            user.last_name = request.POST.get('last_name', '')
            user.email = request.POST.get('email', '')
            user.save()
            login(request, user)
            messages.success(request, 'Регистрация успешна!')
            return redirect('home')
    else:
        form = UserCreationForm()

    return render(request, 'register.html', {'form': form})


def logout_view(request):
    """Выход"""
    logout(request)
    messages.info(request, 'Вы вышли из аккаунта')
    return redirect('home')


@login_required
def profile(request):
    """Личный кабинет"""
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.save()
        messages.success(request, 'Данные сохранены')
        return redirect('profile')

    orders = Order.objects.filter(user=request.user).order_by('-created_at')

    return render(request, 'profile.html', {'orders': orders})