// src/axiosConfig.js

import axios from 'axios';
import { getCSRFToken } from './csrf';

// Создаём экземпляр Axios с базовым URL и настройками
const instance = axios.create({
  baseURL: 'http://localhost:8000', // Замените на URL вашего бэкенда
  withCredentials: true, // Включить передачу куки
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Добавляем интерцептор для включения CSRF-токена в заголовки запросов
instance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
