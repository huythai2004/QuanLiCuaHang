import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../../fonts/iconic/css/material-design-iconic-font.min.css";

export default function Cart() {
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      if (window.confirm("Bạn cần đăng nhập để xem giỏ hàng. Chuyển đến trang đăng nhập?")) {
        navigate("/login");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleQuantityChange = (item, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (qty > 0 && qty <= item.stock_qty) {
      updateQuantity(item.id, item.size, item.color, qty);
    }
  };

  const handleRemoveItem = (item) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
      removeFromCart(item.id, item.size, item.color);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // TODO: Implement coupon logic
      alert("Chức năng áp dụng mã giảm giá đang được phát triển!");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    try {
      // Prepare order data
      const shippingFee = getTotalPrice() >= 1000000 ? 0 : 30000;
      const totalAmount = getTotalPrice() + shippingFee;

      const orderData = {
        userId: currentUser.id,
        fullName: currentUser.fullName || currentUser.username,
        phone: currentUser.phone || "",
        shippingAddress: "Địa chỉ mặc định", // TODO: Get from user input
        total: totalAmount,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          size: item.size,
          color: item.color
        }))
      };

      // Create order
      const response = await fetch("http://localhost:8080/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Navigate to payment page with orderId
        navigate(`/payment?orderId=${result.orderId}`);
      } else {
        alert("Lỗi khi tạo đơn hàng: " + result.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="container">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="stext-109 cl8 hov-cl1 trans-04"
          >
            Trang Chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </a>
          <span className="stext-109 cl4">Giỏ Hàng</span>
        </div>
      </div>

      {/* Shopping Cart */}
      <form className="bg0 p-t-75 p-b-85">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
              <div className="m-l-25 m-r--38 m-lr-0-xl">
                <div className="wrap-table-shopping-cart">
                  {cartItems.length === 0 ? (
                    <div className="text-center p-t-50 p-b-50">
                      <h4 className="mtext-109 cl5">Giỏ hàng của bạn đang trống</h4>
                      <button
                        className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer m-t-20"
                        onClick={() => navigate("/products")}
                      >
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  ) : (
                    <table className="table-shopping-cart">
                      <thead>
                        <tr className="table_head">
                          <th className="column-1">Sản phẩm</th>
                          <th className="column-2"></th>
                          <th className="column-3">Giá</th>
                          <th className="column-4">Số lượng</th>
                          <th className="column-5">Tổng</th>
                          <th className="column-6"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, index) => (
                          <tr key={`${item.id}-${item.size}-${item.color}`} className="table_row">
                            <td className="column-1">
                              <div className="how-itemcart1">
                                <img
                                  src={item.image || require("../../images/product-01.jpg")}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src = require("../../images/product-01.jpg");
                                  }}
                                />
                              </div>
                            </td>
                            <td className="column-2">
                              <div>
                                <div className="stext-105 cl3">{item.name}</div>
                                {item.size && (
                                  <div className="stext-107 cl6 p-t-5">
                                    Kích thước: {item.size}
                                  </div>
                                )}
                                {item.color && (
                                  <div className="stext-107 cl6">
                                    Màu sắc: {item.color}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="column-3" style={{ color: '#e65540' }}>
                              {item.price.toLocaleString('vi-VN')}
                              <span style={{ fontSize: '0.85em' }}>đ</span>
                            </td>
                            <td className="column-4">
                              <div className="wrap-num-product flex-w m-l-auto m-r-0">
                                <div
                                  className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                >
                                  <i className="fs-16 zmdi zmdi-minus"></i>
                                </div>

                                <input
                                  className="mtext-104 cl3 txt-center num-product"
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                                  min="1"
                                  max={item.stock_qty}
                                />

                                <div
                                  className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                >
                                  <i className="fs-16 zmdi zmdi-plus"></i>
                                </div>
                              </div>
                            </td>
                            <td className="column-5" style={{ color: '#e65540', fontWeight: '500' }}>
                              {(item.price * item.quantity).toLocaleString('vi-VN')}
                              <span style={{ fontSize: '0.85em' }}>đ</span>
                            </td>
                            <td className="column-6">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger"
                                onClick={() => handleRemoveItem(item)}
                              >
                                <i className="zmdi zmdi-close"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="flex-w flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                    <div className="flex-w flex-m m-r-20 m-tb-5">
                      <input
                        className="stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5"
                        type="text"
                        placeholder="Mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />

                      <div
                        className="flex-c-m stext-101 cl2 size-118 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-5"
                        onClick={handleApplyCoupon}
                      >
                        Áp dụng
                      </div>
                    </div>

                    <div
                      className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10"
                      onClick={() => navigate("/products")}
                    >
                      Tiếp tục mua sắm
                    </div>
                  </div>
                )}
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
                <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                  <h4 className="mtext-109 cl2 p-b-30">Tổng giỏ hàng</h4>

                  <div className="flex-w flex-t bor12 p-b-13">
                    <div className="size-208">
                      <span className="stext-110 cl2">Tạm tính:</span>
                    </div>

                    <div className="size-209">
                      <span className="mtext-110" style={{ color: '#e65540' }}>
                        {getTotalPrice().toLocaleString('vi-VN')}
                        <span style={{ fontSize: '0.85em' }}>đ</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                    <div className="size-208 w-full-ssm">
                      <span className="stext-110 cl2">Phí vận chuyển:</span>
                    </div>

                    <div className="size-209 p-r-18 p-r-0-sm w-full-ssm">
                      <p className="stext-111 cl6 p-t-2">
                        Miễn phí vận chuyển cho đơn hàng trên 1,000,000đ
                      </p>

                      <div className="p-t-15">
                        <span className="mtext-110" style={{ color: '#e65540' }}>
                          {getTotalPrice() >= 1000000 ? "Miễn phí" : <>30,000<span style={{ fontSize: '0.85em' }}>đ</span></>}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-w flex-t p-t-27 p-b-33">
                    <div className="size-208">
                      <span className="mtext-101 cl2">Tổng cộng:</span>
                    </div>

                    <div className="size-209 p-t-1">
                      <span className="mtext-110" style={{ color: '#e65540', fontWeight: 'bold' }}>
                        {(getTotalPrice() + (getTotalPrice() >= 1000000 ? 0 : 30000)).toLocaleString('vi-VN')}
                        <span style={{ fontSize: '0.85em' }}>đ</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                    onClick={handleCheckout}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
