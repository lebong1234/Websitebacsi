import React from 'react';
import { Facebook, Youtube, Linkedin } from 'lucide-react';
import logo from '../assets/img/logo.png';

const Footer = () => {
  return (
    <footer style={{background: 'linear-gradient(120deg, #5b63ffff 0%, #4c7fedff 100%)', color: '#fff', fontFamily: 'Poppins, Arial, sans-serif'}} className="w-full pt-10 pb-4 shadow-inner">
      <style>{`
        .footer-link { color: #fff; transition: color 0.2s, box-shadow 0.2s; border-radius: 8px; padding: 2px 6px; }
        .footer-link:hover { color: #e0eaff !important; background: rgba(255,255,255,0.10); box-shadow: 0 2px 8px 0 #60a5fa33; text-decoration: underline; }
        .footer-social a { background: rgba(255,255,255,0.18); color: #fff; border: 1.5px solid #fff; transition: background 0.2s, color 0.2s, box-shadow 0.2s; border-radius: 50%; }
        .footer-social a:hover { background: #fff; color: #2563eb !important; box-shadow: 0 2px 8px 0 #60a5fa33; }
        .footer-input:focus { outline: none; border-color: #fff; }
        .footer-input::placeholder { color: #e0eaff; }
        .footer-hashtag { color: #fff; font-weight: 700; font-size: 1.2rem; letter-spacing: 1px; }
        .footer-logo { background: #fff; border-radius: 18px; box-shadow: 0 2px 12px 0 #60a5fa33; }
        .footer-title { color: #fff; font-weight: 700; letter-spacing: 0.5px; }
        .footer-divider { border-color: #e0eaff; }
        .footer-bottom { color: #e0eaff; }
        .footer-form { background: rgba(255,255,255,0.12); border-radius: 9999px; }
        .footer-form input { color: #fff; }
        .footer-form input::placeholder { color: #e0eaff; }
        .footer-form button { background: #fff; color: #2563eb; border-radius: 9999px; font-weight: 600; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
          .footer-logo { margin: 0 auto 12px auto; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 pb-8 border-b border-[#bae6fd]">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Hoan My" className="footer-logo h-16 mb-3 p-1" />
            <div className="text-sm leading-6 mb-2 text-[#e0eaff]">Tầng 11, Friendship Tower, 31 Lê Duẩn,<br/>Phường Bến Nghé, TP HCM</div>
            <div className="text-sm mb-2 text-[#e0eaff]">T: (028) 3820 6001</div>
          </div>
          {/* Links 1 */}
          <div>
            <div className="mb-2 font-semibold footer-title">Về Chúng Tôi</div>
            <div className="footer-link mb-1 cursor-pointer">Mạng Lưới</div>
            <div className="footer-link mb-1 cursor-pointer">Bác Sĩ</div>
            <div className="footer-link mb-1 cursor-pointer">Tuyển Dụng</div>
            <div className="footer-link mb-1 cursor-pointer">Cộng Đồng</div>
            <div className="footer-link mb-1 cursor-pointer">Hoàn Mỹ Academy</div>
          </div>
          {/* Links 2 */}
          <div>
            <div className="mb-2 font-semibold footer-title">Hội thảo & Hội nghị</div>
            <div className="footer-link mb-1 cursor-pointer">Tin Tức</div>
            <div className="footer-link mb-1 cursor-pointer">Chính Sách Quà Tặng</div>
            <div className="footer-link mb-1 cursor-pointer">Chính Sách Quyền Riêng Tư</div>
            <div className="footer-link mb-1 cursor-pointer">Liên Hệ</div>
          </div>
          {/* Hashtag & Email */}
          <div className="flex flex-col items-center md:items-end">
            <div className="footer-hashtag mb-2">#tantamchamsoc</div>
            <div className="mb-2 text-[#e0eaff]">Theo dõi bản tin của chúng tôi</div>
            <form className="footer-form flex rounded-full overflow-hidden border border-[#e0eaff] w-full max-w-xs">
              <input className="footer-input flex-1 px-4 py-2 bg-transparent" placeholder="Email của bạn" type="email" />
              <button type="submit" className="px-5 py-2">Đăng ký</button>
            </form>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 text-xs footer-bottom mt-2">
          <div className="mb-2 md:mb-0">Quản lý Cookies | Copyright 2024 © Hoan My Corporation</div>
          <div className="flex items-center gap-4">
            <span>Kết nối với chúng tôi</span>
            <div className="footer-social flex gap-2">
              <a href="#" className="p-2"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="p-2"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="p-2"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;