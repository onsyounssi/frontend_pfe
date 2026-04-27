import React from 'react';
import ActionButtons from '../common/ActionButtons';

const shortenId = (id) => {
  const s = id != null ? String(id) : '';
  if (!s) return '—';
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
};

const BabysittersTable = ({ babysitters, onEdit, onDelete, onViewProfile, deletingId }) => {
  if (!babysitters.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-500 text-sm">
        Aucun baby-sitter ne correspond à votre recherche.
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
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Spécialité</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Note</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Avis</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {babysitters.map((babysitter) => (
          <tr key={babysitter.id} className="hover:bg-gray-50/60">
            <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap" title={babysitter.id}>
              {shortenId(babysitter.id)}
            </td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.nom}</td>
            <td className="px-6 py-3 text-gray-600 max-w-[200px] truncate" title={babysitter.email}>
              {babysitter.email || '—'}
            </td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.specialite}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">
              {typeof babysitter.note === 'number' ? babysitter.note.toFixed(1) : babysitter.note}
            </td>
            <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
              {babysitter.nbAvis || 0} avis
            </td>
            <td className="px-6 py-3">
              <ActionButtons
                onEdit={() => onEdit(babysitter)}
                onDelete={() => onDelete(babysitter.id)}
                onViewProfile={
                  babysitter.profileId && onViewProfile
                    ? () => onViewProfile(babysitter.profileId)
                    : undefined
                }
                deleteDisabled={deletingId === babysitter.id}
                editDisabled={!!deletingId}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BabysittersTable;
