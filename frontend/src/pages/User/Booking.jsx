import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  Building2,
  Stethoscope,
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  getBranchs,
  getDepartment,
  getSpecialtiesByDepartment,
  API_IMG_URL,
} from "../../services/BookingService"; // Giả sử API_IMG_URL được export từ đây
import { useNavigate } from "react-router-dom";

const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-general.png"; // Đảm bảo file này có trong public/images/

const BranchDepartmentSelection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const [branches, setBranches] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const branchData = await getBranchs();
        console.log("Fetched branches data:", branchData); // Log dữ liệu chi nhánh
        setBranches(branchData);
        const departmentRawData = await getDepartment();
        setDepartmentsData(departmentRawData);
      } catch (err) {
        console.error("Error in initial data fetch:", err);
        setError(err.message || "Lỗi không xác định khi tải dữ liệu ban đầu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (selectedDepartment?.idDepartment) {
        setLoading(true);
        setError(null);
        try {
          const data = await getSpecialtiesByDepartment(
            selectedDepartment.idDepartment
          );
          setSpecialties(data);
        } catch (err) {
          console.error("Error fetching specialties:", err);
          setError(
            err.message ||
            `Lỗi khi tải chuyên khoa cho khoa ${selectedDepartment.nameDepartment}.`
          );
          setSpecialties([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSpecialties([]);
      }
    };

    fetchSpecialties();
  }, [selectedDepartment]);

  const handleImageError = (e) => {
    e.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh placeholder cũng lỗi
    e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
  };

  const handleBranchSelect = (branch) => {
    console.log("Selected branch object in handleBranchSelect:", JSON.stringify(branch, null, 2));
    // Đảm bảo rằng selectedBranch luôn có cấu trúc nhất quán
    // và idBranch là ID chính
    setSelectedBranch(branch);
    setCurrentStep(2);
    setError(null);
  };

  const handleDepartmentSelect = (department) => {
    console.log("Selected department object:", department);
    setSelectedDepartment(department);
    setCurrentStep(3);
    setError(null);
  };

  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);

    if (selectedBranch && selectedDepartment && specialty) {
      // ƯU TIÊN SỬ DỤNG idBranch từ object branch đã chọn.
      // Đây là ID gốc từ cơ sở dữ liệu.
      const branchIdForAPI = selectedBranch.idBranch;

      console.log("Full selectedBranch object:", JSON.stringify(selectedBranch, null, 2));
      console.log("Using branchIdForAPI for navigation:", branchIdForAPI);
      console.log("Selected departmentId:", selectedDepartment?.idDepartment);
      console.log("Selected specialtyId:", specialty?.idSpecialty);

      if (!branchIdForAPI) {
        setError(
          "Không thể xác định ID chi nhánh (idBranch is missing). Vui lòng chọn lại chi nhánh hoặc liên hệ hỗ trợ."
        );
        console.error("Critical error: selectedBranch.idBranch is missing!", selectedBranch);
        return;
      }
      if (!selectedDepartment?.idDepartment) {
        setError("Không thể xác định ID khoa. Vui lòng thử lại.");
        return;
      }
      if (!specialty?.idSpecialty) {
        setError("Không thể xác định ID chuyên khoa. Vui lòng thử lại.");
        return;
      }

      navigate("/showdr", {
        state: {
          // Truyền các thông tin cần thiết và nhất quán
          branch: {
            id: branchIdForAPI, // ID chính để backend sử dụng
            idBranch: selectedBranch.idBranch, // Có thể truyền thêm để tham khảo
            branchName: selectedBranch.branchName,
            BranchAddress: selectedBranch.BranchAddress,
            // ...các thuộc tính khác của branch nếu cần hiển thị ở trang sau
          },
          department: {
            idDepartment: selectedDepartment.idDepartment,
            nameDepartment: selectedDepartment.nameDepartment,
            // ...
          },
          specialty: {
            idSpecialty: specialty.idSpecialty,
            nameSpecialty: specialty.nameSpecialty,
            // ...
          },
        },
      });
    } else {
      setError(
        "Vui lòng chọn đầy đủ thông tin chi nhánh, khoa và chuyên khoa."
      );
    }
  };

  const goBack = () => {
    setError(null);
    if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedBranch(null); // Reset để chọn lại từ đầu
      setSelectedDepartment(null);
      setSpecialties([]);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      // Không reset selectedBranch ở đây
      setSelectedDepartment(null); // Chỉ reset department và specialty
      setSpecialties([]);
    }
  };

  const renderLoading = () => (
    <div className="flex flex-col justify-center items-center h-64 text-center">
      <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
      <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
    </div>
  );

  const renderError = () => (
    error && ( // Chỉ render nếu có lỗi
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6 shadow-md">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <p className="text-md font-semibold text-red-700">Có lỗi xảy ra</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  );

  // Key cho map: Sử dụng idBranch nếu có, nếu không thì _id hoặc id.
  // Điều này quan trọng để React nhận diện đúng phần tử khi re-render.
  const getBranchKey = (branch) => {
    return branch.idBranch || branch._id || branch.id || `branch-${Math.random()}`; // Fallback cuối cùng
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Đặt lịch khám bệnh
                </h1>
                <p className="text-gray-600 mt-2">Chọn chi nhánh, khoa và chuyên khoa phù hợp</p>
              </div>
              <div className="hidden md:block">
                <User className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6">
              {[
                { step: 1, label: "Chi nhánh", icon: MapPin },
                { step: 2, label: "Khoa", icon: Building2 },
                { step: 3, label: "Chuyên khoa", icon: Stethoscope },
              ].map((item, index, arr) => (
                <React.Fragment key={`step-item-${item.step}`}>
                  <div
                    className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentStep >= item.step ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-500'
                      }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </div>
                  {index < arr.length - 1 && (
                    <div
                      key={`divider-${item.step}`}
                      className={`w-6 h-0.5 sm:w-8 ${currentStep > item.step ? 'bg-blue-500' : 'bg-gray-300'} transition-colors duration-300`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {currentStep > 1 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={goBack}
                  className="flex items-center px-6 py-3 text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-blue-600 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                  Quay lại bước trước
                </button>
              </div>
            )}
          </div>
        </div>

        {renderError()}




        {/* Step 1: Chi nhánh */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Chọn chi nhánh</h2>
              <p className="text-gray-600 text-lg">Lựa chọn chi nhánh bạn muốn đặt khám</p>
            </div>
            {loading && !branches.length ? renderLoading() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map(branch => (
                  <div
                    key={branch.idBranch} // Sử dụng idBranch (camelCase)
                    onClick={() => handleBranchSelect(branch)}
                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer transition-all duration-500 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={branch.imageUrl ? `${API_IMG_URL}${branch.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
                        alt={branch.branchName || "Chi nhánh"} // Sửa thành camelCase
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{branch.branchName || "Tên chi nhánh"}</h3> {/* Sửa thành camelCase */}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-600 leading-relaxed">{branch.branchAddress || "Địa chỉ chưa cập nhật"}</p> {/* Sửa thành camelCase */}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ChevronRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
                {branches.length === 0 && !loading && <p className="col-span-full text-center text-gray-500">Không có chi nhánh nào.</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Khoa */}
        {currentStep === 2 && selectedBranch && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn khoa khám</h2>
              <p className="text-gray-600">
                Tại chi nhánh: <span className="text-blue-600 font-semibold">{selectedBranch?.branchName}</span>
              </p>
            </div>
            {loading && !departmentsData.length ? renderLoading() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentsData.map(dept => (
                  <div
                    key={dept.idDepartment} // Giả sử idDepartment là duy nhất
                    onClick={() => handleDepartmentSelect(dept)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 border border-gray-200 flex flex-col items-center text-center"
                  >
                    <img
                      src={dept.imageUrl ? `${API_IMG_URL}${dept.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
                      alt={dept.departmentName || "Khoa"}
                      className="w-16 h-16 object-cover mb-4 rounded-lg"
                      onError={handleImageError}
                    />
                    <h3 className="text-md font-semibold text-gray-800 mb-1">
                      {dept.departmentName || "Tên khoa"}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {dept.description || 'Mô tả khoa'}
                    </p>
                  </div>
                ))}
                {departmentsData.length === 0 && !loading && <p className="col-span-full text-center text-gray-500">Không có khoa nào cho chi nhánh này.</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Chuyên khoa */}
        {currentStep === 3 && selectedDepartment && selectedBranch && ( // Thêm selectedBranch check
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn chuyên khoa</h2>
              <div className="bg-blue-50 rounded-lg p-3 inline-block shadow">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold text-blue-600">{selectedBranch?.branchName}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="font-semibold text-blue-600">{selectedDepartment?.departmentName}</span>
                </p>
              </div>
            </div>
            {loading && !specialties.length ? renderLoading() : (
              specialties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {specialties.map(spe => (
                    <div
                      key={spe.idSpecialty} // Giả sử idSpecialty là duy nhất
                      onClick={() => handleSpecialtySelect(spe)}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200"
                    >
                      <div className="relative h-20">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <h3 className="absolute bottom-3 left-3 right-3 text-lg font-semibold text-black mb-1 line-clamp-2">
                          {spe.specialtyName || "Tên chuyên khoa"}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{spe.description || "Mô tả chuyên khoa..."}</p>
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchDepartmentSelection;