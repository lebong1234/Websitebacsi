import React from 'react';

const DoctorCard = ({ 
  Id,
  Name = "Tên bác sĩ", 
  DoctorImage, 
  SpecializingIn, 
  WorkingAtBranch,
  onClick 
}) => {
  return (
    <div 
      className="single_expert group cursor-pointer mb-6 hover:shadow-2xl hover:ring-2 hover:ring-blue-300"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => { if (e.key === 'Enter') onClick && onClick(); }}
      aria-label={`Xem chi tiết bác sĩ: ${Name}`}
      title={`Xem chi tiết bác sĩ: ${Name}`}
    >
      <div className="expert_thumb rounded-t-lg overflow-hidden shadow-lg">
        <img 
          src={DoctorImage || '/default-doctor.png'} 
          alt={`Dr. ${Name}`}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="experts_name text-center bg-blue-50 pt-6 pb-6 transition-all duration-300 group-hover:bg-blue-500 rounded-b-lg shadow-lg">
        <h3 className="text-xl font-medium mb-1 text-gray-900 transition-colors duration-300 group-hover:text-white">
          {Name}
        </h3>
        <span className="text-gray-500 text-sm transition-colors duration-300 group-hover:text-white">
          {SpecializingIn}
        </span>
        {WorkingAtBranch && (
          <p className="text-xs text-gray-400 mt-1 transition-colors duration-300 group-hover:text-white">
            {WorkingAtBranch}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;

