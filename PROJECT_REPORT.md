# BÁO CÁO DỰ ÁN QUẢN LÝ CỬA HÀNG

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mô tả
Dự án **QuanLyCuaHang** là một hệ thống quản lý cửa hàng điện tử (E-commerce Management System) được xây dựng với kiến trúc tách biệt Frontend và Backend. Hệ thống hỗ trợ đầy đủ các chức năng từ quản lý sản phẩm, đặt hàng, thanh toán đến quản trị người dùng và báo cáo.

### 1.2. Mục tiêu
- Xây dựng hệ thống quản lý cửa hàng hiện đại, dễ sử dụng
- Hỗ trợ đầy đủ quy trình mua bán trực tuyến (E-commerce)
- Quản lý đơn hàng, thanh toán và khách hàng hiệu quả
- Cung cấp giao diện quản trị cho admin

### 1.3. Phạm vi dự án
- **Người dùng (Customer)**: Duyệt sản phẩm, thêm vào giỏ hàng, đặt hàng, thanh toán, xem lịch sử đơn hàng.
- **Quản trị viên (Admin)**: Quản lý sản phẩm, đơn hàng, người dùng, cập nhật trạng thái đơn hàng.

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1. Kiến trúc tổng thể

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │         │   Database      │
│   (React)       │◄───────►│  (Spring Boot)  │◄───────►│    (MySQL)      │
│  Port: 3000     │  HTTP   │   Port: 8080    │   JDBC  │   Port: 3306    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       │                            │
       │                            │
       ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│  Cloudinary     │         │   SMTP Gmail    │
│  (Image CDN)    │         │   (Email OTP)   │
└─────────────────┘         └─────────────────┘
```

### 2.2. Kiến trúc Backend (Spring Boot)

**Mô hình 3 lớp (3-Tier Architecture):**

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│  (REST API Endpoints - Auth, Order, Payment, Product)   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Service Layer                         │
│  (Business Logic - UserService, OrderService, ...)      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Repository Layer                        │
│  (Data Access - Spring Data JPA / Hibernate)            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Database (MySQL)                      │
│  (Tables: users, products, orders, payments, ...)        │
└─────────────────────────────────────────────────────────┘
```

**Cấu trúc thư mục Backend:**
```
backend/BackEnd/
├── src/main/java/com/example/backend/
│   ├── Controller/          # REST Controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── ProductsController.java
│   │   ├── OrderController.java
│   │   ├── PaymentController.java
│   │   ├── CategoriesController.java
│   │   ├── ProductImagesController.java
│   │   ├── ContactMessageController.java
│   │   └── PasswordResetController.java
│   ├── Service/             # Business Logic
│   │   ├── UserService.java
│   │   ├── ProductsService.java
│   │   ├── OrderService.java
│   │   ├── VNPayService.java (disabled)
│   │   └── ...
│   ├── Repository/          # Data Access
│   │   ├── UserRepository.java
│   │   ├── ProductsRepository.java
│   │   ├── OrderRepository.java
│   │   └── ...
│   ├── Entity/              # JPA Entities
│   │   ├── User.java
│   │   ├── Products.java
│   │   ├── Order.java
│   │   ├── Order_Items.java
│   │   ├── Payments.java
│   │   └── ...
│   ├── DTO/                 # Data Transfer Objects
│   │   ├── AuthResponse.java
│   │   ├── CreateOrderRequest.java
│   │   └── ...
│   └── Config/              # Configuration
│       └── SecurityConfig.java
└── src/main/resources/
    └── application.properties
```

### 2.3. Kiến trúc Frontend (React)

**Component-based Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│                    App.js (Root)                        │
│              (React Router Configuration)               │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Layout/   │ │   Pages/    │ │   Cart/     │
│  Header     │ │  Login      │ │  Cart       │
│  Footer     │ │  Products   │ │  Payment    │
│  Slider     │ │  Profile    │ │  WishList   │
└─────────────┘ └─────────────┘ └─────────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────▼───────────────┐
        │      Dashboard/              │
        │  AdminDashboard              │
        │  ProductCRUD                 │
        │  UserCRUD                    │
        └──────────────────────────────┘
```

**Cấu trúc thư mục Frontend:**
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/          # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Slider.jsx
│   │   │   └── Banner.jsx
│   │   ├── Pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── ...
│   │   ├── Cart/            # Shopping cart
│   │   │   ├── Cart.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── WhishList.jsx
│   │   ├── Dashboard/       # Admin dashboard
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProductCRUD.jsx
│   │   │   └── UserCRUD.jsx
│   │   └── Search/          # Search & filter
│   │       ├── Search.jsx
│   │       └── Filter.jsx
│   ├── css/                 # Stylesheets
│   ├── App.js               # Main app component
│   └── index.js            # Entry point
└── package.json
```

