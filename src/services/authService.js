import api from "./api";

const authService = {
  // Register new user
  register: async (email, password) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Registration failed" };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Login failed" };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
