import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

const UserOrders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/orders/user/${currentUser.id}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        // Sorting list orders by status and order date
        const sortedOrders = data.sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") return -1;
          if (a.status !== "PENDING" && b.status === "PENDING") return 1;
          return new Date(b.orderDate) - new Date(a.orderDate);
        });

        setOrders(sortedOrders);
      } else {
        setError("Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Đã có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return (
      <>
        {amount.toLocaleString("vi-VN")}
        <span style={{ fontSize: "0.85em" }}>đ</span>
      </>
    );
  };

  // Cancel Order (update status to CANCELLED)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/orders/${orderId}/cancel`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("Đã hủy đơn hàng thành công!");
        fetchOrders(); // Refresh list
      } else {
        alert("Lỗi khi hủy đơn hàng!");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Đã có lỗi xảy ra khi hủy đơn hàng!");
    }
  };

  // Delete Order (delete order from database)
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này khỏi danh sách?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Đã xóa đơn hàng thành công!");
        fetchOrders(); // Refresh list
      } else {
        alert("Lỗi khi xóa đơn hàng!");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Đã có lỗi xảy ra khi xóa đơn hàng!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        text: "Chờ thanh toán",
        className: "badge-warning",
        icon: "fa-clock-o",
      },
      PAID: {
        text: "Đã thanh toán",
        className: "badge-info",
        icon: "fa-check-circle",
      },
      PROCESSING: {
        text: "Đang xử lý",
        className: "badge-primary",
        icon: "fa-cog",
      },
      SHIPPED: {
        text: "Đang giao hàng",
        className: "badge-secondary",
        icon: "fa-truck",
      },
      DELIVERED: {
        text: "Đã giao hàng",
        className: "badge-success",
        icon: "fa-check-circle",
      },
      CANCELLED: {
        text: "Đã hủy",
        className: "badge-danger",
        icon: "fa-times-circle",
      },
    };
    return (
      statusMap[status] || {
        text: status,
        className: "badge-secondary",
        icon: "fa-info-circle",
      }
    );
  };

  if (loading) {
    return (
      <div
        className="container text-center"
        style={{ paddingTop: "150px", paddingBottom: "150px" }}
      >
        <i
          className="fa fa-spinner fa-spin fa-3x"
          style={{ color: "#6c7ae0" }}
        ></i>
        <p className="mt-3 stext-111 cl6">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="bg0 p-t-100 p-b-85">
      <div className="container">
        {/* Breadcrumb */}
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-b-30">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="stext-109 cl8 hov-cl1 trans-04"
          >
            Trang Chủ
            <i className="fa fa-angle-right m-l-9 m-r-10"></i>
          </a>
          <span className="stext-109 cl4">Đơn hàng của tôi</span>
        </div>

        {/* Header */}
        <div className="row">
          <div className="col-12">
            <h2 className="mtext-109 cl2 p-b-10">
              <i className="fa fa-shopping-bag m-r-10"></i>
              Đơn hàng của tôi
            </h2>
            <p className="stext-111 cl6 p-b-30">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fa fa-exclamation-triangle m-r-10"></i>
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="bor10 p-all-40 text-center">
                <i className="fa fa-inbox fa-5x cl6 m-b-20"></i>
                <h3 className="mtext-111 cl2 p-b-10">Chưa có đơn hàng nào</h3>
                <p className="stext-111 cl6 p-b-20">
                  Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                >
                  <i className="fa fa-shopping-cart m-r-10"></i>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);

              return (
                <div key={order.orderId} className="col-12 p-b-20">
                  <div className="bor10 bg-light">
                    {/* Order Header */}
                    <div className="flex-w flex-sb-m p-all-20 bor12 bg-white">
                      <div className="flex-w flex-m">
                        <div className="m-r-30">
                          <p className="stext-111 cl6">Mã đơn hàng</p>
                          <p className="mtext-110 cl2">#{order.orderId}</p>
                        </div>
                        <div className="m-r-30">
                          <p className="stext-111 cl6">Ngày đặt</p>
                          <p className="stext-110 cl2">
                            <i className="fa fa-calendar m-r-5"></i>
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`badge ${statusInfo.className}`}
                          style={{ fontSize: "14px", padding: "8px 15px" }}
                        >
                          <i className={`fa ${statusInfo.icon} m-r-5`}></i>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    {/* Order Content - 2 Columns Layout */}
                    <div className="p-all-20 bg-white">
                      <div className="row">
                        {/* LEFT: Order Items */}
                        <div className="col-lg-8 col-md-7">
                          <h5
                            className="stext-111 cl2 p-b-15"
                            style={{
                              fontWeight: "600",
                              borderBottom: "2px solid #e6e6e6",
                              paddingBottom: "10px",
                            }}
                          >
                            <i className="fa fa-list m-r-8"></i>
                            Sản phẩm
                          </h5>
                          <div
                            style={{
                              maxHeight: "400px",
                              overflowY: "auto",
                              paddingRight: "10px",
                            }}
                          >
                            {order.items &&
                              order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex-w flex-m p-b-15 p-t-15"
                                  style={{
                                    borderBottom:
                                      index < order.items.length - 1
                                        ? "1px solid #f0f0f0"
                                        : "none",
                                  }}
                                >
                                  <div
                                    className="wrap-pic-w bor10 of-hidden m-r-15"
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {item.productImage ? (
                                      <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                          e.target.src = require("../../images/product-01.jpg");
                                        }}
                                      />
                                    ) : (
                                      <div className="flex-c-m w-full h-full bg-secondary">
                                        <i className="fa fa-image fa-2x text-white"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p
                                      className="stext-110 cl2 p-b-5"
                                      style={{ fontWeight: "500" }}
                                    >
                                      {item.productName}
                                    </p>
                                    <p className="stext-111 cl6">
                                      <i className="fa fa-cube m-r-5"></i>
                                      Số lượng: <strong>{item.quantity}</strong>
                                    </p>
                                    <p
                                      className="stext-110 m-t-5"
                                      style={{
                                        color: "#e65540",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {formatCurrency(item.lineTotal)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {/* Total Summary */}
                          <div
                            className="p-t-20"
                            style={{ borderTop: "2px solid #e6e6e6" }}
                          >
                            <div className="flex-w flex-sb-m p-b-10">
                              <span className="stext-111 cl6">
                                Tổng số lượng:
                              </span>
                              <span
                                className="mtext-110 cl2"
                                style={{ fontWeight: "600" }}
                              >
                                {order.items
                                  ? order.items.reduce(
                                      (total, item) => total + item.quantity,
                                      0
                                    )
                                  : 0}{" "}
                                sản phẩm
                              </span>
                            </div>
                            <div className="flex-w flex-sb-m">
                              <span className="stext-111 cl6">Tổng tiền:</span>
                              <span
                                className="mtext-110"
                                style={{
                                  color: "#e65540",
                                  fontWeight: "700",
                                  fontSize: "20px",
                                }}
                              >
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Action Buttons */}
                        <div className="col-lg-4 col-md-5">
                          <div
                            className="bor10 p-all-20"
                            style={{
                              backgroundColor: "#f8f9fa",
                              position: "sticky",
                              top: "20px",
                            }}
                          >
                            <h5
                              className="stext-111 cl2 p-b-15 text-center"
                              style={{ fontWeight: "600" }}
                            >
                              Thao tác
                            </h5>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                              }}
                            >
                              {/* View detail */}
                              <button
                                onClick={() =>
                                  navigate(`/order-detail/${order.orderId}`)
                                }
                                className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                                style={{
                                  width: "100%",
                                  height: "45px",
                                  backgroundColor: "#6c7ae0",
                                  border: "none",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="fa fa-eye m-r-8"></i>
                                Xem chi tiết
                              </button>

                              {/* Button for PENDING orders */}
                              {order.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/payment?orderId=${order.orderId}`
                                      )
                                    }
                                    className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                                    style={{
                                      width: "100%",
                                      height: "45px",
                                      backgroundColor: "#28a745",
                                      border: "none",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <i className="fa fa-credit-card m-r-8"></i>
                                    Thanh toán
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleCancelOrder(order.orderId)
                                    }
                                    className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                                    style={{
                                      width: "100%",
                                      height: "45px",
                                      backgroundColor: "#ffc107",
                                      border: "none",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      color: "#000",
                                    }}
                                  >
                                    <i className="fa fa-ban m-r-8"></i>
                                    Hủy đơn hàng
                                  </button>
                                </>
                              )}

                              {/* Button for CANCELLED orders */}
                              {order.status === "CANCELLED" && (
                                <button
                                  onClick={() =>
                                    handleDeleteOrder(order.orderId)
                                  }
                                  className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
                                  style={{
                                    width: "100%",
                                    height: "45px",
                                    backgroundColor: "#dc3545",
                                    border: "none",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <i className="fa fa-trash m-r-8"></i>
                                  Xóa đơn hàng
                                </button>
                              )}

                              {/* Additional information */}
                              <div
                                className="p-t-10"
                                style={{ borderTop: "1px solid #dee2e6" }}
                              >
                                <p
                                  className="stext-111 cl6 text-center"
                                  style={{
                                    fontSize: "12px",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <i className="fa fa-info-circle m-r-5"></i>
                                  Mã đơn: <strong>#{order.orderId}</strong>
                                </p>
                                {order.status === "PENDING" && (
                                  <p
                                    className="stext-111 text-center"
                                    style={{
                                      fontSize: "11px",
                                      color: "#dc3545",
                                      marginTop: "10px",
                                    }}
                                  >
                                    ⚠️ Đơn hàng chưa thanh toán
                                  </p>
                                )}
                                {order.status === "CANCELLED" && (
                                  <p
                                    className="stext-111 text-center"
                                    style={{
                                      fontSize: "11px",
                                      color: "#6c757d",
                                      marginTop: "10px",
                                    }}
                                  >
                                    ℹ️ Có thể xóa đơn này
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
