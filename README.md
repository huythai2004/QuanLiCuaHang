# QuanLyCuaHang

Ứng dụng quản lý cửa hàng với kiến trúc tách biệt Frontend (React) và Backend (Spring Boot). Dự án hỗ trợ từ quản lý sản phẩm, đặt hàng, thanh toán đến quản trị người dùng.

## Công nghệ chính

- **Backend**
  - Java 21, Spring Boot.
  - Spring Web, Spring Data JPA (Hibernate), Spring Validation.
  - Spring Security với BCrypt password encoder (Authentication & Authorization).
  - MySQL làm hệ quản trị CSDL.
  - Java Mail (SMTP) để gửi OTP khôi phục mật khẩu.
  - Cloudinary SDK để lưu trữ & phục vụ ảnh sản phẩm.
  - Lombok, Jackson JSON mapper.

- **Frontend**
  - React (Create React App), React Router.
  - Bootstrap 4, custom CSS (`main.css`, `util.css`).
  - Font Awesome icon set.

- **Tích hợp ngoài**
  - VNPay (sandbox) đã tích hợp đầy đủ nhưng đang tạm vô hiệu hoá theo yêu cầu nghiệp vụ. Cấu hình & logic vẫn được giữ lại để bật lại sau.

## Kiến trúc & cấu trúc thư mục

```
quanlicuahang/
├─ backend/BackEnd/          # Spring Boot project
│  ├─ src/main/java/com/example/backend/
│  │  ├─ Controller/         # REST controllers (Auth, Order, Payment, ...)
│  │  ├─ Service/            # Business services
│  │  ├─ Repository/         # Spring Data repositories
│  │  ├─ Entity/             # JPA entities
│  │  └─ Config/             # Bảo mật, cấu hình chung
│  └─ src/main/resources/
│     └─ application.properties
└─ frontend/                 # React application
   └─ src/components/
      ├─ Cart/Payment.jsx    # Trang thanh toán/ xác nhận đơn
      └─ Layout/...          # UI layout, slider, ...
```

## Tính năng nổi bật

- **Authentication & Authorization**
  - Đăng nhập bằng email hoặc số điện thoại, mã hoá mật khẩu với BCrypt.
  - Xác thực người dùng đã kích hoạt (`enabled`) trước khi cho phép truy cập các chức năng đặt hàng.
  - Spring Security filter chain cấu hình stateless, sẵn sàng mở rộng JWT/bearer token nếu cần.

- **Quản lý người dùng & hồ sơ**
  - Tra cứu thông tin người dùng, lấy danh sách đơn hàng theo user.
  - Gửi OTP qua email (SMTP Google) cho quy trình quên mật khẩu/ đặt lại.

- **Sản phẩm & hình ảnh**
  - CRUD sản phẩm, lưu metadata và ảnh đại diện lên Cloudinary.
  - Lấy danh sách hình ảnh theo sản phẩm.

- **Đơn hàng**
  - API tạo đơn từ giỏ hàng: sinh `Order`, `Order_Items` dựa trên user và danh sách sản phẩm.
  - Tính tổng tiền tại backend (`unitPrice * quantity` hoặc `lineTotal` nếu có).
  - Xem chi tiết đơn (bao gồm khách hàng, địa chỉ, sản phẩm, tổng tiền, thông tin thanh toán nếu có).
  - Trang “Đơn hàng của tôi” (Profile) hiển thị toàn bộ đơn theo user.
  - Admin xem toàn bộ đơn và cập nhật trạng thái (`PENDING`, `PROCESSING`, `SHIPPING`, `PAID`, ...).
  - Quy tắc huỷ/ xoá đơn: chỉ huỷ `PENDING`, chỉ xoá `CANCELLED`.

- **Thanh toán**
  - Bảng `payments` lưu giao dịch (orderId, method, amount, transactionNo, bankCode, status, paidAt).
  - Endpoint xác nhận thanh toán thủ công (COD/ thanh toán khi nhận hàng): `POST /payment/confirm` → tạo bản ghi `payments` trạng thái `SUCCESS` và cập nhật đơn `PAID`.
  - VNPay sandbox: đã từng tạo URL thanh toán (HMAC SHA512, verify chữ ký, callback). Hiện logic & cấu hình được comment để tạm dừng; placeholder `/payment/vnpay` trả về thông điệp thành công để frontend hoạt động.

