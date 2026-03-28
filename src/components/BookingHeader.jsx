// components/BookingHeader.jsx
import React from 'react';
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
  );
};

export default BookingHeader;