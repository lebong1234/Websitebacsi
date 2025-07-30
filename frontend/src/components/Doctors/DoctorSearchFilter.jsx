import React from 'react';
import { FaSearch, FaUndo, FaClinicMedical, FaHospital, FaProcedures, FaUserMd } from 'react-icons/fa';

const DoctorSearchFilter = ({ onSearch, searchFilters, setSearchFilters }) => {
  const specialties = [
    'Tất cả chuyên khoa',
    'Tim mạch',
    'Thần kinh',
    'Nhi khoa',
    'Sản phụ khoa',
    'Ngoại khoa',
    'Nội khoa',
    'Da liễu',
    'Mắt',
    'Tai mũi họng'
  ];

  const departments = [
    'Tất cả khoa',
    'Khoa Nội',
    'Khoa Ngoại',
    'Khoa Nhi',
    'Khoa Sản',
    'Khoa Mắt',
    'Khoa TMH',
    'Khoa Da liễu',
    'Khoa Thần kinh'
  ];

  const hospitals = [
    'Tất cả bệnh viện',
    'Bệnh viện Chợ Rẫy',
    'Bệnh viện Bình Dan',
    'Bệnh viện 115',
    'Bệnh viện Đại học Y Dược',
    'Bệnh viện Nhi Đồng',
    'Bệnh viện Từ Dũ',
    'Bệnh viện Thống Nhất'
  ];

  const clinics = [
    'Tất cả phòng khám',
    'Phòng khám Đa khoa An Sinh',
    'Phòng khám Đa khoa Hoàn Mỹ',
    'Phòng khám Đa khoa Sài Gòn',
    'Phòng khám Tim mạch',
    'Phòng khám Nhi khoa',
    'Phòng khám Da liễu'
  ];

  const handleInputChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSearchFilters({
      specialty: 'Tất cả chuyên khoa',
      department: 'Tất cả khoa',
      hospital: 'Tất cả bệnh viện',
      clinic: 'Tất cả phòng khám',
      doctorName: ''
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaSearch className="text-blue-500" />
        <span>Tìm kiếm bác sĩ</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Chuyên khoa */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Chuyên khoa
          </label>
          <div className="relative">
            <FaProcedures className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Khoa */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Khoa
          </label>
          <div className="relative">
            <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {departments.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bệnh viện */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Bệnh viện
          </label>
          <div className="relative">
            <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.hospital}
              onChange={(e) => handleInputChange('hospital', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {hospitals.map((hospital, index) => (
                <option key={index} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Phòng khám */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Phòng khám
          </label>
          <div className="relative">
            <FaClinicMedical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.clinic}
              onChange={(e) => handleInputChange('clinic', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              {clinics.map((clinic, index) => (
                <option key={index} value={clinic}>{clinic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tên bác sĩ */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Tên bác sĩ
        </label>
        <div className="relative">
          <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchFilters.doctorName}
            onChange={(e) => handleInputChange('doctorName', e.target.value)}
            placeholder="Nhập tên bác sĩ..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
        </div>
      </div>

      {/* Nút tìm kiếm */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={onSearch}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
        >
          <FaSearch className="text-sm" />
          <span>Tìm kiếm</span>
        </button>
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
        >
          <FaUndo className="text-sm" />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorSearchFilter;