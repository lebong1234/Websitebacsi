import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorGrid = ({ doctors, loading, onDoctorClick, onResetFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-slate-200 rounded-lg h-96 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Không tìm thấy bác sĩ phù hợp
        </h3>
        <p className="text-gray-500 mb-6">
          Vui lòng thử lại với từ khóa khác hoặc điều chỉnh các bộ lọc.
        </p>
        <button 
          onClick={onResetFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {doctors.map((doctor, idx) => {
        const key = doctor?.id || doctor?._id || `doctor-${idx}`;
        if (!doctor) return null;
        
        return (
          <DoctorCard
            key={key}
            doctor={doctor}
            onClick={() => onDoctorClick(doctor)}
          />
        );
      })}
    </div>
  );
};

export default DoctorGrid;