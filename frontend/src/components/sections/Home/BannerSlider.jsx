import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSlider = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: { arrows: false }
      }
    ]
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl" style={{ maxWidth: '1600px', margin: '0 auto', height: '110%' }}>
        <Slider {...settings}>
          {banners.map(({ id, image, alt, caption, subCaption, buttonText }) => (
            <div key={id} className="relative">
              <img
                src={image}
                alt={alt}
                loading="lazy"
                className="w-full h-auto aspect-video object-cover"
                style={{ minHeight: 350, maxHeight: 600 }}
              />
              {/* Overlay gradient dưới để chữ nổi bật */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>
              {/* Nội dung caption */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center">
                {caption && <h2 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg" style={{letterSpacing:0.5}}>{caption}</h2>}
                {subCaption && <p className="text-lg md:text-2xl mb-6 text-white/90 drop-shadow animate-fadeIn delay-100">{subCaption}</p>}
                {buttonText && <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-blue-100 transition-all duration-300">{buttonText}</button>}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;