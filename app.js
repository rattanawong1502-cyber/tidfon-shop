// Main Application

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Initialize application
async function initApp() {
    console.log('Initializing TidFon E-commerce...');
    
    // Initialize auth
    initAuth();
    
    // Initialize cart
    initCart();
    
    // Load products
    await loadProducts();
    
    // Hide loading
    hideLoading();
    
    // Show home page by default
    showHome();
}

// Show page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

// Navigation functions
function showHome() {
    showPage('homePage');
}

function showProducts() {
    showPage('productsPage');
    displayProducts();
}

function showCart() {
    showPage('cartPage');
    displayCart();
}

function showOrders() {
    if (!requireAuth()) return;
    showPage('ordersPage');
    loadOrders();
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Prevent form submission on Enter key (except in forms)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
        }
    }
});

// Handle browser back button
window.addEventListener('popstate', function() {
    showHome();
});

// Console welcome message
console.log('%c🧵 TidFon E-commerce', 'color: #FF8FAB; font-size: 24px; font-weight: bold;');
console.log('%cกำไลเชือกถักสุดชิค', 'color: #7EC97E; font-size: 16px;');
console.log('%c\n💡 Tips:\n- ใช้ admin/admin123 เพื่อเข้าสู่ระบบแอดมิน\n- ข้อมูลถูกเก็บใน localStorage\n- สามารถเพิ่มสินค้าได้ในโหมดแอดมิน', 'color: #666; font-size: 12px;');

// Service Worker for PWA (optional - for future enhancement)
if ('serviceWorker' in navigator) {
    // Uncomment when you create a service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
}
