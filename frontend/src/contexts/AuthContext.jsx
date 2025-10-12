import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// API base URL - adjust this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8080/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register new user - Call backend API
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Đăng ký thất bại!');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Không thể kết nối đến server!');
      }
    }
  };

  // Login user - Call backend API
  const login = async (emailOrPhone, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        emailOrPhone: emailOrPhone,
        password: password
      });

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

