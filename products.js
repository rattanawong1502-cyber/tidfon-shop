// Products Module

let allProducts = [];

// Load products
async function loadProducts() {
    const result = await callAppsScript('getProducts');
    if (result.success) {
        allProducts = result.data;
        displayProducts();
        displayFeaturedProducts();
    }
}

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (allProducts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--gray-medium);">ไม่มีสินค้า</p>';
        return;
    }
    
    grid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
}

// Display featured products (first 3)
function displayFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    const featured = allProducts.slice(0, 3);
    
    grid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    const hasDiscount = product.discount && product.discount < product.price;
    const displayPrice = hasDiscount ? product.discount : product.price;
    const discountPercent = hasDiscount ? Math.round((1 - product.discount / product.price) * 100) : 0;
    
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price ${hasDiscount ? 'has-discount' : ''}">
                    ${formatCurrency(displayPrice)}
                    ${hasDiscount ? `
                        <span class="original-price">${formatCurrency(product.price)}</span>
                        <span class="discount-badge">-${discountPercent}%</span>
                    ` : ''}
                </div>
                <div class="product-stock">
                    ${product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : 'สินค้าหมด'}
                </div>
                ${product.description ? `<p style="font-size: 0.9em; color: var(--gray-medium); margin: 10px 0;">${product.description}</p>` : ''}
                <div class="product-actions">
                    <button class="btn-primary" onclick="addToCart('${product.id}')" 
                        ${product.stock === 0 ? 'disabled' : ''}>
                        🛒 เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get product by ID
function getProductById(productId) {
    return allProducts.find(p => p.id === productId);
}

// Update product stock
function updateProductStock(productId, quantity) {
    const product = getProductById(productId);
    if (product) {
        product.stock -= quantity;
        saveToLocalStorage('products', allProducts);
        displayProducts();
        displayFeaturedProducts();
    }
}
