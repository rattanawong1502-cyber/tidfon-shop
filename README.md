[README.md](https://github.com/user-attachments/files/24901248/README.md)
# TidFon - ระบบ E-commerce ขายกำไลเชือกถัก 🧵

เว็บไซต์ E-commerce แบบครบวงจร สำหรับขายกำไลเชือกถัก พร้อมระบบหลังบ้านใช้ Google Sheets

## ✨ ฟีเจอร์หลัก

### สำหรับลูกค้า
- 🔐 ระบบสมัครสมาชิก/ล็อกอิน
- 🛍️ ระบบเลือกซื้อสินค้าและตะกร้า
- 💾 ระบบความจำตะกร้าสินค้า (บันทึกแยกตามผู้ใช้)
- 💰 ระบบชำระเงิน (เก็บเงินปลายทาง, QR พร้อมเพย์)
- 🎫 ระบบใช้คูปองส่วนลด
- ⭐ ระบบสะสมแต้มแลกส่วนลด
- 📦 ระบบติดตามสถานะการจัดส่ง
- 🏷️ ระบบส่วนลดสินค้า

### สำหรับแอดมิน
- ➕ เพิ่ม/แก้ไข/ลบ สินค้า
- 📊 จัดการคำสั่งซื้อ
- 🔄 อัพเดทสถานะการจัดส่ง
- 👥 จัดการสมาชิก
- 📈 ดูรายงานการขาย

## 🎨 การออกแบบ

- สีพาสเทล: ชมพู (#FFB3C6) และเขียว (#A8E6A8)
- UI/UX ที่ใช้งานง่าย
- Responsive Design รองรับทุกอุปกรณ์

## 📋 โครงสร้างไฟล์

```
TidFon/
├── index.html          # หน้าเว็บหลัก
├── styles.css          # ไฟล์ CSS
├── config.js           # การตั้งค่า
├── utils.js            # ฟังก์ชันช่วยเหลือ
├── auth.js             # ระบบล็อกอิน/สมัครสมาชิก
├── products.js         # ระบบจัดการสินค้า
├── cart.js             # ระบบตะกร้าสินค้า
├── orders.js           # ระบบคำสั่งซื้อ
├── admin.js            # ระบบแอดมิน
├── app.js              # แอปพลิเคชันหลัก
└── AppsScript.gs       # Google Apps Script
```

## 🚀 การติดตั้ง

### 1. ตั้งค่า Google Sheets

1. สร้าง Google Sheets ใหม่
2. คัดลอก URL และดึง Spreadsheet ID
   - URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
3. แชร์สิทธิ์เป็น "Anyone with the link can edit"

### 2. ติดตั้ง Google Apps Script

1. ไปที่ https://script.google.com/
2. สร้างโปรเจกต์ใหม่
3. คัดลอกโค้ดจาก `AppsScript.gs` ไปวาง
4. แก้ไข `SPREADSHEET_ID` เป็น ID ของคุณ
5. บันทึกโปรเจกต์

### 3. Deploy Apps Script

1. คลิก "Deploy" > "New deployment"
2. เลือก type: "Web app"
3. ตั้งค่า:
   - Execute as: "Me"
   - Who has access: "Anyone"
4. คลิก "Deploy"
5. คัดลอก Web App URL

### 4. ตั้งค่าเว็บไซต์

1. เปิดไฟล์ `config.js`
2. แก้ไข:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
   const QR_PROMPTPAY_IMAGE = 'URL_รูป_QR_Code_ของคุณ';
   const PROMPTPAY_NUMBER = 'เบอร์พร้อมเพย์ของคุณ';
   ```

### 5. อัพโหลดเว็บไซต์

อัพโหลดไฟล์ทั้งหมดไปยัง Web Hosting ของคุณ หรือใช้:
- GitHub Pages (ฟรี)
- Netlify (ฟรี)
- Vercel (ฟรี)

## 🔑 ข้อมูลเข้าสู่ระบบ

### แอดมิน (ค่าเริ่มต้น)
- Username: `admin`
- Password: `admin123`

> ⚠️ **สำคัญ:** เปลี่ยนรหัสผ่านแอดมินในไฟล์ `config.js` และ `AppsScript.gs`

## 💡 วิธีใช้งาน

### สำหรับลูกค้า

1. **สมัครสมาชิก**
   - คลิก "สมัครสมาชิก"
   - กรอกข้อมูล: ชื่อผู้ใช้, รหัสผ่าน, ชื่อ-นามสกุล, เบอร์โทร, ที่อยู่

2. **เลือกซื้อสินค้า**
   - เลือกสินค้าที่ต้องการ
   - คลิก "เพิ่มลงตะกร้า"
   - ปรับจำนวนในตะกร้า

3. **ชำระเงิน**
   - ตรวจสอบรายการสินค้า
   - เลือกวิธีชำระเงิน
   - ใส่คูปอง (ถ้ามี)
   - เลือกใช้แต้มสะสม (ถ้าต้องการ)
   - ยืนยันคำสั่งซื้อ

4. **ติดตามพัสดุ**
   - ไปที่เมนู "คำสั่งซื้อ"
   - ดูสถานะและเลขพัสดุ

### สำหรับแอดมิน

1. **เข้าสู่ระบบแอดมิน**
   - ใช้ admin/admin123

2. **จัดการสินค้า**
   - เพิ่มสินค้าใหม่: กรอกชื่อ, ลิงก์รูป, ราคา, จำนวน
   - แก้ไขสินค้า: คลิกปุ่ม "แก้ไข"
   - ลบสินค้า: คลิกปุ่ม "ลบ"

3. **จัดการคำสั่งซื้อ**
   - เปลี่ยนสถานะคำสั่งซื้อ
   - ดูข้อมูลลูกค้า

4. **จัดการสมาชิก**
   - ดูรายชื่อสมาชิก
   - ดูแต้มสะสม

## 🎁 ระบบคูปองและแต้ม

### คูปองที่มีอยู่ (ค่าเริ่มต้น)
- `WELCOME10` - ลด 10%
- `SAVE50` - ลด 50 บาท
- `NEWYEAR` - ลด 15%

### ระบบแต้ม
- ซื้อครบ 100 บาท = 1 แต้ม
- 100 แต้ม = ส่วนลด 10 บาท

## 📱 การทำงานของระบบ

### Frontend (HTML/CSS/JavaScript)
- แสดงหน้าเว็บและรับ input จากผู้ใช้
- จัดการ state ด้วย localStorage
- เรียก API ไปยัง Google Apps Script

### Backend (Google Apps Script)
- รับ/ส่งข้อมูล JSON
- เขียน/อ่านข้อมูลใน Google Sheets
- แบ่ง Sheets เป็น 3 ชีท:
  - **สมาชิก**: ข้อมูลผู้ใช้
  - **สต็อกสินค้า**: รายการสินค้า
  - **คำสั่งซื้อ**: ประวัติการสั่งซื้อ

## 🔧 การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขใน `styles.css`:
```css
:root {
    --pink-light: #FFE5EC;
    --pink-medium: #FFB3C6;
    --green-light: #D4F1D4;
    --green-medium: #A8E6A8;
}
```

### เพิ่มคูปองใหม่
แก้ไขใน `config.js`:
```javascript
const COUPONS = {
    'รหัสคูปอง': { 
        discount: 20, 
        type: 'percent', // หรือ 'fixed'
        description: 'ลด 20%' 
    }
};
```

### เปลี่ยน QR Code
แก้ไขใน `config.js`:
```javascript
const QR_PROMPTPAY_IMAGE = 'URL_ของรูป_QR_Code';
const PROMPTPAY_NUMBER = 'เบอร์พร้อมเพย์';
```

## 📊 Google Sheets Format

### ชีท "สมาชิก"
| ID | Username | Password | Name | Phone | Address | Points | Created At |

### ชีท "สต็อกสินค้า"
| ID | Name | Image URL | Price | Discount | Stock | Description | Created At |

### ชีท "คำสั่งซื้อ"
| ID | Member ID | Member Name | Phone | Address | Items (JSON) | Subtotal | Shipping | Discount | Total | Payment Method | Coupon Code | Points Used | Status | Tracking Number | Created At |

## 🐛 การแก้ปัญหา

### ไม่สามารถบันทึกข้อมูลได้
1. ตรวจสอบ APPS_SCRIPT_URL ใน `config.js`
2. ตรวจสอบว่า Deploy Apps Script แล้ว
3. ตรวจสอบสิทธิ์ Google Sheets

### รูปสินค้าไม่แสดง
- ตรวจสอบ URL รูปภาพว่าถูกต้อง
- แนะนำใช้ URL จาก:
  - Unsplash
  - Imgur
  - Google Drive (แชร์เป็น public)

### ตะกร้าสินค้าหาย
- ระบบใช้ localStorage บันทึกตะกร้า
- ข้อมูลจะหายถ้าล้าง browser cache
- แยกตะกร้าตามผู้ใช้

## 📄 License

MIT License - ใช้งานได้ฟรี สำหรับการพาณิชย์และส่วนตัว

## 🙏 Credits

- สร้างโดย: TidFon Team
- Icons: Unicode Emoji
- Images: Unsplash (ตัวอย่าง)

## 📞 ติดต่อ

หากมีปัญหาหรือข้อสงสัย:
- Email: tidfon@example.com
- Line: @tidfon

---

🧵 **TidFon** - กำไลเชือกถักสุดชิค ❤️
