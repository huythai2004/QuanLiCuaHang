import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/main.css';
import '../../css/util.css';
import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../fonts/font-awesome-4.7.0/css/font-awesome.min.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchOrderDetail();
  }, [orderId, currentUser, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/orders/${orderId}`);
      const data = await response.json();
      
      if (data.orderId) {
        setOrder(data);
      } else {
        setError('Không tìm thấy đơn hàng');
      }
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError('Đã có lỗi xảy ra khi tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ thanh toán', className: 'badge-warning', icon: 'fa-clock-o' },
      'PAID': { text: 'Đã thanh toán', className: 'badge-info', icon: 'fa-check-circle' },
      'PROCESSING': { text: 'Đang xử lý', className: 'badge-primary', icon: 'fa-cog' },
      'SHIPPED': { text: 'Đang giao hàng', className: 'badge-secondary', icon: 'fa-truck' },
      'DELIVERED': { text: 'Đã giao hàng', className: 'badge-success', icon: 'fa-check-circle' },
      'CANCELLED': { text: 'Đã hủy', className: 'badge-danger', icon: 'fa-times-circle' }
    };
    return statusMap[status] || { text: status, className: 'badge-secondary', icon: 'fa-info-circle' };
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '150px', paddingBottom: '150px' }}>
        <i className="fa fa-spinner fa-spin fa-3x" style={{ color: '#6c7ae0' }}></i>
        <p className="mt-3 stext-111 cl6">Đang tải...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <i className="fa fa-times-circle fa-5x text-danger m-b-20"></i>
            <h2 className="mtext-111 cl2 p-b-10">Lỗi</h2>
            <p className="stext-111 cl6 p-b-20">{error || 'Không tìm thấy đơn hàng'}</p>
            <button
              onClick={() => navigate('/my-orders')}
              className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
            >
              <i className="fa fa-arrow-left m-r-10"></i>
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(order.status);

  return (
    <div className="bg0 p-t-100 p-b-85">
      <div className="container">
        {/* Breadcrumb */}
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-b-30">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="stext-109 cl8 hov-cl1 trans-04">
            Trang Chủ
            <i className="fa fa-angle-right m-l-9 m-r-10"></i>
          </a>
          <a href="/my-orders" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }} className="stext-109 cl8 hov-cl1 trans-04">
            Đơn hàng
            <i className="fa fa-angle-right m-l-9 m-r-10"></i>
          </a>
          <span className="stext-109 cl4">Chi tiết đơn hàng #{order.orderId}</span>
        </div>

        {/* Order Header */}
        <div className="row m-b-30">
          <div className="col-12">
            <div className="bor10 p-all-25 bg-white">
              <div className="flex-w flex-sb-m">
                <div>
                  <h2 className="mtext-109 cl2">
                    <i className="fa fa-file-text-o m-r-10"></i>
                    Đơn hàng #{order.orderId}
                  </h2>
                  <p className="stext-111 cl6 p-t-10">
                    <i className="fa fa-calendar m-r-5"></i>
                    Đặt ngày {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <span className={`badge ${statusInfo.className}`} style={{ fontSize: '16px', padding: '10px 20px' }}>
                    <i className={`fa ${statusInfo.icon} m-r-5`}></i>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8 m-b-30">
            {/* Order Items */}
            <div className="bor10 p-all-25 m-b-20 bg-white">
              <h3 className="mtext-111 cl2 p-b-20">
                <i className="fa fa-shopping-bag m-r-10"></i>
                Sản phẩm đã đặt
              </h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex-w flex-sb-m bg-light bor10 p-all-15 m-b-15">
                  <div className="flex-w flex-m">
                    <div className="wrap-pic-w size-200 bor10 of-hidden m-r-15" style={{ width: '100px', height: '100px' }}>
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          onError={(e) => {
                            e.target.src = require("../../images/product-01.jpg");
                          }}
                        />
                      ) : (
                        <div className="flex-c-m w-full h-full bg-secondary">
                          <i className="fa fa-image fa-3x text-white"></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="stext-110 cl2 p-b-5">{item.productName}</p>
                      <p className="stext-111 cl6">Số lượng: {item.quantity}</p>
                      <p className="stext-111 cl6">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mtext-110" style={{ color: '#e65540' }}>
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Info */}
            {order.payment && (
              <div className="bor10 p-all-25 bg-white">
                <h3 className="mtext-111 cl2 p-b-20">
                  <i className="fa fa-credit-card m-r-10"></i>
                  Thông tin thanh toán
                </h3>
                <div className="row">
                  <div className="col-md-6 p-b-15">
                    <p className="stext-111 cl6">Phương thức</p>
                    <p className="stext-110 cl2">{order.payment.method}</p>
                  </div>
                  <div className="col-md-6 p-b-15">
                    <p className="stext-111 cl6">Trạng thái</p>
                    <p className={`stext-110 ${order.payment.status === 'SUCCESS' ? 'text-success' : 'text-danger'}`}>
                      {order.payment.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
                    </p>
                  </div>
                  {order.payment.transactionNo && (
                    <div className="col-md-6 p-b-15">
                      <p className="stext-111 cl6">Mã giao dịch</p>
                      <p className="stext-110 cl2">{order.payment.transactionNo}</p>
                    </div>
                  )}
                  {order.payment.bankCode && (
                    <div className="col-md-6 p-b-15">
                      <p className="stext-111 cl6">Ngân hàng</p>
                      <p className="stext-110 cl2">{order.payment.bankCode}</p>
                    </div>
                  )}
                  {order.payment.paidAt && (
                    <div className="col-12">
                      <p className="stext-111 cl6">Thời gian thanh toán</p>
                      <p className="stext-110 cl2">
                        <i className="fa fa-clock-o m-r-5"></i>
                        {formatDate(order.payment.paidAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Shipping Address */}
            <div className="bor10 p-all-25 m-b-20 bg-white">
              <h3 className="mtext-111 cl2 p-b-20">
                <i className="fa fa-map-marker m-r-10"></i>
                Địa chỉ giao hàng
              </h3>
              <p className="stext-110 cl2 p-b-10">{order.customerName}</p>
              <p className="stext-111 cl6">{order.shippingAddress}</p>
            </div>

            {/* Order Summary */}
            <div className="bor10 p-all-25 bg-white">
              <h3 className="mtext-111 cl2 p-b-20">Tổng đơn hàng</h3>
              <div className="flex-w flex-sb-m p-b-15">
                <span className="stext-111 cl6">Tạm tính</span>
                <span className="stext-110 cl2">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex-w flex-sb-m p-b-15 bor12">
                <span className="stext-111 cl6">Phí vận chuyển</span>
                <span className="stext-110 cl2">Miễn phí</span>
              </div>
              <div className="flex-w flex-sb-m p-t-15">
                <span className="mtext-101 cl2">Tổng cộng</span>
                <span className="mtext-110" style={{ color: '#e65540', fontSize: '24px' }}>
                  {formatCurrency(order.total)}
                </span>
              </div>
              
              {order.status === 'PENDING' && (
                <button
                  onClick={() => navigate(`/payment?orderId=${order.orderId}`)}
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer w-full m-t-20"
                >
                  <i className="fa fa-credit-card m-r-10"></i>
                  Thanh toán ngay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
