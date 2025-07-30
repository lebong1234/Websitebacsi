import React from 'react';
import { X, Calendar, Search } from 'lucide-react';

const DepartmentModal = ({ department, onClose }) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-modal-appear">
        <div className="relative h-24 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              Tổng Quan
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {department.details.overview}
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-green-500 rounded-full"></div>
              Dịch Vụ Của Chúng Tôi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {department.details.services.map((service, index) => (
                <div key={index} className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                  <span className="font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5" />
              Xem Chuyên Khoa
            </button>
            <button className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-xl hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 font-semibold text-lg transform hover:scale-105 flex items-center justify-center gap-3">
              <Search className="w-5 h-5" />
              Tìm Bác Sĩ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;