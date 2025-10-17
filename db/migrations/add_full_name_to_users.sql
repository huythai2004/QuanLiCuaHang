-- Migration: Add full_name column to users table
-- Date: 2025-10-12
-- Description: Thêm cột full_name vào bảng users để lưu họ và tên người dùng

USE quanlicuahang;

-- Kiểm tra và thêm cột full_name nếu chưa tồn tại
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(150) AFTER username;

-- Cập nhật dữ liệu mẫu cho các user hiện có
UPDATE users SET full_name = 'Admin User' WHERE username = 'admin' AND full_name IS NULL;
UPDATE users SET full_name = 'Staff One' WHERE username = 'staff1' AND full_name IS NULL;
UPDATE users SET full_name = 'Thai Pham' WHERE username = 'thai' AND full_name IS NULL;

-- Hiển thị kết quả
SELECT id, username, full_name, email, phone FROM users;



