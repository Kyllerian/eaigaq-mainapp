// src/components/Header.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './Header.css'; // Подключение стилей для Header

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Проверка аутентификации пользователя при загрузке компонента
  useEffect(() => {
    axios.get('/api/check_auth/')
      .then(response => {
        if (response.data.is_authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Ошибка при проверке аутентификации:', error);
        setIsAuthenticated(false);
      });
  }, []);

  // Функция для выхода из системы
  const handleLogout = () => {
    axios.post('/api/logout/')
      .then(response => {
        console.log('Успешный выход:', response.data);
        setIsAuthenticated(false);
        navigate('/login');
      })
      .catch(error => {
        console.error('Ошибка при выходе:', error);
        alert('Не удалось выйти из системы. Попробуйте позже.');
      });
  };

  return (
    <header className="header">
      <h1 className="header-title">E-aigaq</h1>
      {isAuthenticated && (
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      )}
    </header>
  );
};

export default Header;
