import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCart } from "../../contexts/CartContext";
import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setFormData({
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
    });
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Validate data
      if (!formData.fullName || !formData.email) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      // Call API to update user profile
      const response = await fetch(
        `http://localhost:8080/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentUser.id,
            username: currentUser.username,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address || "",
            enabled: currentUser.enabled || true,
            password: "", // Empty string để backend không update password
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();

        // Update localStorage with new data
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        const newUserData = {
          ...storedUser,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
        };
        localStorage.setItem("currentUser", JSON.stringify(newUserData));

        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);

        // Reload page to update context
        window.location.reload();
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã có lỗi xảy ra khi cập nhật thông tin" + error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    try {
      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Đã có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      navigate("/");
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg0 p-t-100 p-b-85">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 m-b-30">
            <div className="bor10 p-all-25 bg-white">
              <div className="text-center p-b-20 bor12">
                <div
                  className="wrap-pic-w size-200 bor10 of-hidden m-lr-auto m-b-15"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #10c4e8ff 0%, #b4d435ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "40px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {currentUser.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="mtext-111 cl2">
                  {currentUser.fullName || currentUser.username}
                </h3>
                <p className="stext-111 cl6">{currentUser.email}</p>
              </div>

              <nav className="p-t-20">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex-l-m p-lr-20 p-tb-10 m-b-10 trans-04 ${
                    activeTab === "profile" ? "bg3 cl0" : "bg8 hov-btn3"
                  }`}
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <i className="fa fa-user m-r-10"></i>
                  <span className="stext-101">Thông tin cá nhân</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex-l-m p-lr-20 p-tb-10 m-b-10 trans-04 ${
                    activeTab === "orders" ? "bg3 cl0" : "bg8 hov-btn3"
                  }`}
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <i className="fa fa-shopping-bag m-r-10"></i>
                  <span className="stext-101">Đơn hàng của tôi</span>
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex-l-m p-lr-20 p-tb-10 m-b-10 trans-04 ${
                    activeTab === "wishlist" ? "bg3 cl0" : "bg8 hov-btn3"
                  }`}
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <i className="fa fa-heart m-r-10"></i>
                  <span className="stext-101">Yêu thích</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex-l-m p-lr-20 p-tb-10 m-b-10 trans-04 ${
                    activeTab === "security" ? "bg3 cl0" : "bg8 hov-btn3"
                  }`}
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <i className="fa fa-lock m-r-10"></i>
                  <span className="stext-101">Bảo mật</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex-l-m p-lr-20 p-tb-10 bg8 hov-btn3 trans-04"
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                    color: "#dc3545",
                  }}
                >
                  <i className="fa fa-sign-out m-r-10"></i>
                  <span className="stext-101">Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="bor10 p-all-30 bg-white">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex-w flex-sb-m p-b-30">
                    <h2 className="mtext-109 cl2">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer"
                      >
                        <i className="fa fa-edit m-r-10"></i>
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex-w" style={{ gap: "10px" }}>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-c-m stext-101 cl2 bor13 hov-btn3 trans-04 pointer"
                          style={{
                            width: "120px",
                            height: "45px",
                            backgroundColor: "#296befff",
                            border: "1px solid #e6e6e6",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="fa fa-times m-r-8"></i>
                          Hủy
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                          style={{
                            width: "120px",
                            height: "45px",
                            backgroundColor: "red",
                            border: "none",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="fa fa-save m-r-8"></i>
                          Lưu
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-12 p-b-20">
                      <label className="stext-111 cl2 p-b-10">Tên đầy đủ</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`stext-111 cl2 plh3 size-111 bor8 p-lr-15 ${
                          isEditing ? "" : "bg-light"
                        }`}
                      />
                    </div>

                    <div className="col-md-12 p-b-20">
                      <label className="stext-111 cl2 p-b-10">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`stext-111 cl2 plh3 size-111 bor8 p-lr-15 ${
                          isEditing ? "" : "bg-light"
                        }`}
                      />
                    </div>

                    <div className="col-md-12 p-b-20">
                      <label className="stext-111 cl2 p-b-10">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`stext-111 cl2 plh3 size-111 bor8 p-lr-15 ${
                          isEditing ? "" : "bg-light"
                        }`}
                      />
                    </div>

                    {/* TODO: Update address */}
                    <div className="col-md-12 p-b-20">
                      <label className="stext-111 cl2 p-b-10">Địa chỉ</label>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`stext-111 cl2 plh3 size-111 bor8 p-lr-15 ${
                          isEditing ? "" : "bg-light"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="text-center p-t-40 p-b-40">
                  <i className="fa fa-shopping-bag fa-5x cl6 m-b-20"></i>
                  <h3 className="mtext-111 cl2 p-b-10">
                    Xem tất cả đơn hàng của bạn
                  </h3>
                  <button
                    onClick={() => navigate("/my-orders")}
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  >
                    <i className="fa fa-list m-r-10"></i>
                    Xem đơn hàng
                  </button>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="mtext-109 cl2 p-b-30">
                    <i className="fa fa-heart m-r-10"></i>
                    Danh sách yêu thích ({wishlistItems.length})
                  </h2>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center p-t-40 p-b-40">
                      <i className="fa fa-heart-o fa-5x cl6 m-b-20"></i>
                      <h3 className="mtext-111 cl2 p-b-10">
                        Chưa có sản phẩm yêu thích
                      </h3>
                      <p className="stext-111 cl6 p-b-20">
                        Hãy thêm sản phẩm vào danh sách yêu thích của bạn
                      </p>
                      <button
                        onClick={() => navigate("/products")}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer m-lr-auto"
                      >
                        <i className="fa fa-shopping-cart m-r-10"></i>
                        Khám phá sản phẩm
                      </button>
                    </div>
                  ) : (
                    <div className="row">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="col-md-6 col-lg-4 p-b-30">
                          <div
                            className="bor10 bg-white trans-04"
                            style={{ overflow: "hidden" }}
                          >
                            {/* Product Image */}
                            <div
                              className="wrap-pic-w hov-img0"
                              style={{
                                height: "300px",
                                overflow: "hidden",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              <img
                                src={
                                  item.image ||
                                  require("../../images/product-01.jpg")
                                }
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src = require("../../images/product-01.jpg");
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="p-all-20">
                              <h4
                                className="stext-104 cl4 hov-cl1 trans-04 p-b-10"
                                style={{
                                  cursor: "pointer",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "48px",
                                }}
                                onClick={() => navigate(`/product/${item.id}`)}
                              >
                                {item.name}
                              </h4>

                              <div className="flex-w flex-sb-m p-b-15">
                                <span
                                  className="mtext-106"
                                  style={{
                                    color: "#e65540",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {item.price.toLocaleString("vi-VN")}
                                  <span style={{ fontSize: "0.85em" }}>đ</span>
                                </span>
                              </div>

                              {/* Action Buttons */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                }}
                              >
                                <button
                                  className="flex-c-m stext-101 cl0 bg3 bor14 hov-btn3 trans-04 pointer"
                                  style={{
                                    width: "100%",
                                    height: "45px",
                                    border: "none",
                                    fontSize: "14px",
                                  }}
                                  onClick={() => {
                                    // Add to cart logic
                                    const productData = {
                                      ...item,
                                      primary_image: item.image,
                                    };
                                    // You might want to show size/color selection first
                                    navigate(`/product/${item.id}`);
                                  }}
                                >
                                  <i className="fa fa-shopping-cart m-r-8"></i>
                                  Thêm vào giỏ
                                </button>

                                <button
                                  className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                                  style={{
                                    width: "100%",
                                    height: "45px",
                                    backgroundColor: "#dc3545",
                                    border: "none",
                                    fontSize: "14px",
                                  }}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Xóa "${item.name}" khỏi danh sách yêu thích?`
                                      )
                                    ) {
                                      removeFromWishlist(item.id);
                                      if (window.swal) {
                                        window.swal(
                                          "Đã xóa!",
                                          `${item.name} đã được xóa khỏi danh sách yêu thích`,
                                          "success"
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <i className="fa fa-trash m-r-8"></i>
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="mtext-109 cl2 p-b-30">Đổi mật khẩu</h2>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="p-b-20">
                        <label className="stext-111 cl2 p-b-10">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="stext-111 cl2 plh3 size-111 bor8 p-lr-15"
                        />
                      </div>

                      <div className="p-b-20">
                        <label className="stext-111 cl2 p-b-10">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="stext-111 cl2 plh3 size-111 bor8 p-lr-15"
                        />
                      </div>

                      <div className="p-b-20">
                        <label className="stext-111 cl2 p-b-10">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="stext-111 cl2 plh3 size-111 bor8 p-lr-15"
                        />
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer w-full"
                      >
                        <i className="fa fa-key m-r-10"></i>
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
