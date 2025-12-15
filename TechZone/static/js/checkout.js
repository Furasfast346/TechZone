/**
 * TechZone - Checkout Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const checkoutItems = document.getElementById('checkoutItems');
    const emptyCheckoutCart = document.getElementById('emptyCheckoutCart');
    const itemsCount = document.getElementById('itemsCount');
    const subtotal = document.getElementById('subtotal');
    const deliveryPrice = document.getElementById('deliveryPrice');
    const totalPrice = document.getElementById('totalPrice');
    const submitOrder = document.getElementById('submitOrder');
    const cartDataInput = document.getElementById('cartDataInput');
    const addressBlock = document.getElementById('addressBlock');
    const addressInput = document.getElementById('addressInput');

    let currentDeliveryPrice = 300;

    // Render checkout items
    function renderCheckoutItems() {
        const cart = getCart();

        if (cart.length === 0) {
            checkoutItems.classList.add('hidden');
            emptyCheckoutCart.classList.remove('hidden');
            submitOrder.disabled = true;
            return;
        }

        checkoutItems.classList.remove('hidden');
        emptyCheckoutCart.classList.add('hidden');
        submitOrder.disabled = false;

        checkoutItems.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    ${item.image
                        ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">`
                        : '<i class="fas fa-box text-gray-400"></i>'
                    }
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm truncate">${item.name}</h4>
                    <p class="text-gray-500 text-sm">${item.quantity} шт.</p>
                </div>
                <span class="font-semibold text-sm">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        updateTotals();
    }

    // Update totals
    function updateTotals() {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = sub + currentDeliveryPrice;

        itemsCount.textContent = count;
        subtotal.textContent = formatPrice(sub);
        totalPrice.textContent = formatPrice(total);

        // Update hidden cart data
        cartDataInput.value = JSON.stringify(cart);
    }

    // Delivery option change
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'pickup') {
                currentDeliveryPrice = 0;
                deliveryPrice.textContent = 'Бесплатно';
                deliveryPrice.classList.add('text-green-600');
                addressBlock.classList.add('hidden');
                addressInput.required = false;
            } else {
                currentDeliveryPrice = 300;
                deliveryPrice.textContent = '300 ₽';
                deliveryPrice.classList.remove('text-green-600');
                addressBlock.classList.remove('hidden');
                addressInput.required = true;
            }
            updateTotals();
        });
    });

    // Form validation
    const form = document.getElementById('checkoutForm');
    form.addEventListener('submit', function(e) {
        const cart = getCart();
        if (cart.length === 0) {
            e.preventDefault();
            showNotification('Корзина пуста', 'error');
            return;
        }

        // Update cart data before submit
        cartDataInput.value = JSON.stringify(cart);

        // Clear cart after successful order (можно убрать если обработка на бэкенде)
        // clearCart();
    });

    // Listen for cart updates
    document.addEventListener('cartUpdated', function() {
        renderCheckoutItems();
    });

    // Initial render
    renderCheckoutItems();
});