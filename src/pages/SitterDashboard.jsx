// pages/SitterDashboard.jsx
import { useState } from 'react';
import Header from '../components/Header';
import SitterCard from '../components/SitterCard';
import { Funnel } from 'lucide-react';

const SitterDashboard = () => {
  const [filters, setFilters] = useState({
    city: '',
    maxPrice: '',
    minRating: '',
    availability: ''
  });

  // Données des baby-sitters
  const sitters = [
    {
      id: 1,
      name: "Inès R.",
      city: "Tunis",
      price: 15,
      rating: 4.9,
      reviews: 42,
      specialty: "Nourrissons",
      available: true,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Asma T.",
      city: "nebel",
      price: 18,
      rating: 4.8,
      reviews: 38,
      specialty: "Multi-enfants",
      available: true,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Nessrin K.",
      city: "Sfax",
      price: 16,
      rating: 4.7,
      reviews: 29,
      specialty: "Urgences",
      available: false,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Samar M.",
      city: "Soussa",
      price: 20,
      rating: 5.0,
      reviews: 56,
      specialty: "Nourrissons",
      available: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    }
  ];

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
    console.log('Voir le profil de:', sitter.name);
    // window.location.href = `/sitter/${sitter.id}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        logoText="SmartBabyCare"
        onSearchClick={handleSearch}
        onBookingsClick={handleBookings}
        onMessagesClick={handleMessages}
        onAccountClick={handleAccount}
        userAuthenticated={true}
        userName="Mon compte"
      />

      {/* Contenu principal */}
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
            {/* Filtre Ville */}
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

            {/* Filtre Prix max */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prix max
              </label>
              <select
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tous</option>
                <option value="15">15DNT/h max</option>
                <option value="20">20DNT/h max</option>
                <option value="25">25DNT/h max</option>
              </select>
            </div>

            {/* Filtre Note min */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note min
              </label>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tous</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.7">4.7+ ⭐</option>
                <option value="4.9">4.9+ ⭐</option>
              </select>
            </div>

            {/* Filtre Disponibilité */}
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
                <option value="now">Disponible maintenant</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
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
                onViewProfile: handleViewProfile
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

export default SitterDashboard;