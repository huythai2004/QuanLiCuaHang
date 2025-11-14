# Hướng Dẫn Hệ Thống Thanh Toán VNPay

## Tổng Quan

Hệ thống thanh toán VNPay đã được tích hợp đầy đủ vào ứng dụng, cho phép khách hàng thanh toán đơn hàng một cách an toàn và tiện lợi.

## Luồng Thanh Toán

### 1. Tạo Đơn Hàng
- Người dùng thêm sản phẩm vào giỏ hàng
- Tại trang giỏ hàng (`/cart`), nhấn nút "Thanh toán"
- Hệ thống tự động tạo đơn hàng mới với trạng thái `PENDING`
- API: `POST /orders/create`

```json
{
  "userId": 1,
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "shippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "total": 1500000,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 500000,
      "size": "M",
      "color": "Đỏ"
    }
  ]
}
```

### 2. Trang Thanh Toán
- Sau khi tạo đơn hàng, người dùng được chuyển đến trang thanh toán (`/payment?orderId=xxx`)
- Hiển thị thông tin đơn hàng:
  - Mã đơn hàng
  - Thông tin khách hàng
  - Danh sách sản phẩm
  - Tổng tiền
  - Địa chỉ giao hàng

### 3. Thanh Toán VNPay
- Người dùng nhấn nút "Thanh toán qua VNPay"
- Hệ thống gọi API tạo URL thanh toán VNPay
- API: `GET /payment/vnpay?orderId={orderId}&amount={amount}`
- Người dùng được chuyển đến cổng thanh toán VNPay

### 4. Xử Lý Kết Quả
- Sau khi thanh toán tại VNPay, người dùng được chuyển về
- URL return: `http://localhost:8080/payment/vnpay_return`
- Hệ thống xác thực chữ ký và lưu thông tin thanh toán
- Cập nhật trạng thái đơn hàng:
  - Thành công: `PAID`
  - Thất bại: `PENDING` (giữ nguyên)

### 5. Hiển Thị Kết Quả
- **Thành công**: Hiển thị màn hình "Thanh toán thành công" với 2 tùy chọn:
  - Xem đơn hàng của tôi
  - Về trang chủ
- **Thất bại**: Hiển thị màn hình "Thanh toán thất bại" với tùy chọn "Thử lại"

## Cấu Trúc Backend

### Entities

#### Order (orders table)
```java
- id: Long (PK)
- customerId: Long (FK -> customers)
- orderDate: LocalDateTime
- status: String (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- total: BigDecimal
- shippingAddress: String
```

#### Order_Items (order_items table)
```java
- id: Long (PK)
- orderId: Long (FK -> orders)
- productId: Long (FK -> products)
- quantity: Integer
- unitPrice: BigDecimal
- lineTotal: BigDecimal
```

#### Payments (payments table)
```java
- id: Long (PK)
- orderId: Long (FK -> orders)
- method: String (VNPAY)
- amount: BigDecimal
- transactionNo: String
- bankCode: String
- status: String (SUCCESS, FAILED)
- paidAt: LocalDateTime
```

### APIs

#### 1. Tạo Đơn Hàng
```
POST /orders/create
Content-Type: application/json

Request Body: CreateOrderRequest
Response: { "success": true, "orderId": 123, "message": "..." }
```

#### 2. Lấy Chi Tiết Đơn Hàng
```
GET /orders/{orderId}

Response: OrderDetailResponse
```

#### 3. Lấy Đơn Hàng Của User
```
GET /orders/user/{userId}

Response: List<OrderDetailResponse>
```

#### 4. Tạo URL Thanh Toán VNPay
```
GET /payment/vnpay?orderId={orderId}&amount={amount}

Response: String (VNPay payment URL)
```

#### 5. Xử Lý Return Từ VNPay
```
GET /payment/vnpay_return?vnp_ResponseCode=...&vnp_TxnRef=...&...

Response: { "status": "success|failed|error", "orderId": 123, "message": "..." }
```

#### 6. Cập Nhật Trạng Thái Đơn Hàng
```
PUT /orders/{orderId}/status
Content-Type: application/json

Request Body: { "status": "PAID" }
Response: { "success": true, "message": "..." }
```

## Cấu Trúc Frontend

### Components

#### 1. Cart.jsx (`/cart`)
- Hiển thị giỏ hàng
- Tính tổng tiền (bao gồm phí vận chuyển)
- Nút thanh toán tạo đơn hàng và chuyển đến trang payment

#### 2. Payment.jsx (`/payment`)
- Hiển thị thông tin đơn hàng
- Nút thanh toán VNPay
- Xử lý kết quả thanh toán từ VNPay
- Hiển thị thông báo thành công/thất bại

#### 3. UserOrders.jsx (`/my-orders`)
- Danh sách tất cả đơn hàng của user
- Trạng thái đơn hàng với màu sắc tương ứng
- Nút xem chi tiết và thanh toán (nếu còn PENDING)

#### 4. OrderDetail.jsx (`/order-detail/:orderId`)
- Chi tiết đơn hàng
- Thông tin sản phẩm
- Thông tin thanh toán (nếu có)
- Địa chỉ giao hàng

