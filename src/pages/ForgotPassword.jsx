// ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setMessage("");
    setError("");
    setLoading(true);

    // Validation email
    if (!email || !email.includes('@')) {
      setError("Veuillez entrer un email valide.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Users/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Email de réinitialisation envoyé avec succès!");
      setEmail("");
      
    } catch (err) {
      console.error("Erreur:", err);
      
      if (err.response) {
        // Le serveur a répondu avec une erreur
        const errorMessage = err.response.data?.message || err.response.data?.error || "Une erreur est survenue.";
        
        if (err.response.status === 404) {
          setError("Aucun compte trouvé avec cet email.");
        } else if (err.response.status === 400) {
          setError(errorMessage);
        } else if (err.response.status === 500) {
          setError("Erreur serveur. Veuillez réessayer plus tard.");
          console.error("Détails de l'erreur serveur:", err.response.data);
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        setError("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
      } else {
        setError("Erreur lors de l'envoi de la requête.");
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
          Mot de passe oublié
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
      </form>
    </div>
  );
}