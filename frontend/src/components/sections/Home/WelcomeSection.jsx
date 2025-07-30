import React from 'react';
import About1 from '../../../assets/img/about/1.png';
import About2 from '../../../assets/img/about/2.png';

const WelcomeSection = () => {
  return (
    <div className="welcome_docmed_area pt-[120px] pb-[220px] md:pb-[100px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 relative">
            <div className="welcome_thumb relative">
              <div className="thumb_1">
                <img src={About1} alt="" className="w-[60%] max-sm:w-full" />
              </div>
              <div className="thumb_2 hidden sm:block">
                <img src={About2} alt="" className="w-[89%] sm:w-full" />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-[90px] mt-10 md:mt-[100px] lg:mt-0">
            <div className="welcome_docmed_info">
              <h2 className="text-[18px] font-normal text-[#1F1F1F] mb-10 relative pb-[9px] z-[9] border-b-[2px] border-[#5DB2FF] w-fit">
                Chào Mừng Đến Với Chúng Tôi
              </h2>
              <h3 className="text-[36px] font-medium mb-2 max-sm:text-[30px]">
                Chăm Sóc Sức Khỏe <br className="max-sm:hidden" />
                Tốt Nhất Cho Bạn
              </h3>
              <p className="text-[16px] text-[#727272] leading-[28px]">
                Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên môn
                và trang thiết bị hiện đại. Đặt lịch khám bệnh trực tuyến giúp bạn tiết kiệm thời gian
                và được chăm sóc tốt nhất.
              </p>
              <ul className="mt-6 mb-10 list-none">
                <li className="text-[#727272] text-[16px] leading-[28px] flex items-start">
                  <i className="flaticon-right text-[#5DB2FF] mr-2"></i>
                  Đặt lịch khám bệnh trực tuyến 24/7
                </li>
                <li className="text-[#727272] text-[16px] leading-[28px] flex items-start">
                  <i className="flaticon-right text-[#5DB2FF] mr-2"></i>
                  Đội ngũ bác sĩ chuyên môn cao
                </li>
                <li className="text-[#727272] text-[16px] leading-[28px] flex items-start">
                  <i className="flaticon-right text-[#5DB2FF] mr-2"></i>
                  Cơ sở vật chất hiện đại, tiện nghi
                </li>
              </ul>
              <a href="#" className="inline-block bg-white border border-[#5DB2FF] text-[#5DB2FF] px-6 py-2 rounded hover:bg-[#5DB2FF] hover:text-white transition">
                Tìm Hiểu Thêm
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;