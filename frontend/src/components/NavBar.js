import React from "react";
import logo from "../images/icons/logo-01.png";
import "../css/main.css";
import "../css/util.css";
// import "../css/style.css";

function NavBar({ onSignIn, onSignUp, onLogoClick, onSearchClick }) {
  return (
    <header>
      <div className="container-menu-desktop">
        <div className="top-bar">
          <div className="content-topbar flex-sb-m h-full container">
            <div className="left-top-bar">
              Free shipping for standard order over $100
            </div>
            <div className="right-top-bar flex-w h-full">
              <button className="flex-c-m trans-04 p-lr-25 btn btn-link" onClick={onSignIn} style={{color: "#fff ", textDecoration: "arrow"}}>Sign In</button>
              <button className="flex-c-m trans-04 p-lr-25 btn btn-link" onClick={onSignUp} style={{color: "#fff", textDecoration: "arrow"}}>Sign Up</button>
              <a href="#" className="flex-c-m trans-04 p-lr-25" style={{color: "#fff ", textDecoration: "arrow"}}>EN</a>
              <a href="#" className="flex-c-m trans-04 p-lr-25" style={{color: "#fff ", textDecoration: "arrow"}}>USD</a>
            </div>
          </div>
        </div>
        <div className="wrap-menu-desktop">
          <nav className="limiter-menu-desktop container">
            <a href="#" className="logo" onClick={onLogoClick}>
              <img src={logo} alt="IMG-LOGO" />
            </a>
            <div className="menu-desktop">
              <ul className="main-menu">
                <li className="active-menu"><a href="#" onClick={onLogoClick}>Home</a></li>
                <li><a href="#">Shop</a></li>
                <li className="label1" data-label1="hot"><a href="#">Features</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="wrap-icon-header flex-w flex-r-m">
              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search"
              onClick={onSearchClick}
              style={{cursor: "pointer"}}>
                <i className="zmdi zmdi-search"></i>
              </div>
              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart" data-notify="2">
                <i className="zmdi zmdi-shopping-cart"></i>
              </div>
              <a href="#" className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti" data-notify="0">
                <i className="zmdi zmdi-favorite-outline"></i>
              </a>
            </div>
          </nav>
        </div>
      </div>
      {/* ...Header Mobile và menu mobile nếu cần... */}
    </header>
  );
}

export default NavBar;