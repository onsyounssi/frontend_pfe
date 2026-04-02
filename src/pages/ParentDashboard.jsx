// pages/ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';

function ParentDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'history'
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookingsAsParent();
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setError('Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(b =>
    b.statut === 'pending' || b.statut === 'confirmed'
  );
  const pastBookings = bookings.filter(b =>
    b.statut === 'completed' || b.statut === 'cancelled'
  );
  const pendingCount = bookings.filter(b => b.statut === 'pending').length;

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const statusBadge = (statut) => {
    const map = {
      pending: { label: '⏳ En attente', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      confirmed: { label: '✅ Confirmée', cls: 'bg-green-100 text-green-700 border-green-200' },
      completed: { label: '🏁 Terminée', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
      cancelled: { label: '❌ Annulée', cls: 'bg-red-100 text-red-600 border-red-200' },
    };
    return map[statut] || { label: statut, cls: 'bg-gray-100 text-gray-600' };
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    setCancelling(bookingId);
    try {
      await bookingService.updateStatus(bookingId, 'cancelled');
      await fetchBookings();
    } catch (err) {
      alert("Erreur lors de l'annulation");
    } finally {
      setCancelling(null);
    }
  };

  const handleContact = (booking) => {
    navigate('/chat', {
      state: {
        sitterId: booking.sitterId,
        sitterName: booking.sitterProfileId?.nom || 'Baby-sitter'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              👶
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SmartBabyCare</h1>
              <p className="text-xs text-gray-400">Tableau de bord parent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/recherche-sitters')}
              className="hidden sm:flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pink-700 transition shadow"
            >
              🔍 Trouver un sitter
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
                {user?.firstName?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">Parent</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Bienvenue ── */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Bonjour, {user?.firstName} ! 👋</h2>
          <p className="text-pink-100 mt-1 text-sm">
            {upcomingBookings.length > 0
              ? `Vous avez ${upcomingBookings.length} réservation(s) active(s).`
              : 'Aucune garde planifiée. Trouvez votre baby-sitter idéal !'}
          </p>
          <button
            onClick={() => navigate('/recherche-sitters')}
            className="mt-4 bg-white text-pink-600 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-pink-50 transition shadow"
          >
            🔍 Rechercher un baby-sitter
          </button>
        </div>

        {/* ── Statistiques ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Réservations actives', value: upcomingBookings.length, icon: '📅', color: 'pink' },
            { label: 'En attente confirmation', value: pendingCount, icon: '⏳', color: 'yellow' },
            { label: 'Gardes terminées', value: pastBookings.filter(b => b.statut === 'completed').length, icon: '✅', color: 'green' },
            { label: 'Total réservations', value: bookings.length, icon: '📋', color: 'indigo' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Erreur ── */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            ⚠️ {error}
            <button onClick={fetchBookings} className="ml-auto text-sm underline">Réessayer</button>
          </div>
        )}

        {/* ── Onglets ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'upcoming', label: `Prochaines (${upcomingBookings.length})` },
            { key: 'history', label: `Historique (${pastBookings.length})` },
          ].map(t => (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${tab === t.key ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Liste des réservations ── */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Chargement de vos réservations...</p>
          </div>
        )}

        {!loading && tab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune garde planifiée</h3>
                <p className="text-gray-500 mb-6 text-sm">Trouvez votre baby-sitter idéal et faites votre première réservation.</p>
                <button
                  onClick={() => navigate('/recherche-sitters')}
                  className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition"
                >
                  🔍 Trouver un baby-sitter
                </button>
              </div>
            ) : (
              upcomingBookings.map(booking => {
                const badge = statusBadge(booking.statut);
                return (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4">
                      {/* Info sitter */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-400 to-pink-400 text-white flex items-center justify-center text-xl font-bold shadow-sm overflow-hidden">
                          {booking.sitterProfileId?.image
                            ? <img src={`http://localhost:5000/uploads/${booking.sitterProfileId.image}`} alt="" className="w-full h-full object-cover" />
                            : '🌟'
                          }
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {booking.sitterProfileId?.nom || 'Baby-sitter'}
                          </h4>
                          <p className="text-sm text-gray-500">{booking.sitterProfileId?.localisation || ''}</p>
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border mt-1 ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Info date + montant */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-pink-600">{booking.montantTotale} DNT</p>
                        <p className="text-xs text-gray-500">Total estimé</p>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDate(booking.dateDebut)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>{formatTime(booking.dateDebut)} → {formatTime(booking.dateFin)}</span>
                      </div>
                      {booking.message && (
                        <div className="flex items-center gap-2">
                          <span>💬</span>
                          <span className="italic">"{booking.message}"</span>
                        </div>
                      )}
                    </div>

                    {/* Message si en attente */}
                    {booking.statut === 'pending' && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-700">
                        ⏳ En attente de confirmation du baby-sitter. Vous serez notifié dès qu'il répond.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-2 justify-end">
                      {booking.statut === 'confirmed' && (
                        <button
                          onClick={() => handleContact(booking)}
                          className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition"
                        >
                          💬 Contacter
                        </button>
                      )}
                      {(booking.statut === 'pending' || booking.statut === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {cancelling === booking._id ? '...' : '❌ Annuler'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {!loading && tab === 'history' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500">Aucune garde dans l'historique pour le moment.</p>
              </div>
            ) : (
              pastBookings.map(booking => {
                const badge = statusBadge(booking.statut);
                return (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 opacity-80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center text-xl">
                          {booking.sitterProfileId?.image
                            ? <img src={`http://localhost:5000/uploads/${booking.sitterProfileId.image}`} alt="" className="w-full h-full object-cover rounded-xl" />
                            : '👤'
                          }
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{booking.sitterProfileId?.nom || 'Baby-sitter'}</h4>
                          <p className="text-xs text-gray-500">{formatDate(booking.dateDebut)} • {formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}</p>
                          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border mt-1 ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{booking.montantTotale} DNT</p>
                        {booking.statut === 'completed' && (
                          <button
                            onClick={() => navigate('/reviews', { state: { sitterProfileId: booking.sitterProfileId?._id } })}
                            className="mt-1 text-xs text-pink-600 underline hover:text-pink-800"
                          >
                            ⭐ Laisser un avis
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Navigation rapide ── */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔍', label: 'Trouver un sitter', path: '/recherche-sitters', color: 'pink' },
            { icon: '💬', label: 'Mes messages', path: '/chat', color: 'indigo' },
            { icon: '⭐', label: 'Mes avis', path: '/reviews', color: 'yellow' },
            { icon: '🏠', label: 'Accueil', path: '/', color: 'gray' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition group"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-pink-600">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;