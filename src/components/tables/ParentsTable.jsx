import React from 'react';
import ActionButtons from '../common/ActionButtons';

const shortenId = (id) => {
  const s = id != null ? String(id) : '';
  if (!s) return '—';
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
};

const ParentsTable = ({ parents, onEdit, onDelete, deletingId }) => {
  if (!parents.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-500 text-sm">
        Aucun parent ne correspond à votre recherche.
      </div>
    );
  }

  return (
    <table className="min-w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Réf.</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Nom</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Email</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Ville</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Statut</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {parents.map((parent) => (
          <tr key={parent.id} className="hover:bg-gray-50/60">
            <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap" title={parent.id}>
              {shortenId(parent.id)}
            </td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.nom}</td>
            <td className="px-6 py-3 text-gray-600 max-w-[200px] truncate" title={parent.email}>
              {parent.email || '—'}
            </td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.ville}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.statut}</td>
            <td className="px-6 py-3">
              <ActionButtons
                onEdit={() => onEdit(parent)}
                onDelete={() => onDelete(parent.id)}
                deleteDisabled={deletingId === parent.id}
                editDisabled={!!deletingId}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ParentsTable;
