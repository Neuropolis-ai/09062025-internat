'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import NotificationModal from '../../components/NotificationModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetDetails?: string;
  isActive: boolean;
  isImportant: boolean;
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
  readCount: number;
  totalRecipients: number;
}

interface NotificationFormData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetDetails?: string;
  isImportant: boolean;
  expiresAt?: string;
}

// Тестовые данные уведомлений
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Изменение расписания',
    message: 'Уважаемые ученики! В связи с ремонтными работами занятия в кабинете 205 переносятся в кабинет 301.',
    type: 'warning',
    target: 'students',
    isActive: true,
    isImportant: true,
    createdAt: '2024-01-20 09:00',
    expiresAt: '2024-01-25 18:00',
    createdBy: 'Иванова Е.П.',
    readCount: 156,
    totalRecipients: 247
  },
  {
    id: '2',
    title: 'Новая система L-Coin',
    message: 'Информируем о запуске новой системы школьной валюты. Все ученики получили стартовый баланс 100 L-Coin.',
    type: 'success',
    target: 'all',
    isActive: true,
    isImportant: false,
    createdAt: '2024-01-18 14:30',
    createdBy: 'Администрация',
    readCount: 402,
    totalRecipients: 520
  },
  {
    id: '3',
    title: 'Техническое обслуживание',
    message: 'В ночь с 22 на 23 января будет проводиться техническое обслуживание системы. Возможны кратковременные перебои в работе.',
    type: 'info',
    target: 'all',
    isActive: true,
    isImportant: false,
    createdAt: '2024-01-19 16:45',
    expiresAt: '2024-01-23 08:00',
    createdBy: 'IT-отдел',
    readCount: 298,
    totalRecipients: 520
  },
  {
    id: '4',
    title: 'Родительское собрание 10А',
    message: 'Уважаемые родители учеников 10А класса! Приглашаем вас на родительское собрание 25 января в 18:00.',
    type: 'info',
    target: 'specific',
    targetDetails: 'Родители 10А класса',
    isActive: true,
    isImportant: true,
    createdAt: '2024-01-17 12:20',
    expiresAt: '2024-01-25 20:00',
    createdBy: 'Петрова М.А.',
    readCount: 18,
    totalRecipients: 25
  },
  {
    id: '5',
    title: 'Отмена кружка робототехники',
    message: 'Занятие кружка робототехники на 21 января отменяется по причине болезни преподавателя.',
    type: 'error',
    target: 'specific',
    targetDetails: 'Участники кружка робототехники',
    isActive: false,
    isImportant: false,
    createdAt: '2024-01-20 15:30',
    expiresAt: '2024-01-21 18:00',
    createdBy: 'Смирнов А.В.',
    readCount: 12,
    totalRecipients: 15
  }
];

