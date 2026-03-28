import React from 'react';

function StepSummary ({ bookingData }) {
  const { date, startTime, endTime, childrenCount, totalPrice } = bookingData;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-semibold">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Heure</span>
            <span className="font-semibold">{startTime} - {endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Enfants</span>
            <span className="font-semibold">{childrenCount}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600">Total estimé</span>
            <span className="text-2xl font-bold text-pink-600">DNT{totalPrice}</span>
          </div>
        </div>
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-pink-800">
          💳 Le paiement sera demandé après confirmation de la baby-sitter.
        </p>
      </div>
    </div>
  );
};

export default StepSummary;