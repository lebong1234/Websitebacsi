import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSlider = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500, // Giảm tốc độ chuyển slide xuống 500ms (nhanh hơn)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500, // Giảm thời gian hiển thị mỗi slide xuống 2.5 giây
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

  return (
    <div className="mx-auto px-4 py-8">
      <div className="relative rounded-xl overflow-hidden" style={{ maxWidth: '1600px', margin: '0 auto' , height: '110%' }}>
        <Slider {...settings}>
          {banners.map(({ id, image, alt }) => (
            <div key={id} className="relative">
              <img
                src={image}
                alt={alt}
                loading="lazy"
                className="w-full h-auto aspect-video object-cover slick_img"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Ví dụ sử dụng component với các banner cụ thể
const App = () => {
  const bannerImages = [
    {
      id: 1,
      image: "https://via.placeholder.com/1200x400?text=Banner+1",
      alt: "Banner 1"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1200x400?text=Banner+2",
      alt: "Banner 2"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1200x400?text=Banner+3",
      alt: "Banner 3"
    }
  ];

  return <BannerSlider banners={bannerImages} />;
};

export default BannerSlider;