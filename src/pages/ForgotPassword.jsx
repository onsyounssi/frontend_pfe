import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [resetUrl, setResetUrl] = useState(""); // Nouveau : lien direct
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /*const handleSubmit = async () => {
 await fetch("/api/auth/forgot-password", {
   method: "POST",
   headers: {"Content-Type": "application/json"},
   body: JSON.stringify({ email }),
 });
};*/


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setPreviewUrl("");
    setError("");
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError("Veuillez entrer une adresse email valide.");
      setLoading(false);
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${API}/api/Users/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message || "Email de réinitialisation envoyé avec succès !");
      setPreviewUrl(response.data.previewUrl || "");
      setResetUrl(response.data.resetUrl || ""); // Capture du lien direct
      setEmail("");
    } catch (err) {
      console.error("Full error object:", err);
      if (err.response) {
        const serverError = err.response.data?.error || "";
        const serverCode = err.response.data?.code || "";
        const errorMessage = err.response.data?.message || "Une erreur est survenue.";

        setError(`${errorMessage} ${serverError ? '(' + serverError + ')' : ''} ${serverCode ? '[Code: ' + serverCode + ']' : ''}`);
      } else {
        setError("Impossible de contacter le serveur. Veuillez vérifier votre connexion.");
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

                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight">MOT DE PASSE OUBLIÉ ?</h2>
                  <p className="mt-4 text-white/85 leading-relaxed text-lg">
                    Pas d'inquiétude, cela arrive à tout le monde. Entrez votre adresse e-mail et nous vous enverrons les instructions pour réinitialiser votre accès en toute sécurité.
                  </p>
                </div>
              </div>

              {/* Partie droite avec le formulaire */}
              <div className="p-10 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                      Récupération
                    </p>
                    <p className="text-xl font-bold text-gray-900 mt-2">Réinitialiser l'accès</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-sm border border-pink-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                  </div>
                </div>

                {/* Affichage des messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-start shadow-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {message && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex flex-col shadow-sm">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{message}</span>

                      {/* Bouton de secours si l'email n'est pas configuré */}
                      {resetUrl && (
                        <div className="mt-6 w-full">
                          <p className="text-xs text-gray-500 mb-2 italic">L'envoi d'e-mail est en pause. Cliquez ici pour continuer :</p>
                          <a
                            href={resetUrl}
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition shadow-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Réinitialiser maintenant
                          </a>
                        </div>
                      )}
                    </div>
                    {previewUrl && (
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="ml-8 mt-3 inline-block bg-white text-green-800 font-semibold border border-green-300 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors self-start shadow-sm">
                        📨 Voir l'e-mail de test reçu
                      </a>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm">
                      <span className="font-semibold text-gray-800 mb-2 block">Email associé au compte</span>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                        </div>
                        <input
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre-adresse@email.com"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition pl-11"
                          type="email"
                          disabled={loading}
                        />
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition duration-200 flex justify-center items-center ${loading ? 'bg-fuchsia-400 cursor-not-allowed' : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 hover:shadow-xl hover:-translate-y-0.5'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : 'Envoyer le lien de réinitialisation'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center justify-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span>Retour à la connexion</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}