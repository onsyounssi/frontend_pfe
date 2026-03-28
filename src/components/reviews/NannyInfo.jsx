import React from 'react';

const NannyInfo = ({ name, date, imageUrl }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <img 
        alt={name} 
        className="w-16 h-16 rounded-full object-cover border-2 border-pink-100" 
        src={imageUrl}
      />
      <div>
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <p className="text-gray-600">Garde du {date}</p>
      </div>
    </div>
  );
};

export default NannyInfo;