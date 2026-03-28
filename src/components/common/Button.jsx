import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex-1 px-6 py-3 rounded-lg transition font-semibold';
  
  const variants = {
    primary: disabled 
      ? 'bg-pink-500 text-white cursor-not-allowed'
      : 'bg-pink-600 text-white hover:bg-pink-600',
    secondary: 'border border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;