- **Frontend trải nghiệm khách hàng**
  - Trang thanh toán (`Payment.jsx`) hiển thị chi tiết đơn, gọi API xác nhận thanh toán, alert “Bạn đã thanh toán đơn hàng thành công” và điều hướng về trang chủ.
  - Sau khi thanh toán, người dùng kiểm tra lịch sử đơn tại `/profile`.
  - Layout responsive với Bootstrap, slider, icon Font Awesome.

- **Quản trị**
  - Admin có thể cập nhật trạng thái đơn, xem danh sách tất cả đơn, quản lý thông tin người dùng/ sản phẩm.

## API chính (rút gọn)

- **Authentication / User**
  - `POST /auth/login` – đăng nhập (email/số điện thoại).
  - `POST /users/request-reset` – gửi OTP qua email (nếu bật).
  - `GET /users/{id}` – thông tin người dùng.

- **Orders**
  - `POST /orders/create` – tạo đơn hàng từ dữ liệu giỏ hàng.
  - `GET /orders/{orderId}` – chi tiết đơn.
  - `GET /orders/user/{userId}` – danh sách đơn theo người dùng (Profile).
  - `GET /orders/all` – danh sách toàn bộ đơn (Admin).
  - `PUT /orders/{orderId}/status` – cập nhật trạng thái.
  - `PUT /orders/{orderId}/cancel` – huỷ đơn (PENDING).
  - `DELETE /orders/{orderId}` – xoá đơn đã huỷ.

- **Payments**
  - `POST /payment/confirm?orderId={id}&method=COD` – xác nhận giao dịch thủ công, ghi `payments` và chuyển đơn sang `PAID`.
  - `GET /payment/vnpay` – placeholder trả JSON thành công (VNPay đang tạm dừng).
  - `GET /payment/vnpay_return` – placeholder callback.

- **Products / Media**
  - `GET /products`, `GET /products/{id}` – danh sách & chi tiết sản phẩm.
  - `POST /products` – thêm sản phẩm (lưu ảnh lên Cloudinary).
  - `GET /product-images/{productId}` – ảnh sản phẩm.

## Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- **Java**: JDK 21 trở lên
- **Node.js**: v16 trở lên và npm
- **MySQL**: 8.0 trở lên
- **Maven**: 3.6+ (hoặc sử dụng Maven Wrapper)
- **IDE**: IntelliJ IDEA / Eclipse / VS Code (tùy chọn)

### Bước 1: Clone và cấu hình Database

1. **Tạo database MySQL:**
   ```sql
   CREATE DATABASE quanlicuahang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Cấu hình kết nối database** trong `backend/BackEnd/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quanlicuahang?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### Bước 2: Cấu hình các dịch vụ bên ngoài

#### 2.1. Cloudinary (Lưu trữ ảnh)

