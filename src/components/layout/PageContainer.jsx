// components/layout/PageContainer.jsx
import React from 'react';

const PageContainer = ({ 
  children,           // Le contenu de la page
  maxWidth = '2xl',   // Largeur maximale (par défaut)
  padding = true,     // Activer/désactiver les paddings
  className = ''      // Classes CSS supplémentaires
}) => {
  
  // Mapping des largeurs max disponibles
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full',
    '7xl': 'max-w-7xl'  // Classe Tailwind commune
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Le conteneur principal avec largeur contrôlée */}
      <div className={`
        mx-auto 
        ${maxWidthClasses[maxWidth] || 'max-w-2xl'}
        ${padding ? 'px-4 sm:px-6 lg:px-8 py-8' : ''}
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;