# QuanLyCuaHang

Ứng dụng quản lý cửa hàng với kiến trúc tách biệt Frontend (React) và Backend (Spring Boot). Dự án hỗ trợ từ quản lý sản phẩm, đặt hàng, thanh toán đến quản trị người dùng.

## Công nghệ chính

- **Backend**
  - Java 17, Spring Boot.
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

## Thiết lập môi trường

### 1. Backend

1. Cập nhật database trong `backend/BackEnd/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quanlicuahang
   spring.datasource.username=<your_user>
   spring.datasource.password=<your_password>
   ```
2. Cấu hình các biến Cloudinary, SMTP Gmail và (nếu cần) `vnpay.*`.
3. Chạy ứng dụng Spring Boot:
   ```bash
   cd backend/BackEnd
   mvn spring-boot:run
   # hoặc chạy BackEndApplication từ IDE
   ```

### 2. Frontend

```bash
cd frontend
npm install
npm start   # chạy tại http://localhost:3000
```

Frontend mặc định gọi API backend tại `http://localhost:8080`. Nếu backend chạy ở host khác, cập nhật các URL `fetch` trong code hoặc thiết lập biến môi trường.

