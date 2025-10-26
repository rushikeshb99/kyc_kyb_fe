import api from "./api";

const adminService = {
  // Get pending applications
  getPendingApplications: async () => {
    try {
      const response = await api.get("/admin/applications/pending");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Failed to fetch pending applications",
        }
      );
    }
  },

  // Review application (approve/reject)
  reviewApplication: async (applicationId, reviewData) => {
    try {
      const response = await api.put(
        `/admin/applications/${applicationId}/review`,
        reviewData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to review application" };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { error: "Failed to fetch dashboard stats" }
      );
    }
  },
};

export default adminService;
