import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeartbeat, FaPhoneAlt, FaFirstAid } from "react-icons/fa";
import Slider from "react-slick";
import Banner1 from '../../assets/img/banner/banner.png';
import Banner2 from '../../assets/img/banner/banner2.png';
import Banner3 from '../../assets/img/banner/banner3.png';
import About1 from '../../assets/img/about/1.png';
import About2 from '../../assets/img/about/2.png';
import '../../assets/css/style.css';
import HomeIntro from '../../components/common/HomeIntro';
import Testimonials from '../../components/sections/Home/Testimonials';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false
        }
      }
    ]
  };

  const banners = [
    {
      id: 1,
      image: Banner1,
      alt: 'Banner 1',
      caption: 'Đặt Lịch Khám Bệnh Trực Tuyến',
      subCaption: 'Nhanh chóng - Tiện lợi - An toàn'
    },
    {
      id: 2,
      image: Banner2,
      alt: 'Banner 2',
      caption: 'Đội Ngũ Bác Sĩ Chuyên Môn Cao',
      subCaption: 'Tận tâm với sức khỏe của bạn'
    },
    {
      id: 3,
      image: Banner3,
      alt: 'Banner 3',
      caption: 'Cơ Sở Vật Chất Hiện Đại',
      subCaption: 'Đẳng cấp quốc tế'
    },
  ];

  const services = [
    {
      icon: <FaHeartbeat size={50} className="text-blue-800 " />,
      title: "Đặt Lịch Khám",
      description: "Đặt lịch khám bệnh trực tuyến với các bác sĩ chuyên khoa hàng đầu.",
      buttonText: "Đặt Lịch Ngay",
      bgColor: "bg-transparent",
    },
    {
      icon: <FaPhoneAlt size={50} className="text-blue-800" />,
      title: "Cấp Cứu 24/7",
      description: "Dịch vụ cấp cứu khẩn cấp 24/7, luôn sẵn sàng phục vụ bạn.",
      buttonText: "1900 1234",
      bgColor: "bg-[#b4def6]",
    },
    {
      icon: <FaFirstAid size={50} className="text-blue-800" />,
      title: "Tư Vấn Trực Tuyến",
      description: "Tư vấn sức khỏe trực tuyến với đội ngũ bác sĩ chuyên môn.",
      buttonText: "Tư Vấn Ngay",
      bgColor: "bg-transparent",
    },
  ];

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  const testimonials = [
    {
      id: 1,
      bgImage: '../../assets/img/testimonial/testimonial-bg-1.jpg',
      quote: "Dịch vụ đặt lịch khám bệnh trực tuyến rất tiện lợi. Tôi không cần phải đến bệnh viện sớm để xếp hàng nữa. Thời gian khám bệnh được sắp xếp hợp lý và chuyên nghiệp.",
      author: "Nguyễn Văn A"
    },
    {
      id: 2,
      bgImage: '../../assets/img/testimonial/testimonial-bg-2.jpg',
      quote: "Đội ngũ bác sĩ rất tận tâm và chuyên nghiệp. Quy trình khám bệnh nhanh chóng, không phải chờ đợi lâu. Tôi rất hài lòng với dịch vụ này.",
      author: "Trần Thị B"
    },
    {
      id: 3,
      bgImage: '../../assets/img/testimonial/testimonial-bg-3.jpg',
      quote: "Cơ sở vật chất hiện đại, đội ngũ nhân viên thân thiện. Việc đặt lịch khám bệnh trực tuyến giúp tôi tiết kiệm được nhiều thời gian.",
      author: "Lê Văn C"
    }
  ];

  return (
    <div className="bg-white-50">
      {/* Banner Section */}
      <div className="mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden">
          <Slider {...settings}>
            {banners.map(({ id, image, alt, caption, subCaption }) => (
              <div key={id} className="relative">
                <img
                  src={image}
                  alt={alt}
                  loading="lazy"
                  className="w-full h-auto aspect-video object-cover slick_img"
                />
                <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 transition-all duration-500">
                  <div className="text-white max-w-2xl transform transition-all duration-500 hover:scale-105">
                    <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg animate-fadeIn">
                      {caption}
                    </h2>
                    <p className="text-lg md:text-xl mb-4 drop-shadow-md animate-fadeIn delay-100">
                      {subCaption}
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 animate-fadeIn delay-200">
                      Đặt Lịch Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Services Section */}
      <div className='service-area'>
        <div className="w-full bg-transparent py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`w-full md:w-1/3 p-4 ${service.bgColor} transition-all`}
                >
                  <div className="p-3">
                    <div className="mb-2">{service.icon}</div>
                    <h3 className="text-2xl md:text-xl font-medium text-gray-800">{service.title}</h3>
                    <p className="text-base font-normal leading-7 text-gray-700 mt-2 mb-2">
                      {service.description}
                    </p>
                    <a
                      href="#"
                      className="inline-block bg-white text-black px-4 py-2 border border-black hover:bg-black hover:text-white transition"
                    >
                      {service.buttonText}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
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
      <HomeIntro />
      {/* ISO Certification Section */}
      <div className="iso-cert-area py-16 bg-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          .iso-cert-area, .iso-cert-area * {
            font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
          }
          .iso-cert-area h2 {
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .iso-cert-card .font-bold {
            font-weight: 600 !important;
            font-size: 1.08rem;
            letter-spacing: 0.1px;
          }
          .iso-cert-card .text-base {
            font-weight: 400;
            font-size: 0.98rem;
            color: #21b5b0;
          }
          .iso-cert-card {
            transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s, background 0.25s;
            border-radius: 18px;
            background: #f7fbff;
            box-shadow: 0 2px 8px 0 rgba(90,136,211,0.06);
            will-change: transform, box-shadow;
            opacity: 0;
            transform: translateY(40px) scale(0.96);
            animation: fadeInUp 0.7s cubic-bezier(.4,2,.6,1) forwards;
          }
          .iso-cert-card:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow: 0 8px 32px 0 rgba(33,134,181,0.18), 0 2px 8px 0 rgba(0,0,0,0.10);
            background: #eaf4fb;
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#5a88d3]">Chứng chỉ ISO 15189:2012 (TCVN 15189:2014)</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { name: 'Bệnh viện Hoàn Mỹ Sài Gòn', sub: 'Khoa Xét Nghiệm' },
              { name: 'Bệnh viện Hoàn Mỹ Cửu Long', sub: 'Khoa Xét Nghiệm' },
              { name: 'Bệnh viện Hoàn Mỹ Đà Nẵng', sub: 'Khoa Xét Nghiệm' },
              { name: 'Bệnh viện Hoàn Mỹ Quốc tế Đồng Nai', sub: 'Khoa Xét Nghiệm' },
              { name: 'Bệnh viện Hoàn Mỹ Quốc tế Thủ Đức', sub: 'Khoa Xét Nghiệm' },
            ].map((item, idx) => (
              <div key={idx} className="iso-cert-card flex flex-col items-center w-48 mb-8 p-5" style={{animationDelay: `${0.08 * idx + 0.1}s`}}>
                {/* SVG ISO icon */}
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="40" cy="60" rx="28" ry="12" fill="#bab4e5ff"/>
                  <ellipse cx="40" cy="50" rx="18" ry="8" fill="#5a88d3"/>
                  <path d="M40 20 L45 40 L35 40 Z" fill="#5a88d3"/>
                  <rect x="36" y="30" width="8" height="18" rx="4" fill="#5a88d3"/>
                  <text x="40" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#215ab5ff">ISO</text>
                  <text x="40" y="68" textAnchor="middle" fontSize="10" fill="#2148b5ff">15189:2012</text>
                </svg>
                <div className="mt-4 text-center">
                  <div className="font-bold text-lg text-[#2186b5] leading-tight">{item.name}</div>
                  <div className="text-[#21b5b0] text-base">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Business Section */}
      <div className="business-section bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-gray-600 mt-4">
              Chúng tôi cung cấp các dịch vụ y tế chất lượng cao với trang thiết bị hiện đại và đội ngũ chuyên môn.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Cơ Sở Vật Chất</h3>
              <p className="text-gray-700">Trang thiết bị y tế hiện đại, đạt chuẩn quốc tế.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Đội Ngũ Bác Sĩ</h3>
              <p className="text-gray-700">Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Hỗ Trợ 24/7</h3>
              <p className="text-gray-700">Dịch vụ hỗ trợ và tư vấn y tế suốt 24 giờ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
