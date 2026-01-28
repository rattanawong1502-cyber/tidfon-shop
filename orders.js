// Orders Module

let userOrders = [];

// Load orders
async function loadOrders() {
    if (!currentUser) return;
    
    const result = await callAppsScript('getOrders', { memberId: currentUser.id });
    if (result.success) {
        userOrders = result.data;
        displayOrders();
    }
}

// Display orders
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (!currentUser) {
        ordersList.innerHTML = '<p style="text-align: center;">กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ</p>';
        return;
    }
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 1.2em; color: var(--gray-medium);">📦 ยังไม่มีคำสั่งซื้อ</p>
                <button class="btn-primary" onclick="showProducts()" style="margin-top: 20px;">
                    เริ่มช้อปปิ้ง
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedOrders = [...userOrders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    ordersList.innerHTML = sortedOrders.map(order => createOrderCard(order)).join('');
}

// Create order card HTML
function createOrderCard(order) {
    const statusText = getStatusText(order.status);
    const statusClass = `status-${order.status}`;
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">คำสั่งซื้อ #${order.id.substr(-8)}</div>
                    <div style="font-size: 0.9em; color: var(--gray-medium); margin-top: 5px;">
                        ${formatDate(order.createdAt)}
                    </div>
                </div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="order-items">
                <strong>รายการสินค้า:</strong>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.productName} x ${item.quantity}</span>
                        <span>${formatCurrency(item.total)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="border-top: 2px solid var(--gray-light); padding-top: 15px; margin-top: 15px;">
                <div class="order-item">
                    <span>ยอดรวมสินค้า:</span>
                    <span>${formatCurrency(order.subtotal)}</span>
                </div>
                <div class="order-item">
                    <span>ค่าจัดส่ง:</span>
                    <span>${formatCurrency(order.shipping)}</span>
                </div>
                ${order.discount > 0 ? `
                    <div class="order-item">
                        <span>ส่วนลด:</span>
                        <span style="color: var(--green-dark);">-${formatCurrency(order.discount)}</span>
                    </div>
                ` : ''}
                <div class="order-item" style="font-weight: bold; font-size: 1.1em; color: var(--pink-dark);">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span>${formatCurrency(order.total)}</span>
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 15px; background: var(--gray-light); border-radius: 10px;">
                <strong>ข้อมูลการจัดส่ง:</strong>
                <p style="margin: 5px 0;">ผู้รับ: ${order.memberName}</p>
                <p style="margin: 5px 0;">เบอร์: ${order.memberPhone}</p>
                <p style="margin: 5px 0;">ที่อยู่: ${order.memberAddress}</p>
                <p style="margin: 5px 0;">วิธีชำระเงิน: ${getPaymentMethodText(order.paymentMethod)}</p>
            </div>
            
            ${order.trackingNumber ? `
                <div class="tracking-info">
                    <strong>📦 เลขพัสดุ:</strong> ${order.trackingNumber}
                    <p style="margin-top: 5px; font-size: 0.9em;">
                        สถานะ: ${getTrackingStatus(order.status)}
                    </p>
                </div>
            ` : ''}
            
            ${order.pointsUsed > 0 ? `
                <div style="margin-top: 10px; padding: 10px; background: var(--green-light); border-radius: 10px; font-size: 0.9em;">
                    ⭐ ใช้แต้มสะสม ${order.pointsUsed} แต้ม
                </div>
            ` : ''}
        </div>
    `;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'รอการยืนยัน',
        'confirmed': 'ยืนยันแล้ว',
        'shipped': 'กำลังจัดส่ง',
        'delivered': 'จัดส่งแล้ว',
        'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
}

// Get payment method text
function getPaymentMethodText(method) {
    const methodMap = {
        'cod': '💵 เก็บเงินปลายทาง',
        'qr': '📱 QR พร้อมเพย์'
    };
    return methodMap[method] || method;
}

// Get tracking status
function getTrackingStatus(status) {
    const trackingMap = {
        'pending': '📋 รอดำเนินการ',
        'confirmed': '✅ ร้านค้ายืนยันคำสั่งซื้อแล้ว',
        'shipped': '🚚 พัสดุอยู่ระหว่างการจัดส่ง',
        'delivered': '✅ จัดส่งสำเร็จ',
        'cancelled': '❌ ยกเลิกคำสั่งซื้อ'
    };
    return trackingMap[status] || status;
}
