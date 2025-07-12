import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Mail, Stethoscope, Home, Building, Calendar, Award } from 'lucide-react';
import doctorService from '../../services/doctorService';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setError('ID bác sĩ không hợp lệ!');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await doctorService.getDoctorFullInfo(id);
        setDoctor(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Không thể tải thông tin bác sĩ.');
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);
  
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

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Cột trái: Ảnh và thông tin cơ bản */}
            <div className="md:w-1/3 flex flex-col items-center text-center flex-shrink-0">
              <img
                src={doctor.img && doctor.img !== '' ? doctor.img : '/default-doctor.png'}
                alt={doctor.name && doctor.name !== '' ? `Bác sĩ ${doctor.name}` : 'Bác sĩ'}
                className="rounded-full w-48 h-48 object-cover shadow-lg border-4 border-white bg-white"
                onError={e => { e.target.onerror = null; e.target.src = '/default-doctor.png'; }}
              />
              <h1 className="mt-4 text-3xl font-bold text-gray-900 text-center w-full">{doctor.name && doctor.name !== '' ? doctor.name : <span className="italic text-gray-400">Bác sĩ chưa cập nhật tên</span>}</h1>
              <div className="mt-2 space-y-1 text-sm text-gray-500 text-center">
                {doctor.gender && <div>Giới tính: {doctor.gender === 'Male' ? 'Nam' : doctor.gender === 'Female' ? 'Nữ' : 'Khác'}</div>}
                {doctor.dateOfBirth && <div>Ngày sinh: {new Date(doctor.dateOfBirth).toLocaleDateString('vi-VN')}</div>}
                {doctor.cccd && <div>CCCD: {doctor.cccd}</div>}
                {(doctor.rating > 0) && <div>Đánh giá: ⭐ {doctor.rating} {doctor.reviewCount > 0 && `(${doctor.reviewCount} đánh giá)`}</div>}
              </div>
              <div className="mt-4 space-y-2 text-left w-full">
                <div className="flex items-center text-gray-700">
                    <Stethoscope className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-semibold">{doctor.specialtyName}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Building className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span>{doctor.departmentName}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Home className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span>{doctor.branchName}</span>
                </div>
              </div>
              
              <button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
                onClick={() => navigate(`/showdr/${doctor.id || doctor._id}`)}
              >
                Đặt lịch khám
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
                  Thông tin liên hệ
                </h2>
                <div className="space-y-3">
                    {doctor.phone && (
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-5 h-5 mr-3 text-green-500" />
                            <span>{doctor.phone}</span>
                        </div>
                    )}
                    {doctor.email && (
                        <div className="flex items-center text-gray-700">
                            <Mail className="w-5 h-5 mr-3 text-red-500" />
                            <span>{doctor.email}</span>
                        </div>
                    )}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.gender && (
                    <div>
                      <span className="text-gray-500">Giới tính:</span>
                      <span className="ml-2">
                        {doctor.gender === 'Male' ? 'Nam' : doctor.gender === 'Female' ? 'Nữ' : 'Khác'}
                      </span>
                    </div>
                  )}
                  {doctor.dateOfBirth && (
                    <div>
                      <span className="text-gray-500">Ngày sinh:</span>
                      <span className="ml-2">
                        {new Date(doctor.dateOfBirth).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                  {doctor.cccd && (
                    <div>
                      <span className="text-gray-500">CCCD:</span>
                      <span className="ml-2">{doctor.cccd}</span>
                    </div>
                  )}
                  {doctor.rating > 0 && (
                    <div>
                      <span className="text-gray-500">Đánh giá:</span>
                      <span className="ml-2 text-yellow-500">⭐ {doctor.rating.toFixed(1)}</span>
                      {doctor.reviewCount > 0 && (
                        <span className="ml-2 text-gray-500">({doctor.reviewCount} đánh giá)</span>
                      )}
                    </div>
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