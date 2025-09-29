-- Tạo database
DROP DATABASE IF EXISTS quanlicuahang;
CREATE DATABASE quanlicuahang
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quanlicuahang;

-- 1) ROLES
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE, -- ADMIN, CUSTOMER, STAFF
  name VARCHAR(100) NOT NULL
);
-- Roles
INSERT INTO roles (code, name)
VALUES ('ADMIN', 'Administrator'), ('CUSTOMER', 'Customer'), ('STAFF', 'Staff');

-- 2) USERS
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL, -- Bcrypt
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users (password_hash: giả lập, bạn thay bằng Bcrypt thực tế)
INSERT INTO users (username, email, phone, password_hash)
VALUES 
('admin', 'admin@shop.com', '0900000001', '27112004'),
('staff1', 'staff1@shop.com', '0900000002', '27112004'),
('thai', 'thaiphamhuy3@gmail.com', '0900000003', '27112004');

-- 3) USER_ROLES
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Gán role cho user
INSERT INTO user_roles (user_id, role_id)
VALUES 
(1, 1), -- admin → ADMIN
(2, 3), -- staff1 → STAFF
(3, 2); -- john → CUSTOMER

-- 4) CUSTOMERS (thông tin chi tiết khi user là khách hàng)
CREATE TABLE customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  full_name VARCHAR(150),
  address VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Customers
INSERT INTO customers (user_id, full_name, address)
VALUES (3, 'John Doe', '123 Nguyễn Trãi, Hà Nội');

-- 5) CATEGORIES
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  parent_id BIGINT,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);
-- Categories
INSERT INTO categories (name, slug) VALUES 
('Quần áo nam', 'quan-ao-nam'),
('Quần áo nữ', 'quan-ao-nu'),
('Giày', 'giay'),
('Đồng hồ', 'dong-ho');

-- 6) PRODUCTS
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(64) NOT NULL UNIQUE,     -- mã sản phẩm
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id BIGINT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  stock_qty INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
-- Products
INSERT INTO products (sku, name, description, category_id, price, stock_qty)
VALUES 
('SKU-TSHIRT-01', 'Áo thun nam basic', 'Áo cotton thoáng mát', 1, 200000, 50),
('SKU-DRESS-01', 'Đầm nữ công sở', 'Chất liệu vải cao cấp', 2, 350000, 30),
('SKU-SHOE-01', 'Giày sneaker nam', 'Sneaker trắng hot trend', 3, 500000, 20),
('SKU-WATCH-01', 'Đồng hồ nam dây da', 'Phong cách lịch lãm', 4, 1500000, 10);

-- 7) PRODUCT_IMAGES (mỗi sản phẩm có thể có nhiều hình ảnh)
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Product Images
INSERT INTO product_images (product_id, image_url) VALUES
(1, '/images/products/tshirt1.jpg'),
(2, '/images/products/dress1.jpg'),
(3, '/images/products/shoe1.jpg'),
(4, '/images/products/watch1.jpg');

-- 8) ORDERS (hóa đơn/đơn hàng)
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW', -- NEW|PAID|SHIPPED|CANCELLED
  total DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  shipping_address VARCHAR(255),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Orders
INSERT INTO orders (customer_id, status, total, shipping_address)
VALUES (1, 'NEW', 900000, '123 Nguyễn Trãi, Hà Nội');

-- 9) ORDER_ITEMS
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,  -- đổi tên ở đây
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES 
(1, 1, 2, 200000), -- 2 áo thun nam
(1, 3, 1, 500000); -- 1 đôi giày sneaker

-- 10) PAYMENTS
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  method VARCHAR(30) NOT NULL,  -- CASH|CARD|MOMO|ZALOPAY
  amount DECIMAL(14,2) NOT NULL,
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
-- Payment
INSERT INTO payments (order_id, method, amount)
VALUES (1, 'CASH', 900000);
------------------------------------------------------
-- 🔹 DỮ LIỆU MẪU (INSERT)
------------------------------------------------------
