// services/bookingService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/Bookings";

const getAuthHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const bookingService = {
  // ─────────────────────────────────────────
  // Parent: créer une réservation
  // ─────────────────────────────────────────
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}/`, bookingData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur createBooking:", error);
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // Parent: mes réservations
  // ─────────────────────────────────────────
  getMyBookingsAsParent: async () => {
    try {
      const response = await axios.get(`${API_URL}/parent/mes-reservations`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur getMyBookingsAsParent:", error);
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // Sitter: mes demandes de garde
  // ─────────────────────────────────────────
  getMyBookingsAsSitter: async () => {
    try {
      const response = await axios.get(`${API_URL}/sitter/mes-demandes`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur getMyBookingsAsSitter:", error);
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // Mettre à jour le statut
  // ─────────────────────────────────────────
  updateStatus: async (id, statut) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/status`,
        { statut },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Erreur updateStatus:", error);
      throw error;
    }
  },

  // Compatibilité ancienne méthode
  updateBooking: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/status`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur updateBooking:", error);
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // Admin: toutes les réservations
  // ─────────────────────────────────────────
  getAllBookings: async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur getAllBookings:", error);
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // Supprimer une réservation
  // ─────────────────────────────────────────
  deleteBooking: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Erreur deleteBooking:", error);
      throw error;
    }
  },
};

export default bookingService;
