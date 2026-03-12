import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, onAddClick }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Rechercher…"
          className="pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition bg-pink-600 hover:bg-pink-700"
      >
        <Plus className="w-4 h-4" />
        Ajouter
      </button>
    </div>
  );
};

export default SearchBar;