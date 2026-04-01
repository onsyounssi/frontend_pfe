import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import bookingService from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

function SitterDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mySitterId, setMySitterId] = useState(null);

  useEffect(() => {
    // Obtenir l'id du sitter connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setMySitterId(user.id || user._id);
    }
  }, []);

  useEffect(() => {
    if (mySitterId) {
      fetchBookings();
    } else {
      setLoading(false); // Pas d'ID ? Pas la peine de chercher
    }
  }, [mySitterId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      // Filtrer les bookings où sitterId correspond à ce baby-sitter
      const myBookings = data.filter(b => b.sitterId === mySitterId);
      setBookings(myBookings);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos demandes de garde.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await fetch(`/api/Bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      });
      alert(`La demande a été mise à jour ! (${newStatus})`);
      fetchBookings();
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Séparation
  const pendingRequests = bookings.filter(b => b.statut === 'pending');
  const upcomingBookings = bookings.filter(b => b.statut === 'confirmed');

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mon Tableau de Bord Baby-Sitter</h2>

        {/* Notifications de demandes */}
        <div className="mb-8 relative">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            Nouvelles demandes
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingRequests.length}</span>
            )}
          </h3>

          {!mySitterId && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
              Connectez-vous avec un compte Baby-Sitter pour voir vos notifications.
            </div>
          )}

          {mySitterId && loading && <p className="text-pink-500 animate-pulse">Recherche de notifications...</p>}
          
          {mySitterId && !loading && pendingRequests.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 border border-gray-100">
              Vous n'avez aucune nouvelle demande de garde en attente.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map(booking => (
              <div key={booking._id} className="bg-white border-l-4 border-l-pink-500 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-md uppercase">Notification</span>
                    <span className="text-gray-600 font-bold">{booking.montantTotale} DNT</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Demande de garde parent</h4>
                  <p className="text-gray-600 text-sm">📅 Date: {formatDate(booking.dateDebut)}</p>
                  <p className="text-gray-600 text-sm">⏰ Horaires: {formatTime(booking.dateDebut)} à {formatTime(booking.dateFin)}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Accepter
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                    className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg transition text-sm"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gardes confirmées a venir */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mes gardes à venir ({upcomingBookings.length})</h3>
          
          {mySitterId && !loading && upcomingBookings.length === 0 && (
            <p className="text-gray-500 text-center py-4">Aucune garde confirmée prochainement.</p>
          )}

          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    ✅ Garde validée
                  </h4>
                  <div className="mt-1 text-sm text-gray-600">
                    {formatDate(booking.dateDebut)} • {formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/chat')}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  Message Parent
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

export default SitterDashboard;