import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const [language, setLanguage] = useState('EN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate(); // Для навигации
  const { t, i18n } = useTranslation();

  const handleDarkModeClick = () => {
    toggleDarkMode();
  };


  const toggleLanguageMenu = () => {
    setShowLanguageMenu(prev => !prev);
    setShowProfileMenu(false); // закрыть профиль при открытии языков
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
    setShowLanguageMenu(false); // закрыть языки при открытии профиля
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setShowLanguageMenu(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/home');
  };

  return (
    <nav>
      <NavLink to="/home" className="nav-logo">
        <strong>TrueWork</strong> <span>AI</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/home">{t('home')}</NavLink>
        <NavLink to="/trainmodelpage">{t('trainModel')}</NavLink>
        <NavLink to="/about">{t('aboutUs')}</NavLink>
      </div>

      <div className="nav-icons-wrapper">
        <div className="nav-icons">

          {/* Переключение тёмной темы */}
          <span onClick={handleDarkModeClick} title="Toggle Dark Mode" style={{ cursor: 'pointer', marginRight: '15px' }}>
            {isDarkMode ? '☀️' : '🌙'}
          </span>

          {/* Выбор языка */}
          <div style={{ position: 'relative', display: 'inline-block', marginRight: '15px' }}>
            <span onClick={toggleLanguageMenu} style={{ cursor: 'pointer' }}>
              🌐 {language}
            </span>
            {showLanguageMenu && (
              <div className="dropdown-menu">
                <div onClick={() => selectLanguage('EN')}>English</div>
                <div onClick={() => selectLanguage('RU')}>Русский</div>
                <div onClick={() => selectLanguage('KZ')}>Қазақша</div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span onClick={toggleProfileMenu} style={{ cursor: 'pointer' }}>
              👤
            </span>
            {showProfileMenu && (
              <div className="dropdown-menu">
                <div>
                  <NavLink to="/userpage" className="profile-link">View Profile</NavLink>
                </div>
                <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
