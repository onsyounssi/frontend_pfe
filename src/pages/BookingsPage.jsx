import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingHeader from '../components/BookingHeader';
import ProgressSteps from '../components/ProgressSteps';
import DateTimeForm from '../components/DateTimeForm';
import StepsDetails from '../components/StepsDetails';
import PaymentStep from '../components/PaymentStep';
import StepSummary from '../components/StepSummary';
import { getToken } from '../services/authService';
import bookingService from '../services/bookingService';
import sitterProfileService from '../services/sitterProfileService';

import Toast from '../components/common/Toast';

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // Pour les notifications premium
  const [sitterId, setSitterId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [user, setUser] = useState(null);
  const [sitterData, setSitterData] = useState(null);

  useEffect(() => {
    // Récupérer le SitterId
    if (location.state?.sitterId) {
      setSitterId(location.state.sitterId);
    }

    // Récupérer le ParentId et l'utilisateur connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setParentId(parsedUser.id || parsedUser._id);
    }
  }, [location]);

  useEffect(() => {
    const fetchSitter = async () => {
      if (sitterId) {
        try {
          const data = await sitterProfileService.getSitterById(sitterId);
          setSitterData(data);
        } catch (err) {
          console.error('Erreur lors de la récupération du profil baby-sitter:', err);
          setError('Impossible de récupérer les informations du baby-sitter.');
        }
      }
    };
    fetchSitter();
  }, [sitterId]);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    childrenCount: 1,
    specialNeeds: '',
    // Pour le paiement mockup
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  // Données pour le composant StepSummary
  const calculateTotalPrice = () => {
    if (!sitterData || !formData.startTime || !formData.endTime) return 0;
    const start = new Date(`1970-01-01T${formData.startTime}:00`);
    const end = new Date(`1970-01-01T${formData.endTime}:00`);
    const hours = (end - start) / (1000 * 60 * 60);
    const count = formData.childrenCount || 1;
    return sitterData.tarifHoraire * hours * count;
  };

  const bookingData = {
    date: formData.date,
    startTime: formData.startTime,
    endTime: formData.endTime,
    childrenCount: formData.childrenCount,
    totalPrice: calculateTotalPrice()
  };

  // handleCheckout supprimé car intégré dans handleSubmit

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.date || !formData.startTime || !formData.endTime) {
        setError('Veuillez remplir la date, l\'heure de début et l\'heure de fin.');
        return;
      }

      // Vérification : Date passée
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // On compare uniquement la date, pas l'heure

      if (selectedDate <= today) {
        setError("La réservation doit être faite au moins un jour à l'avance. Veuillez choisir une date à partir de demain.");
        return;
      }

      // Nouvelle vérification : Année et Mois
      if (selectedDate.getFullYear() !== today.getFullYear()) {
        setError("La réservation doit être faite pour l'année en cours (" + today.getFullYear() + ").");
        return;
      }

      if (selectedDate.getMonth() !== today.getMonth()) {
        setError("La réservation doit être faite pour le mois en cours.");
        return;
      }

      if (formData.startTime >= formData.endTime) {
        setError('L\'heure de début doit être antérieure à l\'heure de fin.');
        return;
      }
      setError(null);
    }

    if (currentStep === 2) {
      if (!formData.childrenCount || !formData.specialNeeds) {
        setError('Veuillez remplir tous les champs (nombre d\'enfants et besoins spéciaux).');
        return;
      }
      if (formData.childrenCount < 1) {
        setError('Le nombre d\'enfants doit être au moins de 1.');
        return;
      }
      setError(null);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Construction des dates avec Mongoose Date format (YYYY-MM-DDTHH:mm:ss.sssZ)
    // On assume que formData.date est format 'YYYY-MM-DD' et start/endTime est 'HH:mm'
    // Pour simplifier, on envoie directement les bons formats si possible, sinon on construit:
    const baseDate = formData.date;
    const start = formData.startTime;
    const end = formData.endTime;

    if (start >= end) {
      setError('L\'heure de début doit être antérieure à l\'heure de fin.');
      setLoading(false);
      return;
    }

    if (!sitterId) {
      setError('Aucun baby-sitter sélectionné. Retournez sur le profil et réessayez.');
      setLoading(false);
      navigate('/recherche-sitters');
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour réserver.');
      setLoading(false);
      navigate('/register', { state: { from: '/reservation', sitterId } });
      return;
    }

    if (user.role !== 'parente') {
      setError('Seuls les parents peuvent réserver une garde.');
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Session expirée. Veuillez vous reconnecter.');
      setLoading(false);
      navigate('/login', { state: { from: '/reservation', sitterId } });
      return;
    }

    let dateDebutDate = new Date(`${baseDate}T${start}:00`);
    let dateFinDate = new Date(`${baseDate}T${end}:00`);

    const bookingPayload = {
      sitterProfileId: sitterId,
      dateDebut: dateDebutDate.toISOString(),
      dateFin: dateFinDate.toISOString(),
      childrenCount: formData.childrenCount || 1,
      message: formData.specialNeeds || "",
      statut: 'pending',
      ...(parentId ? { parentId } : {})
    };

    try {
      const data = await bookingService.createBooking(bookingPayload);

      if (data.success && data.booking) {
        console.log('Réservation créée:', data.booking);
        setToast({ message: 'Votre demande de réservation a été envoyée ! Elle est en attente de confirmation.', type: 'success' });

        setTimeout(() => {
          navigate('/recherche-sitters');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Session invalide ou expirée. Connectez-vous pour réserver.');
        navigate('/login', { state: { from: '/reservation', sitterId } });
      } else {
        setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors de la réservation.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render step content based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DateTimeForm formData={formData} onInputChange={handleInputChange} />;
      case 2:
        return <StepsDetails formData={formData} onInputChange={handleInputChange} />;
      case 3:
        return <StepSummary bookingData={bookingData} />;
      default:
        return <DateTimeForm formData={formData} onInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader onBack={handlePrevious} showBackButton={true} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressSteps currentStep={currentStep} />

        <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Précédent
              </button>
            )}
            <div className="flex-1"></div>

            <button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              className={`px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>

              ) : currentStep === 3 ? 'Confirmer la réservation' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;