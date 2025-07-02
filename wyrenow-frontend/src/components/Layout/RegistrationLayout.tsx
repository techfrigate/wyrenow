import React, { ReactNode } from 'react';
import { Button, ProgressSteps } from '../ui';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { RegistrationStep } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface RegistrationLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  steps: RegistrationStep[];
  currentStep: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLastStep: boolean;
  validUserLoading?: boolean
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  children,
  title,
  subtitle,
  steps,
  currentStep,
  isLoading = false,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
  validUserLoading
}) => {
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <ProgressSteps steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={onPrevious}
            disabled={currentStep === 1}
            variant="secondary"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {isLastStep ? (
            <Button
              onClick={onSubmit ?? (() => {})}
              disabled={isLoading}
              variant="success"
              icon={isLoading ? (
                 <LoadingSpinner size="sm" variant="white"/>
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            >
              {isLoading ? 'Processing...' : 'Complete Registration'}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              icon={validUserLoading?  <LoadingSpinner size="sm" variant="white"/> : <ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              disabled={validUserLoading}
            >
              {validUserLoading ? 'Validating User...' : 'Next' }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationLayout;