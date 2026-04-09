// services/sitterService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/SitterProfiles';

// Helper pour inclure le token JWT dans les requêtes protégées
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
    }
  };
};

const sitterService = {
  // Récupérer tous les sitters
  getAllSitters: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sitters:', error);
      throw error;
    }
  },

  // Récupérer un sitter par ID
  getSitterById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du sitter:', error);
      throw error;
    }
  },

  // Créer un nouveau sitter
  createSitter: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, formData, getAuthHeaders(true));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  },

  // Mettre à jour un sitter
  updateSitter: async (id, sitterData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, sitterData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  // Supprimer un sitter
  deleteSitter: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }
};

export default sitterService;