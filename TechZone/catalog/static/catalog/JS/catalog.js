/* Catalog page JavaScript */

// Add to cart
function addToCart(id, name, price) {
    fetch('/cart/add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ product_id: id, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(name + ' добавлен в корзину');
            updateCartCount(data.cart_count);
        }
    })
    .catch(() => {
        // Fallback если API не настроен
        showNotification(name + ' добавлен в корзину');
    });
}

// Toggle favorite
function toggleFavorite(id) {
    fetch('/favorites/toggle/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ product_id: id })
    })
    .then(response => response.json())
    .then(data => {
        const btn = document.querySelector(`button[onclick*="toggleFavorite(${id})"] i`);
        if (btn) {
            btn.classList.toggle('far');
            btn.classList.toggle('fas');
            btn.classList.toggle('text-red-500');
        }
        showNotification(data.is_favorite ? 'Добавлено в избранное' : 'Удалено из избранного');
    })
    .catch(() => {
        // Fallback
        const btn = document.querySelector(`button[onclick*="toggleFavorite(${id})"] i`);
        if (btn) {
            btn.classList.toggle('far');
            btn.classList.toggle('fas');
            btn.classList.toggle('text-red-500');
        }
        showNotification('Добавлено в избранное');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i>' + message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update cart count in header
function updateCartCount(count) {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

// Get CSRF token from cookies
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