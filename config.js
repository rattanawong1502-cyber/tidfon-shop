// Google Apps Script Web App URL
// แทนที่ URL นี้ด้วย URL ของ Google Apps Script ที่คุณ deploy
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

// QR PromptPay
const QR_PROMPTPAY_IMAGE = 'https://via.placeholder.com/300x300?text=QR+PromptPay+TidFon';

// PromptPay Number (เปลี่ยนเป็นเบอร์ของคุณ)
const PROMPTPAY_NUMBER = '0812345678';

// คูปองส่วนลด
const COUPONS = {
    'WELCOME10': { discount: 10, type: 'percent', description: 'ลด 10%' },
    'SAVE50': { discount: 50, type: 'fixed', description: 'ลด 50 บาท' },
    'NEWYEAR': { discount: 15, type: 'percent', description: 'ลด 15%' }
};

// อัตราแลกแต้ม (100 แต้ม = 10 บาท)
const POINTS_EXCHANGE_RATE = {
    pointsRequired: 100,
    discountAmount: 10
};

// Admin credentials (ในการใช้งานจริงควรเก็บไว้ใน backend)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Shipping cost
const SHIPPING_COST = 50;

// Config
const CONFIG = {
    appName: 'TidFon',
    storeName: 'ร้านกำไลเชือกถัก TidFon',
    appsScriptUrl: APPS_SCRIPT_URL,
    qrPromptPayImage: QR_PROMPTPAY_IMAGE,
    promptPayNumber: PROMPTPAY_NUMBER,
    coupons: COUPONS,
    pointsExchangeRate: POINTS_EXCHANGE_RATE,
    adminUsername: ADMIN_USERNAME,
    adminPassword: ADMIN_PASSWORD,
    shippingCost: SHIPPING_COST
};
