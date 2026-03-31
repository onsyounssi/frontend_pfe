import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParentForm from '../components/forms/ParentForm';
import BabysitterForm from '../components/forms/BabysitterForm';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On récupère le user depuis le localStorage suite au register
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRole(parsed.role || 'parente');
      setLoading(false);
    } else {
      // Pour les tests, on peut forcer un statut s'il manque
      // navigate('/login');
      setRole('parente');
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmitProfile = async (formData) => {
    try {
      console.log("Envoi des données de profil :", formData);
      // TODO: Appeler une API backend pour sauvegarder ces détails.
      // Ex: await sitterProfileService.createProfile(formData);

      alert("Votre profil a bien été complété !");

      // Redirection selon le rôle
      if (role === 'baby-sitter') {
        navigate('/baby-sitter');
      } else {
        navigate('/parente');
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde du profil : " + err.message);
    }
  };

  const handleCancel = () => {
    // Si la personne annule, on l'envoie sur le dashboard mais avec un profil incomplet
    if (role === 'baby-sitter') navigate('/baby-sitter');
    else navigate('/parente');
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><p className="text-pink-600 animate-pulse font-bold text-lg">Préparation de votre profil...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Bienvenue sur SmartBabyCare
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
          Pour vous offrir la meilleure expérience, veuillez compléter informations de votre profil {role === 'parente' ? 'Parent' : 'Baby-sitter'}.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-pink-100">
          {role === 'parente' ? (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-4 text-pink-600 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Vos Informations Parentales
              </div>
              <ParentForm onSubmit={handleSubmitProfile} onCancel={handleCancel} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-4 text-indigo-600 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                Votre Parcours Baby-Sitter
              </div>
              <BabysitterForm onSubmit={handleSubmitProfile} onCancel={handleCancel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
