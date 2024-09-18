// src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './LoginPage.css';  // Подключение файла стилей
import Header from '../components/Header'; // Импортируем компонент Header

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Получение CSRF-токена при загрузке страницы
  useEffect(() => {
    axios.get('/api/get_csrf_token/')
      .then(() => {
        console.log('CSRF-токен установлен');
      })
      .catch((error) => {
        console.error('Ошибка при получении CSRF-токена:', error);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/login/',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Успешный вход:', response.data);
      // Перенаправление на страницу Dashboard после успешного входа
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        console.error('Ошибка аутентификации:', error.response.data);
        setError(error.response.data.detail || 'Ошибка аутентификации.');
      } else {
        console.error('Ошибка сети или сервера:', error);
        setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    }
  };

  return (
    <div className="login-page">
      <Header /> {/* Добавляем шапку */}
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Вход</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Введите имя пользователя"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Введите пароль"
              />
            </div>
            <button type="submit" className="login-button">Войти</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
