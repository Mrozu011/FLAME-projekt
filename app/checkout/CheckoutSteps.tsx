'use client';

interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: 'Login', description: 'Account options' },
    { number: 2, title: 'Contact & Shipping', description: 'Your details' },
    { number: 3, title: 'Delivery', description: 'Shipping method' },
    { number: 4, title: 'Payment', description: 'Complete order' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
              currentStep >= index 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > index ? (
                <i className="ri-check-line"></i>
              ) : (
                step.number
              )}
            </div>
            <div className="ml-3">
              <div className={`text-sm font-medium ${
                currentStep >= index ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              currentStep > index ? 'bg-black' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );
}