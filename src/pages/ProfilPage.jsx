// pages/ProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Loader, X, Calendar, Clock } from 'lucide-react';
import sitterProfileService from '../services/sitterProfileService';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';

import Header from '../components/layout/Header';

function ProfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sitter, setSitter] = useState(null);
  const [profileReviews, setProfileReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Modal réservation
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState({ dateDebut: '', dateFin: '', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (id) loadSitterProfile();
  }, [id]);

  useEffect(() => {
    if (!location.state?.openBookingModal) return;
    const saved = localStorage.getItem('user');
    if (!saved) return;
    try {
      const u = JSON.parse(saved);
      if (u.role !== 'parente') return;
      setShowModal(true);
      setBookingError('');
      navigate(location.pathname, { replace: true, state: {} });
    } catch {
      /* ignore */
    }
  }, [location.state, location.pathname, navigate]);

  const loadProfileReviews = async (sitterId) => {
    try {
      const list = await reviewService.getReviewsForSitter(sitterId);
      setProfileReviews(Array.isArray(list) ? list : []);
    } catch {
      setProfileReviews([]);
    }
  };

  const loadSitterProfile = async () => {
    try {
      setLoading(true);
      const data = await sitterProfileService.getSitterById(id);
      setSitter({
        _id: data._id,
        name: `${data.prenom || ''} ${data.nom}`,
        city: data.localisation || 'Non spécifié',
        price: data.tarifHoraire,
        rating: data.noteMoyenne || 0,
        reviews: data.nbAvis || 0,
        specialty: data.specialite || "Garde d'enfants",
        image: data.image ? `http://localhost:5000/uploads/${data.image}` : null,
        description: data.description,
        experience: data.experience,
        langues: Array.isArray(data.langues) ? data.langues : [],
        disponibilites: data.disponibilites || {},
        certifications: data.certification || 0,
      });
      await loadProfileReviews(data._id);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le profil du baby-sitter');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!user) {
      navigate('/login', { state: { from: `/profil/${id}` } });
      return;
    }
    if (user.role !== 'parente') {
      setBookingError('Seuls les parents peuvent effectuer une réservation.');
      return;
    }
    if (!booking.dateDebut || !booking.dateFin) {
      setBookingError('Veuillez sélectionner la date et les horaires.');
      return;
    }
    if (new Date(booking.dateDebut) >= new Date(booking.dateFin)) {
      setBookingError("L'heure de fin doit être après l'heure de début.");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await bookingService.createBooking({
        sitterProfileId: sitter._id,
        dateDebut: booking.dateDebut,
        dateFin: booking.dateFin,
        message: booking.message,
      });

      const failed =
        response &&
        typeof response === 'object' &&
        (response.success === false || response.error === true);
      if (failed) {
        setBookingError(response.message || 'La réservation a été refusée.');
        return;
      }

      setBookingSuccess('🎉 Réservation envoyée avec succès ! Le baby-sitter vous répondra prochainement.');
      setBooking({ dateDebut: '', dateFin: '', message: '' });
      setTimeout(() => {
        setShowModal(false);
        setBookingSuccess('');
        navigate('/chat', {
          state: {
            contactId: id,
            contactName: sitter.name,
            contactRole: 'sitter',
          },
        });
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la réservation. Réessayez.';
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayKeys = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );

  if (error || !sitter) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-md">
        <p className="text-red-600 mb-4">{error || 'Profil non trouvé'}</p>
        <button onClick={() => navigate('/recherche-sitters')} className="bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700">
          Retour à la liste
        </button>
      </div>
    </div>
  );

  const reviewCount = profileReviews.length > 0 ? profileReviews.length : sitter.reviews;
  const reviewAvg =
    profileReviews.length > 0
      ? profileReviews.reduce((acc, r) => acc + (Number(r.note) || 0), 0) / profileReviews.length
      : sitter.rating;

  const openReservationModal = () => {
    if (!user) {
      navigate('/login', { state: { from: `/profil/${id}` } });
      return;
    }
    if (user.role !== 'parente') {
      alert('Seuls les comptes parents peuvent réserver une garde.');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8 pb-28 md:pb-24 space-y-6">
        <button
          type="button"
          onClick={() => navigate('/recherche-sitters')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-pink-600 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la recherche
        </button>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Photo */}
            <div className="md:w-1/3">
              {sitter.image
                ? <img src={sitter.image} alt={sitter.name} className="w-full h-64 md:h-full object-cover" />
                : <div className="w-full h-64 md:h-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-6xl">🌟</div>
              }
            </div>
            {/* Infos */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{sitter.name}</h2>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{sitter.city}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold text-gray-900">
                      {reviewAvg ? reviewAvg.toFixed(1) : sitter.rating || 'N/A'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">{reviewCount} avis</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">{sitter.specialty}</span>
                {sitter.experience && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{sitter.experience}</span>}
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {sitter.description || 'Aucune description disponible.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 font-medium">Langues</p>
                  <p className="text-gray-800 font-semibold">{sitter.langues.length > 0 ? sitter.langues.join(', ') : 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Certifications</p>
                  <p className="text-gray-800 font-semibold">{sitter.certifications || 'Aucune'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="flex-1">
                  <p className="text-3xl font-bold text-pink-600">{sitter.price} DNT<span className="text-sm font-normal text-gray-400">/h</span></p>
                  <p className="text-xs text-gray-400">Tarif horaire</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {user?.role === 'parente' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          navigate('/chat', {
                            state: {
                              contactId: sitter._id,
                              contactName: sitter.name,
                              contactImage: sitter.image?.split('/').pop(),
                              contactRole: 'sitter',
                            },
                          })
                        }
                        className="bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2"
                      >
                        💬 Contacter
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/reservation', { state: { sitterId: sitter._id } })}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center gap-2"
                        aria-label="Réserver une garde avec ce baby-sitter"
                      >
                        <Calendar className="w-5 h-5" />
                        Réserver
                      </button>
                    </>
                  )}

                  {user?.role === 'baby-sitter' && (
                    <p className="text-sm italic text-gray-400">Mode aperçu (Profil Sitter)</p>
                  )}

                  {!user && (
                    <button
                      type="button"
                      onClick={() => navigate('/reservation', { state: { sitterId: sitter._id } })}
                      className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition flex items-center gap-2"
                      aria-label="Se connecter pour réserver une garde"
                    >
                      <Calendar className="w-5 h-5" />
                      Réserver
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disponibilités */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Disponibilités</h3>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              const available = sitter.disponibilites[dayKeys[i]];
              return (
                <div key={day} className="text-center">
                  <p className="text-sm font-semibold text-gray-600 mb-2">{day}</p>
                  <div className={`h-10 rounded-xl flex items-center justify-center text-sm font-bold ${available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-300'}`}>
                    {available ? '✓' : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Avis */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-xl font-bold text-gray-900">Avis ({reviewCount})</h3>
            {user?.role === 'parente' && (
              <button
                type="button"
                onClick={() =>
                  navigate('/reviews', {
                    state: { sitterProfileId: sitter._id, sitterName: sitter.name },
                  })
                }
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold rounded-xl transition"
              >
                Laisser un avis
              </button>
            )}
          </div>

          {profileReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-3">⭐</div>
              <p>Aucun avis pour l&apos;instant.</p>
              {user?.role === 'parente' && (
                <p className="text-sm mt-1">Rédigez un avis depuis la page Avis ou après une garde terminée.</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="text-5xl font-bold text-gray-900">{reviewAvg.toFixed(1)}</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${
                          s <= Math.round(reviewAvg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{reviewCount} avis clients</p>
                </div>
              </div>
              <ul className="space-y-4">
                {profileReviews.map((r) => (
                  <li key={r._id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/80">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{r.auteur || 'Parent'}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(r.createdAt || r.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (Number(r.note) || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{r.commentaire}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* ── Modal de réservation ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* En-tête modal */}
            <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">📅 Réserver {sitter.name}</h3>
                  <p className="text-pink-100 text-sm mt-1">{sitter.price} DNT/h • {sitter.city}</p>
                </div>
                <button onClick={() => { setShowModal(false); setBookingError(''); setBookingSuccess(''); }} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corps modal */}
            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🎉</div>
                  <p className="font-bold text-gray-900 mb-2">Réservation envoyée !</p>
                  <p className="text-gray-500 text-sm">{bookingSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReserve} className="space-y-4">
                  {bookingError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                      ⚠️ {bookingError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />Début de garde *
                    </label>
                    <input
                      type="datetime-local"
                      value={booking.dateDebut}
                      onChange={e => setBooking(p => ({ ...p, dateDebut: e.target.value }))}
                      required min={new Date().toISOString().slice(0, 16)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />Fin de garde *
                    </label>
                    <input
                      type="datetime-local"
                      value={booking.dateFin}
                      onChange={e => setBooking(p => ({ ...p, dateFin: e.target.value }))}
                      required min={booking.dateDebut || new Date().toISOString().slice(0, 16)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Calcul montant estimé */}
                  {booking.dateDebut && booking.dateFin && new Date(booking.dateFin) > new Date(booking.dateDebut) && (
                    <div className="bg-pink-50 border border-pink-100 rounded-xl p-3">
                      <p className="text-sm text-pink-700">
                        💰 Montant estimé :{' '}
                        <span className="font-bold">
                          {(((new Date(booking.dateFin) - new Date(booking.dateDebut)) / 3600000) * sitter.price).toFixed(2)} DNT
                        </span>
                        {' '}({((new Date(booking.dateFin) - new Date(booking.dateDebut)) / 3600000).toFixed(1)}h × {sitter.price} DNT/h)
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optionnel)</label>
                    <textarea
                      value={booking.message}
                      onChange={e => setBooking(p => ({ ...p, message: e.target.value }))}
                      placeholder="Précisions sur la garde, besoins des enfants..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit" disabled={bookingLoading}
                      className={`flex-1 py-3 rounded-xl font-semibold text-white text-sm shadow-lg transition ${bookingLoading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                    >
                      {bookingLoading ? '⏳ Envoi...' : '📅 Confirmer la réservation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilPage;