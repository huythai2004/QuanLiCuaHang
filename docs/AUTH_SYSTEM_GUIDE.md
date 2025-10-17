# 🔐 Hướng Dẫn Hệ Thống Đăng Ký & Đăng Nhập

## 📋 Tổng Quan

Hệ thống đăng ký và đăng nhập đã được tích hợp hoàn chỉnh với:
- ✅ Backend Spring Boot (Java) + MySQL Database
- ✅ Frontend React với React Router
- ✅ RESTful API
- ✅ Lưu trữ dữ liệu vào database

---

## 🗄️ Cấu Trúc Database

### Bảng `users`
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150),
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Cách Chạy Hệ Thống

### Bước 1: Cài Đặt Database

```bash
# 1. Đảm bảo MySQL đang chạy
# 2. Chạy script SQL để tạo database và bảng
mysql -u root -p < db/quanlicuahang.sql
```

Hoặc import trực tiếp trong MySQL Workbench/phpMyAdmin.

### Bước 2: Chạy Backend (Spring Boot)

```bash
cd backend/BackEnd

# Nếu dùng Maven
./mvnw spring-boot:run

# Hoặc
mvn spring-boot:run
```

Backend sẽ chạy ở: **http://localhost:8080**

### Bước 3: Cài Đặt & Chạy Frontend

```bash
cd frontend

# Cài đặt dependencies (lần đầu tiên hoặc khi package.json thay đổi)
npm install

# Chạy React app
npm start
```

Frontend sẽ chạy ở: **http://localhost:3000**

---

## 🔌 API Endpoints

### 1. Đăng Ký (Register)

**Endpoint:** `POST http://localhost:8080/api/auth/register`

**Request Body:**
```json
{
  "username": "testuser",
  "fullName": "Test User",
  "email": "test@example.com",
  "phone": "0901234567",
  "password": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": 4,
    "username": "testuser",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "0901234567"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng!",
  "user": null
}
```

---

### 2. Đăng Nhập (Login)

**Endpoint:** `POST http://localhost:8080/api/auth/login`

**Request Body:**
```json
{
  "emailOrPhone": "test@example.com",
  "password": "123456"
}
```

Hoặc dùng số điện thoại:
```json
{
  "emailOrPhone": "0901234567",
  "password": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": 4,
    "username": "testuser",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "0901234567"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Bạn đã điền sai email/số điện thoại hoặc mật khẩu, vui lòng nhập lại!",
  "user": null
}
```

---

## 🧪 Cách Test

### Test với Postman

1. Import collection từ: `docs/examples/QuanLyCuaHang_API.postman_collection.json`
2. Hoặc tạo request mới với các endpoint trên

### Test trên Frontend

1. Mở trình duyệt: http://localhost:3000
2. Click "Sign Up" để đăng ký
3. Điền form đăng ký:
   - Tên đăng nhập: `testuser`
   - Họ và tên: `Test User`
   - Email: `test@example.com`
   - Số điện thoại: `0901234567`
   - Mật khẩu: `123456`
   - Xác nhận mật khẩu: `123456`
4. Click "Đăng ký" → Sẽ hiển thị alert "Bạn đã đăng ký thành công!"
5. Tự động chuyển đến trang Login
6. Đăng nhập bằng email hoặc số điện thoại:
   - Email/SĐT: `test@example.com` hoặc `0901234567`
   - Mật khẩu: `123456`
7. Click "Đăng nhập" → Sẽ hiển thị alert "Đăng nhập thành công!"
8. Navbar sẽ hiển thị tên người dùng thay vì "Sign In / Sign Up"

---

## 📝 Tính Năng

### ✅ Đã Hoàn Thành

- [x] Đăng ký tài khoản với đầy đủ thông tin
- [x] Thêm trường "Tên đăng nhập" (username)
- [x] Thêm trường "Họ và tên" (fullName)
- [x] Lưu toàn bộ dữ liệu vào database MySQL
- [x] Kiểm tra email/phone/username đã tồn tại
- [x] Validate mật khẩu (tối thiểu 6 ký tự)
- [x] Đăng nhập bằng Email HOẶC Số điện thoại
- [x] Hiển thị alert khi đăng ký thành công
- [x] Chuyển hướng về Login sau khi đăng ký
- [x] Hiển thị lỗi khi đăng nhập sai
- [x] Hiển thị tên người dùng trên Navbar
- [x] Ẩn Sign In/Sign Up khi đã đăng nhập
- [x] Tính năng Đăng xuất
- [x] Lưu trạng thái đăng nhập (localStorage)

---

## 🔒 Bảo Mật

⚠️ **Lưu ý:** Hiện tại mật khẩu được lưu dạng plain text (chưa mã hóa).

**Để nâng cao bảo mật trong production:**

1. Thêm BCrypt vào `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2. Cập nhật UserService để hash password:
```java
@Autowired
private PasswordEncoder passwordEncoder;

// Khi đăng ký
user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

// Khi đăng nhập
if (user.isPresent() && passwordEncoder.matches(password, user.get().getPasswordHash())) {
    return user;
}
```

---

## 🎯 Các Thành Phần Chính

### Backend

- **Entity:** `User.java` - Model cho bảng users
- **Repository:** `UserRepository.java` - JPA repository
- **Service:** `UserService.java` - Business logic
- **Controller:** `AuthController.java` - REST API endpoints
- **DTO:** 
  - `RegisterRequest.java` - Request body cho đăng ký
  - `LoginRequest.java` - Request body cho đăng nhập
  - `AuthResponse.java` - Response body chung

### Frontend

- **Context:** `AuthContext.jsx` - Quản lý state authentication
- **Components:**
  - `Login.jsx` - Trang đăng nhập
  - `signup.jsx` - Trang đăng ký
  - `NavBar.jsx` - Navigation bar với hiển thị user

---

## 🐛 Troubleshooting

### Lỗi kết nối database
```
Error: Communications link failure
```
**Giải pháp:**
- Kiểm tra MySQL đang chạy
- Kiểm tra username/password trong `application.properties`
- Kiểm tra tên database đã tạo chưa

### Lỗi CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Giải pháp:**
- Đảm bảo `@CrossOrigin(origins = "http://localhost:3000")` có trong Controller
- Hoặc thêm CORS configuration global

### Lỗi "Cannot find module 'axios'"
```
Module not found: Can't resolve 'axios'
```
**Giải pháp:**
```bash
cd frontend
npm install axios
```

---

## 📧 Tài Khoản Test Có Sẵn

Database đã có sẵn 3 tài khoản test:

| Username | Email | Phone | Password |
|----------|-------|-------|----------|
| admin | admin@shop.com | 0900000001 | 27112004 |
| staff1 | staff1@shop.com | 0900000002 | 27112004 |
| thai | thaiphamhuy3@gmail.com | 0900000003 | 27112004 |

---

## 🎉 Hoàn Thành!

Hệ thống đăng ký và đăng nhập đã hoạt động hoàn chỉnh với database MySQL!



