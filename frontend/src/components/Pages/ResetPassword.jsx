import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/main.css";
import "../../css/util.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  // const { resetPassword } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [coutdown, setCoutdown] = useState(0) // set time reset

  useEffect (() => {
    if (coutdown <= 0) return;
    const timer = setInterval(() => {
      setCoutdown((prev) => prev -1);

    }, 1000);
    return () => clearInterval(timer);
  }, [coutdown]);

  const handleSubmit = async (e) => {
    setMessage(null);
    setError(null);
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/auth/forgot-password?email=${emailOrPhone}`,
        {
          method:"POST",

        }
      );
      if (res.ok){
        setMessage ("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email hoặc tin nhắn của bạn.");
        setCoutdown(30); // reset time when send success
      } else {
        const text = await res.text();
        setError("Không tìm thấy tài khoản hoặc lỗi kết nối Server: " + text);
      }
    } catch (error) {
      setError("Lỗi kết nối đến server!" +error.message);
    }  
  };

  //function formate mm:ss 
  const formatTime = (seconds) => {
    const m = Math.floor(seconds/60)
    .toString()
    .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Đặt lại mật khẩu</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}

        {/* Set time reset */}
        {coutdown > 0 && (
          <div className="text-center mb-3 text-muted">
            Mã OTP sẽ hết hạn sau {" "}
            <strong style={{color: "red"}}>{formatTime(coutdown)}</strong>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
                setMessage("");
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Gửi yêu cầu đặt lại mật khẩu
          </button>
          <div className="text-center">
            <Link to={"/login"}>Quay lại đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
