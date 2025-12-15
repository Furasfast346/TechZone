/**
 * TechZone - Base JavaScript
 * Корзина, уведомления, общий функционал
 */

// ==================== КОРЗИНА ====================

let cart = [];

// Загрузка корзины из localStorage
function loadCart() {
    const savedCart = localStorage.getItem('techzone_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('techzone_cart', JSON.stringify(cart));
}

// Получить корзину
function getCart() {
    return cart;
}

// Добавить в корзину
function addToCart(id, name, price, image = null) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showNotification(`${name} добавлен в корзину`);
}

// Удалить из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// Изменить количество товара
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Установить количество товара
function setCartItemQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartUI();
        }
    }
}

// Очистить корзину
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// Получить общее количество товаров
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Получить общую сумму
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Обновить UI корзины
function updateCartUI() {
    const cartCount = getCartCount();
    const cartTotal = getCartTotal();

    // Обновить счётчик
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartItemsList) return;

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItemsList.classList.add('hidden');
        cartFooter.classList.add('hidden');
    } else {
        emptyCart.classList.add('hidden');
        cartItemsList.classList.remove('hidden');
        cartFooter.classList.remove('hidden');

        cartItemsList.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl slide-animation">
                <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">`
                        : '<i class="fas fa-box text-purple-400 text-xl"></i>'
                    }
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm truncate">${item.name}</h4>
                    <p class="text-purple-600 font-semibold">${formatPrice(item.price)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateCartItemQuantity(${item.id}, -1)" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 1)" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition p-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Обновить итого
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        cartTotalEl.textContent = formatPrice(cartTotal);
    }

    // Вызвать событие обновления корзины (для страницы checkout)
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, total: cartTotal } }));
}

// Открыть/закрыть корзину
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('translate-x-full');
        overlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }
}

function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar && overlay) {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}


// ==================== УВЕДОМЛЕНИЯ ====================

function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const notification = document.createElement('div');
    notification.className = `notification fixed top-24 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2`;
    notification.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}


// ==================== УТИЛИТЫ ====================

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

// Debounce функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Получение CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка корзины
    loadCart();

    // Кнопка корзины
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }

    // Закрытие корзины
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Оверлей корзины
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Мобильный поиск
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchModal = document.getElementById('mobileSearchModal');
    const closeSearchModal = document.getElementById('closeSearchModal');

    if (mobileSearchBtn && mobileSearchModal) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchModal.classList.remove('hidden');
        });
    }

    if (closeSearchModal && mobileSearchModal) {
        closeSearchModal.addEventListener('click', () => {
            mobileSearchModal.classList.add('hidden');
        });
    }

    // Кнопка "Наверх"
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.remove('opacity-0', 'invisible');
                scrollTopBtn.classList.add('opacity-100', 'visible');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'invisible');
                scrollTopBtn.classList.remove('opacity-100', 'visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Закрытие модалок по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            if (mobileSearchModal) {
                mobileSearchModal.classList.add('hidden');
            }
        }
    });
});