/**
 * TechZone - Contacts Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initWorkStatus();
    initContactForm();
    initFileAttachment();
    initFAQ();
    initPhoneMask();
    initCallbackModal();
    initScrollToTop();
});

// ===== Work Status =====
function initWorkStatus() {
    updateWorkStatus();
    setInterval(updateWorkStatus, 60000); // Update every minute
}

function updateWorkStatus() {
    const statusContainer = document.getElementById('workStatus');
    if (!statusContainer) return;

    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes / 60;

    let isOpen = false;
    let statusText = '';

    // Monday-Friday: 9:00-21:00
    if (day >= 1 && day <= 5) {
        if (currentTime >= 9 && currentTime < 21) {
            isOpen = true;
            statusText = 'Открыто до 21:00';
        } else if (currentTime < 9) {
            statusText = 'Откроется в 9:00';
        } else {
            statusText = 'Откроется завтра в 9:00';
        }
    }
    // Saturday-Sunday: 10:00-20:00
    else if (day === 0 || day === 6) {
        if (currentTime >= 10 && currentTime < 20) {
            isOpen = true;
            statusText = 'Открыто до 20:00';
        } else if (currentTime < 10) {
            statusText = 'Откроется в 10:00';
        } else {
            statusText = day === 6 ? 'Откроется завтра в 10:00' : 'Откроется в понедельник в 9:00';
        }
    }

    statusContainer.innerHTML = `
        <div class="work-status ${isOpen ? 'open' : 'closed'}">
            <span class="status-dot"></span>
            <span>${isOpen ? 'Открыто' : 'Закрыто'}</span>
        </div>
        <p class="text-gray-500 text-sm mt-1">${statusText}</p>
    `;
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Validate name
        if (nameInput.value.trim().length < 2) {
            showError('name', 'Введите ваше имя (минимум 2 символа)');
            isValid = false;
        } else {
            hideError('name');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError('email', 'Введите корректный email');
            isValid = false;
        } else {
            hideError('email');
        }

        // Validate message
        if (messageInput.value.trim().length < 10) {
            showError('message', 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        } else {
            hideError('message');
        }

        if (isValid) {
            // Here you would normally send data to server
            // For demo, just show success modal
            successModal.classList.add('show');
            form.reset();
            clearAttachedFiles();
        }
    });

    // Close success modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            successModal.classList.remove('show');
        });
    }

    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }

    // Real-time validation
    nameInput.addEventListener('input', function() {
        if (this.value.trim().length >= 2) hideError('name');
    });

    emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value.trim())) hideError('email');
    });

    messageInput.addEventListener('input', function() {
        if (this.value.trim().length >= 10) hideError('message');
    });
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');

    if (input) {
        input.classList.add('error', 'shake');
        setTimeout(() => input.classList.remove('shake'), 300);
    }

    if (error) {
        error.textContent = message;
        error.classList.add('show');
    }
}

function hideError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');

    if (input) input.classList.remove('error');
    if (error) error.classList.remove('show');
}

// ===== File Attachment =====
let attachedFiles = [];

function initFileAttachment() {
    const attachBtn = document.getElementById('attachFileBtn');
    const fileInput = document.getElementById('fileInput');

    if (!attachBtn || !fileInput) return;

    attachBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function(e) {
        const newFiles = Array.from(e.target.files);
        attachedFiles = [...attachedFiles, ...newFiles];
        renderAttachedFiles();
    });
}

function renderAttachedFiles() {
    const container = document.getElementById('attachedFiles');
    const list = document.getElementById('filesList');

    if (!container || !list) return;

    if (attachedFiles.length > 0) {
        container.classList.remove('hidden');
        list.innerHTML = attachedFiles.map((file, index) => `
            <div class="file-tag">
                <i class="fas fa-file"></i>
                <span>${truncateFileName(file.name)}</span>
                <button type="button" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    } else {
        container.classList.add('hidden');
    }
}

function truncateFileName(name) {
    if (name.length > 20) {
        const ext = name.split('.').pop();
        return name.substring(0, 15) + '...' + ext;
    }
    return name;
}

function removeFile(index) {
    attachedFiles.splice(index, 1);
    renderAttachedFiles();
}

function clearAttachedFiles() {
    attachedFiles = [];
    const container = document.getElementById('attachedFiles');
    if (container) container.classList.add('hidden');
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// ===== Phone Input Mask =====
function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value[0] === '8') value = '7' + value.slice(1);
                if (value[0] !== '7') value = '7' + value;
            }

            let formatted = '';
            if (value.length > 0) formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);

            e.target.value = formatted;
        });

        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
            }
        });
    });
}

// ===== Callback Modal =====
function initCallbackModal() {
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackModal = document.getElementById('callbackModal');
    const closeCallbackModal = document.getElementById('closeCallbackModal');
    const callbackForm = document.getElementById('callbackForm');
    const successModal = document.getElementById('successModal');

    if (callbackBtn && callbackModal) {
        callbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            callbackModal.classList.add('show');
        });
    }

    if (closeCallbackModal && callbackModal) {
        closeCallbackModal.addEventListener('click', () => {
            callbackModal.classList.remove('show');
        });

        callbackModal.addEventListener('click', function(e) {
            if (e.target === callbackModal) {
                callbackModal.classList.remove('show');
            }
        });
    }

    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            callbackModal.classList.remove('show');
            successModal.classList.add('show');
            callbackForm.reset();
        });
    }
}

// ===== Scroll to Top =====
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

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

// ===== Escape Key Handler =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay.show');
        modals.forEach(modal => modal.classList.remove('show'));
    }
});