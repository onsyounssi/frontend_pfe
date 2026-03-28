// components/BookingHeader.jsx
import React from 'react';
<<<<<<< HEAD
import { ArrowLeft} from 'lucide-react';

function BookingHeader ({ onBack, showBackButton= true }) {
  return (
    <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          {showBackButton && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            
          >
            <ArrowLeft  />
          </button>
           )}
          <h1 className="text-2xl font-bold text-pink-600"> Réservation</h1>
        </div>
      </header>
=======
import { ArrowLeft } from 'lucide-react';

function BookingHeader ({ title, onBack }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-pink-600">{title}</h1>
      </div>
    </header>
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
  );
};

export default BookingHeader;