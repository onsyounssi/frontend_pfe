import React, { useState, useEffect } from 'react';

const STATUTS = [
  { value: 'pending', label: 'En attente' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const BookingForm = ({ initialData, parents, sitterProfiles, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    parentId: '',
    sitterProfileId: '',
    dateDebut: '',
    dateFin: '',
    childrenCount: 1,
    message: '',
    statut: 'pending',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        parentId: initialData.parentId?._id || initialData.parentId || '',
        sitterProfileId: initialData.sitterProfileId?._id || initialData.sitterProfileId || '',
        dateDebut: toDatetimeLocal(initialData.dateDebut),
        dateFin: toDatetimeLocal(initialData.dateFin),
        childrenCount: initialData.childrenCount ?? 1,
        message: initialData.message || '',
        statut: initialData.statut || 'pending',
      });
    } else {
      setFormData({
        parentId: parents[0]?.id || '',
        sitterProfileId: sitterProfiles[0]?.id || '',
        dateDebut: '',
        dateFin: '',
        childrenCount: 1,
        message: '',
        statut: 'pending',
      });
    }
  }, [initialData, parents, sitterProfiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      childrenCount: Number(formData.childrenCount) || 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
        <select
          name="parentId"
          value={formData.parentId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
        >
          <option value="">— Choisir un parent —</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom} ({p.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Baby-sitter (profil)</label>
        <select
          name="sitterProfileId"
          value={formData.sitterProfileId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
        >
          <option value="">— Choisir un baby-sitter —</option>
          {sitterProfiles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} — {s.tarifHoraire} DT/h
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure début</label>
          <input
            type="datetime-local"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure fin</label>
          <input
            type="datetime-local"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d&apos;enfants</label>
          <input
            type="number"
            name="childrenCount"
            min={1}
            max={10}
            value={formData.childrenCount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          >
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message / note</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-600/20"
          placeholder="Informations complémentaires..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition disabled:opacity-60"
        >
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer la réservation'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
