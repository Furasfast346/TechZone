/**
 * TechZone - Catalog Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Сортировка
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const url = new URL(window.location.href);
            url.searchParams.set('sort', this.value);
            url.searchParams.delete('page'); // сбросить пагинацию при смене сортировки
            window.location.href = url.toString();
        });
    }
});