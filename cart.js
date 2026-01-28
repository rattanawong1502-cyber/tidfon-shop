// Cart Module

let cart = [];

// Initialize cart
function initCart() {
    loadUserCart();
    updateCartCount();
}

// Load user's cart from localStorage
function loadUserCart() {
    const cartKey = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
    const savedCart = getFromLocalStorage(cartKey);
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    const cartKey = currentUser ? `cart_${currentUser.id}` : 'cart_guest';
    saveToLocalStorage(cartKey, cart);
    updateCartCount();
}

// Add to cart
function addToCart(productId) {
    const product = getProductById(productId);
    
    if (!product) {
        showNotification('ไม่พบสินค้า', 'error');
        return;
    }
    
    if (product.stock === 0) {
        showNotification('สินค้าหมด', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('สินค้าในคลังไม่เพียงพอ', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('เพิ่มสินค้าลงตะกร้าแล้ว!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    displayCart();
    showNotification('ลบสินค้าออกจากตะกร้าแล้ว');
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    const product = getProductById(productId);
    const cartItem = cart.find(item => item.productId === productId);
    
    if (!cartItem) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showNotification('สินค้าในคลังไม่เพียงพอ', 'error');
        return;
    }
    
    cartItem.quantity = newQuantity;
    saveCart();
    displayCart();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 1.2em; color: var(--gray-medium);">🛒 ตะกร้าว่างเปล่า</p>
                <button class="btn-primary" onclick="showProducts()" style="margin-top: 20px;">
                    เลือกซื้อสินค้า
                </button>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }
    
    let subtotal = 0;
    
    cartItems.innerHTML = cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) return '';
        
        const price = product.discount || product.price;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${formatCurrency(price)} x ${item.quantity}</div>
                    <div class="quantity-control">
                        <button onclick="updateCartQuantity('${product.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${product.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.2em; font-weight: bold; color: var(--green-dark); margin-bottom: 10px;">
                        ${formatCurrency(itemTotal)}
                    </div>
                    <button class="btn-secondary" onclick="removeFromCart('${product.id}')" 
                        style="background: var(--pink-medium); padding: 8px 15px; font-size: 0.9em;">
                        🗑️ ลบ
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const shipping = CONFIG.shippingCost;
    const total = subtotal + shipping;
    
    cartSummary.innerHTML = `
        <div class="summary-row">
            <span>ยอดรวมสินค้า:</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>ค่าจัดส่ง:</span>
            <span>${formatCurrency(shipping)}</span>
        </div>
        <div class="summary-row total">
            <span>ยอดรวมทั้งหมด:</span>
            <span>${formatCurrency(total)}</span>
        </div>
        <button class="btn-primary" onclick="proceedToCheckout()" 
            style="width: 100%; margin-top: 20px; font-size: 1.1em;">
            ดำเนินการชำระเงิน
        </button>
    `;
}

// Proceed to checkout
function proceedToCheckout() {
    if (!requireAuth()) return;
    
    if (cart.length === 0) {
        showNotification('ตะกร้าสินค้าว่างเปล่า', 'error');
        return;
    }
    
    showPage('checkoutPage');
    displayCheckout();
}

// Display checkout
function displayCheckout() {
    const shippingInfo = document.getElementById('shippingInfo');
    const checkoutSummary = document.getElementById('checkoutSummary');
    
    // Display shipping info
    shippingInfo.innerHTML = `
        <div class="profile-card">
            <div class="profile-field">
                <label>ชื่อผู้รับ:</label>
                <div class="value">${currentUser.name}</div>
            </div>
            <div class="profile-field">
                <label>เบอร์โทรศัพท์:</label>
                <div class="value">${currentUser.phone}</div>
            </div>
            <div class="profile-field">
                <label>ที่อยู่จัดส่ง:</label>
                <div class="value">${currentUser.address}</div>
            </div>
        </div>
    `;
    
    // Calculate totals
    updateCheckoutSummary();
    
    // Setup payment method change
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    paymentInputs.forEach(input => {
        input.addEventListener('change', function() {
            const qrPayment = document.getElementById('qrPayment');
            if (this.value === 'qr') {
                qrPayment.style.display = 'block';
                qrPayment.innerHTML = `
                    <img src="${CONFIG.qrPromptPayImage}" alt="QR Code" style="max-width: 100%; border-radius: 10px;">
                    <p style="margin-top: 10px;">สแกน QR Code เพื่อชำระเงิน</p>
                    <p style="font-size: 0.9em; color: var(--gray-medium);">
                        พร้อมเพย์: ${CONFIG.promptPayNumber}
                    </p>
                `;
            } else {
                qrPayment.style.display = 'none';
            }
        });
    });
    
    // Setup coupon and points
    document.getElementById('couponCode').addEventListener('input', updateCheckoutSummary);
    document.getElementById('usePoints').addEventListener('change', updateCheckoutSummary);
}

// Update checkout summary
function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    
    let subtotal = 0;
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            const price = product.discount || product.price;
            subtotal += price * item.quantity;
        }
    });
    
    const shipping = CONFIG.shippingCost;
    const couponCode = document.getElementById('couponCode')?.value || '';
    const usePoints = document.getElementById('usePoints')?.checked || false;
    const userPoints = currentUser?.points || 0;
    
    const discountInfo = calculateDiscount(subtotal, couponCode, usePoints, userPoints);
    const total = subtotal + shipping - discountInfo.discount;
    
    checkoutSummary.innerHTML = `
        <h3 style="color: var(--pink-dark); margin-bottom: 20px;">สรุปคำสั่งซื้อ</h3>
        <div class="summary-row">
            <span>ยอดรวมสินค้า:</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>ค่าจัดส่ง:</span>
            <span>${formatCurrency(shipping)}</span>
        </div>
        ${discountInfo.discount > 0 ? `
            <div class="summary-row">
                <span>ส่วนลด:</span>
                <span class="discount-amount">-${formatCurrency(discountInfo.discount)}</span>
            </div>
        ` : ''}
        ${discountInfo.appliedCoupon ? `
            <div style="padding: 10px; background: var(--green-light); border-radius: 10px; margin: 10px 0; font-size: 0.9em;">
                ✅ ใช้คูปอง: ${discountInfo.appliedCoupon.description}
            </div>
        ` : ''}
        ${discountInfo.pointsUsed > 0 ? `
            <div style="padding: 10px; background: var(--green-light); border-radius: 10px; margin: 10px 0; font-size: 0.9em;">
                ⭐ ใช้แต้มสะสม: ${discountInfo.pointsUsed} แต้ม
            </div>
        ` : ''}
        <div class="summary-row total">
            <span>ยอดรวมทั้งหมด:</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
}

// Apply coupon
function applyCoupon() {
    updateCheckoutSummary();
    const couponCode = document.getElementById('couponCode').value;
    if (CONFIG.coupons[couponCode]) {
        showNotification('ใช้คูปองสำเร็จ!');
    } else if (couponCode) {
        showNotification('รหัสคูปองไม่ถูกต้อง', 'error');
    }
}

// Confirm order
async function confirmOrder() {
    if (cart.length === 0) {
        showNotification('ตะกร้าสินค้าว่างเปล่า', 'error');
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    const items = cart.map(item => {
        const product = getProductById(item.productId);
        const price = product.discount || product.price;
        subtotal += price * item.quantity;
        return {
            productId: item.productId,
            productName: product.name,
            price: price,
            quantity: item.quantity,
            total: price * item.quantity
        };
    });
    
    const shipping = CONFIG.shippingCost;
    const couponCode = document.getElementById('couponCode').value;
    const usePoints = document.getElementById('usePoints').checked;
    const userPoints = currentUser.points || 0;
    
    const discountInfo = calculateDiscount(subtotal, couponCode, usePoints, userPoints);
    const total = subtotal + shipping - discountInfo.discount;
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Create order
    const orderData = {
        memberId: currentUser.id,
        memberName: currentUser.name,
        memberPhone: currentUser.phone,
        memberAddress: currentUser.address,
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        discount: discountInfo.discount,
        total: total,
        paymentMethod: paymentMethod,
        couponCode: couponCode || null,
        pointsUsed: discountInfo.pointsUsed
    };
    
    const result = await callAppsScript('createOrder', orderData);
    
    if (result.success) {
        // Update member points
        if (currentUser && result.data) {
            const earnedPoints = Math.floor(total / 100);
            currentUser.points = (currentUser.points || 0) - discountInfo.pointsUsed + earnedPoints;
            saveToLocalStorage('currentUser', currentUser);
        }
        
        // Clear cart
        cart = [];
        saveCart();
        
        // Show success
        showNotification('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
        showOrders();
    } else {
        showNotification('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
    }
}
