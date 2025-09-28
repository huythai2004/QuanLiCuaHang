import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    console.log("Đăng ký:", formData);
    alert("Đăng ký thành công!");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Đăng ký</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu:</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 mb-3">
            Đăng ký
          </button>

          {/* Link to login */}
          <div className="text-center">
            <small className="text-muted">
              Đã có tài khoản?{" "}
              <button 
                type="button" 
                className="btn btn-link p-0 text-decoration-none"
                onClick={onSwitchToLogin}
              >
                Đăng nhập ngay
              </button>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
