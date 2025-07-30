import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Info,
  AlertTriangle,
  Loader2,
  Building2,
} from "lucide-react";
import {
  getBranchs,
  API_IMG_URL,
} from "../../services/BookingService";
import { useNavigate } from "react-router-dom";

const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-general.png";

const Branches = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const branchData = await getBranchs();
        console.log("Fetched branches data:", branchData);
        setBranches(branchData);
      } catch (err) {
        console.error("Error in initial data fetch:", err);
        setError(err.message || "Lỗi không xác định khi tải dữ liệu ban đầu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_PLACEHOLDER_IMAGE;
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    const branchIdForAPI = branch.idBranch;

    console.log("Full selectedBranch object:", JSON.stringify(branch, null, 2));
    console.log("Using branchIdForAPI for navigation:", branchIdForAPI);

    if (!branchIdForAPI) {
      setError(
        "Không thể xác định ID chi nhánh (idBranch is missing). Vui lòng chọn lại chi nhánh hoặc liên hệ hỗ trợ."
      );
      console.error("Critical error: branch.idBranch is missing!", branch);
      return;
    }

    navigate("/infobranches", {
      state: {
        id: branchIdForAPI,
        idBranch: branch.idBranch,
        name: branch.branchName || branch.name || "Chi nhánh",
        address: branch.branchAddress || branch.address || "Địa chỉ chưa cập nhật",
        phoneNumber: branch.branchHotline || branch.phoneNumber || "Chưa cập nhật",
        imageUrl: branch.imageUrl,
        description: branch.description,
        email: branch.email,
        coordinates: branch.coordinates,
      },
    });
  };


  const handleBackToBranches = () => {
    setCurrentStep(1);
    setSelectedBranch(null);
  };

  const formatDescription = (description) => {
    if (!description) return ["Chưa có mô tả"];
    return description.split('\n').filter(line => line.trim() !== '');
  };

  const extractWorkingHours = (description) => {
    if (!description) return "Chưa cập nhật";
    const match = description.match(/Giờ làm việc:\s*([^.]*)/);
    return match ? match[1].trim() : "07:00 - 19:00 (Thứ 2 - Chủ nhật)";
  };

  const renderLoading = () => (
    <div className="flex flex-col justify-center items-center h-64 text-center">
      <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
      <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
    </div>
  );

  const renderError = () => (
    error && (
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

  const getBranchKey = (branch) => {
    return branch.idBranch || branch._id || branch.id || `branch-${Math.random()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {renderError()}

        {/* Step 1: Danh sách chi nhánh */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Chọn chi nhánh</h2>
              <p className="text-gray-600 text-lg">Lựa chọn chi nhánh bạn muốn xem thông tin</p>
            </div>

            {loading && !branches.length ? renderLoading() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map(branch => (
                  <div
                    key={getBranchKey(branch)}
                    onClick={() => handleBranchSelect(branch)}
                    className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer transition-all duration-500 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={branch.imageUrl ? `${API_IMG_URL}${branch.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
                        alt={branch.branchName || "Chi nhánh"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{branch.branchName || "Tên chi nhánh"}</h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-600 leading-relaxed text-sm">{branch.branchAddress || "Địa chỉ chưa cập nhật"}</p>
                        </div>

                        {branch.phoneNumber && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-gray-600 text-sm">{<branch className="branchHotline"></branch>}</p>
                          </div>
                        )}

                        {branch.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <p className="text-gray-600 text-sm">{branch.email}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-blue-600 font-medium text-sm">Xem chi tiết</span>
                        <ChevronRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                ))}

                {branches.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Không có chi nhánh nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Chi tiết chi nhánh */}
        {currentStep === 2 && selectedBranch && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToBranches}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span>Quay lại danh sách</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-80">
                <img
                  src={selectedBranch.imageUrl ? `${API_IMG_URL}${selectedBranch.imageUrl}` : DEFAULT_PLACEHOLDER_IMAGE}
                  alt={selectedBranch.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2">{selectedBranch.name}</h1>
                  <div className="flex items-center space-x-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{selectedBranch.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <Info className="w-6 h-6 text-blue-500 mr-2" />
                      Thông tin chi tiết
                    </h2>

                    <div className="space-y-4">
                      {formatDescription(selectedBranch.description).map((paragraph, index) => (
                        <p key={index} className="text-gray-600 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Hiển thị tọa độ nếu có */}
                    {selectedBranch.coordinates && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Tọa độ địa lý</h4>
                        <p className="text-sm text-gray-600">
                          Vĩ độ: {selectedBranch.coordinates.latitude} |
                          Kinh độ: {selectedBranch.coordinates.longitude}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>

                      <div className="space-y-4">
                        {selectedBranch.phoneNumber && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600 text-sm">Điện thoại</p>
                              <a
                                href={`tel:${selectedBranch.phoneNumber}`}
                                className="font-semibold text-gray-800 hover:text-green-600 transition-colors"
                              >
                                {selectedBranch.phoneNumber}
                              </a>
                            </div>
                          </div>
                        )}

                        {selectedBranch.email && (
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600 text-sm">Email</p>
                              <a
                                href={`mailto:${selectedBranch.email}`}
                                className="font-semibold text-gray-800 hover:text-purple-600 transition-colors"
                              >
                                {selectedBranch.email}
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-600 text-sm">Địa chỉ</p>
                            <p className="font-semibold text-gray-800">{selectedBranch.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Clock className="w-5 h-5 text-blue-500 mr-2" />
                        Giờ làm việc
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-700 font-medium">
                          {extractWorkingHours(selectedBranch.description)}
                        </p>
                      </div>
                    </div>

                    {/* Thêm nút hành động */}
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/booking', { state: { selectedBranch } })}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        Đặt lịch tại chi nhánh này
                      </button>

                      {selectedBranch.coordinates && (
                        <button
                          onClick={() => {
                            const { latitude, longitude } = selectedBranch.coordinates;
                            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                            window.open(mapUrl, '_blank');
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                          Xem trên Google Maps
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Branches;