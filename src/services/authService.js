import axios from "axios";
const API_URL = "http://localhost:5000/api/Users";

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};
export const loginUser = async (credentials) => {
  try {
    console.log("Envoi requête à:", `${API_URL}/login`);
    console.log("Données envoyées:", credentials);
    
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role
    });

    console.log("Réponse brute:", response);
    console.log("Données reçues:", response.data);

    // La structure de réponse dépend de votre backend
    const data = response.data;

    // Vérifiez la structure exacte de votre réponse backend
    // et ajustez en conséquence
    if (data.success || data.token) {
      if (credentials.rememberMe && data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      return {
        success: true,
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user || data.data?.user // Ajustez selon votre structure
      };
    } else {
      return {
        success: false,
        message: data.message || "Erreur de connexion"
      };
    }

  } catch (error) {
    console.error("Erreur axios:", error);
    
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.log("Données d'erreur:", error.response.data);
      console.log("Status:", error.response.status);
      console.log("Headers:", error.response.headers);
      
      return {
        success: false,
        message: error.response.data.message || `Erreur ${error.response.status}: Problème de connexion`
      };
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.log("Pas de réponse du serveur");
      return {
        success: false,
        message: "Le serveur ne répond pas. Vérifiez qu'il est bien démarré."
      };
    } else {
      // Erreur de configuration
      return {
        success: false,
        message: error.message || "Erreur de configuration"
      };
    }
  }
};