1. Đăng ký tài khoản tại [cloudinary.com](https://cloudinary.com)
2. Lấy thông tin từ Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Cập nhật trong `application.properties`:
   ```properties
   cloudinary.cloud-name=your_cloud_name
   cloudinary.api-key=your_api_key
   cloudinary.api-secret=your_api_secret
   ```

#### 2.2. Gmail SMTP (Gửi OTP)

1. Tạo App Password cho Gmail:
   - Vào [Google Account](https://myaccount.google.com) → Security
   - Bật 2-Step Verification
   - Tạo App Password
2. Cập nhật trong `application.properties`:
   ```properties
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   ```

#### 2.3. VNPay (Tùy chọn - hiện đang tắt)

Nếu muốn bật lại VNPay, bỏ comment các dòng trong `application.properties`:
```properties
# vnpay.tmn-code=your_tmn_code
# vnpay.hash-secret=your_secret_key
# vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
# vnpay.return-url=http://localhost:8080/payment/vnpay_return
```

### Bước 3: Chạy Backend

#### Cách 1: Sử dụng Maven (Command Line)

```bash
# Di chuyển vào thư mục backend
cd backend/BackEnd

# Build project (lần đầu tiên)
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

#### Cách 2: Sử dụng IDE (IntelliJ IDEA / Eclipse)

1. Mở project trong IDE
2. Tìm file `BackEndApplication.java` trong `src/main/java/com/example/backend/`
3. Click chuột phải → Run `BackEndApplication`
4. Hoặc sử dụng Spring Boot Dashboard (nếu có)

#### Kiểm tra Backend đã chạy

- Mở trình duyệt: `http://localhost:8080/products`
- Nếu thấy JSON response hoặc danh sách sản phẩm → Backend đã chạy thành công

### Bước 4: Chạy Frontend

1. **Cài đặt dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm start
   ```

3. **Truy cập ứng dụng:**
   - Frontend tự động mở tại: `http://localhost:3000`
   - Nếu không tự mở, mở trình duyệt và truy cập thủ công

### Bước 5: Kiểm tra kết nối

1. **Kiểm tra Backend:**
   - API Health: `http://localhost:8080/products` (GET)
   - Nếu lỗi, kiểm tra:
     - MySQL đã chạy chưa?
     - Database `quanlicuahang` đã tạo chưa?
     - Thông tin kết nối trong `application.properties` đúng chưa?

2. **Kiểm tra Frontend:**
   - Mở `http://localhost:3000`
   - Kiểm tra Console (F12) xem có lỗi CORS không
   - Nếu có lỗi CORS, đảm bảo Backend đã chạy và có `@CrossOrigin`

### Bước 6: Tạo tài khoản và sử dụng

1. **Đăng ký tài khoản:**
   - Truy cập `/signup` hoặc `/register`
   - Điền thông tin và tạo tài khoản

2. **Đăng nhập:**
   - Truy cập `/login`
   - Đăng nhập bằng email hoặc số điện thoại

3. **Sử dụng ứng dụng:**
   - Duyệt sản phẩm
   - Thêm vào giỏ hàng
   - Đặt hàng và thanh toán
   - Xem đơn hàng tại `/profile`

### Troubleshooting (Xử lý lỗi thường gặp)

#### Lỗi kết nối Database

```
Error: Access denied for user 'root'@'localhost'
```

**Giải pháp:**
- Kiểm tra username/password trong `application.properties`
- Đảm bảo MySQL đã chạy: `sudo service mysql start` (Linux) hoặc Start MySQL từ Services (Windows)
- Kiểm tra quyền truy cập của user MySQL

#### Lỗi Port đã được sử dụng

```
Error: Port 8080 is already in use
```

**Giải pháp:**
- Tìm process đang dùng port 8080:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  # Linux/Mac
  lsof -i :8080
  ```
- Kill process hoặc đổi port trong `application.properties`:
  ```properties
  server.port=8081
  ```

#### Lỗi CORS

```
Access to fetch at 'http://localhost:8080/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Giải pháp:**
- Đảm bảo Backend đã chạy
- Kiểm tra `@CrossOrigin` trong Controller
- Hoặc cấu hình CORS global trong `SecurityConfig.java`

#### Lỗi npm install

```
npm ERR! code ERESOLVE
```

**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install

# Hoặc dùng --legacy-peer-deps
npm install --legacy-peer-deps
```

#### Lỗi Cloudinary upload

```
Error: Invalid cloud_name
```

**Giải pháp:**
- Kiểm tra thông tin Cloudinary trong `application.properties`
- Đảm bảo đã đăng ký và kích hoạt tài khoản Cloudinary

### Cấu trúc Database tự động

Spring Boot sẽ tự động tạo các bảng khi chạy lần đầu (do cấu hình `spring.jpa.hibernate.ddl-auto=update`). Nếu muốn tạo schema thủ công, có thể:

1. Tắt auto DDL:
   ```properties
   spring.jpa.hibernate.ddl-auto=none
   ```

2. Tạo schema từ file SQL (nếu có trong `db/` folder)

### Môi trường Production

Khi triển khai production, cần:

1. **Backend:**
   - Đổi `spring.jpa.hibernate.ddl-auto=update` → `validate` hoặc `none`
   - Sử dụng environment variables cho sensitive data
   - Bật HTTPS
   - Cấu hình CORS chặt chẽ hơn

2. **Frontend:**
   - Build production: `npm run build`
   - Deploy lên hosting (Vercel, Netlify, hoặc server riêng)
   - Cấu hình API URL qua environment variables

3. **Database:**
   - Sử dụng database production (không dùng localhost)
   - Backup định kỳ
   - Tối ưu indexes

---

**Lưu ý:** Đảm bảo cả Backend và Frontend đều chạy đồng thời để ứng dụng hoạt động đầy đủ.

