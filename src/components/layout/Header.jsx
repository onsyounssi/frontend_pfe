import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">
          <Link to="/">SmartBabyCare</Link>
        </h1>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-pink-600 font-medium transition">
            Comment ça marche
          </Link>
          <Link to="/register-sitter" className="text-gray-600 hover:text-pink-600 font-medium transition">
            Devenir Sitter
          </Link>
          <Link to="/login" className="text-gray-600 hover:text-pink-600 font-medium transition">
            Connexion
          </Link>
          
          <Link to="/recherche-sitters">
            <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition shadow-md">
              Réserver
            </button>
          </Link>
        </nav>

        {/* Bouton Menu Mobile (optionnel) */}
        <div className="md:hidden">
            <Link to="/login" className="text-pink-600 font-bold">Menu</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;