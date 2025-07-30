import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import bradcamImg from '../assets/img/banner/bradcam.png';

const Bradcam = () => {
  const location = useLocation();

  // Tạo mapping giữa path và thông tin hiển thị
  const pageInfo = {
    '/': {
      title: 'Trang chủ',
      breadcrumb: 'Trang chủ'
    },
    '/about': {
      title: 'Giới thiệu',
      breadcrumb: 'Giới thiệu'
    },
    '/new': {
      title: 'Tin tức',
      breadcrumb: 'Tin tức'
    },
    '/doctors': {
      title: 'Bác Sĩ',
      breadcrumb: 'Bác Sĩ'
    },
    '/branches': {
      title: 'Chi nhánh',
      breadcrumb: 'Chi nhánh'
    },
    '/booking': {
      title: 'Đặt lịch khám',
      breadcrumb: 'Đặt lịch khám'
    },
    '/department': {
      title: 'Khoa phòng',
      breadcrumb: 'Khoa phòng'
    },
    '/login': {
      title: 'Đăng nhập',
      breadcrumb: 'Đăng nhập'
    }
  };

  // Lấy thông tin trang hiện tại, mặc định là trang chủ nếu không tìm thấy
  const currentPage = pageInfo[location.pathname] || pageInfo['/'];

  return (
    <div style={{background: '#fff', borderRadius: '18px', overflow: 'hidden', margin: '24px 0', boxShadow: '0 2px 16px 0 #60a5fa22'}}>
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[220px] md:min-h-[320px] relative">
        {/* Text left */}
        <div className="flex-1 px-8 py-10 md:py-0 md:pl-14 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(215, 215, 215)] mb-2" style={{letterSpacing:0.5}}>{currentPage.title}</h1>
          <p className="text-lg md:text-xl text-[rgb(59,130,246)] font-medium mb-2">
            <Link to="/" className="hover:underline">Trang Chủ</Link> <span className="mx-1">/</span> {currentPage.breadcrumb}
          </p>
        </div>
        {/* Image right */}
        <div className="flex-1 flex justify-end items-end w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>
          <img src={bradcamImg} alt="Bác sĩ" className="w-full md:w-[540px] h-[220px] md:h-[320px] object-cover object-right rounded-bl-3xl" style={{maxWidth: '700px'}} />
        </div>
      </div>
    </div>
  );
};

export default Bradcam;