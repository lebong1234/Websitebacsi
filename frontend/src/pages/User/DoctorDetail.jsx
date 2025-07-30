import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, Stethoscope, Home, Building, CalendarCheck } from 'lucide-react'; // Thêm icon CalendarCheck
import doctorService from '../../services/doctorService';

const DoctorDetail = () => {
  // Hooks từ react-router-dom để lấy thông tin từ URL và điều hướng
  const { id: paramId } = useParams(); // Lấy id từ URL, đổi tên thành paramId để tránh xung đột
  const navigate = useNavigate();
  const location = useLocation();

  // --- BƯỚC 1: Nhận dữ liệu được truyền từ trang trước qua location.state ---
  // Dữ liệu này được truyền từ hàm handleBooking của bạn
  const { doctorID, doctorName, doctorDegree, selectedInfo } = location.state || {};

  // Xác định ID chính xác để fetch dữ liệu, ưu tiên ID từ state
  const effectiveId = doctorID || paramId;

  // Hàm khởi tạo state ban đầu cho bác sĩ
  // Ưu tiên hiển thị thông tin nhanh từ state nếu có, giúp cải thiện trải nghiệm người dùng
  const getInitialDoctor = () => {
    if (doctorID) {
      return {
        id: doctorID,
        name: doctorName,
        doctorDegree: doctorDegree,
        // Các thông tin khác có thể chưa có, sẽ được load sau
      };
    }
    return null;
  };

  const [doctor, setDoctor] = useState(getInitialDoctor());
  const [loading, setLoading] = useState(!doctor); // Chỉ loading nếu không có dữ liệu ban đầu
  const [error, setError] = useState(null);

  // --- BƯỚC 2: Fetch dữ liệu đầy đủ của bác sĩ từ server ---
  useEffect(() => {
    const fetchDoctor = async () => {
      // Nếu không có ID thì không làm gì cả
      if (!effectiveId) {
        setError("Không tìm thấy ID của bác sĩ.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Gọi service để lấy thông tin chi tiết đầy đủ
        const data = await doctorService.getDoctorFullInfo(effectiveId);
        // Cập nhật state với dữ liệu đầy đủ từ API
        setDoctor(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Không thể tải thông tin bác sĩ.');
      }
      setLoading(false);
    };

    fetchDoctor();
  }, [effectiveId]); // Effect sẽ chạy lại nếu effectiveId thay đổi

  // Hàm xử lý khi người dùng nhấn nút đặt lịch
  const handleProceedToBooking = () => {
    // Chuyển đến trang tiếp theo của quy trình đặt lịch (ví dụ: trang xác nhận hoặc điền thông tin bệnh nhân)
    // Truyền theo cả thông tin bác sĩ và thông tin lịch đã chọn (selectedInfo)
    // console.log("Chuyển đến trang đặt lịch với state:", { doctor, selectedInfo });
    // navigate(`/showdr/${doctor.id || doctor._id}`, { 
    //   state: { 
    //     doctor,       // Truyền đối tượng doctor đầy đủ
    //     selectedInfo  // Truyền thông tin lịch hẹn đã chọn
    //   } 
    // });
    // Chuyển hướng sang trang /showdr và truyền thông tin bác sĩ qua state
    alert(`Chuyển đến trang đặt lịch với Bác sĩ ${doctor.name}`);
    navigate('/drdetail', {
      state: {
        doctorID: doctor.id || doctor._id,
        doctorName: doctor.name,
        doctorDegree: doctor.doctorDegree,
        branchName: doctor.branchName,
        departmentName: doctor.departmentName,
        specialtyName: doctor.specialtyName,
        doctorAvatar: doctor.img,
        selectedInfo,
      },
    });
  };

  if (loading) return <div className="text-center py-20 text-gray-600 text-xl">Đang tải thông tin bác sĩ...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;
  if (!doctor) return <div className="text-center py-20 text-gray-600 text-xl">Không tìm thấy bác sĩ</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          aria-label="Trở lại trang trước"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Trở lại
        </button>

        {/* --- BƯỚC 3: Hiển thị thông tin lịch khám đã chọn (selectedInfo) --- */}
        {selectedInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-8 shadow" role="alert">
            <div className="flex items-center">
              <CalendarCheck className="h-6 w-6 mr-3" />
              <h3 className="font-bold text-lg">Thông tin lịch khám đã chọn</h3>
            </div>
            {/* Giả sử selectedInfo có các trường này, bạn có thể thay đổi cho phù hợp */}
            <div className="mt-2 pl-9">
              {selectedInfo.date && <p><strong>Ngày khám:</strong> {selectedInfo.date}</p>}
              {selectedInfo.timeSlot && <p><strong>Giờ khám:</strong> {selectedInfo.timeSlot}</p>}
              {/* Bạn có thể hiển thị thêm các thông tin khác từ selectedInfo ở đây */}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Cột trái: Thông tin chính */}
            <div className="md:w-1/3 flex flex-col items-center text-center flex-shrink-0">
              <img
                src={doctor.img && doctor.img !== '' ? doctor.img : '/default-doctor.png'}
                alt={doctor.name ? `Bác sĩ ${doctor.name}` : 'Bác sĩ'}
                className="rounded-full w-48 h-48 object-cover shadow-lg border-4 border-white bg-white"
                onError={e => { e.target.onerror = null; e.target.src = '/default-doctor.png'; }}
              />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {doctor.name || <span className="italic text-gray-400">Chưa cập nhật tên</span>}
              </h1>
              {/* Hiển thị học vị/học hàm */}
              <p className="text-lg text-blue-600 font-semibold">{doctor.doctorDegree}</p>

              <div className="mt-4 space-y-2 text-left w-full text-gray-700">
                <div className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="font-semibold">{doctor.specialtyName || 'Chưa có chuyên khoa'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span>{doctor.departmentName || 'Chưa có khoa'}</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span>{doctor.branchName || 'Chưa có chi nhánh'}</span>
                </div>
              </div>

              {/* --- BƯỚC 4: Cập nhật nút đặt lịch --- */}
              <button
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 w-full"
                onClick={handleProceedToBooking}
              >
                {selectedInfo ? 'Tiếp tục đặt lịch' : 'Đặt lịch khám'}
              </button>
            </div>

            {/* Cột phải: Thông tin chi tiết */}
            <div className="md:w-2/3 space-y-8 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-12">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                  Giới thiệu
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                  {doctor.description || <span className="italic text-gray-400">Chưa cập nhật mô tả</span>}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                  Thông tin cá nhân & Liên hệ
                </h2>
                <div className="space-y-3">
                  {doctor.gender && (
                    <p><span className="font-semibold text-gray-600 w-24 inline-block">Giới tính:</span> {doctor.gender === 'Male' ? 'Nam' : doctor.gender === 'Female' ? 'Nữ' : 'Khác'}</p>
                  )}
                  {doctor.dateOfBirth && (
                    <p><span className="font-semibold text-gray-600 w-24 inline-block">Ngày sinh:</span> {new Date(doctor.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-green-500" />
                      <p><span className="font-semibold text-gray-600 mr-2">Điện thoại:</span> {doctor.phone}</p>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-red-500" />
                      <p><span className="font-semibold text-gray-600 mr-2">Email:</span> {doctor.email}</p>
                    </div>
                  )}
                  {doctor.rating > 0 && (
                    <p>
                      <span className="font-semibold text-gray-600 w-24 inline-block">Đánh giá:</span>
                      <span className="ml-2 text-yellow-500">⭐ {doctor.rating.toFixed(1)}</span>
                      {doctor.reviewCount > 0 && (
                        <span className="ml-2 text-gray-500">({doctor.reviewCount} lượt)</span>
                      )}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;