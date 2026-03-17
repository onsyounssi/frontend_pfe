// components/BookingHeader.jsx
import React from 'react';
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
  );
};

export default BookingHeader;