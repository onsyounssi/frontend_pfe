// services/sitterProfileService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/SitterProfiles";

const getAuthHeaders = (multipart = false) => ({
  headers: {
    "Content-Type": multipart ? "multipart/form-data" : "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const sitterProfileService = {
  // Créer son profil baby-sitter (avec photo)
  createProfile: async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        formData,
        getAuthHeaders(true)
      );
      return response.data;
    } catch (error) {
      console.error("Erreur createProfile:", error);
      throw error;
    }
  },

  // Récupérer son propre profil (sitter connecté)
  getMyProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur getMyProfile:", error);
      throw error;
    }
  },

  // Récupérer tous les profils (public)
  getAllSitters: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur getAllSitters:", error);
      throw error;
    }
  },

  // Récupérer un profil par ID (public)
  getSitterById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur getSitterById:", error);
      throw error;
    }
  },

  // Récupérer un profil par USER ID (pour messagerie / contact)
  getSitterByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur getSitterByUserId:", error);
      throw error;
    }
  },
};

export default sitterProfileService;
