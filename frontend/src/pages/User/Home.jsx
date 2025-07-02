import React from 'react';
import BannerSlider from '../../components/sections/Home/BannerSlider';
import ServicesSection from '../../components/sections/Home/ServicesSection';
import WelcomeSection from '../../components/sections/Home/WelcomeSection';
import Testimonials from '../../components/sections/Home/Testimonials';
import BusinessSection from '../../components/sections/Home/BusinessSection';
import Banner1 from '../../assets/img/banner/banner.png';
import Banner2 from '../../assets/img/banner/banner1.png';
import Banner3 from '../../assets/img/banner/banner2.png';
import '../../assets/css/style.css';
import { FaHeartbeat, FaPhoneAlt, FaFirstAid } from "react-icons/fa";

const Home = () => {
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
      <BannerSlider banners={banners} />
      <ServicesSection services={services} />
      <WelcomeSection />
      <Testimonials testimonials={testimonials} />
      <BusinessSection />
    </div>
  );
};

export default Home;