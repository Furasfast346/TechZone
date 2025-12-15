/**
 * TechZone - Product Detail Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addToCartBtn = document.getElementById('addToCartBtn');

    if (!quantityInput) return;

    const maxQty = parseInt(quantityInput.getAttribute('max')) || 99;

    // Decrease quantity
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value) || 1;
            if (val > 1) {
                quantityInput.value = val - 1;
            }
        });
    }

    // Increase quantity
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value) || 1;
            if (val < maxQty) {
                quantityInput.value = val + 1;
            }
        });
    }

    // Validate quantity input
    quantityInput.addEventListener('change', () => {
        let val = parseInt(quantityInput.value) || 1;
        if (val < 1) val = 1;
        if (val > maxQty) val = maxQty;
        quantityInput.value = val;
    });

    // Add to cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const id = parseInt(addToCartBtn.dataset.id);
            const name = addToCartBtn.dataset.name;
            const price = parseFloat(addToCartBtn.dataset.price);
            const image = addToCartBtn.dataset.image || null;
            const qty = parseInt(quantityInput.value) || 1;

            // Add multiple items
            for (let i = 0; i < qty; i++) {
                // Проверяем, есть ли уже в корзине
                const cart = getCart();
                const existing = cart.find(item => item.id === id);

                if (i === 0 || !existing) {
                    addToCart(id, name, price, image);
                } else {
                    updateCartItemQuantity(id, 1);
                }
            }

            // Показать уведомление только один раз
            if (qty > 1) {
                showNotification(`${name} (${qty} шт.) добавлен в корзину`);
            }
        });
    }
});