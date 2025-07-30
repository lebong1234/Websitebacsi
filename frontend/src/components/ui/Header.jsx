import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaFacebook, FaGooglePlus, FaPhone, FaUser } from 'react-icons/fa';
import Logo from '../../assets/img/logo.png';
import '../../assets/css/Header.css';
import '../../assets/css/style.css';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) setCurrentUser(JSON.parse(user));
  }, [location]);

  // Kiểm tra xem route hiện tại có active không
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header-area">
      {/* Top Header Area */}
      <div className="header-top py-4">
        <div className="container mx-auto px-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="social-media flex justify-center md:justify-start mb-2 md:mb-0">
              <a href="#" className="social-icon">
                <FaLinkedin />
              </a>
              <a href="#" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon">
                <FaGooglePlus />
              </a>
            </div>

            <div className="contact-info flex flex-col sm:flex-row justify-center md:justify-end items-center">
              {currentUser ? (
                <button className="contact-item flex items-center space-x-2" onClick={() => navigate('/my-profile')}>
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
                <li>
                  <Link
                    to="/"
                    className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai"
                    className={`nav-link ${isActive('/ai') ? 'active' : ''}`}
                  >
                    Tư vấn AI
                  </Link>
                </li>
                <li>
                  <Link
                    to=""
                    className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
                  >
                    Bác sĩ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/branches"
                    className={`nav-link ${isActive('/branches') ? 'active' : ''}`}
                  >
                    Chi nhánh
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  >
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new"
                    className={`nav-link ${isActive('/new') ? 'active' : ''}`}
                  >
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking"
                    className="book-btn"
                  >
                    Đặt lịch khám
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;