## Cấu Hình VNPay

File: `backend/BackEnd/src/main/resources/application.properties`

```properties
vnpay.tm-code=5BALQ5VL
vnpay.hash-secret=JMJM9SEIGAYHSFHCQQ9RAVE7UDLLCUGH
vnpay.url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:8080/payment/vnpay_return
```

**Lưu ý**: Đây là cấu hình môi trường Sandbox (Development). Khi triển khai Production, cần thay đổi:
- `vnpay.tm-code`: Mã merchant thật
- `vnpay.hash-secret`: Secret key thật
- `vnpay.url`: URL production của VNPay
- `vnpay.return-url`: URL production của ứng dụng

## Các Trạng Thái Đơn Hàng

| Trạng thái | Mô tả | Màu sắc |
|-----------|-------|---------|
| PENDING | Chờ thanh toán | Vàng |
| PAID | Đã thanh toán | Xanh dương |
| PROCESSING | Đang xử lý | Tím |
| SHIPPED | Đang giao hàng | Tím đậm |
| DELIVERED | Đã giao hàng | Xanh lá |
| CANCELLED | Đã hủy | Đỏ |

## User Management

### User Profile (`/profile`)
- Thông tin cá nhân
- Đổi mật khẩu
- Xem đơn hàng
- Danh sách yêu thích

### User Orders (`/my-orders`)
- Danh sách tất cả đơn hàng
- Lọc theo trạng thái
- Xem chi tiết
- Thanh toán lại (nếu PENDING)

## Admin Dashboard

### Truy cập
URL: `/admin`

**Lưu ý**: Hiện tại chưa có kiểm tra role admin. Cần implement:
```java
// Trong AdminDashboard.jsx
if (currentUser.role !== 'ADMIN') {
  navigate('/');
  return;
}
```

### Các tính năng

#### 1. Tổng quan (`/admin`)
- Thống kê tổng quan:
  - Tổng đơn hàng
  - Doanh thu
  - Số người dùng
  - Số sản phẩm
- Đơn hàng gần đây

#### 2. Quản lý đơn hàng
- Danh sách tất cả đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem chi tiết đơn hàng
- Tìm kiếm và lọc

#### 3. Quản lý sản phẩm (Đang phát triển)
- Thêm/sửa/xóa sản phẩm
- Quản lý danh mục
- Quản lý hình ảnh

#### 4. Quản lý người dùng (Đang phát triển)
- Danh sách người dùng
- Phân quyền
- Khóa/mở khóa tài khoản

#### 5. Phản hồi khách hàng (Đang phát triển)
- Xem đánh giá sản phẩm
- Trả lời feedback

## Kiểm Tra và Test

### Test Thanh Toán VNPay Sandbox

Thông tin test card:
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Luồng Test

1. Đăng nhập vào hệ thống
2. Thêm sản phẩm vào giỏ hàng
3. Vào trang giỏ hàng: `http://localhost:3000/cart`
4. Nhấn "Thanh toán"
5. Kiểm tra thông tin đơn hàng tại trang Payment
6. Nhấn "Thanh toán qua VNPay"
7. Tại cổng VNPay Sandbox:
   - Chọn ngân hàng NCB
   - Nhập thông tin test card
   - Xác nhận thanh toán
8. Kiểm tra kết quả:
   - Thành công: Hiển thị màn hình success
   - Thất bại: Hiển thị màn hình failed
9. Vào "Đơn hàng của tôi" để xem đơn hàng đã thanh toán

## Bảo Mật

### Backend
- Xác thực chữ ký VNPay (HMAC SHA512)
- Validate dữ liệu đầu vào
- Transaction logging

### Frontend
- Validate form trước khi submit
- Không lưu trữ thông tin thanh toán
- HTTPS (khi deploy production)

## Triển Khai Production

### Backend
1. Cập nhật `application.properties`:
   - Thông tin VNPay production
   - Database production
   - Return URL production

2. Build project:
```bash
cd backend/BackEnd
mvn clean package
java -jar target/BackEnd-0.0.1-SNAPSHOT.jar
```

### Frontend
1. Cập nhật API URLs trong các component
2. Build production:
```bash
cd frontend
npm run build
```

3. Deploy static files lên server (Netlify, Vercel, etc.)

## Troubleshooting

### Lỗi thường gặp

**1. Không tạo được đơn hàng**
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra giỏ hàng có sản phẩm không
- Xem log backend

**2. Không chuyển được đến VNPay**
- Kiểm tra cấu hình VNPay trong application.properties
- Kiểm tra network log trong browser
- Xem response từ API `/payment/vnpay`

**3. Thanh toán thành công nhưng không cập nhật trạng thái**
- Kiểm tra return URL có đúng không
- Xem log tại API `/payment/vnpay_return`
- Kiểm tra chữ ký VNPay có hợp lệ không

**4. Không xem được đơn hàng**
- Kiểm tra userId có đúng không
- Kiểm tra API `/orders/user/{userId}`
- Xem database có dữ liệu không

## Tài Liệu Tham Khảo

- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Router Documentation](https://reactrouter.com/)

## Liên Hệ và Hỗ Trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.


