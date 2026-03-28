import React from 'react';

const PositiveTags = ({ tags, selectedTags, onTagClick }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Points positifs {selectedTags.length > 0 && `(${selectedTags.length} sélectionné${selectedTags.length > 1 ? 's' : ''})`}
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`px-4 py-2 border rounded-full transition text-sm font-medium
              ${selectedTags.includes(tag) 
                ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600' 
                : 'border-gray-200 hover:bg-pink-50 hover:border-pink-300 text-gray-700'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositiveTags;