import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Messages';

export const messageService = {
  // Récupérer les messages
  getMessagesByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur API getMessages:', error);
      throw error;
    }
  },

  // Envoyer un message
  sendMessage: async (senderId, receiverId, text) => {
    try {
      const response = await axios.post(`${API_URL}/send`, { senderId, receiverId, text });
      return response.data;
    } catch (error) {
      console.error('Erreur API sendMessage:', error);
      throw error;
    }
  }
};

export default messageService;