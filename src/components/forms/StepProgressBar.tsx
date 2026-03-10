import React from "react";

interface StepProgressBarProps {
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10 overflow-x-auto py-2 px-2">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all
                ${
                  step === currentStep
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                    : step < currentStep
                      ? "bg-gray-300 text-gray-600"
                      : "bg-gray-200 text-gray-500"
                }`}
            >
              {step < currentStep ? step : step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 md:w-16 h-0.5 mx-1 transition-colors ${
                  step < currentStep ? "bg-gray-300" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgressBar;
