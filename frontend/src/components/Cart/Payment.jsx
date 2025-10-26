import React, { useState, useEffect } from 'react';
import '../../css/main.css';
import '../../css/util.css';
import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../fonts/font-awesome-4.7.0/css/font-awesome.min.css';

const VNPayPaymentPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy thông tin đơn hàng từ backend
  useEffect(() => {
    const fetchOrderData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      
      if (!orderId) {
        setError('Không tìm thấy thông tin đơn hàng');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/orders/${orderId}`);
        const data = await response.json();

        if (data.orderId) {
          setOrderData({
            orderId: data.orderId,
            customerName: data.customerName,
            orderDate: new Date(data.orderDate).toLocaleDateString('vi-VN'),
            total: data.total,
            items: data.items.map(item => ({
              name: item.productName,
              quantity: item.quantity,
              price: item.unitPrice,
              image: item.productImage
            })),
            shippingAddress: data.shippingAddress,
            status: data.status
          });
        } else {
          setError('Không tìm thấy đơn hàng');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Lỗi khi tải thông tin đơn hàng');
      }
    };

    // Kiểm tra nếu đang return từ VNPay
    checkPaymentReturn();
    
    // Fetch order data nếu chưa có payment return
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('vnp_ResponseCode')) {
      fetchOrderData();
    }
  }, []);

  const checkPaymentReturn = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
    
    if (vnp_ResponseCode) {
      if (vnp_ResponseCode === '00') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
        setError('Thanh toán thất bại. Mã lỗi: ' + vnp_ResponseCode);
      }
    }
  };

  const handlePayment = async () => {
    if (!orderData) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Gọi API để tạo payment URL
      const response = await fetch(
        `http://localhost:8080/payment/vnpay?orderId=${orderData.orderId}&amount=${orderData.total}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Không thể tạo liên kết thanh toán');
      }

      const paymentUrl = await response.text();
      
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = paymentUrl;
      
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fa fa-check-circle" style={{ fontSize: '80px', color: '#28a745' }}></i>
                </div>
                <h2 className="mtext-111 cl2 mb-3">Thanh toán thành công!</h2>
                <p className="stext-111 cl6 mb-4">
                  Đơn hàng #{orderData?.orderId} đã được thanh toán thành công.
                </p>
                <div className="bg-light rounded p-4 mb-4">
                  <p className="stext-111 cl6 mb-2">Số tiền đã thanh toán</p>
                  <h3 className="mtext-110" style={{ color: '#28a745' }}>
                    {formatCurrency(orderData?.total || 0)}
                  </h3>
                </div>
                <button
                  onClick={() => window.location.href = '/my-orders'}
                  className="btn btn-success btn-lg btn-block mb-2"
                  style={{ borderRadius: '25px' }}
                >
                  <i className="fa fa-list-alt mr-2"></i>
                  Xem đơn hàng của tôi
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-outline-secondary btn-lg btn-block"
                  style={{ borderRadius: '25px' }}
                >
                  <i className="fa fa-home mr-2"></i>
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <i className="fa fa-times-circle" style={{ fontSize: '80px', color: '#dc3545' }}></i>
                </div>
                <h2 className="mtext-111 cl2 mb-3">Thanh toán thất bại</h2>
                <p className="stext-111 cl6 mb-4">{error}</p>
                <button
                  onClick={() => setPaymentStatus('pending')}
                  className="btn btn-danger btn-lg btn-block"
                  style={{ borderRadius: '25px' }}
                >
                  <i className="fa fa-refresh mr-2"></i>
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container text-center" style={{ paddingTop: '100px' }}>
        <i className="fa fa-spinner fa-spin fa-3x" style={{ color: '#6c7ae0' }}></i>
        <p className="mt-3 stext-111 cl6">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="bg0 p-t-75 p-b-85">
      <div className="container">
        {/* Breadcrumb */}
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
            className="stext-109 cl8 hov-cl1 trans-04"
          >
            Trang Chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
          </a>
          <span className="stext-109 cl4">Thanh toán</span>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="row">
          {/* Left Column - Order Info & Items */}
          <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
            <div className="m-l-25 m-r--38 m-lr-0-xl">
              {/* Page Title */}
              <div className="p-b-30">
                <h2 className="mtext-109 cl2">
                  <i className="fa fa-credit-card m-r-10"></i>
                  Thanh toán đơn hàng
                </h2>
              </div>

              {/* Order Info */}
              <div className="bor10 p-all-20 m-b-20">
                <h3 className="mtext-111 cl2 p-b-15">
                  <i className="fa fa-info-circle m-r-10"></i>
                  Thông tin đơn hàng
                </h3>
                
                <div className="row">
                  <div className="col-sm-6 p-b-10">
                    <span className="stext-111 cl6">Mã đơn hàng:</span>
                    <span className="stext-110 cl2 m-l-10">#{orderData.orderId}</span>
                  </div>
                  <div className="col-sm-6 p-b-10">
                    <span className="stext-111 cl6">Khách hàng:</span>
                    <span className="stext-110 cl2 m-l-10">{orderData.customerName}</span>
                  </div>
                  <div className="col-sm-6 p-b-10">
                    <span className="stext-111 cl6">Ngày đặt:</span>
                    <span className="stext-110 cl2 m-l-10">
                      <i className="fa fa-clock-o m-r-5"></i>
                      {orderData.orderDate}
                    </span>
                  </div>
                  <div className="col-sm-12 p-t-10">
                    <span className="stext-111 cl6">Địa chỉ giao hàng:</span>
                    <p className="stext-110 cl2 p-t-5">
                      <i className="fa fa-map-marker m-r-10"></i>
                      {orderData.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="bor10 p-all-20">
                <h3 className="mtext-111 cl2 p-b-15">
                  <i className="fa fa-shopping-bag m-r-10"></i>
                  Chi tiết sản phẩm
                </h3>
                <div className="wrap-table-shopping-cart">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="table_row p-b-15" style={{ borderBottom: '1px solid #e6e6e6' }}>
                      <div className="flex-w flex-sb-m p-b-10">
                        <div className="flex-w flex-m">
                          {item.image && (
                            <div className="wrap-pic-w size-200 bor10 of-hidden m-r-15" style={{ width: '80px', height: '80px' }}>
                              <img src={item.image} alt={item.name} />
                            </div>
                          )}
                          <div>
                            <p className="stext-110 cl2 p-b-5">{item.name}</p>
                            <p className="stext-111 cl6">
                              Số lượng: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                        <p className="stext-110" style={{ color: '#e65540' }}>
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
            <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <h4 className="mtext-109 cl2 p-b-30">
                <i className="fa fa-calculator m-r-10"></i>
                Tổng đơn hàng
              </h4>

              {/* Subtotal */}
              <div className="flex-w flex-t bor12 p-b-13">
                <div className="size-208">
                  <span className="stext-110 cl2">Tạm tính:</span>
                </div>
                <div className="size-209">
                  <span className="mtext-110" style={{ color: '#e65540' }}>
                    {formatCurrency(orderData.total)}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex-w flex-t bor12 p-t-15 p-b-30">
                <div className="size-208 w-full-ssm">
                  <span className="stext-110 cl2">Phí vận chuyển:</span>
                </div>
                <div className="size-209 p-r-18 p-r-0-sm w-full-ssm">
                  <p className="stext-111 cl6 p-t-2">
                    Miễn phí vận chuyển cho đơn hàng
                  </p>
                  <div className="p-t-15">
                    <span className="mtext-110" style={{ color: '#28a745' }}>
                      Miễn phí
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex-w flex-t p-t-27 p-b-33">
                <div className="size-208">
                  <span className="mtext-101 cl2">Tổng cộng:</span>
                </div>
                <div className="size-209 p-t-1">
                  <span className="mtext-110" style={{ color: '#e65540', fontWeight: 'bold', fontSize: '28px' }}>
                    {formatCurrency(orderData.total)}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger m-b-20" role="alert">
                  <i className="fa fa-exclamation-triangle m-r-10"></i>
                  {error}
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                style={{ 
                  height: '60px',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin m-r-10"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa fa-credit-card m-r-10"></i>
                    Thanh toán qua VNPay
                  </>
                )}
              </button>

              {/* Security Note */}
              <div className="text-center p-t-20">
                <p className="stext-111 cl6">
                  <i className="fa fa-lock m-r-5"></i>
                  Bạn sẽ được chuyển đến trang thanh toán VNPay an toàn
                </p>
                <p className="stext-111 cl6 p-t-10">
                  <i className="fa fa-shield m-r-5"></i>
                  Giao dịch được mã hóa và bảo mật
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNPayPaymentPage;