import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ 
  id,
  imageNumber, 
  name = "Mirazul Alom", 
  specialty = "Neurologist", 
  hospital,
  onClick 
}) => {
  return (
    <div 
      className="single_expert group cursor-pointer mb-6"
      // Remove onClick here because Link will handle navigation; 
      // Otherwise keep for other usages if needed.
    >
      <Link to={`/doctor/${id}`} aria-label={`Xem chi tiết bác sĩ ${name}`}>
        <div className="expert_thumb rounded-t-lg overflow-hidden shadow-lg">
          <img 
            src={`../../assets/img/experts/${imageNumber}.png`} 
            alt={`Dr. ${name}`}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="experts_name text-center bg-blue-50 pt-6 pb-6 transition-all duration-300 group-hover:bg-blue-500 rounded-b-lg shadow-lg">
        <h3 className="text-xl font-medium mb-1 text-gray-900 transition-colors duration-300 group-hover:text-white">
          <Link to={`/doctor/${id}`} className="block hover:underline">{name}</Link>
        </h3>
        <span className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-white">
          {specialty}
        </span>
        {hospital && (
          <p className="text-xs text-gray-400 mt-1 transition-colors duration-300 group-hover:text-white">
            {hospital}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;

