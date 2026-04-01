// pages/FindSitters.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SitterCard from '../components/SitterCard';
import { Funnel, Loader } from 'lucide-react';
import sitterService from '../services/sitterService';

const FindSitters = () => {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    maxPrice: '',
    minRating: '',
    availability: ''
  });

  // Charger les sitters depuis l'API
  useEffect(() => {
    loadSitters();
  }, []);

  const loadSitters = async () => {
    try {
      setLoading(true);
      const data = await sitterService.getAllSitters();
      // Transformer les données du backend pour correspondre au format attendu par SitterCard
      const formattedSitters = data.map(sitter => ({
        id: sitter._id,
        name: sitter.nom,
        city: sitter.localisation || 'Non spécifié',
        price: sitter.tarifHoraire,
        rating: sitter.noteMoyenne || 0,
        reviews: sitter.nbAvis || 0,
        specialty: sitter.specialite || 'Garde d\'enfants',
        available: checkAvailability(sitter.disponibilites),
        image: sitter.image ? `http://localhost:5000/uploads/${sitter.image}` : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        description: sitter.description,
        experience: sitter.experience,
        langues: sitter.langues,
        disponibilites: sitter.disponibilites
      }));
      setSitters(formattedSitters);
      setError(null);
    } catch (err) {
      console.error('Erreur de chargement:', err);
      setError('Impossible de charger les baby-sitters. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier la disponibilité pour aujourd'hui
  const checkAvailability = (disponibilites) => {
    if (!disponibilites) return false;
    const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    const today = days[new Date().getDay()];
    return disponibilites[today] || false;
  };

  // Gestionnaires de navigation
  const handleSearch = () => {
    console.log('Navigation vers recherche');
  };

  const handleBookings = () => {
    console.log('Navigation vers réservations');
  };

  const handleMessages = () => {
    console.log('Navigation vers messages');
  };

  const handleAccount = () => {
    console.log('Navigation vers compte');
  };

  const handleViewProfile = (sitter) => {
    window.location.href = `/profil/${sitter.id}`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrage des sitters
  const filteredSitters = sitters.filter(sitter => {
    if (filters.city && !sitter.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.maxPrice && sitter.price > parseInt(filters.maxPrice)) return false;
    if (filters.minRating && sitter.rating < parseFloat(filters.minRating)) return false;
    if (filters.availability === 'now' && !sitter.available) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des baby-sitters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSitters}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        logoText="SmartBabyCare"
        onSearchClick={handleSearch}
        onBookingsClick={handleBookings}
        onMessagesClick={handleMessages}
        onAccountClick={handleAccount}
        userAuthenticated={true}
        userName="Recherche"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Trouvez votre baby-sitter
        </h2>

        {/* Section Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Funnel className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Ex: Tunis"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix max (DNT/h)
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Prix maximum"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note minimum
              </label>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Toutes</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.7">4.7+ ⭐</option>
                <option value="4.9">4.9+ ⭐</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Disponibilité
              </label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tous</option>
                <option value="now">Disponible aujourd'hui</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-pink-600">{filteredSitters.length}</span> baby-sitters trouvés
          </p>
        </div>

        {/* Liste des baby-sitters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSitters.map((sitter) => (
            <SitterCard
              key={sitter.id}
              sitter={{
                ...sitter,
                onViewProfile: () => handleViewProfile(sitter)
              }}
            />
          ))}
        </div>

        {filteredSitters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun baby-sitter ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindSitters;
