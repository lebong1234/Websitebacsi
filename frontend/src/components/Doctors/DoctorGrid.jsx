import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorGrid = ({ doctors, loading, onDoctorClick, onResetFilters }) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-wrap justify-start -mr-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse mr-4 mb-4" style={{ width: 'calc(25% - 16px)' }}>
            <div className="bg-gray-200 rounded-t-lg h-40"></div>
            <div className="bg-gray-100 rounded-b p-2">
              <div className="h-3 bg-gray-200 rounded mb-1 w-3/4 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results found
  if (doctors.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="mb-2">
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Không tìm thấy bác sĩ</h3>
        <p className="text-xs text-gray-500 mb-2">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.</p>
        <button 
          onClick={onResetFilters}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded-md transition-colors duration-200 inline-flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Đặt lại bộ lọc
        </button>
      </div>
    );
  }

  // Doctor grid
  return (
    <div className="flex flex-wrap justify-center -mr-4">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="mr-6 mb-4" style={{ width: 'calc(25% - 45px)'  }}>
          <DoctorCard
            imageNumber={doctor.imageNumber}
            name={doctor.name}
            specialty={doctor.specialty}
            hospital={doctor.hospital}
            onClick={() => onDoctorClick && onDoctorClick(doctor)}
          />
        </div>
      ))}
    </div>
  );
};

export default DoctorGrid;