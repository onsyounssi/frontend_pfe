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
      const response = await axios.put(
        `http://localhost:5000/api/Users/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message || "Mot de passe réinitialisé avec succès !");

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || "Une erreur est survenue.";
        if (err.response.status === 404 || err.response.status === 400) {
          setError("Token invalide ou expiré. Veuillez demander un nouveau lien.");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Impossible de contacter le serveur. Erreur lors de la réinitialisation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* Partie gauche avec le dégradé */}
              <div className="relative p-10 text-white bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-500 flex flex-col justify-center min-h-[400px]">
                <svg viewBox="0 0 600 600" aria-hidden="true" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ opacity: 0.28 }}>
                  <defs>
                    <radialGradient id="b1" cx="30%" cy="30%" r="60%">
                      <stop offset="0" stopColor="rgba(255,255,255,0.95)"></stop>
                      <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                    </radialGradient>
                    <radialGradient id="b2" cx="70%" cy="40%" r="55%">
                      <stop offset="0" stopColor="rgba(255,255,255,0.85)"></stop>
                      <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="600" height="600" fill="transparent"></rect>
                  <circle cx="140" cy="150" r="120" fill="url(#b1)"></circle>
                  <circle cx="440" cy="190" r="150" fill="url(#b2)"></circle>
                </svg>

                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3.5 h-3.5" aria-hidden="true">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      <path d="M20 2v4"></path>
                      <path d="M22 4h-4"></path>
                      <circle cx="4" cy="20" r="2"></circle>
                    </svg>
                    <span>SmartBabyCare</span>
                  </div>

                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight">NOUVEAU DÉPART</h2>
                  <p className="mt-4 text-white/85 leading-relaxed text-lg">
                    Choisissez soigneusement votre nouveau mot de passe. Assurez-vous d'utiliser une combinaison sécurisée.
                  </p>
                </div>
              </div>

              {/* Partie droite avec le formulaire */}
              <div className="p-10 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                      Sécurité
                    </p>
                    <p className="text-xl font-bold text-gray-900 mt-2">Nouveau mot de passe</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>

                {/* Affichage des erreurs / messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-start shadow-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {message ? (
                  <div className="mb-6 py-10 bg-green-50/50 rounded-2xl text-green-800 text-sm flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">{message}</span>
                    <span className="mt-2 text-green-700">Redirection vers la page de connexion en cours...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="relative">
                      <label className="block text-sm">
                        <span className="font-semibold text-gray-800 mb-2 block">Nouveau mot de passe</span>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-4 h-4">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                          <input
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 caractères"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition pl-11"
                            type="password"
                            disabled={loading}
                          />
                        </div>
                      </label>
                    </div>

                    <div className="relative">
                      <label className="block text-sm">
                        <span className="font-semibold text-gray-800 mb-2 block">Confirmer le mot de passe</span>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </div>
                          <input
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Répéter le mot de passe"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition pl-11"
                            type="password"
                            disabled={loading}
                          />
                        </div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`mt-4 w-full py-4 rounded-xl font-semibold text-white shadow-lg transition duration-200 flex justify-center items-center ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5'}`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Réinitialisation...
                        </>
                      ) : 'Valider le nouveau mot de passe'}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}