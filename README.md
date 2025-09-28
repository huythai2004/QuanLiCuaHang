# QuanLiCuaHang

## Tech Stack
- Frontend: React + Bootstrap
- Backend: Spring Boot (Java 21, REST API, Spring Security JWT)
- Database: MySQL
- Auth: Authentication + Authorization (JWT)

## Cấu trúc
quanlicuahang/
├─ docs/        # Tài liệu (ERD, API spec)
├─ db/          # Database schema + seed
├─ frontend/    # ReactJS project
└─ backend/     # Spring Boot project

## Hướng dẫn chạy local
1. Tạo database `store_mgmt` trong MySQL → chạy file `db/schema.sql` và `db/seed.sql`.
2. Backend:
   ```bash
   cd backend
   mvn spring-boot:run
