import React from 'react';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

const ActionButtons = ({ onEdit, onDelete, onViewProfile, deleteDisabled, editDisabled }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {onViewProfile && (
        <button
          type="button"
          onClick={onViewProfile}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition text-sm"
          title="Voir le profil public"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">Profil</span>
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        disabled={editDisabled}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-800 disabled:opacity-50"
      >
        <Pencil className="w-4 h-4" />
        <span className="hidden sm:inline">Modifier</span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleteDisabled}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Supprimer</span>
      </button>
    </div>
  );
};

export default ActionButtons;
