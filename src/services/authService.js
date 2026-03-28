import axios from "axios";
const API_URL = "http://localhost:5000/api/Users";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-throw to be caught in component
  }
};
export const loginUser = async (credentials) => {
  try {
    
    // Option 1: If your backend uses /users/login
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    // Option 2: If your backend uses /login
    // const response = await axios.post(`${API_URL}/login`, {
    //   email: credentials.email,
    //   password: credentials.password
    // });
    
    // Option 3: If your backend uses /users/login
    // const response = await axios.post(`${API_URL}/users/login`, {
    //   email: credentials.email,
    //   password: credentials.password
    // });
    
    return {
      success: true,
      data: response.data,
      refreshToken: response.data.refreshToken || null
    };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Email ou mot de passe incorrect',
        status: error.response.status
      };
    }
    
    return {
      success: false,
      message: 'Erreur de connexion au serveur'
    };
  }
};