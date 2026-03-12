import React, { useState } from 'react';

const RatingStars = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (value) => {
    onRatingChange(value);
  };

  const renderStar = (position) => {
    const isFilled = (hoveredRating || rating) >= position;
    
    return (
      <button
        key={position}
        className="focus:outline-none transition-transform hover:scale-110"
        onClick={() => handleRatingClick(position)}
        onMouseEnter={() => setHoveredRating(position)}
        onMouseLeave={() => setHoveredRating(0)}
        aria-label={`Noter ${position} étoile${position > 1 ? 's' : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isFilled ? '#FFD700' : 'none'}
          stroke={isFilled ? '#FFD700' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-10 h-10 ${isFilled ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      </button>
    );
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Note globale {rating > 0 && `- ${rating}/5`}
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(position => renderStar(position))}
      </div>
      {rating === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Cliquez sur les étoiles pour donner votre note
        </p>
      )}
    </div>
  );
};

export default RatingStars;