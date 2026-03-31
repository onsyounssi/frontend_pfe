import axios from 'axios';

const API_URL = '/api/Bookings';

export const bookingService = {
  // Récupérer la liste complète des réservations de type liste
  getAllBookings: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur getAllBookings:', error);
      throw error;
    }
  },

  // Ajouter une nouvelle réservation
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}/ajouter`, bookingData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur createBooking:', error);
      throw error;
    }
  },

  // Mettre à jour une réservation (ex: Annuler)
  updateBooking: async (id, bookingData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Erreur updateBooking:', error);
      throw error;
    }
  },

  // Supprimer une réservation
  deleteBooking: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur deleteBooking:', error);
      throw error;
    }
  }
};

export default bookingService;
