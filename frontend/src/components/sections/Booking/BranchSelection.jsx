// components/sections/booking/BranchSelection.jsx
import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { API_IMG_URL } from "../../../services/BookingService";

const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-general.png";

const BranchSelection = ({ branches, onSelect, loading, onImageError }) => {
  if (loading && !branches.length) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Chọn chi nhánh</h2>
        <p className="text-gray-600 text-lg">Lựa chọn chi nhánh bạn muốn đặt khám</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map((branch) => (
          <div
            key={branch.idBranch}
            onClick={() => onSelect(branch)}
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer transition-all duration-500 overflow-hidden border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={branch.imageUrl ? `${API_IMG_URL}${branch.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
                alt={branch.branchName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={onImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{branch.branchName}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">{branch.branchAddress}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        ))}
        {branches.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">Không có chi nhánh nào.</p>
        )}
      </div>
    </div>
  );
};

export default BranchSelection;
