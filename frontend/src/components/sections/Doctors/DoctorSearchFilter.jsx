import React from 'react';
import { FaSearch, FaUndo, FaProcedures, FaHospital, FaUserMd } from 'react-icons/fa';

const DoctorSearchFilter = ({ onSearch, searchFilters, setSearchFilters, departments = [], specialties = [], branches = [] }) => {
  const handleInputChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value === '' ? '' : value
    }));
  };
  const handleReset = () => {
    setSearchFilters({ branchId: '', departmentId: '', specialtyId: '', doctorName: '' });
  };
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-blue-500"><FaSearch /></span>
        <span>Tìm kiếm bác sĩ</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Chuyên khoa */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">Chuyên khoa</label>
          <div className="relative">
            <FaProcedures className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.specialtyId}
              onChange={e => handleInputChange('specialtyId', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="">Tất cả chuyên khoa</option>
              {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        {/* Khoa */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">Khoa</label>
          <div className="relative">
            <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.departmentId}
              onChange={e => handleInputChange('departmentId', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="">Tất cả khoa</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        {/* Bệnh viện */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-600 mb-1">Bệnh viện</label>
          <div className="relative">
            <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={searchFilters.branchId}
              onChange={e => handleInputChange('branchId', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            >
              <option value="">Tất cả bệnh viện</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Tên bác sĩ */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Tên bác sĩ</label>
        <div className="relative">
          <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchFilters.doctorName}
            onChange={e => handleInputChange('doctorName', e.target.value)}
            placeholder="Nhập tên bác sĩ..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          />
        </div>
      </div>
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