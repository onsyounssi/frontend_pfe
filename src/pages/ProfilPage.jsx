// pages/ProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Loader, X, Calendar, Clock } from 'lucide-react';
import sitterProfileService from '../services/sitterProfileService';
import bookingService from '../services/bookingService';

function ProfilPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitter, setSitter] = useState(null);
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

  const loadSitterProfile = async () => {
    try {
      setLoading(true);
      const data = await sitterProfileService.getSitterById(id);
      setSitter({
        _id: data._id,
        name: data.nom,
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
      navigate('/login');
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

      if (response.success || response.booking) {
        setBookingSuccess('🎉 Réservation envoyée avec succès ! Le baby-sitter vous répondra prochainement.');
        setBooking({ dateDebut: '', dateFin: '', message: '' });
        setTimeout(() => {
          setShowModal(false);
          setBookingSuccess('');
          navigate('/parente');
        }, 2500);
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/recherche-sitters')} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-pink-600">SmartBabyCare</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

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
                    <span className="text-xl font-bold text-gray-900">{sitter.rating || 'N/A'}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{sitter.reviews} avis</span>
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

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-pink-600">{sitter.price} DNT<span className="text-sm font-normal text-gray-400">/h</span></p>
                  <p className="text-xs text-gray-400">Tarif horaire</p>
                </div>
                {user?.role === 'parente' && (
                  <button
                    onClick={() => navigate('/reservation', { state: { sitterId: sitter._id, sitterName: sitter.name, sitterPrice: sitter.price } })}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    📅 Réserver ce sitter
                  </button>
                )}
                {user?.role === 'baby-sitter' && (
                  <button
                    onClick={() => navigate('/reservation', { state: { sitterId: sitter._id, sitterName: sitter.name, sitterPrice: sitter.price } })}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    📅 Réserver ce sitter
                  </button>
                )}
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm"
                  >
                    Se connecter pour réserver
                  </button>
                )}
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avis ({sitter.reviews})</h3>
          {sitter.reviews === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-3">⭐</div>
              <p>Aucun avis pour l'instant.</p>
              {user?.role === 'parente' && (
                <p className="text-sm mt-1">Après votre garde, vous pourrez laisser un avis !</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-gray-900">{sitter.rating}</div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(sitter.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{sitter.reviews} avis clients</p>
              </div>
            </div>
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