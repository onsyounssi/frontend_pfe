// components/Header.jsx
import { useState } from "react";

const Header = ({ 
  logoText = "SmartBabyCare",
  onSearchClick,
  onBookingsClick,
  onMessagesClick,
  onAccountClick,
  userAuthenticated = false,
  userName = ""
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600 cursor-pointer">
          {logoText}
        </h1>
        
        <nav className="hidden md:flex space-x-8">
          <a href="/babysitter">
          <button 
            onClick={onSearchClick}
            className="text-gray-600 hover:text-pink-600 transition"
          >
            Recherche
          </button>
          </a>
          <button 
            onClick={onBookingsClick}
            className="text-gray-600 hover:text-pink-600 transition"
          >
            Mes réservations
          </button>
           <a href="/chat">
          <button 
            onClick={onMessagesClick}
            className="text-gray-600 hover:text-pink-600 transition"
          >
            Messages
          </button>
          </a>
        </nav>
        <a href="/reviews">
        <button 
          onClick={onAccountClick}
          className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
        >
          {userAuthenticated ? userName : "Mon compte"}
        </button>
        </a>
      </div>
    </header>
  );
};

export default Header;