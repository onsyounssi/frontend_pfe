import React, { useState } from 'react';
import{ registerUser } from "../services/authService";
    
function Register () {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.role) {
      newErrors.role = 'Veuillez sélectionner un rôle';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }

    return newErrors;
  };

  const registerUser= async (userData) => {
    // Simulation d'un appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Inscription réussie:', userData);
        resolve({ success: true, message: 'Compte créé avec succès!' });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Appel de la fonction register
      const response = await registerUser({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        acceptTerms: formData.acceptTerms
      });

      if (response.success) {
        // Redirection ou affichage d'un message de succès
        alert(response.message);
        // Réinitialiser le formulaire
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          role: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Right Panel - Form */}
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

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="font-semibold text-gray-800">Nom complet</span>
                    <div className="mt-2 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-4 h-4" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ex: Sarah Martin"
                        className={`w-full rounded-2xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                        type="text"
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </label>

                  <label className="block text-sm">
                    <span className="font-semibold text-gray-800">Téléphone</span>
                    <div className="mt-2 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4" aria-hidden="true">
                          <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                        </svg>
                      </div>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 6 00 00 00 00"
                        className={`w-full rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                        type="text"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="font-semibold text-gray-800">Email</span>
                  <div className="mt-2 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4" aria-hidden="true">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      </svg>
                    </div>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="parent@exemple.com"
                      className={`w-full rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                      type="email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </label>

                <label className="block text-sm">
                  <span className="font-semibold text-gray-800">Rôle</span>
                  <div className="mt-2 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4" aria-hidden="true">
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full appearance-none rounded-2xl border ${errors.role ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                    >
                      <option value="" disabled>Choisir…</option>
                      <option value="Parent">Parent</option>
                      <option value="Baby-sitter">Baby-sitter</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-4 h-4 rotate-90" aria-hidden="true">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                        type="password"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </label>

                  <label className="block text-sm">
                    <span className="font-semibold text-gray-800">Confirmer</span>
                    <div className="mt-2 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-4 h-4" aria-hidden="true">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition pl-11`}
                        type="password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-white shadow-lg transition ${
                    isLoading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  {isLoading ? 'Inscription en cours...' : 'S’inscrire'}
                </button>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-500 focus:ring-offset-0"
                      type="checkbox"
                    />
                    <span>J’accepte les conditions</span>
                  </label>
                  {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}
                  <button type="button" className="text-gray-700 hover:text-gray-900 font-semibold">
                    Déjà un compte ?
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-2">Conseil</p>
                  <p className="text-gray-600">Choisissez votre rôle et complétez vos informations pour un matching rapide.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;