# 🔐 Hệ Thống Đăng Ký & Đăng Nhập

## ⚡ Quick Start

### 1. Setup Database
```bash
mysql -u root -p < db/quanlicuahang.sql
```

Nếu database đã tồn tại, chạy migration:
```bash
mysql -u root -p < db/migrations/add_full_name_to_users.sql
```

### 2. Start Backend
```bash
cd backend/BackEnd
mvn spring-boot:run
```
Backend: http://localhost:8080

### 3. Start Frontend
```bash
cd frontend
npm install  # Lần đầu tiên
npm start
```
Frontend: http://localhost:3000

---

## 📊 Tính Năng

✅ **Đăng Ký:**
- Tên đăng nhập (unique)
- Họ và tên
- Email (unique)
- Số điện thoại (unique)
- Mật khẩu (tối thiểu 6 ký tự)

✅ **Đăng Nhập:**
- Dùng Email HOẶC Số điện thoại
- Kiểm tra mật khẩu

✅ **Sau Đăng Nhập:**
- Hiển thị tên user trên Navbar
- Ẩn Sign In/Sign Up
- Cho phép đăng xuất

---

## 🔌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/check` | Kiểm tra API |

---

## 🧪 Test Account

| Email | Phone | Password |
|-------|-------|----------|
| admin@shop.com | 0900000001 | 27112004 |
| staff1@shop.com | 0900000002 | 27112004 |
| thaiphamhuy3@gmail.com | 0900000003 | 27112004 |

---

## 📖 Tài Liệu Chi Tiết

Xem file: **[docs/AUTH_SYSTEM_GUIDE.md](docs/AUTH_SYSTEM_GUIDE.md)**

---

## 📁 Files Đã Thay Đổi

### Backend
- ✅ `Entity/User.java` - Thêm field fullName
- ✅ `Repository/UserRepository.java` - Thêm query methods
- ✅ `Service/UserService.java` - Logic register/login
- ✅ `Controller/AuthController.java` - API endpoints (mới)
- ✅ `DTO/RegisterRequest.java` (mới)
- ✅ `DTO/LoginRequest.java` (mới)
- ✅ `DTO/AuthResponse.java` (mới)

### Frontend
- ✅ `contexts/AuthContext.jsx` - Context quản lý auth (mới)
- ✅ `components/Pages/Login.jsx` - Cập nhật gọi API
- ✅ `components/Pages/signup.jsx` - Cập nhật gọi API
- ✅ `components/Pages/NavBar.jsx` - Hiển thị username
- ✅ `App.js` - Wrap với AuthProvider
- ✅ `package.json` - Thêm axios

### Database
- ✅ `db/quanlicuahang.sql` - Thêm cột full_name
- ✅ `db/migrations/add_full_name_to_users.sql` - Migration script (mới)

---

## ✨ Demo Flow

1. Người dùng vào http://localhost:3000
2. Click "Sign Up"
3. Điền form đăng ký
4. Alert: "Bạn đã đăng ký thành công!"
5. Tự động chuyển về trang Login
6. Nhập email/phone + password
7. Alert: "Đăng nhập thành công!"
8. Navbar hiển thị: 👤 **[Tên đăng nhập]** + Đăng xuất
9. Người dùng có thể browse web, mua hàng, thích sản phẩm

---

Developed with ❤️ by Thai Pham

