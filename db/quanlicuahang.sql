DROP DATABASE IF EXISTS quanlicuahang;
CREATE DATABASE quanlicuahang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quanlicuahang;

SET SESSION sql_require_primary_key = 0;

-- 1) ROLES
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

INSERT INTO roles (code, name)
VALUES ('ADMIN', 'Administrator'), ('CUSTOMER', 'Customer'), ('STAFF', 'Staff');

-- 2) USERS
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(150),
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Mẫu: thay bằng bcrypt thực tế khi deploy
INSERT INTO users (username, full_name, email, phone, password_hash)
VALUES 
('admin', 'Admin User', 'admin@shop.com', '0900000001', '27112004'),
('staff1', 'Staff One', 'staff1@shop.com', '0900000002', '27112004'),
('thai', 'Thai Pham', 'thaiphamhuy3@gmail.com', '0900000003', '27112004');

-- 3) USER_ROLES
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO user_roles (user_id, role_id)
VALUES 
(1, 1),
(2, 3),
(3, 2);

-- 4) CUSTOMERS
CREATE TABLE customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  full_name VARCHAR(150),
  address VARCHAR(255),
  CONSTRAINT fk_customers_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO customers (user_id, full_name, address)
VALUES (3, 'John Doe', '123 Nguyễn Trãi, Hà Nội');

-- 5) CATEGORIES (self-reference)
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  parent_id BIGINT NULL,
  CONSTRAINT fk_categories_parent
    FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO categories (name, slug) VALUES 
('Quần áo nam', 'quan-ao-nam'),
('Quần áo nữ', 'quan-ao-nu'),
('Giày', 'giay'),
('Đồng hồ', 'dong-ho');

-- 6) PRODUCTS
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id BIGINT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  stock_qty INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO products (sku, name, description, category_id, price, stock_qty)
VALUES 
('SKU-TSHIRT-01', 'Áo thun nam basic', 'Áo cotton thoáng mát', 1, 2000, 50),
('SKU-DRESS-01', 'Đầm nữ công sở', 'Chất liệu vải cao cấp', 2, 350, 30),
('SKU-SHOE-01', 'Giày sneaker nam', 'Sneaker trắng hot trend', 3, 5000, 20),
('SKU-WATCH-01', 'Đồng hồ nam dây da', 'Phong cách lịch lãm', 4, 1500, 10);

-- 7) PRODUCT_IMAGES
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO product_images (product_id, image_url) VALUES
(1, '/images/products/tshirt1.jpg'),
(2, '/images/products/dress1.jpg'),
(3, '/images/products/shoe1.jpg'),
(4, '/images/products/watch1.jpg');

-- 8) ORDERS
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
  total DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  shipping_address VARCHAR(255),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO orders (customer_id, status, total, shipping_address)
VALUES (1, 'NEW', 900000, '123 Nguyễn Trãi, Hà Nội');

-- 9) ORDER_ITEMS
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES 
(1, 1, 2, 200000),
(1, 3, 1, 500000);

-- 10) PAYMENTS
CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  method VARCHAR(30) NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO payments (order_id, method, amount)
VALUES (1, 'CASH', 900000);

-- Indexes hỗ trợ truy vấn (bổ sung ngoài UNIQUE/PK)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);