### 2.4. Database Schema

**Các bảng chính:**

1. **users** - Thông tin người dùng
   - id, email, phone, password (BCrypt), fullName, address, enabled, roles

2. **customers** - Thông tin khách hàng (sync từ users)
   - id, userId, fullName, address

3. **products** - Sản phẩm
   - id, name, description, price, categoryId, stock, ...

4. **product_images** - Hình ảnh sản phẩm (Cloudinary)
   - id, productId, imageUrl

5. **orders** - Đơn hàng
   - id, customerId, orderDate, status, total, shippingAddress

6. **order_items** - Chi tiết đơn hàng
   - id, orderId, productId, quantity, unitPrice, lineTotal

7. **payments** - Thanh toán
   - id, orderId, method, amount, transactionNo, bankCode, status, paidAt

8. **categories** - Danh mục sản phẩm
   - id, name, description

---

## 3. CHỨC NĂNG CHI TIẾT

### 3.1. Xác thực và Phân quyền (Authentication & Authorization)

#### 3.1.1. Đăng ký (Register)
- **Endpoint**: `POST /api/auth/register`
- **Chức năng**:
  - Người dùng đăng ký tài khoản mới với email/số điện thoại
  - Mật khẩu được mã hóa bằng BCrypt
  - Tự động tạo customer record từ thông tin user
  - Trả về thông tin user và token (nếu có)

#### 3.1.2. Đăng nhập (Login)
- **Endpoint**: `POST /api/auth/login`
- **Chức năng**:
  - Đăng nhập bằng email hoặc số điện thoại
  - Kiểm tra mật khẩu với BCrypt
  - Xác thực user đã được kích hoạt (`enabled = true`)
  - Trả về thông tin user và quyền truy cập

#### 3.1.3. Quên mật khẩu (Password Reset)
- **Endpoint**: `POST /users/request-reset`
- **Chức năng**:
  - Gửi OTP qua email (SMTP Gmail)
  - Xác thực OTP và cho phép đặt lại mật khẩu
  - Mã hóa mật khẩu mới bằng BCrypt

#### 3.1.4. Spring Security
- **Cấu hình**: `SecurityConfig.java`
- **Tính năng**:
  - Stateless session (sẵn sàng mở rộng JWT)
  - BCrypt password encoder
  - CORS configuration
  - CSRF disabled cho REST API

### 3.2. Quản lý Người dùng

#### 3.2.1. CRUD Người dùng
- **Endpoints**:
  - `GET /users` - Lấy danh sách tất cả users
  - `GET /users/{id}` - Lấy thông tin user theo ID
  - `POST /users` - Tạo user mới
  - `PUT /users/{id}` - Cập nhật thông tin user
  - `DELETE /users/{id}` - Xóa user
  - `PUT /users/{id}/roles` - Cập nhật quyền (Admin only)

#### 3.2.2. Quản lý Hồ sơ
- **Chức năng**:
  - Xem và chỉnh sửa thông tin cá nhân
  - Đồng bộ địa chỉ từ User sang Customer
  - Xem lịch sử đơn hàng tại `/profile`

### 3.3. Quản lý Sản phẩm

#### 3.3.1. CRUD Sản phẩm
- **Endpoints**:
  - `GET /products` - Lấy danh sách sản phẩm
  - `GET /products/{id}` - Chi tiết sản phẩm
  - `POST /products` - Tạo sản phẩm mới
  - `POST /products/with-images` - Tạo sản phẩm kèm ảnh
  - `PUT /products/{id}` - Cập nhật sản phẩm
  - `DELETE /products/{id}` - Xóa sản phẩm

#### 3.3.2. Quản lý Hình ảnh
- **Endpoints**:
  - `GET /product-images/{productId}` - Lấy ảnh theo sản phẩm
  - `POST /product-images/upload-multiple-from-urls/{productId}` - Upload ảnh từ URL
  - **Tích hợp Cloudinary**: Lưu trữ và phục vụ ảnh qua CDN

#### 3.3.3. Danh mục Sản phẩm
- **Endpoints**:
  - `GET /categories` - Lấy danh sách danh mục
  - `POST /categories` - Tạo danh mục mới
  - `PUT /categories/{id}` - Cập nhật danh mục
  - `DELETE /categories/{id}` - Xóa danh mục

### 3.4. Quản lý Đơn hàng

