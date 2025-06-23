import React from 'react';
import { Check } from 'lucide-react';
import { RegistrationStep } from '../../types';

interface ProgressStepsProps {
  steps: RegistrationStep[];
  currentStep: number;
  className?: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}>
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  );
};

export default ProgressSteps;