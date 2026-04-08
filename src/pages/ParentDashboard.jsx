import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import Header from '../components/layout/Header';

function ParentDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [payingId, setPayingId] = useState(null); // Pour le bouton de paiement
  const [reviewHistory, setReviewHistory] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const loadReviewHistory = useCallback(async () => {
    const saved = localStorage.getItem('user');
    if (!saved) return;
    try {
      const u = JSON.parse(saved);
      const pid = u._id || u.id;
      if (!pid) return;
      const raw = await reviewService.getParentReviewHistory(pid);
      setReviewHistory(
        raw.map((r) => ({
          id: r._id,
          sitterName: r.sitterName || 'Baby-sitter',
          date: new Date(r.createdAt || r.date).toLocaleDateString('fr-FR'),
          rating: r.note,
          text: r.commentaire,
          sitterProfileId: r.sitterProfileId,
        }))
      );
    } catch {
      setReviewHistory([]);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookingsAsParent();
      setBookings(Array.isArray(data) ? data : []);
      await loadReviewHistory();
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  };

  // Séparation des réservations selon l'image
  const upcomingBookings = bookings.filter(b => b.statut === 'pending' || b.statut === 'accepted' || b.statut === 'confirmed');
  const pastBookings = bookings.filter(b => b.statut === 'completed');

  // Formatage de la date : "15 fév 2024"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).replace(':', ' : ');
  };

  const handlePay = async (booking) => {
    try {
      setPayingId(booking._id);
      const data = await bookingService.createCheckoutSession(booking);
      if (data?.url) {
        window.location.href = data.url; // Redirection vers Stripe
      } else {
        alert("Erreur: Impossible de générer le lien de paiement.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'appel à Stripe.");
    } finally {
      setPayingId(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button onClick={fetchBookings} className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Mon tableau de bord</h1>

        {/* --- Cartes de Statistiques (Design Capture) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Prochaines gardes */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-2">Prochaines gardes</p>
              <p className="text-4xl font-bold text-gray-900">{loading ? '...' : upcomingBookings.length}</p>
            </div>
            <div className="text-pink-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Gardes passées */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-2">Gardes passées</p>
              <p className="text-4xl font-bold text-gray-900">{loading ? '...' : pastBookings.length}</p>
            </div>
            <div className="text-green-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Avis publiés */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-2">Avis publiés</p>
              <p className="text-4xl font-bold text-gray-900">{loading ? '...' : reviewHistory.length}</p>
            </div>
            <div className="text-pink-500">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-pink-600 transition"
          >
            ⭐ Rédiger un avis
          </button>
        </div>

        {/* --- Section Prochaines Gardes --- */}
        <section className="bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Prochaines gardes</h2>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Chargement...</div>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div key={booking._id} className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">
                        {booking.sitterProfileId ? `${booking.sitterProfileId.prenom || ''} ${booking.sitterProfileId.nom}` : "Inès R."}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${booking.statut === 'confirmed' ? 'bg-green-100 text-green-600' :
                        booking.statut === 'accepted' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                        {booking.statut === 'confirmed' ? 'Payée' :
                          booking.statut === 'accepted' ? 'Prêt pour paiement' :
                            'En attente de confirmation'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatDate(booking.dateDebut)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatTime(booking.dateDebut)} - {formatTime(booking.dateFin)}
                      </div>
                    </div>

                    {/* Affichage des enfants (dynamique) */}
                    <div className="text-sm text-gray-400">
                      {booking.enfants && booking.enfants.length > 0
                        ? booking.enfants.map(e => `${e.prenom} (${e.age} ans)`).join(', ')
                        : "Lucas (3 ans)" /* Valeur par défaut si non renseigné */}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    {booking.statut === 'accepted' && (
                      <button
                        onClick={() => handlePay(booking)}
                        disabled={payingId === booking._id}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition active:scale-95 disabled:opacity-50"
                      >
                        {payingId === booking._id ? '⏳ Redirection...' : '💳 Payer'}
                      </button>
                    )}
                    <button 
                      onClick={() => booking.sitterProfileId?._id && navigate(`/profil/${booking.sitterProfileId._id}`)}
                      className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => {
                        const sp = booking.sitterProfileId;
                        navigate('/chat', {
                          state: {
                            contactId: booking.sitterId,
                            contactName: sp ? `${sp.prenom || ''} ${sp.nom || ''}`.trim() : 'Baby-sitter',
                            contactImage: sp?.image || null,
                            contactCity: sp?.localisation || null
                          }
                        });
                      }}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-semibold hover:bg-pink-600 transition"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                Aucune garde prévue.
              </div>
            )}
          </div>
        </section>

        {/* --- Historique des avis (dynamique) --- */}
        <section className="mt-10 bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Historique de mes avis</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement...</div>
          ) : reviewHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
              Vous n&apos;avez pas encore publié d&apos;avis. Utilisez « Rédiger un avis » après une garde.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviewHistory.map((r) => (
                <li
                  key={r.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {r.sitterName}
                      <span className="text-gray-400 font-normal text-sm ml-2">{r.date}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">&ldquo;{r.text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-yellow-500 font-bold">{r.rating}/5</span>
                    {r.sitterProfileId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/profil/${r.sitterProfileId}`)}
                        className="text-sm text-[#E91E63] font-semibold hover:underline"
                      >
                        Voir le profil
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* --- Gardes passées + lien avis --- */}
        <section className="mt-10 bg-[#FBFBFB] rounded-2xl p-8 border border-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Gardes terminées</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Chargement...</div>
            ) : pastBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                Aucune garde terminée pour le moment.
              </p>
            ) : (
              pastBookings.map((booking) => {
                const sp = booking.sitterProfileId;
                const name = sp ? `${sp.prenom || ''} ${sp.nom || ''}`.trim() || 'Baby-sitter' : 'Baby-sitter';
                return (
                  <div
                    key={booking._id}
                    className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(booking.dateDebut)} · {formatTime(booking.dateDebut)} – {formatTime(booking.dateFin)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sp?._id && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/profil/${sp._id}`)}
                            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                          >
                            Profil
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/reviews', {
                                state: { sitterProfileId: sp._id, sitterName: name },
                              })
                            }
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition"
                          >
                            Laisser un avis
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ParentDashboard;