#### 3.4.1. Tạo Đơn hàng
- **Endpoint**: `POST /orders/create`
- **Chức năng**:
  - Tạo đơn hàng từ giỏ hàng
  - Tự động tạo/đồng bộ Customer từ User
  - Tạo Order và Order_Items
  - Tính tổng tiền từ order_items
  - Trạng thái mặc định: `PENDING`

#### 3.4.2. Xem Đơn hàng
- **Endpoints**:
  - `GET /orders/{orderId}` - Chi tiết đơn hàng (bao gồm items, customer, payment)
  - `GET /orders/user/{userId}` - Danh sách đơn theo user (Profile)
  - `GET /orders/all` - Tất cả đơn hàng (Admin only)

#### 3.4.3. Cập nhật Trạng thái
- **Endpoint**: `PUT /orders/{orderId}/status`
- **Trạng thái đơn hàng**:
  - `PENDING` - Chờ thanh toán
  - `PROCESSING` - Đang xử lý
  - `SHIPPING` - Đang giao hàng
  - `PAID` - Đã thanh toán
  - `DELIVERED` - Đã giao hàng
  - `CANCELLED` - Đã hủy

#### 3.4.4. Hủy và Xóa Đơn
- **Endpoints**:
  - `PUT /orders/{orderId}/cancel` - Hủy đơn (chỉ PENDING)
  - `DELETE /orders/{orderId}` - Xóa đơn (chỉ CANCELLED)

### 3.5. Thanh toán

#### 3.5.1. Xác nhận Thanh toán Thủ công (COD)
- **Endpoint**: `POST /payment/confirm?orderId={id}&method=COD`
- **Chức năng**:
  - Tạo bản ghi trong bảng `payments`
  - Cập nhật trạng thái đơn hàng thành `PAID`
  - Lưu thông tin: method, amount, status, paidAt

#### 3.5.2. VNPay Integration (Tạm vô hiệu hóa)
- **Trạng thái**: Đã tích hợp đầy đủ nhưng đang comment/disable
- **Tính năng đã có**:
  - Tạo URL thanh toán VNPay (HMAC SHA512)
  - Verify chữ ký callback
  - Xử lý kết quả thanh toán
- **Cấu hình**: Giữ lại trong `application.properties` và `VNPayService` để bật lại sau

### 3.6. Giao diện Người dùng

#### 3.6.1. Trang Chủ
- Hiển thị slider, banner
- Danh sách sản phẩm nổi bật
- Tìm kiếm và lọc sản phẩm

#### 3.6.2. Chi tiết Sản phẩm
- Hiển thị thông tin chi tiết
- Hình ảnh sản phẩm (Cloudinary)
- Thêm vào giỏ hàng
- Quick View modal

#### 3.6.3. Giỏ hàng
- Xem danh sách sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng tiền

#### 3.6.4. Thanh toán
- **Trang Payment**: Hiển thị chi tiết đơn hàng
- Xác nhận thanh toán → Alert "Bạn đã thanh toán đơn hàng thành công"
- Tự động điều hướng về trang chủ
- Đơn hàng xuất hiện trong "Đơn hàng của tôi" tại `/profile`

#### 3.6.5. Hồ sơ Người dùng
- Xem thông tin cá nhân
- Lịch sử đơn hàng
- Cập nhật thông tin

### 3.7. Dashboard Quản trị

#### 3.7.1. Admin Dashboard
- Tổng quan hệ thống
- Thống kê đơn hàng, sản phẩm, người dùng

#### 3.7.2. Quản lý Sản phẩm (ProductCRUD)
- CRUD sản phẩm
- Upload ảnh lên Cloudinary
- Quản lý danh mục

#### 3.7.3. Quản lý Người dùng (UserCRUD)
- Xem danh sách users
- Cập nhật quyền (roles)
- Kích hoạt/vô hiệu hóa tài khoản

#### 3.7.4. Quản lý Đơn hàng
- Xem tất cả đơn hàng
- Cập nhật trạng thái đơn
- Hủy/xóa đơn

#### 3.7.5. Phản hồi Khách hàng (AdminFeedback)
- Xem và trả lời tin nhắn từ form liên hệ

---

## 4. CÔNG NGHỆ VÀ THƯ VIỆN

### 4.1. Backend Stack
- **Java 21** - Ngôn ngữ lập trình
- **Spring Boot** - Framework chính
- **Spring Web** - REST API
- **Spring Data JPA** - ORM
- **Hibernate** - JPA Implementation
- **MySQL** - Database
- **Spring Security** - Authentication & Authorization
- **BCrypt** - Password encoding
- **Java Mail** - Email (SMTP Gmail)
- **Cloudinary SDK** - Image storage & CDN
- **Lombok** - Code generation
- **Jackson** - JSON processing

