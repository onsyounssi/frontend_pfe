// pages/CompleteProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Champs Parent ──
  const [parentData, setParentData] = useState({
    nombreEnfants: '',
    agesEnfants: '',
    adresse: '',
    besoinsSpeciaux: '',
    preferenceGarde: 'domicile',
    noteParent: ''
  });

  // ── Champs Baby-Sitter (info complémentaires pour CompleteProfile) ──
  const [sitterData, setSitterData] = useState({
    adresse: '',
    dateNaissance: '',
    niveauEtudes: '',
    motivations: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRole(parsed.role || 'parente');
    } else {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (role === 'parente') {
        // Sauvegarder les infos parentales dans localStorage (profil léger)
        localStorage.setItem('parentProfile', JSON.stringify({
          ...parentData,
          userId: user._id || user.id
        }));

        setSuccess('Profil complété ! Recherchez votre baby-sitter...');
        setTimeout(() => navigate('/recherche-sitters'), 1200);

      } else if (role === 'baby-sitter') {
        // Sauvegarder les infos complémentaires en localStorage (utilisées à l'étape suivante)
        localStorage.setItem('sitterExtra', JSON.stringify(sitterData));

        setSuccess('Informations enregistrées ! Complétez votre profil professionnel...');
        setTimeout(() => navigate('/register-sitter'), 1200);
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-indigo-50">
      <p className="text-pink-600 animate-pulse font-bold text-lg">Préparation de votre profil...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 flex flex-col justify-center py-12 px-4">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-500 text-white text-2xl mb-4 shadow-lg">
          {role === 'parente' ? '👶' : '🌟'}
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Bienvenue sur SmartBabyCare !
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          {role === 'parente'
            ? 'Quelques infos sur votre famille pour trouver le baby-sitter idéal'
            : 'Dites-nous en plus sur vous pour créer votre profil professionnel'}
        </p>

        {/* Étapes */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
            <span className="text-xs text-gray-500">Compte créé</span>
          </div>
          <div className="w-8 h-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-xs font-semibold text-gray-700">Profil</span>
          </div>
          {role === 'baby-sitter' && (
            <>
              <div className="w-8 h-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-xs text-gray-400">Fiche pro</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-pink-100">

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">⚠️ {error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">✅ {success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Formulaire PARENT ── */}
            {role === 'parente' && (
              <>
                <div className="border-b pb-3 mb-4 text-pink-600 font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  Vos Informations Parentales
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre d'enfants *</label>
                    <input
                      type="number" min="1" max="10"
                      value={parentData.nombreEnfants}
                      onChange={e => setParentData(p => ({ ...p, nombreEnfants: e.target.value }))}
                      required placeholder="Ex: 2"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Âges des enfants *</label>
                    <input
                      type="text"
                      value={parentData.agesEnfants}
                      onChange={e => setParentData(p => ({ ...p, agesEnfants: e.target.value }))}
                      required placeholder="Ex: 3 ans, 6 ans"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse *</label>
                  <input
                    type="text"
                    value={parentData.adresse}
                    onChange={e => setParentData(p => ({ ...p, adresse: e.target.value }))}
                    required placeholder="Ex: Tunis, Ariana..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type de garde préféré</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'domicile', label: '🏠 À domicile' },
                      { value: 'sitter', label: '🏡 Chez le sitter' }
                    ].map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setParentData(p => ({ ...p, preferenceGarde: opt.value }))}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition ${parentData.preferenceGarde === opt.value ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >{opt.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Besoins spéciaux (optionnel)</label>
                  <textarea
                    value={parentData.besoinsSpeciaux}
                    onChange={e => setParentData(p => ({ ...p, besoinsSpeciaux: e.target.value }))}
                    placeholder="Allergies, handicap, besoins particuliers..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
              </>
            )}

            {/* ── Formulaire BABY-SITTER ── */}
            {role === 'baby-sitter' && (
              <>
                <div className="border-b pb-3 mb-4 text-indigo-600 font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  Vos Informations Personnelles
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date de naissance *</label>
                    <input
                      type="date"
                      value={sitterData.dateNaissance}
                      onChange={e => setSitterData(p => ({ ...p, dateNaissance: e.target.value }))}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse *</label>
                    <input
                      type="text"
                      value={sitterData.adresse}
                      onChange={e => setSitterData(p => ({ ...p, adresse: e.target.value }))}
                      required placeholder="Votre ville"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Niveau d'études</label>
                  <select
                    value={sitterData.niveauEtudes}
                    onChange={e => setSitterData(p => ({ ...p, niveauEtudes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="bac">Baccalauréat</option>
                    <option value="bac+2">Bac+2</option>
                    <option value="bac+3">Licence</option>
                    <option value="bac+5">Master</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Motivations (optionnel)</label>
                  <textarea
                    value={sitterData.motivations}
                    onChange={e => setSitterData(p => ({ ...p, motivations: e.target.value }))}
                    placeholder="Pourquoi souhaitez-vous être baby-sitter ?"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit" disabled={submitting}
              className={`w-full py-3 rounded-xl font-semibold text-white text-sm shadow-lg transition ${submitting ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 active:scale-[0.99]'}`}
            >
              {submitting ? '⏳ Enregistrement...' : role === 'parente' ? 'Continuer → Rechercher un sitter' : 'Continuer → Créer mon profil pro'}
            </button>

            <button
              type="button"
              onClick={() => navigate(role === 'baby-sitter' ? '/register-sitter' : '/recherche-sitters')}
              className="w-full py-2.5 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition"
            >
              Passer cette étape →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
