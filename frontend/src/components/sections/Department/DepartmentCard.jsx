import React from 'react';

const DepartmentCard = ({ dept, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={dept.image}
          alt={dept.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f0f0f0/999999?text=No+Image';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {dept.title}
        </h3>
      </div>

      {/* Hover overlay effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
};

export default DepartmentCard;