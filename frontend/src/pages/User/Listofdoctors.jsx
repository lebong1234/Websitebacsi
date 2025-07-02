import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';
import { ChevronLeft, User, Calendar, Briefcase, Search, Filter, AlertTriangle, Loader2, MapPin, Clock, Star, Phone } from 'lucide-react';
import { searchDoctorsByCriteria, API_IMG_URL } from '../../services/BookingService'; // Chú ý API_IMG_URL

const DEFAULT_DOCTOR_AVATAR = "/images/default-avatar.png";

const DoctorListPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const routerNavigate = useRouterNavigate();

    const passedState = location.state || {};
    const selectedBranch = passedState.branch; // { id, name }
    const selectedDepartment = passedState.department; // { idDepartment, nameDepartment }
    const selectedSpecialty = passedState.specialty; // { idSpecialty, nameSpecialty }

    const selectedInfo = {
        branch: selectedBranch?.name || 'Chưa rõ',
        department: selectedDepartment?.nameDepartment || 'Chưa rõ',
        specialty: selectedSpecialty?.nameSpecialty || 'Chưa rõ'
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        try {
            const birthDate = new Date(dateOfBirth);
            if (isNaN(birthDate.getTime())) return 'N/A';
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 0 ? age : 'N/A';
        } catch (e) {
            return 'N/A';
        }
    };

    const getDegreeColor = (degree) => {
        if (!degree) return 'bg-gray-100 text-gray-800';
        const d = String(degree).toLowerCase();
        if (d.includes('giáo sư') || d.includes('gs') || d.includes('pgs')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (d.includes('tiến sĩ') || d.includes('ts')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (d.includes('thạc sĩ') || d.includes('ths')) return 'bg-green-100 text-green-700 border-green-200';
        if (d.includes('ckii') || d.includes('chuyên khoa 2')) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (d.includes('cki') || d.includes('chuyên khoa 1')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        if (d.includes('bác sĩ') || d.includes('bs')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    useEffect(() => {
        async function fetchDoctors() {
            setLoading(true);
            setError(null);

            if (!selectedBranch?.id || !selectedDepartment?.idDepartment || !selectedSpecialty?.idSpecialty) {
                setError('Thiếu thông tin chi nhánh, khoa hoặc chuyên khoa. Vui lòng quay lại và chọn lại.');
                setLoading(false);
                setDoctors([]);
                setFilteredDoctors([]);
                return;
            }

            try {
                const criteria = {
                    branchId: selectedBranch.id,
                    departmentId: selectedDepartment.idDepartment,
                    specialtyId: selectedSpecialty.idSpecialty
                };
                console.log("Fetching doctors with criteria:", criteria);
                const data = await searchDoctorsByCriteria(criteria);
                setDoctors(data || []); // Đảm bảo data không phải là null/undefined
                setFilteredDoctors(data || []);
            } catch (err) {
                console.error("Error fetching doctors list:", err);
                setError(err.message || 'Lỗi khi tải danh sách bác sĩ.');
                setDoctors([]);
                setFilteredDoctors([]);
            } finally {
                setLoading(false);
            }
        }

        fetchDoctors();
    }, [selectedBranch, selectedDepartment, selectedSpecialty]); // Dependency array

    useEffect(() => {
        let filtered = [...doctors];

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (doctor) =>
                    (doctor.name && String(doctor.name).toLowerCase().includes(lowerSearchTerm)) ||
                    (doctor.jobDescription && String(doctor.jobDescription).toLowerCase().includes(lowerSearchTerm)) ||
                    (doctor.doctorDegree && String(doctor.doctorDegree).toLowerCase().includes(lowerSearchTerm))
            );
        }

        if (selectedDegree !== 'all') {
            const lowerSelectedDegree = selectedDegree.toLowerCase();
            filtered = filtered.filter(
                (doctor) =>
                    doctor.doctorDegree &&
                    String(doctor.doctorDegree).toLowerCase().includes(lowerSelectedDegree)
            );
        }
        setFilteredDoctors(filtered);
    }, [searchTerm, selectedDegree, doctors]);

    const handleBooking = (doctor) => {
        // routerNavigate(`/dat-lich/${doctor.id}`, { state: { doctor, selectedInfo } });
        alert(`Chuyển đến trang đặt lịch với Bác sĩ ${doctor.name}`);
        routerNavigate('/drdetail', {
            state: {
                doctorID: doctor.id,
                doctorName: doctor.name,
                doctorDegree: doctor.doctorDegree,
                selectedInfo
            }
        })
    };

    const goBack = () => {
        routerNavigate(-1); // Quay lại trang trước đó (BranchDepartmentSelection)
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = DEFAULT_DOCTOR_AVATAR;
    };

    if (!selectedBranch?.id || !selectedDepartment?.idDepartment || !selectedSpecialty?.idSpecialty && !loading) {
        // Trường hợp state không được truyền đúng cách và không đang loading
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-semibold text-red-700 mb-3">Lỗi thông tin đầu vào</h2>
                <p className="text-gray-600 mb-6">
                    Không nhận được đủ thông tin về chi nhánh, khoa hoặc chuyên khoa.
                </p>
                <button
                    onClick={goBack}
                    className="flex items-center px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 font-medium"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Quay lại trang lựa chọn
                </button>
            </div>
        );
    }

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-gray-600">Đang tải danh sách bác sĩ...</p>
        </div>
    );

    const renderError = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Thử lại
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content - starts below fixed header */}
            <div className="pt-24 pb-8 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={goBack}
                                    className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors duration-200"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" />
                                    Quay lại
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-purple-600">Danh sách Bác sĩ</h1>
                                    <p className="text-gray-600 mt-1">Chọn bác sĩ phù hợp để đặt lịch khám</p>
                                </div>
                            </div>
                        </div>

                        {/* Selected Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đã chọn:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-700 font-medium">{selectedInfo.branch}</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="text-gray-700 font-medium">{selectedInfo.department}</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    <span className="text-gray-700 font-medium">{selectedInfo.specialty}</span>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Tìm bác sĩ theo tên, bằng cấp, chuyên môn..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                    />
                                </div>
                                <div className="relative min-w-[200px]">
                                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={selectedDegree}
                                        onChange={(e) => setSelectedDegree(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white appearance-none"
                                    >
                                        <option value="all">Tất cả bằng cấp</option>
                                        <option value="giáo sư">Giáo sư (GS, PGS)</option>
                                        <option value="tiến sĩ">Tiến sĩ (TS)</option>
                                        <option value="thạc sĩ">Thạc sĩ (ThS)</option>
                                        <option value="ckii">Chuyên khoa II (CKII)</option>
                                        <option value="cki">Chuyên khoa I (CKI)</option>
                                        <option value="bác sĩ">Bác sĩ (BS)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor List */}
                    {loading ? renderLoading() :
                        error ? renderError() :
                            filteredDoctors.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredDoctors.map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                            onClick={() => handleBooking(doctor)}
                                        >
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Doctor Avatar */}
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            src={doctor.doctorImage ? `${API_IMG_URL}${doctor.doctorImage}` : DEFAULT_DOCTOR_AVATAR}
                                                            alt={doctor.name || "Bác sĩ"}
                                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                                            onError={handleImageError}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                                    </div>
                                                </div>

                                                {/* Doctor Info */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h2 className="text-xl font-bold text-gray-900">{doctor.name || "Chưa có tên"}</h2>
                                                                {doctor.doctorDegree && (
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDegreeColor(doctor.doctorDegree)}`}>
                                                                        {doctor.doctorDegree}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="flex items-center">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`w-4 h-4 ${star <= Math.floor(doctor.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-gray-600">
                                                                    {doctor.rating || '4.5'} ({doctor.reviewCount || '0'} đánh giá)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 group-hover:bg-blue-700">
                                                            Đặt lịch khám
                                                        </button>
                                                    </div>

                                                    <p className="text-gray-700 leading-relaxed">{doctor.jobDescription || "Chưa có mô tả công việc"}</p>

                                                    {/* Doctor Details */}
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                                                        <div className="flex items-center space-x-2 text-gray-600">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            <span className="text-sm">{calculateAge(doctor.dateOfBirth)} tuổi</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-600">
                                                            <User className="w-4 h-4 text-purple-500" />
                                                            <span className="text-sm">{doctor.gender || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-600">
                                                            <MapPin className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm truncate" title={doctor.workingAtBranch}>
                                                                {doctor.workingAtBranch || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-600">
                                                            <Phone className="w-4 h-4 text-orange-500" />
                                                            <span className="text-sm">{doctor.phone || "Chưa cập nhật"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy bác sĩ</h3>
                                    <p className="text-gray-500">Không có bác sĩ nào phù hợp với tiêu chí bạn chọn. Vui lòng thử lại.</p>
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
};

export default DoctorListPage;