const typeFilters = ["Все", "Информация", "Предупреждение", "Успех", "Ошибка"];
const targetFilters = ["Все", "Все пользователи", "Ученики", "Учителя", "Родители", "Выборочно"];
const statusFilters = ["Все", "Активные", "Неактивные", "Важные"];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedTarget, setSelectedTarget] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  // Статистика
  const totalNotifications = mockNotifications.length;
  const activeNotifications = mockNotifications.filter(n => n.isActive).length;
  const importantNotifications = mockNotifications.filter(n => n.isImportant).length;
  const totalReads = mockNotifications.reduce((sum, n) => sum + n.readCount, 0);

  // Фильтрация уведомлений
  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Все" ||
      (selectedType === "Информация" && notification.type === "info") ||
      (selectedType === "Предупреждение" && notification.type === "warning") ||
      (selectedType === "Успех" && notification.type === "success") ||
      (selectedType === "Ошибка" && notification.type === "error");
    const matchesTarget = selectedTarget === "Все" ||
      (selectedTarget === "Все пользователи" && notification.target === "all") ||
      (selectedTarget === "Ученики" && notification.target === "students") ||
      (selectedTarget === "Учителя" && notification.target === "teachers") ||
      (selectedTarget === "Родители" && notification.target === "parents") ||
      (selectedTarget === "Выборочно" && notification.target === "specific");
    const matchesStatus = selectedStatus === "Все" ||
      (selectedStatus === "Активные" && notification.isActive) ||
      (selectedStatus === "Неактивные" && !notification.isActive) ||
      (selectedStatus === "Важные" && notification.isImportant);
    return matchesSearch && matchesType && matchesTarget && matchesStatus;
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'info': return 'Информация';
      case 'warning': return 'Предупреждение';
      case 'success': return 'Успех';
      case 'error': return 'Ошибка';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetText = (target: string, targetDetails?: string) => {
    switch (target) {
      case 'all': return 'Все пользователи';
      case 'students': return 'Ученики';
      case 'teachers': return 'Учителя';
      case 'parents': return 'Родители';
      case 'specific': return targetDetails || 'Выборочно';
      default: return target;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('ru-RU');
  };

  const getReadPercentage = (readCount: number, totalRecipients: number) => {
    return Math.round((readCount / totalRecipients) * 100);
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationModalOpen(true);
  };

  const handleDeleteNotification = (notification: Notification) => {
    if (confirm(`Вы уверены, что хотите удалить уведомление "${notification.title}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление уведомления:', notification);
      alert(`Уведомление "${notification.title}" удалено`);
    }
  };

  const handleToggleActive = (notification: Notification) => {
    // TODO: API-запрос на изменение статуса
    console.log('Изменение статуса уведомления:', notification);
    alert(`Статус уведомления "${notification.title}" изменен`);
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setNotificationModalOpen(true);
  };

  const handleSaveNotification = (notificationData: NotificationFormData) => {
    if (editingNotification) {
      // TODO: API-запрос на обновление уведомления
      console.log('Обновление уведомления:', { ...editingNotification, ...notificationData });
      alert(`Уведомление "${notificationData.title}" обновлено!`);
    } else {
      // TODO: API-запрос на создание уведомления
      console.log('Создание уведомления:', notificationData);
      alert(`Уведомление "${notificationData.title}" создано!`);
    }
  };

  const handleCloseModal = () => {
    setNotificationModalOpen(false);
    setEditingNotification(null);
  };

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="flex items-center">
                {/* Кнопка меню для мобильных устройств */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 mr-4"
                >
                  <span className="text-xl">☰</span>
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">Уведомления</h1>
                  <p className="text-white/90 font-medium">Управление системными уведомлениями</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddNotification}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Создать уведомление
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📢</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего уведомлений</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalNotifications}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">🟢</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Активных</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeNotifications}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">⭐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Важных</dt>
                        <dd className="text-lg font-medium text-gray-900">{importantNotifications}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">👁️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего прочтений</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalReads}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск уведомлений
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по заголовку или тексту..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Тип
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {typeFilters.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Адресат
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedTarget}
                      onChange={(e) => setSelectedTarget(e.target.value)}
                    >
                      {targetFilters.map(target => (
                        <option key={target} value={target}>{target}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Статус
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusFilters.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список уведомлений
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Найдено: {filteredNotifications.length} из {totalNotifications} уведомлений
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddNotification}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">📢</span>
                      Создать уведомление
                    </button>
                  </div>
                </div>

                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">📢</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомлений не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или создайте новое уведомление.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border rounded-lg p-4 ${notification.isImportant ? 'border-red-300 bg-red-50' : ''}`}
                        style={{ borderColor: notification.isImportant ? '#fca5a5' : 'var(--divider)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-xl">{getTypeIcon(notification.type)}</span>
                              <h4 className="text-lg font-medium text-gray-900">
                                {notification.title}
                                {notification.isImportant && <span className="ml-2 text-red-600">⭐</span>}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {getTypeText(notification.type)}
                              </span>
                              {notification.isActive ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Активно
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Неактивно
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm admin-text-secondary mb-3 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm admin-text-secondary">
                              <div>
                                <span className="font-medium">Адресат:</span>
                                <div>{getTargetText(notification.target, notification.targetDetails)}</div>
                              </div>
                              <div>
                                <span className="font-medium">Прочитано:</span>
                                <div>{notification.readCount} из {notification.totalRecipients} ({getReadPercentage(notification.readCount, notification.totalRecipients)}%)</div>
                              </div>
                              <div>
                                <span className="font-medium">Создано:</span>
                                <div>{formatDateTime(notification.createdAt)}</div>
                              </div>
                              <div>
                                <span className="font-medium">Автор:</span>
                                <div>{notification.createdBy}</div>
                              </div>
                            </div>

                            {notification.expiresAt && (
                              <div className="mt-2 text-sm admin-text-secondary">
                                <span className="font-medium">Истекает:</span> {formatDateTime(notification.expiresAt)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleToggleActive(notification)}
                              className={`p-2 rounded ${
                                notification.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={notification.isActive ? 'Деактивировать' : 'Активировать'}
                            >
                              {notification.isActive ? '🔴' : '🟢'}
                            </button>
                            <button
                              onClick={() => handleEditNotification(notification)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notification)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Удалить"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно создания/редактирования уведомления */}
      <NotificationModal 
        isOpen={notificationModalOpen}
        onClose={handleCloseModal}
        notification={editingNotification}
        onSave={handleSaveNotification}
      />
    </div>
  );
} 