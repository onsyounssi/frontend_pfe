import React, { useState } from 'react';

const Header = ({ title, showBackButton = true }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        {showBackButton && (
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            onClick={() => window.history.back()}
            aria-label="Retour"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-arrow-left w-5 h-5 text-gray-700" 
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-pink-600">{title}</h1>
      </div>
    </header>
  );
};

export default Header;