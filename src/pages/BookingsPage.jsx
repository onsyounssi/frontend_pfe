// pages/BookingsPage.jsx (version refactorisée avec composants)
import React, { useState } from 'react';
import BookingHeader from '../components/BookingHeader';
import ProgressSteps from '../components/ProgressSteps';
import DateTimeForm from '../components/DateTimeForm';

function BookingsPage (){
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      </div>
    </div>
  );
};

export default BookingsPage;