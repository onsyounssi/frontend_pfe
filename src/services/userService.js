import axios from 'axios';

// Utilise le proxy Vite `/api` ou l'URL du backend direct si configuré
const API_URL = '/api/Users';

// Configuration du header Authorization avec le token JWT du localstorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const userService = {
  // Récupérer la liste complète des utilisateurs (nécessite rôle admin)
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      throw error;
    }
  },

  // Ajouter un nouvel utilisateur depuis l'admin
  createUser: async (userData) => {
    try {
      // Axios va automatiquement s'occuper de `multipart/form-data` si on a une `avatar/image` mais pour l'instant on garde une route standard ou `/ajouter`
      const response = await axios.post(`${API_URL}/ajouter`, userData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur createUser:', error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  }
};

export default userService;
