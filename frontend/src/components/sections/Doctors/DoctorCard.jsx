import React from 'react';

const DoctorCard = ({ doctor, onClick }) => {
  if (!doctor) return null;

  // Hiển thị tên bác sĩ
  const name = doctor.name && doctor.name.trim() !== '' ? doctor.name.trim() : '';
  const isNameMissing = !name;

  const avatar = doctor.img || '/default-doctor.png';
  const degree = doctor.degree || '';
  const department = doctor.departmentName || '';
  const specialty = doctor.specialtyName || '';

  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out h-full flex flex-col cursor-pointer overflow-hidden border border-transparent hover:border-blue-300"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => { if (e.key === 'Enter') onClick(); }}
      aria-label={`Xem chi tiết bác sĩ: ${name || 'Chưa có tên'}`}
    >
      {/* Ảnh đại diện */}
      <div className="relative overflow-hidden bg-gray-100 h-60 flex items-center justify-center">
        <img
          src={avatar}
          alt={`Hình ảnh của bác sĩ ${name || 'Chưa có tên'}`}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
          onError={e => {
            e.target.onerror = null;
            e.target.src = '/default-doctor.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Thông tin bác sĩ */}
      <div className="p-5 flex-grow flex flex-col items-center text-center">
        {/* Tên bác sĩ */}
        <h3 className={`text-xl mb-2 w-full ${isNameMissing ? 'italic text-gray-400 font-normal' : 'font-bold text-gray-900'}`}>
          {isNameMissing ? 'Bác sĩ chưa cập nhật tên' : name}
        </h3>

        {/* Chuyên khoa */}
        {specialty && (
          <p className="text-blue-600 font-semibold text-sm mb-1">
            {specialty}
          </p>
        )}

        {/* Khoa */}
        {department && (
          <p className="text-gray-600 text-sm mb-3">
            {department}
          </p>
        )}

        {/* Đánh giá */}
        {(doctor.rating > 0) && (
          <div className="mt-3 text-xs text-yellow-500 flex items-center justify-center gap-1">
            <span>⭐</span>
            <span>{doctor.rating.toFixed(1)}</span>
            {doctor.reviewCount > 0 && <span>({doctor.reviewCount} đánh giá)</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
