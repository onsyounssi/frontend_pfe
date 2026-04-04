import React from 'react';
import { CheckCircleIcon } from './Icons';

function ProgressSteps({ currentStep }) {
  const steps = [
    { number: 1, label: 'Date & Heure' },
    { number: 2, label: 'Détails' },
    { number: 3, label: 'Confirmation' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 px-2 relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10 bg-white transition-colors duration-300 ${currentStep >= step.number
              ? 'bg-pink-500 border-pink-500 text-white'
              : 'border-gray-300 text-gray-400'
              }`}>
              {currentStep > step.number ? <CheckCircleIcon /> : step.number}
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${currentStep > step.number ? 'bg-pink-500' : 'bg-gray-300'
                }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-sm w-full">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`w-1/4 text-center ${currentStep >= step.number ? 'text-pink-600 font-semibold' : 'text-gray-400'}`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressSteps;