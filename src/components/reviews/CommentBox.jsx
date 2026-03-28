import React from 'react';

const CommentBox = ({ value, onChange, placeholder }) => {
  return (
    <div className="mb-6">
      <label 
        htmlFor="comment" 
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Commentaire (optionnel)
      </label>
      <textarea
        id="comment"
        placeholder={placeholder}
        rows="5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
      />
      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length} caractères
        </p>
      )}
    </div>
  );
};

export default CommentBox;