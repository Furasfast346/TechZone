// Products data
const products = {
    deals: [
        { id: 1, name: 'MacBook Air M2', price: 89990, oldPrice: 119990, image: 'fa-laptop', rating: 4.9, reviews: 234, badge: '-25%' },
        { id: 2, name: 'AirPods Pro 2', price: 18990, oldPrice: 24990, image: 'fa-headphones', rating: 4.8, reviews: 567, badge: '-24%' },
        { id: 3, name: 'PlayStation 5', price: 44990, oldPrice: 59990, image: 'fa-gamepad', rating: 4.9, reviews: 892, badge: '-25%' },
        { id: 4, name: 'Samsung QLED 55"', price: 54990, oldPrice: 79990, image: 'fa-tv', rating: 4.7, reviews: 156, badge: '-31%' },
    ],
    newArrivals: [
        { id: 5, name: 'iPhone 15 Pro', price: 129990, image: 'fa-mobile-alt', rating: 5.0, reviews: 89, badge: 'Новинка' },
        { id: 6, name: 'Galaxy Watch 6', price: 29990, image: 'fa-clock', rating: 4.6, reviews: 45, badge: 'Новинка' },
        { id: 7, name: 'DJI Mini 4 Pro', price: 89990, image: 'fa-plane', rating: 4.9, reviews: 23, badge: 'Новинка' },
        { id: 8, name: 'Sony WH-1000XM5', price: 34990, image: 'fa-headphones-alt', rating: 4.8, reviews: 312, badge: 'Новинка' },
    ],
    bestsellers: [
        { id: 9, name: 'iPhone 14', price: 79990, image: 'fa-mobile-alt', rating: 4.9, reviews: 1234, badge: 'Хит' },
        { id: 10, name: 'Samsung S24 Ultra', price: 109990, image: 'fa-mobile-alt', rating: 4.8, reviews: 567, badge: 'Хит' },
        { id: 11, name: 'iPad Pro 12.9"', price: 99990, image: 'fa-tablet-alt', rating: 4.9, reviews: 445, badge: 'Хит' },
        { id: 12, name: 'Apple Watch Ultra 2', price: 79990, image: 'fa-clock', rating: 4.7, reviews: 234, badge: 'Хит' },
    ]
};
// Cart state
let cart = [];
// Render product card
function renderProduct(product, showOldPrice = false) {
    const badgeClass = product.badge.includes('%') ? 'discount' :
                      product.badge === 'Новинка' ? 'new' : 'hit';

    return `
        <div class="product-card card-hover group">
            <div class="product-image-container">
                <span class="product-badge ${badgeClass}">
                    ${product.badge}
                </span>
                <button onclick="toggleFavorite(${product.id})" class="favorite-btn">
                    <i class="far fa-heart"></i>
                </button>
                <div class="h-32 flex items-center justify-center">
                    <i class="fas ${product.image} product-icon"></i>
                </div>
            </div>
            <div class="p-4">
                <div class="flex items-center gap-1 mb-2">
                    <i class="fas fa-star text-yellow-400 text-sm"></i>
                    <span class="text-sm font-medium">${product.rating}</span>
                    <span class="text-gray-400 text-sm">(${product.reviews})</span>
                </div>
                <h3 class="font-semibold mb-2 line-clamp-2">${product.name}</h3>
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl font-bold text-purple-600">${product.price.toLocaleString()} ₽</span>
                    ${showOldPrice && product.oldPrice ? `<span class="text-gray-400 line-through text-sm">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                </div>
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})"
                    class="add-to-cart-btn">
                    В корзину
                </button>
            </div>
        </div>
    `;
}
// Initialize products
function initProducts() {
    document.getElementById('dealsGrid').innerHTML = products.deals.map(p => renderProduct(p, true)).join('');
    document.getElementById('newArrivalsGrid').innerHTML = products.newArrivals.map(p => renderProduct(p)).join('');
    document.getElementById('bestsellersGrid').innerHTML = products.bestsellers.map(p => renderProduct(p)).join('');
}
// Cart functions
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    showNotification(`${name} добавлен в корзину`);
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}
function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.getElementById('cartCount').textContent = cartCount;

    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartFooter = document.getElementById('cartFooter');

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItemsList.classList.add('hidden');
        cartFooter.classList.add('hidden');
    } else {
        emptyCart.classList.add('hidden');
        cartItemsList.classList.remove('hidden');
        cartFooter.classList.remove('hidden');

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item slide-animation">
                <div class="cart-item-image">
                    <i class="fas fa-box text-purple-400 text-xl"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${item.name}</h4>
                    <p class="text-purple-600 font-semibold">${item.price.toLocaleString()} ₽</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateCartItemQuantity(${item.id}, -1)" class="quantity-btn">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, 1)" class="quantity-btn">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    document.getElementById('cartTotal').textContent = cartTotal.toLocaleString() + ' ₽';
}
// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}
// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification slide-animation';
    notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
// Toggle favorite
function toggleFavorite(id) {
    showNotification('Добавлено в избранное');
}
// Banner slider
let currentSlide = 0;
let slides;
let dots;
function initSlider() {
    slides = document.querySelectorAll('.banner-slide');
    dots = document.querySelectorAll('.slider-dot');
}
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
}
function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}
function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}
// Deal timer
function updateTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('timerDisplay').textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// Scroll to top
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
// Mobile search
function initMobileSearch() {
    document.getElementById('mobileSearchBtn').addEventListener('click', () => {
        document.getElementById('mobileSearchModal').classList.add('show');
    });

    document.getElementById('closeSearchModal').addEventListener('click', () => {
        document.getElementById('mobileSearchModal').classList.remove('show');
    });
}
// Initialize all event listeners
function initEventListeners() {
    // Cart
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    // Slider
    document.getElementById('nextSlide').addEventListener('click', nextSlide);
    document.getElementById('prevSlide').addEventListener('click', prevSlide);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });
}
// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initSlider();
    initEventListeners();
    initScrollToTop();
    initMobileSearch();

    // Start timer
    updateTimer();
    setInterval(updateTimer, 1000);

    // Auto slide
    setInterval(nextSlide, 5000);
});

