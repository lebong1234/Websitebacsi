import React from 'react';

const DepartmentCard = ({ dept, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-2 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      {/* Icon/Ảnh tròn */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4 shadow-sm overflow-hidden">
        <img
          src={dept.image}
          alt={dept.title}
          className="w-14 h-14 object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80/f0f0f0/999999?text=No+Image';
          }}
        />
      </div>
      {/* Tên khoa */}
      <h3 className="text-2xl font-extrabold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 text-center">
        {dept.title}
      </h3>
      {/* Mô tả ngắn */}
      <div className="text-gray-500 text-base text-center line-clamp-3" style={{minHeight: 60}}>
        {dept.details?.overview || dept.desc}
      </div>
      {/* Hover overlay effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );
};

export default DepartmentCard;