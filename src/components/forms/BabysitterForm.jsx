import React, { useState, useEffect } from 'react';

const BabysitterForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    specialite: '',
    note: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom,
        specialite: initialData.specialite,
        note: initialData.note
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const specialites = ['Nourrissons', 'Multi-enfants', 'Urgences', 'Garderie'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Spécialité
          </label>
          <select
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          >
            <option value="">Sélectionnez une spécialité</option>
            {specialites.map(specialite => (
              <option key={specialite} value={specialite}>
                {specialite}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (0-5)
          </label>
          <input
            type="number"
            name="note"
            value={formData.note}
            onChange={handleChange}
            required
            min="0"
            max="5"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
        >
          Annuler
        </button>

        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition"
        >
          {initialData ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default BabysitterForm;