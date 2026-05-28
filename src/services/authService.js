// services/authService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/Users`
  : "/api/Users";

// Helper: récupérer le token stocké
export const getToken = () => localStorage.getItem("token");

// Helper: headers avec token
export const authHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

// ─────────────────────────────────────────────
// Inscription
// ─────────────────────────────────────────────
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    // Stocker automatiquement le token et le user dans localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("API Register Error:", error);
    throw error;
  }
};

// ─────────────────────────────────────────────
// Connexion
// ─────────────────────────────────────────────
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    const data = response.data;

    // Stocker token et user
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return {
      success: true,
      data,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || "Email ou mot de passe incorrect",
        status: error.response.status,
      };
    }

    return {
      success: false,
      message: "Erreur de connexion au serveur",
    };
  }
};

// ─────────────────────────────────────────────
// Déconnexion
// ─────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ─────────────────────────────────────────────
// Récupérer l'utilisateur connecté
// ─────────────────────────────────────────────
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCurrentToken = () => localStorage.getItem("token");

// ─────────────────────────────────────────────
// Mot de passe oublié
// ─────────────────────────────────────────────
export const requestForgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const confirmPasswordChange = async (email, token) => {
  const response = await axios.post(`${API_URL}/confirm-password-change`, {
    email: decodeURIComponent(email),
    token,
  });
  const data = response.data || {};
  if (!data.success) {
    const err = new Error(data.message || "Confirmation impossible");
    err.response = { data };
    throw err;
  }
  return data;
};