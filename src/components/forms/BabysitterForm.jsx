import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const BabysitterForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nom: '',
    specialite: '',
    note: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        specialite: initialData.specialite || '',
        note: initialData.note != null ? String(initialData.note) : '',
        email: initialData.email || '',
        phone: initialData.phone || ''
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
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            required={!initialData}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone (Numéro tunisien)
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Ex: 50123456"
            value={formData.phone || ''}
            onChange={handleChange}
            required={!initialData}
            pattern="[24579][0-9]{7}"
            title="Numéro tunisien (ex: 50123456, sans +216)"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>

        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Exactement 8 caractères"
                value={formData.password || ''}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 italic">Note: Le mot de passe doit faire exactement 8 caractères.</p>
          </div>
        )}

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
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement…' : initialData ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default BabysitterForm;