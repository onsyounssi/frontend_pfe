import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../services/authService";
import Toast from '../components/common/Toast';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [toast, setToast] = useState(null); // Notifications Premium
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Restriction numérique pour le téléphone
    if (name === 'phone' && value !== '' && !/^[0-9+]*$/.test(value)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const tunisianPhoneRegex = /^(?:\+216|00216)?[24579]\d{7}$/;

    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';

    // Validation Téléphone
    const phoneValue = formData.phone.trim();
    if (!phoneValue) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!tunisianPhoneRegex.test(phoneValue)) {
      newErrors.phone = 'Format tunisien invalide (ex: 20123456)';
    }

    // Validation Email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.role) newErrors.role = 'Veuillez sélectionner un rôle';
    if (!formData.password || formData.password.length !== 8) {
      newErrors.password = 'Le mot de passe doit faire exactement 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await registerUser(userData);

      if (response.success) {
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.token) localStorage.setItem('token', response.token);
        }

        setToast({ message: 'Inscription réussie ! Bienvenue sur SmartBabyCare.', type: 'success' });

        setTimeout(() => navigate('/complete-profile'), 3000);
      } else {
        setServerError(response.message || "Erreur d'inscription");
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton Retour Accueil */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Retour à l'accueil
        </button>

        <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Panel - Branding */}
            <div className="relative p-10 text-white bg-gradient-to-br from-pink-500 via-fuchsia-500 to-indigo-500">
              <svg viewBox="0 0 600 600" aria-hidden="true" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ opacity: 0.28 }}>
                <defs>
                  <radialGradient id="rb1" cx="30%" cy="30%" r="60%">
                    <stop offset="0" stopColor="rgba(255,255,255,0.95)"></stop>
                    <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                  </radialGradient>
                  <radialGradient id="rb2" cx="70%" cy="40%" r="55%">
                    <stop offset="0" stopColor="rgba(255,255,255,0.85)"></stop>
                    <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                  </radialGradient>
                  <radialGradient id="rb3" cx="55%" cy="75%" r="55%">
                    <stop offset="0" stopColor="rgba(255,255,255,0.9)"></stop>
                    <stop offset="1" stopColor="rgba(255,255,255,0)"></stop>
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="600" height="600" fill="transparent"></rect>
                <circle cx="140" cy="150" r="120" fill="url(#rb1)"></circle>
                <circle cx="440" cy="190" r="150" fill="url(#rb2)"></circle>
                <circle cx="340" cy="460" r="170" fill="url(#rb3)"></circle>
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

                <h2 className="mt-6 text-4xl font-extrabold tracking-tight">CRÉER UN COMPTE</h2>
                <p className="mt-3 text-white/85 leading-relaxed">Créez un compte parent ou baby-sitter en quelques secondes.</p>

                <div className="mt-8 space-y-3 text-sm text-white/85">
                  <p className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4" aria-hidden="true">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    <span>Profil vérifié (UI)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4" aria-hidden="true">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    </svg>
                    <span>Confirmation email (mock)</span>
                  </p>
                </div>
              </div>
            </div>


            <div className="p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Inscription</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">SmartBabyCare</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-4 h-4" aria-hidden="true">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>

              {serverError && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ligne Nom & Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Nom</label>
                    <div className="relative">
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nom"
                        className={`w-full rounded-2xl border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition`}
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Prénom</label>
                    <div className="relative">
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                        className={`w-full rounded-2xl border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition`}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Téléphone - MODIFIÉ : Largeur complète identique à l'Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Téléphone</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ex: 20123456"
                      className={`w-full rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Email - Largeur complète */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" /></svg>
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="adresse@gmail.com"
                      className={`w-full rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Rôle - Design Premium */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Rôle *</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full appearance-none rounded-2xl border ${errors.role ? 'border-red-500 shadow-sm shadow-red-50' : 'border-gray-200 hover:border-gray-300'} bg-white pl-11 pr-10 py-3.5 text-sm text-gray-900 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all duration-200 shadow-sm`}
                    >
                      <option value="">Choisir un rôle...</option>
                      <option value="parente">Parent</option>
                      <option value="baby-sitter">Baby-sitter</option>
                    </select>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                  {errors.role && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.role}</p>}
                </div>



                {/* Mots de passe - Design Harmonisé */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mot de passe */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Mot de passe *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        maxLength={8}
                        placeholder="••••••••"
                        className={`w-full rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white pl-11 pr-12 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition shadow-sm`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
                  </div>

                  {/* Confirmation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Confirmation *</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        maxLength={8}
                        placeholder="••••••••"
                        className={`w-full rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-white pl-11 pr-12 py-3 text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition shadow-sm`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition ${isLoading ? 'bg-pink-400 cursor-wait' : 'bg-pink-600 hover:bg-pink-700 hover:scale-[1.01]'}`}
                >
                  {isLoading ? 'Inscription en cours...' : 'S’inscrire'}
                </button>
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-xs text-gray-600">J'accepte les conditions</span>
                  </label>
                  <button type="button" onClick={() => navigate('/login')} className="text-xs font-bold text-gray-900 hover:text-pink-600">Déjà un compte ?</button>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs -mt-2">{errors.acceptTerms}</p>}

                <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p class="font-semibold text-gray-900 mb-2">Conseil</p>
                  <p class="text-gray-600">Choisissez votre rôle et complétez vos informations pour un matching rapide.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;