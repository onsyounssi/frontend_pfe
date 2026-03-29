// components/SitterCard.jsx
import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function SitterCard({ sitter }) {
  const {
    id,
    name,
    city,
    price,
    rating,
    reviews,
    specialty,
    image,
    available,
    onViewProfile
  } = sitter;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-pink-100">
        <img 
          alt={name} 
          className="w-full h-full object-cover" 
          src={image}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';
          }}
        />
        {available && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Disponible
          </span>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              <span>{city}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{specialty}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-pink-600 font-bold">{price} DNT/h</span>
          <span className="text-gray-500 text-sm">{reviews} avis</span>
        </div>
        
        <Link to={`/profil/${id}`}>
          <button 
            onClick={() => onViewProfile && onViewProfile(sitter)}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition font-semibold"
          >
            Voir le profil
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SitterCard;