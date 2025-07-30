import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaFacebook, FaGooglePlus, FaPhone, FaUser } from 'react-icons/fa';
import Logo from '../assets/img/logo.png';
import '../assets/css/Header.css';
import '../assets/css/style.css';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // ✅ FIX: dùng để điều hướng
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, [location]);

  // Kiểm tra xem route hiện tại có active không
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleGoToProfile = () => {
    navigate('/my-profile'); // ✅ chuyển hướng nội bộ
  };

  return (
    <header className="header-area">
      {/* Top Header Area */}
      <div className="header-top py-4">
        <div className="container mx-auto px-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="social-media flex justify-center md:justify-start mb-2 md:mb-0">
              <a href="#" className="social-icon"><FaLinkedin /></a>
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaGooglePlus /></a>
            </div>
            <div className="contact-info flex flex-col sm:flex-row justify-center md:justify-end items-center">
              {currentUser ? (
                <button
                  className="contact-item flex items-center space-x-2"
                  onClick={handleGoToProfile}
                >
                  <span className="icon"><FaUser /></span>
                  <span>{currentUser.name || currentUser.email}</span>
                </button>
              ) : (
                <Link to="/login" className="contact-item">
                  <span className="icon"><FaUser /></span>
                  Đăng nhập / Đăng ký
                </Link>
              )}
              <a href="facetime-audio://+84773620465" className="contact-item">
                <span className="icon"><FaPhone /></span>
                Gọi ngay: +8477362046x
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className={`main-header ${isSticky ? 'sticky' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="main-nav hidden lg:block">
              <ul>
                <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Trang chủ</Link></li>
                <li><Link to="/ai" className={`nav-link ${isActive('/ai') ? 'active' : ''}`}>Tư vấn AI</Link></li>
                <li><Link to="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}>Bác sĩ</Link></li>
                <li><Link to="/branches" className={`nav-link ${isActive('/branches') ? 'active' : ''}`}>Chi nhánh</Link></li>
                <li><Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>Giới thiệu</Link></li>
                <li><Link to="/new" className={`nav-link ${isActive('/new') ? 'active' : ''}`}>Tin tức</Link></li>
                <li><Link to="/booking" className="book-btn">Đặt lịch khám</Link></li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <div className="mobile-menu-btn lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="hamburger">
                <span className={`line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`line ${mobileMenuOpen ? 'open' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link></li>
              <li><Link to="/ai" onClick={() => setMobileMenuOpen(false)}>Tư vấn AI</Link></li>
              <li><Link to="/doctors" onClick={() => setMobileMenuOpen(false)}>Bác sĩ</Link></li>
              <li><Link to="/branches" onClick={() => setMobileMenuOpen(false)}>Chi nhánh</Link></li>
              <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</Link></li>
              <li><Link to="/new" onClick={() => setMobileMenuOpen(false)}>Liên hệ</Link></li>
              <li className="mobile-appointment">
                <Link to="/booking" className="mobile-book-btn" onClick={() => setMobileMenuOpen(false)}>Đặt lịch khám</Link>
              </li>
              {!currentUser && (
                <li>
                  <Link
                    to="/login"
                    className="mobile-login-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
