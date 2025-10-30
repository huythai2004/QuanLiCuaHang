import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/Layout/Header';
import Login from './components/Pages/Login';
import Signup from './components/Pages/signup';
import ResetPassword from './components/Pages/ResetPassword';
import MainContent from './components/MainContent';
import Banner from './components/Layout/Banner';
import Slider from './components/Layout/Slider';
import Products from './components/Products';
import ProductDetail from './components/Pages/ProductDetail';
import About from './components/Pages/About';
import Footer from './components/Layout/Footer';
import Search from './components/Search';
import Contact from './components/Pages/Contact';
import Blog from './components/Pages/Blog';
import BlogDetails from './components/Pages/BlogDetails';
import Cart from './components/Cart/Cart';
import Payment from './components/Cart/Payment';
import UserOrders from './components/Pages/UserOrders';
import OrderDetail from './components/Pages/OrderDetail';
import UserProfile from './components/Dashboard/UserProfile';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import './css/main.css';
import './css/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';

// Component cho trang Home
function HomePage() {
  return (
    <>
      <Slider />
      <Banner />
      <Products />
    </>
  );
}

// Component cho trang Products
function ProductsPage() {
  return <Products />;
}

function App() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="App">
              <Header onSearchClick={() => setShowSearch(true)} />
              <Search show={showSearch} onClose={() => setShowSearch(false)} />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/blog' element = {<Blog />} />
              <Route path='/blog-details' element = {<BlogDetails/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path='/Cart' element={<Cart/>} />
              <Route path='/payment' element={<Payment/>} />
              <Route path='/my-orders' element={<UserOrders/>} />
              <Route path='/order-detail/:orderId' element={<OrderDetail/>} />
              <Route path='/order/:id' element={<OrderDetail/>} />
              <Route path='/profile' element={<UserProfile/>} />
              <Route path='/admin' element={<AdminDashboard/>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;