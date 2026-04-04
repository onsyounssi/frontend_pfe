// pages/SitterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import sitterProfileService from '../services/sitterProfileService';

function SitterDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('notifications');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
      return;
    }
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([fetchBookings(), fetchProfile()]);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookingsAsSitter();
      setBookings(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement bookings sitter:', err);
      setError('Impossible de charger vos demandes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await sitterProfileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      // Pas de profil encore créé
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const pendingBookings = bookings.filter(b => b.statut === 'pending');
  const confirmedBookings = bookings.filter(b => b.statut === 'confirmed' || b.statut === 'accepted');
  const pastBookings = bookings.filter(b => b.statut === 'completed' || b.statut === 'cancelled');

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const handleAccept = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await bookingService.updateStatus(bookingId, 'accepted');
      await fetchBookings();
    } catch (err) {
      alert('Erreur lors de la confirmation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefuse = async (bookingId) => {
    if (!window.confirm('Voulez-vous refuser cette demande ?')) return;
    setProcessingId(bookingId);
    try {
      await bookingService.updateStatus(bookingId, 'cancelled');
      await fetchBookings();
    } catch (err) {
      alert('Erreur lors du refus');
    } finally {
      setProcessingId(null);
    }
  };

  const handleContact = (booking) => {
    navigate('/chat', {
      state: {
        parentId: booking.parentId?._id || booking.parentId,
        parentName: booking.parentId?.firstName ? `${booking.parentId.firstName} ${booking.parentId.lastName}` : 'Parent'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center text-lg shadow-md">
              🌟
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SmartBabyCare</h1>
              <p className="text-xs text-gray-400">Tableau de bord baby-sitter</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Badge notification */}
            {pendingBookings.length > 0 && (
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-sm font-bold">
                  🔔
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingBookings.length}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm overflow-hidden">
                {profile?.image
                  ? <img src={`http://localhost:5000/uploads/${profile.image}`} alt="" className="w-full h-full object-cover" />
                  : (user?.firstName?.[0]?.toUpperCase() || 'S')
                }
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{profile?.nom || user?.firstName}</p>
                <p className="text-xs text-gray-400">Baby-sitter</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Alerte: profil manquant ── */}
        {!profileLoading && !profile && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-800">Votre profil professionnel n'est pas encore créé</p>
                <p className="text-sm text-amber-600">Complétez votre fiche pour être visible par les parents</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/register-sitter')}
              className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition whitespace-nowrap"
            >
              Créer mon profil →
            </button>
          </div>
        )}

        {/* ── Card profil ── */}
        {profile && (
          <div className="bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 overflow-hidden border-2 border-white/40">
                {profile.image
                  ? <img src={`http://localhost:5000/uploads/${profile.image}`} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🌟</div>
                }
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.nom}</h2>
                <p className="text-indigo-100 text-sm">{profile.localisation} • {profile.tarifHoraire} DNT/h</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-300">★</span>
                  <span className="text-white font-semibold">{profile.noteMoyenne}</span>
                  <span className="text-indigo-200 text-xs">({profile.nbAvis} avis)</span>
                </div>
              </div>
              <div className="ml-auto text-right hidden sm:block">
                <p className="text-indigo-100 text-sm">Gardes confirmées</p>
                <p className="text-3xl font-bold">{confirmedBookings.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Statistiques ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Nouvelles demandes', value: pendingBookings.length, icon: '🔔', urgent: pendingBookings.length > 0 },
            { label: 'Gardes confirmées', value: confirmedBookings.length, icon: '✅', urgent: false },
            { label: 'Gardes terminées', value: pastBookings.filter(b => b.statut === 'completed').length, icon: '🏁', urgent: false },
            { label: 'Total demandes', value: bookings.length, icon: '📋', urgent: false },
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm p-5 border ${stat.urgent && stat.value > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className={`text-2xl font-bold ${stat.urgent && stat.value > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {loading ? '...' : stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            ⚠️ {error}
            <button onClick={fetchBookings} className="ml-auto text-sm underline">Réessayer</button>
          </div>
        )}

        {/* ── Onglets ── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {[
            { key: 'notifications', label: `🔔 Demandes (${pendingBookings.length})` },
            { key: 'confirmed', label: `✅ Confirmées (${confirmedBookings.length})` },
            { key: 'history', label: `🏁 Historique (${pastBookings.length})` },
          ].map(t => (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.key ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Chargement ── */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Chargement de vos demandes...</p>
          </div>
        )}

        {/* ── Demandes en attente ── */}
        {!loading && tab === 'notifications' && (
          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune nouvelle demande</h3>
                <p className="text-gray-500 text-sm">Vous recevrez une notification ici quand un parent vous réserve.</p>
              </div>
            ) : (
              pendingBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl border-l-4 border-l-pink-500 border border-gray-100 shadow-md p-6 hover:shadow-lg transition">
                  {/* En-tête */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">
                      🔔 Nouvelle demande de garde
                    </span>
                    <span className="font-bold text-gray-900 text-lg">{booking.montantTotale} DNT</span>
                  </div>

                  {/* Info parent */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                      {booking.parentId?.firstName?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.parentId?.firstName} {booking.parentId?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{booking.parentId?.phone || booking.parentId?.email}</p>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-500 font-semibold mb-1">📅 Date de garde</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatDate(booking.dateDebut)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-purple-500 font-semibold mb-1">⏰ Horaires</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatTime(booking.dateDebut)} → {formatTime(booking.dateFin)}</p>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                      💬 <span className="italic">"{booking.message}"</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(booking._id)}
                      disabled={processingId === booking._id}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === booking._id ? '⏳...' : '✅ Accepter la garde'}
                    </button>
                    <button
                      onClick={() => handleRefuse(booking._id)}
                      disabled={processingId === booking._id}
                      className="flex-1 border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3 px-4 rounded-xl transition text-sm disabled:opacity-50"
                    >
                      ❌ Refuser
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Gardes confirmées ── */}
        {!loading && tab === 'confirmed' && (
          <div className="space-y-4">
            {confirmedBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-500">Aucune garde confirmée prochainement.</p>
              </div>
            ) : (
              confirmedBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl border-l-4 border-l-green-500 border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                        {booking.parentId?.firstName?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          ✅ Garde validée
                          <span className="text-xs font-normal text-gray-500">avec {booking.parentId?.firstName} {booking.parentId?.lastName}</span>
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {formatDate(booking.dateDebut)} • {formatTime(booking.dateDebut)} → {formatTime(booking.dateFin)}
                        </p>
                        <p className="text-sm font-bold text-green-600">{booking.montantTotale} DNT</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleContact(booking)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      💬 Contacter le parent
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Historique ── */}
        {!loading && tab === 'history' && (
          <div className="space-y-3">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500">Aucun historique disponible.</p>
              </div>
            ) : (
              pastBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-700">{booking.parentId?.firstName} {booking.parentId?.lastName}</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.dateDebut)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{booking.montantTotale} DNT</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${booking.statut === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                        {booking.statut === 'completed' ? '🏁 Terminée' : '❌ Annulée'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Navigation rapide ── */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '👤', label: 'Mon profil', path: '/register-sitter', color: 'indigo' },
            { icon: '💬', label: 'Mes messages', path: '/chat', color: 'pink' },
            { icon: '📅', label: 'Mes réservations', path: '/reservation', color: 'green' },
            { icon: '🏠', label: 'Accueil', path: '/', color: 'gray' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition group"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">{item.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SitterDashboard;