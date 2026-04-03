import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="text-2xl font-bold text-pink-600 cursor-pointer flex items-center gap-2" 
          onClick={() => navigate('/')}
        >
          <span className="text-3xl"></span>
          SmartBabyCare
        </div>

        {/* Navigation Centrale */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/dashboard" className="text-pink-600 font-semibold border-b-2 border-pink-600 pb-1">
            Tableau de bord
          </Link>
          <Link to="/recherche-sitters" className="text-gray-500 hover:text-pink-600 transition">
            Recherche
          </Link>
          <Link to="/chat" className="text-gray-500 hover:text-pink-600 transition">
            Messages
          </Link>
        </nav>

        {/* Bouton Compte */}
        <button 
          onClick={() => navigate('/profil')}
          className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition shadow-sm font-medium"
        >
          Mon compte
        </button>
      </div>
    </header>
  );
};

export default Header;