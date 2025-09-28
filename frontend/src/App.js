import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/signup';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Quản Lý Cửa Hàng
          </a>
          <div className="navbar-nav ms-auto">
            <button 
              className={`nav-link btn ${currentView === 'login' ? 'active' : ''}`}
              onClick={switchToLogin}
            >
              Đăng nhập
            </button>
            <button 
              className={`nav-link btn ${currentView === 'signup' ? 'active' : ''}`}
              onClick={switchToSignup}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'login' && <Login onSwitchToSignup={switchToSignup} />}
        {currentView === 'signup' && <Signup onSwitchToLogin={switchToLogin} />}
      </main>
    </div>
  );
}

export default App;
