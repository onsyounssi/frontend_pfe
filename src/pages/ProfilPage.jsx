// ProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Languages as LangIcon, Loader } from 'lucide-react';
import sitterService from '../services/sitterService';

function ProfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitter, setSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadSitterProfile();
    }
  }, [id]);

  const loadSitterProfile = async () => {
    try {
      setLoading(true);
      const data = await sitterService.getSitterById(id);

      // Transformer les données
      const formattedSitter = {
        id: data._id,
        name: data.nom,
        city: data.localisation || 'Non spécifié',
        price: data.tarifHoraire,
        rating: data.noteMoyenne || 0,
        reviews: data.nbAvis || 0,
        specialty: data.specialite || 'Garde d\'enfants',
        image: data.image ? `http://localhost:5000/uploads/${data.image}` : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        description: data.description,
        experience: data.experience,
        langues: data.langues || [],
        disponibilites: data.disponibilites || {},
        certifications: data.certification || 0
      };

      setSitter(formattedSitter);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger le profil du baby-sitter');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error || !sitter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error || "Profil non trouvé"}</p>
          <a href="/baby-sitter" className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
            Retour à la liste
          </a>
        </div>
      </div>
    );
  }

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayKeys = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <a href="/baby-sitter">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          </a>
          <h1 className="text-2xl font-bold text-pink-600">SmartBabyCare</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profil principal */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                alt={sitter.nom}
                className="w-full h-64 md:h-full object-cover"
                src={sitter.image}
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{sitter.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{sitter.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">{sitter.rating}</span>
                  <span className="text-gray-500">({sitter.reviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {sitter.specialty}
                </span>
                <span className="text-gray-600">{sitter.experience || 'Expérience non spécifiée'}</span>
              </div>

              <p className="text-gray-700 mb-4">
                {sitter.description || 'Aucune description disponible.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Langues</p>
                  <p className="font-semibold text-gray-900">
                    {sitter.langues.length > 0 ? sitter.langues.join(', ') : 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certifications</p>
                  <p className="font-semibold text-gray-900">{sitter.certifications}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-pink-600">{sitter.price} DNT/h</p>
                  <p className="text-sm text-gray-500">Tarif horaire</p>
                </div>
                <button onClick={() => navigate(`/reservation`, { state: { sitterId: sitter.id } })} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition font-semibold">
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disponibilités */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Disponibilités</h3>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">{day}</p>
                <div className={`h-10 rounded-lg flex items-center justify-center ${sitter.disponibilites[dayKeys[index]]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
                  }`}>
                  {sitter.disponibilites[dayKeys[index]] ? '✓' : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avis - À implémenter avec une vraie API */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avis ({sitter.reviews})</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Les avis seront bientôt disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilPage;