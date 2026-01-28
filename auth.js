// Authentication Module

let currentUser = null;

// Initialize auth
function initAuth() {
    const savedUser = getFromLocalStorage('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateAuthUI();
    }
}

// Open login modal
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

// Open register modal
function openRegisterModal() {
    closeLoginModal();
    document.getElementById('registerModal').classList.add('active');
}

// Close register modal
function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await callAppsScript('login', { username, password });
            
            if (result.success) {
                currentUser = result.data;
                saveToLocalStorage('currentUser', currentUser);
                updateAuthUI();
                closeLoginModal();
                showNotification('เข้าสู่ระบบสำเร็จ!');
                
                // Redirect to admin page if admin
                if (currentUser.role === 'admin') {
                    showAdminPage();
                } else {
                    // Load user's cart
                    loadUserCart();
                }
            } else {
                showNotification(result.error || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const name = document.getElementById('regName').value;
            const phone = document.getElementById('regPhone').value;
            const address = document.getElementById('regAddress').value;
            
            const result = await callAppsScript('registerMember', {
                username,
                password,
                name,
                phone,
                address
            });
            
            if (result.success) {
                showNotification('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
                closeRegisterModal();
                openLoginModal();
                registerForm.reset();
            } else {
                showNotification(result.error || 'สมัครสมาชิกไม่สำเร็จ', 'error');
            }
        });
    }
});

// Update auth UI
function updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const mainNav = document.getElementById('mainNav');
    
    if (currentUser) {
        authButton.textContent = `👤 ${currentUser.username}`;
        authButton.onclick = showProfileMenu;
        
        // Add admin link if user is admin
        if (currentUser.role === 'admin') {
            let adminLink = document.querySelector('[onclick="showAdminPage()"]');
            if (!adminLink) {
                adminLink = document.createElement('a');
                adminLink.href = '#';
                adminLink.onclick = showAdminPage;
                adminLink.textContent = '⚙️ จัดการ';
                mainNav.insertBefore(adminLink, authButton);
            }
        }
    } else {
        authButton.textContent = 'เข้าสู่ระบบ';
        authButton.onclick = openLoginModal;
        
        // Remove admin link
        const adminLink = document.querySelector('[onclick="showAdminPage()"]');
        if (adminLink) adminLink.remove();
    }
}

// Show profile menu
function showProfileMenu() {
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px var(--shadow);
        padding: 10px 0;
        z-index: 1001;
        min-width: 200px;
    `;
    
    const menuItems = [
        { text: '📋 โปรไฟล์', action: showProfile },
        { text: '📦 คำสั่งซื้อ', action: showOrders },
        { text: '🚪 ออกจากระบบ', action: logout }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('a');
        menuItem.href = '#';
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            display: block;
            padding: 12px 20px;
            color: var(--gray-dark);
            text-decoration: none;
            transition: background 0.3s;
        `;
        menuItem.onmouseover = function() {
            this.style.background = 'var(--pink-light)';
        };
        menuItem.onmouseout = function() {
            this.style.background = 'transparent';
        };
        menuItem.onclick = function(e) {
            e.preventDefault();
            item.action();
            menu.remove();
        };
        menu.appendChild(menuItem);
    });
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
    
    document.body.appendChild(menu);
}

// Show profile
function showProfile() {
    showPage('profilePage');
    displayProfile();
}

// Display profile
async function displayProfile() {
    const profileInfo = document.getElementById('profileInfo');
    
    if (!currentUser || currentUser.role === 'admin') {
        profileInfo.innerHTML = '<p>กรุณาเข้าสู่ระบบ</p>';
        return;
    }
    
    // Get fresh user data
    const result = await callAppsScript('getMember', { memberId: currentUser.id });
    if (result.success && result.data) {
        currentUser = result.data;
        saveToLocalStorage('currentUser', currentUser);
    }
    
    profileInfo.innerHTML = `
        <div class="profile-card">
            <div class="profile-field">
                <label>ชื่อผู้ใช้:</label>
                <div class="value">${currentUser.username}</div>
            </div>
            <div class="profile-field">
                <label>ชื่อ-นามสกุล:</label>
                <div class="value">${currentUser.name}</div>
            </div>
            <div class="profile-field">
                <label>เบอร์โทรศัพท์:</label>
                <div class="value">${currentUser.phone}</div>
            </div>
            <div class="profile-field">
                <label>ที่อยู่:</label>
                <div class="value">${currentUser.address}</div>
            </div>
            <div class="profile-field">
                <label>แต้มสะสม:</label>
                <div class="value" style="font-size: 1.5em; color: var(--green-dark);">
                    ⭐ ${currentUser.points || 0} แต้ม
                </div>
                <small>แลกส่วนลดได้ ${Math.floor((currentUser.points || 0) / CONFIG.pointsExchangeRate.pointsRequired) * CONFIG.pointsExchangeRate.discountAmount} บาท</small>
            </div>
        </div>
    `;
}

// Logout
function logout() {
    currentUser = null;
    removeFromLocalStorage('currentUser');
    updateAuthUI();
    showHome();
    showNotification('ออกจากระบบสำเร็จ');
}

// Check if user is logged in
function requireAuth() {
    if (!currentUser) {
        showNotification('กรุณาเข้าสู่ระบบก่อน', 'error');
        openLoginModal();
        return false;
    }
    return true;
}

// Check if user is admin
function requireAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('ไม่มีสิทธิ์เข้าถึง', 'error');
        showHome();
        return false;
    }
    return true;
}
