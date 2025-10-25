import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State lưu giá trị email/phone & password
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Attempt to login
      const success = await login(emailOrPhone, password);
      
      if (success) {
        alert("Đăng nhập thành công!");
        navigate("/"); // Redirect to home page
      } else {
        setError("Bạn đã điền sai email/số điện thoại hoặc mật khẩu, vui lòng nhập lại!");
      }
    } catch (error) {
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Đăng nhập</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div className="mb-3">
            <label className="form-label">Email hoặc Số điện thoại:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập email hoặc số điện thoại"
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setError("");
              }}
              required
            />
            {/* <small className="form-text text-muted">
              Bạn có thể đăng nhập bằng email hoặc số điện thoại
            </small> */}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Mật khẩu:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>
          
          <Link to={"/resetpassword"} style={{padding:"20px", margin:"auto"}}>Quên mật khẩu?</Link>
          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Đăng nhập
          </button>

          {/* Link to signup */}
          <div className="text-center">
            <small className="text-muted">
              Chưa có tài khoản?{" "}
              <Link to="/signup" className="text-decoration-none">
                Đăng ký ngay
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
