import React, { useState, useEffect } from "react";
import StepHeader from "@/components/sections/Booking/StepHeader";
import ErrorAlert from "@/components/sections/Booking/ErrorAlert";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BranchSelection from "@/components/sections/Booking/BranchSelection";
import DepartmentSelection from "@/components/sections/Booking/DepartmentSelection";
import SpecialtySelection from "@/components/sections/Booking/SpecialtySelection";
import { getBranchs, getDepartment, getSpecialtiesByDepartment, getDoctorsByCriteria } from "@/services/BookingService";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const navigate = useNavigate();

  // Load branches and departments on mount
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const branchesData = await getBranchs();
        const departmentsData = await getDepartment();
        setBranches(branchesData);
        setDepartments(departmentsData);
      } catch (err) {
        setError("Không thể tải chi nhánh hoặc khoa.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // Load specialties when department changes
  useEffect(() => {
    if (!selectedDepartment) return;
    setLoading(true);
    setError(null);
    getSpecialtiesByDepartment(selectedDepartment.idDepartment)
      .then((data) => setSpecialties(data))
      .catch(() => setError("Không thể tải chuyên khoa."))
      .finally(() => setLoading(false));
  }, [selectedDepartment]);

  // Step 1: Chọn chi nhánh
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedDepartment(null);
    setSelectedSpecialty(null);
    setDoctors([]);
    setCurrentStep(2);
    setError(null);
  };

  // Step 2: Chọn khoa (lọc theo chi nhánh)
  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedSpecialty(null);
    setDoctors([]);
    setCurrentStep(3);
    setError(null);
  };
  const filteredDepartments = selectedBranch
    ? departments.filter((dept) => dept.branchId === selectedBranch.idBranch)
    : [];

  // Step 3: Chọn chuyên khoa
  const handleSpecialtySelect = async (specialty) => {
    setSelectedSpecialty(specialty);
    setDoctors([]);
    setDoctorsError(null);
    setCurrentStep(4);
    if (!selectedBranch || !selectedDepartment || !specialty) return;
    setDoctorsLoading(true);
    try {
      const list = await getDoctorsByCriteria(
        selectedBranch.idBranch,
        selectedDepartment.idDepartment,
        specialty.idSpecialty
      );
      setDoctors(list);
      if (list.length === 0) {
        setDoctorsError("Không tìm thấy bác sĩ phù hợp với lựa chọn.");
      }
    } catch (err) {
      setDoctorsError("Lỗi khi tìm bác sĩ.");
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Step 4: Chọn bác sĩ
  const handleDoctorSelect = (doctor) => {
    navigate("/showdr", { state: { doctorID: doctor.Id || doctor.DoctorId } });
  };

  // Quay lại bước trước
  const goBack = () => {
    setError(null);
    if (currentStep === 4) {
      setSelectedSpecialty(null);
      setDoctors([]);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setSelectedDepartment(null);
      setSpecialties([]);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setSelectedBranch(null);
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <StepHeader currentStep={currentStep} />
            <div className="mt-4">
              <button
                onClick={goBack}
                disabled={currentStep === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
        <ErrorAlert error={error} />
        {loading && <LoadingSpinner />}
        {currentStep === 1 && (
          <BranchSelection
            branches={branches}
            onSelect={handleBranchSelect}
            loading={loading}
            onImageError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder-general.png";
            }}
          />
        )}
        {currentStep === 2 && selectedBranch && (
          <DepartmentSelection
            departments={filteredDepartments}
            selectedBranch={selectedBranch}
            onSelect={handleDepartmentSelect}
            loading={loading}
            onImageError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder-general.png";
            }}
          />
        )}
        {currentStep === 3 && selectedDepartment && selectedBranch && (
          <SpecialtySelection
            specialties={specialties}
            selectedBranch={selectedBranch}
            selectedDepartment={selectedDepartment}
            onSelect={handleSpecialtySelect}
            loading={loading}
          />
        )}
        {currentStep === 4 && selectedSpecialty && selectedDepartment && selectedBranch && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn bác sĩ</h2>
              <div className="bg-blue-50 rounded-lg p-3 inline-block shadow">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold text-blue-600">{selectedBranch.branchName}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="font-semibold text-blue-600">{selectedDepartment.departmentName}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="font-semibold text-blue-600">{selectedSpecialty.specialtyName}</span>
                </p>
              </div>
            </div>
            {doctorsLoading ? (
              <LoadingSpinner />
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.Id || doctor.DoctorId || doctor.id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200"
                  >
                    <div className="relative h-40">
                      <img
                        src={doctor.DoctorImage || doctor.Img || "/images/placeholder-general.png"}
                        alt={doctor.Name || doctor.DoctorName || "Bác sĩ"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder-general.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <h3 className="absolute bottom-3 left-3 right-3 text-lg font-semibold text-white mb-1 line-clamp-2">
                        {doctor.Name || doctor.DoctorName || "Tên bác sĩ"}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{doctor.DoctorDegree || doctor.Degree || "Chức danh"}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{doctor.JobDescription || doctor.Description || "Mô tả bác sĩ..."}</p>
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
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{doctorsError || "Chưa có bác sĩ phù hợp"}</h3>
                <p className="text-gray-500">Vui lòng chọn chuyên khoa khác hoặc thử lại sau.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;