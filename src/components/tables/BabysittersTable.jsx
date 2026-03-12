import React from 'react';
import ActionButtons from '../common/ActionButtons';

const BabysittersTable = ({ babysitters, onEdit, onDelete }) => {
  return (
    <table className="min-w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">ID</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Nom</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Spécialité</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Note</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {babysitters.map((babysitter) => (
          <tr key={babysitter.id} className="hover:bg-gray-50/60">
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.id}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.nom}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.specialite}</td>
            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{babysitter.note}</td>
            <td className="px-6 py-3">
              <ActionButtons 
                onEdit={() => onEdit(babysitter)}
                onDelete={() => onDelete(babysitter.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BabysittersTable;