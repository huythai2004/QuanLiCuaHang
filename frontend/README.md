# Ứng dụng Quản Lý Cửa Hàng - Frontend

Ứng dụng React.js để quản lý cửa hàng với giao diện đăng nhập và đăng ký.

## Tính năng

- Đăng nhập người dùng
- Đăng ký tài khoản mới
- Giao diện responsive với Bootstrap
- Chuyển đổi giữa các form đăng nhập/đăng ký
- Validation form cơ bản

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy ứng dụng:

```bash
npm start
```

3. Mở trình duyệt tại: `http://localhost:3000`

## Cấu trúc dự án

```
src/
├── components/
│   ├── Login.js          # Component đăng nhập
│   └── signup.js         # Component đăng ký
├── App.js                # Component chính
├── App.css               # Styles chính
├── index.js              # Entry point
└── index.css             # Global styles

public/
├── index.html            # HTML template
├── manifest.json         # PWA manifest
├── robots.txt            # SEO robots
└── favicon.ico           # Website icon
```

## Sử dụng

### Đăng nhập

- Email: `admin@example.com`
- Password: `123456`

### Đăng ký

- Điền đầy đủ thông tin trong form đăng ký
- Mật khẩu xác nhận phải khớp với mật khẩu

## Công nghệ sử dụng

- **React 19.1.1** - Framework chính
- **Bootstrap 5.3.8** - UI framework
- **React Router DOM 7.9.1** - Routing
- **Axios 1.12.2** - HTTP client

## Phát triển tiếp

- [ ] Kết nối với API backend
- [ ] Thêm dashboard quản lý
- [ ] Quản lý sản phẩm
- [ ] Quản lý đơn hàng
- [ ] Báo cáo thống kê
