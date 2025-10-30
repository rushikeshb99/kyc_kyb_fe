import api from "./api";

const documentService = {
  // Upload document
  uploadDocument: async (applicationId, formData) => {
    try {
      const response = await api.post(
        `/documents/upload/${applicationId}`,
        formData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to upload document" };
    }
  },

  // Get application documents
  getApplicationDocuments: async (applicationId) => {
    try {
      const response = await api.get(`/documents/application/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch documents" };
    }
  },

  // Delete document
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Failed to delete document" };
    }
  },
};

export default documentService;
