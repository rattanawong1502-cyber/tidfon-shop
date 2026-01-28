// Admin Module

let adminOrders = [];
let adminMembers = [];

// Show admin page
function showAdminPage() {
    if (!requireAdmin()) return;
    showPage('adminPage');
    showAdminTab('products');
    loadAdminData();
}

// Load admin data
async function loadAdminData() {
    // Load all orders
    const ordersResult = await callAppsScript('getOrders', { memberId: 'admin' });
    if (ordersResult.success) {
        adminOrders = ordersResult.data;
        displayAdminOrders();
    }
    
    // Load all members
    const membersResult = await callAppsScript('getMembers');
    if (membersResult.success) {
        adminMembers = membersResult.data;
        displayAdminMembers();
    }
    
    // Display products
    displayAdminProducts();
}

// Show admin tab
function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
}

// Show add product form
function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'block';
}

// Hide add product form
function hideAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('newProductForm').reset();
}

// Setup new product form
document.addEventListener('DOMContentLoaded', function() {
    const newProductForm = document.getElementById('newProductForm');
    if (newProductForm) {
        newProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('productName').value,
                image: document.getElementById('productImage').value,
                price: parseFloat(document.getElementById('productPrice').value),
                discount: parseFloat(document.getElementById('productDiscount').value) || null,
                stock: parseInt(document.getElementById('productStock').value),
                description: document.getElementById('productDesc').value
            };
            
            const result = await callAppsScript('addProduct', productData);
            
            if (result.success) {
                showNotification('เพิ่มสินค้าสำเร็จ!');
                hideAddProductForm();
                await loadProducts();
                displayAdminProducts();
            } else {
                showNotification('เพิ่มสินค้าไม่สำเร็จ', 'error');
            }
        });
    }
});

// Display admin products
function displayAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    
    if (allProducts.length === 0) {
        adminProductsList.innerHTML = '<p style="text-align: center; padding: 20px;">ยังไม่มีสินค้า</p>';
        return;
    }
    
    adminProductsList.innerHTML = allProducts.map(product => `
        <div class="admin-product-item">
            <img src="${product.image}" alt="${product.name}" class="admin-product-image">
            <div class="admin-product-info">
                <div style="font-weight: bold; color: var(--pink-dark); font-size: 1.1em; margin-bottom: 5px;">
                    ${product.name}
                </div>
                <div style="color: var(--green-dark); margin-bottom: 5px;">
                    ราคา: ${formatCurrency(product.price)}
                    ${product.discount ? ` → ${formatCurrency(product.discount)}` : ''}
                </div>
                <div style="color: var(--gray-medium); font-size: 0.9em;">
                    คงเหลือ: ${product.stock} ชิ้น
                </div>
                ${product.description ? `
                    <div style="color: var(--gray-medium); font-size: 0.85em; margin-top: 5px;">
                        ${product.description}
                    </div>
                ` : ''}
            </div>
            <div class="admin-product-actions">
                <button class="btn-secondary" onclick="editProduct('${product.id}')">
                    ✏️ แก้ไข
                </button>
                <button class="btn-primary" onclick="deleteProduct('${product.id}')" 
                    style="background: var(--pink-medium);">
                    🗑️ ลบ
                </button>
            </div>
        </div>
    `).join('');
}

// Edit product
function editProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Show modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>แก้ไขสินค้า</h2>
            <form id="editProductForm">
                <input type="text" id="editProductName" value="${product.name}" placeholder="ชื่อสินค้า" required>
                <input type="url" id="editProductImage" value="${product.image}" placeholder="URL รูปภาพ" required>
                <input type="number" id="editProductPrice" value="${product.price}" placeholder="ราคา" required>
                <input type="number" id="editProductDiscount" value="${product.discount || ''}" placeholder="ราคาส่วนลด (ถ้ามี)">
                <input type="number" id="editProductStock" value="${product.stock}" placeholder="จำนวนคงเหลือ" required>
                <textarea id="editProductDesc" placeholder="รายละเอียด">${product.description || ''}</textarea>
                <button type="submit" class="btn-primary">บันทึก</button>
                <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">ยกเลิก</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('editProductForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const updatedData = {
            id: productId,
            name: document.getElementById('editProductName').value,
            image: document.getElementById('editProductImage').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            discount: parseFloat(document.getElementById('editProductDiscount').value) || null,
            stock: parseInt(document.getElementById('editProductStock').value),
            description: document.getElementById('editProductDesc').value
        };
        
        const result = await callAppsScript('updateProduct', updatedData);
        
        if (result.success) {
            showNotification('แก้ไขสินค้าสำเร็จ!');
            modal.remove();
            await loadProducts();
            displayAdminProducts();
        } else {
            showNotification('แก้ไขสินค้าไม่สำเร็จ', 'error');
        }
    });
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;
    
    const result = await callAppsScript('deleteProduct', { id: productId });
    
    if (result.success) {
        showNotification('ลบสินค้าสำเร็จ!');
        await loadProducts();
        displayAdminProducts();
    } else {
        showNotification('ลบสินค้าไม่สำเร็จ', 'error');
    }
}

