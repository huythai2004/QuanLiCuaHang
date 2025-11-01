import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = "http://localhost:8080/api/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  //Optional: auto sync user state <-> localstorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Register new user - Call backend API
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Đăng ký thất bại!");
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Không thể kết nối đến server!");
      }
    }
  };

  // Login user - Call backend API
  const login = async (emailOrPhone, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        emailOrPhone: emailOrPhone,
        password: password,
      });

      console.log("Login response:", response.data);
      console.log("Response success:", response.data.success);
      console.log("Response user:", response.data.user);

      if (response.data.success && response.data.user) {
        const user = response.data.user;

        // Handle roles - backend sends Set which is serialized as array in JSON
        let role = "CUSTOMER"; // Default role
        if (user.roles) {
          if (Array.isArray(user.roles) && user.roles.length > 0) {
            // Get first role from array - extract code if it's an object
            const firstRole = user.roles[0];
            if (typeof firstRole === "string") {
              role = firstRole;
            } else if (firstRole && firstRole.code) {
              role = firstRole.code;
            } else if (firstRole && firstRole.name) {
              role = firstRole.name;
            }
          } else if (
            typeof user.roles === "object" &&
            !Array.isArray(user.roles)
          ) {
            // Handle object (should not happen but safe check)
            const roleKeys = Object.keys(user.roles);
            if (roleKeys.length > 0) {
              role = roleKeys[0];
            }
          }
        }

        console.log("User roles from backend:", user.roles);
        console.log("Selected role:", role);

        const formattedUser = {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: role,
        };

        setCurrentUser(formattedUser);
        localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        console.log("Logged in user: ", formattedUser);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
