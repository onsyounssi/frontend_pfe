<<<<<<< HEAD
import React from 'react';
import { CheckCircleIcon } from './Icons';

function ProgressSteps ({ currentStep }) {
=======
// components/ProgressSteps.jsx
import React from 'react';

const ProgressSteps = ({ currentStep = 1 }) => {
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
  const steps = [
    { number: 1, label: 'Date & Heure' },
    { number: 2, label: 'Détails' },
    { number: 3, label: 'Confirmation' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 1 
                  ? 'bg-pink-500 border-pink-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > 1 ?( <CheckCircleIcon /> ):( '1')}
               
              </div>

                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > 1 ? 'bg-pink-500' : 'bg-gray-300'
                }`}> </div>  
            </div>
            <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 2 
                  ? 'bg-pink-500 border-pink-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > 2 ? ( <CheckCircleIcon /> ):( '2')}
                </div>
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > 2 ? 'bg-pink-500' : 'bg-gray-300'
              }`}></div>
            </div>
             <div className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= 3 
                  ? 'bg-pink-500 border-pink-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                3
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
            </div>
          </div>


      {/* Step labels */}
      <div className="flex justify-between text-sm">
        {steps.map(step => (
          <span 
            key={step.number}
            className={currentStep >= step.number ? 'text-pink-600 font-semibold' : 'text-gray-400'}
          >
            {step.label}
            
=======
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
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26
          </span>
        ))}
      </div>
    </div>
<<<<<<< HEAD
    
  );
} 
=======
  );
};
>>>>>>> 9aaa2e4f4371e16c1af6eb5b2dc729ee0baf5c26

export default ProgressSteps;