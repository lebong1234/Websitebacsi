import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Info, ChevronRight } from "lucide-react";
import { getBranchs, API_IMG_URL } from "../../../services/BookingService";

const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-general.png";

const InfoBranches = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Dữ liệu branch truyền từ trang list sang, nếu không có => null
    const branchData = location.state || null;

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getBranchs();
                setBranches(result);
                console.log("Fetched branches:", result);
            } catch (err) {
                console.error("Error fetching branches:", err);
                setError(err.message || "Lỗi không xác định khi tải dữ liệu.");
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

    const formatDescription = (description) => {
        if (!description) return ["Chưa có mô tả"];
        return description.split('\n').filter(line => line.trim() !== '');
    };

    const extractWorkingHours = (description) => {
        if (!description) return "Chưa cập nhật";
        const match = description.match(/Giờ làm việc:\s*([^.]*)/);
        return match ? match[1].trim() : "07:00 - 19:00 (Thứ 2 - Chủ nhật)";
    };

    if (!branchData) {
        return (
            <div className="p-4 text-center text-red-600">
                Không tìm thấy dữ liệu chi nhánh để hiển thị.
                <br />
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span>Quay lại danh sách</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative h-80">
                        <img
                            src={
                                branchData.imageUrl
                                    ? `${API_IMG_URL}${branchData.imageUrl}`
                                    : DEFAULT_PLACEHOLDER_IMAGE
                            }
                            alt={branchData.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {branchData.name}
                            </h1>
                            <div className="flex items-center space-x-2 text-white/90">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">{branchData.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Info */}
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Info className="w-6 h-6 text-blue-500 mr-2" />
                                    Thông tin chi tiết
                                </h2>
                                <div className="space-y-4">
                                    {formatDescription(branchData.description).map((paragraph, index) => (
                                        <p key={index} className="text-gray-600 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {branchData.coordinates && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Tọa độ địa lý</h4>
                                        <p className="text-sm text-gray-600">
                                            Vĩ độ: {branchData.coordinates.latitude} | Kinh độ: {branchData.coordinates.longitude}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right: Contact + Working Hours + Buttons */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
                                    <div className="space-y-4">
                                        {branchData.phoneNumber && (
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-5 h-5 text-green-500" />
                                                <a
                                                    href={`tel:${branchData.phoneNumber}`}
                                                    className="text-gray-800 font-semibold hover:text-green-600"
                                                >
                                                    {branchData.phoneNumber}
                                                </a>
                                            </div>
                                        )}
                                        {branchData.email && (
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-purple-500" />
                                                <a
                                                    href={`mailto:${branchData.email}`}
                                                    className="text-gray-800 font-semibold hover:text-purple-600"
                                                >
                                                    {branchData.email}
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                            <p className="font-semibold text-gray-800">{branchData.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <Clock className="w-5 h-5 text-blue-500 mr-2" />
                                        Giờ làm việc
                                    </h3>
                                    <p className="text-gray-700 font-medium">
                                        {extractWorkingHours(branchData.description)}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/booking', { state: { selectedBranch: branchData } })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        Đặt lịch tại chi nhánh này
                                    </button>

                                    {branchData.coordinates && (
                                        <button
                                            onClick={() => {
                                                const { latitude, longitude } = branchData.coordinates;
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
        </div>
    );
};

export default InfoBranches;
