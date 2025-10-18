import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/Pages/NavBar';
import Login from './components/Pages/Login';
import Signup from './components/Pages/signup';
import MainContent from './components/MainContent';
import Banner from './components/Pages/Banner';
import Slider from './components/Slider';
import Products from './components/Products';
import ProductDetail from './components/Pages/ProductDetail';
import About from './components/Pages/About';
import Footer from './components/Pages/Footer';
import Search from './components/Search';
import Contact from './components/Pages/Contact';
import Blog from './components/Pages/Blog';
import BlogDetails from './components/Pages/BlogDetails';
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
      <Router>
        <div className="App">
          <NavBar onSearchClick={() => setShowSearch(true)} />
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
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;