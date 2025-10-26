import api from "./api";

const profileService = {
  // Create or update profile
  saveProfile: async (applicationId, profileData) => {
    try {
      const response = await api.post(
        `/profiles/${applicationId}`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to save profile" };
    }
  },

  // Get profile data
  getProfile: async (applicationId) => {
    try {
      const response = await api.get(`/profiles/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch profile" };
    }
  },
};

export default profileService;
