import React, { useState } from "react";
import "../../css/main.css";
import "../../css/util.css";
import Email from "../../images/icons/icon-email.png";
import Images from "../../images/bg-01.jpg";

export default function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ!");
      setLoading(false);
      return;
    }

    if (!formData.message || formData.message.trim().length < 10) {
      setError("Nội dung tin nhắn phải có ít nhất 10 ký tự!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message || "Tin nhắn của bạn đã được gửi thành công!");
        // Reset form
        setFormData({
          email: "",
          message: "",
        });
      } else {
        setError(data.message || "Đã có lỗi xảy ra khi gửi tin nhắn!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Lỗi kết nối đến server. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Title page */}
      <section
        className="bg-img1 txt-center p-lr-15 p-tb-92"
        style={{ backgroundImage: `url(${Images})` }}
      >
        <h2 className="ltext-105 cl0 txt-center">Contact</h2>
      </section>

      {/*  Content page  */}
      <section className="bg0 p-t-104 p-b-116">
        <div className="container">
          <div className="flex-w flex-tr">
            <div className="size-210 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md">
              <div>
                <h4 className="mtext-105 cl2 txt-center p-b-30">
                  Send Us A Message
                </h4>

                {error && (
                  <div
                    className="alert alert-danger m-b-20"
                    role="alert"
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      padding: "12px 20px",
                      borderRadius: "5px",
                      border: "1px solid #f5c6cb",
                    }}
                  >
                    <i className="fa fa-exclamation-triangle m-r-8"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="alert alert-success m-b-20"
                    role="alert"
                    style={{
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      padding: "12px 20px",
                      borderRadius: "5px",
                      border: "1px solid #c3e6cb",
                    }}
                  >
                    <i className="fa fa-check-circle m-r-8"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="bor8 m-b-20 how-pos4-parent">
                    <input
                      className="stext-111 cl2 plh3 size-116 p-l-62 p-r-30"
                      type="email"
                      name="email"
                      placeholder="Your Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <img
                      className="how-pos4 pointer-none"
                      src={Email}
                      alt="ICON"
                    />
                  </div>

                  <div className="bor8 m-b-30">
                    <textarea
                      className="stext-111 cl2 plh3 size-120 p-lr-28 p-tb-25"
                      name="message"
                      placeholder="How Can We Help?"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      minLength="10"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer"
                    disabled={loading}
                    style={{
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="fa fa-spinner fa-spin m-r-8"></i>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-paper-plane m-r-8"></i>
                        Submit
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md">
              <div className="flex-w w-full p-b-42">
                <span className="fs-18 cl5 txt-center size-211">
                  <span className="lnr lnr-map-marker"></span>
                </span>

                <div className="size-212 p-t-2">
                  <span className="mtext-110 cl2">Address</span>

                  <p className="stext-115 cl6 size-213 p-t-18">
                    Coza Store Center FPT University, Hoa Lac, Ha Noi, VN
                  </p>
                </div>
              </div>

              <div className="flex-w w-full p-b-42">
                <span className="fs-18 cl5 txt-center size-211">
                  <span className="lnr lnr-phone-handset"></span>
                </span>

                <div className="size-212 p-t-2">
                  <span className="mtext-110 cl2">Lets Talk</span>

                  <p className="stext-115 cl1 size-213 p-t-18">
                    +1 800 1236879
                  </p>
                </div>
              </div>

              <div className="flex-w w-full">
                <span className="fs-18 cl5 txt-center size-211">
                  <span className="lnr lnr-envelope"></span>
                </span>

                <div className="size-212 p-t-2">
                  <span className="mtext-110 cl2">Sale Support</span>

                  <p className="stext-115 cl1 size-213 p-t-18">
                    thaiphamhuy3@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
