import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ onSwitchToSignup }) {
  // State lưu giá trị email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hàm xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi dữ liệu login (sau này gọi API backend Spring Boot)
    console.log("Email:", email);
    console.log("Password:", password);

    // Giả lập check
    if (email === "admin@example.com" && password === "123456") {
      alert("Đăng nhập thành công!");
    } else {
      alert("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Đăng nhập</h3>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Mật khẩu:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Đăng nhập
          </button>

          {/* Link to signup */}
          <div className="text-center">
            <small className="text-muted">
              Chưa có tài khoản?{" "}
              <button 
                type="button" 
                className="btn btn-link p-0 text-decoration-none"
                onClick={onSwitchToSignup}
              >
                Đăng ký ngay
              </button>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
