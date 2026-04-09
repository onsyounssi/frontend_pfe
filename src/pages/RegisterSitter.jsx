// pages/RegisterSitter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ChevronRight } from 'lucide-react';
import sitterProfileService from '../services/sitterProfileService';

const RegisterSitter = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingProfileId, setExistingProfileId] = useState(null);

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    tarifHoraire: '',
    experience: '',
    localisation: '',
    specialite: '',
    description: '',
    langues: '',
    image: null,
    disponibilites: {
      lun: false, mar: false, mer: false,
      jeu: false, ven: false, sam: false, dim: false
    }
  });

  const dayLabels = {
    lun: 'Lun', mar: 'Mar', mer: 'Mer',
    jeu: 'Jeu', ven: 'Ven', sam: 'Sam', dim: 'Dim'
  };

  const specialites = [
    'Garde d\'enfants',
    'Nourrissons (0-2 ans)',
    'Enfants (2-6 ans)',
    'Enfants (6-12 ans)',
    'Devoirs / Soutien scolaire',
    'Besoins spéciaux',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheck = (day) => {
    setFormData(prev => ({
      ...prev,
      disponibilites: { ...prev.disponibilites, [day]: !prev.disponibilites[day] }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // Charger le profil existant si présent
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await sitterProfileService.getMyProfile();
        if (profile) {
          setExistingProfileId(profile._id);
          setFormData({
            prenom: profile.prenom || '',
            nom: profile.nom || '',
            tarifHoraire: profile.tarifHoraire || '',
            experience: profile.experience || '',
            localisation: profile.localisation || '',
            specialite: profile.specialite || '',
            description: profile.description || '',
            langues: Array.isArray(profile.langues) ? profile.langues.join(', ') : '',
            image: null,
            disponibilites: profile.disponibilites || {
              lun: false, mar: false, mer: false,
              jeu: false, ven: false, sam: false, dim: false
            }
          });
          if (profile.image && profile.image !== 'default.jpg') {
            setImagePreview(`http://localhost:5000/uploads/${profile.image}`);
          }
        }
      } catch (err) {
        console.log("Aucun profil existant trouvé, prêt pour la création.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Vérifications
    if (!formData.prenom.trim()) { setError('Le prénom est requis'); setSubmitting(false); return; }
    if (!formData.nom.trim()) { setError('Le nom est requis'); setSubmitting(false); return; }
    if (!formData.tarifHoraire) { setError('Le tarif horaire est requis'); setSubmitting(false); return; }

    try {
      const data = new FormData();
      data.append('prenom', formData.prenom);
      data.append('nom', formData.nom);
      data.append('tarifHoraire', formData.tarifHoraire);
      data.append('experience', formData.experience);
      data.append('localisation', formData.localisation);
      data.append('specialite', formData.specialite);
      data.append('description', formData.description);
      data.append('langues', formData.langues);
      data.append('disponibilites', JSON.stringify(formData.disponibilites));
      if (formData.image) data.append('image', formData.image);

      let response;
      if (existingProfileId) {
        response = await sitterProfileService.updateProfile(existingProfileId, data);
      } else {
        response = await sitterProfileService.createProfile(data);
      }

      if (response.success || response.profile || response._id) {
        setSuccess(`🎉 Profil ${existingProfileId ? 'mis à jour' : 'créé'} avec succès ! Redirection...`);
        setTimeout(() => navigate('/baby-sitter'), 1500);
      } else {
        setError(response.message || 'Erreur lors de l’enregistrement du profil');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erreur lors de la création du profil';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white text-2xl mb-4 shadow-lg">
          🌟
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {existingProfileId ? 'Modifiez votre' : 'Créez votre'} fiche professionnelle
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Les parents verront ce profil pour vous contacter et réserver</p>

        {/* Étapes */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {[
            { num: '✓', label: 'Compte', done: true },
            { num: '✓', label: 'Infos', done: true },
            { num: '3', label: 'Fiche pro', active: true },
            { num: '4', label: 'Dashboard', done: false }
          ].map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-6 h-px bg-gray-300" />}
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-green-500 text-white' : step.active ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step.num}
                </div>
                <span className={`text-xs ${step.active ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-indigo-100">
        {/* Bannière */}
        <div className="bg-gradient-to-r from-indigo-500 to-pink-500 px-8 py-4">
          <p className="text-white font-semibold text-sm">📋 Remplissez tous les champs pour un profil complet et attractif</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Photo de profil */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Photo de profil</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview
                    ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    : <Camera className="w-8 h-8 text-gray-400" />
                  }
                </div>
                <div>
                  <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-sm font-semibold transition">
                    Choisir une photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG — Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Infos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom *</label>
                <input
                  name="prenom" value={formData.prenom} onChange={handleChange}
                  placeholder="Votre prénom" required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom *</label>
                <input
                  name="nom" value={formData.nom} onChange={handleChange}
                  placeholder="Votre nom" required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tarif horaire (DNT/h) *</label>
                <input
                  name="tarifHoraire" type="number" min="1" value={formData.tarifHoraire} onChange={handleChange}
                  placeholder="Ex: 15" required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ville / Localisation</label>
                <input
                  name="localisation" value={formData.localisation} onChange={handleChange}
                  placeholder="Ex: Tunis, Ariana..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expérience</label>
                <input
                  name="experience" value={formData.experience} onChange={handleChange}
                  placeholder="Ex: 3 ans d'expérience"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Spécialité */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Spécialité</label>
              <div className="flex flex-wrap gap-2">
                {specialites.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setFormData(prev => ({ ...prev, specialite: s }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${formData.specialite === s
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                      }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Langues */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Langues parlées</label>
              <input
                name="langues" value={formData.langues} onChange={handleChange}
                placeholder="Ex: Français, Arabe, Anglais"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">Séparez par des virgules</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Présentation *</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                placeholder="Parlez de vous, de votre expérience, de vos qualités..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Disponibilités */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Disponibilités *</label>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(dayLabels).map(([key, label]) => (
                  <button
                    key={key} type="button"
                    onClick={() => handleCheck(key)}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition flex flex-col items-center gap-1 ${formData.disponibilites[key]
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300'
                      }`}
                  >
                    {label}
                    <span className="text-xs">{formData.disponibilites[key] ? '✓' : '—'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/baby-sitter')}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition"
              >
                Passer →
              </button>
              <button
                type="submit" disabled={submitting}
                className={`flex-1 py-3 rounded-xl font-semibold text-white text-sm shadow-lg transition flex items-center justify-center gap-2 ${submitting ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
                  }`}
              >
                <Save size={16} />
                {submitting ? 'Enregistrement...' : existingProfileId ? 'Mettre à jour mon profil' : 'Enregistrer mon profil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSitter;