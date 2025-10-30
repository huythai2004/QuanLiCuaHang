import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "../../css/main.css";
import "../../css/util.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import iconHeart1 from "../../images/icons/icon-heart-01.png";
import iconHeart2 from "../../images/icons/icon-heart-02.png";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Scroll to top khi component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //fecth product detail
  useEffect(() => {
    if (id) {
    fetchProductDetail();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      // Fetch product info
      const productResponse = await fetch(`http://localhost:8080/products/${id}`);
      const productData = await productResponse.json();

      // Fetch product images
      const imagesResponse = await fetch(
        `http://localhost:8080/product-images/product/${id}`
      );
      const imagesData = await imagesResponse.json();
      
      // Fetch all products for related products
      const allProductsResponse = await fetch('http://localhost:8080/products');
      const allProducts = await allProductsResponse.json();
      
      // Filter related products (exclude current product, same category or random)
      const related = allProducts
        .filter(p => p.id !== parseInt(id))
        .map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock_qty: product.stockQty,
          category: product.categoryId,
          images: product.images || [],
          primary_image: product.images?.[0]?.imageUrl || require('../../images/product-01.jpg'),
          sku: product.sku
        }))
        .slice(0, 8); // Lấy 8 sản phẩm
      
      setProducts(productData);
      setImages(imagesData || []);
      setRelatedProducts(related);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setLoading(false);
    }
  };

  //Handle functions
  const handleAddToCart = () => {
    // Check if user is logged in
    if (!currentUser) {
      if (window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến trang đăng nhập?")) {
        navigate("/login");
      }
      return;
    }

    // Validate size and color selection
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước!");
      return;
    }
    if (!selectedColor) {
      alert("Vui lòng chọn màu sắc!");
      return;
    }

    // Check stock
    if (products.stockQty <= 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    // Prepare product data
    const productData = {
      id: products.id,
      name: products.name,
      price: products.price,
      primary_image: images?.[0]?.imageUrl || require('../../images/product-01.jpg'),
      stock_qty: products.stockQty
    };

    // Add to cart
    addToCart(productData, quantity, selectedSize, selectedColor);
    
    if (window.swal) {
      window.swal(products.name, "đã được thêm vào giỏ hàng!", "success");
    } else {
      alert(`${products.name} đã được thêm vào giỏ hàng!`);
    }
  };

  const handleAddToWishlist = () => {
    // Check if user is logged in
    if (!currentUser) {
      if (window.confirm("Bạn cần đăng nhập để thêm vào danh sách yêu thích. Chuyển đến trang đăng nhập?")) {
        navigate("/login");
      }
      return;
    }

    // Prepare product data for wishlist
    const productData = {
      id: products.id,
      name: products.name,
      price: products.price,
      primary_image: images?.[0]?.imageUrl || require('../../images/product-01.jpg'),
      description: products.description,
      stock_qty: products.stockQty
    };

    // Toggle wishlist
    const isAdded = toggleWishlist(productData);
    
    // Show notification
    if (window.swal) {
      if (isAdded) {
        window.swal(products.name, "đã được thêm vào danh sách yêu thích!", "success");
      } else {
        window.swal(products.name, "đã được xóa khỏi danh sách yêu thích!", "info");
      }
    } else {
      alert(isAdded 
        ? `${products.name} đã được thêm vào danh sách yêu thích!` 
        : `${products.name} đã được xóa khỏi danh sách yêu thích!`
      );
    }
  };

  // Handle slider navigation
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      if (sliderRef.current) {
        sliderRef.current.scrollLeft -= 300;
      }
    }
  };

  const handleNextSlide = () => {
    const maxSlide = Math.ceil(relatedProducts.length - 4);
    if (currentSlide < maxSlide) {
      setCurrentSlide(currentSlide + 1);
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 300;
      }
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle add to wishlist for related products
  const handleAddToWishlistRelated = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!currentUser) {
      if (window.confirm("Bạn cần đăng nhập để thêm vào danh sách yêu thích. Chuyển đến trang đăng nhập?")) {
        navigate("/login");
      }
      return;
    }

    // Toggle wishlist
    const isAdded = toggleWishlist(product);
    
    // Show notification
    if (window.swal) {
      if (isAdded) {
        window.swal(product.name, "đã được thêm vào yêu thích!", "success");
      } else {
        window.swal(product.name, "đã được xóa khỏi yêu thích!", "info");
      }
    }
  };

  //Render loading state
  if (loading) {
    return (
      <div className="container p-t-80 p-b-80">
        <div className="text-center">
          <p>Đang Tải......</p>
        </div>
      </div>
    );
  }

  //Render error state
  if (!products) {
    return (
      <div className="container p-t-80 p-b-80">
        <div className="text-center">
          <h3>Không tìm thấy sản phẩm</h3>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Lấy danh sách hình ảnh
  const imageUrls = images && images.length > 0 
    ? images.map(img => img.imageUrl || img.image_url)
    : [products?.primary_image || require('../../images/product-01.jpg')];

  //Main render
  return (
    <section className="sec-product-detail bg0 p-t-65 p-b-60">
      {/* BreadCrumb */}
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
            <i
              className="fa fa-angle-right m-l-9 m-r-10"
              aria-hidden="true"
            ></i>
          </a>
          <span className="stext-109 cl4">{products.name}</span>
        </div>
      </div>

      {/* Product Detail Content*/}
      <div className="container">
        <div className="row">
          {/* Image Gallery */}
          <div className="col-md-6 col-lg-7 p-b-30">
            <div className="p-l-25 p-r-30 p-lr-0-lg">
              {/* Main Image */}
              <div className="wrap-pic-w pos-relative mb-3">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={products.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "500px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.src = require("../../images/product-01.jpg");
                  }}
                />
              </div>
              {/* Thumbnail Images */}
              {imageUrls.length > 1 && (
                <div className="d-flex justify-content-center flex-wrap">
                  {imageUrls.map((img, index) => (
                    <div
                      key={index}
                      className={`m-2 ${
                        currentImageIndex === index
                          ? "border border-primary"
                          : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        width: "80px",
                        height: "80px",
                        overflow: "hidden",
                        borderRadius: "4px",
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${products.name} ${index + 1}`}
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
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Product detail section */}
          <div className="col-md-6 col-lg-5 p-b-30">
          <div className="p-r-15 p-t-5 p-lr-0-lg">
            {/* Product name */}
            <h4
              className="mtext-105 cl2 js-name-detail p-b-10"
              style={{ fontSize: "20px" }}
            >
              {" "}
              {products.name}
            </h4>

            {/* Product price */}
            <span className="mtext-106" style={{ fontSize: "22px", color: '#e65540' }}>
              {typeof products.price === "number"
                ? products.price.toLocaleString('vi-VN')
                : products.price}
              <span style={{ fontSize: '0.85em' }}>đ</span>
            </span>

            {/* Stock status */}
            {products.stockQty !== undefined && (
              <div className="p-t-10">
                <span
                  className={`stext-102 ${
                    products.stockQty > 0 ? "cl3" : "cl10"
                  }`}
                  style={{ fontSize: "13px" }}
                >
                  {products.stockQty > 0
                    ? `Số lượng có sẵn: ${products.stockQty} sản phẩm`
                    : "Hết hàng"}
                </span>
              </div>
            )}

            {/* Product Description */}
            <p
              className="stext-102 cl3 p-t-15"
              style={{ fontSize: "13px", lineHeight: "1.6" }}
            >
              {products.description || "Chưa có mô tả cho sản phẩm này."}
            </p>

            {/* Product Options */}
            <div className="p-t-20">
              {/* Size Selection */}
              <div className="flex-w flex-r-m p-b-10">
                <div className="size-203 flex-c-m respon6">Kích thước</div>
                <div className="size-204 respon6-next">
                  <div className="rs1-select2 bor8 bg0">
                    <select
                      className="js-select2"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #e6e6e6",
                        borderRadius: "2px",
                        fontSize: "14px",
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
                <div className="size-203 flex-c-m respon6">Màu sắc</div>
                <div className="size-204 respon6-next">
                  <div className="rs1-select2 bor8 bg0">
                    <select
                      className="js-select2"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        border: "1px solid #e6e6e6",
                        borderRadius: "2px",
                        fontSize: "14px",
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
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
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
                    disabled={products.stockQty <= 0}
                    style={{ fontSize: "14px" }}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>

            {/* Social and Wishlist */}
            <div className="flex-w flex-m p-l-100 p-t-40 respon7">
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
            {products.sku && (
              <div className="p-t-20">
                <span className="stext-107 cl6">
                  Mã Sản Phẩm: {products.sku}
                </span>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Tabs Section */}
          <div className="bor10 m-t-50 p-t-43 p-b-40">
            {/* Tab navigation */}
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item p-b-10">
              <a className="nav-link active" data-toggle="tab" href="#description" role="tab">
                Mô tả
              </a>
            </li>
            <li className="nav-item p-b-10">
              <a className="nav-link" data-toggle="tab" href="#information" role="tab">
                Thông tin bổ sung
              </a>
            </li>
            <li className="nav-item p-b-10">
              <a className="nav-link" data-toggle="tab" href="#reviews" role="tab">
                Đánh giá
              </a>
            </li>
          </ul>

            {/* Tab content */}
          <div className="tab-content p-t-43">
            <div className="tab-pane fade show active" id="description" role="tabpanel">
              <div className="how-pos2 p-lr-15-md">
                <p className="stext-102 cl6">
                  {products.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
              </div>
            </div>

            <div className="tab-pane fade" id="information" role="tabpanel">
              <div className="row">
                <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                  <ul className="p-lr-28 p-lr-15-sm">
                    {products.sku && (
                      <li className="flex-w flex-t p-b-7">
                        <span className="stext-102 cl3 size-205">Mã Sản Phẩm</span>
                        <span className="stext-102 cl6 size-206">{products.sku}</span>
                      </li>
                    )}
                    {products.stockQty !== undefined && (
                      <li className="flex-w flex-t p-b-7">
                        <span className="stext-102 cl3 size-205">Tồn kho</span>
                        <span className="stext-102 cl6 size-206">{products.stockQty} sản phẩm</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="reviews" role="tabpanel">
              <div className="row">
                <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                  <div className="p-b-30 m-lr-15-sm">
                    <p className="stext-102 cl6">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="sec-relate-product bg0 p-t-45 p-b-105">
      <div className="container">
            <div className="p-b-45">
              <h3 className="ltext-106 cl5 txt-center">
          Sản phẩm liên quan
        </h3>
            </div>

            {/* Slider Container */}
            <div className="wrap-slick2">
              <div className="position-relative">
                {/* Previous Button */}
                <button
                  className="arrow-slick2 prev-slick2"
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  style={{
                    position: 'absolute',
                    left: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    background: '#fff',
                    border: '1px solid #e6e6e6',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentSlide === 0 ? 0.5 : 1,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (currentSlide !== 0) {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.borderColor = '#ccc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e6e6e6';
                  }}
                >
                  <i className="fa fa-angle-left" style={{ fontSize: '20px', color: '#666' }}></i>
                </button>

                {/* Products Slider */}
                <div 
                  ref={sliderRef}
                  className="slick2"
                  style={{
                    display: 'flex',
                    overflowX: 'hidden',
                    scrollBehavior: 'smooth',
                    gap: '20px',
                    padding: '0 10px'
                  }}
                >
                  {relatedProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="item-slick2"
                      style={{ 
                        minWidth: 'calc(25% - 20px)',
                        maxWidth: 'calc(25% - 20px)',
                        flex: '0 0 auto'
                      }}
                    >
                      {/* Block2 - Compact Version */}
                      <div className="block2" style={{ marginBottom: 0 }}>
                        <div 
                          className="block2-pic hov-img0"
                          style={{
                            overflow: 'hidden',
                            position: 'relative',
                            paddingBottom: '120%', // Aspect ratio
                            backgroundColor: '#f5f5f5'
                          }}
                        >
                          <img 
                            src={product.primary_image} 
                            alt={product.name}
                            style={{ 
                              cursor: 'pointer',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onClick={() => handleProductClick(product.id)}
                            onError={(e) => {
                              e.target.src = require('../../images/product-01.jpg');
                            }}
                          />

                          <button 
                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 trans-04"
                            onClick={() => handleProductClick(product.id)}
                            style={{
                              fontSize: '12px',
                              padding: '8px 12px',
                              height: 'auto'
                            }}
                          >
                            Xem nhanh
                          </button>
                        </div>

                        <div className="block2-txt flex-w flex-t p-t-12">
                          <div className="block2-txt-child1 flex-col-l" style={{ width: '80%' }}>
                            <a 
                              href="#"
                              className="stext-104 cl4 hov-cl1 trans-04 p-b-4"
                              onClick={(e) => {
                                e.preventDefault();
                                handleProductClick(product.id);
                              }}
                              style={{
                                fontSize: '14px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.4'
                              }}
                            >
                              {product.name}
                            </a>

                            <span className="stext-105" style={{ fontSize: '15px', fontWeight: '500', color: '#e65540' }}>
                              {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') : product.price}
                              <span style={{ fontSize: '0.85em' }}>đ</span>
                            </span>
                          </div>

                          <div className="block2-txt-child2 flex-r p-t-3" style={{ width: '20%' }}>
                            <a 
                              href="#"
                              className={`btn-addwish-b2 dis-block pos-relative ${isInWishlist(product.id) ? 'js-addedwish-b2' : ''}`}
                              onClick={(e) => handleAddToWishlistRelated(product, e)}
                              style={{ padding: 0 }}
                            >
                              <img 
                                className="icon-heart1 dis-block trans-04" 
                                src={iconHeart1} 
                                alt="ICON"
                                style={{ width: '18px', height: '18px' }}
                              />
                              <img 
                                className="icon-heart2 dis-block trans-04 ab-t-l" 
                                src={iconHeart2} 
                                alt="ICON"
                                style={{ width: '18px', height: '18px' }}
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  className="arrow-slick2 next-slick2"
                  onClick={handleNextSlide}
                  disabled={currentSlide >= Math.ceil(relatedProducts.length - 4)}
                  style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    background: '#fff',
                    border: '1px solid #e6e6e6',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: currentSlide >= Math.ceil(relatedProducts.length - 4) ? 'not-allowed' : 'pointer',
                    opacity: currentSlide >= Math.ceil(relatedProducts.length - 4) ? 0.5 : 1,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    if (currentSlide < Math.ceil(relatedProducts.length - 4)) {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.borderColor = '#ccc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e6e6e6';
                  }}
                >
                  <i className="fa fa-angle-right" style={{ fontSize: '20px', color: '#666' }}></i>
                </button>
              </div>
            </div>
      </div>
        </section>
      )}
    </section>
  );
}
