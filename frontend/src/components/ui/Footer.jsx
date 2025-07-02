import React from 'react';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const SimplifiedFooter = () => {
  return (
    <footer
      className="bg-slate-900 text-white w-full"
      style={{ minHeight: '45vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="container mx-auto px-6 py-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">

          {/* 1. Brand & Social */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Docmed</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Cung cấp dịch vụ y tế chất lượng cao với đội ngũ chuyên gia tận tâm.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-sky-500 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-pink-600 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-red-600 p-2 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Liên Kết</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-blue-400">Trang Chủ</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-blue-400">Về Chúng Tôi</a></li>
              <li><a href="/doctors" className="text-gray-300 hover:text-blue-400">Bác Sĩ</a></li>
              <li><a href="/appointments" className="text-gray-300 hover:text-blue-400">Đặt Lịch</a></li>
            </ul>
          </div>

          {/* 3. Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Dịch Vụ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/services/consultation" className="text-gray-300 hover:text-green-400">Tư Vấn Online</a></li>
              <li><a href="/services/emergency" className="text-gray-300 hover:text-green-400">Cấp Cứu 24/7</a></li>
              <li><a href="/services/checkup" className="text-gray-300 hover:text-green-400">Khám Sức Khỏe</a></li>
              <li><a href="/services/lab" className="text-gray-300 hover:text-green-400">Xét Nghiệm</a></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-red-400">Liên Hệ</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-1 flex-shrink-0 text-gray-400" />
                <span>123 Đường Y Tế, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />
                <span>info@docmed.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Docmed HealthCare. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimplifiedFooter;