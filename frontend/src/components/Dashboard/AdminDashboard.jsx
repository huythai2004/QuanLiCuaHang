import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProductCRUD from "./ProductCRUD";
import UserCRUD from "./UserCRUD";
import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [currentUser, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all orders (admin endpoint)
      const ordersResponse = await fetch("http://localhost:8080/orders/all");
      const ordersData = await ordersResponse.json();

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);

        // Calculate stats
        const totalRevenue = ordersData
          .filter(
            (order) => order.status === "PAID" || order.status === "DELIVERED"
          )
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setStats((prev) => ({
          ...prev,
          totalOrders: ordersData.length,
          totalRevenue: totalRevenue,
        }));
      }

      // Fetch users count
      try {
        const usersResponse = await fetch("http://localhost:8080/users");
        const usersData = await usersResponse.json();
        if (Array.isArray(usersData)) {
          setStats((prev) => ({
            ...prev,
            totalUsers: usersData.length,
          }));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      // Fetch products count
      try {
        const productsResponse = await fetch("http://localhost:8080/products");
        const productsData = await productsResponse.json();
        if (Array.isArray(productsData)) {
          setStats((prev) => ({
            ...prev,
            totalProducts: productsData.length,
          }));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ thanh toán", className: "badge-warning" },
      PAID: { text: "Đã thanh toán", className: "badge-info" },
      PROCESSING: { text: "Đang xử lý", className: "badge-primary" },
      SHIPPED: { text: "Đang giao", className: "badge-secondary" },
      DELIVERED: { text: "Đã giao", className: "badge-success" },
      CANCELLED: { text: "Đã hủy", className: "badge-danger" },
    };
    return statusMap[status] || { text: status, className: "badge-secondary" };
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        alert("Cập nhật trạng thái thành công!");
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể cập nhật trạng thái"));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  // Products CRUD functions
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/products");
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Lỗi khi tải danh sách sản phẩm");
    }
  };

  // Users CRUD functions
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Lỗi khi tải danh sách người dùng");
    }
  };

  // Load products and users when switching to their tabs
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div
      className="bg0"
      style={{
        paddingTop: "120px",
        minHeight: "calc(100vh - 120px)",
        paddingBottom: "150px",
      }}
    >
      <div className="container">
        <div className="flex-w">
          {/* Sidebar */}
          <div className="bg-light" style={{ width: "250px", flexShrink: 0 }}>
            <div
              className="p-all-30"
              style={{
                background:
                  "linear-gradient(135deg, #12cfe4ff 0%, #cfdc15ff 100%)",
              }}
            >
              <h2 className="mtext-109" style={{ color: "white" }}>
                <i className="fa fa-dashboard m-r-10"></i>
                Admin Panel
              </h2>
              <p
                className="stext-111"
                style={{ color: "rgba(255,255,255,0.8)", marginTop: "5px" }}
              >
                Quản trị hệ thống
              </p>
            </div>

            <nav className="p-lr-20 p-tb-15">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex-l-m p-lr-15 p-tb-12 m-b-10 trans-04 ${
                  activeTab === "overview" ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                <i className="fa fa-dashboard m-r-10"></i>
                <span className="stext-101">Tổng quan</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex-l-m p-lr-15 p-tb-12 m-b-10 trans-04 ${
                  activeTab === "orders" ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                <i className="fa fa-shopping-cart m-r-10"></i>
                <span className="stext-101">Đơn hàng</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex-l-m p-lr-15 p-tb-12 m-b-10 trans-04 ${
                  activeTab === "products" ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                <i className="fa fa-cube m-r-10"></i>
                <span className="stext-101">Sản phẩm</span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex-l-m p-lr-15 p-tb-12 m-b-10 trans-04 ${
                  activeTab === "users" ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                <i className="fa fa-users m-r-10"></i>
                <span className="stext-101">Người dùng</span>
              </button>

              <button
                onClick={() => setActiveTab("feedback")}
                className={`w-full flex-l-m p-lr-15 p-tb-12 m-b-10 trans-04 ${
                  activeTab === "feedback" ? "bg-primary" : "bg-secondary"
                }`}
                style={{
                  border: "none",
                  borderRadius: "5px",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                <i className="fa fa-comments m-r-10"></i>
                <span className="stext-101">Phản hồi</span>
              </button>

              <div className="bor12 p-t-15 m-t-15">
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex-l-m p-lr-15 p-tb-12 bg-secondary trans-04"
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    textAlign: "left",
                    color: "white",
                    width: "100%",
                  }}
                >
                  <i className="fa fa-eye m-r-10"></i>
                  <span className="stext-101">Xem trang web</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: "30px", paddingBottom: "100px" }}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="mtext-109 cl2 p-b-30">Tổng quan</h2>

                {/* Stats Cards */}
                <div
                  className="row p-b-30"
                  style={{ display: "flex", alignItems: "stretch" }}
                >
                  <div className="col-md-3 p-b-20" style={{ display: "flex" }}>
                    <div
                      className="bor10 p-all-25 bg-white"
                      style={{
                        borderLeft: "4px solid #e22a12ff",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="flex-w flex-sb-m"
                        style={{ flex: 1, alignItems: "flex-start" }}
                      >
                        <div style={{ flex: 1 }}>
                          <p className="stext-111 cl6 p-b-5">Tổng đơn hàng</p>
                          <h3 className="mtext-109 cl2">{stats.totalOrders}</h3>
                        </div>
                        <i
                          className="fa fa-shopping-cart fa-3x"
                          style={{
                            color: "#0816b6ff",
                            opacity: 0.3,
                            alignSelf: "flex-end",
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 p-b-20" style={{ display: "flex" }}>
                    <div
                      className="bor10 p-all-25 bg-white"
                      style={{
                        borderLeft: "4px solid #28a745",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="flex-w flex-sb-m"
                        style={{ flex: 1, alignItems: "flex-start" }}
                      >
                        <div style={{ flex: 1 }}>
                          <p className="stext-111 cl6 p-b-5">Doanh thu</p>
                          <h3
                            className="mtext-109 cl2"
                            style={{ fontSize: "20px" }}
                          >
                            {formatCurrency(stats.totalRevenue).slice(0, -2)}
                          </h3>
                        </div>
                        <i
                          className="fa fa-money fa-3x"
                          style={{
                            color: "#28a745",
                            opacity: 0.3,
                            alignSelf: "flex-end",
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 p-b-20" style={{ display: "flex" }}>
                    <div
                      className="bor10 p-all-25 bg-white"
                      style={{
                        borderLeft: "4px solid #6f42c1",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="flex-w flex-sb-m"
                        style={{ flex: 1, alignItems: "flex-start" }}
                      >
                        <div style={{ flex: 1 }}>
                          <p className="stext-111 cl6 p-b-5">Người dùng</p>
                          <h3 className="mtext-109 cl2">{stats.totalUsers}</h3>
                        </div>
                        <i
                          className="fa fa-users fa-3x"
                          style={{
                            color: "#6f42c1",
                            opacity: 0.3,
                            alignSelf: "flex-end",
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3 p-b-20" style={{ display: "flex" }}>
                    <div
                      className="bor10 p-all-25 bg-white"
                      style={{
                        borderLeft: "4px solid #fd7e14",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        className="flex-w flex-sb-m"
                        style={{ flex: 1, alignItems: "flex-start" }}
                      >
                        <div style={{ flex: 1 }}>
                          <p className="stext-111 cl6 p-b-5">Sản phẩm</p>
                          <h3 className="mtext-109 cl2">
                            {stats.totalProducts}
                          </h3>
                        </div>
                        <i
                          className="fa fa-cube fa-3x"
                          style={{
                            color: "#fd7e14",
                            opacity: 0.3,
                            alignSelf: "flex-end",
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bor10 p-all-25 bg-white">
                  <h3 className="mtext-111 cl2 p-b-20">
                    <i className="fa fa-clock-o m-r-10"></i>
                    Đơn hàng gần đây
                  </h3>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="stext-111 cl6">Mã ĐH</th>
                          <th className="stext-111 cl6">Khách hàng</th>
                          <th className="stext-111 cl6">Ngày đặt</th>
                          <th className="stext-111 cl6">Tổng tiền</th>
                          <th className="stext-111 cl6">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => {
                          const statusInfo = getStatusBadge(order.status);
                          return (
                            <tr key={order.orderId}>
                              <td className="stext-110 cl2">
                                #{order.orderId}
                              </td>
                              <td className="stext-110 cl2">
                                {order.customerName}
                              </td>
                              <td className="stext-111 cl6">
                                {formatDate(order.orderDate)}
                              </td>
                              <td className="stext-110 cl2">
                                {formatCurrency(order.total)}
                              </td>
                              <td>
                                <span
                                  className={`badge ${statusInfo.className}`}
                                >
                                  {statusInfo.text}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex-w flex-sb-m p-b-30">
                  <h2 className="mtext-109 cl2">Quản lý đơn hàng</h2>
                </div>

                <div className="bor10 bg-white">
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="bg-light">
                        <tr>
                          <th className="stext-111 cl6 p-lr-15 p-tb-15">
                            Mã ĐH
                          </th>
                          <th className="stext-111 cl6">Khách hàng</th>
                          <th className="stext-111 cl6">Địa chỉ</th>
                          <th className="stext-111 cl6">Ngày đặt</th>
                          <th className="stext-111 cl6">Tổng tiền</th>
                          <th className="stext-111 cl6">Trạng thái</th>
                          <th className="stext-111 cl6">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center p-tb-30">
                              <p className="stext-111 cl6">
                                Không có đơn hàng nào
                              </p>
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order.orderId}>
                              <td className="stext-110 cl2 p-lr-15 p-tb-15">
                                #{order.orderId}
                              </td>
                              <td className="stext-110 cl2">
                                {order.customerName}
                              </td>
                              <td
                                className="stext-111 cl6"
                                style={{
                                  maxWidth: "200px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {order.shippingAddress}
                              </td>
                              <td className="stext-111 cl6">
                                {formatDate(order.orderDate)}
                              </td>
                              <td
                                className="stext-110"
                                style={{ color: "#e65540" }}
                              >
                                {formatCurrency(order.total)}
                              </td>
                              <td>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(
                                      order.orderId,
                                      e.target.value
                                    )
                                  }
                                  className="stext-111 cl2 bor8 p-lr-10 p-tb-5"
                                >
                                  <option value="PENDING">
                                    Chờ thanh toán
                                  </option>
                                  <option value="PAID">Đã thanh toán</option>
                                  <option value="PROCESSING">Đang xử lý</option>
                                  <option value="SHIPPED">Đang giao</option>
                                  <option value="DELIVERED">Đã giao</option>
                                  <option value="CANCELLED">Đã hủy</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    navigate(`/order-detail/${order.orderId}`)
                                  }
                                  className="stext-111 text-primary m-r-10"
                                  style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i className="fa fa-eye m-r-5"></i>
                                  Xem
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <ProductCRUD
                products={products}
                onRefresh={fetchProducts}
                onUpdateStats={fetchDashboardData}
              />
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <UserCRUD
                users={users}
                onRefresh={fetchUsers}
                onUpdateStats={fetchDashboardData}
              />
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <div>
                <h2 className="mtext-109 cl2 p-b-30">Phản hồi khách hàng</h2>
                <div className="bor10 p-all-50 text-center bg-white">
                  <i className="fa fa-comments fa-5x cl6 m-b-20"></i>
                  <p className="stext-111 cl6">
                    Phản hồi khách hàng - Chức năng đang phát triển
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
