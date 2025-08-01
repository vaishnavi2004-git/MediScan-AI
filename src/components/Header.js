import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleServicesClick = (e) => {
    e.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">🩺</span>
            <span className="logo-text">Health Analyzer</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link 
              to="/analyze" 
              className={location.pathname === '/analyze' ? 'active' : ''}
            >
              Analyze
            </Link>
            <Link 
              to="/reports" 
              className={location.pathname === '/reports' ? 'active' : ''}
            >
              Reports
            </Link>
            <a href="#services" className={`header-link ${location.pathname === '/services' ? 'active' : ''}`} onClick={handleServicesClick}>
              Services
            </a>
            <Link 
              to="/chatbot" 
              className={location.pathname === '/chatbot' ? 'active' : ''}
            >
              Chatbot
            </Link>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
            >
              Contact Us
            </Link>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About Us
            </Link>
            <Link 
              to="/privacy" 
              className={location.pathname === '/privacy' ? 'active' : ''}
            >
              Privacy
            </Link>
          </div>

          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="profile-link">
                  <FaUser className="icon" />
                  <span>Profile</span>
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt className="icon" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">
                  Login
                </Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
