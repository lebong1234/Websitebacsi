import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      title: 'Tin tức sức khỏe',
      breadcrumb: 'Tin tức sức khỏe'
    },
    '/doctors': {
      title: 'Bác sĩ',
      breadcrumb: 'Bác sĩ'
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
    <div className="bradcam_area breadcam_bg bradcam_overlay">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="bradcam_text">
              <h3>{currentPage.title}</h3>
              <p>
                <Link to="/">Trang chủ /</Link> {currentPage.breadcrumb}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bradcam;