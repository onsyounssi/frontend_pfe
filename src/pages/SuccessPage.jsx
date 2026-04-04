import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    const confirmPayment = async () => {
      const bookingId = searchParams.get('BookingId');
      if (!bookingId) {
        setStatus('error');
        setLoading(false);
        return;
      }

      try {
        await bookingService.updateStatus(bookingId, 'confirmed');
        setStatus('success');
      } catch (err) {
        console.error("Erreur lors de la confirmation du paiement:", err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-800">Validation du paiement...</h2>
            <p className="text-gray-500">Veuillez patienter quelques instants.</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
              ✅
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement Réussi !</h2>
              <p className="text-gray-600">
                Merci ! Votre réservation est désormais confirmée et payée.
                Le baby-sitter a été informé.
              </p>
            </div>
            <button
              onClick={() => navigate('/parente')}
              className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl transition shadow-lg active:scale-95"
            >
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
              ⚠️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Oups !</h2>
              <p className="text-gray-600">
                Une erreur est survenue lors de la validation de votre paiement ou l'ID de réservation est manquant.
              </p>
            </div>
            <button
              onClick={() => navigate('/parente')}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition active:scale-95"
            >
              Retour au tableau de bord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;