### 4.2. Frontend Stack
- **React 18** - UI Framework
- **React Router** - Routing
- **Bootstrap 4** - CSS Framework
- **Font Awesome** - Icons
- **Axios/Fetch** - HTTP client

### 4.3. External Services
- **Cloudinary** - Image hosting & CDN
- **Gmail SMTP** - Email service
- **VNPay Sandbox** - Payment gateway (disabled)

---

## 5. LUỒNG XỬ LÝ CHÍNH

### 5.1. Luồng Đặt hàng

```
User thêm sản phẩm vào giỏ
    ↓
User nhấn "Thanh toán"
    ↓
Frontend: POST /orders/create
    ↓
Backend: Tạo Order + Order_Items
    ↓
Trả về orderId
    ↓
Frontend: Redirect đến /payment?orderId={id}
    ↓
User xem chi tiết đơn và nhấn "Xác nhận thanh toán"
    ↓
Frontend: POST /payment/confirm?orderId={id}&method=COD
    ↓
Backend: Tạo Payment record + Update Order status = PAID
    ↓
Frontend: Alert "Bạn đã thanh toán đơn hàng thành công"
    ↓
Redirect về trang chủ
    ↓
User xem đơn hàng tại /profile
```

### 5.2. Luồng Xác thực

```
User đăng ký/đăng nhập
    ↓
POST /api/auth/register hoặc /api/auth/login
    ↓
Backend: Validate + Hash password (BCrypt)
    ↓
Kiểm tra enabled = true
    ↓
Trả về user info + roles
    ↓
Frontend: Lưu session/token
    ↓
User truy cập các trang được bảo vệ
```

### 5.3. Luồng Quản lý Đơn hàng (Admin)

```
Admin đăng nhập
    ↓
Truy cập Admin Dashboard
    ↓
Xem danh sách đơn hàng: GET /orders/all
    ↓
Cập nhật trạng thái: PUT /orders/{id}/status
    ↓
Order status: PENDING → PROCESSING → SHIPPING → DELIVERED
```

---

## 6. BẢO MẬT

### 6.1. Authentication
- Mật khẩu mã hóa bằng BCrypt
- Xác thực user enabled trước khi cho phép đăng nhập
- Session stateless (sẵn sàng mở rộng JWT)

### 6.2. Authorization
- Phân quyền dựa trên roles (User, Admin)
- Admin có quyền quản lý toàn bộ hệ thống
- User chỉ xem/sửa thông tin của mình

### 6.3. Data Validation
- Validate input ở Controller và Service layer
- SQL injection prevention (JPA/Hibernate)
- XSS prevention (React escape)

---

## 7. TÍCH HỢP BÊN NGOÀI

### 7.1. Cloudinary
- **Mục đích**: Lưu trữ và phục vụ ảnh sản phẩm
- **Cách hoạt động**: Upload ảnh từ URL → Cloudinary → Lưu URL vào database

### 7.2. Gmail SMTP
- **Mục đích**: Gửi OTP khôi phục mật khẩu
- **Cấu hình**: SMTP Gmail với App Password

### 7.3. VNPay (Tạm vô hiệu hóa)
- **Mục đích**: Thanh toán trực tuyến
- **Trạng thái**: Code đã sẵn sàng, chỉ cần bỏ comment để kích hoạt

---

## 8. HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN

### 8.1. Hạn chế hiện tại
- Chưa có JWT token (đang dùng session cơ bản)
- VNPay đang tạm vô hiệu hóa
- Chưa có unit test
- Chưa có logging system chuyên nghiệp

### 8.2. Hướng phát triển
- **Bảo mật**: Triển khai JWT với refresh token
- **Thanh toán**: Bật lại VNPay hoặc tích hợp cổng khác (MoMo, ZaloPay)
- **Testing**: Viết unit test và integration test
- **Performance**: Caching (Redis), pagination
- **Monitoring**: Logging, error tracking
- **Mobile**: React Native app
- **Real-time**: WebSocket cho thông báo đơn hàng

---

## 9. KẾT LUẬN

Dự án **QuanLyCuaHang** là một hệ thống quản lý cửa hàng hoàn chỉnh với đầy đủ các chức năng cơ bản của một ứng dụng E-commerce. Kiến trúc tách biệt Frontend-Backend giúp dễ dàng bảo trì và mở rộng. Hệ thống sử dụng các công nghệ hiện đại và best practices, sẵn sàng cho việc phát triển và triển khai production.

---

**Ngày tạo báo cáo**: 2025  
**Phiên bản**: 1.0

