import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.error || "Login failed" };
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const data = await authService.register(email, password);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.error || "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
