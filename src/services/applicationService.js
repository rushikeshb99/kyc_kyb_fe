import api from "./api";

const applicationService = {
  // Create new application
  createApplication: async (data) => {
    try {
      const response = await api.post("/applications/", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to create application" };
    }
  },

  // Get all applications
  getAllApplications: async () => {
    try {
      const response = await api.get("/applications/");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch applications" };
    }
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch application" };
    }
  },

  // Get user's applications
  getUserApplications: async (userId) => {
    try {
      const response = await api.get(`/applications/user/${userId}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { error: "Failed to fetch user applications" }
      );
    }
  },

  // Submit application for review
  submitApplication: async (applicationId) => {
    try {
      const response = await api.put(`/applications/${applicationId}/submit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to submit application" };
    }
  },

  // Get complete application data
  getCompleteApplication: async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}/complete`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Failed to fetch complete application",
        }
      );
    }
  },
};

export default applicationService;
