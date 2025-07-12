// components/sections/booking/DepartmentSelection.jsx
import React from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { API_IMG_URL } from "../../../services/BookingService";


const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-general.png";

const DepartmentSelection = ({ departments, selectedBranch, onSelect, loading, onImageError }) => {
  if (loading && !departments.length) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn khoa khám</h2>
        <p className="text-gray-600">
          Tại chi nhánh: <span className="text-blue-600 font-semibold">{selectedBranch.branchName}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.idDepartment}
            onClick={() => onSelect(dept)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-200 flex flex-col items-center text-center"
          >
            <img
              src={dept.imageUrl ? `${API_IMG_URL}${dept.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
              alt={dept.departmentName}
              className="w-16 h-16 object-cover mb-4 rounded-lg"
              onError={onImageError}
            />
            <h4 className="text-md font-semibold text-gray-800 mb-1">
              {dept.departmentName}
            </h4>
          </div>
        ))}
        {departments.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">Không có khoa nào cho chi nhánh này.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentSelection;
