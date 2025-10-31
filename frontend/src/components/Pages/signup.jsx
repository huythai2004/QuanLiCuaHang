import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    try {
      await register(formData);
      alert("Bạn đã đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="card p-4 shadow" style={{ width: "400px", marginTop: "20px", marginBottom: "20px" }}>
        <h3 className="text-center mb-3">Đăng ký</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập: <span className="text-danger">*</span></label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Họ và tên: <span className="text-danger">*</span></label>
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
            <label className="form-label">Email: <span className="text-danger">*</span></label>
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
            <label className="form-label">Số điện thoại: <span className="text-danger">*</span></label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10,11}"
              title="Số điện thoại phải có 10-11 chữ số"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu: <span className="text-danger">*</span></label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu: <span className="text-danger">*</span></label>
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
              <Link to="/login" className="text-decoration-none">
                Đăng nhập ngay
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
