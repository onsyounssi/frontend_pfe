// ResetPassword.jsx
import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/Users/reset-password/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Mot de passe réinitialisé avec succès!");
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
      setPassword("");
      setConfirmPassword("");
      
    } catch (err) {
      console.error("Erreur:", err);
      
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Une erreur est survenue.";
        
        if (err.response.status === 400) {
          setError(errorMessage);
        } else if (err.response.status === 404) {
          setError("Token invalide ou expiré. Veuillez demander un nouveau lien.");
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        setError("Impossible de se connecter au serveur.");
      } else {
        setError("Erreur lors de la réinitialisation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "50px auto", 
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Réinitialiser le mot de passe
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            ❌ {error}
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            ✅ {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s"
          }}
        >
          {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
}