import React from 'react';
import ActionButtons from '../common/ActionButtons';

const STATUT_LABELS = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Acceptée', className: 'bg-blue-100 text-blue-800' },
  confirmed: { label: 'Confirmée', className: 'bg-green-100 text-green-800' },
  completed: { label: 'Terminée', className: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800' },
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const BookingsTable = ({ bookings, onEdit, onDelete, deletingId }) => {
  if (!bookings.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-500 text-sm">
        Aucune réservation trouvée.
      </div>
    );
  }

  return (
    <table className="min-w-full text-left text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Parent</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Baby-sitter</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Période</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Montant</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Statut</th>
          <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {bookings.map((b) => {
          const parentName = b.parentId
            ? `${b.parentId.firstName || ''} ${b.parentId.lastName || ''}`.trim() || b.parentId.email
            : '—';
          const sitterName = b.sitterProfileId
            ? `${b.sitterProfileId.prenom || ''} ${b.sitterProfileId.nom || ''}`.trim()
            : '—';
          const st = STATUT_LABELS[b.statut] || { label: b.statut, className: 'bg-gray-100 text-gray-700' };

          return (
            <tr key={b.id} className="hover:bg-gray-50/60">
              <td className="px-6 py-3 text-gray-800">
                <div className="font-medium">{parentName}</div>
                <div className="text-xs text-gray-500">{b.parentId?.email || ''}</div>
              </td>
              <td className="px-6 py-3 text-gray-800 whitespace-nowrap">{sitterName}</td>
              <td className="px-6 py-3 text-gray-600 text-xs">
                <div>{formatDate(b.dateDebut)}</div>
                <div className="text-gray-400">→ {formatDate(b.dateFin)}</div>
              </td>
              <td className="px-6 py-3 font-semibold text-pink-600 whitespace-nowrap">
                {b.montantTotale != null ? `${Number(b.montantTotale).toFixed(2)} DT` : '—'}
              </td>
              <td className="px-6 py-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                  {st.label}
                </span>
              </td>
              <td className="px-6 py-3">
                <ActionButtons
                  onEdit={() => onEdit(b)}
                  onDelete={() => onDelete(b.id)}
                  deleteDisabled={deletingId === b.id}
                  editDisabled={!!deletingId}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BookingsTable;
