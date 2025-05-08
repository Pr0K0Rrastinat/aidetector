import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false); // Начальное состояние - скрыто
  const [showClass, setShowClass] = useState('');

  useEffect(() => {
    // Показываем уведомление при монтировании
    setIsVisible(true);
    setShowClass('show');

    if (duration > 0) {
      const timer = setTimeout(() => {
        setShowClass(''); // Запускаем анимацию исчезновения
        setTimeout(() => {
          setIsVisible(false);
          if (onDismiss) {
            onDismiss();
          }
        }, 300); // Задержка, равная длительности анимации исчезновения
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setShowClass('');
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, 300); // Задержка на время анимации исчезновения
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#d4edda';
      case 'warning':
        return '#fff3cd';
      case 'error':
        return '#f8d7da';
      default:
        return '#e9ecef';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return '#155724';
      case 'warning':
        return '#85640c';
      case 'error':
        return '#721c24';
      default:
        return '#495057';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`notification-container ${showClass}`}
      style={{ backgroundColor: getBackgroundColor(), color: getTextColor() }}
    >
      <p className="notification-message">{message}</p>
      <button className="notification-dismiss-button" onClick={handleDismiss}>
        &times;
      </button>
    </div>
  );
};

export default Notification;