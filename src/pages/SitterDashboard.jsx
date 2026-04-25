// pages/SitterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import sitterProfileService from '../services/sitterProfileService';

import Header from '../components/layout/Header';

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
      let data = await bookingService.getMyBookingsAsSitter();
      let bookingsList = Array.isArray(data) ? data : [];

      // Traitement automatique (par défaut) pour terminer les gardes dont la date de fin est dépassée
      let hasUpdates = false;
      const now = new Date();
      for (let b of bookingsList) {
        if (b.statut === 'confirmed' && new Date(b.dateFin) < now) {
          try {
            await bookingService.updateStatus(b._id, 'completed');
            hasUpdates = true;
          } catch (e) {
            console.error("Erreur de mise à jour automatique:", e);
          }
        }
      }

      if (hasUpdates) {
        data = await bookingService.getMyBookingsAsSitter();
        bookingsList = Array.isArray(data) ? data : [];
      }

      setBookings(bookingsList);
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
      // Trouver la réservation correspondante pour récupérer les infos du parent
      const booking = pendingBookings.find(b => b._id === bookingId);

      await bookingService.updateStatus(bookingId, 'accepted');

      // On rafraîchit les données localement
      await fetchBookings();

      // Redirection automatique immédiate vers la messagerie pour contacter le parent
      if (booking) {
        navigate('/chat', {
          state: {
            contactId: booking.parentId?._id || booking.parentId,
            contactName: booking.parentId?.firstName ? `${booking.parentId.firstName} ${booking.parentId.lastName}` : 'Parent',
            contactImage: booking.parentId?.image,
            contactRole: 'parent'
          }
        });
      }
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

  const handleComplete = async (bookingId) => {
    if (!window.confirm('Voulez-vous marquer cette garde comme terminée ?')) return;
    setProcessingId(bookingId);
    try {
      await bookingService.updateStatus(bookingId, 'completed');
      await fetchBookings();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Mon tableau de bord Baby-Sitter</h1>

        {/* ── Statistiques ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Nouvelles demandes', value: pendingBookings.length, icon: '🔔', color: 'pink-700' },
            { label: 'Gardes confirmées', value: confirmedBookings.length, icon: '✅', color: '#4CAF50' },
            { label: 'Gardes terminées', value: pastBookings.filter(b => b.statut === 'completed').length, icon: '🏁', color: '#2196F3' },
            { label: 'Total demandes', value: bookings.length, icon: '📋', color: '#FF9800' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Alerte: profil manquant ── */}
        {!profileLoading && !profile && (
          <div className="mb-8 p-6 bg-[#FBFBFB] border border-gray-50 rounded-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="font-bold text-gray-800">Votre profil professionnel n'est pas encore créé</p>
                  <p className="text-gray-600 text-sm mt-1">Complétez votre fiche pour être visible par les parents</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/register-sitter')}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-pink-600 transition whitespace-nowrap"
              >
                Créer mon profil →
              </button>
            </div>
          </div>
        )}

        {/* ── Section Profil ── */}
        {profile && (
          <section className="mb-10 bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Mon Profil Professional</h2>
            <div className="bg-pink-50 rounded-2xl p-6 text-gray-800 shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-pink-300 overflow-hidden border-2 border-pink-400">
                  <img 
                    src={profile.image ? `http://localhost:5000/uploads/${profile.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.prenom + ' ' + profile.nom)}&background=fde7f3&color=ec4899&bold=true`} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{profile.prenom || ''} {profile.nom}</h3>
                  <p className="text-pink-800 text-sm">{profile.localisation} • {profile.tarifHoraire} DNT/h</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-600">★</span>
                    <span className="text-gray-900 font-semibold">{profile.noteMoyenne || '0'}/5</span>
                    <span className="text-pink-700 text-xs">({profile.nbAvis || 0} avis)</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/register-sitter')}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
                >
                  Modifier mon profil
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Onglets ── */}
        <div className="flex gap-2 mb-8 border-b border-gray-100">
          {[
            { key: 'notifications', label: `🔔 Demandes (${pendingBookings.length})` },
            { key: 'confirmed', label: `✅ Confirmées (${confirmedBookings.length})` },
            { key: 'history', label: `🏁 Historique (${pastBookings.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-bold transition border-b-2 ${tab === t.key
                  ? 'text-pink-700 border-b-pink-700'
                  : 'text-gray-500 border-b-transparent hover:text-gray-700'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            ⚠️ {error}
            <button onClick={fetchBookings} className="ml-auto text-sm underline">Réessayer</button>
          </div>
        )}

        {/* ── Chargement ── */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-pink-700 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Chargement de vos demandes...</p>
          </div>
        )}

        {/* ── Demandes en attente ── */}
        {!loading && tab === 'notifications' && (
          <section className="bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
            <div className="space-y-4">
              {pendingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="text-5xl mb-4">🔔</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune nouvelle demande</h3>
                  <p className="text-gray-500 text-sm">Vous recevrez ici les demandes de garde des parents.</p>
                </div>
              ) : (
                pendingBookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                    {/* En-tête */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">
                        🔔 Nouvelle demande
                      </span>
                      <span className="font-bold text-gray-900 text-lg">{booking.montantTotale || 0} DNT</span>
                    </div>

                    {/* Info parent */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
                        {booking.parentId?.firstName?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.parentId?.firstName} {booking.parentId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{booking.parentId?.email}</p>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-600 font-semibold mb-1">📅 Date</p>
                        <p className="font-semibold text-gray-900 text-sm">{formatDate(booking.dateDebut)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-xs text-purple-600 font-semibold mb-1">⏰ Horaires</p>
                        <p className="font-semibold text-gray-900 text-sm">{formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}</p>
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
                        {processingId === booking._id ? '⏳...' : '✅ Accepter'}
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
          </section>
        )}

        {/* ── Gardes confirmées ── */}
        {!loading && tab === 'confirmed' && (
          <section className="bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
            <div className="space-y-4">
              {confirmedBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-gray-500">Aucune garde confirmée prochainement.</p>
                </div>
              ) : (
                confirmedBookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-lg font-bold">
                        {booking.parentId?.firstName?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{booking.parentId?.firstName} {booking.parentId?.lastName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(booking.dateDebut)} • {formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => navigate('/chat', {
                          state: {
                            contactId: booking.parentId._id || booking.parentId,
                            contactName: `${booking.parentId.firstName || ''} ${booking.parentId.lastName || ''}`.trim() || 'Parent',
                            contactRole: 'parent'
                          }
                        })}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-bold hover:bg-pink-600 transition"
                      >
                        💬 Contacter
                      </button>
                      {booking.statut === 'confirmed' && (
                        <button
                          onClick={() => handleComplete(booking._id)}
                          disabled={processingId === booking._id}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition active:scale-95 disabled:opacity-50"
                        >
                          {processingId === booking._id ? '⏳...' : '🏁 Terminer'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ── Historique ── */}
        {!loading && tab === 'history' && (
          <section className="bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
            <div className="space-y-3">
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="text-5xl mb-4">📋</div>
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
                        <p className="font-bold text-gray-900">{booking.montantTotale || 0} DNT</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${booking.statut === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                          {booking.statut === 'completed' ? '🏁 Terminée' : '❌ Annulée'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SitterDashboard;