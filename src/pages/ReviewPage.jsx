import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';

function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger les avis depuis le backend MongoDB au montage du composant
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getReviews();

      // On map les données de MongoDB pour matcher l'UI du composant existant
      const formattedReviews = data.map(dbRev => ({
        id: dbRev._id,
        author: dbRev.auteur || "Parent Utilisateur",
        date: dbRev.date ? new Date(dbRev.date).toLocaleDateString() : new Date(dbRev.createdAt).toLocaleDateString(),
        rating: dbRev.note,
        text: dbRev.commentaire
      }));

      // Inverser pour avoir les plus récents en premier
      setReviews(formattedReviews.reverse());
    } catch (err) {
      console.error("Impossible de récupérer les avis Mongoose : ", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (newReview.comment.trim()) {
      try {
        // Obtenir le nom de l'utilisateur stocké (si existant)
        const savedUser = localStorage.getItem('user');
        let userName = "Parent (Moi)";
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          userName = parsedUser.firstName ? `${parsedUser.firstName} ${parsedUser.lastName}` : "Parent";
        }

        const reviewPayload = {
          note: newReview.rating,
          commentaire: newReview.comment,
          auteur: userName,
          date: new Date()
        };

        // Sauvegarder dans MongoDB via l'API
        await reviewService.createReview(reviewPayload);

        // Rafraîchir la liste complète des avis pour plus de fiabilité
        await fetchReviews();

        // Réinitialiser le formulaire
        setNewReview({ rating: 5, comment: '' });

      } catch (err) {
        alert("Erreur lors de la publication de votre avis: " + err.message);
      }
    }
  };

  const StarIcon = ({ filled, onMouseEnter, onMouseLeave, onClick }) => (
    <svg
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`w-8 h-8 cursor-pointer transition-colors ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête de la fonctionnalité */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Avis et Retours
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Partagez votre expérience avec nos baby-sitters. Vos retours nous aident à maintenir un service de qualité et de confiance.
          </p>
        </div>

        {/* Section Écrire un avis */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Écrire un avis</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre note
              </label>
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
                onClick={handlePublish}
                disabled={!newReview.comment.trim()}
                className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>Publier l'avis</span>
                <span className="text-xl">✨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des avis lus depuis MongoDB */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Ce que disent nos parents</h2>

          {loading ? (
            <div className="py-8 text-center text-gray-500 flex justify-center items-center gap-2"><div className="w-5 h-5 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin"></div> Chargement des avis...</div>
          ) : reviews.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border text-gray-500 font-semibold shadow-sm">Aucun avis publié pour le moment. Soyez le premier !</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;