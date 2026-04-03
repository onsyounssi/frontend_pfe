import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingHeader from '../components/BookingHeader';
import ProgressSteps from '../components/ProgressSteps';
import DateTimeForm from '../components/DateTimeForm';
import StepsDetails from '../components/StepsDetails';
import PaymentStep from '../components/PaymentStep';
import StepSummary from '../components/StepSummary';
import { getToken } from '../services/authService';

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sitterId, setSitterId] = useState(null);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    // Récupérer le SitterId
    if (location.state?.sitterId) {
      setSitterId(location.state.sitterId);
    }

    // Récupérer le ParentId
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setParentId(user.id || user._id);
    }
  }, [location]);

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
  const mockBookingData = {
    date: formData.date || '2026-03-31',
    startTime: formData.startTime || '08:00',
    endTime: formData.endTime || '12:00',
    childrenCount: formData.childrenCount || 1,
    totalPrice: 45 // Montant fixe pour l'exemple
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Construction des dates avec Mongoose Date format (YYYY-MM-DDTHH:mm:ss.sssZ)
    // On assume que formData.date est format 'YYYY-MM-DD' et start/endTime est 'HH:mm'
    // Pour simplifier, on envoie directement les bons formats si possible, sinon on construit:
    const baseDate = formData.date || new Date().toISOString().split('T')[0];
    const start = formData.startTime || '08:00';
    const end = formData.endTime || '12:00';

    let dateDebutDate = new Date(`${baseDate}T${start}:00`);
    let dateFinDate = new Date(`${baseDate}T${end}:00`);

    const bookingPayload = {
      sitterProfileId: sitterId, // changement de sitterId vers sitterProfileId pour correspondre au backend
      dateDebut: dateDebutDate.toISOString(),
      dateFin: dateFinDate.toISOString(),
      montantTotale: mockBookingData.totalPrice,
      message: formData.specialNeeds || "", // Ajout du champ message si disponible
      statut: 'pending'
    };

    try {
      const token = getToken();

      if (!token) {
        throw new Error('Accès non autorisé : token manquant');
      }

      const response = await fetch('/api/Bookings/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réservation');
      }

      console.log('Réservation confirmée via API:', data);
      alert('Réservation confirmée avec succès ! Le baby-sitter recevra une notification.');
      // Rediriger vers le tableau de bord parent
      navigate('/parente');

    } catch (err) {
      console.error(err);
      setError(err.message);
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
        return <PaymentStep formData={formData} onInputChange={handleInputChange} />;
      case 4:
        return <StepSummary bookingData={mockBookingData} />;
      default:
        return <DateTimeForm formData={formData} onInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader onBack={handlePrevious} showBackButton={currentStep > 1} />

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
              onClick={currentStep === 4 ? handleSubmit : handleNext}
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
              ) : currentStep === 4 ? 'Confirmer la réservation' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;