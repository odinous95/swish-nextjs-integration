// src/features/checkout/ui/CheckoutSteps.tsx
import React from 'react';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep
}) => {
  const steps = [
    { number: 1, title: 'Leveransuppgifter', icon: MapPin },
    { number: 2, title: 'Leverans',         icon: Calendar },
    { number: 3, title: 'Granska & Betala',  icon: CheckCircle },
  ];

  // Procent för hur mycket av linjen som ska fyllas
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {/* Grå bakgrundslinje */}
        <div
          className="
            absolute
            top-6 left-0 right-0
            h-1 bg-gray-200
            z-0
          "
        />

        {/* Färgad progress-linje */}
        <div
          className="
            absolute
            top-6 left-0
            h-1
            bg-gradient-to-r from-[#FFD54F] to-[#FFB300]
            z-0
            transition-all duration-500 ease-out
          "
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step) => {
          const Icon        = step.icon;
          const isCompleted = currentStep > step.number;
          const isActive    = currentStep === step.number;
          const canNav      = canNavigateToStep(step.number);

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => canNav && onStepClick(step.number)}
                disabled={!canNav}
                className={`
                  mb-3 flex h-12 w-12 items-center justify-center
                  rounded-full transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black shadow-lg'
                      : isActive
                      ? 'bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black shadow-lg scale-110'
                      : canNav
                      ? 'bg-white border-2 border-gray-300 text-gray-400 hover:border-[#FFD54F] hover:text-[#FFB300] cursor-pointer'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {isCompleted
                  ? <CheckCircle className="h-6 w-6" />
                  : <Icon       className="h-6 w-6" />
                }
              </button>

              <h3 className={`
                text-sm font-medium transition-colors duration-300
                ${isActive || isCompleted ? 'text-black' : 'text-gray-500'}
              `}>
                {step.title}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
