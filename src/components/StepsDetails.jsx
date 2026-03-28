import React from 'react';

function StepDetails ({ formData, onInputChange }){
  return (
<div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de la garde</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre d'enfants
        </label>
        <input
          name="childrenCount"
          type="number"
          min="1"
          placeholder="Ex: 2"
          value={formData.childrenCount}
          onChange={onInputChange}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Besoins spéciaux (optionnel)
        </label>
        <textarea
          name="specialNeeds"
          placeholder="Allergies, médicaments, instructions particulières..."
          rows="4"
          value={formData.specialNeeds}
          onChange={onInputChange}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
    </div>
  </div>
);
};

export default StepDetails;