// Display admin orders
function displayAdminOrders() {
    const adminOrdersList = document.getElementById('adminOrdersList');
    
    if (adminOrders.length === 0) {
        adminOrdersList.innerHTML = '<p style="text-align: center; padding: 20px;">ยังไม่มีคำสั่งซื้อ</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedOrders = [...adminOrders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    adminOrdersList.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">คำสั่งซื้อ #${order.id.substr(-8)}</div>
                    <div style="font-size: 0.9em; color: var(--gray-medium); margin-top: 5px;">
                        ${formatDate(order.createdAt)}
                    </div>
                </div>
                <div>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" 
                        style="padding: 8px; border-radius: 10px; border: 2px solid var(--gray-light);">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>รอการยืนยัน</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>ยืนยันแล้ว</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>กำลังจัดส่ง</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>จัดส่งแล้ว</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ยกเลิก</option>
                    </select>
                </div>
            </div>
            
            <div style="padding: 15px; background: var(--gray-light); border-radius: 10px; margin: 15px 0;">
                <strong>ข้อมูลลูกค้า:</strong>
                <p style="margin: 5px 0;">ชื่อ: ${order.memberName}</p>
                <p style="margin: 5px 0;">เบอร์: ${order.memberPhone}</p>
                <p style="margin: 5px 0;">ที่อยู่: ${order.memberAddress}</p>
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
                    <span>ยอดรวม:</span>
                    <span style="font-weight: bold; color: var(--green-dark);">${formatCurrency(order.total)}</span>
                </div>
                <div class="order-item">
                    <span>วิธีชำระเงิน:</span>
                    <span>${getPaymentMethodText(order.paymentMethod)}</span>
                </div>
                ${order.trackingNumber ? `
                    <div class="order-item">
                        <span>เลขพัสดุ:</span>
                        <span style="font-weight: bold;">${order.trackingNumber}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    const result = await callAppsScript('updateOrderStatus', { 
        orderId: orderId, 
        status: newStatus 
    });
    
    if (result.success) {
        showNotification('อัพเดทสถานะคำสั่งซื้อแล้ว!');
        await loadAdminData();
    } else {
        showNotification('อัพเดทสถานะไม่สำเร็จ', 'error');
    }
}

// Display admin members
function displayAdminMembers() {
    const adminMembersList = document.getElementById('adminMembersList');
    
    if (adminMembers.length === 0) {
        adminMembersList.innerHTML = '<p style="text-align: center; padding: 20px;">ยังไม่มีสมาชิก</p>';
        return;
    }
    
    adminMembersList.innerHTML = `
        <div style="overflow-x: auto;">
            <table style="width: 100%; background: white; border-radius: 15px; overflow: hidden;">
                <thead style="background: var(--pink-light);">
                    <tr>
                        <th style="padding: 15px; text-align: left;">ชื่อผู้ใช้</th>
                        <th style="padding: 15px; text-align: left;">ชื่อ-นามสกุล</th>
                        <th style="padding: 15px; text-align: left;">เบอร์โทร</th>
                        <th style="padding: 15px; text-align: left;">แต้มสะสม</th>
                        <th style="padding: 15px; text-align: left;">วันที่สมัคร</th>
                    </tr>
                </thead>
                <tbody>
                    ${adminMembers.map(member => `
                        <tr style="border-bottom: 1px solid var(--gray-light);">
                            <td style="padding: 15px;">${member.username}</td>
                            <td style="padding: 15px;">${member.name}</td>
                            <td style="padding: 15px;">${member.phone}</td>
                            <td style="padding: 15px; color: var(--green-dark); font-weight: bold;">
                                ⭐ ${member.points || 0}
                            </td>
                            <td style="padding: 15px; color: var(--gray-medium); font-size: 0.9em;">
                                ${formatDate(member.createdAt)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
