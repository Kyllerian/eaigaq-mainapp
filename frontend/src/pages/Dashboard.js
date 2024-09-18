// src/pages/Dashboard.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';  // Подключаем файл стилей для Dashboard
import Header from '../components/Header'; // Импортируем компонент Header

const Dashboard = () => {
  const [cases, setCases] = useState([]); // Хранение списка дел
  const [newCase, setNewCase] = useState({ name: "", description: "" }); // Данные для нового дела
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Получение списка дел пользователя при загрузке страницы
  useEffect(() => {
    axios
      .get("/api/cases/")
      .then((response) => {
        setCases(response.data); // Установка полученных дел в состояние
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Если пользователь не аутентифицирован, перенаправляем на страницу входа
          navigate("/login");
        } else {
          setError("Ошибка при загрузке дел.");
        }
      });
  }, [navigate]);

  // Получение CSRF-токена
  const getCSRFToken = () => {
    let csrfToken = null;
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      if (cookie.trim().startsWith("csrftoken=")) {
        csrfToken = cookie.split("=")[1];
      }
    });

    return csrfToken;
  };

  // Обработчик изменения значений полей ввода для нового дела
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCase({ ...newCase, [name]: value });
  };

  // Обработчик отправки формы для добавления нового дела
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Получение CSRF-токена
    const csrfToken = getCSRFToken();

    axios
      .post("/api/cases/", newCase, {
        headers: {
          "X-CSRFToken": csrfToken, // Добавление CSRF-токена в заголовки
        },
      })
      .then((response) => {
        setCases([...cases, response.data]); // Добавляем новое дело в список
        setNewCase({ name: "", description: "" }); // Сбрасываем форму
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError("Доступ запрещен. Проверьте CSRF-токен.");
        } else {
          setError("Ошибка при создании дела.");
        }
      });
  };

  return (
    <div className="dashboard-container">
      <Header /> {/* Добавляем шапку */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Мои дела</h1>

        {error && <p className="error-message">{error}</p>}

        <ul className="cases-list">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="case-item">
              <h2>{caseItem.name}</h2>
              <p>{caseItem.description}</p>
            </li>
          ))}
        </ul>

        <h2 className="form-title">Добавить новое дело</h2>
        <form onSubmit={handleFormSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Название дела:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCase.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Введите название"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание дела:</label>
            <textarea
              id="description"
              name="description"
              value={newCase.description}
              onChange={handleInputChange}
              required
              className="form-textarea"
              placeholder="Введите описание"
            ></textarea>
          </div>
          <button type="submit" className="form-button">Создать</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
