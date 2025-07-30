import React from 'react';
import { FaHeartbeat, FaPhoneAlt, FaFirstAid } from "react-icons/fa";

const ServicesSection = ({ services }) => {
  return (
    <div className='service-area'>
      <div className="w-full bg-transparent py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {services.map((service, index) => (
              <div
                key={index}
                className={`w-full md:w-1/3 p-4 ${service.bgColor} transition-all`}
              >
                <div className="p-3">
                  <div className="mb-2">{service.icon}</div>
                  <h3 className="text-2xl md:text-xl font-medium text-gray-800">{service.title}</h3>
                  <p className="text-base font-normal leading-7 text-gray-700 mt-2 mb-2">
                    {service.description}
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-white text-black px-4 py-2 border border-black hover:bg-black hover:text-white transition"
                  >
                    {service.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;