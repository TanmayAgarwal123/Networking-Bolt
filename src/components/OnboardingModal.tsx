import React, { useState } from 'react';
import { X, Rocket, Users, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSampleData: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateSampleData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to NetworkMaster!',
      icon: <Rocket className="w-16 h-16 text-blue-600" />,
      description:
        'Your complete platform for managing professional connections and landing your dream job in tech.',
      features: [
        'Track and prioritize your network contacts',
        'Schedule meetings and follow-ups',
        'Monitor your networking progress',
        'Access learning resources and conversation templates',
      ],
    },
    {
      title: 'Get Started Quickly',
      icon: <Users className="w-16 h-16 text-green-600" />,
      description:
        "We'll create some sample contacts to help you understand how NetworkMaster works.",
      features: [
        'Sample contacts with different priorities',
        'Example meeting schedules',
        'Pre-configured networking goals',
        'Achievement tracking system',
      ],
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateSamples();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleCreateSamples = async () => {
    setIsCreating(true);
    await onCreateSampleData();
    setIsCreating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-6">{currentStepData.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {currentStepData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentStepData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full mx-1 transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              disabled={isCreating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>{currentStep < steps.length - 1 ? 'Next' : 'Create Sample Data'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
