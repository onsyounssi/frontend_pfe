import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/parent/Header';
import bookingService from '../services/bookingService';

function ParentDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getAllBookings();
        // Optionnel: filtrer les données ici avec data.filter(b => b.parentId === myId) si on gère l'auth complète
        setBookings(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des réservations", err);
        setError("Impossible de charger les réservations. Activez le backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const now = new Date();

  // Séparer les gardes en "prochaines" (date de début au futur ou statut pending) et "passées" (statut completed ou date de fin dépassée)
  const prochainesGardes = bookings.filter(b => new Date(b.dateDebut) >= now || b.statut === 'pending' || b.statut === 'confirmed');
  const gardesPassees = bookings.filter(b => new Date(b.dateDebut) < now && b.statut === 'completed');

  // Formatage des dates pour l'affichage
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await fetch(`/api/Bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'cancelled' })
        });
        // Rafraîchir les réservations
        const data = await bookingService.getAllBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Erreur d'annulation", err);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mon tableau de bord</h2>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 line-clamp-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochaines gardes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : prochainesGardes.length}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-10 h-10 text-pink-500" aria-hidden="true">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 line-clamp-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gardes passées</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : gardesPassees.length}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-10 h-10 text-green-500" aria-hidden="true">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 line-clamp-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Baby-sitters favoris</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-10 h-10 text-pink-500 fill-pink-500" aria-hidden="true">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
              </svg>
            </div>
          </div>
        </div>

        {error && <div className="p-4 mb-4 bg-red-100 text-red-600 rounded-lg">{error}</div>}

        {/* Prochaines gardes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Prochaines gardes ({prochainesGardes.length})</h3>

          {loading && <p className="text-pink-500 animate-pulse">Chargement...</p>}
          {!loading && prochainesGardes.length === 0 && <p className="text-gray-500">Aucune garde planifiée pour l'instant.</p>}

          <div className="space-y-4">
            {prochainesGardes.map((booking, index) => (
              <div key={booking._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{booking.sitterId ? 'Baby-sitter assigné' : 'En attente d\'attribution'}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.statut === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {booking.statut === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                        <span>{formatDate(booking.dateDebut)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10"></circle></svg>
                        <span>{formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}</span>
                      </div>
                    </div>
                    <p className="text-sm border flex font-bold w-[max-content] rounded p-1 text-gray-600 mt-2">{booking.montantTotale || 0} DNT</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-semibold"
                    >
                      Annuler
                    </button>
                    {booking.statut === 'confirmed' && (
                      <button
                        onClick={() => navigate('/chat')}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-semibold"
                      >
                        Contacter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historique ({gardesPassees.length})</h3>

          {loading && <p className="text-pink-500 animate-pulse">Chargement...</p>}
          {!loading && gardesPassees.length === 0 && <p className="text-gray-500">Aucune garde complétée trouvée dans l'historique.</p>}

          <div className="space-y-4">
            {gardesPassees.map((booking, index) => (
              <div key={booking._id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 opacity-70">Garde Complétée</h4>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                        Terminée
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                        <span>{formatDate(booking.dateDebut)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2"></path><circle cx="12" cy="12" r="10"></circle></svg>
                        <span>{formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{booking.montantTotale || 0} DNT</span>
                    <button
                      onClick={() => navigate('/reviews')}
                      className="px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition text-sm font-semibold shadow-sm"
                    >
                      Revoir & Evaluer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ParentDashboard;