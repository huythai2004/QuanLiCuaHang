import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import logo from "../../images/icons/logo-01.png";
import "../../css/main.css";
import "../../css/util.css";

export default function Header({ onSearchClick }) {
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistTotal } = useWishlist();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <header>
      <div className="container-menu-desktop">
        <div className="top-bar">
          <div className="content-topbar flex-sb-m h-full container">
            <div className="left-top-bar">
              Free shipping for standard order over $100
            </div>
            <div className="right-top-bar flex-w h-full">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="flex-c-m trans-04 p-lr-25"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    <i
                      className="fa fa-user"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {currentUser.username}
                  </Link>
                  {currentUser.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex-c-m trans-04 p-lr-25"
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      <i
                        className="fa fa-dashboard"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    className="flex-c-m trans-04 p-lr-25"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    Đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-c-m trans-04 p-lr-25"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex-c-m trans-04 p-lr-25"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-c-m trans-04 p-lr-25"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <a
                href="#"
                className="flex-c-m trans-04 p-lr-25"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                EN
              </a>
              <a
                href="#"
                className="flex-c-m trans-04 p-lr-25"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                USD
              </a>
            </div>
          </div>
        </div>
        <div className={`wrap-menu-desktop ${isScrolled ? "scrolled" : ""}`}>
          <nav className="limiter-menu-desktop container">
            <Link to="/" className="logo">
              <img src={logo} alt="IMG-LOGO" />
            </Link>
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Shop</Link>
                </li>
                <li className="label1" data-label1="hot">
                  <Link to={"/cart"}>Features</Link>
                </li>
                <li>
                  <Link to={"/blog"}>Blog</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to={"/contact"}>Contact</Link>
                </li>
              </ul>
            </div>
            <div className="wrap-icon-header flex-w flex-r-m">
              <div
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search"
                onClick={onSearchClick}
                style={{ cursor: "pointer" }}
              >
                <i className="zmdi zmdi-search"></i>
              </div>
              <Link
                to="/cart"
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
                data-notify={getTotalItems()}
              >
                <i className="zmdi zmdi-shopping-cart"></i>
              </Link>
              <Link
                to="/profile"
                className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
                data-notify={getWishlistTotal()}
              >
                <i className="zmdi zmdi-favorite-outline"></i>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
