import React from 'react';
import './AuthErrorModal.css';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate

const AuthErrorModal = ({ isOpen }) => {
  const navigate = useNavigate(); // Инициализируем useNavigate

  if (!isOpen) return null;

  return (
    <div className="auth-error-modal-overlay">
      <div className="auth-error-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Authorization Error</h2>
        <p>You need to log in or register to access this page.</p>
        <div className="auth-error-buttons">
          <button className="auth-error-button auth-error-register" onClick={() => navigate('/register')}>
            Register
          </button>
          <button className="auth-error-button auth-error-login" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorModal;