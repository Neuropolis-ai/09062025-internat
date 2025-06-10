'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация полей
    if (!email || !password || !confirmPassword) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    if (email === 'admin@lyceum.ru' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Неверные данные для входа');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen admin-container flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Вход в личный кабинет
            </h2>
            <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--primary-burgundy)' }}>
              Лицей-интернат "Подмосковный"
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="admin-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input appearance-none block w-full placeholder-gray-400 focus:outline-none sm:text-sm"
                    placeholder="admin@lyceum.ru"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input appearance-none block w-full placeholder-gray-400 focus:outline-none sm:text-sm"
                    placeholder="Введите пароль"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Повторно пароль
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="admin-input appearance-none block w-full placeholder-gray-400 focus:outline-none sm:text-sm"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="admin-button-primary w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ 
                    backgroundColor: 'var(--primary-burgundy)'
                  }}
                >
                  Войти
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm admin-text-secondary">
              <p>Тестовые данные:</p>
              <p style={{ color: 'var(--primary-burgundy)' }}>Email: admin@lyceum.ru</p>
              <p style={{ color: 'var(--primary-burgundy)' }}>Пароль: admin123</p>
              <p style={{ color: 'var(--primary-burgundy)' }}>Повторно пароль: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="admin-card shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                {/* Кнопка меню для мобильных устройств */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 mr-4"
                >
                  <span className="text-xl">☰</span>
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">Админ-портал</h1>
                  <p className="text-white/90 font-medium">Лицей-интернат "Подмосковный"</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsLoggedIn(false)}
                className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                Выйти
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="admin-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Ученики</dt>
                        <dd className="text-lg font-medium text-gray-900">247</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">👨‍🏫</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Учителя</dt>
                        <dd className="text-lg font-medium text-gray-900">28</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Новости</dt>
                        <dd className="text-lg font-medium text-gray-900">12</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Средний балл</dt>
                        <dd className="text-lg font-medium text-gray-900">4.2</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">📊</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Дашборд</h3>
                      <p className="text-sm admin-text-secondary">Общая статистика и аналитика</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">👥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Ученики</h3>
                      <p className="text-sm admin-text-secondary">Управление учениками и классами</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">👨‍🏫</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Учителя</h3>
                      <p className="text-sm admin-text-secondary">Управление преподавательским составом</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">📰</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Новости</h3>
                      <p className="text-sm admin-text-secondary">Создание и редактирование новостей</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">📅</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Мероприятия</h3>
                      <p className="text-sm admin-text-secondary">Календарь событий и мероприятий</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white text-xl">📝</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Оценки</h3>
                      <p className="text-sm admin-text-secondary">Журнал оценок и успеваемость</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 