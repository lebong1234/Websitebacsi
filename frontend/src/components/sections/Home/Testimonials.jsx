import React, { useState, useRef, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import img1 from '../../../assets/img/offers/1.png';
import img2 from '../../../assets/img/offers/2.png';
import img3 from '../../../assets/img/offers/3.png';

// Dữ liệu tĩnh cho giải thưởng
const awardsData = [
    { id: 1, image: 'https://i.imgur.com/A4F0qJj.png', alt: 'Trophy Award' },
    { id: 2, image: 'https://i.imgur.com/j1v2JzV.png', alt: 'CAP Accredited Logo' },
    { id: 3, image: 'https://i.imgur.com/uR1j0j1.png', alt: 'JCI Seals Logo' },
    { id: 4, image: 'https://i.imgur.com/A4F0qJj.png', alt: 'Trophy Award 2' },
];

// Dữ liệu cho slider đối tác
const partnersData = [
    { id: 1, image: 'https://i.imgur.com/1G8yC2g.png', alt: 'Osaka Metropolitan University' },
    { id: 2, image: 'https://i.imgur.com/FwWk8c5.png', alt: 'The University of Sydney' },
    { id: 3, image: 'https://i.imgur.com/J8Yc94w.png', alt: 'Macquarie University' },
    { id: 4, image: 'https://i.imgur.com/1G8yC2g.png', alt: 'Osaka Metropolitan University 2' },
];

// Logo truyền thông dùng link trực tiếp
const offers = [
  { src: img1, alt: "Thanh Niên" },
  { src: img2, alt: "Tuổi Trẻ" },
  { src: img3, alt: "Dân Trí" }
];

const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-3 shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </button>
);

const NextArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-3 shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>
);

const Testimonials = () => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    let sliderRef1 = useRef(null);
    let sliderRef2 = useRef(null);

    useEffect(() => {
        setNav1(sliderRef1.current);
        setNav2(sliderRef2.current);
    }, []);

    // Cài đặt cho slider bệnh viện
    const mainSliderSettings = {
        asNavFor: nav2, ref: sliderRef1, arrows: true, fade: true,
        prevArrow: <PrevArrow />, nextArrow: <NextArrow />, autoplay: true,
        autoplaySpeed: 4000, pauseOnHover: true,
    };

    // Cài đặt cho slider thumbnail
    const thumbSliderSettings = {
        asNavFor: nav1, ref: sliderRef2, slidesToShow: 3, swipeToSlide: true,
        focusOnSelect: true, centerMode: true, arrows: false,
    };

    // Cài đặt mới cho slider chứng nhận
    const awardsSliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    // Cài đặt mới cho slider đối tác (hiển thị 3 item, chuyển từng cái)
    const partnersSliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className="font-sans">
            {/* Phần 1: Chứng nhận và giải thưởng - ĐÃ CHUYỂN THÀNH SLIDER */}
            <section
                className="bg-[#007bce] text-white py-16 relative overflow-hidden"
                style={{ backgroundImage: `url('https://www.vinmec.com/assets/images/bg_blue_home.jpg')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center right', backgroundSize: 'contain' }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left ml-8">
                            <h2 className="text-4xl text-white font-bold">Được tin tưởng hợp tác và đồng hành</h2>
                            <div className="w-20 h-1 bg-white my-4 mx-auto lg:mx-0"></div>
                            <a href="#" className="font-semibold hover:underline text-lg">Xem thêm →</a>
                        </div>
                        <div className="px-8">
                            <Slider {...awardsSliderSettings}>
                                {awardsData.map(award => (
                                    <div key={award.id} className="px-2">
                                        <div className="bg-white p-4 rounded-lg flex items-center justify-center h-28 w-full shadow-lg">
                                            <img src={award.image} alt={award.alt} className="max-h-20 object-contain" />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần 2: Danh sách Cơ Sở Y Tế tiêu biểu với video và logo, chia 2 cột */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Bên trái: Video + logo bệnh viện */}
                        <div className="flex-1 w-full">
                            <div className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col items-center">
                                <div className="w-full aspect-video mb-4">
                                    <iframe
                                        className="w-full h-full rounded-lg"
                                        src="https://www.youtube.com/embed/zfmhCJgWx8Y?start=55"
                                        title="Danh sách Cơ Sở Y Tế tiêu biểu"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        {/* Bên phải: Logo truyền thông */}
                        <div className="flex-1 w-full flex flex-col items-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#007bce] text-center mb-2">
                                TRUYỀN THÔNG NÓI GÌ VỀ MEDPRO
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Lợi ích của Ứng dụng đặt khám nhanh Medpro đã được ghi nhận rộng rãi
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {offers.map((offer, index) => (
                                    <img
                                        key={index}
                                        src={offer.src}
                                        alt={offer.alt}
                                        className="h-10"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần 3: Đối tác - HIỂN THỊ 3 ITEM VÀ CHUYỂN TỪNG CÁI */}
            <section className="bg-white py-16 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Đối tác của chúng tôi</h2>
                    <div className="w-20 h-1 bg-teal-400 my-4 mx-auto"></div>
                    <div className="mt-12 px-8">
                        <Slider {...partnersSliderSettings}>
                            {partnersData.map(partner => (
                                <div key={partner.id} className="px-4">
                                    <div className="h-20 flex items-center justify-center">
                                        <img src={partner.image} alt={partner.alt} className="max-h-16 object-contain" />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Testimonials;