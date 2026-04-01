import axios from 'axios';

const API_URL = '/api/Messages';

// Normalement il faut récupérer les headers (Token) si l'API est protégée.
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const messageService = {
  // Récupérer la liste des messages d'un utilisateur
  getMessagesByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur getMessagesByUser:', error);
      throw error;
    }
  },

  // Envoyer un nouveau message
  sendMessage: async (senderId, receiverId, text) => {
    try {
      const response = await axios.post(`${API_URL}/send`, { senderId, receiverId, text });
      return response.data;
    } catch (error) {
      console.error('Erreur sendMessage:', error);
      throw error;
    }
  }
};

export default messageService;
