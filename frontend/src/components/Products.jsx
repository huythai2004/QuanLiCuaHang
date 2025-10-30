import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Isotope from "isotope-layout";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import "../css/main.css";
import "../css/util.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../fonts/iconic/css/material-design-iconic-font.min.css";
import iconHeart1 from "../images/icons/icon-heart-01.png";
import iconHeart2 from "../images/icons/icon-heart-02.png";
import Filter from "./Filter";
import QuickViewModal from "./QuickViewModal";

export default function Products() {
  const { currentUser } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("*");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isotopeRef = useRef(null);
  const gridRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => {
        // Transform data từ Java format sang JS format
        const transformedData = data.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price,
          stock_qty: product.stockQty,
          category: getCategoryName(product.categoryId),
          images: product.images || [],
          primary_image:
            product.images?.[0]?.imageUrl ||
            require("../images/product-01.jpg"),
          sku: product.sku,
          isActive: product.isActive,
        }));

        setProducts(transformedData);
        setFilteredProducts(transformedData);
      })
      .catch((e) => {
        console.error("API Error: ", e);
        setProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  // Helper function để map category ID sang tên
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      1: "men", // Quần áo nam
      2: "women", // Quần áo nữ
      3: "shoes", // Giày
      4: "watches", // Đồng hồ
    };
    return categoryMap[categoryId] || "all";
  };

  // Initialize Isotope
  useEffect(() => {
    if (gridRef.current && filteredProducts.length > 0) {
      // Destroy existing isotope instance if exists
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
      }

      // Initialize isotope with Isotope constructor
      setTimeout(() => {
        isotopeRef.current = new Isotope(gridRef.current, {
          itemSelector: ".isotope-item",
          layoutMode: "fitRows",
          percentPosition: true,
          masonry: {
            columnWidth: ".isotope-item",
          },
        });
      }, 100);
    }

    return () => {
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
      }
    };
  }, [filteredProducts]);

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setActiveFilter(category);

    if (isotopeRef.current) {
      isotopeRef.current.arrange({
        filter: category === "*" ? "*" : `.${category}`,
      });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle filter change from Filter component
  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Apply price filter
    if (filters.price !== "all") {
      if (filters.price.includes("+")) {
        // Handle "20000000+" case
        const minPrice = parseInt(filters.price.replace("+", ""));
        filtered = filtered.filter((p) => p.price >= minPrice);
      } else {
        // Handle range cases like "0-1000000"
        const [min, max] = filters.price.split("-").map((p) => parseInt(p));
        filtered = filtered.filter((p) => p.price >= min && p.price <= max);
      }
    }

    // Apply sort
    switch (filters.sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newness":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "popularity":
      case "rating":
      case "default":
      default:
        break;
    }

    // Apply color filter (if you have color data in products)
    if (filters.colors && filters.colors.length > 0) {
      // Add color filtering logic when you have color field in product data
    }

    // Apply tags filter (if you have tags in products)
    if (filters.tags && filters.tags.length > 0) {
      // Add tags filtering logic when you have tags field in product data
    }

    setFilteredProducts(filtered);
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
    if (showSearchPanel) setShowSearchPanel(false);
  };

  // Toggle search panel
  const toggleSearchPanel = () => {
    setShowSearchPanel(!showSearchPanel);
    if (showFilterPanel) setShowFilterPanel(false);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (product, e) => {
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
        window.swal(product.name, "đã được thêm vào danh sách yêu thích!", "success");
      } else {
        window.swal(product.name, "đã được xóa khỏi danh sách yêu thích!", "info");
      }
    } else {
      alert(isAdded 
        ? `${product.name} đã được thêm vào danh sách yêu thích!` 
        : `${product.name} đã được xóa khỏi danh sách yêu thích!`
      );
    }
  };

  // Handle quick view
  const handleQuickView = async (product) => {
    try {
      // Fetch product images from API
      const response = await fetch(
        `http://localhost:8080/product-images/product/${product.id}`
      );
      const images = await response.json();

      // Merge product data with images
      const productWithImages = {
        ...product,
        images: images && images.length > 0 ? images : product.images || [],
      };

      setSelectedProduct(productWithImages);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Vẫn hiển thị modal với dữ liệu cơ bản nếu có lỗi
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="bg0 p-t-23 p-b-140">
        <div className="container">
          <div className="p-b-10">
            <h3 className="ltext-103 cl5">Product Overview</h3>
          </div>

          <div className="flex-w flex-sb-m p-b-52">
            {/* Filter buttons */}
            <div className="flex-w flex-l-m filter-tope-group m-tb-10">
              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeFilter === "*" ? "how-active1" : ""
                }`}
                onClick={() => handleCategoryFilter("*")}
              >
                All Products
              </button>

              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeFilter === "women" ? "how-active1" : ""
                }`}
                onClick={() => handleCategoryFilter("women")}
              >
                Women
              </button>

              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeFilter === "men" ? "how-active1" : ""
                }`}
                onClick={() => handleCategoryFilter("men")}
              >
                Men
              </button>

              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeFilter === "shoes" ? "how-active1" : ""
                }`}
                onClick={() => handleCategoryFilter("shoes")}
              >
                Shoes
              </button>

              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeFilter === "watches" ? "how-active1" : ""
                }`}
                onClick={() => handleCategoryFilter("watches")}
              >
                Watches
              </button>
            </div>

            {/* Filter and Search buttons */}
            <div className="flex-w flex-c-m m-tb-10">
              <div
                className={`flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 ${
                  showFilterPanel ? "show-filter" : ""
                }`}
                onClick={toggleFilterPanel}
              >
                <i
                  className={`icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list ${
                    showFilterPanel ? "dis-none" : ""
                  }`}
                ></i>
                <i
                  className={`icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close ${
                    showFilterPanel ? "" : "dis-none"
                  }`}
                ></i>
                Filter
              </div>

              <div
                className={`flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 ${
                  showSearchPanel ? "show-search" : ""
                }`}
                onClick={toggleSearchPanel}
              >
                <i
                  className={`icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search ${
                    showSearchPanel ? "dis-none" : ""
                  }`}
                ></i>
                <i
                  className={`icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close ${
                    showSearchPanel ? "" : "dis-none"
                  }`}
                ></i>
                Search
              </div>
            </div>

            {/* Search panel */}
            {showSearchPanel && (
              <div className="panel-search w-full p-t-10 p-b-15">
                <div className="bor8 dis-flex p-l-15">
                  <button className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                    <i className="zmdi zmdi-search"></i>
                  </button>
                  <input
                    className="mtext-107 cl2 size-114 plh2 p-r-15"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            )}

            {/* Filter panel */}
            {showFilterPanel && <Filter onFilterChange={handleFilterChange} />}
          </div>

          {/* Products grid */}
          <div className="row isotope-grid" ref={gridRef}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.category}`}
              >
                <div className="block2">
                  <div className="block2-pic hov-img0">
                    <img
                      src={
                        product.primary_image ||
                        product.images?.[0]?.image_url ||
                        require("../images/product-01.jpg")
                      }
                      alt={product.name}
                      onError={(e) => {
                        // Fallback nếu ảnh không load được
                        e.target.src = require("../images/product-01.jpg");
                      }}
                    />
                    <a
                      href="#"
                      className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickView(product);
                      }}
                    >
                      Quick View
                    </a>
                  </div>

                  <div className="block2-txt flex-w flex-t p-t-14">
                    <div className="block2-txt-child1 flex-col-l">
                      <a
                        href={`product/${product.id}`}
                        className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/product/${product.id}`);
                        }}
                        // title={product.description}
                      >
                        {product.name}
                      </a>

                      <span className="stext-105" style={{ color: '#e65540' }}>
                        {typeof product.price === "number"
                          ? product.price.toLocaleString('vi-VN')
                          : product.price}
                        <span style={{ fontSize: '0.85em' }}>đ</span>
                      </span>
                      {product.stock_qty !== undefined && (
                        <span className="stext-107 cl6 p-t-5">
                          {product.stock_qty > 0
                            ? `Số lượng sản phẩm: ${product.stock_qty}`
                            : "Out of stock"}
                        </span>
                      )}
                    </div>

                    <div className="block2-txt-child2 flex-r p-t-3">
                      <a
                        href="#"
                        className={`btn-addwish-b2 dis-block pos-relative js-addwish-b2 ${isInWishlist(product.id) ? 'js-addedwish-b2' : ''}`}
                        onClick={(e) => handleAddToWishlist(product, e)}
                      >
                        <img
                          className="icon-heart1 dis-block trans-04"
                          src={iconHeart1}
                          alt="ICON"
                        />
                        <img
                          className="icon-heart2 dis-block trans-04 ab-t-l"
                          src={iconHeart2}
                          alt="ICON"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load more */}
          <div className="flex-c-m flex-w w-full p-t-45">
            <a
              href="#"
              className="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
            >
              Load More
            </a>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
