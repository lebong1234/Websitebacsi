import React from "react";
import { MapPin, Building2, Stethoscope } from "lucide-react";

const StepHeader = ({ currentStep }) => {
  const steps = [
    { step: 1, label: "Chi nhánh", icon: MapPin },
    { step: 2, label: "Khoa", icon: Building2 },
    { step: 3, label: "Chuyên khoa", icon: Stethoscope },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6">
      {steps.map((item, index) => (
        <React.Fragment key={item.step}>
          <div
            className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
              currentStep >= item.step
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-6 h-0.5 sm:w-8 ${
                currentStep > item.step ? "bg-blue-500" : "bg-gray-300"
              } transition-colors duration-300`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepHeader;
