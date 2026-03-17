import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    alert("Veuillez contacter support@demo.com pour réinitialiser votre mot de passe.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CORRECTION: Ici c'est setIsLoading(true) et non false
    setIsLoading(true);
    setError("");

    try {
      console.log("Tentative de connexion avec:", { email, password, role, rememberMe });
      
      const response = await loginUser({ email, password, role, rememberMe });
      
      console.log("Réponse reçue:", response);

      // Vérifier si la réponse est réussie
      if (response.success) {
        const { token, user } = response;

        // Stocker les informations
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Stocker le refresh token si rememberMe est coché
        if (rememberMe && response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // Rediriger selon le rôle (en minuscules pour correspondre à la BDD)
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "parent") {
          navigate("/parent");
        } else if (user.role === "babysitter") {
          navigate("/babysitter");
        } else {
          // Rôle par défaut
          navigate("/");
        }
      } else {
        setError(response.message || "Email, mot de passe ou rôle incorrect");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Une erreur est survenue lors de la connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Partie gauche avec le dégradé */}
              <div className="relative p-10 text-white bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-500">
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
                    <radialGradient id="b3" cx="55%" cy="75%" r="55%">
                      <stop offset="0" stopColor="rgba(255,255,255,0.9)"></stop>
                      <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="600" height="600" fill="transparent"></rect>
                  <circle cx="140" cy="150" r="120" fill="url(#b1)"></circle>
                  <circle cx="440" cy="190" r="150" fill="url(#b2)"></circle>
                  <circle cx="340" cy="460" r="170" fill="url(#b3)"></circle>
                </svg>
                
                <div className="relative">
                  <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3.5 h-3.5" aria-hidden="true">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      <path d="M20 2v4"></path>
                      <path d="M22 4h-4"></path>
                      <circle cx="4" cy="20" r="2"></circle>
                    </svg>
                    <span>SmartBabyCare</span>
                  </div>
                  
                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight">WELCOME BACK</h2>
                  <p className="mt-3 text-white/85 leading-relaxed">
                    Espace sécurisé pour les parents et baby-sitters vérifiés.
                  </p>
                  
                  <div className="mt-8 space-y-3 text-sm text-white/85">
                    <p className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4" aria-hidden="true">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span>Connexion sécurisée</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4" aria-hidden="true">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      </svg>
                      <span>Support: support@demo.com</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Partie droite avec le formulaire */}
              <div className="p-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                      Login Account
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">SmartBabyCare</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-4 h-4" aria-hidden="true">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>

                {/* Affichage des erreurs */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block text-sm">
                      <span className="font-semibold text-gray-800">Email</span>
                      <div className="mt-2 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4" aria-hidden="true">
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                        </div>
                        <input
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="parent@exemple.com"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11"
                          type="email"
                          required
                        />
                      </div>
                    </label>

                    <label className="block text-sm">
                      <span className="font-semibold text-gray-800">Rôle</span>
                      <div className="mt-2 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-4 h-4" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <select
                          name="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11 appearance-none"
                          required
                        >
                          <option value="">Sélectionner un rôle</option>
                          <option value="parent">Parent</option>
                          <option value="babysitter">Baby-sitter</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-4 h-4" aria-hidden="true">
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </div>
                      </div>
                    </label>
                  </div>

                  <label className="block text-sm">
                    <span className="font-semibold text-gray-800">Mot de passe</span>
                    <div className="mt-2 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-4 h-4" aria-hidden="true">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <input
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11"
                        type="password"
                        required
                      />
                    </div>
                  </label>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 rounded-2xl font-semibold text-white shadow-lg transition ${
                      isLoading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
                    }`}
                  >
                    {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-500 focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span>Se souvenir de moi</span>
                    </label>
                    
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="inline-flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle w-4 h-4" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                      <span>Mot de passe oublié ?</span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-2">Accès démo</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Admin</p>
                        <p className="font-mono text-xs">admin@demo.com</p>
                        <p className="font-mono text-xs">Password123!</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Parent</p>
                        <p className="font-mono text-xs">parent@demo.com</p>
                        <p className="font-mono text-xs">Password123!</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sitter</p>
                        <p className="font-mono text-xs">sitter@demo.com</p>
                        <p className="font-mono text-xs">Password123!</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 text-xs">
                      Utilisez les identifiants démo pour tester les différents rôles.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
        
export default Login;