import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-800"
      >
        <Pencil className="w-4 h-4" />
        <span className="hidden sm:inline">Modifier</span>
      </button>
      
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Supprimer</span>
      </button>
    </div>
  );
};

export default ActionButtons;