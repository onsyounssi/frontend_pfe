<<<<<<< HEAD
=======
// pages/BookingsPage.jsx (version refactorisée avec composants)
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
import React, { useState } from 'react';
import BookingHeader from '../components/BookingHeader';
import ProgressSteps from '../components/ProgressSteps';
import DateTimeForm from '../components/DateTimeForm';
<<<<<<< HEAD
import StepsDetails from '../components/StepsDetails';
import StepSummary from '../components/StepSummary';


function BookingPage () {
   const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    childrenCount: 1,
    specialNeeds: ''
  });

  // Données mockées pour l'exemple (à remplacer par les vraies données)
  const mockBookingData = {
    date: formData.date || '2026-03-18',
    startTime: formData.startTime || '02:48',
    endTime: formData.endTime || '03:49',
    childrenCount: formData.childrenCount || 2,
    totalPrice: 45
  };
=======

function BookingsPage (){
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

<<<<<<< HEAD
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Logique de soumission de la réservation
    console.log('Réservation confirmée:', formData);
    alert('Réservation confirmée avec succès !');
  };

  // Render step content based on current step
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <DateTimeForm formData={formData} onInputChange={handleInputChange} />;
      case 2:
        return <StepsDetails formData={formData} onInputChange={handleInputChange} />;
      case 3:
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
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Précédent
              </button>
            )}
            <div className="flex-1"></div>
            <button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold"
            >
              {currentStep === 3 ? 'Confirmer la réservation' : 'Suivant'}
            </button>
          </div>
        </div>
=======
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données de réservation:', formData);
    // Passer à l'étape suivante
    setCurrentStep(2);
    // Navigation vers la page suivante
  };

  const handleBack = () => {
    console.log('Retour à la page précédente');
    // Logique de navigation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader title="Réservation" onBack={handleBack} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressSteps currentStep={currentStep} />
        
        <DateTimeForm 
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default BookingPage;
=======
export default BookingsPage;
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
