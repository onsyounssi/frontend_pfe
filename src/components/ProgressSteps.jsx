// components/ProgressSteps.jsx
import React from 'react';

const ProgressSteps = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: 'Date & Heure' },
    { number: 2, label: 'Détails' },
    { number: 3, label: 'Confirmation' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center flex-1">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2
                ${currentStep >= step.number 
                  ? 'bg-pink-500 border-pink-500 text-white' 
                  : 'border-gray-300 text-gray-400'}
              `}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between text-sm">
        {steps.map((step, index) => (
          <span 
            key={step.number}
            className={currentStep >= step.number 
              ? 'text-pink-600 font-semibold' 
              : 'text-gray-400'}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;