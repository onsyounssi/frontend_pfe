import axios from 'axios';

const API_URL = '/api/Reviews';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const reviewService = {
  // Récupérer toutes les reviews
  getReviews: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data; // retourne un tableau d'objets Review
    } catch (error) {
      console.error('Erreur getReviews:', error);
      throw error;
    }
  },

  // Créer un nouvel avis
  createReview: async (reviewData) => {
    // reviewData: { note, commentaire, auteur, date }
    try {
      const response = await axios.post(`${API_URL}/ajouter`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Erreur createReview:', error);
      throw error;
    }
  }
};

export default reviewService;
