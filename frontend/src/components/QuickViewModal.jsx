import React, { useEffect, useState } from 'react';
import '../css/main.css';
import '../css/util.css';
import $ from 'jquery';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Reset state khi mở modal mới
  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0);
      setQuantity(1);
      setSelectedSize('');
      setSelectedColor('');
    }
  }, [isOpen, product]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Lấy danh sách hình ảnh
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.imageUrl || img.image_url)
    : [product.primary_image || require('../images/product-01.jpg')];

  // Handle add to cart
  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    if (window.swal) {
      window.swal(product.name, "is added to cart!", "success");
    } else {
      alert(`${product.name} is added to cart!`);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (window.swal) {
      window.swal(product.name, "is added to wishlist!", "success");
    } else {
      alert(`${product.name} is added to wishlist!`);
    }
  };

  return (
    <div className={`wrap-modal1 js-modal1 p-t-60 p-b-20 ${isOpen ? 'show-modal1' : ''}`}>
      <div 
        className="overlay-modal1 js-hide-modal1"
        onClick={onClose}
      ></div>

      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="bg0 p-t-40 p-b-20 p-lr-15-lg how-pos3-parent">
          <button 
            className="how-pos3 hov3 trans-04 js-hide-modal1"
            onClick={onClose}
          >
            <img src={require('../images/icons/icon-close.png')} alt="CLOSE" />
          </button>

          <div className="row">
            {/* Image Gallery Section */}
            <div className="col-md-6 col-lg-6 p-b-30">
              <div className="p-l-15 p-r-15 p-lr-0-lg">
                {/* Main Image */}
                <div className="wrap-pic-w pos-relative mb-3">
                  <img 
                    src={images[currentImageIndex]} 
                    alt={product.name}
                    style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = require('../images/product-01.jpg');
                    }}
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="d-flex justify-content-center flex-wrap">
                    {images.map((img, index) => (
                      <div 
                        key={index}
                        className={`m-1 ${currentImageIndex === index ? 'border border-primary' : ''}`}
                        style={{ 
                          cursor: 'pointer', 
                          width: '60px', 
                          height: '60px',
                          overflow: 'hidden',
                          borderRadius: '4px'
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={(e) => {
                            e.target.src = require('../images/product-01.jpg');
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-md-6 col-lg-6 p-b-30">
              <div className="p-r-15 p-t-5 p-lr-0-lg">
                {/* Product Name */}
                <h4 className="mtext-105 cl2 js-name-detail p-b-10" style={{ fontSize: '20px' }}>
                  {product.name}
                </h4>

                {/* Product Price */}
                <span className="mtext-106 cl2" style={{ fontSize: '22px' }}>
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>

                {/* Stock Status */}
                {product.stock_qty !== undefined && (
                  <div className="p-t-10">
                    <span className={`stext-102 ${product.stock_qty > 0 ? 'cl3' : 'cl10'}`} style={{ fontSize: '13px' }}>
                      {product.stock_qty > 0 ? `Số lượng có sẵn: ${product.stock_qty} sản phẩm` : 'Hết hàng'}
                    </span>
                  </div>
                )}

                {/* Product Description */}
                <p className="stext-102 cl3 p-t-15" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                </p>

                {/* Product Options */}
                <div className="p-t-20">
                  {/* Size Selection */}
                  <div className="flex-w flex-r-m p-b-10">
                    <div className="size-203 flex-c-m respon6">
                      Kích thước
                    </div>
                    <div className="size-204 respon6-next">
                      <div className="rs1-select2 bor8 bg0">
                        <select 
                          className="js-select2" 
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '6px 8px', 
                            border: '1px solid #e6e6e6',
                            borderRadius: '2px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Chọn kích thước</option>
                          <option value="S">Size S</option>
                          <option value="M">Size M</option>
                          <option value="L">Size L</option>
                          <option value="XL">Size XL</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="flex-w flex-r-m p-b-10">
                    <div className="size-203 flex-c-m respon6">
                      Màu sắc
                    </div>
                    <div className="size-204 respon6-next">
                      <div className="rs1-select2 bor8 bg0">
                        <select 
                          className="js-select2"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '6px 8px', 
                            border: '1px solid #e6e6e6',
                            borderRadius: '2px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Chọn màu sắc</option>
                          <option value="Red">Đỏ</option>
                          <option value="Blue">Xanh dương</option>
                          <option value="White">Trắng</option>
                          <option value="Grey">Xám</option>
                          <option value="Black">Đen</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="flex-w flex-r-m p-b-10">
                    <div className="size-204 flex-w flex-m respon6-next">
                      {/* Quantity Selector */}
                      <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                        <div 
                          className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <i className="fs-16 zmdi zmdi-minus"></i>
                        </div>

                        <input 
                          className="mtext-104 cl3 txt-center num-product" 
                          type="number" 
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                        />

                        <div 
                          className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <i className="fs-16 zmdi zmdi-plus"></i>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                        onClick={handleAddToCart}
                        disabled={product.stock_qty <= 0}
                        style={{ fontSize: '14px' }}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social and Wishlist */}
                <div className="flex-w flex-m p-l-0 p-t-25 respon7">
                  <div className="flex-m bor9 p-r-10 m-r-11">
                    <a 
                      href="#" 
                      className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100" 
                      data-tooltip="Thêm vào yêu thích"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToWishlist();
                      }}
                    >
                      <i className="zmdi zmdi-favorite"></i>
                    </a>
                  </div>

                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Facebook">
                    <i className="fa fa-facebook"></i>
                  </a>

                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Twitter">
                    <i className="fa fa-twitter"></i>
                  </a>

                  <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Google Plus">
                    <i className="fa fa-google-plus"></i>
                  </a>
                </div>

                {/* Product SKU */}
                {product.sku && (
                  <div className="p-t-20">
                    <span className="stext-107 cl6">
                      Mã Sản Phẩm: {product.sku}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

