import React from 'react';
import ActionButtons from '../common/ActionButtons';

const ParentsTable = ({ parents, onEdit, onDelete }) => {
  return (
    <table className="min-w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">ID</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Nom</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Ville</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Statut</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {parents.map((parent) => (
          <tr key={parent.id} className="hover:bg-gray-50/60">
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.id}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.nom}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.ville}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{parent.statut}</td>
            <td className="px-6 py-3">
              <ActionButtons
                onEdit={() => onEdit(parent)}
                onDelete={() => onDelete(parent.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ParentsTable;