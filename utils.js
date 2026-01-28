// Utility Functions

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Show loading
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--green-medium)' : 'var(--pink-medium)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Local Storage functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// API Call to Google Apps Script
async function callAppsScript(action, data = {}) {
    showLoading();
    try {
        const response = await fetch(CONFIG.appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                data: data
            }),
            mode: 'no-cors' // เนื่องจาก Apps Script อาจมี CORS issues
        });
        
        // เนื่องจากใช้ no-cors จะไม่สามารถอ่าน response ได้
        // ดังนั้นจะใช้ localStorage เป็น fallback ในการพัฒนา
        hideLoading();
        return { success: true };
    } catch (error) {
        console.error('Error calling Apps Script:', error);
        hideLoading();
        // ใช้ localStorage แทนในระหว่างการพัฒนา
        return handleLocalStorage(action, data);
    }
}

// Fallback to localStorage when Apps Script is not available
function handleLocalStorage(action, data) {
    const mockData = {
        members: getFromLocalStorage('members') || [],
        products: getFromLocalStorage('products') || getDefaultProducts(),
        orders: getFromLocalStorage('orders') || [],
        cart: getFromLocalStorage('cart') || []
    };

    switch (action) {
        case 'registerMember':
            mockData.members.push({
                id: generateId(),
                ...data,
                points: 0,
                createdAt: new Date().toISOString()
            });
            saveToLocalStorage('members', mockData.members);
            return { success: true, data: mockData.members[mockData.members.length - 1] };

        case 'login':
            const member = mockData.members.find(m => 
                m.username === data.username && m.password === data.password
            );
            if (member) {
                return { success: true, data: member };
            }
            // Check admin
            if (data.username === CONFIG.adminUsername && data.password === CONFIG.adminPassword) {
                return { success: true, data: { id: 'admin', username: 'admin', role: 'admin' } };
            }
            return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };

        case 'getProducts':
            return { success: true, data: mockData.products };

        case 'addProduct':
            const newProduct = {
                id: generateId(),
                ...data,
                createdAt: new Date().toISOString()
            };
            mockData.products.push(newProduct);
            saveToLocalStorage('products', mockData.products);
            return { success: true, data: newProduct };

        case 'updateProduct':
            const productIndex = mockData.products.findIndex(p => p.id === data.id);
            if (productIndex !== -1) {
                mockData.products[productIndex] = { ...mockData.products[productIndex], ...data };
                saveToLocalStorage('products', mockData.products);
                return { success: true, data: mockData.products[productIndex] };
            }
            return { success: false, error: 'ไม่พบสินค้า' };

        case 'deleteProduct':
            mockData.products = mockData.products.filter(p => p.id !== data.id);
            saveToLocalStorage('products', mockData.products);
            return { success: true };

        case 'createOrder':
            const newOrder = {
                id: generateId(),
                ...data,
                status: 'pending',
                trackingNumber: 'TF' + Date.now().toString().substr(-8),
                createdAt: new Date().toISOString()
            };
            mockData.orders.push(newOrder);
            saveToLocalStorage('orders', mockData.orders);
            
            // Update member points
            const memberIndex = mockData.members.findIndex(m => m.id === data.memberId);
            if (memberIndex !== -1) {
                mockData.members[memberIndex].points += Math.floor(data.total / 100);
                saveToLocalStorage('members', mockData.members);
            }
            
            return { success: true, data: newOrder };

        case 'getOrders':
            if (data.memberId === 'admin') {
                return { success: true, data: mockData.orders };
            }
            const memberOrders = mockData.orders.filter(o => o.memberId === data.memberId);
            return { success: true, data: memberOrders };

        case 'updateOrderStatus':
            const orderIndex = mockData.orders.findIndex(o => o.id === data.orderId);
            if (orderIndex !== -1) {
                mockData.orders[orderIndex].status = data.status;
                saveToLocalStorage('orders', mockData.orders);
                return { success: true, data: mockData.orders[orderIndex] };
            }
            return { success: false, error: 'ไม่พบคำสั่งซื้อ' };

        case 'getMembers':
            return { success: true, data: mockData.members };

        case 'getMember':
            const foundMember = mockData.members.find(m => m.id === data.memberId);
            return { success: true, data: foundMember };

        default:
            return { success: false, error: 'Unknown action' };
    }
}

// Default products for demo
function getDefaultProducts() {
    return [
        {
            id: '1',
            name: 'กำไลเชือกถักสีชมพูพาสเทล',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
            price: 150,
            discount: 120,
            stock: 25,
            description: 'กำไลเชือกถักสีชมพูพาสเทลสวยงาม ทำด้วยมือ'
        },
        {
            id: '2',
            name: 'กำไลเชือกถักสีเขียวมิ้นท์',
            image: 'https://images.unsplash.com/photo-1589674781759-c0c3e930cbda?w=400',
            price: 150,
            stock: 30,
            description: 'กำไลเชือกถักสีเขียวมิ้นท์สดใส ใส่สบาย'
        },
        {
            id: '3',
            name: 'กำไลเชือกถักลายสายรุ้ง',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
            price: 200,
            discount: 170,
            stock: 15,
            description: 'กำไลเชือกถักลายสายรุ้งสีสันสดใส น่ารักมาก'
        },
        {
            id: '4',
            name: 'กำไลเชือกถักสีครีม',
            image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
            price: 140,
            stock: 20,
            description: 'กำไลเชือกถักสีครีมอ่อนๆ เรียบหรู เข้ากับทุกชุด'
        },
        {
            id: '5',
            name: 'กำไลเชือกถักแบบมัดย้อม',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
            price: 180,
            stock: 18,
            description: 'กำไลเชือกถักแบบมัดย้อมสีพาสเทล ไม่ซ้ำใคร'
        },
        {
            id: '6',
            name: 'กำไลเชือกถักลายดอกไม้',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
            price: 220,
            discount: 190,
            stock: 12,
            description: 'กำไลเชือกถักลายดอกไม้ ประดับด้วยลูกปัด'
        }
    ];
}

// Calculate discount
function calculateDiscount(subtotal, couponCode, usePoints, userPoints) {
    let discount = 0;
    let appliedCoupon = null;
    let pointsUsed = 0;

    // Apply coupon
    if (couponCode && CONFIG.coupons[couponCode]) {
        const coupon = CONFIG.coupons[couponCode];
        if (coupon.type === 'percent') {
            discount += subtotal * (coupon.discount / 100);
        } else {
            discount += coupon.discount;
        }
        appliedCoupon = coupon;
    }

    // Apply points
    if (usePoints && userPoints >= CONFIG.pointsExchangeRate.pointsRequired) {
        const maxPoints = Math.floor(userPoints / CONFIG.pointsExchangeRate.pointsRequired) * CONFIG.pointsExchangeRate.pointsRequired;
        pointsUsed = maxPoints;
        discount += (maxPoints / CONFIG.pointsExchangeRate.pointsRequired) * CONFIG.pointsExchangeRate.discountAmount;
    }

    return {
        discount: Math.min(discount, subtotal), // ส่วนลดไม่เกินยอดรวม
        appliedCoupon,
        pointsUsed
    };
}
