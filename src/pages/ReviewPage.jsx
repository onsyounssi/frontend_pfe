import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reviewService from '../services/reviewService';
import bookingService from '../services/bookingService';
import Header from '../components/layout/Header';

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    sitterProfileId: '',
    sitterName: '',
  });
  const [sitterOptions, setSitterOptions] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const fetchPublicReviews = useCallback(async () => {
    try {
      const data = await reviewService.getReviews();
      const formattedReviews = (Array.isArray(data) ? data : []).map((dbRev) => ({
        id: dbRev._id,
        author: dbRev.auteur || 'Parent',
        date: dbRev.date
          ? new Date(dbRev.date).toLocaleDateString('fr-FR')
          : new Date(dbRev.createdAt || Date.now()).toLocaleDateString('fr-FR'),
        rating: dbRev.note,
        text: dbRev.commentaire,
        sitterName: dbRev.sitterName,
      }));
      setReviews(formattedReviews.reverse());
    } catch (err) {
      console.error('Impossible de récupérer les avis : ', err);
      setReviews([]);
    }
  }, []);

  const loadMyHistory = useCallback(async (parentId) => {
    if (!parentId) {
      setMyReviews([]);
      return;
    }
    try {
      const raw = await reviewService.getParentReviewHistory(parentId);
      setMyReviews(
        raw.map((r) => ({
          id: r._id,
          author: r.auteur || 'Moi',
          date: new Date(r.createdAt || r.date).toLocaleDateString('fr-FR'),
          rating: r.note,
          text: r.commentaire,
          sitterName: r.sitterName || 'Baby-sitter',
          sitterProfileId: r.sitterProfileId,
        }))
      );
    } catch {
      setMyReviews([]);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (location.state?.sitterProfileId) {
      setNewReview((prev) => ({
        ...prev,
        sitterProfileId: location.state.sitterProfileId,
        sitterName: location.state.sitterName || prev.sitterName,
      }));
      const sid = location.state.sitterProfileId;
      const sname = location.state.sitterName;
      if (sid && sname) {
        setSitterOptions((prev) =>
          prev.some((o) => o.id === sid) ? prev : [...prev, { id: sid, name: sname }]
        );
      }
    }
  }, [location.state]);

  useEffect(() => {
    async function loadSittersFromBookings() {
      if (!user || user.role !== 'parente') return;
      try {
        const data = await bookingService.getMyBookingsAsParent();
        const list = Array.isArray(data) ? data : [];
        const map = new Map();
        for (const b of list) {
          const sp = b.sitterProfileId;
          if (!sp?._id) continue;
          if (!map.has(sp._id)) {
            map.set(sp._id, {
              id: sp._id,
              name: `${sp.prenom || ''} ${sp.nom || ''}`.trim() || 'Baby-sitter',
            });
          }
        }
        setSitterOptions([...map.values()]);
      } catch (e) {
        console.error(e);
      }
    }
    loadSittersFromBookings();
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      await fetchPublicReviews();
      const saved = localStorage.getItem('user');
      let pid = null;
      if (saved) {
        try {
          const u = JSON.parse(saved);
          pid = u._id || u.id;
        } catch {
          pid = null;
        }
      }
      if (!cancelled && pid) await loadMyHistory(pid);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchPublicReviews, loadMyHistory]);

  const handleSitterSelect = (e) => {
    const id = e.target.value;
    const opt = sitterOptions.find((o) => o.id === id);
    setNewReview((prev) => ({
      ...prev,
      sitterProfileId: id,
      sitterName: opt?.name || '',
    }));
  };

  const handlePublish = async () => {
    if (!newReview.comment.trim() || !newReview.sitterProfileId) {
      alert('Choisissez un baby-sitter et rédigez un commentaire.');
      return;
    }
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'parente') {
      alert('Seuls les parents peuvent publier un avis sur un profil baby-sitter.');
      return;
    }

    const parentId = parsedUser._id || parsedUser.id;
    let userName =
      `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim() ||
      parsedUser.nom ||
      'Parent';

    setPublishing(true);
    try {
      await reviewService.createReview({
        note: newReview.rating,
        commentaire: newReview.comment.trim(),
        auteur: userName,
        date: new Date(),
        sitterProfileId: newReview.sitterProfileId,
        sitterName: newReview.sitterName,
        parentId,
      });

      await fetchPublicReviews();
      await loadMyHistory(parentId);

      setNewReview({
        rating: 5,
        comment: '',
        sitterProfileId: '',
        sitterName: '',
      });
      navigate(location.pathname, { replace: true, state: {} });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la publication.');
    } finally {
      setPublishing(false);
    }
  };

  const StarIcon = ({ filled, onMouseEnter, onMouseLeave, onClick }) => (
    <svg
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`w-8 h-8 cursor-pointer transition-colors ${
        filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  const isParent = user?.role === 'parente';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Avis et retours
            </h1>
          </div>

          {isParent && myReviews.length > 0 && (
            <div className="bg-pink-50/80 rounded-2xl border border-pink-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mes avis publiés</h2>
              <ul className="space-y-3">
                {myReviews.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/80 rounded-xl px-4 py-3 border border-pink-100"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {r.sitterName}
                        <span className="text-gray-400 font-normal text-sm ml-2">{r.date}</span>
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">&ldquo;{r.text}&rdquo;</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${star <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isParent ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Écrire un avis</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baby-sitter évalué *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white"
                    value={newReview.sitterProfileId}
                    onChange={handleSitterSelect}
                  >
                    <option value="">— Choisir parmi vos réservations —</option>
                    {sitterOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Les profils listés proviennent de vos réservations. Vous pouvez aussi passer par
                    le tableau de bord pour pré-sélectionner un baby-sitter.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        filled={star <= (hoveredStar || newReview.rating)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition resize-none"
                    placeholder="Partagez les détails de votre expérience..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={!newReview.comment.trim() || !newReview.sitterProfileId || publishing}
                    className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>{publishing ? 'Publication…' : 'Publier l’avis'}</span>
                    <span className="text-xl">✨</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-600">
              Connectez-vous en tant que <strong>parent</strong> pour noter un baby-sitter et lier
              l’avis à son profil.
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tous les avis</h2>

            {loading ? (
              <div className="py-8 text-center text-gray-500 flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin" />
                Chargement des avis...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center bg-white rounded-2xl border text-gray-500 font-semibold shadow-sm">
                Aucun avis publié pour le moment. Soyez le premier !
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                          {review.sitterName && (
                            <p className="text-xs text-pink-600 font-medium mt-0.5">
                              → {review.sitterName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
