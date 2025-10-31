import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/main.css";
import "../../css/util.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  
  // States
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP & Reset Password
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [countdown, setCountdown] = useState(0); // Countdown timer

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    
    try {
      const res = await fetch(
        `http://localhost:8080/auth/forgot-password?emailOrPhone=${encodeURIComponent(emailOrPhone)}`,
        { method: "POST" }
      );
      
      if (res.ok) {
        const text = await res.text();
        setMessage(text);
        setCountdown(300); // 5 minutes countdown
        setStep(2); // Move to step 2
      } else {
        const text = await res.text();
        setError(text);
      }
    } catch (error) {
      setError("Lỗi kết nối đến server: " + error.message);
    }
  };

  // Step 2: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone,
          otpCode: otpCode,
          newPassword: newPassword,
        }),
      });

      if (res.ok) {
        const text = await res.text();
        alert(text);
        navigate("/login"); // Redirect to login page
      } else {
        const text = await res.text();
        setError(text);
      }
    } catch (error) {
      setError("Lỗi kết nối đến server: " + error.message);
    }
  };

  // Format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch(
        `http://localhost:8080/auth/forgot-password?emailOrPhone=${encodeURIComponent(emailOrPhone)}`,
        { method: "POST" }
      );
      
      if (res.ok) {
        const text = await res.text();
        setMessage(text);
        setCountdown(300); // Reset countdown
      } else {
        const text = await res.text();
        setError(text);
      }
    } catch (error) {
      setError("Lỗi kết nối đến server: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="card p-4 shadow" style={{ width: "450px", marginTop: "20px", marginBottom: "20px" }}>
        <h3 className="text-center mb-3">
          {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
        </h3>

        {/* Progress indicator */}
        <div className="mb-4">
          <div className="d-flex justify-content-between">
            <div className={`text-center ${step === 1 ? "text-primary fw-bold" : "text-muted"}`}>
              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step === 1 ? "bg-primary text-white" : "bg-secondary text-white"}`} style={{ width: "30px", height: "30px" }}>
                1
              </div>
              <div className="small mt-1">Gửi OTP</div>
            </div>
            <div className={`text-center ${step === 2 ? "text-primary fw-bold" : "text-muted"}`}>
              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step === 2 ? "bg-primary text-white" : "bg-secondary text-white"}`} style={{ width: "30px", height: "30px" }}>
                2
              </div>
              <div className="small mt-1">Xác nhận</div>
            </div>
          </div>
          <div className="progress mt-2" style={{ height: "4px" }}>
            <div className="progress-bar" style={{ width: step === 1 ? "50%" : "100%" }}></div>
          </div>
        </div>

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

        {/* Countdown timer */}
        {countdown > 0 && step === 2 && (
          <div className="text-center mb-3">
            <div className="alert alert-info py-2">
              Mã OTP còn hiệu lực:{" "}
              <strong style={{ color: "red", fontSize: "1.2em" }}>
                {formatTime(countdown)}
              </strong>
            </div>
          </div>
        )}

        {/* STEP 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-3">
              <label className="form-label">
                Email hoặc Số điện thoại: <span className="text-danger">*</span>
              </label>
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
              <small className="text-muted">
                Mã OTP sẽ được gửi đến email đã đăng ký
              </small>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              <i className="fa fa-paper-plane" style={{ marginRight: "8px" }}></i>
              Gửi mã OTP
            </button>
            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                <i className="fa fa-arrow-left" style={{ marginRight: "4px" }}></i>
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Verify OTP & Reset Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label">
                Email/SĐT:
              </label>
              <input
                type="text"
                className="form-control bg-light"
                value={emailOrPhone}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mã OTP: <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control text-center"
                placeholder="Nhập mã OTP 6 số"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setError("");
                }}
                maxLength="6"
                pattern="\d{6}"
                required
                style={{ letterSpacing: "8px", fontSize: "1.5em" }}
              />
              <small className="text-muted">
                Kiểm tra email của bạn để lấy mã OTP
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mật khẩu mới: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                minLength="8"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Xác nhận mật khẩu: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 mb-3">
              <i className="fa fa-check" style={{ marginRight: "8px" }}></i>
              Đặt lại mật khẩu
            </button>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setCountdown(0);
                  setError(null);
                  setMessage(null);
                }}
              >
                <i className="fa fa-arrow-left" style={{ marginRight: "4px" }}></i>
                Quay lại
              </button>
              <button
                type="button"
                className="btn btn-link text-decoration-none"
                onClick={handleResendOTP}
                disabled={countdown > 0}
              >
                <i className="fa fa-refresh" style={{ marginRight: "4px" }}></i>
                Gửi lại OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
