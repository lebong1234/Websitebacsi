// components/sections/booking/SpecialtySelection.jsx
import React from "react";
import { Stethoscope, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const SpecialtySelection = ({ specialties, selectedBranch, selectedDepartment, onSelect, loading }) => {
  if (loading && !specialties.length) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn chuyên khoa</h2>
        <div className="bg-blue-50 rounded-lg p-3 inline-block shadow">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-blue-600">{selectedBranch.branchName}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="font-semibold text-blue-600">{selectedDepartment.departmentName}</span>
          </p>
        </div>
      </div>
      {specialties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((spe) => (
            <div
              key={spe.idSpecialty}
              onClick={() => onSelect(spe)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200"
            >
              <div className="relative h-40 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                  {spe.specialtyName}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {spe.description || "Mô tả chuyên khoa..."}
                </p>
                <div className="flex items-center justify-end">
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có chuyên khoa</h3>
          <p className="text-gray-500">Không có chuyên khoa nào cho khoa đã chọn, hoặc đang tải...</p>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelection;
